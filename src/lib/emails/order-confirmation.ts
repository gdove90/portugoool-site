import { OrderItemRow, OrderRow } from "../orders-store";
import { getProductById } from "../products";

// ─────────────────────────────────────────────────────────────
// The GOOOL order confirmation.
//
// Built from the PERSISTED SNAPSHOT, never the live catalogue: the
// customer is told what they actually paid, so a later price edit can
// never rewrite history in an email. Only the product NAME is looked up
// from the catalogue (the snapshot stores ids and SKUs, not names), and
// that falls back to the SKU rather than inventing a label.
//
// Honesty rules baked into the copy:
//   - It confirms a PAYMENT, not a shipment. Nothing here says
//     "on its way" - these are printed to order and genuinely take
//     days before a parcel exists.
//   - No tracking number is promised in this email, and no tracking
//     EMAIL is promised either: sendEmail has one caller and nothing
//     sends a shipment notice. It points at /track-order, which works.
//   - It gives the order reference, which is the only thing the
//     customer needs to find the order again.
//
// Table-based layout with inline styles: every real mail client still
// mangles modern CSS, and Outlook ignores most of it entirely.
// ─────────────────────────────────────────────────────────────

const INK = "#0A0A0A";
const PAPER = "#FFFFFF";
const SMOKE = "#F4F4F2";
const RED = "#C1121F";
const MUTED = "#6B6B6B";
const BORDER = "#E3E3E0";

function money(cents: number, currency = "usd"): string {
  const v = (cents / 100).toFixed(2);
  return currency.toLowerCase() === "usd" ? `$${v}` : `${v} ${currency.toUpperCase()}`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function orderNumberFor(orderId: string): string {
  return `GOOOL-${orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

function itemName(it: OrderItemRow): string {
  const p = getProductById(it.product_id);
  if (p?.name) return p.name;
  // Archived/retired products are not in the active catalogue. Never
  // guess a name - show the supplier SKU, which is at least true.
  return it.apliiq_sku ?? "Item";
}

function itemDetail(it: OrderItemRow): string {
  // Brand copy standard: "·" separates tags, never a dash.
  const bits = [it.color, it.size].filter(Boolean);
  if (it.custom_name) bits.push(`Name: ${it.custom_name}`);
  if (it.custom_number) bits.push(`Number: ${it.custom_number}`);
  return bits.join(" · ");
}

function addressLines(order: OrderRow): string[] {
  const a = (order.shipping_address ?? {}) as Record<string, string | null | undefined>;
  return [
    order.shipping_name ?? "",
    a.line1 ?? "",
    a.line2 ?? "",
    [a.city, a.state, a.postal_code].filter(Boolean).join(", "),
    a.country ?? "",
  ].filter((l) => l && l.trim() !== "");
}

export interface ConfirmationInput {
  order: OrderRow & { id: string };
  items: OrderItemRow[];
  siteUrl?: string;
}

export function buildOrderConfirmation({ order, items, siteUrl }: ConfirmationInput): {
  subject: string;
  html: string;
  text: string;
} {
  const site = (siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://goool.shop").replace(/\/$/, "");
  const ref = orderNumberFor(order.id);
  const cur = order.currency ?? "usd";
  const subject = `Order ${ref} confirmed`;

  const subtotal = order.amount_subtotal_cents;
  const shipping = order.amount_shipping_cents;
  const tax = order.amount_tax_cents;

  // ── plain text ──────────────────────────────────────────────
  const textLines: string[] = [
    "GOOOL",
    "MADE FOR THE MOMENT.",
    "",
    `Thanks. Your order is confirmed.`,
    `Order reference: ${ref}`,
    "",
    "WHAT YOU ORDERED",
  ];
  for (const it of items) {
    const d = itemDetail(it);
    textLines.push(
      `  ${it.quantity} x ${itemName(it)}${d ? ` (${d})` : ""} · ${money(it.unit_price_cents * it.quantity, cur)}`
    );
  }
  textLines.push("");
  if (subtotal != null) textLines.push(`  Subtotal: ${money(subtotal, cur)}`);
  if (shipping != null) textLines.push(`  Shipping: ${money(shipping, cur)}`);
  if (tax != null && tax > 0) textLines.push(`  Tax: ${money(tax, cur)}`);
  textLines.push(`  Total paid: ${money(order.total_cents, cur)}`);
  const addr = addressLines(order);
  if (addr.length) {
    textLines.push("", "SHIPPING TO", ...addr.map((l) => `  ${l}`));
  }
  textLines.push(
    "",
    "WHAT HAPPENS NOW",
    "Your order takes a few days to prepare before it ships.",
    "Tracking appears on your order page as soon as the parcel is scanned.",
    "",
    `Check your order any time at ${site}/track-order`,
    `using reference ${ref} and this email address.`,
    "",
    "Questions? Just reply to this email, or write to hello@goool.shop.",
    "",
    "GOOOL is an independent brand. Not affiliated with, endorsed by, or",
    "connected to any football federation, club, league, or governing body.",
    `${site}`
  );
  const text = textLines.join("\n");

  // ── html ────────────────────────────────────────────────────
  const itemRows = items
    .map((it) => {
      const d = itemDetail(it);
      return `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid ${BORDER};vertical-align:top;">
            <div style="font:600 15px/1.35 Helvetica,Arial,sans-serif;color:${INK};">${esc(itemName(it))}</div>
            ${d ? `<div style="font:400 13px/1.5 Helvetica,Arial,sans-serif;color:${MUTED};margin-top:3px;">${esc(d)}</div>` : ""}
            <div style="font:400 13px/1.5 Helvetica,Arial,sans-serif;color:${MUTED};margin-top:3px;">Qty ${it.quantity}</div>
          </td>
          <td style="padding:14px 0;border-bottom:1px solid ${BORDER};text-align:right;vertical-align:top;font:600 15px/1.35 Helvetica,Arial,sans-serif;color:${INK};white-space:nowrap;">
            ${money(it.unit_price_cents * it.quantity, cur)}
          </td>
        </tr>`;
    })
    .join("");

  const totalRow = (label: string, value: string, bold = false) => `
        <tr>
          <td style="padding:5px 0;font:${bold ? "700" : "400"} ${bold ? "16px" : "14px"}/1.4 Helvetica,Arial,sans-serif;color:${bold ? INK : MUTED};">${esc(label)}</td>
          <td style="padding:5px 0;text-align:right;font:${bold ? "700" : "400"} ${bold ? "16px" : "14px"}/1.4 Helvetica,Arial,sans-serif;color:${bold ? INK : MUTED};white-space:nowrap;">${esc(value)}</td>
        </tr>`;

  const addrBlock = addr.length
    ? `
      <tr><td style="padding:26px 0 0 0;">
        <div style="font:700 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.14em;color:${MUTED};text-transform:uppercase;">Shipping to</div>
        <div style="font:400 14px/1.6 Helvetica,Arial,sans-serif;color:${INK};margin-top:8px;">
          ${addr.map((l) => esc(l)).join("<br>")}
        </div>
      </td></tr>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${SMOKE};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Order ${esc(ref)} is confirmed. Printed to order, so it takes a few days before it ships.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${SMOKE};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${PAPER};">

      <tr><td style="background:${INK};padding:26px 28px;">
        <div style="font:700 26px/1 Helvetica,Arial,sans-serif;letter-spacing:.20em;color:${PAPER};">GOOOL</div>
        <div style="font:700 10px/1 Helvetica,Arial,sans-serif;letter-spacing:.20em;color:${RED};margin-top:9px;">MADE FOR THE MOMENT.</div>
      </td></tr>

      <tr><td style="padding:30px 28px 0 28px;">
        <div style="font:700 21px/1.3 Helvetica,Arial,sans-serif;color:${INK};">Thanks. Your order is confirmed.</div>
        <div style="font:400 15px/1.6 Helvetica,Arial,sans-serif;color:${MUTED};margin-top:10px;">
          We have your payment. Your order reference is
          <strong style="color:${INK};">${esc(ref)}</strong>.
        </div>
      </td></tr>

      <tr><td style="padding:24px 28px 0 28px;">
        <div style="font:700 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.14em;color:${MUTED};text-transform:uppercase;padding-bottom:4px;">What you ordered</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${itemRows}</table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:14px;">
          ${subtotal != null ? totalRow("Subtotal", money(subtotal, cur)) : ""}
          ${shipping != null ? totalRow("Shipping", money(shipping, cur)) : ""}
          ${tax != null && tax > 0 ? totalRow("Tax", money(tax, cur)) : ""}
          ${totalRow("Total paid", money(order.total_cents, cur), true)}
        </table>
      </td></tr>

      <tr><td style="padding:0 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${addrBlock}</table>
      </td></tr>

      <tr><td style="padding:26px 28px 0 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${SMOKE};">
          <tr><td style="padding:18px 20px;">
            <div style="font:700 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.14em;color:${MUTED};text-transform:uppercase;">What happens now</div>
            <div style="font:400 14px/1.65 Helvetica,Arial,sans-serif;color:${INK};margin-top:9px;">
              Your order takes a few days to prepare before it ships.
              Tracking appears on your order page as soon as the parcel is scanned.
            </div>
          </td></tr>
        </table>
      </td></tr>

      <tr><td align="center" style="padding:24px 28px 0 28px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:${INK};">
            <a href="${site}/track-order" style="display:inline-block;padding:14px 30px;font:700 13px/1 Helvetica,Arial,sans-serif;letter-spacing:.09em;color:${PAPER};text-decoration:none;text-transform:uppercase;">Track this order</a>
          </td>
        </tr></table>
        <div style="font:400 13px/1.6 Helvetica,Arial,sans-serif;color:${MUTED};margin-top:12px;">
          Use reference ${esc(ref)} and this email address.
        </div>
      </td></tr>

      <tr><td style="padding:26px 28px 30px 28px;">
        <div style="border-top:1px solid ${BORDER};padding-top:18px;font:400 13px/1.65 Helvetica,Arial,sans-serif;color:${MUTED};">
          Questions? Just reply to this email, or write to
          <a href="mailto:hello@goool.shop" style="color:${INK};">hello@goool.shop</a>.
        </div>
      </td></tr>

      <tr><td style="background:${SMOKE};padding:18px 28px;">
        <div style="font:400 11px/1.6 Helvetica,Arial,sans-serif;color:${MUTED};">
          You are receiving this because you placed an order at
          <a href="${site}" style="color:${MUTED};">goool.shop</a>. This is a transactional
          message about that order, not marketing.
        </div>
        <div style="font:400 11px/1.6 Helvetica,Arial,sans-serif;color:${MUTED};margin-top:9px;">
          GOOOL is an independent brand. Not affiliated with, endorsed by, or connected to
          any football federation, club, league, or governing body.
        </div>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;

  return { subject, html, text };
}
