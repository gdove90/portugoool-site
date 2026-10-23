"use client";

import Link from "next/link";
import { useState } from "react";

// The Goal Collective "Notify me" form. Posts to the same /api/newsletter the
// footer and gate signups use (stored signup, email audience, welcome email),
// with the same consent line. Copy is from the approved Figma Make page.
export default function CollectiveNotifyForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function notify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(result.error || "Please try again.");
      setState("done");
      setEmail("");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Please try again.");
    }
  }

  const note = state === "done" ? "You're on the list. We'll see you soon." : state === "error" ? error : "Launch notes only. No noise.";

  return (
    <form onSubmit={notify} className="mt-9 max-w-[520px]">
      <div className="flex border-b-2 border-[#171817]">
        <label htmlFor="collective-email" className="sr-only">
          Email address
        </label>
        <input
          id="collective-email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          aria-describedby="collective-email-note collective-email-consent"
          placeholder="Enter your email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          className="min-w-0 flex-1 bg-transparent py-4 text-[13px] font-normal outline-none placeholder:text-[#7c7f77]"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="flex items-center gap-3 bg-[#171817] px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#626b4d]"
        >
          Notify me
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <p id="collective-email-note" role="status" className="mt-3 min-h-4 text-[10px] font-normal tracking-[0.04em] text-[#6f726a]">
        {note}
      </p>
      <p id="collective-email-consent" className="mt-2 text-[10px] font-normal leading-[1.6] tracking-[0.04em] text-[#6f726a]">
        By joining, you agree to receive GOAL Athletics welcome, collection, and offer emails. Unsubscribe anytime.{" "}
        <a className="underline" href="mailto:support@goalathletics.shop">Contact Support</a>.{" "}
        <Link className="underline" href="/privacy">Privacy</Link>.
      </p>
    </form>
  );
}
