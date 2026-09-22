import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────
// LANDING CURTAIN, NOT A LOCK.
//
// The splash at / is deliberately kept as the landing experience, but
// it no longer turns anyone away: its Enter button calls /api/preview,
// which sets this cookie for any visitor who clicks. First visit sees
// the splash, one click goes through, and the cookie remembers it.
//
// Treat the site as PUBLIC. Nothing that genuinely needs protecting may
// sit behind this cookie: order lookups authenticate themselves in
// /api/track-order, and purchasing is gated by availableForSale. The
// ?key=<PREVIEW_KEY> URL still works as a way to skip the splash.
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

  // Retired routes. These must be handled HERE, not in netlify.toml:
  // middleware runs first, and the gate below would bounce an unknown
  // path to the splash before any Netlify redirect rule was consulted.
  // /world-cup was a seasonal campaign page, retired 2026-09-22.
  if (pathname === "/world-cup") {
    const url = req.nextUrl.clone();
    url.pathname = "/shop";
    url.search = "";
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
    // Keep archived cotton links useful without exposing the preview catalog.
    if (pathname === "/shop/goool-athletics-modern-sport-tee") {
      const url = req.nextUrl.clone();
      url.pathname = "/shop/goool-athletics-modern-sport-performance-tee";
      return NextResponse.redirect(url, 307);
    }
    return NextResponse.next();
  }

  const allowed =
    pathname === "/" ||
    pathname === "/api/newsletter" ||
    pathname === "/api/preview" ||
    // Server-to-server endpoints: Stripe and Apliiq webhooks (and the
    // customer-facing status lookups) can never carry the preview
    // cookie. Each route does its own authentication.
    pathname === "/api/stripe-webhook" ||
    pathname === "/api/apliiq-fulfillment" ||
    pathname === "/api/order-status" ||
    pathname === "/api/track-order" ||
    pathname === "/api/fulfillment-ops" ||
    pathname.startsWith("/print/") ||
    pathname.startsWith("/brand/") ||
    // Product imagery must stay fetchable without the preview cookie: the
    // next/image optimizer requests these server-side with no cookies.
    pathname.startsWith("/products/") ||
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
