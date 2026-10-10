import { pageMetadata } from "@/lib/page-metadata";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata = pageMetadata("/refunds", "Refund Policy", "All sales are final. Defective or damaged items are replaced free.");

const CONTACT_EMAIL = "hello@goool.shop";

const STATS = [
  { value: "14 days", label: "to report a defect or damage, from delivery" },
  { value: "30 days", label: "to report a lost order, from the ship date" },
  { value: "Free", label: "replacement, or a full refund if we can't replace it" },
];

const SECTIONS = [
  { id: "defects", title: "Defects & damage" },
  { id: "not-covered", title: "What doesn't qualify" },
  { id: "lost", title: "Lost in transit" },
  { id: "cancellations", title: "Cancellations" },
];

const NOT_COVERED = [
  "Wrong size ordered. Check the fit notes on each product page before buying",
  "Change of mind or style preference",
  "Normal wear, or damage from care outside the instructions",
];

const linkClass = "font-medium text-ink underline underline-offset-2";

function SectionHeading({ index, id, children }: { index: number; id: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-6 sm:gap-10">
      <span className="font-display text-3xl leading-none text-red sm:text-4xl" aria-hidden="true">
        {String(index).padStart(2, "0")}
      </span>
      <h2 id={id} className="scroll-mt-24 font-display text-3xl uppercase leading-none tracking-tightest text-ink sm:text-4xl">
        {children}
      </h2>
    </div>
  );
}

export default function RefundsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-content px-4 py-16 sm:px-6 sm:py-20">
          <p className="font-display text-sm uppercase tracking-widest text-paper/60">
            GOOOL Athletics
          </p>
          <h1 className="mt-3 font-display text-6xl uppercase leading-none tracking-tightest sm:text-7xl lg:text-8xl">
            Refund Policy
          </h1>
          <div className="mt-6 h-1.5 w-28 bg-red" aria-hidden="true" />
          <p className="mt-8 text-2xl font-semibold">All sales are final.</p>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-paper/70">
            We don&apos;t accept returns or exchanges, but if anything arrives
            wrong, we make it right below.
          </p>
        </div>
      </section>

      {/* Key numbers */}
      <section className="bg-smoke">
        <dl className="mx-auto grid max-w-content divide-y divide-ink/10 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
          {STATS.map((s, i) => (
            <div key={s.value} className={`py-6 sm:py-8 ${i > 0 ? "sm:pl-8" : ""}`}>
              <dt className="font-display text-4xl uppercase leading-none tracking-tightest text-ink sm:text-5xl">
                {s.value}
              </dt>
              <dd className="mt-2 text-sm text-ink/70">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Body */}
      <div className="mx-auto grid max-w-content gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-20">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="On this page">
            <p className="font-display text-sm uppercase tracking-widest text-ink/50">On this page</p>
            <ol className="mt-4 space-y-2">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="inline-flex gap-3 py-1 text-ink hover:text-red">
                    <span className="font-display text-red">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-8 bg-ink p-6 text-paper">
            <p className="font-display text-2xl uppercase leading-none tracking-tightest">
              Something arrived wrong?
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-4 inline-block font-semibold underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
            <Link
              href="/contact"
              className="mt-4 flex min-h-11 w-fit items-center bg-red px-5 font-display text-sm uppercase tracking-widest text-paper hover:bg-red-dark"
            >
              Contact page
            </Link>
          </div>
        </aside>

        <div className="divide-y divide-ink/10">
          <section className="pb-12">
            <SectionHeading index={1} id="defects">Defects &amp; damage: on us</SectionHeading>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/70">
              If your order arrives defective, damaged, misprinted, or it&apos;s
              the wrong item, we make it right at no cost: a free replacement,
              or a full refund if we can&apos;t replace it.
            </p>
            <ol className="mt-8 grid gap-3 sm:grid-cols-2">
              <li className="bg-smoke p-5">
                <p className="font-display text-xs uppercase tracking-widest text-ink/50">Step 1</p>
                <p className="mt-2 text-ink">Contact us within <strong>14 days of delivery</strong></p>
              </li>
              <li className="bg-smoke p-5">
                <p className="font-display text-xs uppercase tracking-widest text-ink/50">Step 2</p>
                <p className="mt-2 text-ink">Include your order number and a photo of the damage or defect</p>
              </li>
              <li className="bg-smoke p-5">
                <p className="font-display text-xs uppercase tracking-widest text-ink/50">Step 3</p>
                <p className="mt-2 text-ink">The item&apos;s tag must still be attached</p>
              </li>
              <li className="bg-smoke p-5">
                <p className="font-display text-xs uppercase tracking-widest text-ink/50">Step 4</p>
                <p className="mt-2 text-ink">
                  Email <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a> or use the{" "}
                  <Link href="/contact" className={linkClass}>contact page</Link>
                </p>
              </li>
            </ol>
          </section>

          <section className="py-12">
            <SectionHeading index={2} id="not-covered">What doesn&apos;t qualify</SectionHeading>
            <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {NOT_COVERED.map((item) => (
                <li key={item} className="flex gap-4 py-4 text-ink">
                  <span className="font-bold" aria-hidden="true">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="py-12">
            <SectionHeading index={3} id="lost">Lost in transit</SectionHeading>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/70">
              If tracking shows your order never arrived, contact us within 30
              days of the ship date and we&apos;ll replace it free.
            </p>
          </section>

          <section className="py-12">
            <SectionHeading index={4} id="cancellations">Cancellations</SectionHeading>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/70">
              Orders are processed fast. If you need to cancel, email us
              immediately, since we can only cancel before your order is processed.
            </p>
          </section>

          <p className="pt-10 text-xs leading-relaxed text-ink/50">
            This policy is linked from the cart before you pay, and from the
            footer of every page. It applies to all orders.
            Last updated September 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
