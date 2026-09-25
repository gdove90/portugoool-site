import { NextRequest, NextResponse } from "next/server";
import { EMAIL_RE, subscribeToAudience } from "@/lib/mailchimp";

// Footer newsletter signup → Mailchimp audience (owner decision,
// 2026-09-14). The upsert itself lives in src/lib/mailchimp.ts, shared
// with the GOOOL20 popup (api/discount). Storage is required: if the
// integration is not configured the request fails with an honest 503 so
// the visitor is never told they joined when nothing was saved.

export async function POST(req: NextRequest) {
  let email: string;
  let source = "";
  try {
    const body = await req.json();
    email = String(body.email ?? "").trim().toLowerCase();
    // Only a known value becomes a Mailchimp tag; the client cannot
    // invent tags.
    source = body.source === "goool20" ? "goool20" : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const result = await subscribeToAudience(email, source ? ["waitlist", source] : ["waitlist"]);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ ok: true });
}
