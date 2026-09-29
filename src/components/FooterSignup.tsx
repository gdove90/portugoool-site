"use client";

import { useState } from "react";

// Footer version of EmailSignup (design 2a). Same /api/newsletter call and
// consent line; the standalone homepage section is removed.
type Status = "idle" | "loading" | "success" | "error";

export default function FooterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("Something went wrong. Try again.");

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
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setErrorMsg(body?.error ?? "Something went wrong. Try again.");
        throw new Error("signup failed");
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-2 flex flex-col gap-2.5">
      <p className="text-base font-semibold text-paper">Get the next drop first.</p>
      <p className="text-[15px] leading-snug text-paper/75">
        New releases, early access, and the occasional offer. No noise.
      </p>

      {status === "success" ? (
        <p className="py-3 text-base font-semibold text-paper" role="status">
          You&apos;re on the list.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:flex-row">
          <label htmlFor="footer-signup-email" className="sr-only">
            Email address
          </label>
          <input
            id="footer-signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="min-h-[48px] w-full min-w-0 flex-1 rounded-full border border-paper/20 bg-[#1A1A1A] px-5 py-3.5 text-base text-paper placeholder:text-paper/50 focus:border-paper focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="min-h-[48px] shrink-0 rounded-full bg-red px-6 py-3.5 text-base font-bold text-paper transition-colors hover:bg-red-dark disabled:opacity-60"
          >
            {status === "loading" ? "Joining…" : "Join the list"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-sm text-red" role="alert">
          {errorMsg}
        </p>
      )}

      {status !== "success" && (
        <p className="text-[13px] leading-relaxed text-paper/60">
          By joining, you agree to receive GOOOL Athletics LLC marketing emails. Unsubscribe with one click from any email, or write to hello@goool.shop.
        </p>
      )}
    </div>
  );
}
