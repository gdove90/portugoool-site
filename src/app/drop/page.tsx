import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import EmailSignup from "@/components/EmailSignup";
import { getLimitedDropProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Limited Drop",
  description:
    "Small-batch releases. Once a drop sells out, the next design launches. No restocks.",
};

export default function DropPage() {
  const products = getLimitedDropProducts();

  return (
    <>
      <section className="bg-ink py-14 text-paper sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            Drop 01 · Live now
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-tightest sm:text-6xl">
            Limited Drop
          </h1>
          <p className="mt-4 max-w-lg text-paper/70">
            Small batch. Numbered release. Once these sell out, the next design
            launches — and this one never comes back.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6 sm:py-16">
        <ProductGrid products={products} />
      </section>

      <EmailSignup />
    </>
  );
}
