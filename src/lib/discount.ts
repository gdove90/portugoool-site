import { createHash, randomInt } from "crypto";
import Stripe from "stripe";
import { getSupabaseAdmin } from "./supabase";

// ─────────────────────────────────────────────────────────────
// GOOOL20: 20% off a first order, one code per person, one use per code.
//
// Every signup gets its own Stripe promotion code, GOOOL20-XXXX, on the
// shared 20%-once coupon, with max_redemptions 1. The ledger
// (discount_codes, migration 0036) ties the code to the normalised email
// so a repeat signup returns the same code, or "already used" once it is
// spent. Stripe is the enforcement point at checkout; this module only
// issues and records.
//
// Normalisation closes the cheap dodges: case, gmail dots, +tags. A
// person with a genuinely different mailbox is caught later, not
// blocked: markRedeemed stores the buyer's name and address key, and the
// discount_repeat_flags view surfaces matches for ops.
// ─────────────────────────────────────────────────────────────

const COUPON_NAME = "GOOOL20 · 20% off first order";
const COUPON_SOURCE = "goool20-popup";
const CODE_PREFIX = "GOOOL20-";
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
const CODE_DAYS = 30;

export type IssueResult =
  | { status: "issued" | "existing"; code: string }
  | { status: "redeemed" }
  | { status: "unavailable"; reason: string };

export function normalizeEmail(raw: string): string {
  const email = raw.trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 0) return email;
  let local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const plus = local.indexOf("+");
  if (plus > 0) local = local.slice(0, plus);
  if (domain === "gmail.com" || domain === "googlemail.com") local = local.replace(/\./g, "");
  return `${local}@${domain === "googlemail.com" ? "gmail.com" : domain}`;
}

export function emailHash(raw: string): string {
  return createHash("sha256").update(normalizeEmail(raw)).digest("hex");
}

/** "lastname|first address line|postal code", lowercased, punctuation stripped. */
export function addressKey(
  name: string | null | undefined,
  address: Record<string, unknown> | null | undefined
): string | null {
  if (!address) return null;
  const clean = (v: unknown) =>
    String(v ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const last = clean(name).split(" ").pop() ?? "";
  const line1 = clean(address.line1);
  const postal = clean(address.postal_code);
  if (!line1 && !postal) return null;
  return `${last}|${line1}|${postal}`;
}

function generateCode(): string {
  let s = "";
  for (let i = 0; i < 4; i++) s += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return CODE_PREFIX + s;
}

let couponCache: { key: string; id: string } | null = null;

/** Find or create the shared 20%-once coupon. Cached per process per key. */
export async function ensureCoupon(stripe: Stripe, secretKey: string): Promise<string> {
  if (couponCache?.key === secretKey) return couponCache.id;
  const list = await stripe.coupons.list({ limit: 100 });
  let coupon = list.data.find(
    (c) => c.valid && c.metadata?.source === COUPON_SOURCE && c.percent_off === 20
  );
  if (!coupon) {
    coupon = await stripe.coupons.create({
      name: COUPON_NAME,
      percent_off: 20,
      duration: "once",
      metadata: { source: COUPON_SOURCE },
    });
  }
  couponCache = { key: secretKey, id: coupon.id };
  return coupon.id;
}

export async function issueDiscountCode(email: string): Promise<IssueResult> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.startsWith("sk_test_xxx")) {
    return { status: "unavailable", reason: "stripe" };
  }
  const db = getSupabaseAdmin();
  if (!db) return { status: "unavailable", reason: "database" };

  const hash = emailHash(email);
  const { data: existing, error: readErr } = await db
    .from("discount_codes")
    .select("code, redeemed_at, expires_at, livemode")
    .eq("email_hash", hash)
    .maybeSingle();
  if (readErr) {
    console.error("[discount] ledger read failed:", readErr.message);
    return { status: "unavailable", reason: "database" };
  }
  const livemode = secretKey.startsWith("sk_live_");
  if (existing && existing.livemode === livemode) {
    if (existing.redeemed_at) return { status: "redeemed" };
    return { status: "existing", code: existing.code };
  }

  const stripe = new Stripe(secretKey);
  const couponId = await ensureCoupon(stripe, secretKey);
  const expiresAt = Math.floor(Date.now() / 1000) + CODE_DAYS * 86400;

  // Codes are random; a collision on the unique column just retries.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    let promo: Stripe.PromotionCode;
    try {
      promo = await stripe.promotionCodes.create({
        coupon: couponId,
        code,
        active: true,
        max_redemptions: 1,
        expires_at: expiresAt,
        restrictions: { first_time_transaction: true },
        metadata: { source: COUPON_SOURCE, email_hash: hash },
      });
    } catch (err) {
      // Stripe refuses a code that already exists on the account.
      const msg = err instanceof Error ? err.message : String(err);
      if (/already exists|already been taken/i.test(msg)) continue;
      console.error("[discount] stripe promotion code failed:", msg);
      return { status: "unavailable", reason: "stripe" };
    }
    const { error: insErr } = await db.from("discount_codes").insert({
      email_hash: hash,
      code,
      stripe_promotion_code_id: promo.id,
      stripe_coupon_id: couponId,
      livemode,
      expires_at: new Date(expiresAt * 1000).toISOString(),
    });
    if (!insErr) return { status: "issued", code };
    // Lost a race with a concurrent signup for the same email: hand back
    // the row that won and retire the code we just made.
    await stripe.promotionCodes.update(promo.id, { active: false }).catch(() => null);
    if (insErr.code === "23505") {
      const { data: winner } = await db
        .from("discount_codes")
        .select("code, redeemed_at")
        .eq("email_hash", hash)
        .maybeSingle();
      if (winner?.redeemed_at) return { status: "redeemed" };
      if (winner?.code) return { status: "existing", code: winner.code };
    }
    console.error("[discount] ledger insert failed:", insErr.message);
    return { status: "unavailable", reason: "database" };
  }
  return { status: "unavailable", reason: "stripe" };
}

/**
 * Called by the Stripe webhook once a session is paid. Records who used
 * the code. Never throws: a ledger failure must not block an order.
 */
export async function markRedeemed(args: {
  promotionCodeId: string;
  sessionId: string;
  email: string | null;
  name: string | null;
  address: Record<string, unknown> | null;
}): Promise<void> {
  const db = getSupabaseAdmin();
  if (!db) return;
  const { error } = await db
    .from("discount_codes")
    .update({
      redeemed_at: new Date().toISOString(),
      redeemed_session_id: args.sessionId,
      redeemed_email_hash: args.email ? emailHash(args.email) : null,
      redeemed_name: args.name,
      redeemed_address_key: addressKey(args.name, args.address),
      redeemed_address: args.address,
    })
    .eq("stripe_promotion_code_id", args.promotionCodeId)
    .is("redeemed_at", null);
  if (error) console.error("[discount] redemption record failed:", error.message);
}
