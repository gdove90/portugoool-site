import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { metaEventId } from "@/lib/meta-events";
import { getProductById } from "@/lib/products";
import { getOrdersStore } from "@/lib/orders-store";
import { orderNumber } from "@/lib/fulfillment-submit";

// ─────────────────────────────────────────────────────────────
// Server-side verification for /success. The browser only supplies the
// Checkout Session id Stripe put in the redirect URL; everything shown
// to the customer is confirmed against Stripe (payment) and our order
// record (fulfillment) — never assumed from the redirect itself.
//
// Session ids are long random Stripe identifiers, so this endpoint is
// not enumerable; it still returns only non-sensitive display fields.
// ─────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

// The purchase snapshot the checkout route chunked into session metadata.
function purchaseItems(session: Stripe.Checkout.Session): { p: string; q: number }[] {
  const md = session.metadata ?? {};
  let joined = "";
  for (let i = 0; md[`items_${i}`] != null; i++) joined += md[`items_${i}`];
  try { const parsed = JSON.parse(joined); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId || !/^cs_[a-zA-Z0-9_]+$/.test(sessionId)) {
    return NextResponse.json({ error: "Invalid session." }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Payments are not configured." }, { status: 503 });
  }

  let session: Stripe.Checkout.Session;
  try {
    const stripe = new Stripe(secretKey);
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return NextResponse.json({ error: "Unknown session." }, { status: 404 });
  }

  const paid =
    session.payment_status === "paid" ||
    session.payment_status === "no_payment_required";
  const failedOrOpen = session.status === "open" || session.status === "expired";

  // Fulfillment truthfulness: only claim production once our order row
  // shows Apliiq actually accepted the submission.
  let recorded = false;
  let purchaseEligible = false;
  let productionConfirmed = false;
  let reference: string | null = null;
  const store = getOrdersStore();
  if (store) {
    try {
      const order = await store.getOrderBySession(sessionId);
      if (order) {
        recorded = true;
        purchaseEligible = order.status === "paid" && order.livemode === true;
        reference = orderNumber(order.id);
        productionConfirmed =
          order.submission_status === "accepted" ||
          order.fulfillment_status === "in_production" ||
          order.fulfillment_status === "shipped" ||
          order.fulfillment_status === "delivered";
      }
    } catch {
      /* status endpoint stays available even if the DB is down */
    }
  }

  return NextResponse.json({
    state: paid ? "paid" : failedOrOpen ? "failed" : "pending",
    recorded,
    productionConfirmed,
    reference,
    email: session.customer_details?.email ?? null,
    totalCents: session.amount_total ?? null,
    currency: session.currency ?? "usd",
    purchaseEvent: paid && session.livemode && purchaseEligible && session.amount_total != null ? {
      // Same id scheme as the server-side Purchase in the webhook.
      id: await metaEventId("Purchase", session.id),
      value: session.amount_total / 100,
      currency: (session.currency ?? "usd").toUpperCase(),
      content_ids: purchaseItems(session).map((i) => getProductById(i.p)?.slug ?? i.p),
      num_items: purchaseItems(session).reduce((n, i) => n + (i.q ?? 0), 0),
      order_id: reference ?? session.id,
    } : null,
  }, { headers: { "Cache-Control": "no-store" } });
}
