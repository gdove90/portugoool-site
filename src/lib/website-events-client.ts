'use client';
import { marketingConsent } from './meta-pixel';

type Session = { id: string; channel: string; last: number; started: number; verification: boolean };
const key = 'goal_website_session_v1';
const channels = ['direct', 'search', 'social', 'paid', 'email', 'referral'];
export function websiteSession(): Session | null {
  try {
    if (marketingConsent() !== 'granted' || navigator.doNotTrack === '1'
      || !['goalathletics.shop', 'www.goalathletics.shop'].includes(location.hostname)) {
      sessionStorage.removeItem(key);
      document.cookie = 'cc_session=; Max-Age=0; Path=/; Secure; SameSite=Lax';
      document.cookie = 'cc_channel=; Max-Age=0; Path=/; Secure; SameSite=Lax';
      return null;
    }
    const now = Date.now();
    let s: Session | null = JSON.parse(sessionStorage.getItem(key) ?? 'null');
    if (!s || (new URLSearchParams(location.search).get('cc_verify') === '1' && !s.verification) || !/^[a-f0-9-]{36}$/.test(s.id) || !channels.includes(s.channel) || now < s.last || now - s.last > 1800000) {
      const medium = new URLSearchParams(location.search).get('utm_medium') ?? '';
      let ref = ''; try { ref = new URL(document.referrer).hostname; } catch { /* Direct. */ }
      const channel = /^(cpc|ppc|paid|paid_social|display)$/.test(medium) ? 'paid' : medium === 'email' ? 'email'
        : /^(social|social_media)$/.test(medium) || /(^|\.)(instagram\.com|facebook\.com|tiktok\.com|t\.co|x\.com|youtube\.com)$/.test(ref) ? 'social'
        : medium === 'organic' || /(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|search\.yahoo\.com)$/.test(ref) ? 'search'
        : ref && !/(^|\.)(goalathletics\.shop|goool\.shop|portugoool\.com)$/.test(ref) ? 'referral' : 'direct';
      s = { id: crypto.randomUUID(), channel, last: now, started: now, verification: new URLSearchParams(location.search).get('cc_verify') === '1' };
    }
    s.last = now;
    sessionStorage.setItem(key, JSON.stringify(s));
    document.cookie = `cc_session=${s.id}; Max-Age=1800; Path=/; Secure; SameSite=Lax`;
    document.cookie = `cc_channel=${s.channel}; Max-Age=1800; Path=/; Secure; SameSite=Lax`;
    document.cookie = `cc_verification=${s.verification ? '1' : '0'}; Max-Age=1800; Path=/; Secure; SameSite=Lax`;
    return s;
  } catch { return null; }
}

export function trackWebsiteEvent(name: 'session_started' | 'product_viewed' | 'bag_item_added'): void {
  try {
    const s = websiteSession();
    if (!s || /^\/(admin|api|success|track-order|contact|intake)(\/|$)/.test(location.pathname)) return;
    const eventId = name === 'session_started' ? s.id : crypto.randomUUID();
    void fetch('/api/website-events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', keepalive: true,
      body: JSON.stringify({ name, id: eventId, session: s.id, channel: s.channel, verification: s.verification, at: new Date(name === 'session_started' ? s.started : Date.now()).toISOString() }),
    }).catch(() => {});
  } catch { /* Measurement never interrupts shopping. */ }
}
