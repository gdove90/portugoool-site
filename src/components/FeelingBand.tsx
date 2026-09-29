// "Wear the Feeling." big-type block, Homepage design 4a (2026-09-29).
// Sits between the second and third collections so the catalog is broken
// by one brand beat and a way back to the top.
//
// It replaced the full-bleed photo band from v2: the AI celebration render
// cropped unpredictably across viewport widths (the player's face was cut
// at 1920), and the owner chose type over a picture. No image, no
// gradient: ink background, the line set big in Anton on one line (42px
// on phones, 128px from md; thinned 2026-09-29 from the 84/220px two-line
// version), the question under it with the skewed red rule, and the same
// Back to top link. Centred, with the three-segment white-red-white
// brand rule under the line (owner, 2026-09-29; the "What's your GOOOL?"
// line was removed the same day).
// The words are fixed: WEAR THE FEELING. / Back to top.
export default function FeelingBand() {
  return (
    <section
      aria-label="Wear the Feeling"
      className="overflow-hidden bg-ink px-5 pb-8 pt-9 text-paper sm:px-6 md:pb-12 md:pt-14 lg:px-12"
    >
      <h2 className="whitespace-nowrap text-center font-display text-[42px] uppercase leading-[0.95] tracking-[-0.01em] md:text-[128px]">
        Wear the Feeling.
      </h2>
      {/* The brand rule from the lockup: three slanted segments, white,
          red, white, centred under the line. */}
      <div aria-hidden className="mt-4 flex justify-center gap-2 md:mt-6 md:gap-3">
        <span className="block h-1.5 w-12 -skew-x-[30deg] bg-paper md:h-2 md:w-20" />
        <span className="block h-1.5 w-12 -skew-x-[30deg] bg-red md:h-2 md:w-20" />
        <span className="block h-1.5 w-12 -skew-x-[30deg] bg-paper md:h-2 md:w-20" />
      </div>
      <div className="mt-6 flex justify-center md:mt-8">
        <a
          href="#top"
          className="inline-flex h-11 items-center gap-2 whitespace-nowrap border border-paper/40 px-4 font-display text-sm uppercase tracking-[0.1em] text-paper transition-colors hover:border-paper hover:bg-paper/10"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 9l5-5 5 5" />
          </svg>
          Back to top
        </a>
      </div>
    </section>
  );
}
