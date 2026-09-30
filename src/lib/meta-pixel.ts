"use client";

// Meta Pixel: one loader, one helper per standard event (owner decision
// 2026-09-30, replacing the 2026-09-29 PageView-and-Purchase version).
//
// Consent, in order of precedence:
//   1. Global Privacy Control on the browser: denied, everywhere, no prompt.
//   2. A stored choice (localStorage, 180 days): respected on every page.
//   3. No choice yet: US visitors are allowed by default and see a banner
//      with an opt-out; everyone else is denied until they click Allow.
//      The region comes from the goool_geo cookie the middleware sets
//      from Netlify's geolocation; unknown counts as outside the US.
//
// The pixel never loads on pages that carry personal details in the
// URL or body (track-order, contact, a Checkout token in the query).
//
// Every event goes out with an eventID from meta-events.ts, the scheme the
// Conversions API sender shares, so Purchase and Lead deduplicate against
// their server twins. Advanced matching: once an email is known (sign-up,
// verified purchase) the pixel is re-initialised with it; Meta hashes it
// client-side before it leaves the page.

import { metaEventId, leadStableId, type MetaEventName } from "./meta-events";

export type PurchaseEvent = {
  id: string;
  value: number;
  currency: string;
  content_ids?: string[];
  num_items?: number;
  order_id?: string;
};
type Pixel = ((...args: unknown[]) => void) & { queue?: unknown[][]; callMethod?: (...args: unknown[]) => void; loaded?: boolean; version?: string; push?: Pixel };
declare global { interface Window { fbq?: Pixel; _fbq?: Pixel } }

const CONSENT_KEY = "goool_marketing_consent_v1";
const KNOWN_EMAIL_KEY = "goool_meta_em";
const GEO_COOKIE = "goool_geo";
const rawId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
export const metaPixelId = /^\d{5,25}$/.test(rawId) ? rawId : "";

let initialized = false;
let pendingPurchase: PurchaseEvent | null = null;
const sent = new Set<string>();

export type ConsentChoice = "granted" | "denied";

export function globalPrivacyControl(): boolean {
  return typeof navigator !== "undefined" && Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);
}

/** Two-letter country from the middleware cookie, or null when unknown. */
export function visitorRegion(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )goool_geo=([A-Z]{2}|XX)/);
  return m && m[1] !== "XX" ? m[1] : null;
}

export function isUsVisitor(): boolean {
  return visitorRegion() === "US";
}

/** The stored choice only; null when the visitor has not decided. */
export function storedConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "null");
    return stored && Date.now() - stored.at < 180 * 86400000 && ["granted", "denied"].includes(stored.choice) ? stored.choice : null;
  } catch { return null; }
}

/** What applies right now: GPC, then the stored choice, then the regional default. */
export function marketingConsent(): ConsentChoice {
  if (typeof window === "undefined") return "denied";
  if (globalPrivacyControl()) return "denied";
  const stored = storedConsent();
  if (stored) return stored;
  return isUsVisitor() ? "granted" : "denied";
}

/** Whether the banner should be showing: no GPC and no stored choice. */
export function consentUndecided(): boolean {
  return typeof window !== "undefined" && !globalPrivacyControl() && storedConsent() === null;
}

function knownEmail(): string | null {
  try { return sessionStorage.getItem(KNOWN_EMAIL_KEY); } catch { return null; }
}

function matchData(): Record<string, string> {
  const em = knownEmail();
  return em ? { em } : {};
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
    pixel("init", metaPixelId, matchData());
    const script = document.createElement("script");
    script.async = true; script.src = "https://connect.facebook.net/en_US/fbevents.js";
    script.referrerPolicy = "origin";
    document.head.appendChild(script);
    initialized = true;
  }
  return true;
}

async function fire(name: MetaEventName, stableId: string, params: Record<string, unknown>): Promise<void> {
  if (!ready()) return;
  const eventID = await metaEventId(name, stableId);
  window.fbq?.("trackSingle", metaPixelId, name, params, { eventID });
}

export function trackPageView(): void {
  if (!/^\/(success|track-order|contact)(\/|$)/.test(location.pathname) && ready()) window.fbq?.("trackSingle", metaPixelId, "PageView");
}

export function trackViewContent(p: { slug: string; name: string; value: number; currency: string }): void {
  void fire("ViewContent", `${p.slug}:${Date.now()}`, {
    content_ids: [p.slug], content_type: "product", content_name: p.name, value: p.value, currency: p.currency,
  });
}

export function trackAddToCart(p: { slug: string; name: string; value: number; currency: string; quantity: number; lineKey: string }): void {
  void fire("AddToCart", `${p.lineKey}:${Date.now()}`, {
    content_ids: [p.slug], content_type: "product", content_name: p.name, value: p.value, currency: p.currency, num_items: p.quantity,
  });
}

export function trackInitiateCheckout(p: { slugs: string[]; value: number; currency: string; numItems: number }): void {
  void fire("InitiateCheckout", `${p.slugs.join(",")}:${p.numItems}:${Date.now()}`, {
    content_ids: p.slugs, content_type: "product", value: p.value, currency: p.currency, num_items: p.numItems,
  });
}

/** After a successful sign-up: remember the address for matching, then Lead with the shared id. */
export function trackLead(p: { email: string; code: string }): void {
  setKnownEmail(p.email);
  void fire("Lead", leadStableId(p.email, p.code), { content_name: "GOOOL20 sign-up" });
}

export function trackVerifiedPurchase(event: PurchaseEvent): void {
  if (!event || typeof event.id !== "string" || !/^purchase_[a-f0-9]{32}$/.test(event.id) || !Number.isFinite(event.value) || event.value < 0 || !/^[A-Z]{3}$/.test(event.currency)) return;
  pendingPurchase = event;
  if (!ready() || sent.has(event.id)) return;
  try { if (sessionStorage.getItem(event.id)) return; } catch { /* memory still deduplicates this page */ }
  window.fbq?.("trackSingle", metaPixelId, "Purchase", {
    value: event.value,
    currency: event.currency,
    ...(event.content_ids ? { content_ids: event.content_ids, content_type: "product" } : {}),
    ...(event.num_items != null ? { num_items: event.num_items } : {}),
    ...(event.order_id ? { order_id: event.order_id } : {}),
  }, { eventID: event.id });
  sent.add(event.id);
  try { sessionStorage.setItem(event.id, "1"); } catch { /* optional storage */ }
}

/** Advanced matching: keep the address for this tab and re-init the pixel with it. */
export function setKnownEmail(email: string): void {
  const em = email.trim().toLowerCase();
  if (!em) return;
  try { sessionStorage.setItem(KNOWN_EMAIL_KEY, em); } catch { /* optional storage */ }
  if (initialized && marketingConsent() === "granted") window.fbq?.("init", metaPixelId, { em });
}

/** The value the cart and the sign-up post to the server, so server events honour the same choice. */
export function consentForServer(): ConsentChoice {
  return marketingConsent();
}

export function setMarketingConsent(choice: ConsentChoice): void {
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
