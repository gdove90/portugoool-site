import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { apliiqSubmitEnabled, checkApliiqConnection, submissionEnvironmentAllowed } from "@/lib/apliiq";
import { drainEmailQueue, queueOrderConfirmation } from "@/lib/email-delivery";
import { emailProvider } from "@/lib/email";
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

  let body: { action?: string; orderId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  if (body.action === "deliver-emails") {
    try { return NextResponse.json(await drainEmailQueue(/^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY ?? ""))); }
    catch { return NextResponse.json({ error: "Email queue unavailable." }, { status: 503 }); }
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
        orderStorageConnected = true;
      } catch { /* report unavailable without exposing database details */ }
    }
    return NextResponse.json({
      supplier: await checkApliiqConnection(),
      submissionEnabled: apliiqSubmitEnabled(),
      liveEnvironmentAllowed: submissionEnvironmentAllowed(true).allowed,
      emailProvider: emailProvider(),
      orderStorageConnected,
    }, { headers: { "Cache-Control": "no-store" } });
  }

  const store = getOrdersStore();
  if (!store) {
    return NextResponse.json({ error: "Order storage unavailable." }, { status: 500 });
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
