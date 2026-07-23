import type { Metadata } from "next";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import EmailSignup from "@/components/EmailSignup";
import { getProductsByCategory } from "@/lib/products";

// NOTE ON NAMING: "World Cup" is a protected FIFA trademark. The route
// keeps the requested /world-cup URL for discoverability, but all
// customer-facing copy uses "Summer '26" / "the biggest summer in
// football" to stay licensing-safe. Do not add FIFA / tournament marks.

export const metadata: Metadata = {
  title: "Summer '26 Collection",
  description:
    "The biggest summer in football is happening now. The Crest Collection — live during Summer '26.",
};

export default function Summer26Page() {
  const collection = getProductsByCategory("tshirt");

  return (
    <>
      <section className="relative overflow-hidden bg-ink py-16 text-paper sm:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 80% 10%, rgba(201,162,39,0.2), transparent), radial-gradient(ellipse 60% 50% at 10% 90%, rgba(193,18,31,0.25), transparent)",
          }}
        />
        <div className="relative mx-auto max-w-content px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            Happening now
          </p>
          <h1 className="mt-2 font-display text-5xl font-bold uppercase tracking-tightest sm:text-7xl">
            Summer <span className="text-gold">&apos;26</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-paper/80">
            The biggest summer in football is here — right now, in North
            America. Every match, every scream, every GOOOOOL. The Crest
            Collection is live while it happens.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/drop"
              className="rounded-full bg-red px-8 py-4 text-center text-base font-semibold text-paper transition-colors hover:bg-red-dark"
            >
              Shop the Crest Collection
            </Link>
            <Link
              href="#list"
              className="rounded-full border border-paper/30 px-8 py-4 text-center text-base font-semibold text-paper transition-colors hover:border-paper hover:bg-paper/10"
            >
              Get first access
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-16">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tightest text-ink sm:text-3xl">
          Live during the moment
        </h2>
        <p className="mb-6 mt-1 text-sm text-ink/60">
          The Crest Collection — on sale while the whole world watches.
        </p>
        <ProductGrid products={collection} />
      </section>

      <div id="list">
        <EmailSignup />
      </div>
    </>
  );
}
