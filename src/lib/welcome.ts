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
// Email 2 talks about the performance tee, so it only goes out while
// that product is live in the catalog; otherwise the pass skips the step
// and writes nothing.

import { getSupabaseAdmin } from "./supabase";
import { getProductBySlug } from "./products";
import { hasPrice, isAvailableForSale, type Product } from "./types";
import { deliverEmail, queueEmail } from "./email-delivery";
import { buildWelcome2 } from "./emails/welcome-2";
import { buildWelcome3 } from "./emails/welcome-3";
import { SITE_URL, SUPPORT_EMAIL } from "./emails/footer";
import { markEmailSent, unsubscribeUrl, type SignupRow } from "./signups";

export const PERFORMANCE_TEE_SLUG = "goool-performance-tee";
export const EMAIL2_HOURS = 120;
export const EMAIL3_HOURS = 288;
const LOOKBACK_DAYS = 30;
const BATCH = 50;

export function performanceTee(): Product | null {
  const product = getProductBySlug(PERFORMANCE_TEE_SLUG);
  if (!product || !product.isActive || !isAvailableForSale(product) || !hasPrice(product)) return null;
  return product;
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

export async function runWelcomePass(livemode: boolean, now: number = Date.now()): Promise<Record<string, number>> {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Sign-up storage unavailable.");
  const counts: Record<string, number> = {};
  const bump = (k: string) => { counts[k] = (counts[k] ?? 0) + 1; };
  const mode = livemode ? "live" : "test";
  const tee = performanceTee();

  for (const step of [2, 3] as const) {
    if (step === 2 && !tee) { bump("email2_skipped_tee_not_live"); continue; }
    const hours = step === 2 ? EMAIL2_HOURS : EMAIL3_HOURS;
    const column = `sent_at_email${step}` as const;
    const { data, error } = await db
      .from("newsletter_signups")
      .select("id, email, email_hash, source, subscribed_at, unsubscribed_at, sent_at_email1, sent_at_email2, sent_at_email3, imported, unsubscribe_token")
      .eq("source", "popup")
      .is("unsubscribed_at", null)
      .is(column, null)
      .lte("subscribed_at", new Date(now - hours * 3600_000).toISOString())
      .gte("subscribed_at", new Date(now - LOOKBACK_DAYS * 86400_000).toISOString())
      .order("subscribed_at")
      .limit(BATCH);
    if (error) throw new Error("Welcome pass read failed.");
    const rows = (data ?? []) as SignupRow[];
    if (rows.length === 0) continue;

    const { data: codeRows, error: codeError } = await db
      .from("discount_codes")
      .select("email_hash, code, redeemed_at, expires_at")
      .in("email_hash", rows.map((r) => r.email_hash))
      .eq("livemode", livemode);
    if (codeError) throw new Error("Welcome pass ledger read failed.");
    const byHash = new Map<string, LedgerCode>();
    for (const c of (codeRows ?? []) as LedgerCode[]) byHash.set(c.email_hash, c);

    for (const row of rows) {
      const ledger = byHash.get(row.email_hash);
      if (!ledger) { bump(`email${step}_skipped_no_code`); continue; }
      if (ledger.redeemed_at) { bump(`email${step}_skipped_redeemed`); continue; }
      if (ledger.expires_at && Date.parse(ledger.expires_at) <= now) { bump(`email${step}_skipped_expired`); continue; }

      const url = unsubscribeUrl(row.unsubscribe_token);
      const built = step === 2
        ? buildWelcome2({
            code: ledger.code,
            productUrl: `${SITE_URL}/shop/${tee!.slug}`,
            imageUrl: `${SITE_URL}${tee!.images[0]?.src ?? ""}`,
            imageAlt: tee!.images[0]?.alt ?? tee!.name,
            unsubscribeUrl: url,
          })
        : buildWelcome3({ code: ledger.code, unsubscribeUrl: url });
      const key = `welcome/${mode}/${step}/${row.id}`;
      await queueEmail(key, "discount", { to: row.email, ...built, headers: listUnsubscribeHeaders(url) }, livemode);
      await markEmailSent(row.id, step, new Date(now).toISOString());
      try { await deliverEmail(key); } catch { /* the minute worker retries the queued row */ }
      bump(`email${step}`);
    }
  }
  return counts;
}
