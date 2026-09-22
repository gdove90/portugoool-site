// ─────────────────────────────────────────────────────────────
// Transactional email.
//
// This is NOT Mailchimp. Mailchimp holds the marketing list (see
// /api/newsletter) and its transactional product is a separate paid
// add-on; mixing a receipt into a marketing audience also drags a
// buyer into campaign sends they never consented to. Order mail goes
// out on its own path, to people who transacted, with no unsubscribe
// obligations attached to it.
//
// Provider is deliberately behind one function. Resend is the default
// adapter because it needs nothing but an API key and DNS records on a
// domain we already own, but nothing above this line knows that.
//
// Env:
//   RESEND_API_KEY    absent -> email is DISABLED, loudly, never fatal
//   EMAIL_FROM        defaults to "GOOOL <hello@goool.shop>"
//   EMAIL_REPLY_TO    defaults to hello@goool.shop
//   RESEND_API_BASE   test hook; the suite points this at a local mock
//
// Failure policy: sending must never break the thing that triggered it.
// A receipt that does not arrive is bad. A payment webhook that 500s
// because a mail API had a bad minute is worse - that is a retry storm
// on top of a captured payment. So every path here returns a result
// object and never throws.
// ─────────────────────────────────────────────────────────────

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export type EmailResult =
  | { sent: true; id: string | null; provider: string }
  | { sent: false; reason: string; disabled?: boolean };

export function emailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function emailFrom(): string {
  return process.env.EMAIL_FROM ?? "GOOOL <hello@goool.shop>";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendEmail(msg: EmailMessage): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Visible, not silent: this is the difference between "we chose not
    // to mail" and "we think we mailed and did not".
    console.error("[email] DISABLED (RESEND_API_KEY unset) - would have sent:", msg.subject);
    return { sent: false, reason: "Email provider not configured.", disabled: true };
  }
  if (!EMAIL_RE.test(msg.to) || msg.to.length > 254) {
    // Never log the address itself.
    console.error("[email] refusing to send to a malformed address");
    return { sent: false, reason: "Invalid recipient address." };
  }

  const base = process.env.RESEND_API_BASE ?? "https://api.resend.com";
  const controller = new AbortController();
  // Short on purpose: this runs inside the Stripe webhook, which has a
  // 10s platform budget it already shares with the Apliiq call.
  const timer = setTimeout(() => controller.abort(), Number(process.env.EMAIL_TIMEOUT_MS ?? 5000));
  try {
    const res = await fetch(`${base}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFrom(),
        to: [msg.to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        reply_to: msg.replyTo ?? process.env.EMAIL_REPLY_TO ?? "hello@goool.shop",
      }),
      signal: controller.signal,
    });
    const body = await res.json().catch(() => ({}) as Record<string, unknown>);
    if (!res.ok) {
      const detail = typeof body?.message === "string" ? body.message : `HTTP ${res.status}`;
      console.error("[email] provider rejected the send:", res.status, detail);
      return { sent: false, reason: `Provider rejected: ${detail}`.slice(0, 300) };
    }
    return { sent: true, id: typeof body?.id === "string" ? body.id : null, provider: "resend" };
  } catch (err) {
    const name = err instanceof Error ? err.name : "error";
    console.error("[email] send failed:", name);
    return { sent: false, reason: `Send failed (${name}).` };
  } finally {
    clearTimeout(timer);
  }
}
