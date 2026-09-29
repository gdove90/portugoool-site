"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { ResolvedCollection } from "@/lib/collections";

// Filterable collection rows for the shop page (design 6a, 2026-09-29).
// "All" shows every collection in order; a category pill shows just that
// one. The pill bar sticks under the header (64px on phones, 80px from
// md, matching Header.tsx). Each collection is a numbered row: the name
// and count on the left, the cards on the right in a grid with exactly as
// many columns as the collection has products, so a row never carries an
// empty slot. On phones the cards become a swipe row showing about 1.4
// cards. The filter is local state only; nothing about stock is written
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
        className="sticky top-[64px] z-20 flex gap-2 overflow-x-auto whitespace-nowrap border-b border-ink/10 bg-paper px-5 py-3.5 [scrollbar-width:none] sm:px-6 md:top-[80px] lg:px-12"
      >
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

      {visible.map((collection) => {
        // Number from the full list so a filtered view keeps its number.
        const index = collections.findIndex((c) => c.key === collection.key);
        const products = collection.products;
        return (
          <section
            key={collection.key}
            id={collection.key}
            aria-label={`${collection.name} · ${collection.subtitle}`}
            className="flex flex-col gap-[18px] border-t border-ink/10 py-9 pl-5 sm:pl-6 md:flex-row md:gap-12 md:px-12 md:py-14 md:pb-16"
          >
            <div className="flex flex-col gap-2.5 pr-5 md:w-[260px] md:shrink-0 md:pr-0">
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
            <div
              className="flex w-full snap-x snap-mandatory gap-3.5 overflow-x-auto pr-5 [scrollbar-width:none] md:grid md:min-w-0 md:flex-1 md:snap-none md:gap-6 md:overflow-visible md:pr-0"
              style={{ gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))` }}
            >
              {products.map((product) => (
                <div key={product.id} className="w-[72%] shrink-0 snap-start md:w-auto">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
