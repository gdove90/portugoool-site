import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern purchases and use of portugoool.com.",
};

const CONTACT_EMAIL = "hello@portugoool.com";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-4xl uppercase tracking-tightest text-ink sm:text-5xl">
        Terms of Service
      </h1>
      <p className="mt-2 max-w-lg text-ink/60">
        By using portugoool.com or placing an order, you agree to these terms.
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-ink/60">
        <section>
          <h2 className="text-lg font-semibold text-ink">Who we are</h2>
          <p className="mt-2">
            GOOOL is an independent fan apparel brand. We are not
            affiliated with, endorsed by, or connected to any football
            federation, club, league, tournament, or governing body. All
            designs and marks are original.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Products &amp; orders</h2>
          <p className="mt-2">
            Every item is made to order and printed on demand. Placing an
            order is an offer
            to purchase; we may refuse or cancel orders (including for
            suspected fraud or pricing errors) with a full refund of anything
            charged.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Pricing &amp; payment</h2>
          <p className="mt-2">
            Prices are in USD. Payment is processed securely by Stripe — we
            never see or store your card details. Applicable sales tax and
            shipping are shown at checkout.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Customization</h2>
          <p className="mt-2">
            Custom names and numbers are printed exactly as entered — check
            your spelling before paying. We may reject customization text
            that is offensive, infringes third-party rights (including player
            names used in a way that implies endorsement), or is unlawful;
            rejected orders are refunded. Customized items are made
            specifically for you.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Shipping</h2>
          <p className="mt-2">
            Production takes 5–7 business days, then shipping typically 3–7
            business days in the US. Dates are estimates, not guarantees; if
            we can&apos;t ship within 30 days we&apos;ll notify you and offer
            a refund. See <Link href="/track-order" className="font-medium text-ink underline underline-offset-2">Track Order</Link> for how delivery works.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Returns</h2>
          <p className="mt-2">
            All sales are final. Defective, damaged, or incorrect items are
            replaced free under our{" "}
            <Link href="/refunds" className="font-medium text-ink underline underline-offset-2">
              Refund Policy
            </Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Intellectual property</h2>
          <p className="mt-2">
            The GOOOL and PORTUGOOOL names, wordmarks, designs, and site content are our
            property. Don&apos;t reproduce them commercially without written
            permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Liability</h2>
          <p className="mt-2">
            To the maximum extent permitted by law, our total liability for
            any claim related to an order is limited to the amount you paid
            for that order. Nothing in these terms limits rights you have
            under applicable consumer law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Governing law &amp; changes</h2>
          <p className="mt-2">
            These terms are governed by the laws of the State of Rhode
            Island, USA. We may update these terms; the version posted at the
            time of your order applies. Questions:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-ink underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>.
          </p>
        </section>
      </div>

      <p className="mt-12 text-xs text-ink/40">Last updated July 2026.</p>
    </div>
  );
}
