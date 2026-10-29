import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { TrackingEvent, TrackingLocation } from './presentation';

export type TrackingMode = 'test' | 'production';
export type TrackingProviderErrorCode = 'configuration' | 'signature' | 'replay' | 'payload' |
  'timeout' | 'network' | 'rate_limited' | 'unauthorized' | 'unsupported' |
  'provider_unavailable' | 'invalid_response' | 'ambiguous';

/** Contains classifications only. Never include provider payloads, keys or identifiers in errors. */
export class TrackingProviderError extends Error {
  constructor(
    public readonly code: TrackingProviderErrorCode,
    public readonly retryable = false,
    public readonly ambiguousCreate = false,
    public readonly httpStatus?: number,
  ) {
    super(`Carrier tracking unavailable (${code}).`);
    this.name = 'TrackingProviderError';
  }
}

export interface TrackingSnapshot {
  trackerId: string;
  mode: TrackingMode;
  trackingNumber: string;
  carrier: string;
  status: string;
  detail: string | null;
  events: TrackingEvent[];
  estimatedDelivery: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface VerifiedTrackingWebhook {
  eventId: string;
  eventType: 'tracker.created' | 'tracker.updated';
  mode: TrackingMode;
  createdAt: string;
  snapshot: TrackingSnapshot;
}

const MAX_BODY_BYTES = 1024 * 1024;
const MAX_EVENTS = 1000;
const STATUSES = new Set(['unknown', 'pre_transit', 'in_transit', 'out_for_delivery', 'delivered',
  'available_for_pickup', 'return_to_sender', 'failure', 'cancelled', 'error']);
const CARRIERS = new Set(['USPS', 'UPS', 'FedEx', 'DHLExpress', 'DHLGlobalMail']);
const API_ROOT = 'https://api.easypost.com/v2/';

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TrackingProviderError('payload');
  return value as Record<string, unknown>;
}

function text(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, '').trim();
  return cleaned && cleaned.length <= max ? cleaned : null;
}

/** Preserve the provider's offset, and preserve naive carrier timestamps as naive. */
function timestamp(value: unknown): string | null {
  const result = text(value, 64);
  if (!result || !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/.test(result)) return null;
  // Validate calendar fields independently so a missing offset never acquires the host's timezone.
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(result);
  if (!match) return null;
  const [, year, month, day, hour, minute, second] = match;
  const calendar = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (calendar.getUTCFullYear() !== Number(year) || calendar.getUTCMonth() + 1 !== Number(month) ||
      calendar.getUTCDate() !== Number(day) || Number(hour ?? 0) > 23 || Number(minute ?? 0) > 59 ||
      Number(second ?? 0) > 59) return null;
  const zone = /([+-])(\d{2}):?(\d{2})$/.exec(result);
  if (zone && (Number(zone[2]) > 23 || Number(zone[3]) > 59)) return null;
  return result;
}

function versionTimestamp(value: unknown): string {
  const result = timestamp(value);
  if (!result || !/T.*(?:Z|[+-]\d{2}:?\d{2})$/.test(result) || !Number.isFinite(Date.parse(result))) {
    throw new TrackingProviderError('payload');
  }
  return result;
}

function status(value: unknown): string {
  return typeof value === 'string' && STATUSES.has(value) ? value : 'unknown';
}

function detail(value: unknown): string | null {
  return typeof value === 'string' && /^[a-z_]{1,64}$/.test(value) ? value : null;
}

function location(value: unknown): TrackingLocation | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const item = value as Record<string, unknown>;
  const result = { city: text(item.city, 100), state: text(item.state, 100),
    postalCode: text(item.zip, 20), country: text(item.country, 64) };
  return Object.values(result).some(Boolean) ? result : null;
}

/** Carrier messages can contain recipient/signature data. Expose only generic scan descriptions. */
function scanMessage(value: unknown, eventStatus: string): string | null {
  const message = text(value, 500)?.toLowerCase() ?? '';
  if (eventStatus === 'pre_transit') return 'Label created — carrier awaiting package';
  if (eventStatus === 'in_transit') {
    if (/\b(?:accepted|acceptance|picked up|possession|origin scan)\b/.test(message)) return 'Accepted by carrier';
    if (/\b(?:arrived|arrival)\b/.test(message)) return 'Arrived at carrier facility';
    if (/\b(?:departed|departure)\b/.test(message)) return 'Departed carrier facility';
    if (/\b(?:processed|processing|sorted)\b/.test(message)) return 'Processed at carrier facility';
    if (/\b(?:delay|exception|weather)\b/.test(message)) return 'Carrier reported a delay or exception';
    return 'In transit';
  }
  const labels: Record<string, string> = {
    out_for_delivery: 'Out for delivery', delivered: 'Delivered', available_for_pickup: 'Available for pickup',
    return_to_sender: 'Returning to sender', failure: 'Carrier reported a delivery exception',
    cancelled: 'Shipment cancelled', error: 'Carrier tracking information unavailable',
  };
  return labels[eventStatus] ?? null;
}

export function normalizeTracker(input: unknown): TrackingSnapshot {
  const item = record(input);
  const trackerId = text(item.id, 80);
  const carrier = text(item.carrier, 64);
  const trackingNumber = text(item.tracking_code, 100);
  if (item.object !== 'Tracker' || !trackerId || !/^trk_[a-zA-Z0-9]{1,72}$/.test(trackerId) ||
      (item.mode !== 'test' && item.mode !== 'production') || !carrier || !trackingNumber ||
      !/^[a-zA-Z0-9 -]{1,100}$/.test(trackingNumber) || !Array.isArray(item.tracking_details) ||
      item.tracking_details.length > MAX_EVENTS) throw new TrackingProviderError('payload');
  const events = new Map<string, TrackingEvent>();
  for (const rawEvent of item.tracking_details) {
    const event = record(rawEvent);
    const eventStatus = status(event.status);
    const normalized = {
      status: eventStatus, detail: detail(event.status_detail), message: scanMessage(event.message, eventStatus),
      occurredAt: timestamp(event.datetime), location: location(event.tracking_location),
    };
    // EasyPost TrackingDetail has no documented event ID; this fingerprint is independent of array order.
    const id = createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
    events.set(id, { id, ...normalized });
  }
  return {
    trackerId, mode: item.mode, trackingNumber, carrier, status: status(item.status), detail: detail(item.status_detail),
    events: Array.from(events.values()), estimatedDelivery: timestamp(item.est_delivery_date),
    updatedAt: versionTimestamp(item.updated_at), createdAt: versionTimestamp(item.created_at),
  };
}

/** A recycled code must never attach a previous shipment's tracker/history to a later order. */
export function validateTrackerWindow(snapshot: TrackingSnapshot, notBefore: string, now = Date.now()): void {
  const lower = Date.parse(versionTimestamp(notBefore));
  const created = Date.parse(versionTimestamp(snapshot.createdAt));
  if (!Number.isFinite(now) || created < lower || created > now + 30_000) throw new TrackingProviderError('ambiguous');
  for (const event of snapshot.events) {
    // Compare actual instants only. A naive carrier timestamp must not acquire an invented offset.
    if (event.occurredAt && /T.*(?:Z|[+-]\d{2}:?\d{2})$/.test(event.occurredAt) && Date.parse(event.occurredAt) < lower) {
      throw new TrackingProviderError('ambiguous');
    }
  }
}

type WebhookHeaders = Headers | Record<string, string | undefined>;
function header(headers: WebhookHeaders, name: string): string | null {
  if (typeof (headers as Headers).get === 'function') return (headers as Headers).get(name);
  for (const [key, value] of Object.entries(headers)) if (key.toLowerCase() === name) return value ?? null;
  return null;
}

/** EasyPost's documented v2 protocol; Node SDK 9.1.0 only implements the obsolete v1 validator.
 * https://support.easypost.com/hc/en-us/articles/39826034964237-Webhook-HMAC-Validation
 */
export function verifyWebhook(
  rawBody: string, headers: WebhookHeaders, secret: string, now = Date.now(),
): VerifiedTrackingWebhook {
  if (typeof secret !== 'string' || !secret || secret.length > 1024) throw new TrackingProviderError('configuration');
  if (typeof rawBody !== 'string' || Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) throw new TrackingProviderError('payload');
  const sentAt = header(headers, 'x-timestamp');
  const path = header(headers, 'x-path');
  const suppliedSignature = header(headers, 'x-hmac-signature-v2');
  if (!sentAt || !/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), \d{2} (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4} \d{2}:\d{2}:\d{2} [+-]\d{4}$/.test(sentAt) ||
      path !== '/api/carrier-tracking-webhook' || !suppliedSignature ||
      !/^hmac-sha256-hex=[a-f0-9]{64}$/i.test(suppliedSignature)) throw new TrackingProviderError('signature');
  const date = Date.parse(sentAt);
  const parts = /, (\d{2}) (\w{3}) (\d{4}) (\d{2}):(\d{2}):(\d{2}) ([+-])(\d{2})(\d{2})$/.exec(sentAt);
  if (!parts || !Number.isFinite(date) || Number(parts[4]) > 23 || Number(parts[5]) > 59 ||
      Number(parts[6]) > 59 || Number(parts[8]) > 23 || Number(parts[9]) > 59) throw new TrackingProviderError('signature');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const calendar = new Date(Date.UTC(Number(parts[3]), months.indexOf(parts[2]), Number(parts[1])));
  if (calendar.getUTCDate() !== Number(parts[1]) || calendar.getUTCMonth() !== months.indexOf(parts[2])) throw new TrackingProviderError('signature');
  if (!Number.isFinite(now) || date < now - 60_000 || date > now + 30_000) throw new TrackingProviderError('replay');
  const expected = createHmac('sha256', secret).update(sentAt + 'POST' + path + rawBody, 'utf8').digest();
  const supplied = Buffer.from(suppliedSignature.slice('hmac-sha256-hex='.length), 'hex');
  if (!timingSafeEqual(expected, supplied)) throw new TrackingProviderError('signature');
  let parsed: unknown;
  try { parsed = JSON.parse(rawBody); } catch { throw new TrackingProviderError('payload'); }
  const event = record(parsed);
  const eventId = text(event.id, 80);
  if (event.object !== 'Event' || !eventId || !/^evt_[a-zA-Z0-9]{1,72}$/.test(eventId) ||
      (event.description !== 'tracker.created' && event.description !== 'tracker.updated') ||
      (event.mode !== 'test' && event.mode !== 'production')) throw new TrackingProviderError('payload');
  const snapshot = normalizeTracker(event.result);
  if (snapshot.mode !== event.mode) throw new TrackingProviderError('payload');
  return { eventId, eventType: event.description, mode: event.mode, createdAt: versionTimestamp(event.created_at), snapshot };
}

interface ClientOptions {
  key: string;
  mode: TrackingMode;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

function validateOptions(options: ClientOptions): void {
  if (!options.key || options.key.length > 1024 || (options.mode !== 'test' && options.mode !== 'production')) {
    throw new TrackingProviderError('configuration');
  }
}

function validateIdentity(carrier: string, trackingNumber: string): void {
  if (!CARRIERS.has(carrier)) throw new TrackingProviderError('unsupported');
  if (!/^[a-zA-Z0-9 -]{1,100}$/.test(trackingNumber) || !trackingNumber.trim()) throw new TrackingProviderError('configuration');
}

async function boundedJson(response: Response): Promise<unknown> {
  const declared = response.headers.get('content-length');
  if (declared && Number(declared) > MAX_BODY_BYTES) {
    await response.body?.cancel();
    throw new TrackingProviderError('invalid_response', true);
  }
  if (!response.body) throw new TrackingProviderError('invalid_response', true);
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new TrackingProviderError('invalid_response', true);
      }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown;
  } catch (error) {
    if (error instanceof TrackingProviderError) throw error;
    if (error instanceof Error && error.name === 'AbortError') throw error;
    throw new TrackingProviderError('invalid_response', true);
  } finally { reader.releaseLock(); }
}

async function request(options: ClientOptions, path: string, method: 'GET' | 'POST', body?: unknown): Promise<unknown> {
  validateOptions(options);
  const controller = new AbortController();
  const timeoutMs = Math.max(100, Math.min(options.timeoutMs ?? 8000, 15000));
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const creating = method === 'POST';
  try {
    const response = await (options.fetchImpl ?? fetch)(API_ROOT + path, {
      method, signal: controller.signal, redirect: 'error', cache: 'no-store',
      headers: { Authorization: `Basic ${Buffer.from(options.key + ':', 'utf8').toString('base64')}`,
        Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok) {
      const code = response.status === 401 || response.status === 403 ? 'unauthorized' :
        response.status === 429 ? 'rate_limited' : response.status >= 500 ? 'provider_unavailable' : 'unsupported';
      await response.body?.cancel();
      throw new TrackingProviderError(code, response.status === 429 || response.status >= 500,
        creating && response.status >= 500, response.status);
    }
    return await boundedJson(response);
  } catch (error) {
    if (error instanceof TrackingProviderError) {
      if (creating && error.code === 'invalid_response') throw new TrackingProviderError(error.code, error.retryable, true);
      throw error;
    }
    throw new TrackingProviderError(controller.signal.aborted ? 'timeout' : 'network', true, creating);
  } finally { clearTimeout(timer); }
}

function expectedSnapshot(raw: unknown, options: ClientOptions, carrier?: string, trackingNumber?: string): TrackingSnapshot {
  try {
    const snapshot = normalizeTracker(raw);
    if (snapshot.mode !== options.mode || (carrier && snapshot.carrier !== carrier) ||
        (trackingNumber && snapshot.trackingNumber !== trackingNumber)) throw new TrackingProviderError('invalid_response');
    return snapshot;
  } catch { throw new TrackingProviderError('invalid_response', true); }
}

export async function createTracker(options: ClientOptions & { trackingNumber: string; carrier: string }): Promise<TrackingSnapshot> {
  validateIdentity(options.carrier, options.trackingNumber);
  const raw = await request(options, 'trackers', 'POST', { tracker: {
    tracking_code: options.trackingNumber, carrier: options.carrier, options: { is_return: false },
  } });
  try { return expectedSnapshot(raw, options, options.carrier, options.trackingNumber); }
  catch { throw new TrackingProviderError('invalid_response', true, true); }
}

export async function retrieveTracker(options: ClientOptions & { trackerId: string }): Promise<TrackingSnapshot> {
  if (!/^trk_[a-zA-Z0-9]{1,72}$/.test(options.trackerId)) throw new TrackingProviderError('configuration');
  const result = expectedSnapshot(await request(options, `trackers/${encodeURIComponent(options.trackerId)}`, 'GET'), options);
  if (result.trackerId !== options.trackerId) throw new TrackingProviderError('invalid_response');
  return result;
}

/** Read before retrying an ambiguous create. A bounded search must never silently select a recycled code. */
export async function findTracker(options: ClientOptions & {
  trackingNumber: string; carrier: string; createdAfter: string; createdBefore: string;
}): Promise<TrackingSnapshot | null> {
  validateIdentity(options.carrier, options.trackingNumber);
  const start = versionTimestamp(options.createdAfter);
  const end = versionTimestamp(options.createdBefore);
  const startMs = Date.parse(start), endMs = Date.parse(end);
  if (endMs <= startMs || endMs - startMs > 90 * 86400_000) throw new TrackingProviderError('configuration');
  // Match the official Node client's serialization for a single tracking_codes element.
  const params = new URLSearchParams({ tracking_codes: options.trackingNumber, carrier: options.carrier,
    start_datetime: start, end_datetime: end, page_size: '100' });
  const raw = record(await request(options, `trackers?${params.toString()}`, 'GET'));
  if (!Array.isArray(raw.trackers) || raw.trackers.length > 100) throw new TrackingProviderError('invalid_response', true);
  if (raw.has_more === true) throw new TrackingProviderError('ambiguous');
  const found = raw.trackers.map(item => expectedSnapshot(item, options, options.carrier, options.trackingNumber))
    .filter(item => Date.parse(item.createdAt) >= startMs && Date.parse(item.createdAt) <= endMs);
  if (found.length > 1) throw new TrackingProviderError('ambiguous');
  return found[0] ?? null;
}
