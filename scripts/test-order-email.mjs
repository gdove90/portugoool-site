/**
 * Order confirmation email regression.
 *
 * The receipt is the only thing a customer gets from GOOOL itself, so
 * the failure modes that matter are: sending twice, sending nothing and
 * believing we sent, claiming the parcel shipped when it has not, and
 * letting a mail outage take down the payment webhook.
 *
 *   STORE_DIR=<dir> node scripts/test-order-email.mjs <baseUrl> <apliiqPort> <mailPort>
 *
 * Point STORE_DIR (and the server's ORDERS_TEST_STORE) at a directory
 * OUTSIDE any OneDrive-synced folder. The file store writes via
 * write-temp-then-rename, and OneDrive holds a lock on the target long
 * enough that the rename intermittently fails with EPERM on Windows.
 * That, not the application, is what made these suites look flaky.
 *
 * Writes the LAST captured email to tmp/order-confirmation-preview.html
 * so the rendered result can actually be looked at, not just asserted on.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Stripe from "stripe";

const BASE = process.argv[2] ?? "http://localhost:3996";
const APLIIQ_PORT = Number(process.argv[3] ?? 4242);
const MAIL_PORT = Number(process.argv[4] ?? 4455);
const STORE_DIR = process.env.STORE_DIR ?? "./tmp/orders-test-store";
const WEBHOOK_SECRET = process.env.TEST_WEBHOOK_SECRET ?? "whsec_test_local_secret";
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

// ── mock Apliiq (accepts everything) ─────────────────────────
const apliiq = http.createServer((req, res) => {
  let b = "";
  req.on("data", (c) => (b += c));
  req.on("end", () => {
    if (req.method === "GET") return res.end("[]");
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ id: 970001 }));
  });
});

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

// ── helpers ──────────────────────────────────────────────────
const ITEMS = [
  { p: "70000000-0000-4000-8000-000000000001", c: "True Royal", s: "M", q: 2, u: 4800, k: "APQ-6099129S7A1", a: 6099129 },
  { p: "80000000-0000-4000-8000-000000000005", c: "Gray Heather", s: "L", q: 1, u: 10800, k: "APQ-6112046S8A1", a: 6112046 },
];

function makeSession(email = "buyer@example.com") {
  const json = JSON.stringify(ITEMS);
  const metadata = {};
  for (let i = 0; i * 450 < json.length; i++) metadata[`items_${i}`] = json.slice(i * 450, (i + 1) * 450);
  return {
    id: `cs_test_${crypto.randomUUID().replace(/-/g, "")}`,
    object: "checkout.session",
    payment_status: "paid",
    status: "complete",
    amount_total: 21350,
    amount_subtotal: 20400,
    total_details: { amount_shipping: 950, amount_tax: 0 },
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

const readStore = () => JSON.parse(fs.readFileSync(path.join(STORE_DIR, "orders-store.json"), "utf8"));
const orderBySession = (sid) => Object.values(readStore().orders).find((o) => o.stripe_session_id === sid);
const refOf = (id) => `GOOOL-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

async function main() {
  await new Promise((r) => apliiq.listen(APLIIQ_PORT, r));
  await new Promise((r) => mailServer.listen(MAIL_PORT, r));
  console.log(`Apliiq mock :${APLIIQ_PORT}   mail mock :${MAIL_PORT}   target ${BASE}\n`);

  // 1. a paid order produces exactly one correct email
  console.log("1. a paid order emails the customer");
  const sess = makeSession();
  {
    const r = await sendEvent("checkout.session.completed", sess);
    check("webhook returns 200", r.status === 200, JSON.stringify(r.body));
    check("webhook reports the confirmation sent", r.body.confirmation === "sent", JSON.stringify(r.body));
    check("exactly one email", mail.sent.length === 1, `sent=${mail.sent.length}`);

    const m = mail.sent[0] ?? {};
    const o = orderBySession(sess.id);
    const ref = refOf(o.id);
    check("addressed to the buyer", Array.isArray(m.to) && m.to[0] === "buyer@example.com", JSON.stringify(m.to));
    check("from GOOOL, not a bare address", /GOOOL/.test(m.from ?? ""), m.from);
    check("reply_to is a real inbox", /@goool\.shop/.test(m.reply_to ?? ""), m.reply_to);
    check("subject carries the order reference", (m.subject ?? "").includes(ref), m.subject);

    const html = m.html ?? "";
    const text = m.text ?? "";
    check("html and plain text are both present", html.length > 500 && text.length > 200, `html=${html.length} text=${text.length}`);
    check("shows both product names", /Performance Badge Tee/.test(html) && /Circular Center Crewneck/.test(html));
    check("shows colour and size", /True Royal/.test(html) && /Gray Heather/.test(html));
    check("line total uses qty x unit price ($96.00)", /\$96\.00/.test(html), "2 x $48");
    check("shows the crewneck at the price paid ($108.00)", /\$108\.00/.test(html));
    check("shows shipping ($9.50)", /\$9\.50/.test(html));
    check("shows total paid ($213.50)", /\$213\.50/.test(html));
    check("shows the shipping address", /1 Stadium Way/.test(html) && /02901/.test(html));
    check("links to track-order", /\/track-order/.test(html));
    check("states it is printed to order", /printed to order/i.test(html));
    check("does NOT claim the parcel shipped", !/(on its way now|has shipped|dispatched)/i.test(html));
    check("does NOT invent a tracking number", !/tracking number[:\s]*[A-Z0-9]{6,}/i.test(html));
    check("declares itself transactional, not marketing", /not marketing/i.test(html));
    check("carries the independence disclaimer", /not affiliated with/i.test(html));
    check("plain text mirrors the reference", text.includes(ref));

    fs.mkdirSync("tmp", { recursive: true });
    fs.writeFileSync("tmp/order-confirmation-preview.html", html);
    fs.writeFileSync("tmp/order-confirmation-preview.txt", text);
    console.log("        -> wrote tmp/order-confirmation-preview.html");
  }

  // 2. redelivery must not mail twice
  console.log("\n2. redelivery never mails twice");
  {
    const before = mail.sent.length;
    const same = await sendEvent("checkout.session.completed", sess, "evt_dupe_email_1");
    const again = await sendEvent("checkout.session.completed", sess, "evt_dupe_email_1");
    check("duplicate event id is deduped", again.body.duplicate === true, JSON.stringify(again.body));
    check("distinct event, same session, reports already_sent", same.body.confirmation === "already_sent", JSON.stringify(same.body));
    check("no second email", mail.sent.length === before, `sent=${mail.sent.length - before}`);
  }

  // 3. a provider failure must not be recorded as sent
  console.log("\n3. a mail outage is recoverable, not silently lost");
  {
    await setMailMode("fail");
    const s2 = makeSession("second@example.com");
    const r = await sendEvent("checkout.session.completed", s2);
    check("webhook still returns 200 (no retry storm)", r.status === 200, JSON.stringify(r.body));
    check("reports failed, not sent", r.body.confirmation === "failed", JSON.stringify(r.body));
    const o = orderBySession(s2.id);
    check("claim released, so a retry can still deliver", o?.confirmation_sent_at == null, String(o?.confirmation_sent_at));
    check("order itself is still paid and recorded", o?.status === "paid", o?.status);

    // provider recovers, a later delivery gets the receipt out
    await setMailMode("ok");
    const before = mail.sent.length;
    const r2 = await sendEvent("checkout.session.completed", s2);
    check("retry after recovery sends it", r2.body.confirmation === "sent", JSON.stringify(r2.body));
    check("exactly one email for that order", mail.sent.length === before + 1, `sent=${mail.sent.length - before}`);
    check("addressed to the right buyer", mail.sent.at(-1)?.to?.[0] === "second@example.com");
    const o2 = orderBySession(s2.id);
    check("now marked as sent", Boolean(o2?.confirmation_sent_at), String(o2?.confirmation_sent_at));
  }

  // 4. an unpaid session must not be thanked for a payment
  console.log("\n4. unpaid orders are not thanked for paying");
  {
    const before = mail.sent.length;
    const s3 = makeSession("pending@example.com");
    s3.payment_status = "unpaid";
    const r = await sendEvent("checkout.session.completed", s3);
    check("webhook accepts it", r.status === 200, JSON.stringify(r.body));
    check("no confirmation email", mail.sent.length === before, `sent=${mail.sent.length - before}`);
    check("order is pending, not paid", orderBySession(s3.id)?.status === "pending");
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
