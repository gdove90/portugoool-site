"use client";

export type PurchaseEvent = { id: string; value: number; currency: string };
type Pixel = ((...args: unknown[]) => void) & { queue?: unknown[][]; callMethod?: (...args: unknown[]) => void; loaded?: boolean; version?: string; push?: Pixel };
declare global { interface Window { fbq?: Pixel; _fbq?: Pixel } }
const CONSENT_KEY = "goool_marketing_consent_v1";
const rawId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
export const metaPixelId = /^\d{5,25}$/.test(rawId) ? rawId : "";
let initialized = false;
let pendingPurchase: PurchaseEvent | null = null;
const sent = new Set<string>();

export function marketingConsent(): "granted" | "denied" | null {
  if (typeof window === "undefined") return null;
  if ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return "denied";
  try {
    const stored = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "null");
    return stored && Date.now() - stored.at < 180 * 86400000 && ["granted", "denied"].includes(stored.choice) ? stored.choice : null;
  } catch { return null; }
}

function ready(): boolean {
  if (!metaPixelId || marketingConsent() !== "granted") return false;
  // Never load on pages containing order lookup/contact details or a Checkout token.
  if (/^\/(track-order|contact)(\/|$)/.test(location.pathname) || new URLSearchParams(location.search).has("session_id")) return false;
  if (!initialized) {
    const pixel: Pixel = function(...args: unknown[]) { if (pixel.callMethod) pixel.callMethod(...args); else pixel.queue!.push(args); };
    pixel.queue = []; pixel.push = pixel; pixel.loaded = true; pixel.version = "2.0";
    window.fbq = window._fbq = pixel;
    pixel("set", "autoConfig", false, metaPixelId);
    pixel("consent", "grant");
    pixel("init", metaPixelId);
    const script = document.createElement("script");
    script.async = true; script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.referrerPolicy = "origin";
    document.head.appendChild(script);
    initialized = true;
  }
  return true;
}

export function trackPageView(): void {
  if (!/^\/(success|track-order|contact)(\/|$)/.test(location.pathname) && ready()) window.fbq?.("trackSingle", metaPixelId, "PageView");
}

export function trackVerifiedPurchase(event: PurchaseEvent): void {
  if (!event || typeof event.id !== "string" || !/^purchase_[a-f0-9]{32}$/.test(event.id) || !Number.isFinite(event.value) || event.value < 0 || !/^[A-Z]{3}$/.test(event.currency)) return;
  pendingPurchase = event;
  if (!ready() || sent.has(event.id)) return;
  try { if (sessionStorage.getItem(event.id)) return; } catch { /* memory still deduplicates this page */ }
  window.fbq?.("trackSingle", metaPixelId, "Purchase", { value: event.value, currency: event.currency }, { eventID: event.id });
  sent.add(event.id);
  try { sessionStorage.setItem(event.id, "1"); } catch { /* optional storage */ }
}

export function setMarketingConsent(choice: "granted" | "denied"): void {
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, at: Date.now() })); } catch { return; }
  if (marketingConsent() !== "granted") {
    window.fbq?.("consent", "revoke");
    for (const name of ["_fbp", "_fbc"]) {
      document.cookie = `${name}=; Max-Age=0; path=/`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.goool.shop`;
    }
  } else {
    window.fbq?.("consent", "grant");
    trackPageView();
    if (pendingPurchase) trackVerifiedPurchase(pendingPurchase);
  }
  window.dispatchEvent(new Event("goool:marketing-consent"));
}
