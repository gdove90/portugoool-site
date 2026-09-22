"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Pre-launch landing takeover — covers the viewport (fixed, above the
// header/announcement chrome) while checkout is not yet live. Launch day:
// delete this component and restore the store homepage (git revert).
export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("Something went wrong. Try again.");

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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setErrorMsg(body?.error ?? "Something went wrong. Try again.");
        throw new Error();
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

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

        {status === "success" ? (
          <p className="mt-8 text-lg font-semibold text-gold" role="status">
            You&apos;re on the list. You&apos;ll hear it first. ⚽
          </p>
        ) : (
          <form onSubmit={submit} className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="cs-email" className="sr-only">Email address</label>
            <input
              id="cs-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-full border border-paper/25 bg-ink/40 px-5 py-3.5 text-paper placeholder:text-paper/40 backdrop-blur focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 rounded-full bg-red px-8 py-3.5 font-semibold text-paper transition-colors hover:bg-red-dark disabled:opacity-60"
            >
              {status === "loading" ? "Joining…" : "Get first access"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="mt-3 text-sm text-red" role="alert">{errorMsg}</p>
        )}
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
