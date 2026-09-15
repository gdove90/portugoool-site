/**
 * End-to-end test for the Stripe → orders → Apliiq pipeline.
 *
 * Runs against a Next dev server started with test-only env
 * (ORDERS_TEST_STORE file store, APLIIQ_API_BASE pointed at the mock
 * below, test Stripe webhook secret). No real Stripe or Apliiq calls,
 * no real credentials, no orders placed anywhere.
 *
 *   node scripts/test-integration.mjs [baseUrl]
 *
 * Expects env: TEST_WEBHOOK_SECRET, TEST_APLIIQ_SECRET, TEST_APLIIQ_APPID,
 * MOCK_PORT (Apliiq mock listens here), STORE_DIR (file store to inspect).
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Stripe from "stripe";

const BASE = process.argv[2] ?? "http://localhost:3999";
const WEBHOOK_SECRET = process.env.TEST_WEBHOOK_SECRET ?? "whsec_test_local_secret";
const APLIIQ_SECRET = process.env.TEST_APLIIQ_SECRET ?? "test_apliiq_shared_secret";
const MOCK_PORT = Number(process.env.MOCK_PORT ?? 4242);
const STORE_DIR = process.env.STORE_DIR ?? "./tmp/orders-test-store";

let passed = 0;
let failed = 0;
function check(name, cond, detail = "") {
  if (cond) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}  ${detail}`);
  }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Apliiq mock ──────────────────────────────────────────────
const mock = {
  mode: "ok", // ok | accepted202 | timeout | err500 | reject400
  posts: [],
  listOrders: [],
  nextId: 900001,
};
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
      res.end(JSON.stringify(mock.listOrders));
      return;
    }
    if (req.url === "/v1/Order" && req.method === "POST") {
      const payload = JSON.parse(body);
      mock.posts.push(payload);
      if (mock.mode === "timeout") return; // never respond
      if (mock.mode === "err500") {
        res.statusCode = 500;
        res.end("internal");
        return;
      }
      if (mock.mode === "reject400") {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "bad sku" }));
        return;
      }
      res.statusCode = mock.mode === "accepted202" ? 202 : 200;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ id: mock.nextId++ }));
      return;
    }
    res.statusCode = 404;
    res.end();
  });
});

// ── helpers ──────────────────────────────────────────────────
const stripe = new Stripe("sk_test_dummy_key_not_real");

function makeSession(overrides = {}) {
  const items = overrides.items ?? [
    { p: "70000000-0000-4000-8000-000000000001", c: "True Royal", s: "M", q: 1 },
  ];
  const json = JSON.stringify(items);
  const metadata = {};
  for (let i = 0; i * 450 < json.length; i++)
    metadata[`items_${i}`] = json.slice(i * 450, (i + 1) * 450);
  return {
    id: overrides.sessionId ?? `cs_test_${crypto.randomUUID().replace(/-/g, "")}`,
    object: "checkout.session",
    payment_status: overrides.payment_status ?? "paid",
    status: "complete",
    amount_total: overrides.amount_total ?? 5750,
    amount_subtotal: 4800,
    total_details: { amount_shipping: 950, amount_tax: 0 },
    currency: "usd",
    payment_intent: `pi_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`,
    customer_details: { email: overrides.email ?? "buyer@example.com" },
    collected_information: {
      shipping_details: {
        name: "Test Buyer",
        address: {
          line1: "1 Stadium Way",
          line2: "",
          city: "Providence",
          state: "RI",
          postal_code: "02901",
          country: "US",
        },
      },
    },
    metadata,
  };
}

async function sendEvent(type, session, eventId = `evt_${crypto.randomUUID().replace(/-/g, "")}`) {
  const payload = JSON.stringify({
    id: eventId,
    object: "event",
    type,
    data: { object: session },
  });
  const sig = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: WEBHOOK_SECRET,
  });
  const res = await fetch(`${BASE}/api/stripe-webhook`, {
    method: "POST",
    headers: { "stripe-signature": sig, "content-type": "application/json" },
    body: payload,
  });
  return { status: res.status, body: await res.json().catch(() => ({})), eventId };
}

function readStore() {
  return JSON.parse(fs.readFileSync(path.join(STORE_DIR, "orders-store.json"), "utf8"));
}
function orderBySession(sessionId) {
  return Object.values(readStore().orders).find((o) => o.stripe_session_id === sessionId);
}
function orderNumberOf(id) {
  return `GOOOL-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

// ── tests ────────────────────────────────────────────────────
async function main() {
  await new Promise((r) => mockServer.listen(MOCK_PORT, r));
  console.log(`Apliiq mock on :${MOCK_PORT}; target ${BASE}\n`);

  // 0. signature enforcement
  {
    const res = await fetch(`${BASE}/api/stripe-webhook`, {
      method: "POST",
      headers: { "stripe-signature": "t=1,v1=deadbeef" },
      body: "{}",
    });
    check("rejects invalid webhook signature (400)", res.status === 400);
    const res2 = await fetch(`${BASE}/api/stripe-webhook`, { method: "POST", body: "{}" });
    check("rejects missing webhook signature (400)", res2.status === 400);
  }

  // A. happy path: paid card order → accepted by Apliiq exactly once
  const sessA = makeSession();
  {
    const r = await sendEvent("checkout.session.completed", sessA);
    check("paid session returns 200", r.status === 200, JSON.stringify(r.body));
    check("submission accepted", r.body.submission === "submitted_accepted", JSON.stringify(r.body));
    const o = orderBySession(sessA.id);
    check("order persisted as paid", o?.status === "paid");
    check("order snapshot has totals + address", o?.total_cents === 5750 && o?.shipping_address?.line1 === "1 Stadium Way");
    check("apliiq order id recorded", Boolean(o?.apliiq_order_id));
    check("exactly one Apliiq submission", mock.posts.length === 1, `posts=${mock.posts.length}`);
    check(
      "submitted SKU is the verified True Royal M SKU",
      mock.posts[0]?.line_items?.[0]?.sku === "APQ-6099129S7A1",
      mock.posts[0]?.line_items?.[0]?.sku
    );
  }

  // B. same event re-delivered → duplicate, no re-processing
  {
    const r1 = await sendEvent("checkout.session.completed", sessA, "evt_replayed_fixed");
    const r2 = await sendEvent("checkout.session.completed", sessA, "evt_replayed_fixed");
    check("replayed event id flagged duplicate", r2.body.duplicate === true, JSON.stringify(r2.body));
    check("replay caused no new submission", mock.posts.length === 1, `posts=${mock.posts.length}`);
    check("still exactly one order for the session", Object.values(readStore().orders).filter((o) => o.stripe_session_id === sessA.id).length === 1);
    void r1;
  }

  // C. same session, different event id → order-level idempotency
  {
    await sendEvent("checkout.session.completed", sessA);
    check("distinct event, same session: no second order", Object.values(readStore().orders).filter((o) => o.stripe_session_id === sessA.id).length === 1);
    check("distinct event, same session: no second submission", mock.posts.length === 1, `posts=${mock.posts.length}`);
  }

  // D. concurrent first deliveries of one new session
  {
    const sessD = makeSession();
    const [r1, r2] = await Promise.all([
      sendEvent("checkout.session.completed", sessD),
      sendEvent("checkout.session.completed", sessD),
    ]);
    await sleep(300);
    const orders = Object.values(readStore().orders).filter((o) => o.stripe_session_id === sessD.id);
    const postsForD = mock.posts.filter((p) => p.order_number === orderNumberOf(orders[0].id));
    check("concurrent delivery: exactly one order", orders.length === 1, `orders=${orders.length}`);
    check("concurrent delivery: exactly one submission", postsForD.length === 1, `posts=${postsForD.length}`);
    check("both webhook responses are 2xx", r1.status === 200 && r2.status === 200);
  }

  // E. Apliiq 202 → pending, never claimed fulfilled
  {
    await fetch(`http://localhost:${MOCK_PORT}/__scenario`, { method: "POST", body: JSON.stringify({ mode: "accepted202" }) });
    const sessE = makeSession();
    const r = await sendEvent("checkout.session.completed", sessE);
    const o = orderBySession(sessE.id);
    check("202 recorded as submitted (pending), not accepted", r.body.submission === "submitted_pending" && o?.submission_status === "submitted", `${r.body.submission}/${o?.submission_status}`);
  }

  // F. timeout → needs_reconcile → reconcile releases → retry succeeds
  {
    await fetch(`http://localhost:${MOCK_PORT}/__scenario`, { method: "POST", body: JSON.stringify({ mode: "timeout" }) });
    const sessF = makeSession();
    const r = await sendEvent("checkout.session.completed", sessF);
    const o = orderBySession(sessF.id);
    check("timeout parks order in needs_reconcile", r.body.submission === "needs_reconcile" && o?.submission_status === "needs_reconcile", JSON.stringify(r.body));
    const postsBefore = mock.posts.length;

    // reconcile: Apliiq has NO record → release for safe retry
    await fetch(`http://localhost:${MOCK_PORT}/__scenario`, { method: "POST", body: JSON.stringify({ mode: "ok", listOrders: [] }) });
    const rec = await fetch(`${BASE}/api/fulfillment-ops`, {
      method: "POST",
      headers: { "x-ops-key": process.env.TEST_OPS_KEY ?? "test_ops_key_0123456789abcdef", "content-type": "application/json" },
      body: JSON.stringify({ action: "reconcile", orderId: o.id }),
    });
    const recBody = await rec.json();
    check("reconcile (not found) releases order", recBody.resolved === true && orderBySession(sessF.id).submission_status === "pending_submission", JSON.stringify(recBody));
    check("reconcile itself never resubmits", mock.posts.length === postsBefore, `posts=${mock.posts.length}`);

    // retry via a fresh (retried) webhook delivery of the same session
    await sendEvent("checkout.session.completed", sessF);
    const o2 = orderBySession(sessF.id);
    check("post-reconcile retry accepted", o2.submission_status === "accepted", o2.submission_status);
  }

  // F2. timeout → reconcile FINDS the order → recorded without resubmission
  {
    await fetch(`http://localhost:${MOCK_PORT}/__scenario`, { method: "POST", body: JSON.stringify({ mode: "timeout" }) });
    const sessF2 = makeSession();
    await sendEvent("checkout.session.completed", sessF2);
    const o = orderBySession(sessF2.id);
    const postsBefore = mock.posts.length;
    await fetch(`http://localhost:${MOCK_PORT}/__scenario`, {
      method: "POST",
      body: JSON.stringify({ mode: "ok", listOrders: [{ id: 777001, order_number: orderNumberOf(o.id) }] }),
    });
    await fetch(`${BASE}/api/fulfillment-ops`, {
      method: "POST",
      headers: { "x-ops-key": process.env.TEST_OPS_KEY ?? "test_ops_key_0123456789abcdef", "content-type": "application/json" },
      body: JSON.stringify({ action: "reconcile", orderId: o.id }),
    });
    const o2 = orderBySession(sessF2.id);
    check("reconcile (found) records Apliiq id, no duplicate order", o2.submission_status === "submitted" && o2.apliiq_order_id === "777001" && mock.posts.length === postsBefore, `${o2.submission_status}/${o2.apliiq_order_id}/posts=${mock.posts.length - postsBefore}`);
  }

  // G. delayed payment: completed(unpaid) → pending; async_payment_succeeded → paid + submitted
  {
    const sessG = makeSession({ payment_status: "unpaid" });
    await sendEvent("checkout.session.completed", sessG);
    let o = orderBySession(sessG.id);
    check("unpaid completed → order pending, not submitted", o?.status === "pending" && o?.submission_status === "not_submitted", `${o?.status}/${o?.submission_status}`);
    const paidSess = { ...sessG, payment_status: "paid" };
    await sendEvent("checkout.session.async_payment_succeeded", paidSess);
    o = orderBySession(sessG.id);
    check("async success → paid + accepted", o?.status === "paid" && o?.submission_status === "accepted", `${o?.status}/${o?.submission_status}`);
  }

  // G2. out of order: async success arrives BEFORE completed
  {
    const sessG2 = makeSession({ payment_status: "paid" });
    await sendEvent("checkout.session.async_payment_succeeded", sessG2);
    await sendEvent("checkout.session.completed", { ...sessG2, payment_status: "unpaid" });
    const orders = Object.values(readStore().orders).filter((o) => o.stripe_session_id === sessG2.id);
    check("out-of-order events: one order, stays paid+accepted", orders.length === 1 && orders[0].status === "paid" && orders[0].submission_status === "accepted", `${orders.length}/${orders[0]?.status}/${orders[0]?.submission_status}`);
  }

  // H. async payment failed → cancelled
  {
    const sessH = makeSession({ payment_status: "unpaid" });
    await sendEvent("checkout.session.completed", sessH);
    await sendEvent("checkout.session.async_payment_failed", sessH);
    const o = orderBySession(sessH.id);
    check("async failure cancels pending order", o?.status === "cancelled", o?.status);
  }

  // I. rejection (4xx) → failed, visible error, no retry storm
  {
    await fetch(`http://localhost:${MOCK_PORT}/__scenario`, { method: "POST", body: JSON.stringify({ mode: "reject400" }) });
    const sessI = makeSession();
    const r = await sendEvent("checkout.session.completed", sessI);
    const o = orderBySession(sessI.id);
    check("supplier rejection recorded as failed", r.body.submission === "failed" && o?.submission_status === "failed" && /bad sku/.test(o?.submission_last_error ?? ""), `${o?.submission_status}`);
    await fetch(`http://localhost:${MOCK_PORT}/__scenario`, { method: "POST", body: JSON.stringify({ mode: "ok" }) });
  }

  // J. unmapped variant → failed with explicit error, nothing submitted
  {
    const sessJ = makeSession({ items: [{ p: "70000000-0000-4000-8000-000000000001", c: "Neon Green", s: "M", q: 1 }] });
    const postsBefore = mock.posts.length;
    await sendEvent("checkout.session.completed", sessJ);
    const o = orderBySession(sessJ.id);
    check("unmapped variant → failed, never substituted or submitted", o?.submission_status === "failed" && /Unmapped/.test(o?.submission_last_error ?? "") && mock.posts.length === postsBefore, `${o?.submission_status}/${o?.submission_last_error}`);
  }

  // K. Apliiq fulfillment callback: bad sig rejected; good sig records shipment
  {
    const sessK = makeSession({ items: [{ p: "70000000-0000-4000-8000-000000000004", c: "Black/Natural", s: "OS", q: 2 }], email: "capfan@example.com" });
    await sendEvent("checkout.session.completed", sessK);
    const o = orderBySession(sessK.id);
    check("cap SKU submitted (One Size)", mock.posts.at(-1)?.line_items?.[0]?.sku === "APQ-6098980S34A1", mock.posts.at(-1)?.line_items?.[0]?.sku);

    const callback = JSON.stringify({
      order_id: o.apliiq_order_id,
      status: "success",
      tracking_company: "USPS",
      tracking_numbers: ["9400100000000000000001"],
      tracking_urls: ["https://tools.usps.com/go/TrackConfirmAction?tLabels=9400100000000000000001"],
      line_items: [{ sku: "APQ-6098980S34A1", quantity: 2 }],
    });
    const badRes = await fetch(`${BASE}/api/apliiq-fulfillment`, {
      method: "POST",
      headers: { "x-apliiq-hmac": "not-a-signature" },
      body: callback,
    });
    check("fulfillment callback with bad signature → 401", badRes.status === 401);

    const sig = crypto
      .createHmac("sha256", APLIIQ_SECRET)
      .update(Buffer.from(callback, "utf8").toString("base64"))
      .digest("base64");
    const goodRes = await fetch(`${BASE}/api/apliiq-fulfillment`, {
      method: "POST",
      headers: { "x-apliiq-hmac": sig },
      body: callback,
    });
    const goodBody = await goodRes.json();
    check("signed fulfillment callback accepted + matched", goodRes.status === 200 && goodBody.matched === true, JSON.stringify(goodBody));
    const o2 = orderBySession(sessK.id);
    check("order flipped to shipped", o2.fulfillment_status === "shipped", o2.fulfillment_status);

    // L. track-order truthfulness
    const ref = orderNumberOf(o.id);
    const t1 = await fetch(`${BASE}/api/track-order`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reference: ref, email: "capfan@example.com" }),
    });
    const t1b = await t1.json();
    check("track-order finds shipped order with tracking", t1.status === 200 && t1b.status === "Shipped." && t1b.shipments?.[0]?.trackingNumbers?.[0]?.startsWith("94001"), JSON.stringify(t1b));
    const t2 = await fetch(`${BASE}/api/track-order`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reference: ref, email: "wrong@example.com" }),
    });
    check("track-order wrong email → 404 (no info leak)", t2.status === 404);
    const t3 = await fetch(`${BASE}/api/track-order`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reference: "GOOOL-00000000", email: "capfan@example.com" }),
    });
    check("track-order unknown reference → 404", t3.status === 404);
  }

  // M. mixed cart carries every exact SKU
  {
    const sessM = makeSession({
      items: [
        { p: "70000000-0000-4000-8000-000000000001", c: "White", s: "S", q: 1 },
        { p: "70000000-0000-4000-8000-000000000002", c: "Bone", s: "XXL", q: 1 },
        { p: "70000000-0000-4000-8000-000000000003", c: "Washed Grey", s: "L", q: 3 },
      ],
    });
    await sendEvent("checkout.session.completed", sessM);
    const post = mock.posts.at(-1);
    const skus = post.line_items.map((l) => l.sku).sort();
    check(
      "mixed cart submits exact verified SKUs",
      JSON.stringify(skus) === JSON.stringify(["APQ-6099046S6A1", "APQ-6099060S8A1", "APQ-6099064S2A1"].sort()),
      JSON.stringify(skus)
    );
    check("mixed cart keeps quantities", post.line_items.find((l) => l.sku === "APQ-6099060S8A1").quantity === 3);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  mockServer.close();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
