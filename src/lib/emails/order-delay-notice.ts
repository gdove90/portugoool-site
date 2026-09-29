import { OrderRow } from "../orders-store";
import { orderNumberFor } from "./order-confirmation";

// ─────────────────────────────────────────────────────────────
// Customer delay notice. Sent automatically when a PAID order is not
// accepted by Apliiq right away (the same trigger as the owner alert),
// so the customer hears from GOOOL before they think to ask.
//
// Copy approved by the owner on 2026-09-29 and deliberately short: it
// states the fact, what happens next, and the refund option. No reason
// is given (the system cannot know it and must never invent one), no
// date is promised, no supplier is named.
//
// Markup follows designs/email-templates/order-delay-notice.html (the
// Claude Design handoff, goool (12).zip) line for line, with the
// {{first_name}} and {{reference}} placeholders filled from the order.
// Same dark receipt styling as order-confirmation.ts so the two read as
// one thread; the only red in the mail is the button.
// ─────────────────────────────────────────────────────────────

const INK = "#090909";
const PAPER = "#FFFFFF";
const MUTED = "#D6D6D6";
const FAINT = "#9A9A9A";
const BORDER = "#393939";
const RED = "#C1121F";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildOrderDelayNotice(order: OrderRow & { id: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://goool.shop").replace(/\/$/, "");
  const ref = orderNumberFor(order.id);
  const firstName = order.shipping_name?.trim().split(/\s+/)[0];
  const greeting = firstName ? `Hi ${firstName},` : "Hi,";
  const subject = `Your GOOOL order ${ref} is taking a little longer`;

  const text = [
    "ORDER UPDATE",
    ref,
    "",
    greeting,
    "",
    "Your order is confirmed and paid, but it is taking longer than usual to prepare. Nothing is needed from you. The moment it ships we will email your tracking number, and you can check it any time at goool.shop/track-order.",
    "",
    "If you would rather not wait, reply to this email and we will refund you in full.",
    "",
    "Support Team",
    "GOOOL Athletics",
    "",
    `Track your order: ${site}/track-order`,
    "",
    "Customer Service",
    "Questions about your order? Contact us at hello@goool.shop",
    "",
    "Wear the Feeling.",
    "GOOOL ATHLETICS LLC · goool.shop",
    "",
    "GOOOL Athletics LLC is an independent brand. Not affiliated with, endorsed by, or connected to any futbol federation, club, league, or governing body.",
  ].join("\n");

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
            <div style="font:400 11px/1.5 Helvetica,Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:${MUTED};">Order update</div>
            <div style="margin-top:13px;font:700 14px/1.5 Helvetica,Arial,sans-serif;letter-spacing:.6px;color:${PAPER};">${esc(ref)}</div>
          </td></tr>
          <tr><td style="border-top:1px solid ${BORDER};padding:20px 0 18px;">
            <div style="font:400 15px/1.65 Helvetica,Arial,sans-serif;color:${PAPER};">${esc(greeting)}</div>
            <div style="margin-top:14px;font:400 15px/1.65 Helvetica,Arial,sans-serif;color:${MUTED};">Your order is confirmed and paid, but it is taking longer than usual to prepare. Nothing is needed from you. The moment it ships we will email your tracking number, and you can check it any time at <a href="${esc(site)}/track-order" target="_blank" style="color:${PAPER};text-decoration:underline;white-space:nowrap;">goool.shop/track-order</a>.</div>
            <div style="margin-top:14px;font:400 15px/1.65 Helvetica,Arial,sans-serif;color:${MUTED};">If you would rather not wait, reply to this email and we will refund you in full.</div>
            <div style="margin-top:14px;font:700 15px/1.65 Helvetica,Arial,sans-serif;color:${PAPER};">Support Team</div>
            <div style="font:400 15px/1.65 Helvetica,Arial,sans-serif;color:${MUTED};">GOOOL Athletics</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;"><tr><td align="center" bgcolor="${RED}" style="background-color:${RED};">
              <a href="${esc(site)}/track-order" target="_blank" style="display:block;padding:15px 16px;font:700 14px/1.4 Helvetica,Arial,sans-serif;color:${PAPER};background-color:${RED};text-decoration:none;">Track your order</a>
            </td></tr></table>
          </td></tr>
          <tr><td align="center" style="border-top:1px solid ${BORDER};padding:20px 0 18px;">
            <div style="font:700 16px/1.5 Helvetica,Arial,sans-serif;color:${PAPER};">Customer Service</div>
            <div style="margin-top:9px;font:400 13px/1.65 Helvetica,Arial,sans-serif;color:${MUTED};">Questions about your order?<br>Contact us at</div>
            <a href="mailto:hello@goool.shop" style="display:inline-block;padding:9px 0;font:700 16px/1.65 Helvetica,Arial,sans-serif;color:${PAPER};text-decoration:underline;">hello@goool.shop</a>
          </td></tr>
          <tr><td align="center" style="border-top:1px solid ${BORDER};padding:18px 0 24px;">
            <div style="font:700 19px/1.35 Helvetica,Arial,sans-serif;color:${PAPER};">Wear the Feeling.</div>
            <div style="margin-top:13px;font:400 11px/1.65 Helvetica,Arial,sans-serif;letter-spacing:.6px;color:${MUTED};">GOOOL ATHLETICS LLC · <a href="${esc(site)}" target="_blank" style="color:${PAPER};text-decoration:underline;">goool.shop</a></div>
            <div style="margin-top:13px;font:400 11px/1.65 Helvetica,Arial,sans-serif;color:${FAINT};">GOOOL Athletics LLC is an independent brand. Not affiliated with, endorsed by, or connected to any futbol federation, club, league, or governing body.</div>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  return { subject, html, text };
}
