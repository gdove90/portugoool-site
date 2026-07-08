import Link from "next/link";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProductGrid from "@/components/ProductGrid";
import FabricFeatureGrid from "@/components/FabricFeatureGrid";
import DropBanner from "@/components/DropBanner";
import EmailSignup from "@/components/EmailSignup";
import FAQAccordion from "@/components/FAQAccordion";
import { FAQ_ITEMS } from "@/lib/faq";
import { getProductsByCategory, getJerseysByDrop } from "@/lib/products";

export default function HomePage() {
  const portugalJerseys = getJerseysByDrop("I");
  const englandJerseys = getJerseysByDrop("II");
  const casual = getProductsByCategory("casual").slice(0, 4);

  return (
    <>
      <Hero />
      <TrustBar />

      {/* Drop Version I — jerseys */}
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
              The Portugal Collection
            </h2>
            <p className="mt-2 text-ink/60">
              Chapter one · Drop 01 · Four jerseys, 500 of each.
            </p>
          </div>
          <Link
            href="/drop"
            className="hidden text-sm font-semibold text-ink underline-offset-4 hover:underline sm:block"
          >
            View the drop →
          </Link>
        </div>
        <ProductGrid products={portugalJerseys} />
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/drop"
            className="inline-block rounded-full border border-ink px-8 py-3 text-sm font-semibold text-ink"
          >
            View the drop
          </Link>
        </div>
      </section>

      {/* Drop 02 — England */}
      <section className="bg-smoke py-16 sm:py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
                ENG<span className="text-red">OOO</span>LAND
              </h2>
              <p className="mt-2 text-ink/60">
                The England Collection · Drop 02 · Just landed.
              </p>
            </div>
            <Link
              href="/drop"
              className="hidden text-sm font-semibold text-ink underline-offset-4 hover:underline sm:block"
            >
              View the drop →
            </Link>
          </div>
          <ProductGrid products={englandJerseys} />
        </div>
      </section>

      <FabricFeatureGrid />

      {/* Casual preview */}
      <section className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
              Wear the celebration
            </h2>
            <p className="mt-2 text-ink/60">
              Built for watch parties, match days, and every GOOOOOOOL.
            </p>
          </div>
          <Link
            href="/shop#casual"
            className="hidden text-sm font-semibold text-ink underline-offset-4 hover:underline sm:block"
          >
            View all →
          </Link>
        </div>
        <ProductGrid products={casual} />
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/shop#casual"
            className="inline-block rounded-full border border-ink px-8 py-3 text-sm font-semibold text-ink"
          >
            View all shirts
          </Link>
        </div>
      </section>

      {/* Customization section */}
      <section className="bg-smoke py-16 sm:py-20">
        <div className="mx-auto grid max-w-content items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red">
              Optional add-on · $15
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
              Your name. Your number.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink/60">
              Every jersey ships clean — no names, no numbers. Want yours on
              the back? Add a name and number on the product page for a flat $15.
            </p>
            <Link
              href="/customize"
              className="mt-6 inline-block rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-ink/80"
            >
              Customize your jersey
            </Link>
          </div>

          {/* Simple visual: back-of-jersey mock */}
          <div className="mx-auto w-full max-w-sm rounded-xl bg-paper p-10 text-center">
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
