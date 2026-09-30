// Meta Conversions API, server side (owner decision 2026-09-30).
//
// One sender. Called from the Stripe webhook (Purchase) and the sign-up
// route (Lead). Each server event carries the same event_id its browser
// twin used (see meta-events.ts), so Meta deduplicates the pair. Sends
// only when the visitor's consent, captured at the moment of the action,
// is not "denied". Never throws and never blocks the caller: a failure
// is logged and the order or sign-up proceeds.
//
// Env (Netlify): NEXT_PUBLIC_META_PIXEL_ID, META_CAPI_ACCESS_TOKEN and,
// for verification runs only, META_TEST_EVENT_CODE so the events show in
// the Test Events tool. Test-mode Stripe sessions are sent only while a
// test code is set; live sessions always.

import { sha256Hex } from "./meta-events";

const GRAPH = "https://graph.facebook.com/v21.0";

export interface MetaServerEvent {
  name: "Purchase" | "Lead";
  eventId: string;
  eventTime?: number;
  sourceUrl?: string;
  email?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  customData?: Record<string, unknown>;
  /** "granted" | "denied" | null as captured with the action. */
  consent?: string | null;
  /** Stripe livemode for purchases; leads are always live. */
  livemode?: boolean;
}

export type MetaSendResult = "sent" | "skipped" | "failed";

export function metaCapiConfigured(): boolean {
  return Boolean(process.env.META_CAPI_ACCESS_TOKEN) && /^\d{5,25}$/.test(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "");
}

export async function sendMetaServerEvent(ev: MetaServerEvent): Promise<MetaSendResult> {
  if (!metaCapiConfigured()) return "skipped";
  if (ev.consent === "denied") return "skipped";
  if (ev.livemode === false && !process.env.META_TEST_EVENT_CODE) return "skipped";
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const userData: Record<string, unknown> = {};
  if (ev.email) userData.em = [await sha256Hex(ev.email.trim().toLowerCase())];
  if (ev.clientIp) userData.client_ip_address = ev.clientIp;
  if (ev.userAgent) userData.client_user_agent = ev.userAgent;
  if (ev.fbp) userData.fbp = ev.fbp;
  if (ev.fbc) userData.fbc = ev.fbc;
  const body: Record<string, unknown> = {
    data: [{
      event_name: ev.name,
      event_time: ev.eventTime ?? Math.floor(Date.now() / 1000),
      event_id: ev.eventId,
      event_source_url: ev.sourceUrl ?? "https://goool.shop/",
      action_source: "website",
      user_data: userData,
      ...(ev.customData ? { custom_data: ev.customData } : {}),
    }],
  };
  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;
  try {
    const res = await fetch(`${GRAPH}/${pixelId}/events?access_token=${encodeURIComponent(process.env.META_CAPI_ACCESS_TOKEN!)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error(`[meta] ${ev.name} ${ev.eventId} rejected: HTTP ${res.status}`);
      return "failed";
    }
    return "sent";
  } catch {
    console.error(`[meta] ${ev.name} ${ev.eventId} not sent: provider unreachable`);
    return "failed";
  }
}

/** First hop of x-forwarded-for, or Netlify's client ip header. */
export function clientIpFrom(headers: { get(name: string): string | null }): string | null {
  const nf = headers.get("x-nf-client-connection-ip");
  if (nf) return nf.trim();
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim() || null;
  return null;
}
