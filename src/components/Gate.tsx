"use client";

import Image from "next/image";
import { useState } from "react";

// The password gate IS the homepage hero, full-viewport, with a password
// field where the hero's call to action would sit. Owner decision,
// 2026-09-23: the splash that stood here first was a separate design, and
// there is no reason for the door to look different from the room.
//
// Everything visual below is the Hero component verbatim - the same
// wordmark PNG, the same measured Anton proportions, the same gradient,
// the same "Made for the Moment." line. The measurements and the reasons
// behind them live in src/components/Hero.tsx and are not repeated here;
// if that file's lockup changes, change this one to match.
//
// The password check is real. It is validated server-side in /api/preview
// against PREVIEW_KEY and never reaches the client bundle. The curtain
// that stood here before 2026-09-23 set the cookie for anyone who asked
// and said so in its own header comment.
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
        // set has to be on the next request for middleware to let it
        // through, and only a real navigation guarantees that.
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
    // fixed inset-0 above the chrome, not a page section. /gate renders
    // inside the root layout, so the site Header sat on top of the gate
    // complete with its nav and a cart badge - an invitation into exactly
    // the thing being withheld, and a cart count for a store the visitor
    // cannot reach. Covering the viewport is how the previous splash
    // handled this too.
    //
    // overflow-y-auto rather than hidden: a short viewport (a landscape
    // phone, a browser with a toolbar open) would otherwise clip the
    // password field off the bottom with no way to scroll to it.
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-ink">
      <section className="relative flex min-h-full items-center justify-center overflow-hidden">
      <Image
        src="/hero-crowd.webp"
        alt="Fan with raised fist in a red-lit stadium crowd"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* The hero's legibility gradient, carried a little further at the
          bottom: this screen puts an input and a button where the hero has
          only air, and both need a darker ground than the hero's 0.75. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.15) 32%, rgba(10,10,10,0.22) 52%, rgba(10,10,10,0.88) 92%)",
        }}
      />

      <div className="relative px-4 py-20 text-center">
        <h1 className="mx-auto w-[calc(100vw-2rem)] max-w-[420px] [container-type:inline-size] lg:max-w-[560px]">
          <Image
            src="/brand/goool-wordmark-tight-white.png"
            alt="GOOOL Athletics"
            width={420}
            height={103}
            priority
            className="h-auto w-full drop-shadow-[0_6px_40px_rgba(0,0,0,0.6)]"
          />
          <span
            aria-hidden="true"
            className="mt-[3.35cqw] flex w-full justify-between font-display text-[48px] leading-none text-paper drop-shadow-[0_6px_40px_rgba(0,0,0,0.6)] [font-size:11.5cqw]"
          >
            {"ATHLETICS".split("").map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </span>
        </h1>
        <p className="mt-4 font-display text-xl uppercase tracking-[0.16em] text-paper drop-shadow-[0_6px_40px_rgba(0,0,0,0.6)] sm:text-3xl lg:text-[34px]">
          Made for the Moment.
        </p>

        <form
          onSubmit={submit}
          className="mx-auto mt-9 flex w-[calc(100vw-2rem)] max-w-[420px] flex-col items-stretch gap-2.5 sm:mt-10 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center"
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
            className={`w-full rounded-full border px-6 py-4 text-center text-base text-paper backdrop-blur-sm outline-none placeholder:text-paper/50 focus:border-paper sm:w-[260px] sm:text-left ${
              rejected
                ? "border-[#E8505C] bg-red/20"
                : "border-paper/35 bg-ink/40"
            }`}
          />
          <button
            type="submit"
            disabled={state === "checking"}
            className="rounded-full bg-red px-9 py-4 text-base font-semibold text-paper transition-colors hover:bg-red-dark disabled:opacity-60"
          >
            {state === "checking" ? "Checking…" : "Enter"}
          </button>
        </form>

        {/* Coral, not brand red. #C1121F over this photograph measures
            around 2.3:1 and fails WCAG AA, which would leave the one
            message a locked-out visitor actually needs as the least
            readable thing on the screen. The red border and tinted field
            carry the brand cue instead. */}
        {rejected && (
          <p
            id="gate-error"
            role="alert"
            className="mx-auto mt-4 max-w-[340px] text-sm leading-relaxed text-[#FF9AA2] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
          >
            {state === "wrong"
              ? "That password is not right. Check it and try again."
              : "Something went wrong. Try again in a moment."}
          </p>
        )}
      </div>
      </section>
    </div>
  );
}
