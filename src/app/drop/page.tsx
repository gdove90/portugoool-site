import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import EmailSignup from "@/components/EmailSignup";
import { getLimitedDropProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Limited Editions",
  description:
    "Drop Version I — 500 units per jersey. Once this drop sells out, it will not be reprinted.",
};

export default function DropPage() {
  const products = getLimitedDropProducts();

  return (
    <>
      <section className="bg-ink py-14 text-paper sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            The Portugal Collection · Drop 01 · 500 units per jersey · Live now
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-tightest sm:text-6xl">
            Limited Editions
          </h1>
          <p className="mt-4 max-w-lg text-paper/70">
            Chapter one of GOOOL: four Portugal-inspired jerseys, 500 of each,
            counted down live. Once this drop sells out, it will not be
            reprinted — the next chapter takes its place.
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
