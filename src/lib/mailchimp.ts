import { createHash } from "crypto";

// Mailchimp audience upsert, shared by the footer signup (api/newsletter)
// and the GOOOL20 popup (api/discount). Mailchimp is the subscriber
// source of truth (owner decision, 2026-09-14). Addresses never reach
// the logs.
//
// Env (Netlify + .env.local, never committed):
//   MAILCHIMP_API_KEY      key ends in -usN, which is the datacenter
//   MAILCHIMP_AUDIENCE_ID  Audience → Settings → "Audience ID"

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubscribeResult =
  | { ok: true }
  | { ok: false; status: 400 | 500 | 503; error: string };

export function mailchimpConfigured(): boolean {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const datacenter = apiKey?.split("-").pop();
  return Boolean(apiKey && process.env.MAILCHIMP_AUDIENCE_ID && datacenter?.startsWith("us"));
}

export async function subscribeToAudience(
  email: string,
  tags: string[]
): Promise<SubscribeResult> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const datacenter = apiKey?.split("-").pop();
  if (!apiKey || !audienceId || !datacenter?.startsWith("us")) {
    console.error("[mailchimp] storage unavailable: env not configured");
    return { ok: false, status: 503, error: "Signups are temporarily down. Please try again soon." };
  }

  // PUT by MD5(email) is Mailchimp's idempotent upsert: new visitors are
  // subscribed, repeat signups are a no-op, and anyone who unsubscribed
  // stays unsubscribed (status_if_new only applies to new members).
  const memberHash = createHash("md5").update(email).digest("hex");
  const res = await fetch(
    `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members/${memberHash}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email, status_if_new: "subscribed", tags }),
    }
  ).catch(() => null);

  if (!res) {
    console.error("[mailchimp] unreachable");
    return { ok: false, status: 500, error: "Could not save your email. Try again." };
  }
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    if (res.status === 400) {
      console.error("[mailchimp] rejected signup:", detail?.title ?? "Bad Request");
      return { ok: false, status: 400, error: "Enter a valid email." };
    }
    console.error("[mailchimp] error:", res.status, detail?.title ?? "");
    return { ok: false, status: 500, error: "Could not save your email. Try again." };
  }
  return { ok: true };
}
