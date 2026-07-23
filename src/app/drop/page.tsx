import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import EmailSignup from "@/components/EmailSignup";
import { getProductsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "The Crest Collection",
  description:
    "The Crest Collection — the official GOOOL crest on garment-dyed heavyweight cotton.",
};

export default function DropPage() {
  const collection = [
    ...getProductsByCategory("tshirt"),
    ...getProductsByCategory("hat"),
  ];

  return (
    <>
      <section className="bg-ink py-14 text-paper sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            The Crest Collection · GOOOL · Live now
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-tightest sm:text-6xl">
            The Crest Collection
          </h1>
          <p className="mt-4 max-w-lg text-paper/70">
            The official GOOOL crest on garment-dyed heavyweight cotton.
            Every design original.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tightest text-ink sm:text-3xl">
          The Crest Collection
        </h2>
        <div className="mt-6">
          <ProductGrid products={collection} />
        </div>
      </section>

      <EmailSignup />
    </>
  );
}
