import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import EmailSignup from "@/components/EmailSignup";
import { getJerseysByDrop } from "@/lib/products";

export const metadata: Metadata = {
  title: "Limited Editions",
  description:
    "Drop Version I — 500 units per jersey. Once this drop sells out, it will not be reprinted.",
};

export default function DropPage() {
  const portugal = getJerseysByDrop("I");
  const england = getJerseysByDrop("II");

  return (
    <>
      <section className="bg-ink py-14 text-paper sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            Two collections live · 500 units per jersey · No reprints
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-tightest sm:text-6xl">
            Limited Editions
          </h1>
          <p className="mt-4 max-w-lg text-paper/70">
            Chapter one: Portugal. Chapter two: ENGOOOLAND. 500 of each
            jersey, counted down live. Once a drop sells out, it will not
            be reprinted.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-12 sm:px-6 sm:py-16">
        {portugal.length > 0 && (
          <>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tightest text-ink sm:text-3xl">
              The Portugal Collection <span className="text-ink/40">· Drop 01</span>
            </h2>
            <div className="mb-14 mt-6">
              <ProductGrid products={portugal} />
            </div>
          </>
        )}
        {england.length > 0 && (
          <>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tightest text-ink sm:text-3xl">
              The England Collection <span className="text-ink/40">· Drop 02</span>
            </h2>
            <div className="mt-6">
              <ProductGrid products={england} />
            </div>
          </>
        )}
      </section>

      <EmailSignup />
    </>
  );
}
