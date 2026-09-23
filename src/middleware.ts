import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────
// REDIRECTS ONLY. The store is public.
//
// The landing curtain was removed on 2026-09-23: checkout is live, the
// catalog is purchasable, and there is nothing left to hold anyone back
// from. What remains here is the set of redirects that MUST run in
// middleware, because middleware executes before Netlify's redirect rules
// and anything expressed only in netlify.toml would never be consulted.
//
// Do not move these into netlify.toml. That was tried on 2026-09-22 for
// the retired-route redirects and they silently never fired.
// ─────────────────────────────────────────────────────────────

export function middleware(req: NextRequest) {
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
