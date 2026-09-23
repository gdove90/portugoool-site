import type { Metadata } from "next";
import Link from "next/link";
import EmailSignup from "@/components/EmailSignup";

// ─────────────────────────────────────────────────────────────
// About. Rewritten 2026-09-23.
//
// What the previous version claimed, and why it had to go: it described
// a "First Capsule" of "a performance tee, a heavyweight everyday tee, a
// core hoodie, and a signature cap". The live range is ten pieces -
// five cotton tees, hoodie and crewneck, two performance tees and three
// caps - so the inventory sentence had drifted false. Nothing on this
// page now counts or names stock; the shop is the one place that does,
// and it reads the catalog.
//
// The quality section states the principle only: marks are measured at
// the size they will actually print. An earlier draft backed it with the
// real incident behind it, the Minimal Club Tee retired on 2026-09-22
// over a 1.19mm letter stroke, and the owner cut that on 2026-09-23. The
// incident is not a secret and the record of it stays in the repo, in
// src/middleware.ts where its URL is still redirected, but the storefront
// does not tell customers about a product that failed. Do not put the
// figure, the product name, or the story back on this page.
//
// CLAUDE.md:148 - no made-to-order or on-demand production language in
// customer-facing copy (owner decision, 2026-07-23). The quality section
// talks about what gets checked, never about how or where it is made.
// ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "About the Brand",
  description:
    "Independent soccer sportswear built around the one word every stadium screams. Original crests and wordmarks, never licensed, and every print measured at the size it actually prints.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <h1 className="font-display text-4xl uppercase tracking-tightest text-ink sm:text-6xl">
          Born from<br />the <span className="text-red">sound</span>.
        </h1>

        <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink/70">
          <p>
            The ball hits the net. The crowd erupts. For a moment, nothing
            else matters.
          </p>
          <p>
            Every stadium on earth screams the same word, in every language,
            whether it is a final or a Sunday league pitch with two jackets
            for a goal. That is the whole idea. GOOOL is an original soccer
            sportswear brand built around the passion, the belonging, and
            the moments you carry long after the final whistle.
          </p>
          <p>
            Everything here is drawn from scratch. Our own crests, our own
            wordmarks, our own colors. No club badge, no federation, nothing
            borrowed from anyone who earned it on the pitch. If you have
            seen it somewhere else, it is not ours.
          </p>
        </div>

        <h2 className="mt-14 font-display text-2xl uppercase tracking-tightest text-ink sm:text-3xl">
          What gets made,<br />and what doesn&apos;t
        </h2>

        <div className="mt-6 space-y-6 text-lg leading-relaxed text-ink/70">
          <p>
            A design is easy. A design that survives being printed is not.
            Every mark we put on a garment gets measured at the size it will
            actually appear, not the size it looks good at on a screen:
            stroke widths, letter spacing, the gaps that decide whether a
            word reads cleanly or blurs.
          </p>
          <p>
            That is the standard. Fewer pieces, each one checked, and no
            piece chosen just because it was easy to put a print on.
          </p>
        </div>

        <div className="mt-14 space-y-6 text-lg leading-relaxed text-ink/70">
          <p>
            We ship to the United States, Canada, the United Kingdom and
            Portugal. Orders arrive within 7 to 12 business days in the US and
            typically 3 to 5 weeks everywhere else, because every one is made
            and shipped from the United States.
          </p>
          <p className="font-semibold text-ink">
            The Sound of Victory. Made for the Moment.
          </p>
          <p className="text-base text-ink/50">
            GOOOL is an independent brand. We are not affiliated with any
            federation, club, league, or governing body. All designs and
            marks are original.
          </p>
        </div>

        <Link
          href="/shop"
          className="mt-10 inline-block rounded-full bg-red px-8 py-4 text-base font-semibold text-paper transition-colors hover:bg-red-dark"
        >
          Explore the Collection
        </Link>
      </section>

      <EmailSignup />
    </>
  );
}
