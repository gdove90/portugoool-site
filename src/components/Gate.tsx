"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./Gate.module.css";
import BrandLockup from "./WebBrandLockup";

// "Closed for renovation" (owner decision 2026-10-12): every piece is being
// redesigned, so the public sees this page while the team keeps the full
// store behind a password. Approved mock-up and screenshots:
// designs/renovation-page-2026-10-12/.
//
// Visual language is the live v84 site, unchanged: Barlow Condensed 600
// display, Inter body, ink/paper, the V1.2 strike. No old wordmark artwork.
//
// The password check is real. It is validated server-side in /api/preview
// against PREVIEW_KEY and never reaches the client bundle. The email form
// posts to the same /api/newsletter the site footer uses, with the same
// consent line.
//
// Fixed overlay at z-index 35: above the site header (30) so the shop nav
// and bag are not offered while the store is closed, and below the
// advertising-consent banner (40) so that notice still shows.

const BIG_STRIKE = (
  <svg className={styles.bgStrike} viewBox="0 0 890.161617719 400" aria-hidden="true" focusable="false">
    <polygon className={styles.barA} points="0,400 360.161617719,0 550.161617719,0 190,400" />
    <polygon className={styles.barB} points="340,400 700.161617719,0 890.161617719,0 530,400" />
  </svg>
);

export default function Gate({ next }: { next: string }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [gateState, setGateState] = useState<"idle" | "checking" | "wrong" | "error">("idle");
  const [email, setEmail] = useState("");
  const [notifyState, setNotifyState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [notifyMessage, setNotifyMessage] = useState("");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!panelOpen) return;
    passwordRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPanelOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!panelRef.current?.contains(target) && !toggleRef.current?.contains(target)) setPanelOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [panelOpen]);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (gateState === "checking" || !password) return;
    setGateState("checking");
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        // Full navigation, not a router push: the cookie the server just set
        // has to be on the next request for middleware to let it through.
        window.location.href = next;
        return;
      }
      setGateState(res.status === 401 ? "wrong" : "error");
    } catch {
      setGateState("error");
    }
  }

  async function notify(e: React.FormEvent) {
    e.preventDefault();
    if (notifyState === "sending") return;
    setNotifyState("sending");
    setNotifyMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!res.ok) throw new Error(result.error || "Please try again.");
      setNotifyState("done");
      setNotifyMessage(result.message || "Welcome to GOAL! Check your inbox for your welcome email and code.");
      setEmail("");
    } catch (error) {
      setNotifyState("error");
      setNotifyMessage(error instanceof Error ? error.message : "Please try again.");
    }
  }

  const rejected = gateState === "wrong" || gateState === "error";

  return (
    <div className={styles.overlay}>
      <div className={styles.stage}>
        {BIG_STRIKE}

        <header className={styles.top}>
          <span className={styles.brand}>
            <BrandLockup />
          </span>

          <button
            ref={toggleRef}
            className={styles.access}
            type="button"
            aria-label="Team access"
            aria-expanded={panelOpen}
            aria-controls="team-access-panel"
            onClick={() => setPanelOpen((open) => !open)}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="2.75" y="7" width="10.5" height="7.25" rx="1" />
              <path d="M5.25 7V5a2.75 2.75 0 0 1 5.5 0v2" />
            </svg>
            <span className={styles.accessLabelFull}>Team access</span>
            <span className={styles.accessLabelCompact} aria-hidden="true">Team</span>
          </button>

          <div ref={panelRef} id="team-access-panel" className={styles.panel} hidden={!panelOpen}>
            <form onSubmit={unlock} noValidate>
              <p className={styles.panelTitle}>Team access</p>
              <p className={styles.panelCopy}>The full store stays open to the GOAL team while the redesign is underway.</p>
              <div className={`${styles.panelRow} ${rejected ? styles.rowRejected : ""}`}>
                <label htmlFor="gate-password" className="sr-only">Password</label>
                <input
                  ref={passwordRef}
                  id="gate-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (rejected) setGateState("idle");
                  }}
                  aria-invalid={rejected}
                  aria-describedby={rejected ? "gate-error" : undefined}
                />
                <button
                  className={styles.peek}
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  aria-controls="gate-password"
                  onClick={() => setShowPassword((shown) => !shown)}
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M1.25 8S3.75 3.25 8 3.25 14.75 8 14.75 8 12.25 12.75 8 12.75 1.25 8 1.25 8Z" />
                    <circle cx="8" cy="8" r="2.25" />
                    {showPassword && <path d="M2.5 13.5 13.5 2.5" />}
                  </svg>
                </button>
                <button className={styles.btn} type="submit" disabled={gateState === "checking"}>
                  {gateState === "checking" ? "Checking" : "Enter"}
                </button>
              </div>
              {rejected && (
                <p id="gate-error" role="alert" className={styles.panelError}>
                  {gateState === "wrong"
                    ? "That password is not right. Check it and try again."
                    : "Something went wrong. Try again in a moment."}
                </p>
              )}
            </form>
          </div>
        </header>

        <section className={styles.content} aria-labelledby="renovation-title">
          <p className={`${styles.status} ${styles.reveal}`}>
            <span className={styles.dot} aria-hidden="true" />
            Closed for renovation
          </p>
          <h1 id="renovation-title" className={`${styles.title} ${styles.reveal} ${styles.d2}`}>
            Rebuilding<br />every piece.
          </h1>
          <p className={`${styles.lead} ${styles.reveal} ${styles.d3}`}>
            We are redesigning the full collection from the ground up. New artwork, cleaner lines, the same feeling on and off the pitch. The store reopens soon.
          </p>

          <form className={`${styles.notify} ${styles.reveal} ${styles.d4}`} onSubmit={notify} noValidate>
            <label className={styles.notifyLabel} htmlFor="gate-notify-email">Be first through the doors</label>
            <p className={styles.fine}>Join for a welcome email, 20% off your first order, and reopening news. Codes are valid for 14 days from signup.</p>
            <div className={styles.field}>
              <input
                id="gate-notify-email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                inputMode="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-describedby="gate-notify-status gate-notify-fine"
              />
              <button className={styles.btn} type="submit" disabled={notifyState === "sending"}>
                {notifyState === "sending" ? "Joining" : "Notify me"}
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" /></svg>
              </button>
            </div>
            <p id="gate-notify-status" role="status" className={`${styles.notifyMsg} ${notifyState === "error" ? styles.notifyErr : ""}`}>
              {notifyMessage}
            </p>
            <p id="gate-notify-fine" className={styles.fine}>
              By joining, you agree to receive GOAL Athletics welcome, collection, and offer emails. Unsubscribe anytime. <a href="mailto:support@goalathletics.shop">Contact Support</a>. <a href="/privacy">Privacy</a>.
            </p>
          </form>

          <p className={`${styles.order} ${styles.reveal} ${styles.d4}`}>
            Placed an order? <Link href="/track-order">Track it here</Link>.
          </p>
        </section>

        <footer className={styles.foot}>
          <span>&copy; 2026 The Goal Brand Group LLC</span>
          <nav aria-label="Renovation page links">
            <Link href="/women">Tempo / Women</Link>
            <span aria-hidden="true">·</span>
            <Link href="/track-order">Track an order</Link>
            <span aria-hidden="true">·</span>
            <Link href="/contact">Contact &amp; support</Link>
            <span aria-hidden="true">·</span>
            <Link href="/privacy">Privacy</Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms">Terms</Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}
