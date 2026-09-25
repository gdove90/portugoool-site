// GOOOL20 on the Stripe account: make sure the shared 20%-once coupon
// exists, and make sure no SHARED promotion code is live.
//
//   node scripts/create-goool20-promo.mjs            → uses STRIPE_SECRET_KEY from .env.local
//   node scripts/create-goool20-promo.mjs --dry-run  → reports, changes nothing
//   STRIPE_SECRET_KEY=sk_live_... node scripts/create-goool20-promo.mjs   → live account
//
// Design (owner decision 2026-09-25, one person / one use): the popup
// issues a single-use code per signup (GOOOL20-XXXX, max_redemptions 1)
// through src/lib/discount.ts, all on ONE coupon carrying
// metadata.source = "goool20-popup". A plain shared code "GOOOL20" would
// let anyone reuse it, so if one exists it is deactivated here.
// Idempotent; prints the key's mode so test and live are never confused.

import { readFileSync, existsSync } from "node:fs";
import Stripe from "stripe";

const SHARED_CODE = "GOOOL20";
const COUPON_NAME = "GOOOL20 · 20% off first order";
const SOURCE = "goool20-popup";
const dryRun = process.argv.includes("--dry-run");

function loadEnv() {
  if (process.env.STRIPE_SECRET_KEY) return process.env.STRIPE_SECRET_KEY;
  if (!existsSync(".env.local")) return undefined;
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^STRIPE_SECRET_KEY=(.*)$/);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  return undefined;
}

const key = loadEnv();
if (!key || !key.startsWith("sk_")) {
  console.error("STRIPE_SECRET_KEY not found. Put it in .env.local or the environment.");
  process.exit(1);
}
const mode = key.startsWith("sk_live_") ? "LIVE" : key.startsWith("sk_test_") ? "TEST" : "unknown";
console.log(`Stripe mode: ${mode}${dryRun ? " (dry run)" : ""}`);
const stripe = new Stripe(key);

// 1. Coupon
const coupons = await stripe.coupons.list({ limit: 100 });
let coupon = coupons.data.find((c) => c.valid && c.metadata?.source === SOURCE && c.percent_off === 20);
if (coupon) {
  console.log(`Coupon exists: ${coupon.id} (${coupon.percent_off}% off, ${coupon.duration})`);
} else if (dryRun) {
  console.log("Coupon missing; would create it.");
} else {
  coupon = await stripe.coupons.create({ name: COUPON_NAME, percent_off: 20, duration: "once", metadata: { source: SOURCE } });
  console.log(`Created coupon ${coupon.id} (20% off, once)`);
}

// 2. No shared code may stay active.
const shared = await stripe.promotionCodes.list({ code: SHARED_CODE, limit: 10 });
for (const pc of shared.data) {
  if (!pc.active) { console.log(`Shared code ${SHARED_CODE} (${pc.id}) already inactive.`); continue; }
  if (dryRun) { console.log(`Shared code ${SHARED_CODE} (${pc.id}) is ACTIVE; would deactivate.`); continue; }
  await stripe.promotionCodes.update(pc.id, { active: false });
  console.log(`Deactivated shared code ${SHARED_CODE} (${pc.id}).`);
}
if (!shared.data.length) console.log(`No shared code ${SHARED_CODE} on this account. Good.`);

// 3. Report issued single-use codes.
const issued = await stripe.promotionCodes.list({ limit: 100 });
const ours = issued.data.filter((pc) => pc.metadata?.source === SOURCE && pc.code.startsWith(SHARED_CODE + "-"));
console.log(`Single-use codes on this account: ${ours.length} (${ours.filter((p) => p.times_redeemed > 0).length} redeemed).`);
