import { NextRequest, NextResponse } from "next/server";
import { EMAIL_RE, addToResendAudience, recordSignup } from "@/lib/signups";

// Footer sign-up (owner decision 2026-09-29): the address is written to
// newsletter_signups (source footer) and mirrored to the Resend
// Audience. No code, no welcome sequence, no email. Mailchimp is no
// longer called.

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let email: string;
  try {
    const body = await req.json();
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }
  try {
    await recordSignup(email, "footer");
  } catch {
    console.error("[newsletter] sign-up storage unavailable");
    return NextResponse.json({ error: "Sign-up is temporarily unavailable. Please try again shortly." }, { status: 503 });
  }
  await addToResendAudience(email);
  return NextResponse.json({ ok: true });
}
