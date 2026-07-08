import type { Metadata } from "next";
import Link from "next/link";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "About",
  description:
    "PORTUGOOOL is an independent fan apparel brand born from the sound of the goal.",
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tightest text-ink sm:text-6xl">
          Born from<br />the <span className="text-red">sound</span>.
        </h1>

        <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink/70">
          <p>
            You know the moment. The ball hits the net, the room explodes, and
            one word stretches out forever: <strong className="text-ink">GOOOOOL</strong>.
          </p>
          <p>
            PORTUGOOOL exists for that moment. We make premium, lightweight
            game-day shirts inspired by Portuguese football passion — built for
            the stadium, the watch party, and everywhere in between.
          </p>
          <p>
            Every design is original. Every release is a small-batch drop. When
            a drop sells out, it&apos;s gone, and the next design takes its place.
          </p>
          <p className="text-base text-ink/50">
            PORTUGOOOL is an independent fan brand. We are not affiliated with
            any federation, club, league, or governing body — just fans making
            shirts for fans.
          </p>
        </div>

        <Link
          href="/drop"
          className="mt-10 inline-block rounded-full bg-red px-8 py-4 text-base font-semibold text-paper transition-colors hover:bg-red-dark"
        >
          Shop the Drop
        </Link>
      </section>

      <EmailSignup />
    </>
  );
}
