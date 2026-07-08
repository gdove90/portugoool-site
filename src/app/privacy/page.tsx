import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What GOOOL collects, why, and what we never do with it.",
};

const CONTACT_EMAIL = "hello@portugoool.com";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-4xl uppercase tracking-tightest text-ink sm:text-5xl">
        Privacy Policy
      </h1>
      <p className="mt-2 max-w-lg text-ink/60">
        Short version: we collect the minimum needed to make your shirt and
        get it to you. We never sell your data.
      </p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-ink/60">
        <section>
          <h2 className="text-lg font-semibold text-ink">What we collect</h2>
          <ul className="mt-2 space-y-1.5">
            <li>· <strong className="text-ink">Orders:</strong> your email, shipping address, and items ordered — collected at checkout by Stripe. We never see or store card numbers.</li>
            <li>· <strong className="text-ink">Newsletter:</strong> your email, only if you join the list.</li>
            <li>· <strong className="text-ink">On your device:</strong> your cart lives in your browser&apos;s local storage, not on our servers. No advertising cookies, no trackers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">How we use it</h2>
          <p className="mt-2">
            To produce and ship your order, send order updates, respond to
            support requests, and — if you opted in — announce new drops.
            That&apos;s it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Who touches your data</h2>
          <p className="mt-2">
            Only service providers required to run the store: Stripe
            (payments), Supabase (order and signup storage), Netlify
            (hosting), and our print partner (name and shipping address only,
            to make and deliver your order). We never sell or rent personal
            data to anyone.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Your choices</h2>
          <ul className="mt-2 space-y-1.5">
            <li>· Unsubscribe from emails anytime via the link in any email or by contacting us</li>
            <li>· Ask what we hold about you, or ask us to delete it — email us and we&apos;ll handle it within 30 days</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Contact</h2>
          <p className="mt-2">
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-ink underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>
      </div>

      <p className="mt-12 text-xs text-ink/40">Last updated July 2026.</p>
    </div>
  );
}
