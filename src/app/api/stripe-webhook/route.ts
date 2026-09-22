import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Size } from "@/lib/types";
import { getOrdersStore, OrderItemRow, OrderRow } from "@/lib/orders-store";
import { submitPaidOrder } from "@/lib/fulfillment-submit";
import { sendEmail } from "@/lib/email";
import { buildOrderConfirmation } from "@/lib/emails/order-confirmation";

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
  u?: number; // unit price cents, fixed at checkout creation
  k?: string; // Apliiq SKU, fixed at checkout creation
  a?: number; // Apliiq saved-product id, fixed at checkout creation
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
  paid: boolean,
  livemode: boolean
): { order: OrderRow; items: OrderItemRow[]; unmapped: string[] } | { error: string } {
  const metaItems = readItemsMetadata(session.metadata);
  if (!metaItems || metaItems.length === 0) {
    return { error: "Session has no items metadata; cannot build order snapshot." };
  }

  // The snapshot in metadata is authoritative: it was written server-side
  // when the session was created, with the price the customer was charged
  // and the Apliiq SKU that variant resolved to AT PURCHASE TIME. The
  // current catalog is deliberately not consulted — later edits must not
  // change what a completed payment fulfills. A session missing snapshot
  // fields is recorded but never auto-submitted.
  const items: OrderItemRow[] = [];
  const unmapped: string[] = [];
  for (const mi of metaItems) {
    if (typeof mi.u !== "number" || mi.u < 0) {
      return { error: `Item ${mi.p} has no price snapshot; refusing to guess.` };
    }
    if (!mi.k || typeof mi.a !== "number") {
      unmapped.push(`${mi.p} / ${mi.c} / ${mi.s} (no SKU snapshot)`);
    }
    items.push({
      product_id: mi.p,
      size: mi.s,
      color: mi.c,
      quantity: mi.q,
      custom_name: mi.n ?? null,
      custom_number: mi.m ?? null,
      unit_price_cents: mi.u,
      apliiq_product_id: typeof mi.a === "number" ? mi.a : null,
      apliiq_sku: mi.k ?? null,
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
    // Persisted so later ops-driven submissions apply the same
    // live-mode gate the original event carried.
    livemode,
    submission_attempt_id: null,
    submission_started_at: null,
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
    // Money leaving again. Without these the order stayed status='paid'
    // forever after a refund, and the ops `submit` action would happily
    // manufacture and ship a fully refunded order.
    "charge.refunded",
    "charge.dispute.created",
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

    // ── Money going back out ──────────────────────────────────
    // These carry a Charge/Dispute, NOT a Checkout Session, so they are
    // handled before anything touches `session`. Both halt fulfillment
    // by moving the order off status 'paid', which is the only status
    // submitPaidOrder will act on.
    if (event.type === "charge.refunded" || event.type === "charge.dispute.created") {
      const obj = event.data.object as { payment_intent?: string | null; refunded?: boolean; amount_refunded?: number; amount?: number };
      const pi = typeof obj.payment_intent === "string" ? obj.payment_intent : null;
      const order = pi ? await store.getOrderByPaymentIntent(pi) : null;
      if (!order) {
        // Nothing to halt (e.g. a payment that never produced an order).
        await store.recordEvent(event.id, event.type);
        return NextResponse.json({ received: true, matched: false });
      }
      const dispute = event.type === "charge.dispute.created";
      const fullyRefunded = obj.refunded === true ||
        (typeof obj.amount_refunded === "number" && typeof obj.amount === "number" && obj.amount_refunded >= obj.amount);

      let applied: string;
      if (dispute) {
        await store.setOrderStatus(order.id, "cancelled");
        applied = "cancelled (dispute opened)";
      } else if (fullyRefunded) {
        await store.setOrderStatus(order.id, "refunded");
        applied = "refunded";
      } else {
        // Partial refund: do NOT silently cancel the rest of the order.
        // Flag it and leave the status for a human.
        applied = "partial refund recorded; status unchanged";
      }

      // If Apliiq already has it, saying "cancelled" here would be a
      // lie about the physical world - the garment is printing or gone.
      const alreadyWithSupplier =
        order.submission_status === "submitted" ||
        order.submission_status === "accepted" ||
        order.submission_status === "submitting";
      const note = alreadyWithSupplier
        ? `${event.type}: ${applied}. ALREADY WITH SUPPLIER (submission_status=${order.submission_status}${order.apliiq_order_id ? `, apliiq_order_id=${order.apliiq_order_id}` : ""}) - cancel with Apliiq manually.`
        : `${event.type}: ${applied}.`;
      await store.transitionSubmission(
        order.id,
        order.submission_status,
        order.submission_status,
        { submission_last_error: note.slice(0, 500) }
      );
      if (alreadyWithSupplier) console.error("stripe-webhook:", note);

      await store.recordEvent(event.id, event.type);
      return NextResponse.json({
        received: true,
        order: order.id,
        applied,
        alreadyWithSupplier,
      });
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

    const built = buildOrderRows(session, paid, event.livemode);
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

    // Only confirmed-paid orders ever reach Apliiq. The release gate
    // (APLIIQ_SUBMIT_ENABLED), the environment isolation (live-mode
    // event + production context), the persisted-snapshot read, and
    // the CAS lock all live inside submitPaidOrder.
    // Submission must not decide whether Stripe gets a 200. The payment
    // is already recorded at this point; a supplier-side failure is an
    // ops problem, not a reason to make Stripe retry the event for days
    // and re-attempt submission on every delivery. Failures land in
    // submission_status/submission_last_error and are recoverable
    // through /api/fulfillment-ops (reconcile / retry / release).
    let submission: string | undefined;
    if (paid) {
      try {
        const outcome = await submitPaidOrder(store, orderId, { livemode: event.livemode });
        submission = outcome.action;
      } catch (err) {
        console.error("stripe-webhook: submission threw for order", orderId, err);
        submission = "errored";
      }
    }

    // Confirmation email. Customers should hear from GOOOL, not only
    // from Stripe's receipt. Three rules, in this order of importance:
    //   1. Never twice. claimConfirmationSend is a compare-and-set on
    //      confirmation_sent_at, so a redelivered event loses the race
    //      and mails nothing.
    //   2. Never fatal. The payment is recorded; a mail provider having
    //      a bad minute must not turn into a webhook 500 and a retry
    //      storm on a captured payment.
    //   3. Never a false positive. If the send fails we release the
    //      claim, so the next delivery (or a manual replay) can still
    //      get the receipt out.
    let confirmation: string | undefined;
    if (paid) {
      try {
        const claimed = await store.claimConfirmationSend(orderId);
        if (!claimed) {
          confirmation = "already_sent";
        } else {
          const fresh = await store.getOrderById(orderId);
          const to = fresh?.customer_email ?? null;
          if (!fresh || !to) {
            await store.releaseConfirmationClaim(orderId);
            confirmation = "no_recipient";
          } else {
            const items = await store.listOrderItems(orderId);
            const mail = buildOrderConfirmation({ order: fresh, items });
            const result = await sendEmail({ to, ...mail });
            if (result.sent) {
              confirmation = "sent";
            } else {
              await store.releaseConfirmationClaim(orderId);
              confirmation = result.disabled ? "disabled" : "failed";
            }
          }
        }
      } catch (err) {
        console.error("stripe-webhook: confirmation email threw for order", orderId, err);
        try {
          await store.releaseConfirmationClaim(orderId);
        } catch {
          /* best effort - the claim expiring unreleased only costs a receipt */
        }
        confirmation = "errored";
      }
    }
    await store.recordEvent(event.id, event.type);
    return NextResponse.json({
      received: true,
      order: orderId,
      ...(paid ? { submission, confirmation } : { awaiting: "async payment" }),
    });
  } catch (err) {
    console.error("stripe-webhook error:", err);
    // 500 → Stripe retries. The event marker was NOT written, and order
    // creation is idempotent on the session id, so a retry is safe.
    return NextResponse.json({ error: "Processing failed." }, { status: 500 });
  }
}
