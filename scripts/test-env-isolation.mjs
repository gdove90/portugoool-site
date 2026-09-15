/**
 * Environment-isolation regression: a paid webhook event must NOT
 * produce a real Apliiq submission unless (a) submissions are enabled,
 * (b) the deploy context is production, AND (c) the Stripe event is
 * live-mode. The target server is configured with the REAL Apliiq base
 * (no override) so the environment gate is what stands between the
 * event and api.apliiq.com — the expected outcome is a refusal BEFORE
 * any network call, visible as submission=left_pending_environment.
 *
 *   node scripts/test-env-isolation.mjs <baseUrl> <livemode> <expectReasonRegex>
 */
import crypto from "node:crypto";
import Stripe from "stripe";

const [BASE, LIVEMODE, EXPECT] = [process.argv[2], process.argv[3] === "true", process.argv[4]];
const WEBHOOK_SECRET = "whsec_test_local_secret";
const stripe = new Stripe("sk_test_dummy_key_not_real");

const items = [{ p: "70000000-0000-4000-8000-000000000001", c: "Black", s: "L", q: 1, u: 4800, k: "APQ-6098962S8A1", a: 6098962 }];
const session = {
  id: "cs_test_envgate_" + crypto.randomUUID().replace(/-/g, ""),
  object: "checkout.session", payment_status: "paid", status: "complete",
  amount_total: 4800, amount_subtotal: 4800,
  total_details: { amount_shipping: 0, amount_tax: 0 }, currency: "usd",
  payment_intent: "pi_envgate", customer_details: { email: "gate@example.com" },
  collected_information: { shipping_details: { name: "Gate Test", address: { line1: "2 Gate St", city: "Boston", state: "MA", postal_code: "02101", country: "US" } } },
  metadata: { items_0: JSON.stringify(items) },
};
const payload = JSON.stringify({ id: "evt_envgate_" + Date.now(), object: "event", type: "checkout.session.completed", livemode: LIVEMODE, data: { object: session } });
const sig = stripe.webhooks.generateTestHeaderString({ payload, secret: WEBHOOK_SECRET });
const res = await fetch(`${BASE}/api/stripe-webhook`, { method: "POST", headers: { "stripe-signature": sig }, body: payload });
const body = await res.json();
console.log("response:", res.status, JSON.stringify(body));
const ok = res.status === 200 && body.submission === "left_pending_environment";
console.log(ok ? `PASS  real submission refused by environment gate (livemode=${LIVEMODE}, expect ${EXPECT})` : "FAIL  environment gate did not hold");
process.exit(ok ? 0 : 1);
