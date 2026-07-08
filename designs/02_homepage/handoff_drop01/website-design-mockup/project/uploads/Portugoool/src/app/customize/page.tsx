import type { Metadata } from "next";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { getProductsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Customize Your Jersey",
  description:
    "Add your name and number to any PORTUGOOOL jersey. Flat $15 add-on, printed on the back.",
};

export default function CustomizePage() {
  const jerseys = getProductsByCategory("jersey");

  return (
    <>
      <section className="bg-ink py-14 text-paper sm:py-20">
        <div className="mx-auto grid max-w-content items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">
              Optional add-on · Flat $15
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-tightest sm:text-6xl">
              Your name.<br />Your number.
            </h1>
            <p className="mt-4 max-w-md text-paper/70">
              Every jersey ships clean — no names, no numbers. Want yours on
              the back? Add any name up to 12 characters and any number 0–99
              on the product page. Printed to order, just for you.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-paper/70">
              <li>✓ Any name, up to 12 characters</li>
              <li>✓ Any number, 0–99</li>
              <li>✓ Flat $15 — added at checkout, fully optional</li>
              <li>✓ Customized jerseys are made for you and final sale</li>
            </ul>
          </div>

          {/* Back-of-jersey mock */}
          <div className="mx-auto w-full max-w-sm">
            <div className="rounded-xl bg-green px-6 py-14 text-center text-paper">
              <p className="font-display text-3xl font-bold uppercase tracking-widest">
                SILVA
              </p>
              <p className="mt-2 font-display text-9xl font-bold leading-none text-gold">
                10
              </p>
            </div>
            <p className="mt-3 text-center text-xs text-paper/50">
              Printed on the back · every jersey in the drop
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-4 py-14 sm:px-6 sm:py-16">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tightest text-ink sm:text-3xl">
          Pick your jersey
        </h2>
        <p className="mb-6 mt-1 text-sm text-ink/60">
          All four are part of Drop Version I — 500 units each.
        </p>
        <ProductGrid products={jerseys} />

        <div className="mt-10 text-center">
          <Link
            href="/drop"
            className="inline-block rounded-full bg-red px-8 py-4 text-base font-semibold text-paper transition-colors hover:bg-red-dark"
          >
            Shop the Drop
          </Link>
        </div>
      </section>
    </>
  );
}
