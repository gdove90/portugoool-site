import { NextRequest, NextResponse } from "next/server";
import { TEMPO_COLLECTION_COMING_SOON } from "@/lib/collection-launch";
import { MIGRATION_PREVIEW } from "@/lib/migration-preview";
import { storeClosed, SERVICE_PATHS } from "@/lib/store-status";
import { GATE_COOKIE, LEGACY_COOKIE, gateToken } from "@/lib/gate";

// Public launch: 2026-09-25. Keep canonical and retired-route redirects here.
//
// Renovation gate (owner decision 2026-10-12): every piece is being
// redesigned, so the public sees only /gate ("Closed for renovation")
// while the owner's team keeps the full store behind a password.
// Reopening requires STORE_OPEN=true and removing PREVIEW_KEY after release approval.
// Never put PREVIEW_KEY in a local .env file used for a production build.

// Paths that must answer without the gate cookie, or something breaks
// silently. Machine callers carry no cookie, so a gated callback is
// bounced to an HTML page and the work it carried is lost.
//
//   /api/stripe-webhook        Stripe payment events.
//   /api/apliiq-fulfillment    Supplier shipment callbacks.
//   /api/fulfillment-ops       Called every minute by the deliver-emails
//                              scheduled function (order emails, supplier
//                              submission).
//   /api/intake/maintenance    Hourly intake-maintenance scheduled function.
//   /print/                    Supplier print-file URLs.
//   /gate, /api/preview        The gate itself and its password check.
//   /api/newsletter            The gate page's "notify me" signup.
//   /track-order, /success     Customers with an order in flight, and the
//   and their APIs             Stripe return page for a checkout that
//                              straddles the switch.
//   legal + unsubscribe        Linked from the gate page and from emails.
//   /fonts/, icons, OG image   Assets the gate page and link previews use.
const PUBLIC_PATHS = new Set([
  "/gate",
  "/api/preview",
  "/api/stripe-webhook",
  "/api/apliiq-fulfillment",
  "/api/fulfillment-ops",
  "/api/intake/maintenance",
  "/api/newsletter",
  "/track-order",
  "/api/track-order",
  "/success",
  "/api/order-status",
  "/privacy",
  "/terms",
  "/refunds",
  // Existing customers still need help while shopping is closed.
  "/contact",
  "/support",
  "/faq",
  "/shipping-returns",
  "/robots.txt",
  "/sitemap.xml",
  "/icon.png",
  "/icon.svg",
  "/manifest.webmanifest",
  "/apple-icon.png",
]);
const PUBLIC_PREFIXES = ["/icons/", "/print/", "/fonts/", "/brand/", "/unsubscribe/", "/opengraph-image", "/.well-known/", "/.netlify/"];
// Preserve existing payment returns and order links on their original host.
// Public support and legal pages instead canonicalize after the cutover.
const LEGACY_RETURN_PATHS = new Set(["/success", "/track-order"]);

// Next image optimization fetches local product files without the team cookie.
// Permit only the released ST720 assets; catalog pages and checkout stay gated.
const ST720_IMAGE = /^\/products\/goal-ga-(?:minimal|big)-tee-(?:black|true-royal|white-black-red|white-royal|silver|true-red)-(?:front|back)\.webp$/;
const GA_MINIMAL_WHITE_CATALOG_IMAGE = /^\/products\/goal-ga-minimal-white-black-red-catalog-(?:product-front|product-back|model-front|model-three-quarter|model-rear|print-detail)-20261014\.webp$/;
const GA_MINIMAL_SHORTS_IMAGE = /^\/products\/goal-ga-minimal-shorts-(?:black|ink-blue|shadow)-front\.webp$/;
const GA_MINIMAL_MODEL_CATALOG_IMAGE = /^\/products\/goal-ga-minimal-(?:true-royal|black|true-red)-catalog-model-(?:front|front-quarter|rear|rear-quarter)-20261015\.webp$/;

function isPublic(pathname: string): boolean {
  return ST720_IMAGE.test(pathname) || GA_MINIMAL_WHITE_CATALOG_IMAGE.test(pathname) || GA_MINIMAL_SHORTS_IMAGE.test(pathname) || GA_MINIMAL_MODEL_CATALOG_IMAGE.test(pathname) ||(TEMPO_COLLECTION_COMING_SOON && ["/women", "/v84/assets/women.png"].includes(pathname)) || SERVICE_PATHS.has(pathname) || PUBLIC_PATHS.has(pathname) || PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // A review build may inherit credentials: deny every operational endpoint.
  if (MIGRATION_PREVIEW && (pathname.startsWith("/api/") || pathname.startsWith("/.netlify/") || pathname.startsWith("/unsubscribe/"))) {
    return NextResponse.json({ error: "Design preview: live operations are disabled." }, { status: 503 });
  }

  // Canonical domain. /print/* stays reachable on both hosts because
  // supplier file URLs reference the old domain.
  const host = (req.headers.get("host") ?? "").toLowerCase().split(":")[0];
  const cutover = process.env.DOMAIN_CUTOVER_ENABLED === "true";
  if (
    ((cutover && host === "goool.shop") || host === "www.goalathletics.shop" || host === "portugoool.com" ||
      host === "www.portugoool.com" ||
      host === "www.goool.shop") &&
    !pathname.startsWith("/print/") && !pathname.startsWith("/api/") &&
    !pathname.startsWith("/.netlify/") && !pathname.startsWith("/unsubscribe/") &&
    !(cutover ? LEGACY_RETURN_PATHS.has(pathname) : SERVICE_PATHS.has(pathname)) &&
    ["GET", "HEAD"].includes(req.method)
  ) {
    const url = req.nextUrl.clone();
    url.protocol = "https";
    url.host = cutover ? "goalathletics.shop" : "goool.shop";
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

  // The cotton Modern Sport Tee is archived. Its URL was live and used to
  // point at its ST720 performance twin, which was retired on 2026-10-15
  // with the rest of the GOOOL clothing, so it now goes to the shop.
  if (pathname === "/shop/goool-athletics-modern-sport-tee") {
    return redirectToShop(req);
  }

  // Retired from the website on 2026-10-15 (owner: remove all clothing that
  // uses the spelling GOOOL): both Core Hoodie rows, both Terrace Tee rows
  // and the Matchday Tee. Their Apliiq designs remain saved. Old links go to
  // the shop rather than 404ing.
  if (
    pathname === "/shop/goool-heavyweight-hoodie" ||
    pathname === "/shop/goool-heavyweight-hoodie-blue" ||
    pathname === "/shop/goool-heavyweight-casual-tee" ||
    pathname === "/shop/goool-heavyweight-casual-tee-blue" ||
    pathname === "/shop/goool-athletics-modern-sport-performance-tee"
  ) {
    return redirectToShop(req);
  }

  // Retired from the website on 2026-09-24 for the Core Capsule launch
  // (owner decision): the Athletics Varsity Tee, Circular Badge Tee and
  // Circular Center Crewneck. Their Apliiq designs remain saved. Old links
  // go to the shop rather than 404ing.
  if (
    pathname === "/shop/goool-athletics-varsity-tee" ||
    pathname === "/shop/goool-athletics-circular-badge-tee" ||
    pathname === "/shop/goool-athletics-circular-center-crewneck"
  ) {
    return redirectToShop(req);
  }

  // Closure defaults ON. An absent password disables team access, never the closure.
  // Only goool_gate counts; see src/lib/gate.ts for why the legacy
  // goool_preview cookie never opens it.
  const secret = process.env.PREVIEW_KEY;
  if (!MIGRATION_PREVIEW && storeClosed() && !isPublic(pathname)) {
    const expected = secret ? await gateToken(secret) : null;
    if (!expected || req.cookies.get(GATE_COOKIE)?.value !== expected) {
      // An API caller cannot follow a redirect to an HTML page, so it gets
      // a plain refusal instead of a 307 it would replay against /gate.
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "The store is closed for renovation." }, { status: 401 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/gate";
      url.search = "";
      // Only the path and query, never a full URL, so this cannot become an
      // off-site redirect; /gate re-validates it anyway.
      const wanted = pathname + req.nextUrl.search;
      if (wanted !== "/") url.searchParams.set("next", wanted);
      const res = NextResponse.redirect(url, 307);
      if (req.cookies.has(LEGACY_COOKIE)) res.cookies.delete(LEGACY_COOKIE);
      return res;
    }
  }

  // Region cookie for the advertising-consent default (owner decision
  // 2026-09-30): US visitors are allowed by default, everyone else is
  // denied until they click Allow. Netlify supplies the country at the
  // edge; anything unreadable is XX, which the client treats as non-US.
  const res = NextResponse.next();
  const country = countryOf(req);
  if (req.cookies.get("goool_geo")?.value !== country) {
    res.cookies.set("goool_geo", country, { path: "/", maxAge: 30 * 86400, sameSite: "lax" });
  }
  return res;
}

function countryOf(req: NextRequest): string {
  const geo = (req as unknown as { geo?: { country?: { code?: string } | string } }).geo;
  const fromGeo = typeof geo?.country === "string" ? geo.country : geo?.country?.code;
  let fromNf: string | undefined;
  const nfGeo = req.headers.get("x-nf-geo");
  if (nfGeo) {
    try {
      const parsed = JSON.parse(nfGeo.trim().startsWith("{") ? nfGeo : atob(nfGeo));
      fromNf = parsed?.country?.code;
    } catch { /* unreadable header */ }
  }
  const c = (fromGeo || fromNf || req.headers.get("x-country") || req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "").toUpperCase();
  return /^[A-Z]{2}$/.test(c) ? c : "XX";
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
