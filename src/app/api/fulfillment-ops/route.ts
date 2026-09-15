import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getOrdersStore } from "@/lib/orders-store";
import { reconcileOrder } from "@/lib/fulfillment-submit";

// ─────────────────────────────────────────────────────────────
// Minimal operator endpoint (no dashboard exists yet — callable with
// curl, matching how this project runs its other ops tasks).
//
//   POST /api/fulfillment-ops  { "action": "reconcile", "orderId": "…" }
//   Header: x-ops-key: $FULFILLMENT_OPS_KEY
//
// "reconcile" resolves an order stuck in needs_reconcile after an
// Apliiq timeout: it asks Apliiq whether our order number exists and
// either records the submission or releases the order for a safe
// retry. It never resubmits blindly.
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

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
