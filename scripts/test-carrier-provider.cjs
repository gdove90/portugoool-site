// All HTTP is mocked. No API keys, real tracking numbers or provider calls are used.
const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/lib/carrier-tracking/easypost.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true,
} }).outputText;
const mod = { exports: {} };
new Function('require', 'module', 'exports', compiled)(require, mod, mod.exports);
const provider = mod.exports;
let passed = 0;
async function check(name, run) { await run(); passed++; console.log('PASS ' + name); }
const now = Date.UTC(2026, 9, 29, 16, 0, 0);
const secret = 'unit-only-webhook-secret';
const base = {
  id: 'trk_synthetic0001', object: 'Tracker', mode: 'test', tracking_code: 'EZ1000000001', carrier: 'USPS',
  status: 'pre_transit', status_detail: 'label_created', created_at: '2026-10-29T15:00:00Z',
  updated_at: '2026-10-29T15:30:00Z', est_delivery_date: null, tracking_details: [],
};
const event = tracker => ({ id: 'evt_synthetic0001', object: 'Event', mode: 'test',
  description: 'tracker.updated', created_at: '2026-10-29T15:30:00Z', result: tracker });
function signed(body, time = 'Thu, 29 Oct 2026 16:00:00 +0000', requestPath = '/api/carrier-tracking-webhook') {
  return { 'x-timestamp': time, 'x-path': requestPath, 'x-hmac-signature-v2': 'hmac-sha256-hex=' +
    crypto.createHmac('sha256', secret).update(time + 'POST' + requestPath + body).digest('hex') };
}
function fails(fn, code) { assert.throws(fn, error => error instanceof provider.TrackingProviderError && error.code === code); }
const http = data => new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } });
const client = { key: 'unit-only-api-key', mode: 'test' };

(async () => {
  await check('Current v2 signature validates exact raw bytes and sanitizes the Event', () => {
    const body = JSON.stringify(event(base), null, 2);
    const result = provider.verifyWebhook(body, new Headers(signed(body)), secret, now);
    assert.equal(result.eventId, 'evt_synthetic0001');
    assert.equal(result.snapshot.status, 'pre_transit');
    fails(() => provider.verifyWebhook(JSON.stringify(JSON.parse(body)), signed(body), secret, now), 'signature');
  });
  await check('Legacy body-only HMAC cannot bypass v2 timestamp checks', () => {
    const body = JSON.stringify(event(base));
    fails(() => provider.verifyWebhook(body, { 'x-hmac-signature': 'hmac-sha256-hex=' +
      crypto.createHmac('sha256', secret).update(body).digest('hex') }, secret, now), 'signature');
  });
  await check('Reject signatures, wrong signed path and missing required headers', () => {
    const body = JSON.stringify(event(base));
    fails(() => provider.verifyWebhook(body, signed(body), secret + 'wrong', now), 'signature');
    fails(() => provider.verifyWebhook(body, signed(body, undefined, '/api/another-webhook'), secret, now), 'signature');
    for (const key of ['x-timestamp', 'x-path', 'x-hmac-signature-v2']) {
      const headers = signed(body); delete headers[key];
      fails(() => provider.verifyWebhook(body, headers, secret, now), 'signature');
    }
  });
  await check('Replay window rejects stale and future requests, accepts known offsets', () => {
    const body = JSON.stringify(event(base));
    fails(() => provider.verifyWebhook(body, signed(body, 'Thu, 29 Oct 2026 15:58:59 +0000'), secret, now), 'replay');
    fails(() => provider.verifyWebhook(body, signed(body, 'Thu, 29 Oct 2026 16:00:31 +0000'), secret, now), 'replay');
    assert.equal(provider.verifyWebhook(body, signed(body, 'Thu, 29 Oct 2026 12:00:00 -0400'), secret, now).mode, 'test');
    for (const time of ['Thu, 29 Oct 2026 12:00:00 +9999', 'Thu, 32 Oct 2026 16:00:00 +0000', '2026-10-29T16:00:00Z']) {
      fails(() => provider.verifyWebhook(body, signed(body, time), secret, now), 'signature');
    }
  });
  await check('Bounds and shape reject oversized, malformed and cross-environment webhook data', () => {
    const huge = ' '.repeat(1024 * 1024 + 1);
    fails(() => provider.verifyWebhook(huge, signed(huge), secret, now), 'payload');
    for (const raw of ['{', JSON.stringify({ ...event(base), mode: 'production' }),
      JSON.stringify({ ...event(base), description: 'payment.completed' }), JSON.stringify({ ...event(base), result: null })]) {
      fails(() => provider.verifyWebhook(raw, signed(raw), secret, now), 'payload');
    }
    fails(() => provider.normalizeTracker({ ...base, tracking_details: Array(1001).fill({}) }), 'payload');
  });
  await check('Event fingerprints deduplicate replay and reordering while preserving city scans', () => {
    const a = { status: 'in_transit', status_detail: 'arrived_at_facility', message: 'Arrived at facility',
      datetime: '2026-10-29T09:00:00-04:00', tracking_location: { city: 'TEST CITY A', state: 'ZZ', zip: '00000', country: 'US' } };
    const b = { ...a, message: 'Departed facility', status_detail: 'departed_facility',
      datetime: '2026-10-29T10:00:00-04:00', tracking_location: { ...a.tracking_location, city: 'TEST CITY B' } };
    const one = provider.normalizeTracker({ ...base, tracking_details: [a, b, a] });
    const two = provider.normalizeTracker({ ...base, tracking_details: [b, a] });
    assert.equal(one.events.length, 2);
    assert.deepEqual(one.events.map(x => x.id).sort(), two.events.map(x => x.id).sort());
    assert.equal(one.events[0].occurredAt, a.datetime);
    assert.equal(one.events[0].location.city, 'TEST CITY A');
    assert.match(one.events[1].message, /Departed/);
  });
  await check('No timezone, estimate or location is invented; raw private fields are discarded', () => {
    const normalized = provider.normalizeTracker({ ...base, signed_by: 'PRIVATE RECIPIENT',
      delivery_address: { street: 'PRIVATE STREET' }, recipient_name: 'PRIVATE RECIPIENT',
      est_delivery_date: 'not-a-date', tracking_details: [{ status: 'delivered',
        message: 'Delivered to PRIVATE RECIPIENT at PRIVATE STREET', datetime: '2026-10-29T10:00:00',
        tracking_location: { street1: 'PRIVATE STREET', name: 'PRIVATE RECIPIENT' } }] });
    assert.equal(normalized.events[0].occurredAt, '2026-10-29T10:00:00');
    assert.equal(normalized.events[0].location, null);
    assert.equal(normalized.estimatedDelivery, null);
    assert.ok(!JSON.stringify(normalized).includes('PRIVATE'));
    const missing = provider.normalizeTracker({ ...base, tracking_details: [{}] });
    assert.equal(missing.events[0].occurredAt, null);
    fails(() => provider.normalizeTracker({ ...base, updated_at: '2026-10-29T15:30:00' }), 'payload');
  });
  await check('Carrier states and acceptance descriptions preserve actual state without a status ranking', () => {
    for (const state of ['pre_transit', 'in_transit', 'out_for_delivery', 'delivered', 'failure',
      'available_for_pickup', 'return_to_sender', 'cancelled', 'error', 'unknown']) {
      assert.equal(provider.normalizeTracker({ ...base, status: state }).status, state);
    }
    const accepted = provider.normalizeTracker({ ...base, tracking_details: [{ status: 'in_transit', message: 'Accepted at origin' }] });
    assert.equal(accepted.events[0].message, 'Accepted by carrier');
    const pretransit = provider.normalizeTracker({ ...base, tracking_details: [{ status: 'pre_transit', message: 'Accepted data' }] });
    assert.match(pretransit.events[0].message, /awaiting package/);
  });
  await check('Creation calls only the official standalone tracker endpoint with a timeout and no redirects', async () => {
    let calls = 0;
    const result = await provider.createTracker({ ...client, trackingNumber: base.tracking_code, carrier: 'USPS',
      fetchImpl: async (url, options) => {
        calls++; assert.equal(url, 'https://api.easypost.com/v2/trackers');
        assert.equal(options.method, 'POST'); assert.equal(options.redirect, 'error');
        assert.equal(options.cache, 'no-store'); assert.ok(options.signal);
        assert.deepEqual(JSON.parse(options.body), { tracker: { tracking_code: base.tracking_code, carrier: 'USPS', options: { is_return: false } } });
        return http(base);
      } });
    assert.equal(result.trackerId, base.id); assert.equal(calls, 1);
  });
  await check('Retrieval rejects identity and environment mismatches', async () => {
    await assert.rejects(() => provider.retrieveTracker({ ...client, trackerId: base.id,
      fetchImpl: async () => http({ ...base, mode: 'production' }) }), error => error.code === 'invalid_response');
    await assert.rejects(() => provider.retrieveTracker({ ...client, trackerId: base.id,
      fetchImpl: async () => http({ ...base, id: 'trk_unrelated' }) }), error => error.code === 'invalid_response');
  });
  await check('Ambiguous create outcomes are classified without exposing provider bodies or identifiers', async () => {
    for (const response of [new Response('PRIVATE PROVIDER BODY', { status: 503 }),
      new Response('not json'), http({ ...base, carrier: 'UPS' })]) {
      await assert.rejects(() => provider.createTracker({ ...client, trackingNumber: base.tracking_code, carrier: 'USPS',
        fetchImpl: async () => response }), error => {
        assert.equal(error.ambiguousCreate, true); assert.equal(error.retryable, true);
        assert.ok(!error.message.includes('PRIVATE') && !error.message.includes(base.id)); return true;
      });
    }
    await assert.rejects(() => provider.createTracker({ ...client, trackingNumber: base.tracking_code, carrier: 'USPS',
      fetchImpl: async () => { throw new Error('PRIVATE NETWORK DETAIL'); } }), error => error.code === 'network' && error.ambiguousCreate);
  });
  await check('Rate limit and unauthorized responses retain bounded retry classifications', async () => {
    for (const [httpStatus, code, retryable] of [[429, 'rate_limited', true], [401, 'unauthorized', false], [422, 'unsupported', false]]) {
      await assert.rejects(() => provider.retrieveTracker({ ...client, trackerId: base.id,
        fetchImpl: async () => new Response('PRIVATE', { status: httpStatus }) }), error =>
        error.code === code && error.retryable === retryable && error.httpStatus === httpStatus);
    }
  });
  await check('Provider timeout aborts registration and requires reconciliation before retry', async () => {
    await assert.rejects(() => provider.createTracker({ ...client, timeoutMs: 100, trackingNumber: base.tracking_code, carrier: 'USPS',
      fetchImpl: async (_url, options) => new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () => reject(new Error('abort')), { once: true });
      }) }), error => error.code === 'timeout' && error.ambiguousCreate);
  });
  await check('Streaming response timeouts and oversized provider responses remain bounded', async () => {
    await assert.rejects(() => provider.createTracker({ ...client, timeoutMs: 100, trackingNumber: base.tracking_code, carrier: 'USPS',
      fetchImpl: async (_url, options) => new Response(new ReadableStream({ start(controller) {
        options.signal.addEventListener('abort', () => controller.error(new DOMException('abort', 'AbortError')), { once: true });
      } })) }), error => error.code === 'timeout' && error.ambiguousCreate);
    let cancelled = false;
    await assert.rejects(() => provider.retrieveTracker({ ...client, trackerId: base.id,
      fetchImpl: async () => new Response(new ReadableStream({ cancel() { cancelled = true; } }),
        { headers: { 'content-length': String(1024 * 1024 + 1) } }) }), error => error.code === 'invalid_response');
    assert.equal(cancelled, true);
  });
  await check('Find uses read-only code/carrier/date bounds and refuses ambiguous or recycled matches', async () => {
    const opts = { ...client, trackingNumber: base.tracking_code, carrier: 'USPS',
      createdAfter: '2026-10-28T00:00:00Z', createdBefore: '2026-10-30T00:00:00Z' };
    const result = await provider.findTracker({ ...opts, fetchImpl: async (raw, options) => {
      const url = new URL(raw); assert.equal(options.method, 'GET');
      assert.equal(url.searchParams.get('tracking_codes[]'), base.tracking_code);
      assert.equal(url.searchParams.get('start_datetime'), opts.createdAfter);
      assert.equal(url.searchParams.get('end_datetime'), opts.createdBefore);
      return http({ trackers: [base], has_more: false });
    } });
    assert.equal(result.trackerId, base.id);
    assert.equal(await provider.findTracker({ ...opts, fetchImpl: async () => http({ trackers: [{ ...base, created_at: '2026-01-01T00:00:00Z' }] }) }), null);
    for (const data of [{ trackers: [base, { ...base, id: 'trk_second' }] }, { trackers: [base], has_more: true }]) {
      await assert.rejects(() => provider.findTracker({ ...opts, fetchImpl: async () => http(data) }), error => error.code === 'ambiguous');
    }
    await assert.rejects(() => provider.findTracker({ ...opts, createdAfter: '2026-01-01T00:00:00Z' }), error => error.code === 'configuration');
  });
  await check('Unsupported carriers and absent credentials never make an HTTP request', async () => {
    let calls = 0; const mock = async () => { calls++; return http(base); };
    await assert.rejects(() => provider.createTracker({ ...client, carrier: 'UnsupportedCarrier', trackingNumber: base.tracking_code, fetchImpl: mock }), error => error.code === 'unsupported');
    await assert.rejects(() => provider.retrieveTracker({ ...client, key: '', trackerId: base.id, fetchImpl: mock }), error => error.code === 'configuration');
    assert.equal(calls, 0);
  });
  console.log(`${passed} carrier provider checks passed.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
