"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { marketingConsent, metaPixelId, setMarketingConsent, trackPageView } from "@/lib/meta-pixel";

export default function MarketingConsent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [anotherDialog, setAnotherDialog] = useState(false);
  useEffect(() => {
    if (!metaPixelId) return;
    trackPageView();
    const timer = window.setTimeout(() => setOpen(marketingConsent() === null), 12000);
    return () => window.clearTimeout(timer);
  }, [pathname]);
  useEffect(() => {
    if (!metaPixelId) return;
    const checkDialog = () => setAnotherDialog(Boolean(document.querySelector('[aria-modal="true"]')));
    const observer = new MutationObserver(checkDialog);
    observer.observe(document.body, { subtree: true, childList: true });
    checkDialog();
    const openSettings = () => setOpen(true);
    window.addEventListener("goool:cookie-settings", openSettings);
    return () => { observer.disconnect(); window.removeEventListener("goool:cookie-settings", openSettings); };
  }, []);
  if (!metaPixelId || !open || anotherDialog || pathname?.startsWith("/cart")) return null;
  return <section aria-label="Advertising cookie choices" className="fixed bottom-4 left-4 right-4 z-40 max-w-sm rounded-xl border border-paper/20 bg-ink p-5 text-paper shadow-xl sm:right-auto">
    <p className="text-sm leading-relaxed">Allow optional advertising cookies to help us measure our Instagram and Facebook ads? Shopping works either way. <a href="/privacy" className="underline">Privacy policy</a></p>
    <div className="mt-4 flex gap-3">
      <button type="button" className="flex-1 rounded-full border border-paper px-4 py-2 text-sm" onClick={() => { setMarketingConsent("denied"); setOpen(false); }}>Decline</button>
      <button type="button" className="flex-1 rounded-full border border-paper px-4 py-2 text-sm" onClick={() => { setMarketingConsent("granted"); setOpen(false); }}>Allow</button>
    </div>
  </section>;
}

export function CookieSettingsButton() {
  if (!metaPixelId) return null;
  return <button type="button" className="text-paper/50 hover:text-paper" onClick={() => window.dispatchEvent(new Event("goool:cookie-settings"))}>Cookie settings</button>;
}
