import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import { getProductBySlug } from "@/lib/products";
import { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "The GOOOL First Capsule — performance tee, heavyweight hoodie, casual tee, and touchline cap. Coming soon.",
};

// First Capsule: one deliberate premium order, not category grouping.
const CAPSULE_ORDER = [
  "goool-performance-tee",
  "goool-heavyweight-hoodie",
  "goool-heavyweight-casual-tee",
  "goool-touchline-cap",
];

export default function ShopPage() {
  const capsule = CAPSULE_ORDER.map((slug) => getProductBySlug(slug)).filter(
    (p): p is Product => p != null && p.isActive
  );

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tightest text-ink sm:text-5xl">
          The First Capsule
        </h1>
        <p className="mt-2 max-w-lg text-ink/60">
          Four pieces. One mark. Every design original — coming soon.
        </p>
      </div>

      <ProductGrid products={capsule} />
    </div>
  );
}
