// Welcome sequence, Emails 2 and 3 (owner decision 2026-09-29).
//
// One pass, run from the existing deliver-emails scheduled function at
// the top of every hour (and on demand through the ops endpoint). It
// selects popup sign-ups whose clock has reached 120 h (Email 2) or
// 288 h (Email 3), that have not had that email, are not unsubscribed,
// and whose GOOOL20 code is neither redeemed nor expired. The code comes
// from the ledger by email_hash; the redeemed check reads the same
// `redeemed_at` the checkout webhook writes. Each send goes through the
// durable queue under a key unique to the row and step, and the row's
// sent_at column is written as soon as the send is queued, so a re-run
// never sends twice even if one of the two writes is lost.
//
// Email 2 describes the Matchday performance tee as a tri-blend, so it
// only goes out while that product is live AND its blank is the Bella +
// Canvas 3413 (one boolean read from the product record). Until the
// blank swap ships the gate is closed: the pass skips the step and
// writes nothing.

import { getSupabaseAdmin } from "./supabase";
import { getProductBySlug } from "./products";
import { hasPrice, isAvailableForSale, type Product } from "./types";
import { deliverEmail, queueEmail } from "./email-delivery";
import { buildWelcome2 } from "./emails/welcome-2";
import { buildWelcome3 } from "./emails/welcome-3";
import { SITE_URL, SUPPORT_EMAIL } from "./emails/footer";
import { markEmailSent, unsubscribeUrl, type SignupRow } from "./signups";

export const PERFORMANCE_TEE_SLUG = "goool-athletics-modern-sport-performance-tee";
export const TRIBLEND_BLANK = "BC3413";
export const EMAIL2_HOURS = 120;
export const EMAIL3_HOURS = 288;
const LOOKBACK_DAYS = 30;
const BATCH = 50;

/** The Email 2 gate: the Matchday tee, live and on the 3413 blank, else null. */
export function performanceTee(): Product | null {
  const product = getProductBySlug(PERFORMANCE_TEE_SLUG);
  if (!product || !product.isActive || !isAvailableForSale(product) || !hasPrice(product)) return null;
  if (product.blank !== TRIBLEND_BLANK) return null;
  return product;
}

export function email2GateOpen(): boolean {
  return performanceTee() !== null;
}

/** RFC 8058 one-click headers for marketing sends. */
export function listUnsubscribeHeaders(url: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${url}>, <mailto:${SUPPORT_EMAIL}?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

interface LedgerCode {
  email_hash: string;
  code: string;
  redeemed_at: string | null;
  expires_at: string | null;
}

// Retain the callable interface for existing workers; promotional follow-ups are retired.
export async function runWelcomePass(_livemode: boolean, _now: number = Date.now()): Promise<Record<string, number>> {
  return { promotional_followups_disabled: 1 };
}
