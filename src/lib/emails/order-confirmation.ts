import { OrderItemRow, OrderRow } from "../orders-store";
import { products } from "../products";

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

const INK = "#090909";
const PAPER = "#FFFFFF";


const MUTED = "#D6D6D6";
const BORDER = "#393939";

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
  // Receipts also need names for products retired after purchase.
  const p = products.find((product) => product.id === it.product_id);
  if (p?.name) return p.name;
  // Unknown/deleted product: use its recorded supplier SKU instead of guessing.
  return it.apliiq_sku ?? "Item";
}

function itemDetail(it: OrderItemRow): string {
  // Brand copy standard: "·" separates tags, never a dash.
  const bits = [it.color, it.size === "OS" ? "One size" : it.size].filter(Boolean);
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
  const firstName = order.shipping_name?.trim().split(/\s+/)[0];
  const thanks = firstName ? `Thanks, ${firstName}.` : "Thanks.";

  const subtotal = order.amount_subtotal_cents;
  const shipping = order.amount_shipping_cents;
  const tax = order.amount_tax_cents;
  const discount = order.amount_discount_cents ??
    (subtotal != null && shipping != null && tax != null
      ? Math.max(0, subtotal + shipping + tax - order.total_cents) : 0);

  // ── plain text ──────────────────────────────────────────────
  const textLines: string[] = [
    "GOOOL ATHLETICS",
    "",
    "Order confirmed.",
    `${thanks} Your payment is confirmed. We’re getting your order ready.`,
    `Order reference: ${ref}`,
    "",
    "YOUR ORDER",
  ];
  for (const it of items) {
    const d = itemDetail(it);
    textLines.push(
      `  ${it.quantity} x ${itemName(it)}${d ? ` (${d})` : ""} · ${money(it.unit_price_cents * it.quantity, cur)}`
    );
  }
  textLines.push("");
  if (subtotal != null) textLines.push(`  Subtotal: ${money(subtotal, cur)}`);
  if (discount > 0) textLines.push(`  Discount: -${money(discount, cur)}`);
  if (shipping != null) textLines.push(`  Shipping: ${money(shipping, cur)}`);
  if (tax != null) textLines.push(`  Tax: ${money(tax, cur)}`);
  textLines.push(`  Total paid: ${money(order.total_cents, cur)}`);
  const addr = addressLines(order);
  if (addr.length) {
    textLines.push("", "DELIVERING TO", ...addr.map((l) => `  ${l}`));
  }
  textLines.push(
    "",
    "WHAT HAPPENS NEXT",
    "Your order takes a few days to prepare before it ships.",
    "Tracking appears on your order page as soon as the parcel is scanned.",
    "",
    `Check your order any time at ${site}/track-order`,
    `using reference ${ref} and this email address.`,
    "",
    "CUSTOMER SERVICE",
    "Questions about your order? Contact us at hello@goool.shop.",
    "",
    "Wear the Feeling.",
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
            <div style="font:600 15px/1.35 Helvetica,Arial,sans-serif;color:${PAPER};">${esc(itemName(it))}</div>
            ${d ? `<div style="font:400 13px/1.5 Helvetica,Arial,sans-serif;color:${MUTED};margin-top:3px;">${esc(d)}</div>` : ""}
            <div style="font:400 13px/1.5 Helvetica,Arial,sans-serif;color:${MUTED};margin-top:3px;">Quantity ${it.quantity}</div>
          </td>
          <td style="padding:14px 0;border-bottom:1px solid ${BORDER};text-align:right;vertical-align:top;font:600 15px/1.35 Helvetica,Arial,sans-serif;color:${PAPER};white-space:nowrap;">
            ${money(it.unit_price_cents * it.quantity, cur)}
          </td>
        </tr>`;
    })
    .join("");

  const totalRow = (label: string, value: string, bold = false) => `
        <tr>
          <td style="padding:${bold ? "16px 0 5px" : "5px 0"};${bold ? `border-top:1px solid ${BORDER};` : ""}font:${bold ? "700" : "400"} ${bold ? "21px" : "14px"}/1.4 Helvetica,Arial,sans-serif;color:${bold ? PAPER : MUTED};">${esc(label)}</td>
          <td style="padding:${bold ? "16px 0 5px" : "5px 0"};${bold ? `border-top:1px solid ${BORDER};` : ""}text-align:right;font:${bold ? "700" : "400"} ${bold ? "21px" : "14px"}/1.4 Helvetica,Arial,sans-serif;color:${bold ? PAPER : MUTED};white-space:nowrap;">${esc(value)}</td>
        </tr>`;

  const addrBlock = addr.length
    ? `
      <tr><td style="border-top:1px solid ${BORDER};padding:18px 0;">
        <div style="font:700 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.14em;color:${MUTED};text-transform:uppercase;">Delivering to</div>
        <div style="font:400 14px/1.6 Helvetica,Arial,sans-serif;color:${PAPER};margin-top:8px;">
          ${addr.map((l) => esc(l)).join("<br>")}
        </div>
      </td></tr>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(subject)}</title>
<style>
  :root { color-scheme:dark; supported-color-schemes:dark; }
  a[x-apple-data-detectors] { color:inherit!important; text-decoration:none!important; }
  @media only screen and (max-width:380px) { .receipt-padding { padding-left:22px!important; padding-right:22px!important; } }
</style>
</head>
<body bgcolor="${INK}" style="margin:0;padding:0;background-color:${INK};color:${PAPER};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your payment is confirmed. Order ${esc(ref)}. Thank you for choosing GOOOL Athletics.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${INK}" style="background-color:${INK};">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${INK}" style="max-width:520px;background-color:${INK};color:${PAPER};">
      <tr><td align="center" class="receipt-padding" style="padding:32px 28px 24px;">
        <a href="${esc(site)}" target="_blank" style="color:${PAPER};text-decoration:none;">
          <img src="${esc(site)}/brand/goool-athletics-lockup-white.png" width="218" height="82" alt="GOOOL Athletics" border="0" style="display:block;width:218px;max-width:100%;height:auto;border:0;color:${PAPER};font:700 24px/1.3 Helvetica,Arial,sans-serif;">
        </a>
      </td></tr>
      <tr><td class="receipt-padding" style="padding:0 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="border-top:1px solid ${BORDER};padding:20px 0;">
            <div style="font:400 11px/1.5 Helvetica,Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">Order confirmation</div>
            <h1 style="margin:9px 0 12px;font:700 30px/1.1 Helvetica,Arial,sans-serif;letter-spacing:-1px;color:${PAPER};">Order confirmed.</h1>
            <div style="font:400 15px/1.65 Helvetica,Arial,sans-serif;color:${MUTED};">${esc(thanks)} Your payment is confirmed.<br>We’re getting your order ready.</div>
            <div style="margin-top:13px;font:700 14px/1.5 Helvetica,Arial,sans-serif;letter-spacing:.6px;color:${PAPER};">${esc(ref)}</div>
          </td></tr>
          <tr><td style="border-top:1px solid ${BORDER};padding:18px 0;">
            <div style="font:400 11px/1.5 Helvetica,Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">Your order</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${itemRows}</table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
              ${subtotal != null ? totalRow("Subtotal", money(subtotal, cur)) : ""}
              ${discount > 0 ? totalRow("Discount", `-${money(discount, cur)}`) : ""}
              ${shipping != null ? totalRow("Shipping", money(shipping, cur)) : ""}
              ${tax != null ? totalRow("Tax", money(tax, cur)) : ""}
              <tr><td colspan="2" style="height:12px;font-size:0;line-height:0;">&nbsp;</td></tr>
              ${totalRow("Total paid", money(order.total_cents, cur), true)}
            </table>
          </td></tr>
          ${addrBlock}
          <tr><td style="border-top:1px solid ${BORDER};padding:18px 0;">
            <div style="font:400 11px/1.5 Helvetica,Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">What happens next</div>
            <div style="margin-top:12px;font:400 14px/1.65 Helvetica,Arial,sans-serif;color:${MUTED};">Your order takes a few days to prepare before it ships. Check your order page for tracking once your parcel is scanned.</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;"><tr><td align="center" bgcolor="${PAPER}" style="background-color:${PAPER};">
              <a href="${esc(site)}/track-order" target="_blank" style="display:block;padding:15px 16px;font:700 14px/1.4 Helvetica,Arial,sans-serif;color:${INK};background-color:${PAPER};text-decoration:none;">View your order</a>
            </td></tr></table>
            <div style="margin-top:10px;text-align:center;font:400 12px/1.65 Helvetica,Arial,sans-serif;color:${MUTED};">Use your order reference and checkout email.</div>
          </td></tr>
          <tr><td align="center" style="border-top:1px solid ${BORDER};padding:20px 0 18px;">
            <div style="font:700 16px/1.5 Helvetica,Arial,sans-serif;color:${PAPER};">Customer Service</div>
            <div style="margin-top:9px;font:400 13px/1.65 Helvetica,Arial,sans-serif;color:${MUTED};">Questions about your order?<br>Contact us at</div>
            <a href="mailto:hello@goool.shop" style="display:inline-block;padding:9px 0;font:700 16px/1.65 Helvetica,Arial,sans-serif;color:${PAPER};text-decoration:underline;">hello@goool.shop</a>
          </td></tr>
          <tr><td align="center" style="border-top:1px solid ${BORDER};padding:18px 0 24px;">
            <div style="font:700 19px/1.35 Helvetica,Arial,sans-serif;color:${PAPER};">Wear the Feeling.</div>
            <div style="margin-top:13px;font:400 11px/1.65 Helvetica,Arial,sans-serif;letter-spacing:.6px;color:${MUTED};">GOOOL ATHLETICS LLC · <a href="${esc(site)}" target="_blank" style="color:${PAPER};text-decoration:underline;">goool.shop</a></div>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  return { subject, html, text };
}
