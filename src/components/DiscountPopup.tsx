"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

// ─────────────────────────────────────────────────────────────
// GOOOL20 signup popup (owner decision, 2026-09-25).
//
// One component, two layouts from the approved designs in
// goool advertising/goool20 discount/goool-advertising/email-popup:
//   desktop  → 1a "split stadium": crowd image left, dark panel right
//   mobile   → 1e "bottom sheet": crowd image behind, dark sheet below
//
// The visitor's email goes to the same Mailchimp audience as the footer
// signup with the extra tag "goool20", then api/discount hands back that
// person's OWN single-use code (GOOOL20-XXXX, one per email, one
// redemption, src/lib/discount.ts) and it is shown on screen so the offer
// works before any welcome email lands. Stripe enforces the discount at
// checkout; Checkout has allow_promotion_codes on so the field is there.
// The header's "20% off" link reopens this popup via the goool20:open
// event, dismissal state notwithstanding.
//
// Show rules: once per visitor, after a short delay, never on the pages
// where it would get in the way of finishing an order. Dismissed →
// quiet for 30 days. Claimed → never again. Both live in localStorage,
// which can be blocked or cleared, so every read/write is guarded and
// the worst case is the popup appearing again.
// ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "goool20_popup";
const SHOW_DELAY_MS = 6000;
const DISMISS_DAYS = 30;
const QUIET_PATHS = ["/cart", "/success", "/gate", "/track-order", "/checkout"];

type Status = "idle" | "loading" | "done" | "error";

function readState(): { dismissedAt?: number; claimed?: boolean } | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeState(state: { dismissedAt?: number; claimed?: boolean }) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage blocked: the popup may show again, nothing else breaks */
  }
}

export default function DiscountPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("Something went wrong. Try again.");
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [doneMessage, setDoneMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const quiet = QUIET_PATHS.some((p) => pathname?.startsWith(p));

  useEffect(() => {
    if (quiet) return;
    const state = readState();
    if (state?.claimed) return;
    if (state?.dismissedAt && Date.now() - state.dismissedAt < DISMISS_DAYS * 86400000) return;
    const t = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [quiet]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("goool20:open", onOpen);
    return () => window.removeEventListener("goool20:open", onOpen);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    const state = readState() ?? {};
    writeState({ ...state, dismissedAt: Date.now() });
  }, []);

  // Escape closes; body scroll locks while open; focus lands on the field.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.clearTimeout(focusTimer);
    };
  }, [open, close]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setErrorMsg(body?.error ?? "Something went wrong. Try again.");
        throw new Error("signup failed");
      }
      setCode(body?.code ?? null);
      setDoneMessage(
        body?.redeemed
          ? "This email has already used its first-order code. Welcome back all the same."
          : body?.message ?? null
      );
      setStatus("done");
      writeState({ claimed: true });
      window.setTimeout(() => closeRef.current?.focus(), 50);
    } catch {
      setStatus("error");
    }
  }

  async function copyCode() {
    try {
      if (!code) return;
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the code is on screen to read */
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/70 sm:items-center sm:p-6"
      onClick={close}
      aria-hidden={false}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="goool20-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full overflow-hidden rounded-t-3xl border-t-2 border-red bg-ink text-paper shadow-2xl motion-safe:animate-[goool20-up_.35s_ease-out] sm:grid sm:max-w-4xl sm:grid-cols-2 sm:rounded-none sm:border-t-0 sm:animate-none"
      >
        {/* Crowd image: a band above the sheet on mobile, the left half on desktop. */}
        <div className="relative h-40 w-full sm:h-full sm:min-h-[560px]">
          <Image
            src="/hero-crowd.webp"
            alt=""
            fill
            sizes="(min-width: 640px) 448px, 100vw"
            className="object-cover object-[50%_35%]"
            priority
          />
          <div className="absolute inset-0 bg-red/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-ink/40" />
        </div>

        <div className="px-6 pb-8 pt-4 sm:px-12 sm:py-12">
          <div className="flex items-start justify-between">
            <Image
              src="/brand/goool-athletics-lockup-white.png"
              alt="GOOOL Athletics"
              width={140}
              height={44}
              className="h-auto w-32 sm:w-40"
            />
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="-mr-2 -mt-1 flex h-11 w-11 items-center justify-center rounded-full text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {status === "done" ? (
            <div role="status" className="mt-6">
              <h2 id="goool20-title" className="font-display text-4xl uppercase leading-none tracking-tightest sm:text-5xl">
                You&apos;re in.
                {code && (
                  <>
                    <br />
                    <span className="text-red">Here&apos;s your code.</span>
                  </>
                )}
              </h2>
              <p className="mt-4 text-paper/70">
                {code
                  ? "Yours alone, one use. Enter it in the promo code field at checkout for 20% off your first order."
                  : doneMessage ?? "You're on the list."}
              </p>
              {code && (
                <div className="mt-6 flex items-stretch gap-2">
                  <div className="flex flex-1 items-center justify-center border-2 border-dashed border-paper/40 px-4 py-3.5 font-display text-2xl tracking-[0.12em]">
                    {code}
                  </div>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="shrink-0 bg-red px-6 font-semibold text-paper transition-colors hover:bg-red-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              )}
              <a
                href="/shop"
                onClick={() => setOpen(false)}
                className="mt-6 inline-block font-semibold underline underline-offset-4"
              >
                Shop the Core Capsule →
              </a>
            </div>
          ) : (
            <>
              <h2 id="goool20-title" className="mt-6 font-display text-4xl uppercase leading-none tracking-tightest sm:text-6xl">
                20% off
                <br />
                <span className="text-red">your first order</span>
              </h2>
              <p className="mt-4 text-paper/70">
                Join the list for early access to every drop.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
                <label htmlFor="goool20-email" className="sr-only">
                  Email address
                </label>
                <input
                  ref={inputRef}
                  id="goool20-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full border border-paper/30 bg-paper/5 px-5 py-4 text-paper placeholder:text-paper/40 focus:border-gold focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-red py-4 font-display text-lg uppercase tracking-[0.18em] text-paper transition-colors hover:bg-red-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-60"
                >
                  {status === "loading" ? "One moment…" : "Unlock 20% off"}
                </button>
              </form>

              {status === "error" && (
                <p className="mt-3 text-sm text-red" role="alert">
                  {errorMsg}
                </p>
              )}

              <p className="mt-4 text-xs text-paper/50">
                One code per customer. By joining, you agree to receive GOOOL Athletics LLC marketing emails. Unsubscribe with one click from any email.
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-3 text-sm text-paper/50 underline underline-offset-4 hover:text-paper sm:hidden"
              >
                No thanks, I&apos;ll pay full price
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
