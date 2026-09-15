import {
  apliiqSubmitEnabled,
  findOrderByNumber,
  submitOrder,
  ApliiqOrderPayload,
  ApliiqShippingAddress,
} from "./apliiq";
import { OrdersStore, OrderRow, OrderItemRow } from "./orders-store";

// ─────────────────────────────────────────────────────────────
// Paid order → Apliiq submission, with the invariants that matter:
//   · only confirmed-paid orders are ever submitted
//   · a compare-and-set lock (pending_submission → submitting) makes
//     concurrent webhook deliveries race safely: exactly one submits
//   · timeouts/5xx park the order in needs_reconcile — a retry is only
//     allowed after reconciliation proves Apliiq did NOT record it
//   · 202 "received but not processed" is pending, never fulfilled
// ─────────────────────────────────────────────────────────────

/** Deterministic numeric ids Apliiq requires, stable per order UUID. */
export function numericOrderId(orderId: string): number {
  const hex = orderId.replace(/-/g, "").slice(0, 12);
  return parseInt(hex, 16); // < 2^48, safe integer
}

/** Customer-facing / reconciliation order number, stable per order. */
export function orderNumber(orderId: string): string {
  return `GOOOL-${orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function buildApliiqPayload(
  order: OrderRow & { id: string },
  items: OrderItemRow[]
): ApliiqOrderPayload | { error: string } {
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
      return { error: `Line ${i + 1} has no Apliiq SKU mapping (${it.product_id} / ${it.color} / ${it.size}).` };
    }
    lineItems.push({
      id: numericOrderId(order.id) * 100 + i,
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
    | "lock_not_acquired"
    | "failed"
    | "needs_reconcile"
    | "not_eligible";
  detail?: string;
}

/**
 * Attempt to submit one paid order to Apliiq. Safe to call repeatedly
 * and concurrently; every unsafe path is guarded.
 */
export async function submitPaidOrder(
  store: OrdersStore,
  orderId: string,
  items: OrderItemRow[]
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
 * Resolve a needs_reconcile order: ask Apliiq whether our order_number
 * exists. Found → record it as submitted (no duplicate). Not found →
 * release back to pending_submission so a retry becomes safe.
 */
export async function reconcileOrder(
  store: OrdersStore,
  orderId: string
): Promise<{ resolved: boolean; detail: string }> {
  const order = await store.getOrderById(orderId);
  if (!order || order.submission_status !== "needs_reconcile") {
    return { resolved: false, detail: "Order is not awaiting reconciliation." };
  }
  const lookup = await findOrderByNumber(orderNumber(orderId));
  if (lookup === null) {
    return { resolved: false, detail: "Apliiq order listing unavailable; still needs_reconcile." };
  }
  if (lookup.found) {
    await store.transitionSubmission(orderId, "needs_reconcile", "submitted", {
      apliiq_order_id: lookup.apliiqOrderId ?? null,
      submission_last_error: null,
    });
    return { resolved: true, detail: "Apliiq already has this order; recorded, no resubmission." };
  }
  await store.transitionSubmission(orderId, "needs_reconcile", "pending_submission", {
    submission_last_error: null,
  });
  return { resolved: true, detail: "Apliiq has no record; order released for a safe retry." };
}
