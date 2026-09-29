import type { Metadata } from "next";
import SizeGuideTabs from "@/components/SizeGuideTabs";

// ─────────────────────────────────────────────────────────────
// /size-guide (design 3b, 2026-09-29). The hero band is the same
// markup as /track-order. Every measurement on this page is read from
// src/lib/size-charts.ts through SizeGuideTabs; nothing numeric is
// written here, so a chart correction in one file is a correction on
// the product page and on this page at once.
// ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Garment measurements for every GOOOL piece, S–XXL.",
  alternates: { canonical: "/size-guide" },
};

const HOW_TO_MEASURE: ReadonlyArray<readonly [string, string, string]> = [
  ["01", "Lay a tee flat", "Pick one you already like the fit of and smooth it out on a table."],
  ["02", "Measure pit to pit", "Straight across the chest, 1 in below the armholes. That is the flat figure."],
  ["03", "Match the chart", "Find the closest flat chest below. Measuring yourself instead? Use the “around” column."],
];

export default function SizeGuidePage() {
  return (
    <>
      <section className="border-t border-paper/10 bg-ink px-5 pb-10 pt-11 text-paper sm:px-6 md:pb-[60px] md:pt-[72px] lg:px-12">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-paper/60">Help</p>
        <h1 className="mt-4 font-display text-[56px] uppercase leading-[0.92] md:text-[104px]">
          Size Guide
        </h1>
        <div aria-hidden className="mt-4 h-1.5 w-24 origin-left -skew-x-[30deg] bg-red" />
        <p className="mt-4 max-w-[560px] text-lg leading-relaxed text-paper/80">
          Sizes S–XXL. Between sizes? Measure a tee you already like across the
          chest, and match the flat figure.
        </p>
      </section>

      <div className="flex flex-col gap-7 px-5 pb-12 pt-8 sm:px-6 md:gap-9 md:pb-[88px] md:pt-14 lg:px-12">
        <ol className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {HOW_TO_MEASURE.map(([n, title, body]) => (
            <li key={n} className="flex flex-col gap-1.5 bg-smoke px-5 py-[18px]">
              <span className="font-display text-[28px] leading-none text-red">{n}</span>
              <p className="text-[17px] font-bold">{title}</p>
              <p className="text-[15px] leading-relaxed text-ink/70">{body}</p>
            </li>
          ))}
        </ol>

        <SizeGuideTabs />

        <p className="text-sm text-ink/60">
          Measured flat in inches, so allow a little variation between garments.
        </p>
      </div>
    </>
  );
}
