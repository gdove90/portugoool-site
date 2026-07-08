import Image from "next/image";
import Link from "next/link";

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
        <h1
          className="font-marker text-6xl leading-[0.95] text-paper sm:text-8xl lg:text-[150px]"
          style={{ textShadow: "0 6px 40px rgba(0,0,0,0.6)" }}
        >
          Portugoool
        </h1>
        <p className="mt-4 font-display text-xl uppercase tracking-[0.16em] text-paper sm:text-3xl lg:text-[34px]">
          The Sound of Victory.
        </p>
        <div className="mt-9">
          <Link
            href="/drop"
            className="inline-block w-full rounded-full bg-paper px-10 py-4 text-[15px] font-semibold text-ink shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition-transform duration-150 hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100 sm:w-auto"
          >
            Shop the Drop
          </Link>
        </div>
      </div>
    </section>
  );
}
