import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getOrdersStore } from "@/lib/orders-store";
import { reconcileOrder, releaseOrder, submitPaidOrder } from "@/lib/fulfillment-submit";

// ─────────────────────────────────────────────────────────────
// Minimal operator endpoint (no dashboard exists yet — callable with
// curl, matching how this project runs its other ops tasks).
//
//   POST /api/fulfillment-ops  { "action": …, "orderId": "…" }
//   Header: x-ops-key: $FULFILLMENT_OPS_KEY
//
// Actions:
//   reconcile  Resolve needs_reconcile / expired `submitting` orders by
//              querying Apliiq. Found → recorded (no resubmit). Absent
//              against the REAL API → stays parked (absence is not
//              authoritative); the operator verifies in the Apliiq
//              dashboard and then uses…
//   release    …operator-authorized move needs_reconcile →
//              pending_submission (exactly one retry becomes possible).
//   submit     Submit a pending_submission order now — the recovery
//              path for queued orders (a Stripe event replay would hit
//              event dedupe and never reach submission). Applies the
//              same gates as the webhook, using the order's PERSISTED
//              payment mode; duplicate protection (CAS lock, attempt
//              identity) is identical.
// ─────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const configured = process.env.FULFILLMENT_OPS_KEY;
  const provided = req.headers.get("x-ops-key") ?? "";
  if (
    !configured ||
    configured.length < 16 ||
    provided.length !== configured.length ||
    !crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(configured))
  ) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { action?: string; orderId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const store = getOrdersStore();
  if (!store) {
    return NextResponse.json({ error: "Order storage unavailable." }, { status: 500 });
  }

  if (body.action === "reconcile" && body.orderId) {
    const result = await reconcileOrder(store, body.orderId);
    return NextResponse.json(result);
  }

  if (body.action === "release" && body.orderId) {
    const result = await releaseOrder(store, body.orderId);
    return NextResponse.json(result);
  }

  if (body.action === "submit" && body.orderId) {
    const order = await store.getOrderById(body.orderId);
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    const outcome = await submitPaidOrder(store, body.orderId, { livemode: order.livemode });
    return NextResponse.json(outcome);
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
