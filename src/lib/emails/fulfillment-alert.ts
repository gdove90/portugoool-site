import { OrderItemRow, OrderRow } from "../orders-store";
import { orderNumberFor } from "./order-confirmation";
import { getProductById } from "../products";

// ─────────────────────────────────────────────────────────────
// Owner alert: sent to hello@goool.shop the moment a PAID order is not
// accepted by Apliiq (parked as failed or needs_reconcile). Until
// 2026-09-29 nothing told the owner; the first two real orders sat
// unfulfilled behind a declined supplier card and were only noticed
// through Apliiq's own email. This is internal mail, so it is plain
// and complete rather than designed: everything needed to act is in
// the body, including the customer's contact so a delay note can go
// out from hello@goool.shop.
// ─────────────────────────────────────────────────────────────

export const OWNER_ALERT_TO = "hello@goool.shop";

export interface FulfillmentAlertInput {
  order: OrderRow & { id: string };
  items: OrderItemRow[];
  /** submission_status the order was parked in. */
  parkedAs: string;
  /** Apliiq's response or our own reason, as recorded on the order. */
  reason: string;
}

function money(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function buildFulfillmentAlert({ order, items, parkedAs, reason }: FulfillmentAlertInput): {
  subject: string;
  html: string;
  text: string;
} {
  const ref = orderNumberFor(order.id);
  const mode = order.livemode ? "" : "[TEST] ";
  const subject = `${mode}Action needed: ${ref} was not accepted by Apliiq`;
  const lines = items.map((it) => {
    const name = getProductById(it.product_id)?.name ?? it.product_id;
    return `${it.quantity} x ${name} · ${it.color} / ${it.size}${it.apliiq_sku ? ` (SKU ${it.apliiq_sku})` : ""}`;
  });
  const paidAt = order.paid_at ? new Date(order.paid_at).toLocaleString("en-US", { timeZone: "America/New_York" }) : "-";

  const text = [
    `Order ${ref} is paid but Apliiq did not accept it.`,
    "",
    `Parked as: ${parkedAs}`,
    `Apliiq said: ${reason || "(no reason recorded)"}`,
    "",
    `Customer: ${order.shipping_name ?? "-"} <${order.customer_email ?? "-"}>`,
    `Paid: ${money(order.total_cents, order.currency)} at ${paidAt} ET`,
    `Items: ${lines.join("; ") || "-"}`,
    "",
    "What to do:",
    "1. Fix the cause (a declined card on Apliiq → pay methods is the usual one).",
    `2. Re-submit the order: tell Claude Code "resubmit order ${ref}", or run the release/submit`,
    "   actions on /api/fulfillment-ops (runbook: designs/11_fulfillment/apliiq-product-mapping.md).",
    "3. If it will be late, email the customer from hello@goool.shop.",
    "",
    "The customer has only received the payment receipt; they have not been told anything is wrong.",
  ].join("\n");

  const html = `<!doctype html><html><body style="margin:0;padding:24px;font:400 15px/1.6 Helvetica,Arial,sans-serif;color:#0A0A0A;">
<p style="margin:0 0 16px;font-size:18px;font-weight:700;">Order ${esc(ref)} is paid but Apliiq did not accept it.</p>
<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font:400 15px/1.6 Helvetica,Arial,sans-serif;">
<tr><td style="padding:4px 16px 4px 0;color:#666;">Parked as</td><td style="padding:4px 0;">${esc(parkedAs)}</td></tr>
<tr><td style="padding:4px 16px 4px 0;color:#666;vertical-align:top;">Apliiq said</td><td style="padding:4px 0;">${esc(reason || "(no reason recorded)")}</td></tr>
<tr><td style="padding:4px 16px 4px 0;color:#666;">Customer</td><td style="padding:4px 0;">${esc(order.shipping_name ?? "-")} &lt;${esc(order.customer_email ?? "-")}&gt;</td></tr>
<tr><td style="padding:4px 16px 4px 0;color:#666;">Paid</td><td style="padding:4px 0;">${esc(money(order.total_cents, order.currency))} at ${esc(paidAt)} ET</td></tr>
<tr><td style="padding:4px 16px 4px 0;color:#666;vertical-align:top;">Items</td><td style="padding:4px 0;">${lines.map(esc).join("<br>") || "-"}</td></tr>
</table>
<p style="margin:20px 0 6px;font-weight:700;">What to do</p>
<ol style="margin:0;padding-left:20px;">
<li>Fix the cause (a declined card on Apliiq → pay methods is the usual one).</li>
<li>Re-submit the order: tell Claude Code &ldquo;resubmit order ${esc(ref)}&rdquo;, or run the release/submit actions on /api/fulfillment-ops.</li>
<li>If it will be late, email the customer from hello@goool.shop.</li>
</ol>
<p style="margin:20px 0 0;color:#666;">The customer has only received the payment receipt; they have not been told anything is wrong.</p>
</body></html>`;

  return { subject, html, text };
}
