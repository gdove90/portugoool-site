import Image from "next/image";
import Link from "next/link";
import "@fontsource/inter/latin-300.css";
import "@fontsource/inter/latin-400.css";
import { pageMetadata } from "@/lib/page-metadata";

// Approved coming-soon page, wired in as built (owner brief, 2026-10-23 evening):
// Figma Make "Collective page design reference", TheGoalCollective.tsx, ported
// to the App Router with next/image. The copy is approved verbatim. The page
// brings its own header, so the site shell renders no header on this route
// (Shell.tsx); the site footer still follows. Inter weights map to Tailwind:
// inter-light 300, inter-regular 400, inter-medium 500, inter-semibold 600.
export const metadata = pageMetadata(
  "/the-goal-collective",
  "The Goal Collective · Coming soon",
  "The Goal Collective brings the GOAL outlook to elevated everyday wear. Lifestyle and athleisure shaped around comfort, silhouette, and life off duty.",
);

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none">
      <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export default function TheGoalCollective() {
  return (
    <div className="min-h-screen bg-[#efeee7] text-[#171817]">
      <header className="absolute inset-x-0 top-0 z-20 flex h-[76px] items-center justify-between border-b border-black/15 bg-transparent px-5 md:h-[92px] md:px-12 lg:px-16">
        <Link href="/the-goal-collective" aria-label="The Goal Collective home" className="flex items-center gap-3">
          <Image
            src="/assets/brand/goal-collective-halo-flow.png"
            alt=""
            width={44}
            height={44}
            loading="eager"
            className="h-9 w-9 object-contain md:h-11 md:w-11"
          />
          <span className="text-[13px] font-semibold uppercase tracking-[-0.02em] sm:text-[15px] md:text-[18px]">
            The Goal Collective
          </span>
        </Link>
        <p className="hidden text-[9px] font-medium uppercase tracking-[0.2em] text-white md:block">
          Elevated everyday wear · Coming soon
        </p>
        <Link
          href="/"
          className="flex items-center gap-2 text-[10px] font-normal uppercase tracking-[0.12em] transition-opacity hover:opacity-50"
        >
          Goal Athletics
          <ArrowUpRight />
        </Link>
      </header>

      <main className="relative min-h-screen overflow-hidden bg-[#34352f] text-white">
        <Image
          src="/assets/editorial/women-run-clean.jpg"
          alt="A woman running across a grassy hillside at golden hour"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_20%] md:object-[center_18%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 from-20% via-black/30 via-52% to-black/90" />

        <section className="relative z-10 flex min-h-screen flex-col justify-end px-5 pb-7 pt-[42vh] md:px-12 md:pb-9 lg:px-16">
          <div className="max-w-[980px]">
            <p className="flex items-center gap-3 text-[9px] font-normal uppercase tracking-[0.22em] text-white/75">
              <span className="block h-px w-9 bg-white/70" />
              02 / Lifestyle + athleisure
            </p>
            <h1 className="mt-5 text-[55px] font-semibold uppercase italic leading-[0.88] tracking-[-0.065em] sm:text-[74px] md:text-[96px] lg:text-[clamp(72px,8vw,122px)]">
              Life off duty.
              <br />
              <span className="text-[#dedfd8]">Still GOAL.</span>
            </h1>
            <p className="mt-6 max-w-[620px] text-[14px] font-light leading-[1.65] text-white/90 md:text-[16px]">
              The Goal Collective brings the GOAL outlook to elevated everyday wear. Lifestyle and athleisure shaped around comfort, silhouette, and life off duty.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/30 pt-4 text-[8px] font-normal uppercase tracking-[0.14em] text-white/70 md:text-[9px]">
            <span><b className="text-white">01</b><br />All-day comfort</span>
            <span><b className="text-white">02</b><br />Women + Men</span>
            <span><b className="text-white">03</b><br />Everyday versatility</span>
          </div>
        </section>
      </main>
    </div>
  );
}
