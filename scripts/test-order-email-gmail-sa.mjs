/**
 * Order confirmation via Gmail API + service account impersonation.
 *
 * This is the adapter goool.shop needs: hello@goool.shop has 2-Step
 * Verification OFF, Google will not issue an App Password without it,
 * and plain-password SMTP no longer exists. A delegated service account
 * is the only remaining way to send AS that mailbox.
 *
 * The mock here does NOT rubber-stamp the request. It verifies the JWT
 * signature against a real public key, checks every claim Google checks
 * (iss / sub / scope / aud / exp), and decodes the RFC822 message. A
 * stubbed "return a token" mock would pass even if the signing were
 * broken, which is the part most likely to be wrong.
 *
 *   STORE_DIR=<dir> node scripts/test-order-email-gmail-sa.mjs <baseUrl> <mockPort> <pubKeyPath>
 *
 * Point STORE_DIR (and the server's ORDERS_TEST_STORE) at a directory
 * OUTSIDE any OneDrive-synced folder; OneDrive's lock makes the store's
 * temp-then-rename write fail intermittently with EPERM on Windows.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Stripe from "stripe";

const BASE = process.argv[2] ?? "http://localhost:3996";
const PORT = Number(process.argv[3] ?? 4477);
const PUB_PATH = process.argv[4];
const STORE_DIR = process.env.STORE_DIR ?? "./tmp/orders-test-store";
const WEBHOOK_SECRET = process.env.TEST_WEBHOOK_SECRET ?? "whsec_test_local_secret";
const SA_EMAIL = "goool-mailer@goool-test.iam.gserviceaccount.com";
const stripe = new Stripe("sk_test_dummy_key_not_real");
const PUBLIC_KEY = fs.readFileSync(PUB_PATH, "utf8");

let passed = 0, failed = 0;
const check = (n, c, d = "") => { if (c) { passed++; console.log(`  PASS  ${n}`); } else { failed++; console.log(`  FAIL  ${n}  ${d}`); } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const unb64url = (s) => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");

// ── mock Google ──────────────────────────────────────────────
// mode: ok | unauthorized_client | gmail_reject
const g = { mode: "ok", tokens: 0, sent: [], lastClaims: null, sigValid: null, lastAuth: null };
const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    const json = (code, obj) => {
      res.statusCode = code;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify(obj));
    };

    if (req.url === "/token") {
      g.tokens++;
      const assertion = new URLSearchParams(body).get("assertion") ?? "";
      const [h, p, s] = assertion.split(".");
      try {
        g.lastClaims = JSON.parse(unb64url(p).toString());
        g.sigValid = crypto
          .createVerify("RSA-SHA256")
          .update(`${h}.${p}`)
          .verify(PUBLIC_KEY, unb64url(s));
      } catch {
        g.lastClaims = null;
        g.sigValid = false;
      }
      if (g.mode === "unauthorized_client")
        return json(400, { error: "unauthorized_client", error_description: "Client is unauthorized" });
      if (!g.sigValid) return json(400, { error: "invalid_grant", error_description: "bad signature" });
      return json(200, { access_token: "ya29.mock-token", expires_in: 3599, token_type: "Bearer" });
    }

    if (req.url === "/gmail/v1/users/me/messages/send") {
      g.lastAuth = req.headers.authorization ?? null;
      if (g.mode === "gmail_reject")
        return json(403, { error: { message: "Delegation denied for hello@goool.shop" } });
      try {
        const raw = unb64url(JSON.parse(body).raw).toString("utf8");
        g.sent.push(raw);
      } catch {
        return json(400, { error: { message: "unparseable raw" } });
      }
      return json(200, { id: `mock-msg-${g.sent.length}`, labelIds: ["SENT"] });
    }
    json(404, {});
  });
});

// ── helpers ──────────────────────────────────────────────────
const ITEMS = [{ p: "70000000-0000-4000-8000-000000000001", c: "True Royal", s: "M", q: 1, u: 4800, k: "APQ-6099129S7A1", a: 6099129 }];
function makeSession(email = "buyer@example.com") {
  const j = JSON.stringify(ITEMS);
  const metadata = {};
  for (let i = 0; i * 450 < j.length; i++) metadata[`items_${i}`] = j.slice(i * 450, (i + 1) * 450);
  return {
    id: `cs_test_${crypto.randomUUID().replace(/-/g, "")}`,
    object: "checkout.session", payment_status: "paid", status: "complete",
    amount_total: 5750, amount_subtotal: 4800,
    total_details: { amount_shipping: 950, amount_tax: 0 }, currency: "usd",
    payment_intent: `pi_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`,
    customer_details: { email },
    collected_information: { shipping_details: { name: "Test Buyer", address: { line1: "1 Stadium Way", line2: "", city: "Providence", state: "RI", postal_code: "02901", country: "US" } } },
    metadata,
  };
}
async function sendEvent(object, eventId = `evt_${crypto.randomUUID().replace(/-/g, "")}`) {
  const payload = JSON.stringify({ id: eventId, object: "event", type: "checkout.session.completed", livemode: false, data: { object } });
  const sig = stripe.webhooks.generateTestHeaderString({ payload, secret: WEBHOOK_SECRET });
  const res = await fetch(`${BASE}/api/stripe-webhook`, { method: "POST", headers: { "stripe-signature": sig, "content-type": "application/json" }, body: payload });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}
const readStore = () => JSON.parse(fs.readFileSync(path.join(STORE_DIR, "orders-store.json"), "utf8"));
const orderBySession = (sid) => Object.values(readStore().orders).find((o) => o.stripe_session_id === sid);
const refOf = (id) => `GOOOL-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
const decode = (raw) => raw.replace(/=\r?\n/g, "").replace(/=3D/g, "=");

async function main() {
  await new Promise((r) => server.listen(PORT, "127.0.0.1", r));
  console.log(`Google mock on 127.0.0.1:${PORT}   target ${BASE}\n`);

  console.log("1. the service account really signs, and Gmail really sends");
  const sess = makeSession();
  {
    const r = await sendEvent(sess);
    check("webhook returns 200", r.status === 200, JSON.stringify(r.body));
    check("confirmation reported sent", r.body.confirmation === "sent", JSON.stringify(r.body));
    await sleep(200);

    check("service account took precedence over SMTP", g.tokens === 1, `token calls: ${g.tokens}`);
    check("JWT signature verifies against the public key", g.sigValid === true, String(g.sigValid));
    const c = g.lastClaims ?? {};
    check("iss is the service account", c.iss === SA_EMAIL, c.iss);
    check("sub impersonates hello@goool.shop", c.sub === "hello@goool.shop", c.sub);
    check("scope is gmail.send only", c.scope === "https://www.googleapis.com/auth/gmail.send", c.scope);
    check("aud is the token endpoint", String(c.aud).endsWith("/token"), c.aud);
    check("token is short-lived (<= 5 min)", c.exp - c.iat <= 300, `${c.exp - c.iat}s`);
    check("bearer token used on the send", g.lastAuth === "Bearer ya29.mock-token", String(g.lastAuth));

    check("exactly one message sent", g.sent.length === 1, `${g.sent.length}`);
    const body = decode(g.sent[0] ?? "");
    const o = orderBySession(sess.id);
    const ref = refOf(o.id);
    check("From shows GOOOL", /^From:.*GOOOL/mi.test(body), (body.match(/^From:.*/mi) || [])[0]);
    check("To is the buyer", /^To:.*buyer@example\.com/mi.test(body), (body.match(/^To:.*/mi) || [])[0]);
    check("Reply-To is hello@goool.shop", /^Reply-To:.*hello@goool\.shop/mi.test(body));
    check("Subject carries the order reference", body.includes(ref));
    check("multipart html + text", /text\/html/i.test(body) && /text\/plain/i.test(body));
    check("shows the price paid", /\$48\.00/.test(body));
    check("shows the total", /\$57\.50/.test(body));
    check("does not claim it shipped", !/(on its way now|has shipped|dispatched)/i.test(body));
    check("order marked confirmation sent", Boolean(o?.confirmation_sent_at));
  }

  console.log("\n2. missing domain-wide delegation is reported, not retried blindly");
  {
    g.mode = "unauthorized_client";
    const s2 = makeSession("second@example.com");
    const before = g.sent.length;
    const r = await sendEvent(s2);
    check("webhook still 200", r.status === 200, JSON.stringify(r.body));
    check("reports failed", r.body.confirmation === "failed", JSON.stringify(r.body));
    check("nothing was sent", g.sent.length === before, `${g.sent.length - before}`);
    const o = orderBySession(s2.id);
    check("claim released for a retry", o?.confirmation_sent_at == null, String(o?.confirmation_sent_at));
    check("order still paid", o?.status === "paid", o?.status);
  }

  console.log("\n3. a Gmail-side rejection is never recorded as sent");
  {
    g.mode = "gmail_reject";
    const s3 = makeSession("third@example.com");
    const r = await sendEvent(s3);
    check("reports failed", r.body.confirmation === "failed", JSON.stringify(r.body));
    check("claim released", orderBySession(s3.id)?.confirmation_sent_at == null);

    g.mode = "ok";
    const before = g.sent.length;
    const r2 = await sendEvent(s3);
    check("retry after the fix delivers", r2.body.confirmation === "sent", JSON.stringify(r2.body));
    await sleep(150);
    check("exactly one message for that order", g.sent.length === before + 1, `${g.sent.length - before}`);
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  server.close();
  process.exit(failed === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); server.close(); process.exit(1); });
