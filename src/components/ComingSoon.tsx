"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Landing splash — covers the viewport (fixed, above the header and
// announcement chrome) and is the first thing every visitor sees.
//
// Kept deliberately after opening the store: the owner wants its
// imagery and tone as the entry to the brand. It no longer gates
// anything and no longer captures email. One Enter button, straight
// into the collection. The newsletter signup still lives on /about,
// /drop and /world-cup, so nothing was lost by removing it here.
export default function ComingSoon() {
  // Entry to the shop. Open to everyone: the splash is kept as the
  // landing experience, not as a lock. Clicking sets the gate cookie
  // and goes straight through.
  const [entering, setEntering] = useState(false);

  async function enter() {
    if (entering) return;
    setEntering(true);
    try {
      await fetch("/api/preview", { method: "POST" });
    } catch {
      // Even if the cookie call fails, send them on. The worst case is
      // the middleware bounces them back here, which is where they are
      // already - far better than a dead button.
    }
    window.location.href = "/shop";
  }

  // Lock the page behind the takeover (no stray scrollbar).
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden bg-ink">
      <Image
        src="/hero-crowd.webp"
        alt="Fan with raised fist in a red-lit stadium crowd"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.35) 40%, rgba(10,10,10,0.35) 55%, rgba(10,10,10,0.85) 100%)",
        }}
      />

      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
        {/* Echo mark */}
        <svg width="72" height="72" viewBox="0 0 240 220" aria-hidden="true">
          <defs>
            <clipPath id="cs-echo"><rect x="54" y="0" width="186" height="220" /></clipPath>
          </defs>
          <circle cx="54" cy="110" r="15" fill="#FFFFFF" />
          <g clipPath="url(#cs-echo)" fill="none">
            <circle cx="54" cy="110" r="38" stroke="#C1121F" strokeWidth="13" />
            <circle cx="54" cy="110" r="68" stroke="#C1121F" strokeWidth="13" />
            <circle cx="54" cy="110" r="98" stroke="#C9A227" strokeWidth="13" />
          </g>
        </svg>

        <h1 className="mt-8" aria-label="GOOOL">
          <Image
            src="/brand/goool-wordmark-white.png"
            alt="GOOOL"
            width={340}
            height={118}
            priority
            className="mx-auto drop-shadow-[0_6px_40px_rgba(0,0,0,0.6)] sm:w-[440px]"
          />
        </h1>
        <p className="mt-3 font-display text-lg uppercase tracking-[0.16em] text-paper sm:text-2xl">
          Made for the Moment.
        </p>

        <p className="mt-10 font-display text-3xl uppercase tracking-[0.3em] text-gold sm:text-5xl">
          Coming Soon
        </p>
        <p className="mt-4 max-w-md text-sm text-paper/70 sm:text-base">
          The First Capsule. Original GOOOL designs.
          <br />
          GOOOL · Made for the Moment
        </p>

      </div>

      {/* Enter the shop — open to everyone */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={enter}
          disabled={entering}
          className="group rounded-full border border-paper/40 px-9 py-3 font-display text-sm uppercase tracking-[0.22em] text-paper transition-colors hover:border-gold hover:text-gold disabled:opacity-60"
        >
          {entering ? "Entering…" : "Enter"}
          <span aria-hidden className="ml-2 inline-block transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </button>
        <p className="text-[11px] uppercase tracking-[0.2em] text-paper/40">
          Browse the collection
        </p>
      </div>
    </div>
  );
}
