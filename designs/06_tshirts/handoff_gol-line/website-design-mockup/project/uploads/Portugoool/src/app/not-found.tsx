import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-content px-4 py-24 text-center sm:px-6">
      <p className="font-display text-7xl font-bold uppercase tracking-tightest text-ink/20">
        Offside
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-ink">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-2 text-ink/60">The play continues back at the shop.</p>
      <Link
        href="/shop"
        className="mt-8 inline-block rounded-full bg-red px-8 py-4 text-base font-semibold text-paper transition-colors hover:bg-red-dark"
      >
        Back to the Shop
      </Link>
    </div>
  );
}
