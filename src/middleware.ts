import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────
// PRE-LAUNCH HARD GATE: every route redirects to the coming-soon
// landing — unless the visitor has the preview cookie.
//
// Owner access: visit any URL with ?key=<PREVIEW_KEY> once
// (e.g. https://portugoool.com/?key=...). That sets a 30-day cookie
// and unlocks the full site on this browser. The key lives in the
// PREVIEW_KEY env var (Netlify + .env.local) — never hardcoded,
// because this repo is public.
//
// Always allowed (no cookie needed):
//   /                    coming-soon page
//   /api/newsletter      email capture
//   /print/*             production print files (Printful fetches these)
//   icons + hero image   assets the landing needs
//
// LAUNCH DAY: delete this file (and restore the store homepage). The
// canonical-domain 301 below is also covered by netlify.toml redirect
// rules, which take over once no middleware runs in front of them.
// ─────────────────────────────────────────────────────────────

const COOKIE = "goool_preview";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const secret = process.env.PREVIEW_KEY;

  // Canonical domain: middleware runs before Netlify redirect rules, so
  // the portugoool.com → goool.shop 301 must happen here. /print/* stays
  // reachable on both hosts (supplier file URLs reference the old domain).
  const host = req.headers.get("host") ?? "";
  if (
    (host === "portugoool.com" || host === "www.portugoool.com" || host === "www.goool.shop") &&
    !pathname.startsWith("/print/")
  ) {
    const url = req.nextUrl.clone();
    url.protocol = "https";
    url.host = "goool.shop";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  // Key in the URL → set the cookie and continue to the same page (clean URL).
  if (secret && searchParams.get("key") === secret) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("key");
    const res = NextResponse.redirect(url, 307);
    res.cookies.set(COOKIE, secret, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return res;
  }

  // Valid cookie → full site.
  if (secret && req.cookies.get(COOKIE)?.value === secret) {
    return NextResponse.next();
  }

  const allowed =
    pathname === "/" ||
    pathname === "/api/newsletter" ||
    pathname === "/api/preview" ||
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
