"use client";

import Image from "next/image";
import { useState } from "react";

// The password gate. Covers the whole site while the storefront is held
// back from the public; everything behind it stays live and functional
// for anyone holding the password.
//
// This is a real check, unlike the curtain that stood here before 2026-09-23
// (that one set the cookie without validating anything, and its own header
// comment called it "a CURTAIN, not a lock"). The password is validated
// server-side in /api/preview against PREVIEW_KEY and never reaches the
// client bundle.
//
// The lockup is built the way the hero builds it: the wordmark PNG carries
// GOOOL and the segmented rule at their exact drawn proportions, and
// ATHLETICS is set in Anton beneath it, spread to the wordmark's width.
// Container query units size both against the wordmark rather than the
// viewport, so the lockup holds its proportions at every width without a
// single breakpoint.
export default function Gate({ next }: { next: string }) {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "wrong" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "checking" || !password) return;
    setState("checking");
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        // Full navigation, not a router push: the cookie the server just
        // set has to be present on the next request for middleware to let
        // it through, and only a real navigation guarantees that.
        window.location.href = next;
        return;
      }
      setState(res.status === 401 ? "wrong" : "error");
    } catch {
      setState("error");
    }
  }

  const rejected = state === "wrong" || state === "error";

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden bg-ink">
      <Image
        src="/hero-crowd.webp"
        alt=""
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
            "linear-gradient(180deg, rgba(10,10,10,0.84) 0%, rgba(10,10,10,0.60) 36%, rgba(10,10,10,0.73) 62%, rgba(10,10,10,0.95) 100%)",
        }}
      />

      <div className="relative flex h-full flex-col items-center justify-between px-6 py-11 sm:py-14">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-paper/60 sm:text-[11px] sm:tracking-[0.34em]">
          Private preview
        </p>

        <div className="flex w-full flex-col items-center">
          <div className="w-[calc(100vw-3rem)] max-w-[282px] [container-type:inline-size] sm:max-w-[460px]">
            <Image
              src="/brand/goool-wordmark-tight-white.png"
              alt="GOOOL Athletics"
              width={720}
              height={177}
              priority
              className="h-auto w-full"
            />
            <div
              aria-hidden="true"
              className="flex justify-between font-display leading-none text-paper"
              style={{ fontSize: "11.5cqw", marginTop: "3.35cqw" }}
            >
              {"ATHLETICS".split("").map((c, i) => (
                <span key={i}>{c}</span>
              ))}
            </div>
          </div>

          <p className="mt-8 text-center text-[17px] leading-relaxed text-paper/90 sm:mt-10 sm:text-[19px]">
            The Sound of Victory.
          </p>
          <p className="mt-3 max-w-[300px] text-center text-sm leading-relaxed text-paper/70 sm:max-w-[430px] sm:text-[15px]">
            The collection is being finished. If you have a password, you are
            early.
          </p>

          <form
            onSubmit={submit}
            className="mt-7 flex w-full max-w-[342px] flex-col gap-2.5 sm:mt-8 sm:max-w-none sm:flex-row sm:gap-2.5"
          >
            <label htmlFor="gate-password" className="sr-only">
              Password
            </label>
            <input
              id="gate-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (rejected) setState("idle");
              }}
              placeholder="Password"
              aria-invalid={rejected}
              aria-describedby={rejected ? "gate-error" : undefined}
              className={`w-full rounded-full border px-5 py-4 text-center text-base text-paper outline-none placeholder:text-paper/45 focus:border-paper sm:w-[268px] sm:py-[15px] sm:text-left sm:text-[15px] ${
                rejected
                  ? "border-[#E8505C] bg-red/[0.16]"
                  : "border-paper/30 bg-paper/10"
              }`}
            />
            <button
              type="submit"
              disabled={state === "checking"}
              className="rounded-full bg-red px-8 py-4 text-base font-semibold text-paper transition-colors hover:bg-red-dark disabled:opacity-60 sm:py-[15px] sm:text-[15px]"
            >
              {state === "checking" ? "Checking…" : "Enter"}
            </button>
          </form>

          {/* Coral, not brand red. #C1121F on this near-black ground measures
              about 2.3:1 and fails WCAG AA, which would make the one message
              a locked-out visitor needs to read the least legible thing on
              the screen. The red border and tinted field carry the brand cue. */}
          {rejected && (
            <p
              id="gate-error"
              role="alert"
              className="mt-3 max-w-[300px] text-center text-sm leading-relaxed text-[#FF9AA2]"
            >
              {state === "wrong"
                ? "That password is not right. Check it and try again."
                : "Something went wrong. Try again in a moment."}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <p className="text-center text-[11px] text-paper/50 sm:text-xs">
            Original soccer sportswear. Made for the Moment.
          </p>
          <p className="text-[10px] text-paper/35 sm:text-[11px]">
            © 2026 GOOOL Athletics LLC
          </p>
        </div>
      </div>
    </div>
  );
}
