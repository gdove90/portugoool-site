// The list of record for email sign-ups: Supabase `newsletter_signups`,
// one row per address, keyed by the same email hash the GOOOL20 ledger
// uses (owner decision 2026-09-29). `discount_codes` stays hash-only;
// this table holds the address, the source, the sequence markers and
// the unsubscribe token. Every sign-up is also added to the Resend
// Audience named "goool", which replaces the Mailchimp audience.

import { getSupabaseAdmin } from "./supabase";
import { emailHash } from "./discount";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const RESEND_AUDIENCE_NAME = "goool";

export type SignupSource = "popup" | "footer" | "import";

export interface SignupRow {
  id: string;
  email: string;
  email_hash: string;
  source: SignupSource;
  subscribed_at: string;
  unsubscribed_at: string | null;
  sent_at_email1: string | null;
  sent_at_email2: string | null;
  sent_at_email3: string | null;
  imported: boolean;
  unsubscribe_token: string;
}

const COLUMNS =
  "id, email, email_hash, source, subscribed_at, unsubscribed_at, sent_at_email1, sent_at_email2, sent_at_email3, imported, unsubscribe_token";

function database() {
  const db = getSupabaseAdmin();
  if (!db) throw new Error("Sign-up storage unavailable.");
  return db;
}

/**
 * Upsert on email_hash. A popup sign-up starts the welcome clock: if the
 * address was only ever a footer or import row, the row becomes a popup
 * row with subscribed_at = now. A repeat popup sign-up keeps its clock.
 * Any fresh sign-up clears an earlier unsubscribe, since it is new
 * consent.
 */
export async function recordSignup(
  email: string,
  source: SignupSource,
  opts: { imported?: boolean; subscribedAt?: string } = {},
): Promise<SignupRow> {
  const db = database();
  const address = email.trim().toLowerCase();
  const hash = emailHash(address);
  const { data: existing, error: readError } = await db
    .from("newsletter_signups")
    .select(COLUMNS)
    .eq("email_hash", hash)
    .maybeSingle();
  if (readError) throw new Error("Sign-up storage read failed.");

  if (!existing) {
    const row = {
      email: address,
      email_hash: hash,
      source,
      imported: opts.imported ?? false,
      ...(opts.subscribedAt ? { subscribed_at: opts.subscribedAt } : {}),
    };
    const { data, error } = await db.from("newsletter_signups").insert(row).select(COLUMNS).single();
    if (!error && data) return data as SignupRow;
    // Lost a race with a concurrent sign-up for the same address: read it.
    const { data: again } = await db.from("newsletter_signups").select(COLUMNS).eq("email_hash", hash).maybeSingle();
    if (again) return again as SignupRow;
    throw new Error("Sign-up storage write failed.");
  }

  const current = existing as SignupRow;
  const patch: Partial<SignupRow> = {};
  if (source === "popup" && current.source !== "popup") {
    patch.source = "popup";
    patch.subscribed_at = new Date().toISOString();
  }
  if (source !== "import" && current.unsubscribed_at) patch.unsubscribed_at = null;
  if (Object.keys(patch).length === 0) return current;
  const { data, error } = await db
    .from("newsletter_signups")
    .update(patch)
    .eq("id", current.id)
    .select(COLUMNS)
    .single();
  if (error || !data) throw new Error("Sign-up storage update failed.");
  return data as SignupRow;
}

export async function markEmailSent(id: string, step: 1 | 2 | 3, at: string = new Date().toISOString()): Promise<void> {
  const { error } = await database()
    .from("newsletter_signups")
    .update({ [`sent_at_email${step}`]: at })
    .eq("id", id);
  if (error) throw new Error("Sign-up marker update failed.");
}

export function unsubscribeUrl(token: string): string {
  return `https://goool.shop/unsubscribe/${token}`;
}

/**
 * One-click unsubscribe. Sets the flag once, removes the address from the
 * Resend Audience. Returns null for an unknown token.
 */
export async function unsubscribeByToken(token: string): Promise<{ email: string; already: boolean } | null> {
  const db = database();
  const { data, error } = await db
    .from("newsletter_signups")
    .select("id, email, unsubscribed_at")
    .eq("unsubscribe_token", token)
    .maybeSingle();
  if (error) throw new Error("Sign-up storage read failed.");
  if (!data) return null;
  const row = data as { id: string; email: string; unsubscribed_at: string | null };
  if (!row.unsubscribed_at) {
    const { error: writeError } = await db
      .from("newsletter_signups")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("id", row.id);
    if (writeError) throw new Error("Unsubscribe could not be saved.");
  }
  await removeFromResendAudience(row.email);
  return { email: row.email, already: Boolean(row.unsubscribed_at) };
}

// ── Resend Audience ────────────────────────────────────────────────
// Looked up by name once per process; created if it does not exist.
// Failures are logged and never fail a sign-up: the Supabase row is the
// record, the Audience is a mirror.

let audienceId: string | null = null;

async function resend(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    signal: AbortSignal.timeout(8000),
  });
}

export async function getResendAudienceId(): Promise<string | null> {
  if (!process.env.RESEND_API_KEY) return null;
  if (audienceId) return audienceId;
  try {
    const list = await resend("/audiences");
    if (list.ok) {
      const body = (await list.json()) as { data?: { id: string; name: string }[] };
      const found = body.data?.find((a) => a.name === RESEND_AUDIENCE_NAME);
      if (found) return (audienceId = found.id);
    }
    const created = await resend("/audiences", { method: "POST", body: JSON.stringify({ name: RESEND_AUDIENCE_NAME }) });
    if (!created.ok) return null;
    const body = (await created.json()) as { id?: string };
    return (audienceId = body.id ?? null);
  } catch {
    return null;
  }
}

export async function addToResendAudience(email: string): Promise<boolean> {
  try {
    const id = await getResendAudienceId();
    if (!id) return false;
    const res = await resend(`/audiences/${id}/contacts`, {
      method: "POST",
      body: JSON.stringify({ email: email.trim().toLowerCase(), unsubscribed: false }),
    });
    if (!res.ok) console.error("[signups] Resend audience add failed:", res.status);
    return res.ok;
  } catch {
    console.error("[signups] Resend audience add unreachable");
    return false;
  }
}

export async function removeFromResendAudience(email: string): Promise<boolean> {
  try {
    const id = await getResendAudienceId();
    if (!id) return false;
    const res = await resend(`/audiences/${id}/contacts/${encodeURIComponent(email.trim().toLowerCase())}`, { method: "DELETE" });
    if (!res.ok && res.status !== 404) console.error("[signups] Resend audience remove failed:", res.status);
    return res.ok || res.status === 404;
  } catch {
    console.error("[signups] Resend audience remove unreachable");
    return false;
  }
}
