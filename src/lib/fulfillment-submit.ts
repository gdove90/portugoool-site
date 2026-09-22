import crypto from "crypto";
import {
  apliiqSubmitEnabled,
  findOrderByNumber,
  isSimulatedDestination,
  submissionEnvironmentAllowed,
  submitOrder,
  ApliiqOrderPayload,
  ApliiqShippingAddress,
} from "./apliiq";
import { OrdersStore, OrderRow, OrderItemRow } from "./orders-store";

// ─────────────────────────────────────────────────────────────
// Paid order → Apliiq submission, with the invariants that matter:
//   · only confirmed-paid, LIVE-mode orders in the production context
//     ever reach the real Apliiq API (submissionEnvironmentAllowed)
//   · fulfillment reads the PERSISTED purchase snapshot (order_items
//     rows written by the webhook from checkout-time metadata) — the
//     current catalog is never consulted
//   · a compare-and-set lock (pending_submission → submitting) makes
//     concurrent webhook deliveries race safely: exactly one submits
//   · timeouts/5xx park the order in needs_reconcile — a retry is only
//     allowed after reconciliation proves Apliiq did NOT record it
//   · orders stranded in `submitting` by a crash have the same
//     reconcile-first recovery path (never a blind resubmit)
//   · 202 "received but not processed" is pending, never fulfilled
// ─────────────────────────────────────────────────────────────

/**
 * Deterministic numeric ids Apliiq requires. 12 hex chars = 48 bits,
 * comfortably inside Number.MAX_SAFE_INTEGER (2^53 − 1); asserted
 * anyway so a future edit cannot silently break it.
 */
function safeNumericFromHex(hex12: string): number {
  const n = parseInt(hex12, 16);
  if (!Number.isSafeInteger(n)) {
    throw new Error(`Derived identifier ${hex12} is not a safe integer.`);
  }
  return n;
}

/** Stable per-order numeric id (first 48 bits of the order UUID). */
export function numericOrderId(orderId: string): number {
  return safeNumericFromHex(orderId.replace(/-/g, "").slice(0, 12));
}

/**
 * Stable per-line numeric id: 48 bits of SHA-256 over "orderId:index".
 * Collision-resistant across orders and always a safe integer — never
 * arithmetic on the order id, which could overflow 2^53.
 */
export function numericLineId(orderId: string, index: number): number {
  const digest = crypto.createHash("sha256").update(`${orderId}:${index}`).digest("hex");
  return safeNumericFromHex(digest.slice(0, 12));
}

/** Customer-facing / reconciliation order number, stable per order. */
export function orderNumber(orderId: string): string {
  return `GOOOL-${orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function buildApliiqPayload(
  order: OrderRow & { id: string },
  items: OrderItemRow[]
): ApliiqOrderPayload | { error: string } {
  if (items.length === 0) return { error: "Order has no persisted line items." };
  const addr = order.shipping_address as Record<string, string> | null;
  if (!addr || !addr.line1 || !addr.city || !addr.postal_code || !addr.country) {
    return { error: "Order has no complete shipping address." };
  }
  const fullName = (order.shipping_name ?? "").trim();
  const firstName = fullName.split(/\s+/)[0] || "GOOOL";
  const lastName = fullName.split(/\s+/).slice(1).join(" ") || "Customer";

  const shipping: ApliiqShippingAddress = {
    first_name: firstName,
    last_name: lastName,
    address1: addr.line1,
    address2: addr.line2 || undefined,
    city: addr.city,
    zip: addr.postal_code,
    province: addr.state || "",
    province_code: addr.country === "US" ? addr.state || undefined : undefined,
    country: addr.country,
    country_code: addr.country,
  };

  const lineItems = [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (!it.apliiq_sku) {
      return {
        error: `Line ${i + 1} has no Apliiq SKU snapshot (${it.product_id} / ${it.color} / ${it.size}).`,
      };
    }
    lineItems.push({
      id: numericLineId(order.id, i),
      name: `${it.color} / ${it.size}`,
      quantity: it.quantity,
      price: it.unit_price_cents / 100,
      sku: it.apliiq_sku,
    });
  }

  return {
    id: numericOrderId(order.id),
    number: numericOrderId(order.id),
    name: orderNumber(order.id),
    order_number: orderNumber(order.id),
    line_items: lineItems,
    shipping_address: shipping,
    shipping_lines: [{ code: "standard" }],
  };
}

export interface SubmitOutcome {
  action:
    | "submitted_accepted"
    | "submitted_pending"
    | "left_pending_disabled"
    | "left_pending_environment"
    | "lock_not_acquired"
    | "stale_result_discarded"
    | "failed"
    | "needs_reconcile"
    | "not_eligible";
  detail?: string;
}

/**
 * Attempt to submit one paid order to Apliiq. Reads the persisted
 * snapshot from the store. Safe to call repeatedly and concurrently;
 * every unsafe path is guarded.
 */
export async function submitPaidOrder(
  store: OrdersStore,
  orderId: string,
  opts: { livemode: boolean }
): Promise<SubmitOutcome> {
  const order = await store.getOrderById(orderId);
  if (!order || order.status !== "paid") {
    return { action: "not_eligible", detail: "Order missing or not paid." };
  }
  if (order.submission_status !== "pending_submission") {
    return { action: "not_eligible", detail: `submission_status=${order.submission_status}` };
  }
  if (!apliiqSubmitEnabled()) {
    // Deliberate release gate: order stays queued and visible.
    return { action: "left_pending_disabled", detail: "APLIIQ_SUBMIT_ENABLED is not 'true'." };
  }
  const env = submissionEnvironmentAllowed(opts.livemode);
  if (!env.allowed) {
    return { action: "left_pending_environment", detail: env.reason };
  }

  const items = await store.listOrderItems(orderId);
  const payload = buildApliiqPayload(order, items);
  if ("error" in payload) {
    await store.transitionSubmission(orderId, "pending_submission", "failed", {
      submission_last_error: payload.error,
    });
    return { action: "failed", detail: payload.error };
  }

  // The lock: only one caller wins this transition. The attempt id +
  // start time identify THIS in-flight request: result writes are
  // guarded on the attempt id (a stale response can never overwrite a
  // newer attempt), and reconciliation refuses to touch an attempt
  // younger than the expiry window.
  const attemptId = crypto.randomUUID();
  const locked = await store.transitionSubmission(orderId, "pending_submission", "submitting", {
    submission_attempt_id: attemptId,
    submission_started_at: new Date().toISOString(),
  });
  if (!locked) return { action: "lock_not_acquired" };

  const result = await submitOrder(payload);
  switch (result.outcome) {
    case "accepted": {
      const won = await store.transitionSubmission(
        orderId,
        "submitting",
        "accepted",
        { apliiq_order_id: result.apliiqOrderId, submission_last_error: null },
        attemptId
      );
      if (!won) return { action: "stale_result_discarded", detail: "accepted (attempt superseded)" };
      await store.setFulfillmentStatus(orderId, "submitted");
      return { action: "submitted_accepted", detail: result.apliiqOrderId };
    }
    case "received_pending": {
      // Apliiq took the order but did not hand back an id we could
      // parse (202, or a 200 whose body was not JSON / had no top-level
      // `id`). Recording that as `submitted` with apliiq_order_id null
      // permanently orphaned the order: the shipment callback resolves
      // orders ONLY by apliiq_order_id, so a stored NULL can never
      // match, the tracking numbers were discarded, and `submitted` is
      // neither reconcilable nor releasable - no way back. Park it in
      // needs_reconcile instead, which is exactly what that state is
      // for: reconcileOrder looks the order up in Apliiq's listing by
      // our own order_number and backfills the id.
      const knownId = result.apliiqOrderId && result.apliiqOrderId.trim() !== "";
      const to = knownId ? "submitted" : "needs_reconcile";
      const won = await store.transitionSubmission(
        orderId,
        "submitting",
        to,
        {
          apliiq_order_id: knownId ? result.apliiqOrderId : null,
          submission_last_error: knownId
            ? result.message || null
            : `Apliiq accepted the order but returned no usable id; reconcile to recover it. Body: ${result.message ?? ""}`.slice(0, 500),
        },
        attemptId
      );
      if (!won) return { action: "stale_result_discarded", detail: "202 (attempt superseded)" };
      return knownId
        ? { action: "submitted_pending", detail: result.message }
        : { action: "needs_reconcile", detail: "accepted without a usable Apliiq order id" };
    }
    case "rejected": {
      const won = await store.transitionSubmission(
        orderId,
        "submitting",
        "failed",
        { submission_last_error: `HTTP ${result.status}: ${result.message}` },
        attemptId
      );
      if (!won) return { action: "stale_result_discarded", detail: "rejection (attempt superseded)" };
      return { action: "failed", detail: result.message };
    }
    case "unknown": {
      const won = await store.transitionSubmission(
        orderId,
        "submitting",
        "needs_reconcile",
        { submission_last_error: result.message },
        attemptId
      );
      if (!won) return { action: "stale_result_discarded", detail: "timeout (attempt superseded)" };
      return { action: "needs_reconcile", detail: result.message };
    }
  }
}

/**
 * How long a `submitting` attempt is considered possibly-active. Must
 * comfortably exceed the HTTP client timeout (the fetch is hard-aborted
 * at APLIIQ_TIMEOUT_MS, so past this window no request can still be in
 * flight from this codebase).
 */
export function submissionExpiryMs(): number {
  const clientTimeout = Number(process.env.APLIIQ_TIMEOUT_MS ?? 20000);
  const configured = Number(process.env.APLIIQ_SUBMIT_EXPIRY_MS ?? 15 * 60 * 1000);
  return Math.max(configured, clientTimeout * 3);
}

/**
 * Resolve an order stuck in needs_reconcile OR stranded in `submitting`
 * (crash between the lock and the result write): ask Apliiq whether our
 * order_number exists around the order's own dates. Found → record it
 * (no duplicate). Proven absent → release to pending_submission so a
 * retry becomes safe. Anything ambiguous stays parked.
 */
export async function reconcileOrder(
  store: OrdersStore,
  orderId: string
): Promise<{ resolved: boolean; detail: string }> {
  const order = await store.getOrderById(orderId);
  if (!order) return { resolved: false, detail: "Order not found." };
  const from = order.submission_status;
  if (from !== "needs_reconcile" && from !== "submitting") {
    return { resolved: false, detail: `Order is ${from}; nothing to reconcile.` };
  }

  // An attempt younger than the expiry window may still be in flight
  // (its HTTP request is hard-aborted at the client timeout, and the
  // expiry is enforced to exceed that) — touching it could race the
  // live request. Refuse.
  if (from === "submitting") {
    const startedAt = order.submission_started_at
      ? new Date(order.submission_started_at).getTime()
      : 0;
    const age = Date.now() - startedAt;
    if (startedAt > 0 && age < submissionExpiryMs()) {
      return {
        resolved: false,
        detail: `Submission attempt is ${Math.round(age / 1000)}s old and may still be active (expiry ${Math.round(submissionExpiryMs() / 1000)}s); refusing to reconcile a live attempt.`,
      };
    }
  }

  const referenceDates = [order.paid_at ? new Date(order.paid_at) : new Date()];
  const lookup = await findOrderByNumber(orderNumber(orderId), referenceDates);
  if (lookup === null) {
    // Ambiguity: an expired `submitting` order at least demotes to
    // needs_reconcile so its dead attempt no longer looks live.
    if (from === "submitting") {
      await store.transitionSubmission(orderId, "submitting", "needs_reconcile", {
        submission_last_error: "Attempt expired; Apliiq listing unavailable or unrecognizable.",
      });
    }
    return {
      resolved: false,
      detail:
        "Apliiq's order listing was unavailable, unrecognizable, or possibly incomplete; order stays parked (no retry authorized).",
    };
  }
  if (lookup.found) {
    const moved = await store.transitionSubmission(orderId, from, "submitted", {
      apliiq_order_id: lookup.apliiqOrderId ?? null,
      submission_last_error: null,
    });
    return {
      resolved: moved,
      detail: moved
        ? "Apliiq already has this order; recorded, no resubmission."
        : "State changed concurrently; re-inspect the order.",
    };
  }

  // NOT FOUND. Against the real Apliiq API, absence from the month
  // listing is not proof the order was never accepted (processing
  // delays, pagination, undocumented lookup semantics) — so absence
  // NEVER auto-authorizes another real submission. A human verifies in
  // the Apliiq dashboard and uses the ops "release" action. Loopback
  // simulators may opt in for tests via APLIIQ_TRUST_LIST_ABSENCE.
  const trustAbsence =
    isSimulatedDestination() && process.env.APLIIQ_TRUST_LIST_ABSENCE === "true";
  if (!trustAbsence) {
    if (from === "submitting") {
      await store.transitionSubmission(orderId, "submitting", "needs_reconcile", {
        submission_last_error:
          "Attempt expired; not in Apliiq's listing, but absence is not authoritative. Verify in the Apliiq dashboard, then use the ops release action.",
      });
    }
    return {
      resolved: false,
      detail:
        "Order is absent from Apliiq's listing, but absence is not authoritative (processing delay/pagination possible). Verify manually in the Apliiq dashboard, then POST action=release to authorize one retry.",
    };
  }
  const moved = await store.transitionSubmission(orderId, from, "pending_submission", {
    submission_last_error: null,
  });
  return {
    resolved: moved,
    detail: moved
      ? "Simulator confirmed no record; order released for a safe retry."
      : "State changed concurrently; re-inspect the order.",
  };
}

/**
 * Operator-authorized release. AUTHORIZATION BAR (read before using):
 * our client aborting a request only stops US waiting — Apliiq may
 * still have received and may still be processing the original order.
 * An empty dashboard or empty list is NOT sufficient evidence. Release
 * only after AFFIRMATIVE verification that the original submission was
 * not accepted and is not still processing: enough time elapsed for
 * supplier-side processing, the dashboard checked for the order number
 * across ALL states (including unprocessed/held orders), and, if any
 * ambiguity remains, Apliiq support has confirmed in writing that no
 * order exists for this order_number. Then this moves the parked order
 * back to pending_submission so exactly one retry can run.
 */
export async function releaseOrder(
  store: OrdersStore,
  orderId: string
): Promise<{ resolved: boolean; detail: string }> {
  const order = await store.getOrderById(orderId);
  if (!order) return { resolved: false, detail: "Order not found." };
  if (order.submission_status !== "needs_reconcile") {
    return {
      resolved: false,
      detail: `Order is ${order.submission_status}; only needs_reconcile orders can be released (run reconcile first).`,
    };
  }
  const moved = await store.transitionSubmission(orderId, "needs_reconcile", "pending_submission", {
    submission_last_error: null,
  });
  return {
    resolved: moved,
    detail: moved
      ? "Released for one retry on operator authority."
      : "State changed concurrently; re-inspect the order.",
  };
}

/**
 * Re-queue an order that Apliiq REJECTED, or that never reached Apliiq
 * because its payload could not be built.
 *
 * `failed` used to be a terminal state with no way out. submitPaidOrder
 * accepts only `pending_submission`, reconcileOrder only
 * needs_reconcile/`submitting`, releaseOrder only needs_reconcile - so
 * a paid order knocked into `failed` by one transient HTTP 429, 408 or
 * a briefly-rotated 401 was unfulfillable forever and the documented
 * runbook (designs/11_fulfillment/apliiq-product-mapping.md) told the
 * operator to "release" it, which always refused. The money was
 * captured and only a hand-written UPDATE could free it.
 *
 * Retrying `failed` cannot duplicate an order. Every path into it means
 * Apliiq definitely did not take the order:
 *   - buildApliiqPayload error   -> no HTTP request was ever made
 *   - outcome "rejected"         -> a <500 non-2xx, i.e. Apliiq refused
 *   - unmapped variant at intake -> written before Apliiq is contacted
 * The genuinely ambiguous outcomes (network abort, >=500) go to
 * needs_reconcile instead, and that path still requires reconcile
 * first. So this is safe in a way that releasing needs_reconcile is
 * deliberately not.
 *
 * It does NOT fix the cause. If the rejection was a bad address or a
 * missing SKU snapshot, correct that first - the retry will just fail
 * again, which is the correct and visible outcome.
 */
export async function retrySubmission(
  store: OrdersStore,
  orderId: string
): Promise<{ resolved: boolean; detail: string }> {
  const order = await store.getOrderById(orderId);
  if (!order) return { resolved: false, detail: "Order not found." };
  if (order.status !== "paid") {
    return {
      resolved: false,
      detail: `Order status is ${order.status}; only a paid order may be re-queued.`,
    };
  }
  if (order.submission_status !== "failed") {
    return {
      resolved: false,
      detail: `Order is ${order.submission_status}; retry only re-queues a failed order (use reconcile for needs_reconcile/submitting).`,
    };
  }
  const moved = await store.transitionSubmission(orderId, "failed", "pending_submission", {
    submission_last_error: null,
    submission_attempt_id: null,
    submission_started_at: null,
  });
  return {
    resolved: moved,
    detail: moved
      ? `Re-queued for submission. Previous failure: ${order.submission_last_error ?? "(none recorded)"}`
      : "State changed concurrently; re-inspect the order.",
  };
}
