import crypto from "crypto";
import {
  apliiqSubmitEnabled,
  findOrderByNumber,
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

  // The lock: only one caller wins this transition.
  const locked = await store.transitionSubmission(orderId, "pending_submission", "submitting");
  if (!locked) return { action: "lock_not_acquired" };

  const result = await submitOrder(payload);
  switch (result.outcome) {
    case "accepted":
      await store.transitionSubmission(orderId, "submitting", "accepted", {
        apliiq_order_id: result.apliiqOrderId,
        submission_last_error: null,
      });
      await store.setFulfillmentStatus(orderId, "submitted");
      return { action: "submitted_accepted", detail: result.apliiqOrderId };
    case "received_pending":
      await store.transitionSubmission(orderId, "submitting", "submitted", {
        apliiq_order_id: result.apliiqOrderId,
        submission_last_error: result.message || null,
      });
      return { action: "submitted_pending", detail: result.message };
    case "rejected":
      await store.transitionSubmission(orderId, "submitting", "failed", {
        submission_last_error: `HTTP ${result.status}: ${result.message}`,
      });
      return { action: "failed", detail: result.message };
    case "unknown":
      await store.transitionSubmission(orderId, "submitting", "needs_reconcile", {
        submission_last_error: result.message,
      });
      return { action: "needs_reconcile", detail: result.message };
  }
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

  const referenceDates = [order.paid_at ? new Date(order.paid_at) : new Date()];
  const lookup = await findOrderByNumber(orderNumber(orderId), referenceDates);
  if (lookup === null) {
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
  const moved = await store.transitionSubmission(orderId, from, "pending_submission", {
    submission_last_error: null,
  });
  return {
    resolved: moved,
    detail: moved
      ? "Apliiq confirmed no record; order released for a safe retry."
      : "State changed concurrently; re-inspect the order.",
  };
}
