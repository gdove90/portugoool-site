import type { Metadata } from "next";
import ShopCollections from "@/components/ShopCollections";
import { resolveCollections } from "@/lib/collections";
import { getProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { hasPrice } from "@/lib/types";

// The title counts the live catalog instead of hard-coding it. It read
// "Shop All Ten Pieces" until 2026-09-23, when the Casual Wordmark Tee was
// retired and the store sold nine - a number in a title goes stale the
// moment the catalog changes, and a search result promising ten pieces to
// someone who finds nine is a small lie told at the front door.
const NUMBER_WORDS = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen", "Twenty",
];

export function generateMetadata(): Metadata {
  const count = getProducts().length;
  const word = NUMBER_WORDS[count];
  return {
    title: word ? `Shop All ${word} Pieces` : "Shop the Collection",
    description:
      "The First Capsule: heavyweight cotton tees, a hoodie and crewneck, performance tees and embroidered caps. Grouped into Touchline Essentials, Match Ready, Warm-Up Club and Off the Pitch.",
    alternates: { canonical: "/shop" },
  };
}

// Design 6a (2026-09-29): a full-width black hero band with the live
// piece count and floor price, then the sticky pill bar and the
// collection rows from ShopCollections. Both figures are computed from
// the catalog on every build, the same way the title is.
export default function ShopPage() {
  const collections = resolveCollections();
  const products = getProducts();
  const count = products.length;
  const priced = products.filter(hasPrice).map((p) => p.priceCents);
  const fromPrice = priced.length ? formatPrice(Math.min(...priced)) : null;

  return (
    <>
      <section className="border-t border-paper/10 bg-ink pb-8 pt-10 text-paper md:pb-12 md:pt-[72px]">
        <div className="mx-auto max-w-content px-4 sm:px-6">
        <h1 className="font-display text-[52px] uppercase leading-[0.92] tracking-[-0.01em] md:text-[112px]">
          The <span className="text-red">First</span> Capsule
        </h1>
        <div className="mt-3.5 flex flex-col items-start gap-2.5 md:mt-5 md:flex-row md:items-end md:justify-between md:gap-6">
          <p className="text-lg leading-snug text-paper/80">
            Everyday staples. Athletic purpose. The Core Collection.
          </p>
          <p className="whitespace-nowrap font-display text-[15px] uppercase tracking-[0.14em] text-paper/60">
            {count} pieces{fromPrice ? ` · from ${fromPrice}` : ""}
          </p>
        </div>
        </div>
      </section>
      <ShopCollections collections={collections} />
    </>
  );
}
