import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "./supabase";
import { emailEnabled, EmailMessage, sendEmail } from "./email";
import { OrdersStore, OrderRow, ShipmentRow } from "./orders-store";
import { hasShipped, shipmentIdentity } from "./shipment";
import { buildShipmentNotification } from "./emails/shipment-notification";
import { buildOrderConfirmation } from "./emails/order-confirmation";
import { buildFulfillmentAlert, OWNER_ALERT_TO } from "./emails/fulfillment-alert";
import { buildOrderDelayNotice } from "./emails/order-delay-notice";

interface Delivery {
  key: string; kind: "order" | "discount"; order_id: string | null;
  livemode: boolean; message: EmailMessage; status: string; attempts: number;
  first_attempt_at: string | null;
}
function database() {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Email delivery storage unavailable.");
  return db;
}
export async function queueEmail(key: string, kind: Delivery["kind"], message: EmailMessage,
  livemode: boolean, orderId: string | null = null): Promise<void> {
  const { error } = await database().from("email_deliveries").upsert(
    { key, kind, message, livemode, order_id: orderId }, { onConflict: "key", ignoreDuplicates: true });
  if (error) throw new Error("Could not persist email delivery.");
}
export async function deliverEmail(key: string): Promise<string> {
  if (!emailEnabled()) return "disabled";
  const db = database();
  const token = randomUUID();
  const { data, error } = await db.rpc("claim_email_delivery", { p_key: key, p_token: token });
  if (error) throw new Error("Email claim unavailable.");
  const row = (data as Delivery[] | null)?.[0];
  if (!row) return "already_sent_or_pending";
  const result = await sendEmail(row.message, row.key);
  const fields = result.sent
    ? { status: "sent", sent_at: new Date().toISOString(), provider_id: result.id,
        lease_until: null, last_error: null }
    : { status: "pending", lease_until: null, last_error: result.reason,
        next_attempt_at: new Date(Date.now() + Math.min(3600, 60 * 2 ** Math.min(row.attempts, 6)) * 1000).toISOString() };
  const { error: saveError } = await db.from("email_deliveries").update(fields)
    .eq("key", key).eq("claim_token", token);
  if (saveError) throw new Error("Email delivery result could not be persisted.");
  if (result.sent && row.order_id && /^order\/(live|test)\/[^/]+$/.test(row.key)) {
    const { error: orderError } = await db.from("orders")
      .update({ confirmation_sent_at: new Date().toISOString() }).eq("id", row.order_id);
    if (orderError) console.error("[email] order marker update failed; delivery ledger remains authoritative");
  }
  return result.sent ? "sent" : "queued";
}
export async function queueOrderConfirmation(store: OrdersStore, orderId: string): Promise<string> {
  const order = await store.getOrderById(orderId);
  if (!order || order.status !== "paid") return "not_paid";
  if (order.confirmation_sent_at) return "already_sent";
  if (!order.customer_email) throw new Error("Paid order has no receipt address.");
  const items = await store.listOrderItems(orderId);
  const key = `order/${order.livemode ? "live" : "test"}/${orderId}`;
  await queueEmail(key, "order", { to: order.customer_email, ...buildOrderConfirmation({ order, items }) }, order.livemode, orderId);
  // The worker owns sending. Webhooks only persist intent, so transient mail failures
  // never make payment/fulfillment processing repeat.
  return "queued";
}
// "order" is the existing transactional-order category; the key separates receipts
// from shipment notices. No new database kind or parallel sender is required.
export async function queueShipmentNotification(order: OrderRow & { id: string }, shipment: ShipmentRow): Promise<string> {
  if (!hasShipped(shipment)) return "not_shipped_or_no_tracking";
  if (order.status !== "paid") return "not_paid";
  if (order.fulfillment_status === "delivered") return "already_delivered";
  if (!order.customer_email) throw new Error("Order has no shipment email address.");
  const key = `shipment/${order.livemode ? "live" : "test"}/${order.id}/${shipmentIdentity(shipment)}`;
  await queueEmail(key, "order", { to: order.customer_email, ...buildShipmentNotification(order, shipment) }, order.livemode, order.id);
  return "queued";
}

// Owner alert for a paid order Apliiq did not accept. Keyed on the order
// AND the parked state so one failure produces exactly one email, while a
// later failure of a re-submitted order (a different state or a repeat
// after release) produces a fresh one. Queued through the same ledger as
// customer mail, then delivered immediately on a best-effort basis; the
// scheduled drain picks it up if that first attempt does not go through.
export async function queueFulfillmentAlert(
  store: OrdersStore,
  orderId: string,
  livemode: boolean,
  parkedAs: string,
  reason: string
): Promise<string> {
  const order = await store.getOrderById(orderId);
  if (!order || order.status !== "paid") return "not_paid";
  const items = await store.listOrderItems(orderId);
  const attempt = order.submission_attempt_id ?? "first";
  const key = `alert/${livemode ? "live" : "test"}/${orderId}/${parkedAs}/${attempt}`;
  await queueEmail(key, "order", { to: OWNER_ALERT_TO, ...buildFulfillmentAlert({ order, items, parkedAs, reason }) }, livemode, orderId);
  try {
    return await deliverEmail(key);
  } catch {
    return "queued";
  }
}

// Customer delay notice for the same event. Keyed on the order alone, so
// a customer hears about a delay once no matter how many times the order
// parks before it goes through; the owner alert carries the per-attempt
// detail. Replies go to hello@goool.shop, which is where the refund
// offer in the email is honoured.
export async function queueOrderDelayNotice(
  store: OrdersStore,
  orderId: string,
  livemode: boolean
): Promise<string> {
  const order = await store.getOrderById(orderId);
  if (!order || order.status !== "paid") return "not_paid";
  if (!order.customer_email) return "no_email";
  const key = `delay/${livemode ? "live" : "test"}/${orderId}`;
  await queueEmail(
    key,
    "order",
    { to: order.customer_email, replyTo: "hello@goool.shop", ...buildOrderDelayNotice(order) },
    livemode,
    orderId
  );
  try {
    return await deliverEmail(key);
  } catch {
    return "queued";
  }
}

export async function drainEmailQueue(livemode: boolean): Promise<Record<string, number>> {
  const db = database();
  if (!emailEnabled()) return { disabled: 1 };
  const cutoff = new Date(Date.now() - 23 * 3600000).toISOString();
  const { error: parkError } = await db.from("email_deliveries")
    .update({ status: "needs_review", last_error: "Retry window elapsed; reconcile provider before resending." })
    .eq("livemode", livemode).in("status", ["pending", "sending"]).lt("first_attempt_at", cutoff);
  if (parkError) throw new Error("Email retry-window check failed.");
  const { data, error } = await db.from("email_deliveries").select("key")
    .eq("livemode", livemode).in("status", ["pending", "sending"])
    .lte("next_attempt_at", new Date().toISOString()).order("next_attempt_at").limit(3);
  if (error) throw new Error("Email queue read failed.");
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const status = await deliverEmail(row.key);
    counts[status] = (counts[status] ?? 0) + 1;
  }
  return counts;
}
