import type { OrderRow, ShipmentRow } from "../orders-store";
import { orderNumberFor } from "./order-confirmation";
import { trackingNumbers } from "../shipment";

const esc = (value: string) => value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

export function buildShipmentNotification(order: OrderRow & { id: string }, shipment: ShipmentRow) {
  const reference = orderNumberFor(order.id);
  const numbers = trackingNumbers(shipment.tracking_numbers);
  const carrier = shipment.tracking_company?.trim() || "Your carrier";
  const text = ["GOOOL ATHLETICS", "", "Your shipment is on its way.",
    `Order reference: ${reference}`, `Carrier: ${carrier}`,
    ...numbers.map(n => `Tracking number: ${n}`), "",
    "Tracking can take a little time to update after the carrier receives your parcel.",
    "Items in your order may ship separately. View your order page for all shipment details.",
    "Track your order: https://goool.shop/track-order", "",
    "Customer Service", "Questions about your order? Contact hello@goool.shop", "https://goool.shop"].join("\n");
  // Only first-party links in email; supplier URLs are never interpolated into HTML.
  const html = `<!doctype html><html><head><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"></head><body style="margin:0;background:#090909;color:#fff;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#090909"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px"><tr><td style="padding:36px 28px;border-bottom:1px solid #393939"><a href="https://goool.shop"><img src="https://goool.shop/brand/goool-athletics-lockup-white.png" width="218" height="82" alt="GOOOL Athletics" style="display:block;border:0;max-width:100%;height:auto"></a></td></tr><tr><td style="padding:36px 28px"><h1 style="margin:0 0 20px;font-size:28px;line-height:1.25;color:#fff">Your shipment is on its way.</h1><p style="font-size:16px;line-height:1.6;color:#d6d6d6">Order reference: <strong style="color:#fff">${esc(reference)}</strong></p><p style="font-size:16px;line-height:1.6;color:#d6d6d6">${esc(carrier)}<br>${numbers.map(n=>`Tracking: <strong style="color:#fff;word-break:break-all">${esc(n)}</strong>`).join("<br>")}</p><p style="font-size:15px;line-height:1.6;color:#d6d6d6">Tracking can take a little time to update after the carrier receives your parcel. Items in your order may ship separately.</p><p style="margin:28px 0"><a href="https://goool.shop/track-order" style="display:inline-block;background:#fff;color:#090909;padding:16px 24px;border-radius:28px;font-size:16px;font-weight:bold;text-decoration:none">Track your order</a></p><p style="border-top:1px solid #393939;padding-top:24px;font-size:15px;line-height:1.6;color:#d6d6d6"><strong style="color:#fff">Customer Service</strong><br>Questions about your order? Contact us at<br><a href="mailto:hello@goool.shop" style="color:#fff;text-decoration:underline">hello@goool.shop</a></p><a href="https://goool.shop" style="color:#d6d6d6;font-size:14px">goool.shop</a></td></tr></table></td></tr></table></body></html>`;
  return { subject: `Shipment update for ${reference}`, html, text };
}
