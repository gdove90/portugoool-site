import { createHash } from 'node:crypto';
import { campaignTags } from './campaign-tags';
import { getSupabaseAdmin } from './supabase';

const goalHosts = new Set([
  'goalathletics.shop', 'www.goalathletics.shop', 'goool.shop', 'www.goool.shop', 'portugoool.com', 'www.portugoool.com',
]);

export interface CheckoutSnapshot {
  id: string;
  livemode: boolean;
  mode: string;
  payment_status: string;
  success_url?: string | null;
  metadata: Record<string, string> | null;
}

export function paidOrderMeasurement(session: CheckoutSnapshot) {
  if (!session.livemode || session.mode !== 'payment' || !['paid', 'no_payment_required'].includes(session.payment_status)) return null;
  if (!/^cs_live_[A-Za-z0-9]+$/.test(session.id) || !session.success_url) return null;
  let url: URL;
  try { url = new URL(session.success_url); } catch { return null; }
  if (url.protocol !== 'https:' || !goalHosts.has(url.hostname) || url.pathname !== '/success') return null;

  const metadata = session.metadata;
  const hasConsent = metadata?.consent === 'granted';
  const tags = hasConsent ? campaignTags(field => metadata?.[`cc_utm_${field}`]) : {};
  const channel = metadata?.cc_channel;
  return {
    session_hash: createHash('sha256').update(session.id).digest('hex'),
    verification: metadata?.cc_verification === '1',
    channel: hasConsent && channel && ['direct', 'search', 'social', 'paid', 'email', 'referral'].includes(channel) ? channel : null,
    campaign: tags.campaign ?? null,
    source: tags.source ?? null,
    medium: tags.medium ?? null,
    checked_at: new Date().toISOString(),
  };
}

export async function savePaidOrderMeasurements(sessions: CheckoutSnapshot[]): Promise<void> {
  const rows = sessions.map(paidOrderMeasurement).filter(row => row !== null);
  if (!rows.length) return;
  const db = getSupabaseAdmin();
  if (!db) throw new Error('Order measurement database is not configured');
  const { error } = await db.from('order_checkout_measurements').upsert(rows, { onConflict: 'session_hash' });
  if (error) throw new Error('Order measurement write failed');
}
