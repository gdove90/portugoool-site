import type { Metadata } from "next";
import { Fragment } from "react";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import FeelingBand from "@/components/FeelingBand";
import ProductCard from "@/components/ProductCard";
import { resolveCollections } from "@/lib/collections";

// ─────────────────────────────────────────────────────────────
// The store homepage. Live 2026-09-23, replacing the Coming Soon
// takeover that stood here while checkout was being finished.
//
// This is NOT the pre-takeover homepage restored from git. That one sold
// The Portugal Collection, The England Collection and a $15 name-and-number
// add-on on jerseys. None of the three exists: there is no sellable jersey,
// no active product sets customNameAvailable, and /customize was retired on
// 2026-09-22 precisely because every claim on it was false. Reverting the
// old file would have put those claims straight back on the front page.
//
// So the sections are driven by resolveCollections(), which reads the live
// catalog. Add a product to a collection in src/lib/collections.ts and it
// appears here; retire one and it disappears. Nothing on this page is a
// hardcoded claim about stock that can drift out of date.
//
// Homepage v2 (2026-09-29): layout rebuilt to the approved Claude Design
// file "Homepage v2.dc.html". Hero, trust bar, then each collection as a
// numbered two-column section (label + name + tagline on the left, cards
// on the right), a "Wear the Feeling." block after the second collection
// (big type since design 4a, 2026-09-29; it began as a full-bleed photo
// band). The email sign-up moved into the footer (Footer 2a, same
// day), so it is no longer a section here. Products, prices, cart and
// checkout are untouched: this file only arranges what the catalog
// resolves.
//
// Removed in v2 (all still reachable elsewhere):
//   CategoryBar  the sticky pill bar; the sections are short enough that
//                a numbered label per section replaces it. The component
//                is kept for /shop-style pages that want it.
//   Materials line ("Heavyweight cotton. Recycled performance fabric...")
//                folded into each collection's tagline, so every claim
//                now sits next to the pieces it covers.
//   "Questions"  the four-item FAQ block; /faq is linked from the footer.
//   "View all"   the per-section links to /shop; the header's Collection
//                link and every card cover it.
//
// Deliberately not included:
//   DropBanner  deleted 2026-09-23 along with /drop. It carried "When
//               it's gone, it's gone", which is scarcity, and nothing here
//               is stocked in a way that makes it true. It was also the
//               last "Shop the Drop" button left in the codebase.
//
// FabricFeatureGrid used to be listed here too. It was a styled "The
// fabric" section, six cards, written when the range was all performance
// polyester, and it was excluded from this page because its claims had
// gone false. Leaving it in the repo was the mistake: it compiled, it
// looked finished, and anyone wanting a fabric section would have found
// it and dropped it in. Four of its six cards were wrong against the
// current catalog - "No heavy cotton" (5 of 10 products are heavyweight
// cotton, up to 14.7 oz), "100% recycled performance polyester" (2
// products, both ST720), "Premium enough for match day" (the adjective
// removed from the bar and all metadata on 2026-09-23), and
// "Sublimation-friendly fabric" (the word appeared nowhere else in the
// repo; the catalog prints by embroidery, DTF and transfer).
//
// Deleted 2026-09-23. If this page ever wants a fabric section, write it
// from src/lib/products.ts, not from memory of what the range used to be.
// ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  // The homepage title is the strongest single field on the site and it
  // is the clickable headline in a search result. It read "GOOOL · Made
  // for the Moment." until 2026-09-23, which is the brand line and
  // contains no word anyone searches for. The tagline is kept in full and
  // the category is added in front of it.
  //
  // 57 characters. Google truncates around 60, so nothing is cut on
  // desktop, and on mobile it wraps with the category on the first line.
  title: "GOOOL · Original Soccer Sportswear · Made for the Moment.",
  // 153 characters. Google renders about 155 on desktop and cuts nearer
  // 120 on mobile, so the order is deliberate: what is sold and what it
  // costs comes first and survives the mobile cut, positioning second,
  // shipping last where losing it costs least.
  //
  // Every claim checked against the catalog on 2026-09-23. "$48" is the
  // real floor and sits on 8 of the 10 live products. "Heavyweight" holds
  // for all five cotton garments. "Embroidered caps" is the three OTTO
  // 31-069s. The four countries are exactly allowed_countries in
  // api/checkout. An earlier draft opened with the brand line and ran to
  // 190 characters, which would have been cut mid-phrase at "Ships to".
  description:
    "Heavyweight cotton tees, hoodies and embroidered caps from $48. Original soccer sportswear, never licensed. Ships to the US, Canada, the UK and Portugal.",
};

// The band sits after this many collections (0-based index of the
// section it follows). Second of four in the approved layout.
const BAND_AFTER = 1;

export default function HomePage() {
  const collections = resolveCollections();
  const first = collections[0];

  return (
    <>
      <Hero shopHref={first ? `#c-${first.key}` : "/shop"} />
      <TrustBar />

      {/* Section ids are kept from v1 (c-<key>) so old anchors still land.
          scroll-mt clears the sticky header (80px on desktop). */}
      {collections.map((collection, i) => (
        <Fragment key={collection.key}>
          <section
            id={`c-${collection.key}`}
            className="scroll-mt-20 border-t border-ink/10 py-16 sm:py-20"
          >
            <div className="mx-auto grid max-w-content gap-10 px-4 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
              <header>
                <p className="font-display text-sm uppercase tracking-widest text-red">
                  {String(i + 1).padStart(2, "0")} · {collection.filterLabel}
                </p>
                <h2 className="mt-3 font-display text-5xl uppercase leading-none tracking-tightest text-ink sm:text-6xl">
                  {collection.name}
                </h2>
                <p className="mt-4 max-w-xs text-ink/60">{collection.tagline}</p>
              </header>
              <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
                {collection.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
          {i === BAND_AFTER && <FeelingBand />}
        </Fragment>
      ))}
    </>
  );
}
