import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import EmailSignup from "@/components/EmailSignup";
import { getProductBySlug } from "@/lib/products";
import { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "The First Capsule",
  description:
    "The GOOOL First Capsule — performance tee, heavyweight hoodie, casual tee, and touchline cap. Coming soon.",
};

const CAPSULE_ORDER = [
  "goool-performance-tee",
  "goool-heavyweight-hoodie",
  "goool-heavyweight-casual-tee",
  "goool-touchline-cap",
];

export default function DropPage() {
  const capsule = CAPSULE_ORDER.map((slug) => getProductBySlug(slug)).filter(
    (p): p is Product => p != null && p.isActive
  );

  return (
    <>
      <section className="bg-ink py-14 text-paper sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            The First Capsule · GOOOL · Coming Soon
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-tightest sm:text-6xl">
            The First Capsule
          </h1>
          <p className="mt-4 max-w-lg text-paper/70">
            Four pieces, one mark. Performance tee, heavyweight hoodie,
            casual tee, and the touchline cap. Every design original.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6 sm:py-16">
        <ProductGrid products={capsule} />
      </section>

      <section className="border-t border-ink/10 bg-smoke">
        <div className="mx-auto max-w-content px-4 py-12 sm:px-6">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tightest text-ink">
            Be first when it drops
          </h2>
          <p className="mb-5 mt-1 text-sm text-ink/60">
            Join the list and hear the moment the capsule goes live.
          </p>
          <EmailSignup />
        </div>
      </section>
    </>
  );
}
