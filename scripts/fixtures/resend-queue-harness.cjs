// Test-only offline harness: unchanged production modules, deterministic memory
// persistence, and captured fetch. No real provider, credentials or file store.
'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict'), ts = require('typescript');
const ROOT = path.resolve(__dirname, '../..'), ORDER_ID = '10000000-0000-4000-8000-000000000001', PRODUCT_ID = '80000000-0000-4000-8000-000000000012';
const FIXED_NOW = Date.parse('2026-10-28T12:00:00Z'), clone = value => structuredClone(value);
function receiptFixture(overrides = {}) {
    return {
        order: { id: ORDER_ID, stripe_session_id: 'cs_test_queue_fixture', stripe_payment_intent: 'pi_fixture', customer_email: 'buyer@example.test', status: 'paid', fulfillment_status: 'unfulfilled', submission_status: 'pending_submission', total_cents: 8515, amount_subtotal_cents: 8200, amount_shipping_cents: 695, amount_tax_cents: 120, amount_discount_cents: 500, currency: 'usd', shipping_name: 'Test <Buyer>', shipping_address: { line1: '1 <Pitch> Way', city: 'Providence', state: 'RI', postal_code: '02901', country: 'US' }, apliiq_order_id: null, submission_last_error: null, paid_at: '2026-10-28T11:59:00Z', livemode: false, submission_attempt_id: null, submission_started_at: null, confirmation_sent_at: null, ...overrides },
        items: [{ product_id: PRODUCT_ID, size: 'S', color: 'Black', quantity: 2, custom_name: 'A&B', custom_number: '<9>', unit_price_cents: 4100, apliiq_product_id: 6206620, apliiq_sku: 'APQ-PERSISTED-FIXTURE' }]
    };
}
function createHarness(overrides = {}) {
    const clock = { now: FIXED_NOW }, env = { NODE_ENV: 'test', RESEND_API_KEY: 're_fixture_only', STRIPE_SECRET_KEY: 'sk_test_fixture_only', STRIPE_WEBHOOK_SECRET: 'whsec_fixture_only', NEXT_PUBLIC_SITE_URL: 'https://goalathletics.shop', ...overrides };
    class ClockDate extends Date {
        constructor(...args) { super(...(args.length ? args : [clock.now])); }
        static now() { return clock.now; }
    }
    const tables = { email_deliveries: [], orders: [], newsletter_signups: [] }, itemRows = new Map(), events = new Set(), requests = [], operations = [], receiptRequests = [], errors = [];
    const faults = { queue: false, claim: false, save: false, orderMarker: false, queueRead: false, park: false }, transport = { mode: 'ok' };
    const db = { tables, from(table) {
            assert.ok(Object.hasOwn(tables, table), 'Unexpected table ' + table);
            const filters = [];
            let op = 'read', values, options, limit = Infinity, single = false, orderBy;
            const q = { select() { return q; }, eq(k, v) { filters.push(r => r[k] === v); return q; }, in(k, vs) { filters.push(r => vs.includes(r[k])); return q; }, lt(k, v) { filters.push(r => r[k] != null && r[k] < v); return q; }, lte(k, v) { filters.push(r => r[k] != null && r[k] <= v); return q; }, order(k) { orderBy = k; return q; }, limit(n) { limit = n; return q; }, maybeSingle() { single = true; return q; }, upsert(v, o) { op = 'upsert'; values = clone(v); options = clone(o); return q; }, update(v) { op = 'update'; values = clone(v); return q; }, then(resolve, reject) {
                    try {
                        operations.push({ table, op, values: clone(values), options: clone(options) });
                        if (op === 'upsert') {
                            if (faults.queue)
                                return Promise.resolve({ data: null, error: { message: 'fixture queue unavailable' } }).then(resolve, reject);
                            assert.equal(options.onConflict, 'key');
                            const existing = tables[table].find(r => r.key === values.key);
                            if (!existing)
                                tables[table].push({ status: 'pending', attempts: 0, first_attempt_at: null, next_attempt_at: new Date(clock.now).toISOString(), lease_until: null, claim_token: null, sent_at: null, provider_id: null, ...values });
                            else if (!options.ignoreDuplicates)
                                Object.assign(existing, values);
                        }
                        let rows = tables[table].filter(r => filters.every(f => f(r)));
                        if (orderBy)
                            rows = rows.slice().sort((a, b) => String(a[orderBy]).localeCompare(String(b[orderBy])));
                        rows = rows.slice(0, limit);
                        if (op === 'read' && table === 'email_deliveries' && faults.queueRead)
                            return Promise.resolve({ data: null, error: { message: 'fixture read unavailable' } }).then(resolve, reject);
                        if (op === 'update') {
                            if ((table === 'orders' && faults.orderMarker)
                                || (table === 'email_deliveries' && ((faults.save && values.status !== 'needs_review')
                                    || (faults.park && values.status === 'needs_review'))))
                                return Promise.resolve({ data: null, error: { message: 'fixture update unavailable' } }).then(resolve, reject);
                            rows.forEach(r => Object.assign(r, values));
                        }
                        return Promise.resolve({ data: single ? clone(rows[0] ?? null) : clone(rows), error: null }).then(resolve, reject);
                    }
                    catch (error) {
                        return Promise.reject(error).then(resolve, reject);
                    }
                } };
            return q;
        }, async rpc(name, args) {
            assert.equal(name, 'claim_email_delivery');
            if (faults.claim)
                return { data: null, error: { message: 'fixture claim unavailable' } };
            const row = tables.email_deliveries.find(r => r.key === args.p_key);
            // Models the database claim contract, not the production delivery logic.
            // Real Postgres locking is covered by the backend/SQL suites separately.
            if (!row || Date.parse(row.next_attempt_at) > clock.now
                || (row.first_attempt_at && Date.parse(row.first_attempt_at) <= clock.now - 23 * 3600000)
                || !(row.status === 'pending' || (row.status === 'sending' && Date.parse(row.lease_until) < clock.now)))
                return { data: [], error: null };
            Object.assign(row, { status: 'sending', claim_token: args.p_token, lease_until: new Date(clock.now + 120000).toISOString(), first_attempt_at: row.first_attempt_at ?? new Date(clock.now).toISOString(), attempts: row.attempts + 1 });
            return { data: [clone(row)], error: null };
        } };
    const fetchMock = async (url, options) => {
        requests.push({ url: String(url), method: options.method, headers: clone(options.headers), body: JSON.parse(options.body) });
        if (transport.mode === 'ambiguous')
            throw new Error('fixture connection dropped after request');
        if (transport.mode === 'reject')
            return { ok: false, status: 422, json: async () => ({ message: 'fixture provider rejection' }) };
        if (transport.mode === 'server')
            return { ok: false, status: 503, json: async () => ({}) };
        if (transport.mode === 'bad-json')
            return { ok: true, status: 200, json: async () => { throw new Error('fixture malformed response'); } };
        if (transport.mode === 'missing-id')
            return { ok: true, status: 200, json: async () => ({}) };
        return { ok: true, status: 200, json: async () => ({ id: 'resend_fixture_' + requests.length }) };
    };
    const store = { async getOrderById(id) { return clone(tables.orders.find(r => r.id === id) ?? null); }, async listOrderItems(id) { return clone(itemRows.get(id) || []); }, async hasEvent(id) { return events.has(id); }, async recordEvent(id) { if (events.has(id))
            return false; events.add(id); return true; }, async getOrderBySession(id) { return clone(tables.orders.find(r => r.stripe_session_id === id) ?? null); }, async createOrder(order, items) { const existing = tables.orders.find(r => r.stripe_session_id === order.stripe_session_id); if (existing)
            return { orderId: existing.id, created: false }; const id = tables.orders.length ? '20000000-0000-4000-8000-000000000002' : ORDER_ID; tables.orders.push({ id, confirmation_sent_at: null, ...clone(order) }); itemRows.set(id, clone(items)); return { orderId: id, created: true }; }, async setOrderStatus(id, status) { tables.orders.find(r => r.id === id).status = status; }, async transitionSubmission(id, from, to, fields = {}) { const r = tables.orders.find(r => r.id === id); if (r.submission_status !== from)
            return false; Object.assign(r, fields, { submission_status: to }); return true; } };
    const cache = new Map(), mocks = {
        './supabase': { getSupabaseAdmin: () => db }, '@/lib/orders-store': { getOrdersStore: () => store },
        '@/lib/fulfillment-submit': { submitPaidOrder: async () => ({ action: 'not_eligible' }), orderNumber: id => 'GOOOL-' + id.replace(/-/g, '').slice(0, 8).toUpperCase() },
        '@/lib/discount': { markRedeemed: async () => { } }, '@/lib/meta-capi': { metaCapiConfigured: () => false, sendMetaServerEvent: async () => { throw new Error('Unexpected advertising request'); } }, '@/lib/meta-events': { metaEventId: async () => 'fixture-event' },
        'next/server': { NextResponse: { json: (body, opts = {}) => ({ status: opts.status || 200, body }) } },
        stripe: class Stripe {
            webhooks = { constructEvent: (raw, signature) => { if (signature !== 'fixture-valid')
                    throw new Error('fixture invalid signature'); return JSON.parse(raw); } };
            checkout = { sessions: { retrieve: async () => ({ discounts: [] }) } };
            paymentIntents = { update: async (id, payload, opts) => { receiptRequests.push(clone({ id, payload, opts })); return {}; } };
        }
    };
    function load(file) {
        let full = path.resolve(ROOT, file);
        if (!path.extname(full))
            full += fs.existsSync(full + '.ts') ? '.ts' : '.js';
        assert.ok(full.startsWith(ROOT + path.sep), 'Module escaped test repository');
        if (cache.has(full))
            return cache.get(full).exports;
        if (full.endsWith('.json'))
            return JSON.parse(fs.readFileSync(full, 'utf8'));
        const module = { exports: {} };
        cache.set(full, module);
        const requireMock = name => { if (Object.hasOwn(mocks, name))
            return mocks[name]; if (name === 'crypto' || name === 'node:crypto')
            return require('node:crypto'); if (name.startsWith('@/'))
            return load('src/' + name.slice(2)); if (name.startsWith('.'))
            return load(path.relative(ROOT, path.resolve(path.dirname(full), name))); throw new Error('Unexpected offline dependency ' + name); };
        const compiled = ts.transpileModule(fs.readFileSync(full, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
        vm.runInNewContext(compiled, { module, exports: module.exports, require: requireMock, process: { env }, fetch: fetchMock, AbortSignal, Date: ClockDate, URL, Buffer, console: { log() { }, error: (...args) => errors.push(args.map(String).join(' ')) } }, { filename: full });
        return module.exports;
    }
    function seedReceipt(overrides = {}) { const f = receiptFixture(overrides); tables.orders.push(clone(f.order)); itemRows.set(f.order.id, clone(f.items)); return f; }
    function webhookEvent({ eventId = 'evt_queue_fixture', paymentStatus = 'paid', type = 'checkout.session.completed', livemode = false } = {}) {
        const f = receiptFixture({ livemode }), i = f.items[0];
        return { id: eventId, type, livemode, created: Math.floor(clock.now / 1000), data: { object: { id: f.order.stripe_session_id, object: 'checkout.session', payment_status: paymentStatus, status: paymentStatus === 'paid' ? 'complete' : 'open', amount_total: 8515, amount_subtotal: 8200, total_details: { amount_shipping: 695, amount_tax: 120, amount_discount: 500 }, currency: 'usd', payment_intent: 'pi_fixture', customer_details: { email: f.order.customer_email }, collected_information: { shipping_details: { name: f.order.shipping_name, address: f.order.shipping_address } }, metadata: { consent: 'denied', items_0: JSON.stringify([{ p: i.product_id, c: i.color, s: i.size, q: i.quantity, u: i.unit_price_cents, k: i.apliiq_sku, a: i.apliiq_product_id, n: i.custom_name, m: i.custom_number }]) } } } };
    }
    async function webhook(event = webhookEvent(), signature = 'fixture-valid') { return load('src/app/api/stripe-webhook/route.ts').POST({ text: async () => JSON.stringify(event), headers: { get: name => name === 'stripe-signature' ? signature : null } }); }
    return { env, clock, tables, itemRows, events, requests, operations, receiptRequests, faults, transport, errors, db, store, load, seedReceipt, webhookEvent, webhook, advance(ms) { clock.now += ms; }, row(key = 'order/test/' + ORDER_ID) { return tables.email_deliveries.find(r => r.key === key); } };
}
function reporter(label) {
    let passed = 0;
    return {
        async check(name, run) {
            await run();
            passed++;
            console.log('PASS ' + name);
        },
        finish(expected) {
            assert.equal(passed, expected, 'Unexpected independent check count');
            console.log(`${passed} ${label} checks passed. In-memory persistence and mocked fetch only; no real email or provider calls.`);
            return passed;
        }
    };
}
module.exports = { createHarness, receiptFixture, reporter, ORDER_ID, PRODUCT_ID, FIXED_NOW };
