import { NextResponse } from "next/server";

// Entry from the landing splash.
//
// This used to validate a password. It no longer does: the owner wants
// the splash kept as the landing experience for its imagery, but nobody
// turned away. The button below it sets the same cookie the middleware
// checks, for anyone who clicks it.
//
// So this is a CURTAIN, not a lock. Treat the site as fully public and
// do not put anything behind the gate that actually needs protecting -
// order data is protected by /api/track-order's own checks, and
// purchasing is gated by availableForSale, neither of which rely on
// this cookie.

export async function POST() {
  const secret = process.env.PREVIEW_KEY;
  if (!secret) {
    // No key configured means the middleware is not gating anything,
    // so there is nothing to unlock. Let the client proceed.
    return NextResponse.json({ ok: true, gate: "disabled" });
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
