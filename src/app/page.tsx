import Link from "next/link";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import FabricFeatureGrid from "@/components/FabricFeatureGrid";
import DropBanner from "@/components/DropBanner";
import EmailSignup from "@/components/EmailSignup";
import FAQAccordion from "@/components/FAQAccordion";
import { FAQ_ITEMS } from "@/lib/faq";
import { getProducts } from "@/lib/products";

export default function HomePage() {
  const products = getProducts().slice(0, 8);

  return (
    <>
      <Hero />

      {/* Product preview grid */}
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
              The collection
            </h2>
            <p className="mt-2 text-ink/60">Six shirts. One sound.</p>
          </div>
          <Link
            href="/shop"
            className="hidden text-sm font-semibold text-ink underline-offset-4 hover:underline sm:block"
          >
            View all →
          </Link>
        </div>
        <ProductGrid products={products} />
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-block rounded-full border border-ink px-8 py-3 text-sm font-semibold text-ink"
          >
            View all shirts
          </Link>
        </div>
      </section>

      <FabricFeatureGrid />

      {/* Customization section */}
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red">
              Make it yours
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
              Your name. Your number.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink/60">
              Every shirt comes clean — no numbers, no names. Want yours on the
              back? Add a name and number at checkout as an optional add-on.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-block rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-ink/80"
            >
              Customize a shirt
            </Link>
          </div>

          {/* Simple visual: back-of-shirt mock */}
          <div className="mx-auto w-full max-w-sm rounded-xl bg-smoke p-10 text-center">
            <div className="rounded-lg bg-green px-6 py-12 text-paper">
              <p className="font-display text-2xl font-bold uppercase tracking-widest">
                SILVA
              </p>
              <p className="mt-2 font-display text-8xl font-bold leading-none text-gold">
                10
              </p>
            </div>
            <p className="mt-4 text-xs text-ink/50">
              Name + number add-on · printed on the back
            </p>
          </div>
        </div>
      </section>

      <DropBanner />

      {/* FAQ preview */}
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
          Questions
        </h2>
        <div className="mt-8">
          <FAQAccordion items={FAQ_ITEMS.slice(0, 4)} />
        </div>
        <Link
          href="/faq"
          className="mt-6 inline-block text-sm font-semibold text-ink underline-offset-4 hover:underline"
        >
          All questions →
        </Link>
      </section>

      <EmailSignup />
    </>
  );
}
