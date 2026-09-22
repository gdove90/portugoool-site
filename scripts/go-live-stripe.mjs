/**
 * One-shot Stripe live-mode cutover.
 *
 * Run this yourself once the real GOOOL Stripe account is activated.
 * It is written so the live secret key never leaves your machine and is
 * never typed into a chat, a file, or a browser form: you pass it in an
 * environment variable, this script uses it to call Stripe directly,
 * and it hands the resulting ids to the Netlify CLI.
 *
 *   STRIPE_LIVE_KEY=sk_live_xxx node scripts/go-live-stripe.mjs
 *
 * Add --commit to actually write. Without it the script only reports
 * what it would do (and still refuses to touch anything if the account
 * is not ready).
 *
 * What it does, in order, stopping at the first problem:
 *   1. Refuses anything that is not an sk_live_ key.
 *   2. Refuses unless the account reports charges_enabled AND
 *      payouts_enabled - i.e. really activated, not a sandbox.
 *   3. Creates a LIVE $9.50 shipping rate (test-mode shr_ ids are not
 *      valid against a live key - this is the one that bit us).
 *   4. Creates the LIVE webhook endpoint for goool.shop and captures
 *      its signing secret, which Stripe returns only at creation.
 *   5. Writes STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET and
 *      STRIPE_SHIPPING_RATE_ID into the Netlify production context.
 *   6. Unsets CHECKOUT_TEST_MODE, so the Coming Soon gate is real again
 *      and nothing can be bought until availableForSale is opened.
 *
 * It deliberately does NOT open sales. availableForSale stays false in
 * src/lib/products.ts; that is a separate, deliberate commit.
 */
import { execFileSync } from "node:child_process";

const KEY = process.env.STRIPE_LIVE_KEY;
const COMMIT = process.argv.includes("--commit");
const SITE = "https://goool.shop";
const WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "charge.refunded",
  "charge.dispute.created",
];

function die(msg) {
  console.error(`\n  STOP: ${msg}\n`);
  process.exit(1);
}

async function stripe(path, params, method = "POST") {
  const body = new URLSearchParams();
  const add = (k, v) => {
    if (Array.isArray(v)) v.forEach((x) => body.append(`${k}[]`, String(x)));
    else if (v && typeof v === "object")
      Object.entries(v).forEach(([k2, v2]) => add(`${k}[${k2}]`, v2));
    else body.append(k, String(v));
  };
  Object.entries(params ?? {}).forEach(([k, v]) => add(k, v));
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${KEY}:`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: method === "GET" ? undefined : body,
  });
  const json = await res.json();
  if (json.error) die(`Stripe: ${json.error.message}`);
  return json;
}

function netlify(name, value, secret = false) {
  const args = ["netlify", "env:set", name, value, "--context", "production"];
  if (secret) args.push("--secret");
  if (!COMMIT) {
    console.log(`  would set ${name} (${secret ? "secret, " : ""}${value.length} chars)`);
    return;
  }
  execFileSync("npx", args, { stdio: ["ignore", "ignore", "inherit"] });
  console.log(`  set ${name}`);
}

// 1 ── key shape
if (!KEY) die("Set STRIPE_LIVE_KEY. Example:\n    STRIPE_LIVE_KEY=sk_live_xxx node scripts/go-live-stripe.mjs --commit");
if (!KEY.startsWith("sk_live_")) {
  die(`STRIPE_LIVE_KEY is not a live key (starts with "${KEY.slice(0, 8)}"). ` +
      `A test or sandbox key here would create test-mode objects and quietly leave the store unable to take money.`);
}

// 2 ── account really activated
console.log("\nChecking the account is activated...");
const acct = await stripe("account", null, "GET");
console.log(`  account: ${acct.id}  (${acct.settings?.dashboard?.display_name ?? "unnamed"})`);
console.log(`  charges_enabled=${acct.charges_enabled}  payouts_enabled=${acct.payouts_enabled}  details_submitted=${acct.details_submitted}`);
if (!acct.charges_enabled || !acct.payouts_enabled) {
  const due = acct.requirements?.currently_due ?? [];
  die(
    `This account cannot take live payments yet.` +
    (due.length ? `\n  Stripe still needs: ${due.join(", ")}` : "") +
    `\n  Finish activation at https://dashboard.stripe.com/settings/account and run this again.`
  );
}
if (/sandbox/i.test(acct.settings?.dashboard?.display_name ?? "")) {
  die("The account display name still says 'sandbox'. Switch to the live account before running this.");
}

// 3 ── live shipping rate
console.log("\nCreating the live shipping rate...");
const rate = await stripe("shipping_rates", {
  display_name: "Standard shipping",
  type: "fixed_amount",
  fixed_amount: { amount: 950, currency: "usd" },
  delivery_estimate: { minimum: { unit: "business_day", value: 3 }, maximum: { unit: "business_day", value: 7 } },
});
console.log(`  ${rate.id}  $${(rate.fixed_amount.amount / 100).toFixed(2)}  livemode=${rate.livemode}`);
if (!rate.livemode) die("Stripe returned a test-mode shipping rate; aborting before it reaches Netlify.");

// 4 ── live webhook endpoint
console.log("\nCreating the live webhook endpoint...");
const hook = await stripe("webhook_endpoints", {
  url: `${SITE}/api/stripe-webhook`,
  enabled_events: WEBHOOK_EVENTS,
  description: "GOOOL production webhook (live)",
});
console.log(`  ${hook.id} -> ${hook.url}`);
console.log(`  events: ${WEBHOOK_EVENTS.join(", ")}`);
if (!hook.secret) die("Stripe did not return a signing secret; delete the endpoint and retry.");

// 5/6 ── Netlify
console.log(`\n${COMMIT ? "Writing" : "Would write"} Netlify production env...`);
netlify("STRIPE_SECRET_KEY", KEY, true);
netlify("STRIPE_WEBHOOK_SECRET", hook.secret, true);
netlify("STRIPE_SHIPPING_RATE_ID", rate.id);
if (COMMIT) {
  try {
    execFileSync("npx", ["netlify", "env:unset", "CHECKOUT_TEST_MODE", "--context", "production"], {
      stdio: ["ignore", "ignore", "inherit"],
    });
    console.log("  unset CHECKOUT_TEST_MODE");
  } catch {
    console.log("  CHECKOUT_TEST_MODE was not set (fine)");
  }
} else {
  console.log("  would unset CHECKOUT_TEST_MODE");
}

console.log(`
${COMMIT ? "Done." : "Dry run only - nothing was changed. Re-run with --commit."}

Next, in order:
  1. npx netlify deploy --prod --build
  2. Make one real purchase of the cheapest item and confirm: an order
     row appears, the webhook shows 200 in the Stripe dashboard, and
     /track-order finds it. Then refund yourself and confirm the order
     flips to 'refunded'.
  3. Only after that, open sales (availableForSale: true) in a separate
     commit. Nothing before this point can take a customer's money.
`);
