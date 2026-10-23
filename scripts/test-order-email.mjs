/**
 * Order confirmation email regression, for the asynchronous delivery design
 * (designs/18_launch_operations/LAUNCH-SOURCE-OF-TRUTH-2026-09-26.md): the
 * webhook only persists the intent to send ("queued") and the minute worker
 * delivers through the authenticated ops endpoint. Nothing here sends inline
 * except the owner alert and the customer delay notice, which go out the
 * moment a paid order is refused by the supplier.
 *
 * The failure modes that matter: sending twice, sending nothing and believing
 * we sent, claiming the parcel shipped when it has not, letting a mail outage
 * take down the payment webhook, and a supplier failure that nobody hears
 * about.
 *
 *   STORE_DIR=<dir> node scripts/test-order-email.mjs <baseUrl> <apliiqPort> <mailPort> [pgPort]
 *
 * Needs the loopback fixture from scripts/fixtures: postgrest-local.cjs on
 * pgPort (its claim_email_delivery RPC drains the ledger here) and a server
 * started with RESEND_API_KEY set and RESEND_API_BASE pointed at mailPort
 * (see .claude/launch.json "goal-fixture-commerce-mail"). Point STORE_DIR
 * (and the server's ORDERS_TEST_STORE) at a directory OUTSIDE any
 * OneDrive-synced folder: the file store writes via write-temp-then-rename,
 * and OneDrive holds a lock on the target long enough that the rename
 * intermittently fails with EPERM on Windows. Every run uses its own
 * addresses and event ids, so a store or ledger left over from an earlier
 * run cannot change the result.
 *
 * Writes the LAST captured receipt to tmp/order-confirmation-preview.html so
 * the rendered result can actually be looked at, not just asserted on.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Stripe from "stripe";

const BASE = process.argv[2] ?? "http://localhost:3996";
const APLIIQ_PORT = Number(process.argv[3] ?? 4242);
const MAIL_PORT = Number(process.argv[4] ?? 4455);
const PG_PORT = Number(process.argv[5] ?? 4243);
const STORE_DIR = process.env.STORE_DIR ?? "./tmp/orders-test-store";
const WEBHOOK_SECRET = process.env.TEST_WEBHOOK_SECRET ?? "whsec_test_local_secret";
const OPS_KEY = process.env.TEST_OPS_KEY ?? "test_ops_key_0123456789abcdef";
const OWNER_ALERT_TO = "gdove90@goalathletics.shop";
const RUN = crypto.randomUUID().slice(0, 8);
const addr = (name) => `${name}-${RUN}@example.com`;
const stripe = new Stripe("sk_test_dummy_key_not_real");
if (!["localhost", "127.0.0.1"].includes(new URL(BASE).hostname)) throw new Error("Email fixtures are restricted to loopback.");

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

// ── mock Apliiq (accepts everything unless told to reject) ───
const apliiqState = { mode: "ok" };
const apliiq = http.createServer((req, res) => {
  let b = "";
  req.on("data", (c) => (b += c));
  req.on("end", () => {
    if (req.url === "/__mode") {
      apliiqState.mode = JSON.parse(b).mode;
      return res.end("{}");
    }
    if (req.method === "GET") return res.end("[]");
    res.setHeader("content-type", "application/json");
    if (apliiqState.mode === "reject") {
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: "bad sku" }));
    }
    res.end(JSON.stringify({ id: 970001 }));
  });
});
const setApliiqMode = (mode) =>
  fetch(`http://localhost:${APLIIQ_PORT}/__mode`, { method: "POST", body: JSON.stringify({ mode }) });

// ── mock Resend ──────────────────────────────────────────────
const mail = { sent: [], mode: "ok" };
const mailServer = http.createServer((req, res) => {
  let b = "";
  req.on("data", (c) => (b += c));
  req.on("end", () => {
    if (req.url === "/__mode") {
      mail.mode = JSON.parse(b).mode;
      return res.end("{}");
    }
    if (req.url === "/emails" && req.method === "POST") {
      if (mail.mode === "fail") {
        res.statusCode = 422;
        res.setHeader("content-type", "application/json");
        return res.end(JSON.stringify({ message: "domain not verified" }));
      }
      mail.sent.push(JSON.parse(b));
      res.setHeader("content-type", "application/json");
      return res.end(JSON.stringify({ id: `mail_${mail.sent.length}` }));
    }
    res.statusCode = 404;
    res.end();
  });
});
const setMailMode = (mode) =>
  fetch(`http://localhost:${MAIL_PORT}/__mode`, { method: "POST", body: JSON.stringify({ mode }) });
const to = (address) => mail.sent.filter((m) => m.to?.[0] === address);

// ── helpers ──────────────────────────────────────────────────
// Current catalog rows (src/lib/products.ts) with their Apliiq SKUs
// (src/lib/fulfillment.ts): 2 x GA Minimal Tee at $38 and 1 x Heritage
// Hoodie at $78, so the order clears the $70 free-shipping line.
const ITEMS = [
  { p: "80000000-0000-4000-8000-000000000011", c: "Black", s: "M", q: 2, u: 3800, k: "APQ-6206620S7A1", a: 6206620 },
  { p: "80000000-0000-4000-8000-000000000014", c: "Black", s: "M", q: 1, u: 7800, k: "APQ-6210750S7A1", a: 6210750 },
];

function makeSession(email) {
  const json = JSON.stringify(ITEMS);
  const metadata = {};
  for (let i = 0; i * 450 < json.length; i++) metadata[`items_${i}`] = json.slice(i * 450, (i + 1) * 450);
  return {
    id: `cs_test_${crypto.randomUUID().replace(/-/g, "")}`,
    object: "checkout.session",
    payment_status: "paid",
    status: "complete",
    amount_total: 15400,
    amount_subtotal: 15400,
    total_details: { amount_shipping: 0, amount_tax: 0 },
    currency: "usd",
    payment_intent: `pi_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`,
    customer_details: { email },
    collected_information: {
      shipping_details: {
        name: "Test Buyer",
        address: { line1: "1 Stadium Way", line2: "Apt 4", city: "Providence", state: "RI", postal_code: "02901", country: "US" },
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

// What the scheduled worker does every minute (netlify/functions/deliver-emails.mts):
// at most three deliveries per pass, so a pass is repeated until it sends nothing.
async function drainOnce() {
  const res = await fetch(`${BASE}/api/fulfillment-ops`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-ops-key": OPS_KEY },
    body: JSON.stringify({ action: "deliver-emails" }),
  });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}
async function drain() {
  const total = { status: 200, body: {} };
  for (let i = 0; i < 20; i++) {
    const r = await drainOnce();
    total.status = r.status;
    for (const [k, v] of Object.entries(r.body)) total.body[k] = (total.body[k] ?? 0) + v;
    if (!Object.keys(r.body).length || r.status !== 200) break;
  }
  return total;
}

// The delivery ledger as the fixture stub holds it (test-only visibility).
const ledgerUrl = (key) => `http://127.0.0.1:${PG_PORT}/rest/v1/email_deliveries?key=eq.${encodeURIComponent(key)}`;
const ledger = async (key) => (await (await fetch(ledgerUrl(key))).json())[0];
const makeDue = (key) =>
  fetch(ledgerUrl(key), { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ next_attempt_at: new Date().toISOString() }) });

const readStore = () => JSON.parse(fs.readFileSync(path.join(STORE_DIR, "orders-store.json"), "utf8"));
const orderBySession = (sid) => Object.values(readStore().orders).find((o) => o.stripe_session_id === sid);
const refTail = (id) => id.replace(/-/g, "").slice(0, 8).toUpperCase();
const receiptKey = (id) => `order/test/${id}`;
const isReceipt = (m) => /^Order .*confirmed$/.test(m.subject ?? "");

async function main() {
  await new Promise((r) => apliiq.listen(APLIIQ_PORT, r));
  await new Promise((r) => mailServer.listen(MAIL_PORT, r));
  console.log(`Apliiq mock :${APLIIQ_PORT}   mail mock :${MAIL_PORT}   ledger :${PG_PORT}   target ${BASE}   run ${RUN}\n`);

  // A dev server compiles each route on its first request; warm the two this
  // suite drives so the first signed event is judged on behaviour, not build time.
  for (const route of ["/api/stripe-webhook", "/api/fulfillment-ops"]) {
    await fetch(`${BASE}${route}`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }).catch(() => {});
  }

  // 1. a paid order queues exactly one correct receipt, and the worker sends it
  console.log("1. a paid order emails the customer through the worker");
  const buyer = addr("buyer");
  const sess = makeSession(buyer);
  {
    const r = await sendEvent("checkout.session.completed", sess);
    check("webhook returns 200", r.status === 200, `status=${r.status} ${JSON.stringify(r.body)}`);
    check("webhook only queues the receipt (the worker owns sending)", r.body.confirmation === "queued", JSON.stringify(r.body));
    check("nothing is mailed inside the webhook", to(buyer).length === 0, `sent=${to(buyer).length}`);

    const o = orderBySession(sess.id);
    const key = receiptKey(o.id);
    const row = await ledger(key);
    check("the receipt is in the delivery ledger as pending", row?.status === "pending", JSON.stringify(row && { status: row.status }));

    const d = await drain();
    check("worker pass delivers it", d.status === 200 && d.body.sent >= 1, JSON.stringify(d.body));
    check("exactly one email to the buyer", to(buyer).length === 1, `sent=${to(buyer).length}`);
    const after = await ledger(key);
    check("ledger marks it sent with the provider id", after?.status === "sent" && /^mail_\d+$/.test(after.provider_id ?? "") && Boolean(after.sent_at), JSON.stringify(after && { status: after.status, provider_id: after.provider_id }));

    const m = to(buyer)[0] ?? {};
    const tail = refTail(o.id);
    check("it is the receipt", isReceipt(m), m.subject);
    check("from GOAL Athletics at goalathletics.shop", /GOAL Athletics <hello@goalathletics\.shop>/.test(m.from ?? ""), m.from);
    check("replies go to Support", m.reply_to === "support@goalathletics.shop", m.reply_to);
    check("subject carries the order reference", (m.subject ?? "").includes(tail), m.subject);

    const html = m.html ?? "";
    const text = m.text ?? "";
    check("html and plain text are both present", html.length > 500 && text.length > 200, `html=${html.length} text=${text.length}`);
    check("shows both product names", /GA Minimal Tee/.test(html) && /Heritage Hoodie/.test(html));
    check("shows colour and size", /Black/.test(text) && /\bM\b/.test(text));
    check("line total uses qty x unit price ($76.00)", /\$76\.00/.test(html), "2 x $38");
    check("shows the hoodie at the price paid ($78.00)", /\$78\.00/.test(html));
    check("shows free shipping as $0.00", /Shipping: \$0\.00/.test(text));
    check("shows total paid ($154.00)", /\$154\.00/.test(html));
    check("shows the shipping address", /1 Stadium Way/.test(html) && /02901/.test(html));
    check("links to track-order", /\/track-order/.test(html));
    check("does NOT claim the parcel shipped", !/(on its way now|has shipped|dispatched)/i.test(html));
    check("does NOT invent a tracking number", !/tracking number[:\s]*[A-Z0-9]{6,}/i.test(html));
    check("never mentions made-to-order production (owner rule)", !/(printed to order|made to order|on.demand)/i.test(html + text));
    check("is a receipt, not marketing (no unsubscribe)", !/unsubscribe/i.test(html));
    check("carries the independence disclaimer in html and text", /independent brand/i.test(html) && /not affiliated with/i.test(html) && /not affiliated with/i.test(text));
    check("plain text mirrors the reference", text.includes(tail));

    fs.mkdirSync("tmp", { recursive: true });
    fs.writeFileSync("tmp/order-confirmation-preview.html", html);
    fs.writeFileSync("tmp/order-confirmation-preview.txt", text);
    console.log("        -> wrote tmp/order-confirmation-preview.html");
  }

  // 2. redelivery must not mail twice
  console.log("\n2. redelivery never mails twice");
  {
    const dupe = `evt_dupe_${RUN}`;
    const same = await sendEvent("checkout.session.completed", sess, dupe);
    const again = await sendEvent("checkout.session.completed", sess, dupe);
    check("duplicate event id is deduped", again.body.duplicate === true, JSON.stringify(again.body));
    check("distinct event, same session, re-persists intent only", ["queued", "already_sent"].includes(same.body.confirmation), JSON.stringify(same.body));
    await drain();
    check("no second email to the buyer", to(buyer).length === 1, `sent=${to(buyer).length}`);
  }

  // 3. a provider failure must not be recorded as sent
  console.log("\n3. a mail outage is recoverable, not silently lost");
  {
    await setMailMode("fail");
    const second = addr("second");
    const s2 = makeSession(second);
    const r = await sendEvent("checkout.session.completed", s2);
    check("webhook still returns 200 (no retry storm)", r.status === 200, JSON.stringify(r.body));
    const o = orderBySession(s2.id);
    const key = receiptKey(o.id);
    const d = await drain();
    check("worker reports it queued, not sent", d.body.queued >= 1, JSON.stringify(d.body));
    const row = await ledger(key);
    check("ledger keeps it pending with the provider error", row?.status === "pending" && /HTTP 422/.test(row.last_error ?? ""), JSON.stringify(row && { status: row.status, last_error: row.last_error }));
    check("claim released, so a retry can still deliver", row?.lease_until == null, JSON.stringify(row && { lease_until: row.lease_until }));
    check("order itself is still paid and recorded", o?.status === "paid", o?.status);
    check("nothing was mailed to the buyer", to(second).length === 0, `sent=${to(second).length}`);

    // provider recovers; the backoff elapses; the next worker pass gets the receipt out
    await setMailMode("ok");
    await makeDue(key);
    const d2 = await drain();
    check("retry after recovery sends it", d2.body.sent >= 1, JSON.stringify(d2.body));
    check("exactly one email for that order", to(second).length === 1 && isReceipt(to(second)[0]), `sent=${to(second).length}`);
    const row2 = await ledger(key);
    check("now marked as sent, second attempt", row2?.status === "sent" && row2.attempts === 2, JSON.stringify(row2 && { status: row2.status, attempts: row2.attempts }));
  }

  // 4. an unpaid session must not be thanked for a payment
  console.log("\n4. unpaid orders are not thanked for paying");
  {
    const pending = addr("pending");
    const s3 = makeSession(pending);
    s3.payment_status = "unpaid";
    const r = await sendEvent("checkout.session.completed", s3);
    check("webhook accepts it", r.status === 200, JSON.stringify(r.body));
    await drain();
    check("no confirmation email", to(pending).length === 0, `sent=${to(pending).length}`);
    check("order is pending, not paid", orderBySession(s3.id)?.status === "pending");
  }

  // 5. a supplier rejection alerts the owner and warns the customer
  console.log("\n5. a rejected submission alerts the owner and warns the customer");
  {
    await setApliiqMode("reject");
    const fourth = addr("fourth");
    const alertsBefore = to(OWNER_ALERT_TO).length;
    const s4 = makeSession(fourth);
    const r = await sendEvent("checkout.session.completed", s4);
    check("webhook returns 200", r.status === 200, JSON.stringify(r.body));
    check("submission recorded as failed", r.body.submission === "failed", JSON.stringify(r.body));
    const o = orderBySession(s4.id);
    const tail = refTail(o.id);
    const alert = to(OWNER_ALERT_TO).slice(alertsBefore).find((m) => (m.subject ?? "").includes(tail));
    check(`owner alert sent at once to ${OWNER_ALERT_TO}`, Boolean(alert), JSON.stringify(to(OWNER_ALERT_TO).slice(alertsBefore).map((m) => m.subject)));
    const body = `${alert?.subject ?? ""}\n${alert?.text ?? ""}`;
    check("alert names the order", /Action needed/.test(alert?.subject ?? "") && body.includes(tail), alert?.subject);
    check("alert carries reason, timestamp, retry status and action", /Apliiq said: .*bad sku/.test(body) && /Detected: /.test(body) && /Retry status: /.test(body) && /What to do/.test(body));
    check("alert holds no credentials or payment data", !/(sk_|whsec_|rk_|Bearer |card number|\b\d{13,19}\b)/.test(body));
    // The delay notice goes out with the alert, at once; the receipt waits for the worker.
    check("customer gets one delay notice at once, not the receipt", to(fourth).length === 1 && /taking a little longer/.test(to(fourth)[0].subject) && !isReceipt(to(fourth)[0]), JSON.stringify(to(fourth).map((m) => m.subject)));
    check("the delay notice does not claim shipment", !/(has shipped|on its way)/i.test(to(fourth)[0]?.html ?? ""));
    const d = await drain();
    check("worker then sends the customer their receipt", d.body.sent >= 1 && to(fourth).length === 2 && to(fourth).some(isReceipt), `sent=${JSON.stringify(d.body)} customer=${JSON.stringify(to(fourth).map((m) => m.subject))}`);
    await setApliiqMode("ok");
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  apliiq.close();
  mailServer.close();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
