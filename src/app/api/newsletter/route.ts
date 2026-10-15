import { NextRequest, NextResponse } from "next/server";
import { EMAIL_RE } from "@/lib/signups";
import { signupWithWelcome } from "@/lib/signup-welcome";

// Footer and renovation-page signups both receive the welcome and code.

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
  const result = await signupWithWelcome(email, "footer");
  return NextResponse.json(result.body, { status: result.status });
}
