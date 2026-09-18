import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import { getProductBySlug } from "@/lib/products";
import { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "The GOOOL First Capsule: performance tee, heavyweight hoodie, casual tee, and touchline cap. Plus the GOOOL Athletics tees. Coming soon.",
};

// First Capsule: one deliberate premium order, not category grouping.
const CAPSULE_ORDER = [
  "goool-performance-tee",
  "goool-heavyweight-hoodie",
  "goool-heavyweight-casual-tee",
  "goool-touchline-cap",
];

// GOOOL Athletics: the three concept tees, in packet order (GA-01..03).
const ATHLETICS_ORDER = [
  "goool-athletics-modern-sport-tee",
  "goool-athletics-varsity-tee",
  "goool-athletics-minimal-club-tee",
];

function bySlugs(slugs: string[]): Product[] {
  return slugs
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is Product => p != null && p.isActive);
}

export default function ShopPage() {
  const capsule = bySlugs(CAPSULE_ORDER);
  const athletics = bySlugs(ATHLETICS_ORDER);

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tightest text-ink sm:text-5xl">
          The First Capsule
        </h1>
        <p className="mt-2 max-w-lg text-ink/60">
          Four pieces. One mark. Every design original. Coming soon.
        </p>
      </div>

      <ProductGrid products={capsule} />

      {athletics.length > 0 && (
        <section id="athletics" className="mt-16 border-t border-ink/10 pt-12 sm:mt-20 sm:pt-14">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-red">
              Next up
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
              GOOOL Athletics
            </h2>
            <p className="mt-2 max-w-lg text-ink/60">
              Three tees. One mark, three ways. In development. Coming soon.
            </p>
          </div>
          <ProductGrid products={athletics} />
        </section>
      )}
    </div>
  );
}
