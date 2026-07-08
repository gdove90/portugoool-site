import type { Metadata } from "next";
import Link from "next/link";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Shipping, sizing, returns, customization, and production timing for GOOOL orders.",
};

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-4xl font-bold uppercase tracking-tightest text-ink sm:text-5xl">
        FAQ
      </h1>
      <p className="mt-2 text-ink/60">
        Shipping, sizing, returns, and customization.
      </p>

      <div className="mt-10">
        <FAQAccordion />
      </div>

      <div className="mt-12 rounded-xl bg-smoke p-6 text-center">
        <p className="font-semibold text-ink">Still have a question?</p>
        <p className="mt-1 text-sm text-ink/60">
          We answer every message within one business day.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink/80"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
