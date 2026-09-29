"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { ResolvedCollection } from "@/lib/collections";

// Filterable collection rows for the shop page (design 6a, 2026-09-29).
// "All" shows every collection in order; a category pill shows just that
// one. The pill bar sticks under the header (64px on phones, 80px from
// md, matching Header.tsx). Each collection is a numbered row: the name
// and count on the left, the cards on the right in the homepage's card
// grid (owner, 2026-09-29: garment images must be the same size on both
// pages, so the container, columns and gaps mirror src/app/page.tsx).
// On phones the cards become a swipe row showing about 1.4 cards. The filter is local state only; nothing about stock is written
// here, every card reads the catalog.
export default function ShopCollections({
  collections,
}: {
  collections: ResolvedCollection[];
}) {
  const [selected, setSelected] = useState<string>("all");
  const visible =
    selected === "all"
      ? collections
      : collections.filter((c) => c.key === selected);

  const filters = [
    { key: "all", label: "All" },
    ...collections.map((c) => ({ key: c.key, label: c.filterLabel })),
  ];

  return (
    <div>
      <div
        role="group"
        aria-label="Filter by category"
        className="sticky top-[64px] z-20 border-b border-ink/10 bg-paper md:top-[80px]"
      >
        <div className="mx-auto flex max-w-content gap-2 overflow-x-auto whitespace-nowrap px-4 py-3.5 [scrollbar-width:none] sm:px-6">
        {filters.map((f) => {
          const active = selected === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setSelected(f.key)}
              aria-pressed={active}
              className={`min-h-[44px] shrink-0 rounded-full px-[18px] font-display text-sm uppercase tracking-[0.08em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                active
                  ? "border border-ink bg-ink text-paper"
                  : "border border-ink/30 text-ink hover:border-ink"
              }`}
            >
              {f.label}
            </button>
          );
        })}
        </div>
      </div>

      {visible.map((collection) => {
        // Number from the full list so a filtered view keeps its number.
        const index = collections.findIndex((c) => c.key === collection.key);
        const products = collection.products;
        return (
          <section
            key={collection.key}
            id={collection.key}
            aria-label={`${collection.name} · ${collection.subtitle}`}
            className="border-t border-ink/10 py-9 md:py-14"
          >
            <div className="mx-auto flex max-w-content flex-col gap-[18px] pl-4 sm:pl-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16 lg:px-6">
            <div className="flex flex-col gap-2.5 pr-4 sm:pr-6 lg:pr-0">
              <p className="font-display text-sm uppercase tracking-[0.16em] text-red">
                {String(index + 1).padStart(2, "0")} · {collection.subtitle}
              </p>
              <h2 className="font-display text-[34px] uppercase leading-none md:text-[44px]">
                {collection.name}
              </h2>
              <p className="text-[15px] text-ink/60">
                {products.length} {products.length === 1 ? "piece" : "pieces"}
              </p>
            </div>
            {/* Same card grid as the homepage (2 across from md, 3 from lg,
                same gaps, same 1200px container), so a garment reads at
                the same size on both pages. Phones keep the swipe row. */}
            <div className="flex w-full snap-x snap-mandatory gap-3.5 overflow-x-auto pr-4 [scrollbar-width:none] sm:pr-6 md:grid md:min-w-0 md:grid-cols-2 md:gap-x-6 md:gap-y-10 md:snap-none md:overflow-visible lg:grid-cols-3 lg:gap-x-8 lg:pr-0">
              {products.map((product) => (
                <div key={product.id} className="w-[72%] shrink-0 snap-start md:w-auto">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
