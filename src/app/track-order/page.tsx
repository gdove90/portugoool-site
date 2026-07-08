"use client";

import Link from "next/link";
import { useState } from "react";

// Launch version: orders are tracked via the email Stripe sends plus the
// shipping confirmation. This page sets expectations and gives customers
// a self-serve path before support exists.
// TODO: once the Stripe webhook writes orders to Supabase, look the order
// up here by email + order id and show live fulfillment_status.

export default function TrackOrderPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-4xl font-bold uppercase tracking-tightest text-ink sm:text-5xl">
        Track Order
      </h1>
      <p className="mt-2 text-ink/60">
        Every shirt is made to order. Here&apos;s how the timeline works:
      </p>

      <ol className="mt-8 space-y-4">
        {[
          ["Order confirmed", "Instant email receipt from our secure checkout."],
          ["In production", "Your piece is printed and pressed — 5–7 business days."],
          ["Shipped", "Tracking number lands in your inbox — 3–7 business days in the US."],
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
        <h2 className="font-semibold text-ink">Can&apos;t find your tracking email?</h2>
        <p className="mt-1 text-sm text-ink/60">
          Enter the email you ordered with and we&apos;ll resend your latest
          order status.
        </p>

        {submitted ? (
          <p className="mt-4 text-sm font-semibold text-green" role="status">
            If an order exists for that email, the status is on its way to
            your inbox. Check spam too.
          </p>
        ) : (
          <form
            className="mt-4 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSubmitted(true);
            }}
          >
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
              className="shrink-0 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink/80"
            >
              Resend status
            </button>
          </form>
        )}
      </div>

      <p className="mt-8 text-center text-sm text-ink/50">
        Still stuck?{" "}
        <Link href="/contact" className="font-semibold text-ink underline underline-offset-2">
          Contact us
        </Link>{" "}
        — we reply within one business day.
      </p>
    </div>
  );
}
