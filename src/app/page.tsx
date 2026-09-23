import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
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
//   DropBanner        "When it's gone, it's gone" is scarcity, and every
//                     product is made to order. CLAUDE.md forbids it.
//   FabricFeatureGrid describes recycled performance polyester, which is
//                     the ST720 only. Most of the catalog is cotton.
// ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "GOOOL · Made for the Moment.",
  description:
    "The sound every stadium screams, made wearable. Premium fan apparel, original designs only.",
};

export default function HomePage() {
  const collections = resolveCollections();

  return (
    <>
      <Hero />
      <TrustBar />

      {collections.map((collection, i) => (
        <section
          key={collection.key}
          className={
            i % 2 === 1
              ? "bg-smoke py-16 sm:py-20"
              : "py-16 sm:py-20"
          }
        >
          <div className="mx-auto max-w-content px-4 sm:px-6">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
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
        <h2 className="font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
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
