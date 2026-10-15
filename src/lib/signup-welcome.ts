import { issueDiscountCode } from "@/lib/discount";
import { emailEnabled } from "@/lib/email";
import { deliverEmail, queueEmail } from "@/lib/email-delivery";
import { buildWelcome1 } from "@/lib/emails/welcome-1";
import { addToResendAudience, markEmailSent, recordSignup, unsubscribeUrl } from "@/lib/signups";

type SignupResult =
  | { status: 503; body: { error: string } }
  | { status: 200; live: boolean; body: { ok: true; subscribed: true; code: string | null; redeemed: boolean; message: string } };

/** Every public signup gets the same welcome flow. The delivery key spans forms. */
export async function signupWithWelcome(email: string, source: "popup" | "footer"): Promise<SignupResult> {
  if (!emailEnabled()) return { status: 503, body: { error: "Welcome emails are temporarily unavailable. Please try again shortly." } };
  let signup;
  try {
    signup = await recordSignup(email, source);
  } catch {
    console.error("[signup] storage unavailable");
    return { status: 503, body: { error: "Sign-up is temporarily unavailable. Please try again shortly." } };
  }
  await addToResendAudience(email);
  try {
    const issued = await issueDiscountCode(email);
    if (issued.status === "unavailable") {
      console.error("[signup] code unavailable:", issued.reason);
      return { status: 503, body: { error: "Your signup is saved, but the code could not be created. Please try again." } };
    }
    const live = /^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY ?? "");
    const code = issued.status === "redeemed" ? null : issued.code;
    // A redeemed first-order offer must not issue a second discount, but the
    // subscriber still receives a friendly welcome. Replays never duplicate it.
    const key = code ? `discount/${live ? "live" : "test"}/${code}`
      : `welcome/${live ? "live" : "test"}/returning/${signup.id}`;
    await queueEmail(key, "discount", {
      to: email, ...buildWelcome1({ code, unsubscribeUrl: unsubscribeUrl(signup.unsubscribe_token) }),
    }, live);
    if (!signup.sent_at_email1) {
      try { await markEmailSent(signup.id, 1); } catch { console.error("[signup] welcome marker failed; delivery key remains authoritative"); }
    }
    try { await deliverEmail(key); } catch { console.error("[signup] immediate delivery unavailable; worker will retry"); }
    return { status: 200, live, body: { ok: true, subscribed: true, code, redeemed: issued.status === "redeemed",
      message: code
        ? `Welcome to GOAL! Check your inbox for your welcome email. Your first-order code: ${code}.`
        : "Welcome back to GOAL! Check your inbox for your welcome email. Your first-order discount has already been used.",
    } };
  } catch {
    console.error("[signup] code or durable delivery unavailable");
    return { status: 503, body: { error: "Your signup is saved. Please try again to finish getting your welcome email." } };
  }
}
