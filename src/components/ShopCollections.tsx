"use client";

import { useState } from "react";
import ProductGrid from "./ProductGrid";
import { ResolvedCollection } from "@/lib/collections";

// Filterable collection sections for the shop page. "All" shows every
// collection in order; a category filter shows just that section.
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
        className="mb-12 flex flex-wrap gap-2"
      >
        {filters.map((f) => {
          const active = selected === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setSelected(f.key)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/20 text-ink/70 hover:border-ink/50 hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-16 sm:space-y-20">
        {visible.map((collection) => (
          <section key={collection.key} aria-label={`${collection.name} · ${collection.subtitle}`}>
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold uppercase tracking-tightest text-ink sm:text-3xl">
                {collection.name}
              </h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-ink/50">
                {collection.subtitle}
              </p>
            </div>
            <ProductGrid products={collection.products} />
          </section>
        ))}
      </div>
    </div>
  );
}
