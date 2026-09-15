/**
 * Recovery-path + absence-policy regression, run against a server that
 * does NOT trust list absence (APLIIQ_TRUST_LIST_ABSENCE unset — the
 * production posture). Proves, end to end:
 *   1. a timed-out submission parks in needs_reconcile
 *   2. reconcile with an EMPTY listing stays parked (absence is not
 *      authoritative — supplier processing delays/pagination)
 *   3. the operator "release" action (after human verification) moves
 *      it to pending_submission
 *   4. the operator "submit" action completes the recovery using the
 *      order's persisted payment mode — no Stripe event replay needed
 *      (a replay would hit event dedupe and never resubmit)
 *   5. total supplier submissions for the order: exactly 2 (the
 *      original timed-out attempt + the one authorized retry)
 *
 *   node scripts/test-recovery-path.mjs <baseUrl> <storeDir> <mockPort>
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Stripe from "stripe";

const BASE = process.argv[2] ?? "http://localhost:3996";
const STORE_DIR = process.argv[3] ?? "./tmp/orders-recovery-store";
const MOCK_PORT = Number(process.argv[4] ?? 4244);
const OPS_KEY = "test_ops_key_0123456789abcdef";
const stripe = new Stripe("sk_test_dummy_key_not_real");

let passed = 0, failed = 0;
const check = (name, cond, detail = "") => {
  if (cond) { passed++; console.log(`  PASS  ${name}`); }
  else { failed++; console.log(`  FAIL  ${name}  ${detail}`); }
};

const mock = { mode: "timeout", posts: [] };
const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    if (req.url?.startsWith("/v1/Order") && req.method === "GET") {
      res.setHeader("content-type", "application/json");
      res.end("[]"); // always an empty (but well-formed) listing
      return;
    }
    if (req.url === "/v1/Order" && req.method === "POST") {
      mock.posts.push(JSON.parse(body));
      if (mock.mode === "timeout") return;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ id: 424242 }));
      return;
    }
    res.statusCode = 404;
    res.end();
  });
});

function readStore() {
  return JSON.parse(fs.readFileSync(path.join(STORE_DIR, "orders-store.json"), "utf8"));
}
async function ops(action, orderId) {
  const res = await fetch(`${BASE}/api/fulfillment-ops`, {
    method: "POST",
    headers: { "x-ops-key": OPS_KEY, "content-type": "application/json" },
    body: JSON.stringify({ action, orderId }),
  });
  return { status: res.status, body: await res.json() };
}

await new Promise((r) => server.listen(MOCK_PORT, r));

const items = [{ p: "70000000-0000-4000-8000-000000000001", c: "White", s: "L", q: 1, u: 4800, k: "APQ-6099046S8A1", a: 6099046 }];
const session = {
  id: "cs_test_recovery_" + crypto.randomUUID().replace(/-/g, ""),
  object: "checkout.session", payment_status: "paid", status: "complete",
  amount_total: 4800, amount_subtotal: 4800,
  total_details: { amount_shipping: 0, amount_tax: 0 }, currency: "usd",
  payment_intent: "pi_recovery", customer_details: { email: "recovery@example.com" },
  collected_information: { shipping_details: { name: "Rec Overy", address: { line1: "3 Retry Rd", city: "Warwick", state: "RI", postal_code: "02886", country: "US" } } },
  metadata: { items_0: JSON.stringify(items) },
};
const payload = JSON.stringify({ id: "evt_recovery_1", object: "event", type: "checkout.session.completed", livemode: false, data: { object: session } });
const sig = stripe.webhooks.generateTestHeaderString({ payload, secret: "whsec_test_local_secret" });
await fetch(`${BASE}/api/stripe-webhook`, { method: "POST", headers: { "stripe-signature": sig }, body: payload });

let order = Object.values(readStore().orders).find((o) => o.stripe_session_id === session.id);
check("1. timed-out submission parks in needs_reconcile", order?.submission_status === "needs_reconcile", order?.submission_status);
check("   one supplier POST so far", mock.posts.length === 1, String(mock.posts.length));

const rec = await ops("reconcile", order.id);
order = Object.values(readStore().orders).find((o) => o.stripe_session_id === session.id);
check("2. empty listing does NOT release (absence not authoritative)", rec.body.resolved === false && /not authoritative/.test(rec.body.detail) && order.submission_status === "needs_reconcile", JSON.stringify(rec.body));

// Stripe event replay cannot recover it (event dedupe):
const replay = await fetch(`${BASE}/api/stripe-webhook`, { method: "POST", headers: { "stripe-signature": sig }, body: payload });
const replayBody = await replay.json();
check("3. event replay hits dedupe (recovery needs the ops path)", replayBody.duplicate === true && mock.posts.length === 1, JSON.stringify(replayBody));

const rel = await ops("release", order.id);
order = Object.values(readStore().orders).find((o) => o.stripe_session_id === session.id);
check("4. operator release → pending_submission", rel.body.resolved === true && order.submission_status === "pending_submission", JSON.stringify(rel.body));
check("   release itself submits nothing", mock.posts.length === 1, String(mock.posts.length));

mock.mode = "ok";
const sub = await ops("submit", order.id);
order = Object.values(readStore().orders).find((o) => o.stripe_session_id === session.id);
check("5. operator submit completes recovery (persisted payment mode)", sub.body.action === "submitted_accepted" && order.submission_status === "accepted" && order.apliiq_order_id === "424242", JSON.stringify(sub.body));
check("   exactly 2 supplier POSTs total (timeout + authorized retry)", mock.posts.length === 2, String(mock.posts.length));

const sub2 = await ops("submit", order.id);
check("6. second submit is refused (already accepted)", sub2.body.action === "not_eligible" && mock.posts.length === 2, JSON.stringify(sub2.body));

console.log(`\n${passed} passed, ${failed} failed`);
server.close();
process.exit(failed === 0 ? 0 : 1);
