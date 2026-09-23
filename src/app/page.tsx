import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import CategoryBar from "@/components/CategoryBar";
import ProductGrid from "@/components/ProductGrid";
import EmailSignup from "@/components/EmailSignup";
import FAQAccordion from "@/components/FAQAccordion";
import { FAQ_ITEMS } from "@/lib/faq";
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
  title: "GOOOL · Made for the Moment.",
  description:
    "The sound every stadium screams, made wearable. Original soccer sportswear, never licensed.",
};

export default function HomePage() {
  const collections = resolveCollections();

  return (
    <>
      <Hero />
      <TrustBar />

      {/* One line of materials storytelling, above the whole catalog, so
          every attribute it names has to hold for every piece it covers.
          Checked blank by blank on 2026-09-23 against the 10 active items
          (isActive, not availableForSale, is the gate):

            5 cotton garments, ALL documented heavyweight -
              Casual Wordmark + Varsity  B+C 4810GD, 6.5 oz
              Circular Badge             Comfort Colors C1717, supplier
                                         calls it heavyweight, no oz published
              Core Hoodie                Independent IND4000, 10 oz / 330 gsm
              Circular Center Crewneck   AS Colour 5150, 14.7 oz
            2 performance tees, BOTH the Sport-Tek ST720, "3.8 oz 100%
              recycled polyester with PosiCharge" - so sentence two is true
              of every piece it scopes itself to
            3 caps on 65/35 poly-cotton twill, which neither sentence claims

          "garment-dyed" was in this line and came out. It is documented on
          only 3 of the 5 cotton garments (4810GD x2 and the C1717); the
          hoodie and the crewneck are not garment-dyed, so stated flat above
          the whole range it was the same shape of claim that got "Premium
          Quality" removed from the bar itself.

          "ring-spun" was proposed as the safer replacement and is NOT: it
          covers the exact same 3 products as garment-dyed and no others.
          Swapping one for the other changes nothing. Both belong on those
          three product pages, where they now are, and neither belongs here.

          The caps get their own clause rather than being left out. An
          adversarial read on 2026-09-23 pointed out that a three-sentence
          materials summary sitting above a catalog containing three caps
          still reads as covering them, and "Heavyweight cotton" is flatly
          wrong for 65/35 poly-cotton twill. Naming the twill is better than
          hedging the cotton: now every one of the 10 active pieces is
          described by exactly one clause, and no clause reaches past the
          pieces it names.

          If a fourth cotton piece is ever added, re-run the check before
          adding any attribute back to this line. */}
      <section className="bg-ink pb-9">
        <p className="mx-auto max-w-2xl px-4 text-center text-sm leading-relaxed text-paper/55 sm:px-6">
          Heavyweight cotton. Recycled performance fabric where the piece
          needs to move. Structured twill where a cap has to hold its shape.
          Nothing chosen just because it was easy to print on.
        </p>
      </section>

      <CategoryBar collections={collections} />

      {/* id and scroll-mt are what CategoryBar jumps to. The offset clears
          the sticky header (64px) plus the bar itself, so a jumped-to
          heading lands below both instead of under them. */}
      {collections.map((collection, i) => (
        <section
          key={collection.key}
          id={`c-${collection.key}`}
          className={
            i % 2 === 1
              ? "scroll-mt-[124px] bg-smoke py-16 sm:py-20"
              : "scroll-mt-[124px] py-16 sm:py-20"
          }
        >
          <div className="mx-auto max-w-content px-4 sm:px-6">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl uppercase tracking-tightest text-ink sm:text-4xl">
                  {collection.name}
                </h2>
                <p className="mt-2 text-ink/60">{collection.subtitle}</p>
              </div>
              <Link
                href="/shop"
                className="hidden text-sm font-semibold text-ink underline-offset-4 hover:underline sm:block"
              >
                View all
              </Link>
            </div>
            <ProductGrid products={collection.products} />
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-content px-4 pb-4 text-center sm:px-6 sm:hidden">
        <Link
          href="/shop"
          className="inline-block rounded-full border border-ink px-8 py-3 text-sm font-semibold text-ink"
        >
          View the collection
        </Link>
      </section>

      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-3xl uppercase tracking-tightest text-ink sm:text-4xl">
          Questions
        </h2>
        <div className="mt-8">
          <FAQAccordion items={FAQ_ITEMS.slice(0, 4)} />
        </div>
        <Link
          href="/faq"
          className="mt-6 inline-block text-sm font-semibold text-ink underline-offset-4 hover:underline"
        >
          All questions
        </Link>
      </section>

      <EmailSignup />
    </>
  );
}
