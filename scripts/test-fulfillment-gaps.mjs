/**
 * Regression for the four money-path gaps closed on 2026-09-22.
 * None of these were covered by test-integration.mjs, which is how all
 * four survived: every existing test drove the happy path or the
 * ambiguous-timeout path, never the rejected path or a refund.
 *
 *   1. `failed` is no longer terminal. A supplier rejection used to
 *      strand a PAID order forever: submit wants pending_submission,
 *      reconcile wants needs_reconcile/submitting, release wants
 *      needs_reconcile. Nothing accepted `failed`.
 *   2. An Apliiq 2xx with no usable order id must NOT be recorded as
 *      `submitted` with apliiq_order_id null. The shipment callback
 *      matches on apliiq_order_id alone, so a null orphaned the order
 *      from its own tracking forever.
 *   3. charge.refunded must stop fulfillment. Previously no refund
 *      event was handled at all, so the ops `submit` action would
 *      cheerfully manufacture and ship a fully refunded order.
 *   4. charge.dispute.created must stop fulfillment the same way.
 *
 * Run against the same test-env server as test-integration.mjs:
 *   STORE_DIR=<dir> node scripts/test-fulfillment-gaps.mjs <baseUrl> <mockPort>
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Stripe from "stripe";

const BASE = process.argv[2] ?? "http://localhost:3996";
const MOCK_PORT = Number(process.argv[3] ?? 4242);
const STORE_DIR = process.env.STORE_DIR ?? "./tmp/orders-test-store";
const WEBHOOK_SECRET = process.env.TEST_WEBHOOK_SECRET ?? "whsec_test_local_secret";
const OPS_KEY = process.env.TEST_OPS_KEY ?? "test_ops_key_0123456789abcdef";
const stripe = new Stripe("sk_test_dummy_key_not_real");

let passed = 0,
  failed = 0;
const check = (name, cond, detail = "") => {
  if (cond) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}  ${detail}`);
  }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Apliiq mock ──────────────────────────────────────────────
// mode: ok | reject400 | ok_no_id  (ok_no_id = 200 with no usable id)
const mock = { mode: "ok", posts: [], nextId: 950001 };
const mockServer = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    if (req.url === "/__scenario" && req.method === "POST") {
      Object.assign(mock, JSON.parse(body));
      res.end("{}");
      return;
    }
    if (req.url?.startsWith("/v1/Order") && req.method === "GET") {
      res.setHeader("content-type", "application/json");
      res.end("[]");
      return;
    }
    if (req.url === "/v1/Order" && req.method === "POST") {
      mock.posts.push(JSON.parse(body));
      if (mock.mode === "reject400") {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "temporary: rate limited" }));
        return;
      }
      if (mock.mode === "ok_no_id") {
        // A 200 whose body carries no top-level id - exactly what the
        // real API does on some accepted-but-queued responses.
        res.statusCode = 200;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ status: "queued" }));
        return;
      }
      res.statusCode = 200;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ id: mock.nextId++ }));
    }
  });
});
const scenario = (s) =>
  fetch(`http://localhost:${MOCK_PORT}/__scenario`, { method: "POST", body: JSON.stringify(s) });

// ── helpers ──────────────────────────────────────────────────
const ITEM = { p: "70000000-0000-4000-8000-000000000001", c: "True Royal", s: "M", q: 1, u: 4800, k: "APQ-6099129S7A1", a: 6099129 };

function makeSession() {
  const json = JSON.stringify([ITEM]);
  const metadata = {};
  for (let i = 0; i * 450 < json.length; i++) metadata[`items_${i}`] = json.slice(i * 450, (i + 1) * 450);
  return {
    id: `cs_test_${crypto.randomUUID().replace(/-/g, "")}`,
    object: "checkout.session",
    payment_status: "paid",
    status: "complete",
    amount_total: 5750,
    amount_subtotal: 4800,
    total_details: { amount_shipping: 950, amount_tax: 0 },
    currency: "usd",
    payment_intent: `pi_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`,
    customer_details: { email: "buyer@example.com" },
    collected_information: {
      shipping_details: {
        name: "Test Buyer",
        address: { line1: "1 Stadium Way", line2: "", city: "Providence", state: "RI", postal_code: "02901", country: "US" },
      },
    },
    metadata,
  };
}

async function sendEvent(type, object, eventId = `evt_${crypto.randomUUID().replace(/-/g, "")}`) {
  const payload = JSON.stringify({ id: eventId, object: "event", type, livemode: false, data: { object } });
  const sig = stripe.webhooks.generateTestHeaderString({ payload, secret: WEBHOOK_SECRET });
  const res = await fetch(`${BASE}/api/stripe-webhook`, {
    method: "POST",
    headers: { "stripe-signature": sig, "content-type": "application/json" },
    body: payload,
  });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

const readStore = () => JSON.parse(fs.readFileSync(path.join(STORE_DIR, "orders-store.json"), "utf8"));
const orderBySession = (sid) => Object.values(readStore().orders).find((o) => o.stripe_session_id === sid);

async function ops(action, orderId) {
  const res = await fetch(`${BASE}/api/fulfillment-ops`, {
    method: "POST",
    headers: { "x-ops-key": OPS_KEY, "content-type": "application/json" },
    body: JSON.stringify({ action, orderId }),
  });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

// ── tests ────────────────────────────────────────────────────
async function main() {
  await new Promise((r) => mockServer.listen(MOCK_PORT, r));
  console.log(`Apliiq mock on :${MOCK_PORT}; target ${BASE}\n`);

  // 1. A supplier rejection must be recoverable.
  console.log("1. terminal `failed` is no longer terminal");
  {
    await scenario({ mode: "reject400", posts: [] });
    const sess = makeSession();
    const r = await sendEvent("checkout.session.completed", sess);
    check("rejected submission returns 200 to Stripe", r.status === 200, JSON.stringify(r.body));
    const o = orderBySession(sess.id);
    check("order recorded as paid", o?.status === "paid", o?.status);
    check("submission_status is failed", o?.submission_status === "failed", o?.submission_status);
    check("failure reason is preserved", /400/.test(o?.submission_last_error ?? ""), o?.submission_last_error);

    // The old dead end: release refuses, reconcile refuses.
    const rel = await ops("release", o.id);
    check("release still refuses a failed order (unchanged)", rel.body.resolved === false, JSON.stringify(rel.body));
    const rec = await ops("reconcile", o.id);
    check("reconcile still refuses a failed order (unchanged)", rec.body.resolved === false, JSON.stringify(rec.body));

    // The new way out.
    const postsBefore = mock.posts.length;
    const retry = await ops("retry", o.id);
    check("retry re-queues the failed order", retry.body.resolved === true, JSON.stringify(retry.body));
    check("retry itself submits nothing", mock.posts.length === postsBefore, `posts=${mock.posts.length - postsBefore}`);
    const o2 = orderBySession(sess.id);
    check("order is back to pending_submission", o2?.submission_status === "pending_submission", o2?.submission_status);

    // Fix the cause, then submit for real.
    await scenario({ mode: "ok" });
    const sub = await ops("submit", o.id);
    check("submit after retry succeeds", sub.body.action === "submitted_accepted", JSON.stringify(sub.body));
    const o3 = orderBySession(sess.id);
    check("apliiq order id is now recorded", Boolean(o3?.apliiq_order_id), o3?.apliiq_order_id);

    // And it cannot be double-retried.
    const again = await ops("retry", o.id);
    check("retry refuses an accepted order", again.body.resolved === false, JSON.stringify(again.body));
  }

  // 2. A 2xx with no usable id must not masquerade as submitted.
  console.log("\n2. accepted-without-an-id parks for reconcile, never orphans");
  {
    await scenario({ mode: "ok_no_id" });
    const sess = makeSession();
    const r = await sendEvent("checkout.session.completed", sess);
    check("webhook still returns 200", r.status === 200, JSON.stringify(r.body));
    const o = orderBySession(sess.id);
    check("NOT recorded as submitted", o?.submission_status !== "submitted", o?.submission_status);
    check("parked in needs_reconcile", o?.submission_status === "needs_reconcile", o?.submission_status);
    check("apliiq_order_id left null, not a bogus value", o?.apliiq_order_id == null, String(o?.apliiq_order_id));
    check("reason explains the recovery", /no usable id/i.test(o?.submission_last_error ?? ""), o?.submission_last_error);
    check("reconcile will accept it (not a dead end)", (await ops("reconcile", o.id)).status === 200);
  }

  // 3. A refund must stop fulfillment.
  console.log("\n3. refunds stop fulfillment");
  {
    await scenario({ mode: "ok" });
    const sess = makeSession();
    await sendEvent("checkout.session.completed", sess);
    const o = orderBySession(sess.id);
    check("order starts paid", o?.status === "paid", o?.status);

    const postsBefore = mock.posts.length;
    const r = await sendEvent("charge.refunded", {
      object: "charge",
      payment_intent: sess.payment_intent,
      refunded: true,
      amount: 5750,
      amount_refunded: 5750,
    });
    check("refund event accepted", r.status === 200, JSON.stringify(r.body));
    check("refund matched the order", r.body.order === o.id, JSON.stringify(r.body));
    const o2 = orderBySession(sess.id);
    check("order status flipped to refunded", o2?.status === "refunded", o2?.status);

    const sub = await ops("submit", o.id);
    check("submit refuses a refunded order", sub.body.action === "not_eligible", JSON.stringify(sub.body));
    check("nothing was sent to the supplier", mock.posts.length === postsBefore, `posts=${mock.posts.length - postsBefore}`);
    check(
      "already-with-supplier is flagged, not hidden",
      /ALREADY WITH SUPPLIER/.test(o2?.submission_last_error ?? ""),
      o2?.submission_last_error
    );
  }

  // 3b. A partial refund must NOT silently cancel the order.
  console.log("\n3b. partial refund is flagged, not auto-cancelled");
  {
    const sess = makeSession();
    await sendEvent("checkout.session.completed", sess);
    const o = orderBySession(sess.id);
    const r = await sendEvent("charge.refunded", {
      object: "charge",
      payment_intent: sess.payment_intent,
      refunded: false,
      amount: 5750,
      amount_refunded: 1000,
    });
    check("partial refund accepted", r.status === 200, JSON.stringify(r.body));
    check("status deliberately left alone", orderBySession(sess.id)?.status === "paid", orderBySession(sess.id)?.status);
    check("recorded as a partial refund", /partial refund/i.test(r.body.applied ?? ""), JSON.stringify(r.body));
  }

  // 4. A dispute must stop fulfillment.
  console.log("\n4. disputes stop fulfillment");
  {
    const sess = makeSession();
    await sendEvent("checkout.session.completed", sess);
    const o = orderBySession(sess.id);
    const postsBefore = mock.posts.length;
    const r = await sendEvent("charge.dispute.created", {
      object: "dispute",
      payment_intent: sess.payment_intent,
      amount: 5750,
    });
    check("dispute event accepted", r.status === 200, JSON.stringify(r.body));
    const o2 = orderBySession(sess.id);
    check("order status flipped to cancelled", o2?.status === "cancelled", o2?.status);
    const sub = await ops("submit", o.id);
    check("submit refuses a disputed order", sub.body.action === "not_eligible", JSON.stringify(sub.body));
    check("nothing was sent to the supplier", mock.posts.length === postsBefore, `posts=${mock.posts.length - postsBefore}`);
  }

  // 5. An unmatched refund must not 500 into a Stripe retry storm.
  console.log("\n5. unmatched refund is recorded, not retried forever");
  {
    const r = await sendEvent("charge.refunded", {
      object: "charge",
      payment_intent: `pi_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`,
      refunded: true,
      amount: 100,
      amount_refunded: 100,
    });
    check("returns 200 (no retry storm)", r.status === 200, JSON.stringify(r.body));
    check("reports no match", r.body.matched === false, JSON.stringify(r.body));
  }

  await sleep(100);
  console.log(`\n${passed} passed, ${failed} failed`);
  mockServer.close();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
