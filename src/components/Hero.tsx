import Image from "next/image";

// Photo-led hero — Iteration 01 "Bold & Emotional"
// (designs/02_homepage/handoff_drop01, website-bible §4.2).
// hero-crowd.webp is an AI-generated placeholder matching the approved art
// direction — replace with licensed photography before launch (same path).
export default function Hero() {
  return (
    <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden sm:min-h-[680px]">
      <Image
        src="/hero-crowd.webp"
        alt="Fan with raised fist in a red-lit stadium crowd"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Legibility gradient — dark top and bottom, open middle */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.15) 35%, rgba(10,10,10,0.15) 55%, rgba(10,10,10,0.75) 92%)",
        }}
      />

      <div className="relative px-4 py-20 text-center">
        {/* The footer lockup's arrangement, rebuilt at hero scale in the
            hero's own typeface rather than pasted in as a shrunken image.

            Proportions are measured off the real lockup
            (public/brand/goool-athletics-lockup-white.png, 720x272):
            GOOOL glyph band 136px, rule 12px, ATHLETICS 73px at full
            width. So ATHLETICS is 0.537 of the GOOOL height and spans the
            mark edge to edge.

            The mark is goool-wordmark-tight-white.png (720x177), which
            carries GOOOL and the rule with the GOOOL band at 137px.

            That file exists because the original wordmark floated its rule
            85px below a 137px GOOOL, a ratio of 0.620, where the real
            lockup sits at 26/136 = 0.191. The hero's rule was more than
            three times too far from the word. The gap is baked into the
            PNG, so it was recomposed rather than restyled: the GOOOL
            artwork and the rule artwork are copied pixel for pixel from
            the original, only the gap between them changed, and the empty
            padding above and below trimmed. The old file is untouched and
            still serves the header. Rendered at 420 wide that is an
            80px GOOOL height, so ATHLETICS wants 0.537 x 80 = 43px of cap.
            At lg, 560 wide gives 107px, so 57.5px of cap.

            Anton's cap height was MEASURED, not assumed: rendering
            "ATHLETICS" to a canvas and reading the ink gives cap = 0.8875em,
            not the ~0.714em the nominal metrics imply. Sizing off the
            nominal figure ran the word 24% oversized.

            So the size is expressed against the mark's own width rather
            than per breakpoint. Mark width W gives a GOOOL height of
            0.1903W (137/720), a target cap of 0.537 x that = 0.1022W, and
            a font size of 0.1022W / 0.8875 = 0.115W. As a container query
            unit that is 11.5cqw, which holds at every width with no
            breakpoints: 65px at 560, 48px at 420, and correct at the
            in-between sizes a phone actually uses. The px value in front
            of it is the fallback for anything without cqw support.

            Because the rule now ends at the image's bottom edge, the
            whole gap below it is margin: 0.176 x the GOOOL height = 3.35cqw.

            The mark is fluid now, not a fixed 420px. It was fixed before,
            so on a 375px phone it overflowed and GOOOL was clipped at both
            edges. That predates ATHLETICS; adding a second line only made
            it visible.

            The width is taken from the viewport, not from the parent. The
            hero's inner div is a flex item and therefore shrink-to-fit, so
            a plain w-full here resolved against whatever the widest
            sibling line happened to be (it measured 415px at a 1280
            viewport, where it should have been 560). calc(100vw - 2rem)
            matches the section's px-4 gutters and is not at the mercy of
            sibling text.

            The letters are laid out with justify-between rather than a
            tracking value. Tracking would have to be re-solved for every
            breakpoint and would still drift with the font's own metrics;
            space-between spans the width exactly, at any size, and does
            not leave a trailing gap that pushes the word off centre. */}
        <h1
          aria-label="GOOOL Athletics"
          className="mx-auto w-[calc(100vw-2rem)] max-w-[420px] [container-type:inline-size] lg:max-w-[560px]"
        >
          <Image
            src="/brand/goool-wordmark-tight-white.png"
            alt=""
            width={420}
            height={103}
            priority
            className="h-auto w-full drop-shadow-[0_6px_40px_rgba(0,0,0,0.6)]"
          />
          <span
            aria-hidden="true"
            className="mt-[3.35cqw] flex w-full justify-between font-display text-[48px] leading-none text-paper drop-shadow-[0_6px_40px_rgba(0,0,0,0.6)] [font-size:11.5cqw]"
          >
            {"ATHLETICS".split("").map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </span>
        </h1>
        <p className="mt-4 font-display text-xl uppercase tracking-[0.16em] text-paper sm:text-3xl lg:text-[34px]">
          Made for the Moment.
        </p>
        {/* "Shop the Drop" stood here and pointed at /drop, a curated page
            of four pieces, at a time when the catalog sells ten. The one
            button in the hero sent people to under half the range.

            It is not repointed at /shop, it is gone: the sticky category
            bar sits directly below the fold with a pill and a count per
            collection, which is a better answer to "where do I start" than
            a single button, and a second call to action competing with it
            would only split the choice.

            This removes the last link to /drop anywhere on the site.
            DropBanner, the only other thing that referenced it, has not
            been rendered for some time. /drop still resolves by direct
            URL. */}
      </div>
    </section>
  );
}
