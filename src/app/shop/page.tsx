import type { Metadata } from "next";
import ShopCollections from "@/components/ShopCollections";
import { resolveCollections } from "@/lib/collections";
import { getProducts } from "@/lib/products";

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

export default function ShopPage() {
  const collections = resolveCollections();

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 sm:py-14 xl:px-10">
      <div className="mb-10">
        <h1 className="font-display text-4xl uppercase tracking-tightest text-ink sm:text-5xl">
          The First Capsule
        </h1>
        <p className="mt-2 max-w-lg text-ink/60">
          Everyday staples. Athletic purpose. The first GOOOL capsule.
        </p>
      </div>

      <ShopCollections collections={collections} />
    </div>
  );
}
