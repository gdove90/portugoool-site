"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./Gate.module.css";

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
      const result = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(result.error || "Please try again.");
      setNotifyState("done");
      setNotifyMessage("You're on the list. We'll email you when the doors reopen.");
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
            {/* Exact V1.2 polygons, with a tight viewport so visible height matches both words. */}
            <svg className={styles.mark} data-strike-version="1.2" viewBox="0 0 890.161617719 400" aria-hidden="true" focusable="false">
              <polygon points="0,400 360.161617719,0 550.161617719,0 190,400" />
              <polygon points="340,400 700.161617719,0 890.161617719,0 530,400" />
            </svg>
            {/* Website proof: GOAL trace stair steps simplified within 1.05 source units; ATHLETICS unchanged. */}
            <svg className={styles.wordmark} viewBox="0 0 427 103" role="img" aria-label="GOAL Athletics" focusable="false">
              <path d="M364,101 L365,103 L380,103 L383,101 L384,99 L384,96 L383,95 L372,95 L371,94 L371,92 L372,91 L381,91 L382,92 L385,92 L386,90 L385,89 L371,89 L368,91 L367,93 L367,96 L369,97 L379,97 L380,98 L380,100 L379,101 L369,101 L368,100 L365,100 Z M328,90 L325,94 L325,96 L324,97 L323,102 L324,103 L339,103 L341,101 L328,101 L327,100 L327,97 L328,96 L328,94 L331,91 L340,91 L341,92 L344,92 L345,90 L344,89 L330,89 Z M304,89 L301,89 L300,90 L299,95 L295,103 L299,103 L299,101 L301,98 L301,96 L302,95 L302,93 Z M262,103 L265,103 L267,100 L267,98 L268,97 L268,95 L269,94 L269,92 L270,91 L276,91 L277,89 L260,89 L259,91 L265,91 L266,92 L265,97 Z M219,89 L218,91 L218,93 L217,94 L217,96 L216,97 L216,99 L214,102 L215,103 L231,103 L232,101 L219,101 L218,100 L220,97 L232,97 L233,95 L222,95 L221,94 L221,92 L222,91 L235,91 L236,89 Z M180,89 L178,92 L178,94 L177,95 L177,97 L176,98 L175,103 L191,103 L192,101 L180,101 L179,100 L179,98 L181,95 L181,93 L183,89 Z M138,89 L137,90 L137,92 L136,93 L136,95 L135,96 L135,98 L134,99 L134,101 L133,103 L136,103 L136,101 L139,97 L149,97 L150,99 L148,103 L151,103 L153,99 L154,94 L156,91 L156,89 L153,89 L152,91 L152,93 L150,95 L140,95 L139,93 L141,89 Z M99,103 L103,103 L103,101 L104,100 L105,95 L108,91 L114,91 L115,89 L97,89 L96,91 L102,91 L103,92 L103,94 L102,95 L101,100 Z M74,90 L73,89 L65,89 L50,103 L54,103 L58,99 L66,99 L67,100 L67,103 L71,103 L71,99 L72,98 L72,95 L73,94 L73,92 Z M70,92 L70,94 L67,98 L62,98 L61,97 L61,96 L65,92 L67,91 L69,91 Z M349,1 L318,1 L314,12 L313,8 L315,1 L297,2 L215,65 L250,65 L311,18 L312,20 L299,49 L281,50 L290,65 L320,65 Z M366,0 L343,49 L343,57 L345,61 L352,65 L426,65 L426,48 L378,48 L375,45 L375,39 L394,1 Z M232,5 L226,1 L216,0 L157,1 L144,6 L131,19 L115,52 L115,60 L122,65 L190,65 L197,63 L209,56 L216,49 L233,13 Z M145,44 L154,24 L162,18 L199,18 L202,21 L200,30 L193,43 L185,48 L149,48 Z M125,1 L96,0 L43,1 L27,8 L18,18 L0,55 L0,59 L5,64 L14,66 L90,66 L96,64 L112,29 L56,29 L72,41 L77,46 L76,48 L35,48 L32,45 L32,42 L41,24 L49,18 L117,18 Z" fill="#FFFFFF" fillRule="evenodd" />
            </svg>
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
              <p className={styles.panelCopy}>The full store stays open to the GOOOL team while the redesign is underway.</p>
              <div className={`${styles.panelRow} ${rejected ? styles.rowRejected : ""}`}>
                <label htmlFor="gate-password" className="sr-only">Password</label>
                <input
                  ref={passwordRef}
                  id="gate-password"
                  type="password"
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
              By joining, you agree to receive GOOOL Athletics LLC marketing emails. Unsubscribe with one click from any email, or write to hello@goool.shop.
            </p>
          </form>

          <p className={`${styles.order} ${styles.reveal} ${styles.d4}`}>
            Placed an order? <Link href="/track-order">Track it here</Link>.
          </p>
        </section>

        <footer className={styles.foot}>
          <span>&copy; 2026 GOOOL Athletics LLC</span>
          <nav aria-label="Renovation page links">
            <a href="https://www.instagram.com/gooolathletics/" rel="noopener">Instagram</a>
            <span aria-hidden="true">·</span>
            <Link href="/track-order">Track an order</Link>
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
