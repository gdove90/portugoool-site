import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import EmailSignup from "@/components/EmailSignup";
import { getProductsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "The England Drop",
  description:
    "The England Drop — ENGOOOLAND. Premium performance jerseys, made to order.",
};

export default function DropPage() {
  const england = getProductsByCategory("jersey");

  return (
    <>
      <section className="bg-ink py-14 text-paper sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            The England Drop · ENGOOOLAND · Live now
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-tightest sm:text-6xl">
            The England Drop
          </h1>
          <p className="mt-4 max-w-lg text-paper/70">
            ENGOOOLAND — The England Collection. Every jersey made to
            order and printed for you. Add your name and number, or wear
            it clean.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tightest text-ink sm:text-3xl">
          The England Collection
        </h2>
        <div className="mt-6">
          <ProductGrid products={england} />
        </div>
      </section>

      <EmailSignup />
    </>
  );
}
