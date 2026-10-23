import Image from "next/image";
import "@fontsource/inter/latin-300.css";
import { pageMetadata } from "@/lib/page-metadata";

// Approved coming-soon page: Figma Make "Collective page design reference",
// src/App.tsx (owner, 2026-10-22, updated 2026-10-23). It sits under the
// shared site header, so the Make page's own top bar keeps its mark, name and
// line of copy but not its links. Its email form was removed on the owner's
// word: the footer signup covers it.
// Below desktop the bar sits above the photo. On desktop the photo fills the
// screen from the very top, and the site header (made transparent in
// globals.css through the collective-hero class) and the bar float over it.
// At every size the white copy sits over a band that darkens toward the bottom.
export const metadata = pageMetadata(
  "/the-goal-collective",
  "The Goal Collective · Coming soon",
  "The Goal Collective is our lifestyle division. Everyday pieces, shaped by people pursuing their goals, becoming the best version of themselves, living fully, and growing together.",
);

// Below desktop the photo fills the screen under the site header and the bar:
// 72 + 76px up to 700px wide, 90 + 76px to 767px, 90 + 92px to 1023px.
const HERO_HEIGHT =
  "min-h-[calc(100svh-148px)] min-[701px]:min-h-[calc(100svh-166px)] md:min-h-[calc(100svh-182px)] lg:min-h-screen";

export default function Collective() {
  return (
    <div className="collective-hero relative bg-[#efeee7] text-[#171817]">
      <div className="relative z-20 flex h-[76px] items-center justify-between border-b border-[#cfcec5] bg-[#efeee7] px-5 md:h-[92px] md:px-12 lg:absolute lg:inset-x-0 lg:top-[90px] lg:border-black/15 lg:bg-transparent lg:px-16">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/brand/goal-collective-halo-flow.png"
            alt=""
            width={44}
            height={44}
            loading="eager"
            className="h-9 w-9 object-contain md:h-11 md:w-11"
          />
          <span className="text-[13px] font-semibold uppercase tracking-[-0.02em] sm:text-[15px] md:text-[18px]">The Goal Collective</span>
        </div>
        <p className="hidden text-[9px] font-medium uppercase tracking-[0.2em] text-[#64675e] md:block lg:text-white lg:[text-shadow:0_0_2px_rgb(0_0_0/0.55),0_1px_10px_rgb(0_0_0/0.45)]">
          Performance for every day · Coming soon
        </p>
      </div>

      <section aria-labelledby="collective-title" className={`relative overflow-hidden [container-type:inline-size] ${HERO_HEIGHT}`}>
        <div className="absolute inset-0">
          <Image
            src="/assets/editorial/women-run-clean.jpg"
            alt="A woman running across a grassy hillside at golden hour"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>

        <div className={`relative z-10 flex flex-col justify-end pt-8 md:pt-10 lg:pt-[30vh] ${HERO_HEIGHT}`}>
          {/* The copy sits in a band that fades in over the photo just above
              it and darkens toward the bottom, so the white type reads at any
              screen size while the top of the photo stays open. */}
          <div className="bg-[linear-gradient(to_bottom,rgb(0_0_0/0)_0%,rgb(0_0_0/0.6)_96px,rgb(0_0_0/0.78)_100%)] px-5 pb-7 pt-24 [text-shadow:0_1px_12px_rgb(0_0_0/0.3)] md:px-12 md:pb-9 lg:bg-[linear-gradient(to_bottom,rgb(0_0_0/0)_0%,rgb(0_0_0/0.62)_120px,rgb(0_0_0/0.88)_100%)] lg:px-16 lg:pt-[120px] lg:[text-shadow:none]">
            <p className="flex items-center gap-3 text-[10px] font-normal uppercase tracking-[0.22em] text-white/85 lg:text-[9px] lg:text-white/90">
              <span className="block h-px w-9 bg-white/85 lg:bg-white/70" />
              02 / Everyday movement
            </p>

            <div className="mb-9 mt-5 max-w-[760px] lg:mb-0 lg:max-w-[980px]">
              {/* On desktop 8cqw is the Make page's 8vw measured on the hero,
                  so a scrollbar does not push the line break earlier. */}
              <h1
                id="collective-title"
                className="text-[55px] font-semibold uppercase italic leading-[0.88] tracking-[-0.065em] text-white sm:text-[74px] md:text-[96px] lg:text-[clamp(72px,8cqw,122px)]"
              >
                Built to move.
                <br />
                <span className="text-[#dedfd8]">Made to live.</span>
              </h1>
              <div className="mt-7 max-w-[550px] lg:mt-6 lg:max-w-[620px]">
                <p className="text-[14px] font-normal leading-[1.65] text-white/90 md:text-[16px] lg:font-light">
                  The Goal Collective is our lifestyle division. Everyday pieces, shaped by people pursuing their goals, becoming the best version of themselves, living fully, and growing together.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-white/40 pt-4 text-[10px] font-normal uppercase tracking-[0.14em] text-white/85 lg:mt-8 lg:border-white/30 lg:text-[9px] lg:text-white/70">
              <span><b className="text-white">01</b><br />Training to street</span>
              <span><b className="text-white">02</b><br />Women + Men</span>
              <span><b className="text-white">03</b><br />Everyday versatility</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
