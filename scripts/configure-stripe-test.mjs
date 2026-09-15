/**
 * One-shot Stripe TEST-mode configurator. Run AFTER the owner has put
 * a TEST secret key into Netlify (all contexts is fine for test keys):
 *
 *   npx netlify env:set STRIPE_SECRET_KEY sk_test_...   ← owner does this
 *   npx netlify dev:exec -- node scripts/configure-stripe-test.mjs
 *
 * What it does, idempotently, printing NO secret values:
 *   1. Refuses to run against a live key (sk_live_ → abort).
 *   2. Finds or creates a TEST shipping rate ("GOOOL TEST shipping",
 *      $9.50 flat US placeholder — clearly a stand-in; the real rate is
 *      a business decision before live sales).
 *   3. Finds or creates the webhook endpoint for
 *      https://goool.shop/api/stripe-webhook with exactly the three
 *      checkout events the handler processes.
 *   4. Writes STRIPE_SHIPPING_RATE_ID, STRIPE_WEBHOOK_SECRET, and
 *      CHECKOUT_TEST_MODE=true to Netlify env via the CLI (values pass
 *      process-to-process, never through the console).
 *
 * NOTE: Stripe only reveals a webhook signing secret at creation time.
 * If the endpoint already exists, the script says so and leaves the
 * stored secret untouched.
 */
import { execFileSync } from "node:child_process";
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("STRIPE_SECRET_KEY is not set in the injected env. Owner step first.");
  process.exit(1);
}
if (!key.startsWith("sk_test_")) {
  console.error("Refusing: STRIPE_SECRET_KEY is not a TEST key. This script only configures test mode.");
  process.exit(1);
}
const stripe = new Stripe(key);
const SITE = "https://goool.shop";
const WEBHOOK_URL = `${SITE}/api/stripe-webhook`;
const EVENTS = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
];

function setNetlifyEnv(name, value, secret = false) {
  const args = ["netlify", "env:set", name, value];
  if (secret) args.push("--secret");
  execFileSync("npx", args, { stdio: ["ignore", "ignore", "inherit"], shell: process.platform === "win32" });
  console.log(`netlify env: ${name} set${secret ? " (secret)" : ""}`);
}

// 2. shipping rate
let rate = (await stripe.shippingRates.list({ limit: 100 })).data.find(
  (r) => r.display_name === "GOOOL TEST shipping" && r.active
);
if (!rate) {
  rate = await stripe.shippingRates.create({
    display_name: "GOOOL TEST shipping",
    type: "fixed_amount",
    fixed_amount: { amount: 950, currency: "usd" },
  });
  console.log("created TEST shipping rate");
} else {
  console.log("TEST shipping rate already exists");
}
setNetlifyEnv("STRIPE_SHIPPING_RATE_ID", rate.id);

// 3. webhook endpoint
const existing = (await stripe.webhookEndpoints.list({ limit: 100 })).data.find(
  (w) => w.url === WEBHOOK_URL
);
if (existing) {
  console.log(
    "webhook endpoint already exists for this URL; signing secret unavailable after creation." +
      " If STRIPE_WEBHOOK_SECRET is not already set, delete the endpoint in the Stripe dashboard and re-run."
  );
} else {
  const wh = await stripe.webhookEndpoints.create({
    url: WEBHOOK_URL,
    enabled_events: EVENTS,
    description: "GOOOL order pipeline (created by configure-stripe-test)",
  });
  console.log("created webhook endpoint for", WEBHOOK_URL);
  setNetlifyEnv("STRIPE_WEBHOOK_SECRET", wh.secret, true);
}

// 4. checkout test-mode flag (works only with sk_test_ keys, in code)
setNetlifyEnv("CHECKOUT_TEST_MODE", "true");

console.log(
  "\nDone. Redeploy so functions pick up the env (rm -rf .next && npx netlify deploy --build --prod)," +
    "\nthen run the controlled checkout. Remember: STRIPE_SECRET_KEY here is TEST mode; no real charges are possible."
);
