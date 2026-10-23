import Image from "next/image";
import "@fontsource/inter/latin-300.css";
import { pageMetadata } from "@/lib/page-metadata";

// Approved coming-soon page: Figma Make "Collective page design reference",
// src/App.tsx (owner, 2026-10-22, updated 2026-10-23). On this page the site
// header carries The Goal Collective's mark and links (Shell.tsx), so the Make
// page's own top bar is gone and its line of copy opens the hero. Its email
// form was removed on the owner's word: the footer signup covers it.
// Below desktop the photo fills the hero and the white copy sits over a band
// that darkens toward the bottom. On desktop the whole photo stands, uncropped,
// to the right of a dark panel holding the copy (owner, 2026-10-23: show all
// of her, not just her head).
export const metadata = pageMetadata(
  "/the-goal-collective",
  "The Goal Collective · Coming soon",
  "The Goal Collective is our lifestyle division. Everyday pieces, shaped by people pursuing their goals, becoming the best version of themselves, living fully, and growing together.",
);

// The hero fills the screen under the site header: 72px tall up to 700px wide, 90px above.
const HERO_HEIGHT = "min-h-[calc(100svh-72px)] min-[701px]:min-h-[calc(100svh-90px)]";

export default function Collective() {
  return (
    <section aria-labelledby="collective-title" className={`relative flex overflow-hidden bg-[#171817] text-white ${HERO_HEIGHT}`}>
      {/* On desktop the photo's box keeps its 2:3 shape at the hero's height
          (at most half the width), so the whole photo shows. */}
      <div className="absolute inset-0 lg:relative lg:inset-auto lg:order-last lg:w-[min(50%,calc((100svh_-_90px)*2/3))] lg:shrink-0">
        <Image
          src="/assets/editorial/women-run-clean.jpg"
          alt="A woman running across a grassy hillside at golden hour"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-top lg:object-center"
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-end pt-8 [container-type:inline-size] md:pt-10 lg:pt-0">
        {/* Below desktop the copy sits in a band that fades in over the photo
            and darkens toward the bottom, so the white type reads at any
            screen size while the top of the photo stays open. */}
        <div className="bg-[linear-gradient(to_bottom,rgb(0_0_0/0)_0%,rgb(0_0_0/0.6)_96px,rgb(0_0_0/0.78)_100%)] px-5 pb-7 pt-24 [text-shadow:0_1px_12px_rgb(0_0_0/0.3)] md:px-12 md:pb-9 lg:flex lg:flex-1 lg:flex-col lg:justify-between lg:bg-none lg:px-16 lg:py-12 lg:[text-shadow:none]">
          <p className="mb-5 text-[9px] font-medium uppercase tracking-[0.2em] text-white/80 lg:mb-0 lg:text-white/60">
            Performance for every day · Coming soon
          </p>

          <div>
            <p className="flex items-center gap-3 text-[10px] font-normal uppercase tracking-[0.22em] text-white/85 lg:text-[9px] lg:text-white/90">
              <span className="block h-px w-9 bg-white/85 lg:bg-white/70" />
              02 / Everyday movement
            </p>

            <div className="mb-9 mt-5 max-w-[760px] lg:mb-0 lg:max-w-[980px]">
              {/* On desktop the headline scales with the copy panel, so
                  "Built to move." always fits beside the photo. */}
              <h1
                id="collective-title"
                className="text-[55px] font-semibold uppercase italic leading-[0.88] tracking-[-0.065em] text-white sm:text-[74px] md:text-[96px] lg:text-[length:clamp(52px,calc((100cqw_-_128px)/7.4),122px)]"
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
      </div>
    </section>
  );
}
