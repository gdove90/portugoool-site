import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Stripe from "stripe";
import { apliiqSubmitEnabled, checkApliiqConnection, submissionEnvironmentAllowed } from "@/lib/apliiq";
import { drainEmailQueue, queueOrderConfirmation, queueOrderDelayNotice, queueShipmentNotification } from "@/lib/email-delivery";
import { emailProvider } from "@/lib/email";
import { runWelcomePass } from "@/lib/welcome";
import { getOrdersStore } from "@/lib/orders-store";
import { reconcileOrder, releaseOrder, retrySubmission, submitPaidOrder } from "@/lib/fulfillment-submit";

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
//              A client timeout or an empty dashboard/list is NOT
//              sufficient: Apliiq may have received and may still be
//              processing the original. Release only after affirmative
//              verification (see the release runbook in
//              designs/11_fulfillment/apliiq-product-mapping.md).
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
  // Compare BYTE lengths, not string lengths. timingSafeEqual throws a
  // RangeError on unequal buffer lengths, and String.length counts UTF-16
  // code units — so a key containing any multi-byte character could pass
  // the length guard and then throw, turning a failed auth into an
  // unhandled 500 instead of a 401.
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(configured ?? "", "utf8");
  if (
    !configured ||
    b.length < 16 ||
    a.length !== b.length ||
    !crypto.timingSafeEqual(a, b)
  ) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { action?: string; orderId?: string; welcome?: boolean; endpointId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  // The minute worker drains the queue every call and, when it sets
  // `welcome: true` (top of each hour), also runs the welcome-sequence
  // pass. `welcome-pass` runs that pass alone, for operators and tests.
  const liveKey = /^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY ?? "");
  if (body.action === "deliver-emails") {
    let drained: Record<string, number>;
    try { drained = await drainEmailQueue(liveKey); }
    catch { return NextResponse.json({ error: "Email queue unavailable." }, { status: 503 }); }
    if (body.welcome !== true) return NextResponse.json(drained);
    try { return NextResponse.json({ ...drained, welcome: await runWelcomePass(liveKey) }); }
    catch { return NextResponse.json({ ...drained, welcome: { error: 1 } }); }
  }
  if (body.action === "welcome-pass") {
    try { return NextResponse.json({ welcome: await runWelcomePass(liveKey) }); }
    catch { return NextResponse.json({ error: "Welcome pass unavailable." }, { status: 503 }); }
  }
  // Read-only diagnostics reuse the existing operator authentication.
  // No order submissions, emails, credentials, or customer records are returned.
  if (body.action === "status") {
    const store = getOrdersStore();
    let orderStorageConnected = false;
    if (store) {
      try {
        await store.getOrderById("00000000-0000-4000-8000-000000000000");
        await store.getOrderByExternalId("0");
        await store.listShipments("00000000-0000-4000-8000-000000000000");
        orderStorageConnected = true;
      } catch { /* report unavailable without exposing database details */ }
    }
    return NextResponse.json({
      supplier: await checkApliiqConnection(),
      submissionEnabled: apliiqSubmitEnabled(),
      liveEnvironmentAllowed: submissionEnvironmentAllowed(true).allowed,
      emailProvider: emailProvider(),
      shipmentEmailsImplemented: true,
      metaPixelConfigured: /^\d{5,25}$/.test(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? ""),
      orderStorageConnected,
    }, { headers: { "Cache-Control": "no-store" } });
  }

  // Read-only Stripe webhook inspection through the key this deploy already
  // holds: endpoint urls, states and subscribed events, plus the events
  // Stripe could not deliver. No secrets and no customer data are returned
  // (event ids and types only).
  if (body.action === "stripe-webhooks") {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
    const stripe = new Stripe(secretKey);
    try {
      const endpoints = await stripe.webhookEndpoints.list({ limit: 20 });
      const undelivered = await stripe.events.list({ delivery_success: false, limit: 20 });
      return NextResponse.json({
        livemode: liveKey,
        endpoints: endpoints.data.map((e) => ({
          id: e.id, url: e.url, status: e.status, livemode: e.livemode, enabled_events: e.enabled_events,
          created: new Date(e.created * 1000).toISOString(), api_version: e.api_version, description: e.description,
        })),
        undelivered: undelivered.data.map((ev) => ({
          id: ev.id, type: ev.type, created: new Date(ev.created * 1000).toISOString(), pending_webhooks: ev.pending_webhooks,
        })),
      }, { headers: { "Cache-Control": "no-store" } });
    } catch {
      return NextResponse.json({ error: "Stripe inspection failed." }, { status: 502 });
    }
  }

  // Point an existing endpoint at this site's webhook route. Stripe keeps the
  // endpoint's signing secret on a url change, so STRIPE_WEBHOOK_SECRET in
  // Netlify stays valid. The target is fixed to this site; nothing else can
  // be set through here.
  if (body.action === "stripe-webhook-url" && typeof body.endpointId === "string") {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
    const url = `${(process.env.NEXT_PUBLIC_SITE_URL ?? "https://goalathletics.shop").replace(/\/$/, "")}/api/stripe-webhook`;
    const stripe = new Stripe(secretKey);
    try {
      const endpoint = await stripe.webhookEndpoints.update(body.endpointId, { url });
      return NextResponse.json({ id: endpoint.id, url: endpoint.url, status: endpoint.status, livemode: endpoint.livemode });
    } catch {
      return NextResponse.json({ error: "Stripe endpoint update failed." }, { status: 502 });
    }
  }

  const store = getOrdersStore();
  if (!store) {
    return NextResponse.json({ error: "Order storage unavailable." }, { status: 500 });
  }

  if (body.action === "retry-shipment-notices" && body.orderId) {
    const order = await store.getOrderById(body.orderId);
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    const shipments = await store.listShipments(order.id);
    const outcomes = [];
    for (const shipment of shipments) outcomes.push(await queueShipmentNotification(order, shipment));
    return NextResponse.json({ outcomes });
  }

  if (body.action === "delay-notice" && body.orderId) {
    // Operator-triggered copy of the automatic customer delay notice, for
    // orders that parked before the notice existed or that the owner
    // wants nudged again. Same template, same once-per-order key, so a
    // repeat call after the automatic send is a no-op.
    const order = await store.getOrderById(body.orderId);
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    try { return NextResponse.json({ delayNotice: await queueOrderDelayNotice(store, order.id, order.livemode) }); }
    catch { return NextResponse.json({ error: "Delay notice could not be queued." }, { status: 503 }); }
  }

  if (body.action === "retry-confirmation" && body.orderId) {
    try { return NextResponse.json({ confirmation: await queueOrderConfirmation(store, body.orderId) }); }
    catch { return NextResponse.json({ error: "Confirmation could not be queued." }, { status: 503 }); }
  }

  if (body.action === "reconcile" && body.orderId) {
    const result = await reconcileOrder(store, body.orderId);
    return NextResponse.json(result);
  }

  if (body.action === "retry" && body.orderId) {
    // Re-queue an order Apliiq rejected, or one whose payload could not
    // be built. Safe against duplicates: every path into `failed` means
    // Apliiq definitively did not take the order. Ambiguous outcomes go
    // to needs_reconcile and still require reconcile first.
    const result = await retrySubmission(store, body.orderId);
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
