import type { Metadata } from "next";
import Link from "next/link";

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

const SECTIONS = [
  { num: "01", title: "The whole idea", paras: [
    "Every stadium on earth screams the same word, in every language, whether it is a final or a Sunday league pitch. That is the whole idea. GOOOL Athletics is an original soccer sportswear brand built around the passion, the belonging, and the moments you carry long after the final whistle.",
    "Everything here is drawn from scratch. Our own crests, our own wordmarks, our own colors. No club badge, no federation, nothing borrowed from anyone who earned it on the pitch. If you have seen it somewhere else, it is not ours.",
  ]},
  { num: "02", title: "What gets made, and what doesn't", paras: [
    "A design is easy. A design that survives being printed is not. Every mark we put on a garment gets measured at the size it will actually appear, not the size it looks good at on a screen: stroke widths, letter spacing, the gaps that decide whether a word reads cleanly or blurs.",
    "That is the standard. Fewer pieces, each one checked, and no piece chosen just because it was easy to put a print on.",
  ]},
  { num: "03", title: "Where we ship", paras: [
    "We ship to the United States, Canada, the United Kingdom and Portugal. Orders arrive within 7 to 12 business days in the US and typically 2 to 3 weeks everywhere else, because every order ships from the United States.",
  ]},
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="border-t border-paper/10 bg-ink px-5 pb-[52px] pt-14 text-paper sm:px-6 md:pb-24 md:pt-28 lg:px-12">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-paper/60">About the brand</p>
        <h1 className="mt-[18px] max-w-[1000px] font-display text-[58px] uppercase leading-[0.9] tracking-[-0.01em] md:mt-7 md:text-[150px]">
          Born from the <span className="text-red">sound</span>.
        </h1>
        <p className="mt-[18px] max-w-[720px] text-xl leading-snug text-paper/85 md:mt-7 md:text-[28px]">
          The ball hits the net. The crowd erupts. For a moment, nothing else matters.
        </p>
      </section>

      {SECTIONS.map(({ num, title, paras }) => (
        <section
          key={num}
          className="flex flex-col gap-[18px] border-t border-ink/10 px-5 py-11 sm:px-6 md:flex-row md:gap-16 md:py-20 lg:px-12"
        >
          <div className="flex flex-col gap-3 md:w-[380px] md:shrink-0">
            <p className="font-display text-[15px] tracking-[0.16em] text-red">{num}</p>
            <h2 className="font-display text-[34px] uppercase leading-none md:text-5xl">{title}</h2>
          </div>
          <div className="flex min-w-0 max-w-[680px] flex-1 flex-col gap-5 text-[17px] leading-[1.65] text-ink/75 md:text-[19px]">
            {paras.map((para) => (
              <p key={para.slice(0, 24)} className="text-pretty">{para}</p>
            ))}
          </div>
        </section>
      ))}

      <section className="flex flex-col gap-6 bg-smoke px-5 py-[52px] sm:px-6 md:gap-9 md:py-[88px] lg:px-12">
        <p className="max-w-[1100px] font-display text-[36px] uppercase leading-[0.95] md:text-[72px]">
          Apparel made for the moment the ball hits the net. Wear the feeling long after the final whistle.
        </p>
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-10">
          <Link
            href="/shop"
            className="inline-flex min-h-[52px] items-center justify-center whitespace-nowrap bg-red px-[30px] font-display text-[17px] uppercase tracking-[0.1em] text-paper transition-colors hover:bg-red-dark"
          >
            Explore the Collection
          </Link>
          <p className="max-w-[520px] text-sm leading-relaxed text-ink/60">
            GOOOL Athletics LLC is an independent brand. We are not affiliated with any
            federation, club, league, or governing body. All designs and marks are original.
          </p>
        </div>
      </section>
    </>
  );
}
