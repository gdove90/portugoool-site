"use client";

import Link from "next/link";
import { useState } from "react";

// ─────────────────────────────────────────────────────────────
// Real order tracking. The lookup calls /api/track-order with the
// order reference (GOOOL-XXXXXXXX, from the confirmation page) plus
// the checkout email; the server verifies both together. No fake
// "status is on its way" promises — every message reflects what the
// backend actually did.
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
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-4xl font-bold uppercase tracking-tightest text-ink sm:text-5xl">
        Track Order
      </h1>
      <p className="mt-2 text-ink/60">Here&apos;s how the timeline works:</p>

      <ol className="mt-8 space-y-4">
        {[
          ["Order confirmed", "Instant receipt from our secure checkout, with your GOOOL order reference."],
          ["Shipped", "Tracking number lands in your inbox."],
          ["Delivered", "Within 7–12 business days in the US."],
        ].map(([title, body], i) => (
          <li key={title} className="flex gap-4 rounded-xl bg-smoke p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-display font-bold text-gold">
              {i + 1}
            </span>
            <div>
              <p className="font-semibold text-ink">{title}</p>
              <p className="mt-0.5 text-sm text-ink/60">{body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-xl border border-ink/15 p-6">
        <h2 className="font-semibold text-ink">Check your order status</h2>
        <p className="mt-1 text-sm text-ink/60">
          Enter your order reference (it looks like GOOOL-1A2B3C4D) and the
          email you ordered with.
        </p>

        <form className="mt-4 flex flex-col gap-3" onSubmit={lookup}>
          <label htmlFor="track-ref" className="sr-only">
            Order reference
          </label>
          <input
            id="track-ref"
            type="text"
            required
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="GOOOL-1A2B3C4D"
            className="w-full rounded-full border border-ink/20 px-5 py-3 text-sm focus:border-ink focus:outline-none"
          />
          <label htmlFor="track-email" className="sr-only">
            Order email
          </label>
          <input
            id="track-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full rounded-full border border-ink/20 px-5 py-3 text-sm focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            disabled={result.kind === "loading"}
            className="shrink-0 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink/80 disabled:opacity-60"
          >
            {result.kind === "loading" ? "Checking…" : "Check status"}
          </button>
        </form>

        {result.kind === "found" && (
          <div className="mt-4 rounded-lg bg-smoke p-4" role="status">
            <p className="font-semibold text-ink">{result.status}</p>
            {result.shipments.map((s, i) => (
              <p key={i} className="mt-1 text-sm text-ink/60">
                {s.carrier ? `${s.carrier}: ` : ""}
                {s.trackingUrls.length > 0
                  ? s.trackingUrls.map((u, j) => (
                      <a
                        key={u}
                        href={u}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-ink underline underline-offset-2"
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
          <p className="mt-4 text-sm font-semibold text-red" role="alert">
            {result.message}
          </p>
        )}
      </div>

      <p className="mt-8 text-center text-sm text-ink/50">
        Still stuck?{" "}
        <Link href="/contact" className="font-semibold text-ink underline underline-offset-2">
          Contact us
        </Link>{" "}
        and we reply within one business day.
      </p>
    </div>
  );
}
