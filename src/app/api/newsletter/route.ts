import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Newsletter signup → newsletter_signups table.
// Storage is required: if it is not configured the request fails with an
// honest 503 so the visitor is never told they joined when nothing was
// saved. Subscriber addresses are never written to logs.

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

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("[newsletter] storage unavailable: SUPABASE_SERVICE_ROLE_KEY not configured");
    return NextResponse.json(
      { error: "Signups are temporarily down. Please try again soon." },
      { status: 503 }
    );
  }

  const { error } = await supabase
    .from("newsletter_signups")
    .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });

  if (error) {
    console.error("[newsletter] insert error:", error.message);
    return NextResponse.json(
      { error: "Could not save your email. Try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
