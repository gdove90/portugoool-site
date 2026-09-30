// The one event_id scheme for Meta, shared by the browser pixel and the
// Conversions API sender so a browser event and its server twin carry the
// same id and Meta deduplicates them (owner decision 2026-09-30).
//
//   event_id = <event name, lower case>_<first 32 hex of sha256(stable id)>
//
// Stable ids:
//   Purchase          the Stripe Checkout Session id
//   Lead              normalised email + ":" + the code that was issued
//   ViewContent       product slug + ":" + page-load millisecond
//   AddToCart         cart line key + ":" + click millisecond
//   InitiateCheckout  cart signature + ":" + click millisecond
//
// The browser-only events include a timestamp so repeat actions inside
// Meta's 48-hour dedupe window are not collapsed; the two events that
// also go server-side (Purchase, Lead) use ids both sides can rebuild.
//
// Isomorphic on purpose: only globalThis.crypto.subtle, which exists in
// browsers and in Node 18+, so this file is imported from client and
// server code alike.

export type MetaEventName = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Lead" | "Purchase";

export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function metaEventId(name: MetaEventName, stableId: string): Promise<string> {
  return `${name.toLowerCase()}_${(await sha256Hex(stableId)).slice(0, 32)}`;
}

/** Same normalisation the discount ledger uses for its email hash: lower case, trimmed. */
export function normaliseEmailForMeta(email: string): string {
  return email.trim().toLowerCase();
}

/** Stable id for a Lead: the address and the code it produced. */
export function leadStableId(email: string, code: string): string {
  return `${normaliseEmailForMeta(email)}:${code.trim().toUpperCase()}`;
}
