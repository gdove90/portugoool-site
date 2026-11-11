import { createHmac } from 'node:crypto';

const endpoint = 'https://ctwncttnrbhiczmcmqqx.supabase.co/functions/v1/website-events';
export type WebsiteEvent = { name: string; id: string; actor: string; session: string | null; channel: string; at?: string; verification?: boolean };

/** Domain-separated pseudonyms. No customer fields or source identifiers leave the store. */
export async function sendWebsiteEvent(event: WebsiteEvent): Promise<boolean> {
  const token = process.env.CC_EVENTS_TOKEN;
  if (!token) return false;
  const hash = (kind: string, value: string) => createHmac('sha256', token).update(`goal:${kind}:${value}`).digest('hex');
  const body = JSON.stringify({ name: event.name, event_id: hash('event', event.id), actor: hash('actor', event.actor), session: event.session ? hash('session', event.session) : null, channel: event.channel, occurred_at: event.at ?? new Date().toISOString(), verification: event.verification === true });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await fetch(endpoint, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'x-website-brand': 'goal', 'Content-Type': 'application/json' }, body, signal: AbortSignal.timeout(2000) });
      if (result.ok) return true;
      if (result.status < 500) return false;
    } catch { /* Retry once, never break commerce. */ }
  }
  console.error('website analytics delivery pending');
  return false;
}
