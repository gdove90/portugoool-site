"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("signup failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-ink py-16 text-paper sm:py-20">
      <div className="mx-auto max-w-content px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tightest sm:text-4xl">
          Get the next drop first.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-paper/60">
          Drops are small and sell out. The list hears about them before anyone else.
        </p>

        {status === "success" ? (
          <p className="mt-8 text-lg font-semibold text-gold" role="status">
            You&apos;re on the list. ⚽
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="signup-email" className="sr-only">
              Email address
            </label>
            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-full border border-paper/20 bg-paper/10 px-5 py-3.5 text-paper placeholder:text-paper/40 focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 rounded-full bg-red px-8 py-3.5 font-semibold text-paper transition-colors hover:bg-red-dark disabled:opacity-60"
            >
              {status === "loading" ? "Joining…" : "Join the list"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-red" role="alert">
            Something went wrong. Try again.
          </p>
        )}
      </div>
    </section>
  );
}
