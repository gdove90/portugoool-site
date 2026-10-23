import Image from "next/image";
import "@fontsource/inter/latin-300.css";
import CollectiveNotifyForm from "@/components/CollectiveNotifyForm";
import { pageMetadata } from "@/lib/page-metadata";

// Approved coming-soon page: Figma Make "Collective page design reference",
// src/App.tsx (owner, 2026-10-22). It sits under the shared site header, so
// the Make page's own top bar keeps its two lines of copy but not its links.
// Hero heights subtract the site header (72px up to 700px wide, 90px above)
// plus this page's strip (76px, 92px from md), as the Make page subtracted
// its own bar.
export const metadata = pageMetadata(
  "/the-goal-collective",
  "The Goal Collective · Coming soon",
  "The Goal Collective by GoalAthletics. Premium athleisure for women and men. Technical comfort, clean lines, and everyday versatility. Coming soon.",
);

const HERO_HEIGHT = "min-h-[calc(100vh-148px)] min-[701px]:min-h-[calc(100vh-166px)] md:min-h-[calc(100vh-182px)]";

export default function Collective() {
  return (
    <div className="bg-[#efeee7] text-[#171817]">
      <div className="relative z-20 flex h-[76px] items-center justify-between border-b border-[#cfcec5] bg-[#efeee7] px-5 md:h-[92px] md:px-12 lg:px-16">
        <p className="text-[15px] font-semibold uppercase tracking-[-0.02em] md:text-[18px]">The Goal Collective</p>
        <p className="mt-0 hidden text-[9px] font-medium uppercase tracking-[0.2em] text-[#64675e] md:block">
          Performance for every day · Coming soon
        </p>
      </div>

      <section aria-labelledby="collective-title" className={`relative overflow-hidden [container-type:inline-size] ${HERO_HEIGHT}`}>
        <div className="absolute inset-y-0 right-0 w-full lg:w-[59%]">
          <Image
            src="/assets/editorial/women-run-clean.jpg"
            alt="A woman running across a grassy hillside at golden hour"
            fill
            priority
            sizes="(min-width: 1024px) 59vw, 100vw"
            className="object-cover object-center"
          />
          {/* The Make page's Tailwind 4 gradient, written out: Tailwind 3 drops
              the dark end once the desktop stops are set. */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.05),transparent,rgb(0_0_0/0.45))] lg:bg-[linear-gradient(to_right,#efeee7_0%,transparent_28%,rgb(0_0_0/0.45)_100%)]" />
          <div className="absolute right-5 top-5 border border-white/60 bg-white/15 px-3 py-2 text-[8px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm md:right-8 md:top-8">
            Run / Live / Repeat
          </div>
        </div>

        <div className={`relative z-10 flex flex-col justify-between px-5 pb-7 pt-8 md:px-12 md:pb-9 md:pt-10 lg:w-[58%] lg:px-16 ${HERO_HEIGHT}`}>
          <p className="flex items-center gap-3 text-[9px] font-normal uppercase tracking-[0.22em] text-[#64675e]">
            <span className="block h-px w-9 bg-[#171817]" />
            02 / Everyday movement
          </p>

          <div className="my-20 max-w-[760px] bg-[#efeee7]/95 py-7 pr-5 backdrop-blur-[2px] md:my-14 md:py-10 lg:bg-transparent lg:py-0 lg:backdrop-blur-none">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-[#626b4d]">Train hard. Live fully.</p>
            {/* 6.5cqw is the Make page's 6.5vw measured on the hero, so a
                desktop scrollbar does not push the line break earlier. */}
            <h1
              id="collective-title"
              className="text-[55px] font-semibold uppercase italic leading-[0.88] tracking-[-0.065em] sm:text-[74px] md:text-[96px] lg:text-[clamp(68px,6.5cqw,104px)]"
            >
              Built to move.
              <br />
              <span className="text-[#74786d]">Made to live.</span>
            </h1>
            <p className="mt-7 max-w-[520px] text-[16px] font-light leading-[1.65] text-[#4f524b] md:text-[18px]">
              Premium athleisure for women and men. Technical comfort, clean lines, and everyday versatility. Coming soon.
            </p>
            <CollectiveNotifyForm />
          </div>

          {/* Below desktop this row sits on the photo's dark edge, so it is
              lightened there to stay readable; desktop keeps the Make colours. */}
          <div className="grid grid-cols-3 gap-4 border-t border-white/40 pt-4 text-[8px] font-normal uppercase tracking-[0.14em] text-white/80 md:text-[9px] lg:border-[#aaa99f] lg:text-[#64675e]">
            <span><b className="text-white lg:text-[#171817]">01</b><br />Training to street</span>
            <span><b className="text-white lg:text-[#171817]">02</b><br />Women + Men</span>
            <span><b className="text-white lg:text-[#171817]">03</b><br />Everyday versatility</span>
          </div>
        </div>
      </section>
    </div>
  );
}
