import Link from "next/link";

export default function DropBanner() {
  return (
    <section className="bg-green py-16 text-paper sm:py-20">
      <div className="mx-auto flex max-w-content flex-col items-start gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            Small batch · Numbered releases
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tightest sm:text-4xl">
            When it&apos;s gone, it&apos;s gone.
          </h2>
          <p className="mt-3 max-w-lg text-paper/70">
            Every PORTUGOOOL design releases as a small-batch drop. Once a drop
            sells out, the next design launches. No restocks. No reprints.
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
