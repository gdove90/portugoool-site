import type { Metadata } from "next";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { getProductsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Performance jerseys, performance tees, and country caps. Original designs.",
};

const SECTIONS = [
  {
    id: "jerseys",
    category: "jersey" as const,
    title: "Performance Jerseys",
    blurb: "Add your name and number.",
  },
  {
    id: "casual",
    category: "casual" as const,
    title: "Casual Shirts",
    blurb: "Built for watch parties, match days, and every GOOOOOOOL.",
  },
  {
    id: "tshirts",
    category: "tshirt" as const,
    title: "T-Shirts",
    blurb: "The official crest on garment-dyed heavyweight cotton.",
  },
  {
    id: "hats",
    category: "hat" as const,
    title: "Hats",
    blurb: "One cap, every nation. Embroidered front, crest on the side.",
  },
  {
    id: "accessories",
    category: "accessory" as const,
    title: "Accessories",
    blurb: "Scarves, stickers, flags. Finish the fit.",
  },
];

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tightest text-ink sm:text-5xl">
            Shop
          </h1>
          <p className="mt-2 text-ink/60">
            Every design original.
          </p>
        </div>
        <Link
          href="/drop"
          className="inline-block w-fit rounded-full bg-red px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-red-dark"
        >
          Shop the Drop
        </Link>
      </div>

      <div className="space-y-14">
        {SECTIONS.map((section) => {
          const products = getProductsByCategory(section.category);
          if (products.length === 0) return null;
          return (
            <section key={section.id} id={section.id}>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tightest text-ink sm:text-3xl">
                {section.title}
              </h2>
              <p className="mb-6 mt-1 text-sm text-ink/60">{section.blurb}</p>
              <ProductGrid products={products} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
