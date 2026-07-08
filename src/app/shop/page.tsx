import type { Metadata } from "next";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Premium game-day shirts and jersey-style fan apparel. Limited drops, original designs.",
};

export default function ShopPage() {
  const products = getProducts();

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tightest text-ink sm:text-5xl">
            Shop
          </h1>
          <p className="mt-2 text-ink/60">
            Every shirt made to order. Every design original.
          </p>
        </div>
        <Link
          href="/drop"
          className="inline-block w-fit rounded-full bg-red px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-red-dark"
        >
          Shop the Drop
        </Link>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
