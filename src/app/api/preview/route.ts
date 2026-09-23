import { NextRequest, NextResponse } from "next/server";

// Password check for the site gate.
//
// This route used to be a curtain: it set the cookie for anyone who asked,
// validated nothing, and said so in its own header comment. It is now the
// only thing standing between the public and a storefront that is not open
// yet, so it actually checks.
//
// The password never reaches the browser bundle. The client posts what was
// typed, this compares it server-side against PREVIEW_KEY, and only a match
// gets the cookie back.
//
// Case-insensitive on purpose. This is a preview password shared out loud
// and typed on phone keyboards that capitalise the first letter for you —
// "Gary" and "gary" are the same intent, and a curtain that rejects the
// owner because their keyboard was helpful is a support problem, not
// security. It guards an unreleased storefront, not customer data: order
// lookups have their own checks in /api/track-order, and purchasing is
// gated by the catalog's own isActive flag.

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = process.env.PREVIEW_KEY;

  // No key configured means the gate is not holding anything back, so there
  // is nothing to unlock and nothing to refuse. Middleware fails open in the
  // same case, and the two must agree or the site locks everyone out.
  if (!secret) {
    return NextResponse.json({ ok: true, gate: "disabled" });
  }

  let password = "";
  try {
    const body = (await req.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (password.trim().toLowerCase() !== secret.trim().toLowerCase()) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
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
