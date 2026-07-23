"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Pre-launch landing takeover — covers the viewport (fixed, above the
// header/announcement chrome) while checkout is not yet live. Launch day:
// delete this component and restore the store homepage (git revert).
export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Discreet team-access unlock (validated server-side, sets the gate cookie)
  const [showAccess, setShowAccess] = useState(false);
  const [password, setPassword] = useState("");
  const [accessError, setAccessError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!password || unlocking) return;
    setUnlocking(true);
    setAccessError(false);
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error();
      window.location.href = "/shop";
    } catch {
      setAccessError(true);
      setUnlocking(false);
    }
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
      if (!res.ok) throw new Error();
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

        <h1
          className="mt-6 font-marker text-6xl leading-[0.95] text-paper sm:text-8xl"
          style={{ textShadow: "0 6px 40px rgba(0,0,0,0.6)" }}
        >
          Goool
        </h1>
        <p className="mt-3 font-display text-lg uppercase tracking-[0.16em] text-paper sm:text-2xl">
          The Sound of Victory.
        </p>

        <p className="mt-10 font-display text-3xl uppercase tracking-[0.3em] text-gold sm:text-5xl">
          Coming Soon
        </p>
        <p className="mt-4 max-w-md text-sm text-paper/70 sm:text-base">
          The Crest Collection — made to order, printed for you.
          <br />
          G<span className="text-red">OOO</span>L · The Sound of Victory
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
          <p className="mt-3 text-sm text-red" role="alert">Something went wrong. Try again.</p>
        )}
      </div>

      {/* Discreet team access — bottom of the page */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center">
        {showAccess ? (
          <form onSubmit={unlock} className="flex items-center gap-2">
            <label htmlFor="cs-pass" className="sr-only">Access password</label>
            <input
              id="cs-pass"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => { setPassword(e.target.value); setAccessError(false); }}
              placeholder="Password"
              className={`w-44 rounded-full border bg-ink/60 px-4 py-2 text-sm text-paper placeholder:text-paper/40 backdrop-blur focus:outline-none ${accessError ? "border-red" : "border-paper/25 focus:border-gold"}`}
            />
            <button
              type="submit"
              disabled={unlocking}
              className="rounded-full border border-paper/25 px-4 py-2 text-sm font-semibold text-paper/80 transition-colors hover:border-paper hover:text-paper disabled:opacity-60"
            >
              {unlocking ? "…" : "Enter"}
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowAccess(true)}
            className="text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/40 transition-colors hover:text-paper/80"
          >
            Team access
          </button>
        )}
      </div>
    </div>
  );
}
