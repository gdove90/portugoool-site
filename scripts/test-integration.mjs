/**
 * End-to-end test for the Stripe → orders → Apliiq pipeline.
 *
 * Runs against a Next dev server started with test-only env
 * (ORDERS_TEST_STORE file store, APLIIQ_API_BASE pointed at the mock
 * below, test Stripe webhook secret). No real Stripe or Apliiq calls,
 * no real credentials, no orders placed anywhere.
 *
 *   node scripts/test-integration.mjs [baseUrl]
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Stripe from "stripe";

const BASE = process.argv[2] ?? "http://localhost:3999";
const WEBHOOK_SECRET = process.env.TEST_WEBHOOK_SECRET ?? "whsec_test_local_secret";
const APLIIQ_SECRET = process.env.TEST_APLIIQ_SECRET ?? "test_apliiq_shared_secret";
const OPS_KEY = process.env.TEST_OPS_KEY ?? "test_ops_key_0123456789abcdef";
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
// mode: ok | accepted202 | timeout | err500 | reject400
// listBody: raw JSON body served by GET /v1/Order (overrides listOrders)
const mock = { mode: "ok", posts: [], listOrders: [], listBody: null, nextId: 900001 };
const mockServer = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    if (req.url === "/__scenario" && req.method === "POST") {
      Object.assign(mock, { listBody: null }, JSON.parse(body));
      res.end("{}");
      return;
    }
    if (req.url?.startsWith("/v1/Order") && req.method === "GET") {
      res.setHeader("content-type", "application/json");
      res.end(mock.listBody != null ? JSON.stringify(mock.listBody) : JSON.stringify(mock.listOrders));
      return;
    }
    if (req.url === "/v1/Order" && req.method === "POST") {
      const payload = JSON.parse(body);
      mock.posts.push(payload);
      if (mock.mode === "timeout") return;
      if (mock.mode === "err500") { res.statusCode = 500; res.end("internal"); return; }
      if (mock.mode === "reject400") { res.statusCode = 400; res.end(JSON.stringify({ message: "bad sku" })); return; }
      res.statusCode = mock.mode === "accepted202" ? 202 : 200;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ id: mock.nextId++ }));
      return;
    }
    res.statusCode = 404;
    res.end();
  });
});
async function scenario(s) {
  await fetch(`http://localhost:${MOCK_PORT}/__scenario`, { method: "POST", body: JSON.stringify(s) });
}

// ── helpers ──────────────────────────────────────────────────
const stripe = new Stripe("sk_test_dummy_key_not_real");

// Default item mirrors what /api/checkout now snapshots: price, SKU,
// and Apliiq product id are fixed into the session metadata.
const ROYAL_M = { p: "70000000-0000-4000-8000-000000000001", c: "True Royal", s: "M", q: 1, u: 4800, k: "APQ-6099129S7A1", a: 6099129 };

function makeSession(overrides = {}) {
  const items = overrides.items ?? [ROYAL_M];
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
        address: { line1: "1 Stadium Way", line2: "", city: "Providence", state: "RI", postal_code: "02901", country: "US" },
      },
    },
    metadata,
  };
}

async function sendEvent(type, session, eventId = `evt_${crypto.randomUUID().replace(/-/g, "")}`, livemode = false) {
  const payload = JSON.stringify({ id: eventId, object: "event", type, livemode, data: { object: session } });
  const sig = stripe.webhooks.generateTestHeaderString({ payload, secret: WEBHOOK_SECRET });
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
function writeStore(s) {
  fs.writeFileSync(path.join(STORE_DIR, "orders-store.json"), JSON.stringify(s, null, 2));
}
function orderBySession(sessionId) {
  return Object.values(readStore().orders).find((o) => o.stripe_session_id === sessionId);
}
function orderNumberOf(id) {
  return `GOOOL-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}
async function opsReconcile(orderId) {
  const res = await fetch(`${BASE}/api/fulfillment-ops`, {
    method: "POST",
    headers: { "x-ops-key": OPS_KEY, "content-type": "application/json" },
    body: JSON.stringify({ action: "reconcile", orderId }),
  });
  return { status: res.status, body: await res.json() };
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

  // A. happy path
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
    check("submitted SKU comes from the checkout snapshot", mock.posts[0]?.line_items?.[0]?.sku === "APQ-6099129S7A1", mock.posts[0]?.line_items?.[0]?.sku);
  }

  // B. replayed event id
  {
    await sendEvent("checkout.session.completed", sessA, "evt_replayed_fixed");
    const r2 = await sendEvent("checkout.session.completed", sessA, "evt_replayed_fixed");
    check("replayed event id flagged duplicate", r2.body.duplicate === true, JSON.stringify(r2.body));
    check("replay caused no new submission", mock.posts.length === 1, `posts=${mock.posts.length}`);
    check("still exactly one order for the session", Object.values(readStore().orders).filter((o) => o.stripe_session_id === sessA.id).length === 1);
  }

  // C. same session, different event id
  {
    await sendEvent("checkout.session.completed", sessA);
    check("distinct event, same session: no second order", Object.values(readStore().orders).filter((o) => o.stripe_session_id === sessA.id).length === 1);
    check("distinct event, same session: no second submission", mock.posts.length === 1, `posts=${mock.posts.length}`);
  }

  // D. concurrent first deliveries
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

  // E. Apliiq 202 → pending
  {
    await scenario({ mode: "accepted202" });
    const sessE = makeSession();
    const r = await sendEvent("checkout.session.completed", sessE);
    const o = orderBySession(sessE.id);
    check("202 recorded as submitted (pending), not accepted", r.body.submission === "submitted_pending" && o?.submission_status === "submitted", `${r.body.submission}/${o?.submission_status}`);
  }

  // F. timeout → needs_reconcile → (not found) release → retry succeeds
  {
    await scenario({ mode: "timeout" });
    const sessF = makeSession();
    const r = await sendEvent("checkout.session.completed", sessF);
    const o = orderBySession(sessF.id);
    check("timeout parks order in needs_reconcile", r.body.submission === "needs_reconcile" && o?.submission_status === "needs_reconcile", JSON.stringify(r.body));
    const postsBefore = mock.posts.length;

    await scenario({ mode: "ok", listOrders: [] });
    const rec = await opsReconcile(o.id);
    check("reconcile (not found) releases order", rec.body.resolved === true && orderBySession(sessF.id).submission_status === "pending_submission", JSON.stringify(rec.body));
    check("reconcile itself never resubmits", mock.posts.length === postsBefore, `posts=${mock.posts.length}`);

    await sendEvent("checkout.session.completed", sessF);
    check("post-reconcile retry accepted", orderBySession(sessF.id).submission_status === "accepted", orderBySession(sessF.id).submission_status);
  }

  // F2. timeout → reconcile FINDS the order
  {
    await scenario({ mode: "timeout" });
    const sessF2 = makeSession();
    await sendEvent("checkout.session.completed", sessF2);
    const o = orderBySession(sessF2.id);
    const postsBefore = mock.posts.length;
    await scenario({ mode: "ok", listOrders: [{ id: 777001, order_number: orderNumberOf(o.id) }] });
    await opsReconcile(o.id);
    const o2 = orderBySession(sessF2.id);
    check("reconcile (found) records Apliiq id, no duplicate order", o2.submission_status === "submitted" && o2.apliiq_order_id === "777001" && mock.posts.length === postsBefore, `${o2.submission_status}/${o2.apliiq_order_id}`);
  }

  // R3. reconcile: malformed listing shape must stay unresolved
  {
    await scenario({ mode: "timeout" });
    const sessR3 = makeSession();
    await sendEvent("checkout.session.completed", sessR3);
    const o = orderBySession(sessR3.id);
    await scenario({ mode: "ok", listBody: { unexpected: "shape" } });
    const rec = await opsReconcile(o.id);
    check("R3 malformed listing → unresolved, order stays parked", rec.body.resolved === false && orderBySession(sessR3.id).submission_status === "needs_reconcile", JSON.stringify(rec.body));
  }

  // R4. reconcile: rows without any comparable number field → unresolved
  {
    await scenario({ mode: "timeout" });
    const sessR4 = makeSession();
    await sendEvent("checkout.session.completed", sessR4);
    const o = orderBySession(sessR4.id);
    await scenario({ mode: "ok", listBody: [{ id: 1, someOtherField: "x" }, { id: 2 }] });
    const rec = await opsReconcile(o.id);
    check("R4 incomparable rows → unresolved, no retry authorized", rec.body.resolved === false && orderBySession(sessR4.id).submission_status === "needs_reconcile", JSON.stringify(rec.body));
  }

  // R5. reconcile: suspiciously large page (possible truncation) → unresolved
  {
    await scenario({ mode: "timeout" });
    const sessR5 = makeSession();
    await sendEvent("checkout.session.completed", sessR5);
    const o = orderBySession(sessR5.id);
    const bigList = Array.from({ length: 200 }, (_, i) => ({ id: i, order_number: `OTHER-${i}` }));
    await scenario({ mode: "ok", listBody: bigList });
    const rec = await opsReconcile(o.id);
    check("R5 possibly-truncated listing → unresolved", rec.body.resolved === false && orderBySession(sessR5.id).submission_status === "needs_reconcile", JSON.stringify(rec.body));
    // …but a hit inside a large list still resolves:
    await scenario({ mode: "ok", listBody: [...bigList, { id: 888, order_number: orderNumberOf(o.id) }] });
    const rec2 = await opsReconcile(o.id);
    check("R5b hit inside large list still resolves as found", rec2.body.resolved === true && orderBySession(sessR5.id).submission_status === "submitted" && orderBySession(sessR5.id).apliiq_order_id === "888", JSON.stringify(rec2.body));
  }

  // R6. orders stranded in `submitting` recover via reconcile-first
  {
    await scenario({ mode: "ok" });
    const sessR6 = makeSession();
    await sendEvent("checkout.session.completed", sessR6);
    let o = orderBySession(sessR6.id);
    // simulate a crash: force the state back to `submitting`
    const s = readStore();
    s.orders[o.id].submission_status = "submitting";
    s.orders[o.id].apliiq_order_id = null;
    writeStore(s);

    // (a) Apliiq HAS it → recorded, no resubmission
    const postsBefore = mock.posts.length;
    await scenario({ mode: "ok", listOrders: [{ id: 999111, order_number: orderNumberOf(o.id) }] });
    const rec = await opsReconcile(o.id);
    o = orderBySession(sessR6.id);
    check("R6a stuck `submitting` + found → submitted, no resubmit", rec.body.resolved === true && o.submission_status === "submitted" && o.apliiq_order_id === "999111" && mock.posts.length === postsBefore, `${o.submission_status}/${o.apliiq_order_id}`);

    // (b) stranded again, Apliiq does NOT have it → released, then retried safely
    const s2 = readStore();
    s2.orders[o.id].submission_status = "submitting";
    s2.orders[o.id].apliiq_order_id = null;
    writeStore(s2);
    await scenario({ mode: "ok", listOrders: [] });
    const rec2 = await opsReconcile(o.id);
    check("R6b stuck `submitting` + absent → released for safe retry", rec2.body.resolved === true && orderBySession(sessR6.id).submission_status === "pending_submission", JSON.stringify(rec2.body));
    await sendEvent("checkout.session.completed", sessR6);
    check("R6c released order resubmits exactly once", orderBySession(sessR6.id).submission_status === "accepted" && mock.posts.length === postsBefore + 1, `posts=${mock.posts.length - postsBefore}`);
  }

  // R1. snapshot immutability: metadata price/SKU win over the catalog
  {
    const sessR1 = makeSession({
      items: [{ p: "70000000-0000-4000-8000-000000000001", c: "True Royal", s: "M", q: 1, u: 9999, k: "APQ-SNAPSHOT-PROOF-SKU", a: 6099129 }],
    });
    await sendEvent("checkout.session.completed", sessR1);
    const o = orderBySession(sessR1.id);
    const items = readStore().items[o.id];
    const post = mock.posts.at(-1);
    check("R1 persisted unit price is the checkout snapshot, not catalog", items[0].unit_price_cents === 9999, String(items[0].unit_price_cents));
    check("R1 submitted SKU is the snapshot verbatim (no re-resolution)", post.line_items[0].sku === "APQ-SNAPSHOT-PROOF-SKU" && post.line_items[0].price === 99.99, `${post.line_items[0].sku}/${post.line_items[0].price}`);
  }

  // R2. missing price snapshot → refused, no order row
  {
    const sessR2 = makeSession({ items: [{ p: "70000000-0000-4000-8000-000000000001", c: "Black", s: "M", q: 1, k: "APQ-6098962S7A1", a: 6098962 }] });
    const r = await sendEvent("checkout.session.completed", sessR2);
    check("R2 missing price snapshot refused, nothing persisted", r.status === 200 && /price snapshot/.test(r.body.error ?? "") && !orderBySession(sessR2.id), JSON.stringify(r.body));
  }

  // G. delayed payment
  {
    const sessG = makeSession({ payment_status: "unpaid" });
    await sendEvent("checkout.session.completed", sessG);
    let o = orderBySession(sessG.id);
    check("unpaid completed → order pending, not submitted", o?.status === "pending" && o?.submission_status === "not_submitted", `${o?.status}/${o?.submission_status}`);
    await sendEvent("checkout.session.async_payment_succeeded", { ...sessG, payment_status: "paid" });
    o = orderBySession(sessG.id);
    check("async success → paid + accepted", o?.status === "paid" && o?.submission_status === "accepted", `${o?.status}/${o?.submission_status}`);
  }

  // G2. out of order
  {
    const sessG2 = makeSession({ payment_status: "paid" });
    await sendEvent("checkout.session.async_payment_succeeded", sessG2);
    await sendEvent("checkout.session.completed", { ...sessG2, payment_status: "unpaid" });
    const orders = Object.values(readStore().orders).filter((o) => o.stripe_session_id === sessG2.id);
    check("out-of-order events: one order, stays paid+accepted", orders.length === 1 && orders[0].status === "paid" && orders[0].submission_status === "accepted", `${orders.length}/${orders[0]?.status}/${orders[0]?.submission_status}`);
  }

  // H. async failure
  {
    const sessH = makeSession({ payment_status: "unpaid" });
    await sendEvent("checkout.session.completed", sessH);
    await sendEvent("checkout.session.async_payment_failed", sessH);
    check("async failure cancels pending order", orderBySession(sessH.id)?.status === "cancelled");
  }

  // I. supplier rejection
  {
    await scenario({ mode: "reject400" });
    const sessI = makeSession();
    const r = await sendEvent("checkout.session.completed", sessI);
    const o = orderBySession(sessI.id);
    check("supplier rejection recorded as failed", r.body.submission === "failed" && o?.submission_status === "failed" && /bad sku/.test(o?.submission_last_error ?? ""), `${o?.submission_status}`);
    await scenario({ mode: "ok" });
  }

  // J. missing SKU snapshot → failed loudly, nothing submitted
  {
    const sessJ = makeSession({ items: [{ p: "70000000-0000-4000-8000-000000000001", c: "Neon Green", s: "M", q: 1, u: 4800 }] });
    const postsBefore = mock.posts.length;
    await sendEvent("checkout.session.completed", sessJ);
    const o = orderBySession(sessJ.id);
    check("missing SKU snapshot → failed, never substituted or submitted", o?.submission_status === "failed" && /no SKU snapshot/.test(o?.submission_last_error ?? "") && mock.posts.length === postsBefore, `${o?.submission_status}/${o?.submission_last_error}`);
  }

  // K/L. fulfillment callback + track-order
  {
    const sessK = makeSession({
      items: [{ p: "70000000-0000-4000-8000-000000000004", c: "Black/Natural", s: "OS", q: 2, u: 3600, k: "APQ-6098980S34A1", a: 6098980 }],
      email: "capfan@example.com",
    });
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
    const badRes = await fetch(`${BASE}/api/apliiq-fulfillment`, { method: "POST", headers: { "x-apliiq-hmac": "not-a-signature" }, body: callback });
    check("fulfillment callback with bad signature → 401", badRes.status === 401);

    const sig = crypto.createHmac("sha256", APLIIQ_SECRET).update(Buffer.from(callback, "utf8").toString("base64")).digest("base64");
    const goodRes = await fetch(`${BASE}/api/apliiq-fulfillment`, { method: "POST", headers: { "x-apliiq-hmac": sig }, body: callback });
    const goodBody = await goodRes.json();
    check("signed fulfillment callback accepted + matched", goodRes.status === 200 && goodBody.matched === true, JSON.stringify(goodBody));
    check("order flipped to shipped", orderBySession(sessK.id).fulfillment_status === "shipped");

    const ref = orderNumberOf(o.id);
    const t1 = await fetch(`${BASE}/api/track-order`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reference: ref, email: "capfan@example.com" }) });
    const t1b = await t1.json();
    check("track-order finds shipped order with tracking", t1.status === 200 && t1b.status === "Shipped." && t1b.shipments?.[0]?.trackingNumbers?.[0]?.startsWith("94001"), JSON.stringify(t1b));
    const t2 = await fetch(`${BASE}/api/track-order`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reference: ref, email: "wrong@example.com" }) });
    check("track-order wrong email → 404 (no info leak)", t2.status === 404);
    const t3 = await fetch(`${BASE}/api/track-order`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reference: "GOOOL-00000000", email: "capfan@example.com" }) });
    check("track-order unknown reference → 404", t3.status === 404);
  }

  // M. mixed cart: exact SKUs + safe, unique line ids
  {
    const sessM = makeSession({
      items: [
        { p: "70000000-0000-4000-8000-000000000001", c: "White", s: "S", q: 1, u: 4800, k: "APQ-6099046S6A1", a: 6099046 },
        { p: "70000000-0000-4000-8000-000000000002", c: "Bone", s: "XXL", q: 1, u: 7800, k: "APQ-6099064S2A1", a: 6099064 },
        { p: "70000000-0000-4000-8000-000000000003", c: "Washed Grey", s: "L", q: 3, u: 3800, k: "APQ-6099060S8A1", a: 6099060 },
      ],
    });
    await sendEvent("checkout.session.completed", sessM);
    const post = mock.posts.at(-1);
    const skus = post.line_items.map((l) => l.sku).sort();
    check("mixed cart submits exact snapshot SKUs", JSON.stringify(skus) === JSON.stringify(["APQ-6099046S6A1", "APQ-6099060S8A1", "APQ-6099064S2A1"].sort()), JSON.stringify(skus));
    check("mixed cart keeps quantities", post.line_items.find((l) => l.sku === "APQ-6099060S8A1").quantity === 3);
    // R7: identifier safety across ALL submissions this run
    const allIds = mock.posts.flatMap((p) => [p.id, p.number, ...p.line_items.map((l) => l.id)]);
    check("R7 every submitted identifier is a safe integer", allIds.every((n) => Number.isSafeInteger(n)), String(allIds.find((n) => !Number.isSafeInteger(n))));
    // Stable ids mean a legitimate retry of the SAME order reuses its
    // ids (that's the point) — so uniqueness is asserted across
    // DISTINCT orders, deduping repeated submissions first.
    const byOrder = new Map();
    for (const p of mock.posts) byOrder.set(p.order_number, p.line_items.map((l) => l.id));
    const lineIds = [...byOrder.values()].flat();
    check("R7 line-item ids are unique across distinct orders", new Set(lineIds).size === lineIds.length, `${lineIds.length - new Set(lineIds).size} collisions`);
    const retried = mock.posts.filter((p) => p.order_number === mock.posts.find((q) => mock.posts.filter((r) => r.order_number === q.order_number).length > 1)?.order_number);
    if (retried.length > 1) {
      check("R7b a retried order reuses identical stable ids", JSON.stringify(retried[0].line_items.map((l) => l.id)) === JSON.stringify(retried[1].line_items.map((l) => l.id)));
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  mockServer.close();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
