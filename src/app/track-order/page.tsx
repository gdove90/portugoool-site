"use client";

import Link from "next/link";
import { useState } from "react";

// ─────────────────────────────────────────────────────────────
// Real order tracking. The lookup calls /api/track-order with the
// order reference (GOOOL-XXXXXXXX, from the confirmation page) plus
// the checkout email; the server verifies both together. No fake
// "status is on its way" promises — every message reflects what the
// backend actually did.
//
// Design 3a (2026-09-29): black hero band with the page title, then a
// lookup card that overlaps the hero on desktop beside the three-step
// timeline. UI only; the lookup, its request body and every branch of
// the Result union are unchanged, and the copy is word for word.
// ─────────────────────────────────────────────────────────────

interface Shipment {
  carrier: string | null;
  trackingNumbers: string[];
  trackingUrls: string[];
}

type Result =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "found"; status: string; shipments: Shipment[] }
  | { kind: "error"; message: string };

export default function TrackOrderPage() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Result>({ kind: "idle" });

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setResult({ kind: "loading" });
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({ kind: "error", message: data.error ?? "Lookup failed." });
        return;
      }
      setResult({ kind: "found", status: data.status, shipments: data.shipments ?? [] });
    } catch {
      setResult({
        kind: "error",
        message: "Order lookup isn't available right now. Email hello@goool.shop and we'll check for you.",
      });
    }
  }

  return (
    <>
      <section className="border-t border-paper/10 bg-ink px-5 pb-10 pt-11 text-paper sm:px-6 md:pb-[60px] md:pt-[72px] lg:px-12">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-paper/60">Help</p>
        <h1 className="mt-4 font-display text-[56px] uppercase leading-[0.92] md:text-[104px]">
          Track Order
        </h1>
        <div aria-hidden className="mt-4 h-1.5 w-24 origin-left -skew-x-[30deg] bg-red" />
      </section>

      <div className="flex flex-col gap-9 px-5 pb-12 pt-8 sm:px-6 md:flex-row md:items-start md:gap-[72px] md:pb-[88px] md:pt-16 lg:px-12">
        {/* Lookup card: pulled up over the hero on desktop only */}
        <div className="relative flex w-full flex-col gap-4 border border-ink/15 bg-paper p-[22px] md:-mt-[110px] md:w-[480px] md:shrink-0 md:p-8">
          <h2 className="font-display text-[26px] uppercase leading-tight">Check your order status</h2>
          <p className="text-base text-ink/70">
            Enter your order reference (it looks like GOOOL-1A2B3C4D) and the
            email you ordered with.
          </p>

          <form className="flex flex-col gap-4" onSubmit={lookup}>
            <div className="flex flex-col gap-2">
              <label htmlFor="track-ref" className="text-sm font-semibold">
                Order reference
              </label>
              <input
                id="track-ref"
                type="text"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="GOOOL-1A2B3C4D"
                className="w-full rounded-full border border-ink/25 px-5 py-4 text-base focus:border-ink focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="track-email" className="text-sm font-semibold">
                Order email
              </label>
              <input
                id="track-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-full border border-ink/25 px-5 py-4 text-base focus:border-ink focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={result.kind === "loading"}
              className="min-h-[52px] w-full rounded-full bg-ink px-6 font-display text-[17px] uppercase tracking-[0.1em] text-paper transition-colors hover:bg-ink/85 disabled:opacity-60"
            >
              {result.kind === "loading" ? "Checking…" : "Check status"}
            </button>
          </form>

          {result.kind === "found" && (
            <div className="border-l-4 border-red bg-smoke px-[18px] py-4" role="status">
              <p className="text-[17px] font-bold">{result.status}</p>
              {result.shipments.map((s, i) => (
                <p key={i} className="mt-1 text-base text-ink/70">
                  {s.carrier ? `${s.carrier}: ` : ""}
                  {s.trackingUrls.length > 0
                    ? s.trackingUrls.map((u, j) => (
                        <a
                          key={u}
                          href={u}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-ink underline underline-offset-[3px]"
                        >
                          {s.trackingNumbers[j] ?? "Track package"}
                        </a>
                      ))
                    : s.trackingNumbers.join(", ")}
                </p>
              ))}
            </div>
          )}
          {result.kind === "error" && (
            <p className="text-[15px] font-semibold text-red" role="alert">
              {result.message}
            </p>
          )}
        </div>

        {/* Timeline */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="text-[17px] text-ink/70">Here&apos;s how the timeline works:</p>

          <ol>
            {[
              ["Order confirmed", "Instant receipt from our secure checkout, with your GOOOL order reference."],
              ["Shipped", "Tracking number lands in your inbox."],
              ["Delivered", "Within 7–12 business days in the US. Canada, the UK and Portugal typically take 3 to 5 weeks."],
            ].map(([title, body], i) => (
              <li key={title} className="flex items-start gap-4 border-t border-ink/10 py-[18px]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-ink font-display text-lg text-paper">
                  {i + 1}
                </span>
                <div>
                  <p className="text-lg font-bold">{title}</p>
                  <p className="text-base leading-relaxed text-ink/70">{body}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="border-t border-ink/10 pt-[18px] text-base text-ink/70">
            Still stuck?{" "}
            <Link href="/contact" className="font-bold text-ink underline underline-offset-[3px]">
              Contact us
            </Link>{" "}
            and we reply within one business day.
          </p>
        </div>
      </div>
    </>
  );
}
