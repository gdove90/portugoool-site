import { NextRequest, NextResponse } from "next/server";

// Pre-launch preview unlock: validates the password typed on the
// coming-soon page and sets the same cookie the middleware checks.
// Remove together with src/middleware.ts on launch day.

export async function POST(req: NextRequest) {
  const secret = process.env.PREVIEW_KEY;
  let password = "";
  try {
    const body = await req.json();
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!secret || password !== secret) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("goool_preview", secret, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
