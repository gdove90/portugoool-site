/**
 * One-shot Stripe live-mode cutover.
 *
 * Run this yourself once the real GOOOL Stripe account is activated.
 * The live secret key never leaves your machine and is never typed into
 * a chat: pass it in an environment variable, or keep it in
 * .env.stripe-live.local (gitignored) and let this script read it.
 *
 *   STRIPE_LIVE_KEY=sk_live_xxx node scripts/go-live-stripe.mjs
 *   node scripts/go-live-stripe.mjs --commit          (reads the file)
 *
 * WITHOUT --commit nothing is created or written anywhere. An earlier
 * version of this script got that wrong: it created the live shipping
 * rate and the live webhook endpoint unconditionally and then printed
 * "Dry run only - nothing was changed", which was a lie. Every mutating
 * call is now behind the same flag, and the dry run reports exactly
 * what it would do.
 *
 * Steps, stopping at the first problem:
 *   1. Refuse anything that is not an sk_live_ key.
 *   2. Refuse unless the account reports charges_enabled AND
 *      payouts_enabled - really activated, not a sandbox.
 *   3. Reuse or create a LIVE shipping rate. Test-mode shr_ ids are not
 *      valid against a live key; that is what bit us before.
 *   4. Create the LIVE webhook endpoint and capture its signing secret,
 *      which Stripe returns only at creation.
 *   5. Write STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET and
 *      STRIPE_SHIPPING_RATE_ID into the Netlify production context.
 *   6. Unset CHECKOUT_TEST_MODE so the Coming Soon gate is real again.
 *
 * It does NOT open sales. availableForSale stays false in
 * src/lib/products.ts; that is a separate, deliberate commit.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const COMMIT = process.argv.includes("--commit");
const REPLACE_WEBHOOK = process.argv.includes("--replace-webhook");
const SITE = "https://goool.shop";
const SHIPPING_CENTS = Number(process.env.SHIPPING_AMOUNT_CENTS ?? 950);
const SHIPPING_NAME = process.env.SHIPPING_DISPLAY_NAME ?? "Standard shipping";
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

// Key from env, or from the gitignored local file.
function readKey() {
  if (process.env.STRIPE_LIVE_KEY) return process.env.STRIPE_LIVE_KEY.trim();
  const f = path.join(process.cwd(), ".env.stripe-live.local");
  if (!fs.existsSync(f)) return null;
  const m = fs.readFileSync(f, "utf8").match(/^\s*STRIPE_LIVE_KEY\s*=\s*(.+)$/m);
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : null;
}
const KEY = readKey();

async function stripe(pathname, params, method = "POST") {
  const body = new URLSearchParams();
  const add = (k, v) => {
    if (Array.isArray(v)) v.forEach((x) => body.append(`${k}[]`, String(x)));
    else if (v && typeof v === "object")
      Object.entries(v).forEach(([k2, v2]) => add(`${k}[${k2}]`, v2));
    else body.append(k, String(v));
  };
  Object.entries(params ?? {}).forEach(([k, v]) => add(k, v));
  const qs = method === "GET" && body.toString() ? `?${body}` : "";
  const res = await fetch(`https://api.stripe.com/v1/${pathname}${qs}`, {
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
if (!KEY) {
  die(
    "No live key found.\n" +
    "    Either:  STRIPE_LIVE_KEY=sk_live_xxx node scripts/go-live-stripe.mjs --commit\n" +
    "    Or put STRIPE_LIVE_KEY=sk_live_xxx in .env.stripe-live.local (gitignored) and re-run."
  );
}
if (!KEY.startsWith("sk_live_")) {
  die(
    `That is not a live key (starts with "${KEY.slice(0, 8)}"). A test or sandbox key here ` +
    `would create test-mode objects and quietly leave the store unable to take money. ` +
    `Use the STANDARD secret key from Developers -> API keys, not a restricted key.`
  );
}

console.log(`\n${COMMIT ? "LIVE RUN - this will create and write." : "DRY RUN - nothing will be created or written."}`);

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

// 3 ── shipping rate: reuse an identical live one rather than piling up duplicates
console.log(`\nLive shipping rate (${SHIPPING_NAME}, $${(SHIPPING_CENTS / 100).toFixed(2)})...`);
const existingRates = await stripe("shipping_rates", { limit: 100, active: true }, "GET");
let rate = (existingRates.data ?? []).find(
  (r) =>
    r.livemode === true &&
    r.display_name === SHIPPING_NAME &&
    r.fixed_amount?.amount === SHIPPING_CENTS &&
    r.fixed_amount?.currency === "usd"
);
if (rate) {
  console.log(`  reusing existing ${rate.id}`);
} else if (!COMMIT) {
  console.log(`  would create a new live rate at $${(SHIPPING_CENTS / 100).toFixed(2)}`);
} else {
  rate = await stripe("shipping_rates", {
    display_name: SHIPPING_NAME,
    type: "fixed_amount",
    fixed_amount: { amount: SHIPPING_CENTS, currency: "usd" },
    delivery_estimate: {
      minimum: { unit: "business_day", value: 3 },
      maximum: { unit: "business_day", value: 7 },
    },
  });
  console.log(`  created ${rate.id}  livemode=${rate.livemode}`);
  if (!rate.livemode) die("Stripe returned a test-mode shipping rate; aborting before it reaches Netlify.");
}

// 4 ── webhook endpoint. Its secret is returned ONLY at creation, so an
// endpoint that already exists cannot be adopted; say so instead of
// silently adding a second one whose deliveries would fail signature.
console.log("\nLive webhook endpoint...");
const existingHooks = await stripe("webhook_endpoints", { limit: 100 }, "GET");
const clash = (existingHooks.data ?? []).find((h) => h.url === `${SITE}/api/stripe-webhook` && h.livemode === true);
let hook = null;
if (clash && !REPLACE_WEBHOOK) {
  die(
    `A live webhook endpoint for ${SITE}/api/stripe-webhook already exists (${clash.id}).\n` +
    `  Stripe only reveals a signing secret at creation, so this script cannot adopt it.\n` +
    `  If STRIPE_WEBHOOK_SECRET in Netlify already matches that endpoint, you are done - skip this step.\n` +
    `  Otherwise re-run with --replace-webhook to delete it and create a fresh one.`
  );
}
if (!COMMIT) {
  console.log(`  would ${clash ? "delete " + clash.id + " and " : ""}create an endpoint for ${SITE}/api/stripe-webhook`);
  console.log(`  events: ${WEBHOOK_EVENTS.join(", ")}`);
} else {
  if (clash && REPLACE_WEBHOOK) {
    await stripe(`webhook_endpoints/${clash.id}`, null, "DELETE");
    console.log(`  deleted previous ${clash.id}`);
  }
  hook = await stripe("webhook_endpoints", {
    url: `${SITE}/api/stripe-webhook`,
    enabled_events: WEBHOOK_EVENTS,
    description: "GOOOL production webhook (live)",
  });
  console.log(`  created ${hook.id} -> ${hook.url}`);
  if (!hook.secret) die("Stripe did not return a signing secret; delete the endpoint and retry.");
}

// 5/6 ── Netlify
console.log(`\n${COMMIT ? "Writing" : "Would write"} Netlify production env...`);
netlify("STRIPE_SECRET_KEY", KEY, true);
if (hook) netlify("STRIPE_WEBHOOK_SECRET", hook.secret, true);
else if (!COMMIT) console.log("  would set STRIPE_WEBHOOK_SECRET (secret, from the new endpoint)");
if (rate) netlify("STRIPE_SHIPPING_RATE_ID", rate.id);
else if (!COMMIT) console.log("  would set STRIPE_SHIPPING_RATE_ID (from the new rate)");

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
${COMMIT ? "Done." : "Dry run complete. Nothing was created and nothing was written. Re-run with --commit."}

Next, in order:
  1. npx netlify deploy --prod --build
  2. Open sales (availableForSale: true) - a separate commit.
  3. Buy the cheapest item with a real card. Confirm an order row appears,
     the webhook shows 200 in the Stripe dashboard, and /track-order finds
     it. Then refund yourself and confirm the order flips to 'refunded'.
`);
