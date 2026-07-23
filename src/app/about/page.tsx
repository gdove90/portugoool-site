import type { Metadata } from "next";
import Link from "next/link";
import EmailSignup from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "About",
  description:
    "GOOOL is an independent fan apparel brand born from the sound every stadium on earth screams the same.",
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
            You know the moment. The ball hits the net, the room explodes, and
            one word stretches forever: <strong className="text-ink">GOOOOOL</strong>.
          </p>
          <p>
            It&apos;s the only word every stadium on earth screams the same —
            São Paulo, Lisbon, Mexico City, and the loudest living room on
            your street. GOOOL exists for that moment: premium, lightweight
            game-day apparel built for the second it goes in.
          </p>
          <p>
            We launch in chapters. Now live:{" "}
            <strong className="text-ink">The Crest Collection</strong> —
            the official GOOOL crest on garment-dyed heavyweight cotton.
            When the next chapter lands, designs can retire.
          </p>
          <p className="text-base text-ink/50">
            GOOOL is an independent fan brand. We are not affiliated with any
            federation, club, league, or governing body — just fans making
            shirts for fans, wherever the game is loud.
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
