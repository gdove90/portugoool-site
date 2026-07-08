import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────
// PRE-LAUNCH HARD GATE: every route redirects to the coming-soon
// landing. Nothing else is visible.
//
// Allowed through:
//   /                    the coming-soon page
//   /api/newsletter      the email capture behind the form
//   /print/*             production print files (Printful fetches these)
//   Next internals + icons + the hero image (assets the landing needs)
//
// LAUNCH DAY: delete this file (and restore the store homepage).
// ─────────────────────────────────────────────────────────────

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const allowed =
    pathname === "/" ||
    pathname === "/api/newsletter" ||
    pathname.startsWith("/print/") ||
    pathname === "/icon.svg" ||
    pathname === "/apple-icon.png" ||
    pathname === "/hero-crowd.webp";

  if (allowed) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Everything except Next internals and static chunks.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
