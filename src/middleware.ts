import { NextRequest, NextResponse } from "next/server";
import { GATE_COOKIE, LEGACY_COOKIE, gateToken } from "@/lib/gate";

// ─────────────────────────────────────────────────────────────
// REDIRECTS, then the password gate.
//
// The store is held back from the public while the owner launches ads
// first (2026-09-23). Everything behind the gate stays live and fully
// functional for anyone holding the password: storefront, cart, checkout,
// order tracking. The public sees only /gate.
//
// These redirects MUST run in middleware, because middleware executes
// before Netlify's redirect rules and anything expressed only in
// netlify.toml would never be consulted. Do not move them into
// netlify.toml: that was tried on 2026-09-22 for the retired-route
// redirects and they silently never fired.
//
// Redirects run BEFORE the gate on purpose. A retired URL should answer
// with its 301 whether or not the visitor holds a password, so the
// redirect map keeps working for anyone who saved an old link.
// ─────────────────────────────────────────────────────────────

// Paths that must answer without the cookie, or something breaks silently.
//
//   /api/stripe-webhook      Stripe posts machine-to-machine with no
//                            cookie. Gated, every payment event would be
//                            bounced to an HTML splash, retried for three
//                            days and then abandoned - with the money
//                            already captured and no order recorded.
//   /api/apliiq-fulfillment  The supplier's shipment callback, same shape.
//   /print/                  Supplier file URLs already point at these.
//   /gate, /api/preview      The gate itself and the check behind it.
//   /brand/, /hero-crowd     The gate page's own artwork. next/image does
//                            not read these off disk: the optimizer at
//                            /_next/image makes a fresh HTTP request back
//                            to this origin for the source file, and that
//                            request carries no cookie. Gated, it is
//                            redirected to /gate and the optimizer is
//                            handed an HTML page where it expected a PNG,
//                            so the gate renders with its own logo and
//                            background broken. Measured on the first
//                            deploy of this gate, 2026-09-23.
//
// Everything else is closed. Product imagery under /products/ stays gated
// with the pages that show it.
function isPublic(pathname: string): boolean {
  return (
    pathname === "/gate" ||
    pathname === "/api/preview" ||
    pathname === "/api/stripe-webhook" ||
    pathname === "/api/apliiq-fulfillment" ||
    pathname.startsWith("/print/") ||
    pathname.startsWith("/brand/") ||
    pathname === "/hero-crowd.webp"
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Canonical domain. /print/* stays reachable on both hosts because
  // supplier file URLs reference the old domain.
  const host = req.headers.get("host") ?? "";
  if (
    (host === "portugoool.com" ||
      host === "www.portugoool.com" ||
      host === "www.goool.shop") &&
    !pathname.startsWith("/print/")
  ) {
    const url = req.nextUrl.clone();
    url.protocol = "https";
    url.host = "goool.shop";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  // /customize advertised name-and-number printing on jerseys for a flat
  // $15. No jersey is sellable, no active product sets customNameAvailable,
  // and the supplier record has no variable-text placement on any blank, so
  // every claim on that page was false. Retired 2026-09-22.
  if (pathname === "/customize") {
    return redirectToShop(req);
  }

  // /drop was "The First Capsule", a curated page of four pieces, retired
  // 2026-09-23. The catalog sells ten and the shop surfaces every one of
  // them, so the page was both redundant and an understatement of the
  // range. Its copy also still read "Four pieces, one mark".
  if (pathname === "/drop") {
    return redirectToShop(req);
  }

  // The Minimal Club Tee was retired 2026-09-22 over a print defect: the
  // narrow stroke of the "I" in ATHLETICS measured 1.19mm at actual print
  // width, against Apliiq's 2mm minimum.
  if (pathname === "/shop/goool-athletics-minimal-club-tee") {
    return redirectToShop(req);
  }

  // /world-cup was a seasonal campaign page, retired 2026-09-22.
  if (pathname === "/world-cup") {
    return redirectToShop(req);
  }

  // The cotton Modern Sport Tee is archived in favour of its ST720
  // performance twin. Its URL was live, so it points at the replacement
  // rather than 404ing. This used to sit inside the preview-cookie branch
  // and would have been lost with it.
  if (pathname === "/shop/goool-athletics-modern-sport-tee") {
    const url = req.nextUrl.clone();
    url.pathname = "/shop/goool-athletics-modern-sport-performance-tee";
    url.search = "";
    return NextResponse.redirect(url, 301);
  }

  // ── Password gate ──────────────────────────────────────────
  // Fails OPEN when PREVIEW_KEY is absent, and deliberately so. Failing
  // closed on a missing variable would lock the owner out of their own
  // site with no way back in, which is worse than the store being visible
  // a little early. /api/preview agrees: with no key it reports the gate
  // disabled rather than refusing everyone.
  //
  // Only goool_gate counts. The legacy goool_preview cookie was handed to
  // anyone who tapped Enter on the old curtain and must never open this
  // gate: see src/lib/gate.ts.
  const secret = process.env.PREVIEW_KEY;
  if (secret && !isPublic(pathname)) {
    const expected = await gateToken(secret);
    if (req.cookies.get(GATE_COOKIE)?.value !== expected) {
      const url = req.nextUrl.clone();
      url.pathname = "/gate";
      url.search = "";
      // Send them back where they were aiming once they are through.
      // Only the path and query, never a full URL, so this cannot be
      // turned into an off-site redirect; /gate re-validates it anyway.
      const wanted = pathname + req.nextUrl.search;
      if (wanted !== "/") url.searchParams.set("next", wanted);
      const res = NextResponse.redirect(url, 307);
      // Clear the legacy cookie while we are here. It no longer opens
      // anything, but it carries the password in plain text on every
      // request, and there is no reason to leave that sitting in browsers.
      if (req.cookies.has(LEGACY_COOKIE)) res.cookies.delete(LEGACY_COOKIE);
      return res;
    }
  }

  return NextResponse.next();
}

function redirectToShop(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/shop";
  url.search = "";
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
