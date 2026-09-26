// Single transactional transport. Mailchimp alone owns marketing subscriptions.
// No provider fallback: switching senders after an uncertain response can duplicate mail.
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
export function emailEnabled(): boolean { return Boolean(process.env.RESEND_API_KEY); }
export function emailProvider(): "resend" | "disabled" { return emailEnabled() ? "resend" : "disabled"; }
export function emailFrom(): string { return "GOOOL <hello@goool.shop>"; }

export async function sendEmail(msg: EmailMessage, idempotencyKey: string): Promise<EmailResult> {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(msg.to) || msg.to.length > 254)
    return { sent: false, reason: "Invalid recipient address." };
  if (!emailEnabled()) return { sent: false, disabled: true, reason: "Transactional email is not configured." };
  if (!idempotencyKey) return { sent: false, reason: "Missing delivery identity." };
  // A mock endpoint is possible only off Netlify and outside production.
  const base = process.env.NODE_ENV !== "production" && !process.env.NETLIFY
    ? process.env.RESEND_API_BASE ?? "https://api.resend.com" : "https://api.resend.com";
  try {
    const res = await fetch(`${base}/emails`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
      body: JSON.stringify({ from: emailFrom(), to: [msg.to], subject: msg.subject,
        html: msg.html, text: msg.text, reply_to: msg.replyTo ?? "hello@goool.shop" }),
      signal: AbortSignal.timeout(8000),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || typeof body.id !== "string")
      return { sent: false, reason: `Email provider returned HTTP ${res.status}.` };
    return { sent: true, id: body.id, provider: "resend" };
  } catch {
    return { sent: false, reason: "Email provider response was not received; retry with the same delivery identity." };
  }
}
