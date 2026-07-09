"use client";

import { useEffect, useState } from "react";

// Announcement bar — website-bible §4.0.
// One time-sensitive message, never rotates. Dismissal remembered per session.
const MESSAGE = "The England Drop · ENGOOOLAND · Live now.";
const STORAGE_KEY = "portugooool-announcement-dismissed";

export default function AnnouncementBar() {
  // Render by default (server-side too) so first paint includes the bar —
  // no layout shift for the common case. Hide after mount only for
  // visitors who dismissed it this session.
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY) === "1") {
        setVisible(false);
      }
    } catch {
      // Storage unavailable — leave the bar up.
    }
  }, []);

  if (!visible) return null;

  function dismiss() {
    setVisible(false);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Session-only dismissal; losing it is harmless.
    }
  }

  return (
    <div className="relative flex h-10 items-center justify-center bg-red px-10 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-paper">
        {MESSAGE}
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
