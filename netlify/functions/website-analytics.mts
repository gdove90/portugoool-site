import { sendWebsiteEvent } from '../../src/lib/website-events-server';

/** Reconcile Stripe facts independently of fulfillment and its webhook. */
export default async function () {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey || !process.env.CC_EVENTS_TOKEN) throw new Error('Website analytics is not configured');
  let after = '';
  for (let page = 0; page < 20; page++) {
    const params = new URLSearchParams({ limit: '100', 'created[gte]': String(Math.floor(Date.now() / 1000) - 7 * 86400) });
    if (after) params.set('starting_after', after);
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions?${params}`, { headers: { Authorization: `Bearer ${stripeKey}` }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`Stripe analytics read failed ${response.status}`);
    const result = await response.json() as { data: Array<{ id: string; created: number; livemode: boolean; mode: string; payment_status: string; metadata: Record<string,string> | null }>; has_more: boolean };
    for (const session of result.data) {
      const m = session.metadata;
      if (!session.livemode || session.mode !== 'payment' || !m || m.consent !== 'granted' || !/^[a-f0-9-]{36}$/.test(m.cc_session ?? '')) continue;
      const base = { actor: m.cc_session, session: m.cc_session, channel: m.cc_channel || 'unattributed', verification: m.cc_verification === '1' };
      if (!await sendWebsiteEvent({ ...base, name: 'checkout_started', id: `checkout:${session.id}`, at: new Date(session.created * 1000).toISOString() })) throw new Error('Checkout analytics delivery failed');
      if (session.payment_status === 'paid' && !await sendWebsiteEvent({ ...base, name: 'order_paid', id: `paid:${session.id}` })) throw new Error('Payment analytics delivery failed');
    }
    if (!result.has_more) return new Response('reconciled');
    after = result.data.at(-1)?.id ?? '';
    if (!after) throw new Error('Stripe pagination incomplete');
  }
  throw new Error('Stripe pagination exceeded run capacity');
}
export const config = { schedule: '*/10 * * * *' };
