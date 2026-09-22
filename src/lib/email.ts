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
// Provider is deliberately behind one function. Two adapters exist and
// nothing above sendEmail() knows which one ran.
//
// GOOGLE WORKSPACE (primary). goool.shop is already a Workspace domain
// with hello@goool.shop as a real inbox, so we send through the account
// the owner already pays for rather than signing up for anything.
// Verified on 2026-09-22, no DNS work required:
//   MX     smtp.google.com
//   SPF    v=spf1 include:_spf.google.com ~all
//   DKIM   google._domainkey published with a live RSA key
//   DMARC  v=DMARC1; p=none; rua=mailto:hello@goool.shop
// Sending as hello@goool.shop through Google is therefore SPF- and
// DKIM-aligned from the first message.
//
// Env (SMTP adapter wins when SMTP_USER and SMTP_PASS are both set):
//   SMTP_USER         hello@goool.shop
//   SMTP_PASS         a Google App Password (needs 2-Step Verification
//                     on that account), or SMTP relay credentials
//   SMTP_HOST         defaults to smtp.gmail.com
//   SMTP_PORT         defaults to 587 (STARTTLS)
//   RESEND_API_KEY    optional fallback adapter
//   EMAIL_FROM        defaults to "GOOOL <hello@goool.shop>"
//   EMAIL_REPLY_TO    defaults to hello@goool.shop
//   RESEND_API_BASE   test hook; the suite points this at a local mock
//
// The From address MUST be hello@goool.shop (or an alias Workspace
// permits that account to send as). Google rewrites or rejects a From
// the authenticated account does not own, so a mismatch here silently
// changes the sender the customer sees.
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

export function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function emailEnabled(): boolean {
  return smtpConfigured() || Boolean(process.env.RESEND_API_KEY);
}

/** Which adapter a send would use right now. Handy in ops output. */
export function emailProvider(): "smtp" | "resend" | "disabled" {
  if (smtpConfigured()) return "smtp";
  if (process.env.RESEND_API_KEY) return "resend";
  return "disabled";
}

export function emailFrom(): string {
  return process.env.EMAIL_FROM ?? "GOOOL <hello@goool.shop>";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendEmail(msg: EmailMessage): Promise<EmailResult> {
  if (!EMAIL_RE.test(msg.to) || msg.to.length > 254) {
    // Never log the address itself.
    console.error("[email] refusing to send to a malformed address");
    return { sent: false, reason: "Invalid recipient address." };
  }

  if (smtpConfigured()) return sendViaSmtp(msg);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Visible, not silent: this is the difference between "we chose not
    // to mail" and "we think we mailed and did not".
    console.error("[email] DISABLED (no SMTP_USER/SMTP_PASS, no RESEND_API_KEY) - would have sent:", msg.subject);
    return { sent: false, reason: "Email provider not configured.", disabled: true };
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

/**
 * Google Workspace SMTP.
 *
 * Timeouts are short and explicit. This runs inside the Stripe webhook,
 * which shares a ~10s platform budget with the Apliiq submission, and
 * an SMTP handshake that hangs would burn the whole budget and take the
 * webhook down with it. nodemailer's defaults are far too generous for
 * that, so all three phases are bounded.
 *
 * `pool` is deliberately OFF: serverless invocations are short-lived and
 * a pooled connection would be torn down mid-flight anyway.
 */
async function sendViaSmtp(msg: EmailMessage): Promise<EmailResult> {
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;
  const host = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? 587);
  const budget = Number(process.env.EMAIL_TIMEOUT_MS ?? 8000);

  try {
    const nodemailer = (await import("nodemailer")).default;
    const transport = nodemailer.createTransport({
      host,
      port,
      // 587 is STARTTLS (secure:false + upgrade); 465 is implicit TLS.
      secure: port === 465,
      auth: { user, pass },
      pool: false,
      connectionTimeout: budget,
      greetingTimeout: budget,
      socketTimeout: budget,
    });

    const info = await transport.sendMail({
      from: emailFrom(),
      to: msg.to,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      replyTo: msg.replyTo ?? process.env.EMAIL_REPLY_TO ?? "hello@goool.shop",
    });
    transport.close();

    // nodemailer resolves on a 2xx from the server. `rejected` carries
    // recipients the server refused outright; treating that as success
    // would be the exact false positive this module exists to avoid.
    const rejected = (info as { rejected?: unknown[] }).rejected ?? [];
    if (rejected.length > 0) {
      console.error("[email] SMTP accepted the message but rejected the recipient");
      return { sent: false, reason: "Recipient rejected by the mail server." };
    }
    return {
      sent: true,
      id: (info as { messageId?: string }).messageId ?? null,
      provider: "workspace-smtp",
    };
  } catch (err) {
    // Google's auth failures are worth naming: they are a config problem
    // the owner has to fix, not a transient blip to retry forever.
    const e = err as { responseCode?: number; message?: string; name?: string };
    const auth = e.responseCode === 534 || e.responseCode === 535;
    const detail = auth
      ? "SMTP auth rejected. Check SMTP_USER is hello@goool.shop and SMTP_PASS is a current Google App Password (needs 2-Step Verification, and the Workspace admin must allow app passwords)."
      : `SMTP send failed (${e.name ?? "error"}${e.responseCode ? " " + e.responseCode : ""}).`;
    console.error("[email]", detail);
    return { sent: false, reason: detail.slice(0, 300) };
  }
}
