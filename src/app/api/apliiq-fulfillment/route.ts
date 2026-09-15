import { NextRequest, NextResponse } from "next/server";
import { verifyFulfillmentSignature } from "@/lib/apliiq";
import { getOrdersStore } from "@/lib/orders-store";

// ─────────────────────────────────────────────────────────────
// Apliiq fulfillment callback (configured as the custom store's
// Fulfillment URL). Apliiq POSTs shipment records here when an order
// (or part of one) ships:
//   { order_id, status, tracking_company, tracking_numbers[],
//     tracking_urls[], line_items[] }
// signed with x-apliiq-hmac = base64(HMACSHA256(base64(body), secret)).
//
// Partial shipments: every callback is stored as its own shipment row;
// the order flips to "shipped" on the first one, and the rows carry
// which line items each package covered.
// ─────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-apliiq-hmac");
  if (!verifyFulfillmentSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let payload: {
    order_id?: unknown;
    status?: unknown;
    tracking_company?: unknown;
    tracking_numbers?: unknown;
    tracking_urls?: unknown;
    line_items?: unknown;
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const apliiqOrderId = payload.order_id != null ? String(payload.order_id) : "";
  if (!apliiqOrderId) {
    return NextResponse.json({ error: "Missing order_id." }, { status: 400 });
  }

  const store = getOrdersStore();
  if (!store) {
    return NextResponse.json({ error: "Order storage unavailable." }, { status: 500 });
  }

  const order = await store.getOrderByApliiqId(apliiqOrderId);
  if (!order) {
    // Signed but unknown: acknowledge so Apliiq stops retrying, but log
    // loudly — this means our apliiq_order_id bookkeeping has a gap.
    console.error(`apliiq-fulfillment: no order with apliiq_order_id=${apliiqOrderId}`);
    return NextResponse.json({ received: true, matched: false });
  }

  await store.addShipment({
    order_id: order.id,
    status: typeof payload.status === "string" ? payload.status : "",
    tracking_company:
      typeof payload.tracking_company === "string" ? payload.tracking_company : null,
    tracking_numbers: Array.isArray(payload.tracking_numbers)
      ? payload.tracking_numbers.map(String)
      : [],
    tracking_urls: Array.isArray(payload.tracking_urls)
      ? payload.tracking_urls.map(String)
      : [],
    line_items: Array.isArray(payload.line_items) ? payload.line_items : [],
  });
  await store.setFulfillmentStatus(order.id, "shipped");

  return NextResponse.json({ received: true, matched: true });
}
