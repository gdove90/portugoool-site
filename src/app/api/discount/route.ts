import { NextRequest, NextResponse } from "next/server";
import { clientIpFrom, sendMetaServerEvent } from "@/lib/meta-capi";
import { leadStableId, metaEventId } from "@/lib/meta-events";
import { issueDiscountCode } from "@/lib/discount";
import { emailEnabled } from "@/lib/email";
import { deliverEmail, queueEmail } from "@/lib/email-delivery";
import { buildWelcome1 } from "@/lib/emails/welcome-1";
import { EMAIL_RE, addToResendAudience, markEmailSent, recordSignup, unsubscribeUrl } from "@/lib/signups";

// Popup sign-up (owner decision 2026-09-29): the address is written to
// newsletter_signups (source popup) and mirrored to the Resend Audience,
// the GOOOL20 code is issued exactly as before, and Email 1 of the
// welcome sequence is queued in the durable store and pushed once right
// away. A provider failure never fails the sign-up: the row and the
// queued delivery stay, and the minute worker retries. Mailchimp is no
// longer called.

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let email: string;
  let consent: string | null = null;
  try {
    const body = await req.json();
    consent = req.headers?.get?.("sec-gpc") === "1" || body.consent !== "granted" ? "denied" : "granted";
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  if (!emailEnabled()) return NextResponse.json(
    { error: "Code delivery is temporarily unavailable. Please try again shortly." }, { status: 503 });

  let signup;
  try {
    signup = await recordSignup(email, "popup");
  } catch {
    console.error("[discount] sign-up storage unavailable");
    return NextResponse.json({ error: "Sign-up is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
  await addToResendAudience(email);

  try {
    const issued = await issueDiscountCode(email);
    if (issued.status === "unavailable") {
      console.error("[discount] code unavailable:", issued.reason);
      return NextResponse.json({ error: "Your signup is saved, but the code could not be created. Please try again." }, { status: 503 });
    }
    if (issued.status === "redeemed") {
      return NextResponse.json({ ok: true, subscribed: true, code: null, redeemed: true });
    }
    const live = /^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY ?? "");
    const key = `discount/${live ? "live" : "test"}/${issued.code}`;
    await queueEmail(key, "discount", {
      to: email, ...buildWelcome1({ code: issued.code, unsubscribeUrl: unsubscribeUrl(signup.unsubscribe_token) }),
    }, live);
    if (!signup.sent_at_email1) {
      try { await markEmailSent(signup.id, 1); } catch { console.error("[discount] sent_at_email1 marker failed; queue key is authoritative"); }
    }
    try { await deliverEmail(key); } catch { console.error("[discount] immediate send failed for", email, "; queued for retry"); }
    // Server-side Lead, same event_id the popup fires in the browser, so
    // Meta keeps one. Never blocks the sign-up.
    try {
    await sendMetaServerEvent({
      name: "Lead",
      eventId: await metaEventId("Lead", leadStableId(email, issued.code)),
      email,
      clientIp: clientIpFrom({ get: (n) => req.headers?.get?.(n) ?? null }),
      userAgent: req.headers?.get?.("user-agent") ?? null,
      fbp: req.cookies?.get?.("_fbp")?.value ?? null,
      fbc: req.cookies?.get?.("_fbc")?.value ?? null,
      sourceUrl: "https://goool.shop/",
      consent,
      livemode: live,
      customData: { content_name: "GOOOL20 sign-up" },
    });
    } catch { console.error("[meta] Lead tracking failed; signup remains successful"); }
    return NextResponse.json({ ok: true, subscribed: true, code: issued.code });
  } catch {
    console.error("[discount] issue or durable delivery unavailable for", email);
    return NextResponse.json({ error: "Your signup is saved. Please try again to finish getting your code." }, { status: 503 });
  }
}
