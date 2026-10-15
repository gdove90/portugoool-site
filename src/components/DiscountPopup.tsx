"use client";

import { InterfaceIcon } from "@/v84/InterfaceIcon";
import Link from "next/link";

import { consentForServer, setKnownEmail, trackLead } from "@/lib/meta-pixel";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "./discount-popup.css";

// Retain the existing signup API, legacy persistence key and opener event.
// The preview prop displays the real component only in isolated design previews.

const STORAGE_KEY = "goool20_popup";
const SHOW_DELAY_MS = 6000;
const DISMISS_DAYS = 30;
const QUIET_PATHS = ["/shop", "/men", "/women", "/cart", "/success", "/gate", "/track-order", "/checkout", "/admin", "/kit-wear", "/share-your-goals", "/whats-your-goool"];
const AUTO_PATHS = ["/", "/about"];

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

export default function DiscountPopup({ review = false }: { review?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const closingRef = useRef(false);
  const swipeMoved = useRef(false);
  const closeTimer = useRef<number | null>(null);
  const swipe = useRef<{ id: number; x: number; y: number; at: number } | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("Something went wrong. Try again.");
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [doneMessage, setDoneMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const requestOpen = useCallback((automatic = false) => {
    if (dialogRef.current?.open) return;
    const path = window.location.pathname;
    if (QUIET_PATHS.some(p => path === p || path.startsWith(p + "/"))) return;
    if (automatic && !AUTO_PATHS.includes(path)) return;
    // Skip a busy visit instead of surprising the shopper after a dialog closes.
    if (document.querySelector('dialog[open], [role="dialog"][aria-modal="true"], [data-goool-consent]')) return;
    if (automatic && document.activeElement?.matches?.('input,textarea,select,[contenteditable="true"]')) return;
    closingRef.current = false;
    setClosing(false);
    setDragOffset(0);
    setOpen(true);
  }, []);

  const quiet = QUIET_PATHS.some((p) => pathname === p || pathname?.startsWith(p + "/"));

  useEffect(() => {
    if (quiet) {
      setOpen(false);
      return;
    }
    if (review) { requestOpen(); return; }
    if (!AUTO_PATHS.includes(pathname)) return;
    const state = readState();
    if (state?.claimed) return;
    if (state?.dismissedAt && Date.now() - state.dismissedAt < DISMISS_DAYS * 86400000) return;
    const t = window.setTimeout(() => requestOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [pathname, quiet, requestOpen, review]);

  useEffect(() => {
    const onOpen = () => requestOpen();
    window.addEventListener("goool20:open", onOpen);
    return () => window.removeEventListener("goool20:open", onOpen);
  }, [requestOpen]);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => setOpen(false), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180);
    const state = readState() ?? {};
    writeState({ ...state, dismissedAt: Date.now() });
  }, []);

  // Native modal makes the page inert; restore focus and scroll on every close.
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    dialog?.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      (window.matchMedia("(max-width: 639px)").matches ? closeRef : inputRef).current?.focus({ preventScroll: true });
    }, 50);
    const viewport = window.visualViewport;
    const size = () => {
      dialog?.style.setProperty("--goal-viewport-height", viewport ? viewport.height + "px" : "100dvh");
      dialog?.style.setProperty("--goal-viewport-top", viewport ? viewport.offsetTop + "px" : "0px");
    };
    size(); viewport?.addEventListener("resize", size); viewport?.addEventListener("scroll", size);
    return () => {
      window.clearTimeout(focusTimer);
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
      viewport?.removeEventListener("resize", size); viewport?.removeEventListener("scroll", size);
      dialog?.close(); document.body.style.overflow = prev;
      previousFocus?.isConnected && previousFocus.focus({ preventScroll: true });
    };
  }, [open]);

  function startSwipe(event: React.PointerEvent<HTMLElement>) {
    if (!window.matchMedia("(max-width: 639px)").matches || !event.isPrimary || event.button !== 0) return;
    swipeMoved.current = false;
    swipe.current = { id: event.pointerId, x: event.clientX, y: event.clientY, at: performance.now() };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveSwipe(event: React.PointerEvent<HTMLElement>) {
    const start = swipe.current;
    if (!start || start.id !== event.pointerId) return;
    if (Math.abs(event.clientY - start.y) + Math.abs(event.clientX - start.x) > 6) swipeMoved.current = true;
    const down = Math.max(0, event.clientY - start.y);
    if (down > Math.abs(event.clientX - start.x)) setDragOffset(down);
  }
  function endSwipe(event: React.PointerEvent<HTMLElement>) {
    const start = swipe.current; swipe.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!start) return;
    const down = event.clientY - start.y;
    const horizontal = Math.abs(event.clientX - start.x);
    const velocity = down / Math.max(1, performance.now() - start.at);
    if (down > horizontal && (down >= 72 || (down >= 24 && velocity > 0.5))) close();
    else setDragOffset(0);
  }
  function trapFocus(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href]')].filter(element => element.getClientRects().length > 0);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: consentForServer() }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || body?.ok !== true) {
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
      if (body?.code) trackLead({ email, code: body.code }); else setKnownEmail(email);
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
    <dialog ref={dialogRef} className={"goal-discount" + (closing ? " is-closing" : "")}
      aria-modal="true" aria-labelledby="goal-discount-title" aria-describedby="goal-discount-description"
      onKeyDown={trapFocus} onCancel={event => { event.preventDefault(); close(); }}
      onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className={"goal-discount-surface" + (dragOffset > 0 ? " is-dragging" : "")}
        style={{ transform: dragOffset > 0 ? "translateY(" + dragOffset + "px)" : undefined }}>
        <button ref={closeRef} type="button" onClick={close} className="goal-discount-close" aria-label="Close discount offer">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
      <section className="goal-discount-card">
        <button type="button" className="goal-discount-handle" aria-label="Dismiss offer"
          onClick={() => { if (!swipeMoved.current) close(); }} onPointerDown={startSwipe} onPointerMove={moveSwipe} onPointerUp={endSwipe}
          onPointerCancel={() => { swipe.current = null; setDragOffset(0); }}><span /></button>
        <div className="goal-discount-logo">
          <Image src="/brand/goal-athletics-popup-white.png" alt="GOAL Athletics" width={4800} height={1314} sizes="(max-width:639px) 190px, 320px" priority />
        </div>
        {status === "done" ? <div className="goal-discount-success" role="status">
          <h2 id="goal-discount-title" className="goal-discount-tone">YOU’RE IN.</h2>
          <p id="goal-discount-description" className="goal-discount-tone">{code ? "Your first-order code is ready. Enter it at checkout for 20% off." : doneMessage ?? "You're on the list."}</p>
          {code && <div className="goal-discount-code"><output aria-label="Your discount code">{code}</output><button type="button" onClick={copyCode}>{copied ? "Copied" : "Copy"}</button></div>}
          <Link href="/shop" onClick={close} className="goal-discount-shop">Explore the collection</Link>
        </div> : <>
          <h2 id="goal-discount-title"><span className="goal-discount-get">GET </span><span className="goal-discount-accent">20%</span><span className="goal-discount-off"> OFF</span><br /><span className="goal-discount-tone goal-discount-title-second">YOUR FIRST ORDER</span></h2>
          <p id="goal-discount-description" className="goal-discount-tone goal-discount-description">Join the GOAL Athletics list for early access, product drops, and your first-order code.</p>
          <form onSubmit={handleSubmit} className="goal-discount-form" aria-busy={status === "loading"}>
            <label htmlFor="goal-discount-email" className="sr-only">Email address</label>
            <input ref={inputRef} id="goal-discount-email" type="email" required autoComplete="email" inputMode="email"
              aria-invalid={status === "error"} aria-describedby={status === "error" ? "goal-discount-error" : undefined}
              value={email} onChange={event => setEmail(event.target.value)} placeholder="Email address" disabled={status === "loading"} />
            <button type="submit" className="goal-discount-submit" disabled={status === "loading"}>{status === "loading" ? "One moment…" : "UNLOCK 20%"}</button>
            {status === "error" && <p id="goal-discount-error" className="goal-discount-error" role="alert">{errorMsg}</p>}
          </form>
          <p className="goal-discount-tone goal-discount-consent">By signing up, you agree to receive marketing emails. Unsubscribe anytime.</p>
          <button type="button" onClick={close} className="goal-discount-dismiss">No thanks</button>
          <Link href="/privacy" className="goal-discount-privacy">Privacy policy</Link>
        </>}
      </section>
      </div>
    </dialog>
  );
}
