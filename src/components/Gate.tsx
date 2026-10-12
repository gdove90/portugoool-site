"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Strike } from "@/v84/Brand";
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
            <span className={styles.mark}><Strike /></span>
            <svg className={styles.wordmark} viewBox="0 0 427 104" role="img" aria-label="GOAL Athletics" focusable="false">
              <path d="M364,101 L365,103 L380,103 L383,101 L384,99 L384,96 L383,95 L372,95 L371,94 L371,92 L372,91 L381,91 L382,92 L385,92 L386,90 L385,89 L371,89 L368,91 L367,93 L367,96 L369,97 L379,97 L380,98 L380,100 L379,101 L369,101 L368,100 L365,100 Z M328,90 L325,94 L325,96 L324,97 L323,102 L324,103 L339,103 L341,101 L328,101 L327,100 L327,97 L328,96 L328,94 L331,91 L340,91 L341,92 L344,92 L345,90 L344,89 L330,89 Z M304,89 L301,89 L300,90 L299,95 L295,103 L299,103 L299,101 L301,98 L301,96 L302,95 L302,93 Z M262,103 L265,103 L267,100 L267,98 L268,97 L268,95 L269,94 L269,92 L270,91 L276,91 L277,89 L260,89 L259,91 L265,91 L266,92 L265,97 Z M219,89 L218,91 L218,93 L217,94 L217,96 L216,97 L216,99 L214,102 L215,103 L231,103 L232,101 L219,101 L218,100 L220,97 L232,97 L233,95 L222,95 L221,94 L221,92 L222,91 L235,91 L236,89 Z M180,89 L178,92 L178,94 L177,95 L177,97 L176,98 L175,103 L191,103 L192,101 L180,101 L179,100 L179,98 L181,95 L181,93 L183,89 Z M138,89 L137,90 L137,92 L136,93 L136,95 L135,96 L135,98 L134,99 L134,101 L133,103 L136,103 L136,101 L139,97 L149,97 L150,99 L148,103 L151,103 L153,99 L154,94 L156,91 L156,89 L153,89 L152,91 L152,93 L150,95 L140,95 L139,93 L141,89 Z M99,103 L103,103 L103,101 L104,100 L105,95 L108,91 L114,91 L115,89 L97,89 L96,91 L102,91 L103,92 L103,94 L102,95 L101,100 Z M74,90 L73,89 L65,89 L50,103 L54,103 L58,99 L66,99 L67,100 L67,103 L71,103 L71,99 L72,98 L72,95 L73,94 L73,92 Z M70,92 L70,94 L67,98 L62,98 L61,97 L61,96 L65,92 L67,91 L69,91 Z M349,1 L318,1 L318,3 L317,4 L316,9 L314,12 L313,11 L313,8 L314,7 L314,3 L315,1 L300,1 L299,2 L297,2 L295,4 L291,6 L288,9 L287,9 L284,12 L283,12 L279,16 L278,16 L275,19 L274,19 L270,23 L269,23 L266,26 L265,26 L261,30 L260,30 L257,33 L256,33 L252,37 L251,37 L248,40 L247,40 L244,43 L243,43 L239,47 L238,47 L235,50 L234,50 L231,53 L230,53 L227,56 L226,56 L215,65 L250,65 L252,64 L260,57 L261,57 L265,53 L266,53 L269,50 L270,50 L274,46 L275,46 L278,43 L279,43 L283,39 L284,39 L287,36 L288,36 L296,29 L297,29 L300,26 L301,26 L304,23 L305,23 L311,18 L312,20 L306,32 L306,34 L301,43 L301,45 L299,49 L298,50 L281,50 L285,55 L290,65 L320,65 L323,60 L323,58 L327,51 L327,49 L331,42 L331,40 L335,33 L335,31 L339,24 L339,22 L343,15 L343,13 Z M366,0 L362,7 L362,9 L355,22 L355,24 L349,35 L349,37 L343,49 L343,57 L345,61 L346,61 L348,63 L352,65 L426,65 L426,48 L378,48 L375,45 L374,43 L375,41 L375,39 L394,1 L367,1 Z M232,5 L230,3 L226,1 L217,1 L216,0 L210,0 L209,1 L190,1 L189,0 L172,0 L171,1 L157,1 L156,2 L153,2 L152,3 L150,3 L144,6 L142,8 L141,8 L133,16 L133,17 L131,19 L127,27 L127,29 L115,52 L115,60 L119,64 L121,64 L122,65 L190,65 L191,64 L194,64 L195,63 L197,63 L203,60 L208,56 L209,56 L216,49 L219,43 L219,41 L232,16 L232,14 L233,13 L233,7 Z M145,44 L146,42 L146,40 L154,24 L158,20 L162,18 L199,18 L202,21 L202,25 L200,28 L200,30 L198,34 L196,36 L193,43 L188,47 L186,47 L185,48 L149,48 L147,47 Z M125,1 L97,1 L96,0 L87,0 L86,1 L81,1 L80,0 L63,0 L61,1 L60,0 L59,1 L43,1 L42,2 L37,3 L27,8 L24,11 L23,11 L23,12 L18,18 L1,52 L1,54 L0,55 L0,59 L3,63 L5,64 L7,64 L8,65 L13,65 L14,66 L29,66 L30,65 L40,65 L41,66 L43,66 L44,65 L53,65 L54,66 L66,66 L67,65 L89,65 L90,66 L91,65 L94,65 L96,64 L100,56 L100,54 L111,33 L111,31 L112,29 L56,29 L57,29 L65,36 L66,36 L71,41 L72,41 L77,46 L76,48 L35,48 L32,45 L32,42 L41,24 L45,20 L49,18 L117,18 L121,11 L121,9 Z" fill="#FFFFFF" fillRule="evenodd" />
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
