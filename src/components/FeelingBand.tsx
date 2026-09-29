import Image from "next/image";

// Full-bleed "Wear the Feeling." band, Homepage v2 (2026-09-29). Sits
// between the second and third collections so the catalog is broken by
// one emotional beat and a way back to the top.
//
// feeling-band.webp is the Running Celebration render from the launch
// campaign (goool advertising/Matchday Ad Options 2026-09-27/
// A-Running-celebration.png) with the baked-in headline and lockup bar
// cropped off; the headline is set here as live text instead. It is an
// AI-generated atmosphere image, the same one running in the Meta ads:
// no real person, no crests, and the only print is our own lockup.
// Replace at the same path if real photography lands.
export default function FeelingBand() {
  return (
    <section className="relative flex min-h-[420px] items-end overflow-hidden bg-ink sm:min-h-[560px] lg:min-h-[640px]">
      <Image
        src="/feeling-band.webp"
        alt="Player celebrating a goal in the GOOOL Athletics Matchday Tee"
        fill
        sizes="100vw"
        className="object-cover object-[50%_25%]"
      />
      {/* Legibility gradient: open top, dark foot for the headline */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0) 40%, rgba(10,10,10,0.7) 100%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-content px-4 pb-12 sm:px-6 sm:pb-16">
        <p className="font-display text-5xl uppercase leading-none tracking-tightest text-paper drop-shadow-[0_6px_40px_rgba(0,0,0,0.6)] sm:text-7xl lg:text-8xl">
          Wear the Feeling.
        </p>
        <a
          href="#top"
          className="mt-6 inline-flex min-h-11 items-center gap-2 border border-paper/70 px-5 font-display text-sm uppercase tracking-widest text-paper transition-colors hover:bg-paper/10"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 15l7-7 7 7" />
          </svg>
          Back to top
        </a>
      </div>
    </section>
  );
}
