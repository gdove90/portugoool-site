import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      {/* Subtle brand accents — pure CSS, no heavy assets */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(193,18,31,0.25), transparent), radial-gradient(ellipse 60% 50% at 20% 90%, rgba(11,61,46,0.35), transparent)",
        }}
      />

      <div className="relative mx-auto flex max-w-content flex-col items-start px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
        <p className="mb-4 inline-block rounded-full border border-gold/40 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold">
          Drop Version I · 500 Made · Live Now
        </p>

        <h1 className="font-display text-6xl font-bold uppercase leading-none tracking-tightest sm:text-8xl lg:text-9xl">
          Portug<span className="text-red">ooo</span>l
        </h1>

        <p className="mt-5 font-display text-2xl font-bold uppercase tracking-tightest text-gold sm:text-3xl">
          The Sound of Victory.
        </p>
        <p className="mt-2 max-w-md text-lg text-paper/80 sm:text-xl">
          Made for the moment it goes in.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/drop"
            className="rounded-full bg-red px-8 py-4 text-center text-base font-semibold text-paper transition-colors hover:bg-red-dark"
          >
            Shop the Drop
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-paper/30 px-8 py-4 text-center text-base font-semibold text-paper transition-colors hover:border-paper hover:bg-paper/10"
          >
            View the Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
