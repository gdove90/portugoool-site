import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getProductById } from "@/lib/products";
import { Size } from "@/lib/types";
import { resolveApliiqSku } from "@/lib/fulfillment";
import { getOrdersStore, OrderItemRow, OrderRow } from "@/lib/orders-store";
import { submitPaidOrder } from "@/lib/fulfillment-submit";

// ─────────────────────────────────────────────────────────────
// Stripe webhook — the ONLY payment authority. Fulfillment never
// trusts the browser redirect to /success.
//
// Events handled:
//   checkout.session.completed        card payments (paid immediately)
//                                     or delayed methods (unpaid here)
//   checkout.session.async_payment_succeeded   delayed method cleared
//   checkout.session.async_payment_failed      delayed method failed
//
// Idempotency, in layers:
//   1. stripe_events: an event id already recorded returns 200 without
//      reprocessing. Recorded only AFTER successful processing, so a
//      transient failure keeps Stripe's retries meaningful.
//   2. orders.stripe_session_id is unique: the same session can never
//      create two orders, even across concurrent event deliveries.
//   3. submission to Apliiq sits behind a compare-and-set lock.
// Out-of-order delivery: async_payment_succeeded creates the order
// itself if completed never arrived; completed after success is a
// no-op thanks to layer 2.
// ─────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

interface MetaItem {
  p: string; // productId
  c: string; // color
  s: Size; // size
  q: number; // quantity
  n?: string; // custom name
  m?: string; // custom number
}

function readItemsMetadata(md: Record<string, string> | null): MetaItem[] | null {
  if (!md) return null;
  let joined = "";
  for (let i = 0; ; i++) {
    const chunk = md[`items_${i}`];
    if (chunk == null) break;
    joined += chunk;
  }
  if (!joined) return null;
  try {
    const parsed = JSON.parse(joined);
    return Array.isArray(parsed) ? (parsed as MetaItem[]) : null;
  } catch {
    return null;
  }
}

function buildOrderRows(
  session: Stripe.Checkout.Session,
  paid: boolean
): { order: OrderRow; items: OrderItemRow[]; unmapped: string[] } | { error: string } {
  const metaItems = readItemsMetadata(session.metadata);
  if (!metaItems || metaItems.length === 0) {
    return { error: "Session has no items metadata; cannot build order snapshot." };
  }

  const items: OrderItemRow[] = [];
  const unmapped: string[] = [];
  for (const mi of metaItems) {
    const product = getProductById(mi.p);
    if (!product) return { error: `Unknown product ${mi.p} in session metadata.` };
    const hasCustomization = Boolean(mi.n || mi.m);
    const unit =
      product.priceCents + (hasCustomization ? product.customizationPriceCents : 0);
    const mapping = resolveApliiqSku(mi.p, mi.c, mi.s);
    if (!mapping) unmapped.push(`${product.name} / ${mi.c} / ${mi.s}`);
    items.push({
      product_id: mi.p,
      size: mi.s,
      color: mi.c,
      quantity: mi.q,
      custom_name: mi.n ?? null,
      custom_number: mi.m ?? null,
      unit_price_cents: unit,
      apliiq_product_id: mapping?.apliiqProductId ?? null,
      apliiq_sku: mapping?.sku ?? null,
    });
  }

  // Shipping details: Stripe puts them on collected_information or the
  // legacy shipping_details field depending on API version.
  const s = session as unknown as {
    shipping_details?: { name?: string; address?: Record<string, string> };
    collected_information?: {
      shipping_details?: { name?: string; address?: Record<string, string> };
    };
  };
  const ship = s.collected_information?.shipping_details ?? s.shipping_details ?? null;

  const order: OrderRow = {
    stripe_session_id: session.id,
    stripe_payment_intent:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null,
    customer_email: session.customer_details?.email ?? null,
    status: paid ? "paid" : "pending",
    fulfillment_status: "unfulfilled",
    submission_status: paid
      ? unmapped.length > 0
        ? "failed"
        : "pending_submission"
      : "not_submitted",
    total_cents: session.amount_total ?? 0,
    amount_subtotal_cents: session.amount_subtotal ?? null,
    amount_shipping_cents: session.total_details?.amount_shipping ?? null,
    amount_tax_cents: session.total_details?.amount_tax ?? null,
    currency: session.currency ?? "usd",
    shipping_name: ship?.name ?? null,
    shipping_address: ship?.address ?? null,
    apliiq_order_id: null,
    submission_last_error:
      unmapped.length > 0 ? `Unmapped variants: ${unmapped.join("; ")}` : null,
    paid_at: paid ? new Date().toISOString() : null,
  };

  return { order, items, unmapped };
}

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    // Not configured: refuse loudly so Stripe shows failures instead of
    // silently swallowing payments.
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const relevant = new Set([
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "checkout.session.async_payment_failed",
  ]);
  if (!relevant.has(event.type)) {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const store = getOrdersStore();
  if (!store) {
    // No database: return 500 so Stripe retries until storage exists.
    return NextResponse.json({ error: "Order storage unavailable." }, { status: 500 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    // Fast-path dedupe. The marker is written only after successful
    // processing (below), so a transient failure keeps retries alive;
    // concurrent first deliveries fall through to the session-unique
    // and CAS layers, which make double processing harmless.
    if (await store.hasEvent(event.id)) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    if (event.type === "checkout.session.async_payment_failed") {
      const existing = await store.getOrderBySession(session.id);
      if (existing && existing.status === "pending") {
        await store.setOrderStatus(existing.id, "cancelled");
      }
      await store.recordEvent(event.id, event.type);
      return NextResponse.json({ received: true });
    }

    const paid =
      session.payment_status === "paid" ||
      session.payment_status === "no_payment_required" ||
      event.type === "checkout.session.async_payment_succeeded";

    const built = buildOrderRows(session, paid);
    if ("error" in built) {
      console.error("stripe-webhook: cannot build order:", built.error);
      // 200: retrying will never fix a malformed session; keep it visible in logs.
      return NextResponse.json({ received: true, error: built.error });
    }

    // Layer-2 idempotency: unique stripe_session_id.
    const { orderId, created } = await store.createOrder(built.order, built.items);

    // Out-of-order / two-phase: if the order pre-existed as pending and
    // this event confirms payment, promote it.
    if (!created && paid) {
      const existing = await store.getOrderBySession(session.id);
      if (existing && existing.status === "pending") {
        await store.setOrderStatus(orderId, "paid");
        await store.transitionSubmission(orderId, "not_submitted", "pending_submission");
      }
    }

    // Only confirmed-paid orders ever reach Apliiq; the release gate
    // (APLIIQ_SUBMIT_ENABLED) and the CAS lock live inside.
    let submission: string | undefined;
    if (paid) {
      const outcome = await submitPaidOrder(store, orderId, built.items);
      submission = outcome.action;
    }
    await store.recordEvent(event.id, event.type);
    return NextResponse.json({
      received: true,
      order: orderId,
      ...(paid ? { submission } : { awaiting: "async payment" }),
    });
  } catch (err) {
    console.error("stripe-webhook error:", err);
    // 500 → Stripe retries. The event marker was NOT written, and order
    // creation is idempotent on the session id, so a retry is safe.
    return NextResponse.json({ error: "Processing failed." }, { status: 500 });
  }
}
