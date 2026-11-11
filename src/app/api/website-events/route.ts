import { NextRequest } from 'next/server';
import { sendWebsiteEvent } from '@/lib/website-events-server';
const rates = new Map<string, { n: number; until: number }>();
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  const ua = req.headers.get('user-agent') ?? '';
  if (!['https://goalathletics.shop', 'https://www.goalathletics.shop'].includes(origin ?? '')
    || req.headers.get('sec-gpc') === '1' || req.headers.get('dnt') === '1'
    || !ua || /bot|crawl|spider|headless|lighthouse|curl|wget/i.test(ua)) return new Response(null, { status: 204 });
  const ip = req.headers.get('x-nf-client-connection-ip') ?? 'unknown';
  const now = Date.now();
  const rate = rates.get(ip);
  if (rate && rate.until > now && ++rate.n > 60) return new Response(null, { status: 429 });
  if (!rate || rate.until <= now) { if (rates.size > 5000) rates.clear(); rates.set(ip, { n: 1, until: now + 60000 }); }
  if (Number(req.headers.get('content-length') ?? 0) > 1024) return new Response(null, { status: 413 });
  try {
    const text = await req.text();
    if (text.length > 1024) return new Response(null, { status: 413 });
    const e = JSON.parse(text);
    if (!['session_started', 'product_viewed', 'bag_item_added'].includes(e.name)
      || !/^[a-f0-9-]{36}$/.test(e.id) || !/^[a-f0-9-]{36}$/.test(e.session)
      || e.session !== req.cookies.get('cc_session')?.value
      || !['direct', 'search', 'social', 'paid', 'email', 'referral'].includes(e.channel)) return new Response(null, { status: 400 });
    const ok = await sendWebsiteEvent({ name: e.name, id: `${e.name}:${e.id}`, actor: e.session, session: e.session, channel: e.channel, verification: e.verification === true, at: typeof e.at === 'string' && Math.abs(Date.now() - Date.parse(e.at)) < 86400000 ? e.at : undefined });
    return new Response(null, { status: ok ? 204 : 503 });
  } catch { return new Response(null, { status: 400 }); }
}
