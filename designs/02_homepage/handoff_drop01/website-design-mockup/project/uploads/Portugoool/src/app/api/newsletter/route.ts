import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Newsletter signup → newsletter_signups table.
// Works in two modes:
//   - Supabase configured: inserts the email (duplicates are fine — unique
//     constraint makes the insert a no-op conflict we treat as success).
//   - Not configured yet: accepts and logs, so the UI works pre-launch.

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
    // Pre-launch placeholder: Supabase not wired up yet.
    console.log("[newsletter] signup (no DB configured):", email);
    return NextResponse.json({ ok: true });
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
