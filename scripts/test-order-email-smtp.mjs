/**
 * Order confirmation over Google Workspace SMTP.
 *
 * test-order-email.mjs covers the HTTP adapter. This covers the one the
 * site will actually use, because goool.shop is a Workspace domain and
 * hello@goool.shop is a real inbox. Testing only the HTTP path would
 * have left the live path unexercised.
 *
 * Runs a minimal SMTP server in-process: no network, no credentials, no
 * mail leaves the machine.
 *
 *   STORE_DIR=<dir> node scripts/test-order-email-smtp.mjs <baseUrl> <smtpPort>
 *
 * Point STORE_DIR (and the server's ORDERS_TEST_STORE) at a directory
 * OUTSIDE any OneDrive-synced folder. The file store writes via
 * write-temp-then-rename, and OneDrive holds a lock on the target long
 * enough that the rename intermittently fails with EPERM on Windows.
 * That, not the application, is what made these suites look flaky.
 */
import net from "node:net";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Stripe from "stripe";

const BASE = process.argv[2] ?? "http://localhost:3996";
const SMTP_PORT = Number(process.argv[3] ?? 4466);
const STORE_DIR = process.env.STORE_DIR ?? "./tmp/orders-test-store";
const WEBHOOK_SECRET = process.env.TEST_WEBHOOK_SECRET ?? "whsec_test_local_secret";
const stripe = new Stripe("sk_test_dummy_key_not_real");

let passed = 0, failed = 0;
const check = (name, cond, detail = "") => {
  if (cond) { passed++; console.log(`  PASS  ${name}`); }
  else { failed++; console.log(`  FAIL  ${name}  ${detail}`); }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── minimal SMTP server ──────────────────────────────────────
// mode: ok | authfail | rcptreject
const smtp = { mode: "ok", received: [], authSeen: null };
const smtpServer = net.createServer((sock) => {
  let buf = "";
  let inData = false;
  let msg = { from: "", to: [], data: "" };
  const send = (s) => sock.write(s + "\r\n");
  send("220 mock.goool.shop ESMTP ready");

  sock.on("data", (chunk) => {
    buf += chunk.toString("utf8");
    for (;;) {
      if (inData) {
        const end = buf.indexOf("\r\n.\r\n");
        if (end < 0) return;
        msg.data += buf.slice(0, end);
        buf = buf.slice(end + 5);
        inData = false;
        smtp.received.push({ ...msg });
        msg = { from: "", to: [], data: "" };
        send("250 2.0.0 OK queued");
        continue;
      }
      const nl = buf.indexOf("\r\n");
      if (nl < 0) return;
      const line = buf.slice(0, nl);
      buf = buf.slice(nl + 2);
      const up = line.toUpperCase();

      if (up.startsWith("EHLO") || up.startsWith("HELO")) {
        send("250-mock.goool.shop");
        send("250-AUTH LOGIN PLAIN");
        send("250 8BITMIME");
      } else if (up.startsWith("AUTH LOGIN")) {
        send("334 VXNlcm5hbWU6");
        sock.once("data", (u) => {
          smtp.authSeen = Buffer.from(u.toString().trim(), "base64").toString();
          send("334 UGFzc3dvcmQ6");
          sock.once("data", () => {
            if (smtp.mode === "authfail") send("535 5.7.8 Username and Password not accepted");
            else send("235 2.7.0 Accepted");
          });
        });
        return;
      } else if (up.startsWith("AUTH PLAIN")) {
        const b64 = line.split(" ")[2] ?? "";
        smtp.authSeen = Buffer.from(b64, "base64").toString().split("\0").filter(Boolean)[0] ?? null;
        if (smtp.mode === "authfail") send("535 5.7.8 Username and Password not accepted");
        else send("235 2.7.0 Accepted");
      } else if (up.startsWith("MAIL FROM")) {
        msg.from = (line.match(/<([^>]*)>/) || [, ""])[1];
        send("250 2.1.0 OK");
      } else if (up.startsWith("RCPT TO")) {
        if (smtp.mode === "rcptreject") { send("550 5.1.1 No such user"); continue; }
        msg.to.push((line.match(/<([^>]*)>/) || [, ""])[1]);
        send("250 2.1.5 OK");
      } else if (up.startsWith("DATA")) {
        inData = true;
        send("354 End data with <CR><LF>.<CR><LF>");
      } else if (up.startsWith("QUIT")) {
        send("221 2.0.0 Bye");
        sock.end();
        return;
      } else if (up.startsWith("RSET") || up.startsWith("NOOP")) {
        send("250 2.0.0 OK");
      } else {
        send("250 2.0.0 OK");
      }
    }
  });
  sock.on("error", () => {});
});

// ── helpers ──────────────────────────────────────────────────
const ITEMS = [
  { p: "70000000-0000-4000-8000-000000000001", c: "True Royal", s: "M", q: 1, u: 4800, k: "APQ-6099129S7A1", a: 6099129 },
];
function makeSession(email = "buyer@example.com") {
  const json = JSON.stringify(ITEMS);
  const metadata = {};
  for (let i = 0; i * 450 < json.length; i++) metadata[`items_${i}`] = json.slice(i * 450, (i + 1) * 450);
  return {
    id: `cs_test_${crypto.randomUUID().replace(/-/g, "")}`,
    object: "checkout.session",
    payment_status: "paid", status: "complete",
    amount_total: 5750, amount_subtotal: 4800,
    total_details: { amount_shipping: 950, amount_tax: 0 },
    currency: "usd",
    payment_intent: `pi_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`,
    customer_details: { email },
    collected_information: { shipping_details: {
      name: "Test Buyer",
      address: { line1: "1 Stadium Way", line2: "", city: "Providence", state: "RI", postal_code: "02901", country: "US" },
    } },
    metadata,
  };
}
async function sendEvent(object, eventId = `evt_${crypto.randomUUID().replace(/-/g, "")}`) {
  const payload = JSON.stringify({ id: eventId, object: "event", type: "checkout.session.completed", livemode: false, data: { object } });
  const sig = stripe.webhooks.generateTestHeaderString({ payload, secret: WEBHOOK_SECRET });
  const res = await fetch(`${BASE}/api/stripe-webhook`, {
    method: "POST", headers: { "stripe-signature": sig, "content-type": "application/json" }, body: payload,
  });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}
const readStore = () => JSON.parse(fs.readFileSync(path.join(STORE_DIR, "orders-store.json"), "utf8"));
const orderBySession = (sid) => Object.values(readStore().orders).find((o) => o.stripe_session_id === sid);
const refOf = (id) => `GOOOL-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
const decodeBody = (raw) => {
  // headers may be quoted-printable / base64 encoded by nodemailer
  let out = raw;
  if (/Content-Transfer-Encoding:\s*base64/i.test(raw)) {
    out += "\n" + raw.split(/\r?\n\r?\n/).slice(1).map((p) => {
      try { return Buffer.from(p.replace(/\s+/g, ""), "base64").toString("utf8"); } catch { return ""; }
    }).join("\n");
  }
  return out.replace(/=\r?\n/g, "").replace(/=3D/g, "=");
};

async function main() {
  await new Promise((r) => smtpServer.listen(SMTP_PORT, "127.0.0.1", r));
  console.log(`SMTP mock on 127.0.0.1:${SMTP_PORT}   target ${BASE}\n`);

  console.log("1. a paid order is delivered over Workspace SMTP");
  const sess = makeSession();
  {
    const r = await sendEvent(sess);
    check("webhook returns 200", r.status === 200, JSON.stringify(r.body));
    check("confirmation reported sent", r.body.confirmation === "sent", JSON.stringify(r.body));
    await sleep(200);
    check("SMTP server received exactly one message", smtp.received.length === 1, `got ${smtp.received.length}`);

    const m = smtp.received[0] ?? { data: "", to: [], from: "" };
    const body = decodeBody(m.data);
    const o = orderBySession(sess.id);
    const ref = refOf(o.id);
    check("authenticated as hello@goool.shop", smtp.authSeen === "hello@goool.shop", String(smtp.authSeen));
    check("envelope sender is the Workspace account", /hello@goool\.shop/.test(m.from), m.from);
    check("envelope recipient is the buyer", m.to.includes("buyer@example.com"), JSON.stringify(m.to));
    check("From header shows GOOOL", /^From:.*GOOOL/mi.test(body), (body.match(/^From:.*/mi) || [])[0]);
    check("Reply-To is hello@goool.shop", /^Reply-To:.*hello@goool\.shop/mi.test(body), (body.match(/^Reply-To:.*/mi) || [])[0]);
    check("Subject carries the order reference", body.includes(ref), (body.match(/^Subject:.*/mi) || [])[0]);
    check("multipart: both html and text parts", /text\/html/i.test(body) && /text\/plain/i.test(body));
    check("body shows the price paid", /\$48\.00/.test(body));
    check("body shows the total", /\$57\.50/.test(body));
    check("body does not claim it shipped", !/(on its way now|has shipped|dispatched)/i.test(body));
    check("order marked as confirmation sent", Boolean(o?.confirmation_sent_at), String(o?.confirmation_sent_at));
  }

  console.log("\n2. a rejected recipient is never recorded as sent");
  {
    smtp.mode = "rcptreject";
    const s2 = makeSession("nobody@example.com");
    const r = await sendEvent(s2);
    check("webhook still 200", r.status === 200, JSON.stringify(r.body));
    check("reports failed, not sent", r.body.confirmation === "failed", JSON.stringify(r.body));
    const o = orderBySession(s2.id);
    check("claim released for a later retry", o?.confirmation_sent_at == null, String(o?.confirmation_sent_at));
    check("order still recorded as paid", o?.status === "paid", o?.status);
  }

  console.log("\n3. bad credentials fail loudly and stay recoverable");
  {
    smtp.mode = "authfail";
    const s3 = makeSession("third@example.com");
    const r = await sendEvent(s3);
    check("webhook still 200 (no retry storm on a captured payment)", r.status === 200, JSON.stringify(r.body));
    check("reports failed", r.body.confirmation === "failed", JSON.stringify(r.body));
    const o = orderBySession(s3.id);
    check("claim released", o?.confirmation_sent_at == null, String(o?.confirmation_sent_at));

    // credentials fixed, a later delivery gets the receipt out
    smtp.mode = "ok";
    const before = smtp.received.length;
    const r2 = await sendEvent(s3);
    check("retry after fixing credentials delivers", r2.body.confirmation === "sent", JSON.stringify(r2.body));
    await sleep(200);
    check("exactly one message for that order", smtp.received.length === before + 1, `got ${smtp.received.length - before}`);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  smtpServer.close();
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); smtpServer.close(); process.exit(1); });
