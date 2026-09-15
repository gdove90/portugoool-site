import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

// Newsletter signup → Mailchimp audience (owner decision, 2026-09-14).
// Mailchimp is the subscriber source of truth: hosted unsubscribe links,
// welcome automation, and campaign sends all live there. Storage is
// required: if the integration is not configured the request fails with
// an honest 503 so the visitor is never told they joined when nothing
// was saved. Subscriber addresses are never written to logs.
//
// Env (Netlify + .env.local, never committed):
//   MAILCHIMP_API_KEY      key ends in -usN, which is the datacenter
//   MAILCHIMP_AUDIENCE_ID  Audience → Settings → "Audience ID"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const datacenter = apiKey?.split("-").pop();
  if (!apiKey || !audienceId || !datacenter?.startsWith("us")) {
    console.error("[newsletter] storage unavailable: Mailchimp env not configured");
    return NextResponse.json(
      { error: "Signups are temporarily down. Please try again soon." },
      { status: 503 }
    );
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
      body: JSON.stringify({
        email_address: email,
        status_if_new: "subscribed",
        tags: ["waitlist"],
      }),
    }
  ).catch(() => null);

  if (!res) {
    console.error("[newsletter] mailchimp unreachable");
    return NextResponse.json(
      { error: "Could not save your email. Try again." },
      { status: 500 }
    );
  }

  if (!res.ok) {
    // Mailchimp rejects undeliverable/role addresses with 400.
    const detail = await res.json().catch(() => null);
    if (res.status === 400) {
      console.error("[newsletter] mailchimp rejected signup:", detail?.title ?? "Bad Request");
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }
    console.error("[newsletter] mailchimp error:", res.status, detail?.title ?? "");
    return NextResponse.json(
      { error: "Could not save your email. Try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
