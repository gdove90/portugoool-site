import type { Metadata } from "next";
import Link from "next/link";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "About",
  description:
    "GOOOL is an original soccer sportswear brand born from the sound every stadium on earth screams the same.",
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <h1 className="font-display text-4xl uppercase tracking-tightest text-ink sm:text-6xl">
          Born from<br />the <span className="text-red">sound</span>.
        </h1>

        <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink/70">
          <p>
            The ball hits the net. The crowd erupts. For a moment, nothing
            else matters.
          </p>
          <p>
            GOOOL is an original soccer sportswear brand built around that
            feeling: the passion, the belonging, and the moments you carry
            long after the final whistle.
          </p>
          <p>
            Our <strong className="text-ink">First Capsule</strong> brings
            together a performance tee, a heavyweight everyday tee, a core
            hoodie, and a signature cap. Original crests and wordmarks.
            Colors that work together. Pieces for the pitch, the stands, and
            wherever the day takes you.
          </p>
          <p>
            The First Capsule is here. Find your colors. Make them
            yours.
          </p>
          <p className="font-semibold text-ink">
            The Sound of Victory. Made for the Moment.
          </p>
          <p className="text-base text-ink/50">
            GOOOL is an independent brand. We are not affiliated with any
            federation, club, league, or governing body. All designs and
            marks are original.
          </p>
        </div>

        <Link
          href="/shop"
          className="mt-10 inline-block rounded-full bg-red px-8 py-4 text-base font-semibold text-paper transition-colors hover:bg-red-dark"
        >
          Explore the Collection
        </Link>
      </section>

      <EmailSignup />
    </>
  );
}
