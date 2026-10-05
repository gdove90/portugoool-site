"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  consentUndecided,
  globalPrivacyControl,
  isUsVisitor,
  metaPixelId,
  setMarketingConsent,
  trackPageView,
} from "@/lib/meta-pixel";

// Advertising-cookie banner (owner decision 2026-09-30). Shows on first
// paint, on every page including the cart, until the visitor decides.
// US visitors are allowed by default, so their banner is an opt-out;
// everyone else is denied until Allow. Global Privacy Control means no
// banner at all. The footer's "Opt out of tracking" link reopens it.

export default function MarketingConsent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [anotherDialog, setAnotherDialog] = useState(false);

  useEffect(() => {
    if (!metaPixelId) return;
    document.documentElement.dataset.gooolRegion = isUsVisitor() ? "US" : "XX";
    trackPageView();
    const undecided = consentUndecided();
    document.documentElement.dataset.gooolPrompt = String(undecided);
    setOpen(undecided);
  }, [pathname]);

  useEffect(() => {
    if (!metaPixelId) return;
    const checkDialog = () => setAnotherDialog(Boolean(document.querySelector('[aria-modal="true"],dialog[open]')));
    const observer = new MutationObserver(checkDialog);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["open"] });
    checkDialog();
    const openSettings = () => { if (!globalPrivacyControl()) { document.documentElement.dataset.gooolPrompt = "true"; setOpen(true); } };
    window.addEventListener("goool:cookie-settings", openSettings);
    return () => { observer.disconnect(); window.removeEventListener("goool:cookie-settings", openSettings); };
  }, []);

  if (!metaPixelId || !open || anotherDialog) return null;

  const decide = (choice: "granted" | "denied") => { setMarketingConsent(choice); setOpen(false); };

  return (
    <section data-goool-consent aria-label="Advertising cookie choices" className="fixed bottom-4 left-4 right-4 z-40 max-w-sm rounded-xl border border-paper/20 bg-ink p-5 text-paper shadow-xl sm:right-auto">
      <div data-goool-us>
          <p className="text-sm leading-relaxed">We use advertising cookies to measure our Instagram and Facebook ads. They are on now; you can opt out any time. <a href="/privacy" className="underline">Privacy policy</a></p>
          <div className="mt-4 flex gap-3">
            <button type="button" className="flex-1 rounded-full border border-paper px-4 py-2 text-sm" onClick={() => decide("denied")}>Opt out</button>
            <button type="button" className="flex-1 rounded-full border border-paper bg-paper px-4 py-2 text-sm text-ink" onClick={() => decide("granted")}>OK</button>
          </div>
      </div>
      <div data-goool-nonus>
          <p className="text-sm leading-relaxed">Allow optional advertising cookies to help us measure our Instagram and Facebook ads? Shopping works either way. <a href="/privacy" className="underline">Privacy policy</a></p>
          <div className="mt-4 flex gap-3">
            <button type="button" className="flex-1 rounded-full border border-paper px-4 py-2 text-sm" onClick={() => decide("denied")}>Decline</button>
            <button type="button" className="flex-1 rounded-full border border-paper bg-paper px-4 py-2 text-sm text-ink" onClick={() => decide("granted")}>Allow</button>
          </div>
      </div>
    </section>
  );
}

export function CookieSettingsButton() {
  if (!metaPixelId) return null;
  return <button type="button" className="text-paper/50 hover:text-paper" onClick={() => window.dispatchEvent(new Event("goool:cookie-settings"))}>Opt out of tracking</button>;
}
