import Link from "next/link";

export default function DropBanner() {
  return (
    <section className="bg-green py-16 text-paper sm:py-20">
      <div className="mx-auto flex max-w-content flex-col items-start gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            The England Drop · 500 units per jersey
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tightest sm:text-4xl">
            When it&apos;s gone, it&apos;s gone.
          </h2>
          <p className="mt-3 max-w-lg text-paper/70">
            Every jersey drop is limited to 500 units. Once this drop sells
            out, it will not be reprinted — the next version takes its place.
          </p>
        </div>
        <Link
          href="/drop"
          className="shrink-0 rounded-full bg-gold px-8 py-4 text-base font-semibold text-ink transition-colors hover:bg-gold-light"
        >
          Shop the Drop
        </Link>
      </div>
    </section>
  );
}
