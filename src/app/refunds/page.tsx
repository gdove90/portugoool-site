import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "All sales are final. Every GOOOL piece is made to order. Defective or damaged items are replaced free.",
};

const CONTACT_EMAIL = "hello@portugoool.com";

export default function RefundsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-4xl uppercase tracking-tightest text-ink sm:text-5xl">
        Refund Policy
      </h1>
      <p className="mt-3 text-lg font-semibold text-ink">
        All sales are final.
      </p>
      <p className="mt-2 max-w-lg text-ink/60">
        Every GOOOL piece is printed and made just for you after you
        order. Nothing sits in a warehouse — so we don&apos;t accept returns
        or exchanges.
      </p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-ink">Defects &amp; damage — on us</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            If your order arrives defective, damaged, misprinted, or it&apos;s
            the wrong item, we make it right at no cost: a free replacement,
            or a full refund if we can&apos;t replace it.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/60">
            <li>· Contact us within <strong className="text-ink">14 days of delivery</strong></li>
            <li>· Include your order number and photos of the issue</li>
            <li>· Email <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-ink underline underline-offset-2">{CONTACT_EMAIL}</a> or use the <Link href="/contact" className="font-medium text-ink underline underline-offset-2">contact page</Link></li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">What doesn&apos;t qualify</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-ink/60">
            <li>· Wrong size ordered — check the fit notes on each product page before buying</li>
            <li>· Change of mind or style preference</li>
            <li>· Custom names/numbers printed exactly as you entered them</li>
            <li>· Normal wear, or damage from care outside the instructions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Lost in transit</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            If tracking shows your order never arrived, contact us within 30
            days of the ship date and we&apos;ll replace it free.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Cancellations</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            Orders go into production fast. If you need to cancel, email us
            immediately — we can only cancel before production starts.
          </p>
        </section>
      </div>

      <p className="mt-12 text-xs text-ink/40">
        This policy is presented before purchase and applies to all orders.
        Last updated July 2026.
      </p>
    </div>
  );
}
