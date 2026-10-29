/** Historical inventory filename. SMTP is unsupported; this now protects the
 * actual paid-webhook -> durable receipt queue -> Resend worker path.
 * Run: node scripts/test-order-email-smtp.mjs. Legacy CLI args are unnecessary.
 * No server, real credentials, external request or filesystem order store. */
import assert from 'node:assert/strict';
import harness from './fixtures/resend-queue-harness.cjs';
const { createHarness, reporter, ORDER_ID } = harness, { check, finish } = reporter('queued-receipt');
await check('Paid webhook queues a durable receipt without sending inline', async () => {
    const h = createHarness(), r = await h.webhook();
    assert.equal(r.status, 200);
    assert.equal(r.body.confirmation, 'queued');
    assert.equal(h.requests.length, 0);
    assert.equal(h.tables.orders.length, 1);
    assert.equal(h.tables.orders[0].status, 'paid');
    assert.equal(h.tables.orders[0].confirmation_sent_at, null);
    assert.equal(h.row().key, 'order/test/' + ORDER_ID);
    assert.equal(h.row().kind, 'order');
    assert.equal(h.row().livemode, false);
    assert.equal(h.row().order_id, ORDER_ID);
    assert.equal(h.row().status, 'pending');
    assert.equal(h.receiptRequests.length, 1);
    assert.deepEqual(h.receiptRequests[0].payload, { receipt_email: 'buyer@example.test' });
});
await check('Receipt payload preserves paid quantities/prices/totals and escapes unsafe strings', async () => {
    const h = createHarness();
    await h.webhook();
    const m = h.row().message;
    assert.equal(m.to, 'buyer@example.test');
    assert.equal(m.subject, 'Order GOOOL-10000000 confirmed');
    assert.match(m.text, /2 x GOAL Athletics Match Day Tee/);
    for (const value of ['Subtotal: $82.00', 'Discount: -$5.00', 'Shipping: $6.95', 'Tax: $1.20', 'Total paid: $85.15', 'https://goalathletics.shop/track-order'])
        assert.ok(m.text.includes(value), value);
    assert.ok(!m.text.includes('$76.00'), 'Current catalog price must not overwrite purchased snapshot');
    assert.match(m.html, /\$85\.15/);
    assert.match(m.html, /Test &lt;Buyer&gt;/);
    assert.match(m.html, /1 &lt;Pitch&gt; Way/);
    assert.match(m.html, /A&amp;B/);
    assert.ok(!m.html.includes('<9>'));
    assert.ok(!m.html.includes('<Pitch>'));
});
await check('Receipt confirms payment without falsely claiming dispatch', async () => {
    const h = createHarness();
    await h.webhook();
    const m = h.row().message;
    for (const text of [m.text, m.html])
        assert.doesNotMatch(text, /(has shipped|on its way now|dispatched)/i);
    assert.match(m.text, /Your payment is confirmed/);
    assert.match(m.text, /few days to prepare before it ships/);
    assert.match(m.text, /support@goalathletics\.shop/);
    assert.match(m.text, /PO Box 19, Saunderstown, RI 02874/);
});
await check('Event and session replays do not duplicate an order or its delivery intent', async () => {
    const h = createHarness(), first = h.webhookEvent();
    await h.webhook(first);
    assert.equal((await h.webhook(first)).body.duplicate, true);
    assert.equal((await h.webhook(h.webhookEvent({ eventId: 'evt_same_session_again' }))).body.confirmation, 'queued');
    assert.equal(h.tables.orders.length, 1);
    assert.equal(h.tables.email_deliveries.length, 1);
    assert.equal(h.requests.length, 0);
    assert.ok(h.operations.filter(x => x.op === 'upsert').every(x => x.options.onConflict === 'key' && x.options.ignoreDuplicates === true));
});
await check('Unpaid delayed checkout queues only after async payment succeeds', async () => {
    const h = createHarness(), r = await h.webhook(h.webhookEvent({ paymentStatus: 'unpaid' }));
    assert.equal(r.body.awaiting, 'async payment');
    assert.equal(h.tables.orders[0].status, 'pending');
    assert.equal(h.tables.email_deliveries.length, 0);
    const paid = await h.webhook(h.webhookEvent({ eventId: 'evt_async_paid', type: 'checkout.session.async_payment_succeeded', paymentStatus: 'unpaid' }));
    assert.equal(paid.body.confirmation, 'queued');
    assert.equal(h.tables.orders[0].status, 'paid');
    assert.equal(h.tables.email_deliveries.length, 1);
    assert.equal(h.requests.length, 0);
});
await check('Queue persistence failure leaves the webhook retryable without a second order', async () => {
    const h = createHarness();
    h.faults.queue = true;
    assert.equal((await h.webhook()).status, 500);
    assert.equal(h.events.size, 0);
    assert.equal(h.tables.orders.length, 1);
    assert.equal(h.tables.orders[0].status, 'paid');
    assert.equal(h.requests.length, 0);
    h.faults.queue = false;
    assert.equal((await h.webhook()).body.confirmation, 'queued');
    assert.equal(h.events.size, 1);
    assert.equal(h.tables.orders.length, 1);
    assert.equal(h.tables.email_deliveries.length, 1);
});
await check('Invalid webhook signature cannot create an order or delivery', async () => {
    const h = createHarness();
    assert.equal((await h.webhook(h.webhookEvent(), 'fixture-invalid')).status, 400);
    assert.equal(h.tables.orders.length, 0);
    assert.equal(h.tables.email_deliveries.length, 0);
    assert.equal(h.requests.length, 0);
});
await check('Worker sends with current brand sender, Support reply and stable Resend identity', async () => {
    const h = createHarness();
    await h.webhook();
    const d = h.load('src/lib/email-delivery.ts');
    assert.equal(await d.deliverEmail('order/test/' + ORDER_ID), 'sent');
    assert.equal(h.requests.length, 1);
    const r = h.requests[0];
    assert.equal(r.url, 'https://api.resend.com/emails');
    assert.equal(r.method, 'POST');
    assert.equal(r.headers.Authorization, 'Bearer re_fixture_only');
    assert.equal(r.headers['Idempotency-Key'], 'order/test/' + ORDER_ID);
    assert.equal(r.body.from, 'GOAL Athletics <hello@goalathletics.shop>');
    assert.equal(r.body.reply_to, 'support@goalathletics.shop');
    assert.deepEqual(r.body.to, ['buyer@example.test']);
    assert.equal(r.body.subject, 'Order GOOOL-10000000 confirmed');
    assert.match(r.body.text, /Total paid: \$85\.15/);
    assert.ok(r.body.html.length > 1000 && r.body.text.length > 300);
    assert.equal(h.row().status, 'sent');
    assert.equal(h.row().provider_id, 'resend_fixture_1');
    assert.ok(h.tables.orders[0].confirmation_sent_at);
});
await check('Concurrent claims and later worker/webhook replays send once only', async () => {
    const h = createHarness();
    await h.webhook();
    const d = h.load('src/lib/email-delivery.ts'), results = await Promise.all([d.deliverEmail('order/test/' + ORDER_ID), d.deliverEmail('order/test/' + ORDER_ID)]);
    assert.deepEqual(results.sort(), ['already_sent_or_pending', 'sent']);
    assert.equal(await d.deliverEmail('order/test/' + ORDER_ID), 'already_sent_or_pending');
    assert.equal((await h.webhook()).body.duplicate, true);
    assert.equal(h.requests.length, 1);
    assert.equal(h.row().attempts, 1);
});
await check('Provider rejection leaves paid receipt pending with backoff, then retries the same key', async () => {
    const h = createHarness();
    await h.webhook();
    h.transport.mode = 'reject';
    const d = h.load('src/lib/email-delivery.ts');
    assert.equal(await d.deliverEmail('order/test/' + ORDER_ID), 'queued');
    assert.equal(h.row().status, 'pending');
    assert.equal(h.tables.orders[0].status, 'paid');
    assert.equal(h.tables.orders[0].confirmation_sent_at, null);
    assert.match(h.row().last_error, /HTTP 422/);
    assert.equal(Date.parse(h.row().next_attempt_at) - h.clock.now, 120000);
    assert.equal(await d.deliverEmail('order/test/' + ORDER_ID), 'already_sent_or_pending');
    assert.equal(h.requests.length, 1);
    h.advance(120001);
    h.transport.mode = 'ok';
    assert.equal(await d.deliverEmail('order/test/' + ORDER_ID), 'sent');
    assert.equal(h.requests.length, 2);
    assert.equal(h.requests[0].headers['Idempotency-Key'], h.requests[1].headers['Idempotency-Key']);
    assert.equal(h.row().attempts, 2);
});
await check('Ambiguous response never triggers a fallback sender or fresh delivery identity', async () => {
    const h = createHarness({ SMTP_HOST: 'never-used.invalid', GMAIL_SERVICE_ACCOUNT_EMAIL: 'never-used@example.test' });
    await h.webhook();
    h.transport.mode = 'ambiguous';
    const d = h.load('src/lib/email-delivery.ts');
    assert.equal(await d.deliverEmail('order/test/' + ORDER_ID), 'queued');
    assert.match(h.row().last_error, /retry with the same delivery identity/);
    assert.equal(h.tables.orders[0].confirmation_sent_at, null);
    h.advance(120001);
    h.transport.mode = 'ok';
    assert.equal(await d.deliverEmail('order/test/' + ORDER_ID), 'sent');
    assert.deepEqual(h.requests.map(r => r.url), ['https://api.resend.com/emails', 'https://api.resend.com/emails']);
    assert.deepEqual(h.requests.map(r => r.headers['Idempotency-Key']), ['order/test/' + ORDER_ID, 'order/test/' + ORDER_ID]);
});
await check('Missing Resend configuration persists intent but cannot claim a send', async () => {
    const h = createHarness({ RESEND_API_KEY: '' });
    assert.equal((await h.webhook()).body.confirmation, 'queued');
    assert.equal(await h.load('src/lib/email-delivery.ts').deliverEmail('order/test/' + ORDER_ID), 'disabled');
    assert.equal(h.row().status, 'pending');
    assert.equal(h.row().attempts, 0);
    assert.equal(h.requests.length, 0);
    assert.equal(h.tables.orders[0].confirmation_sent_at, null);
});
await check('Receipt guards reject missing, unpaid, already-sent or missing-address orders', async () => {
    for (const status of ['pending', 'cancelled', 'refunded']) {
        const h = createHarness();
        h.seedReceipt({ status });
        assert.equal(await h.load('src/lib/email-delivery.ts').queueOrderConfirmation(h.store, ORDER_ID), 'not_paid');
        assert.equal(h.tables.email_deliveries.length, 0);
    }
    const missing = createHarness();
    assert.equal(await missing.load('src/lib/email-delivery.ts').queueOrderConfirmation(missing.store, ORDER_ID), 'not_paid');
    const sent = createHarness();
    sent.seedReceipt({ confirmation_sent_at: '2026-10-28T11:59:00Z' });
    assert.equal(await sent.load('src/lib/email-delivery.ts').queueOrderConfirmation(sent.store, ORDER_ID), 'already_sent');
    const noAddress = createHarness();
    noAddress.seedReceipt({ customer_email: null });
    await assert.rejects(() => noAddress.load('src/lib/email-delivery.ts').queueOrderConfirmation(noAddress.store, ORDER_ID), /no receipt address/);
});
await check('Delivery-result persistence failure never sets the order sent marker', async () => {
    const h = createHarness();
    await h.webhook();
    h.faults.save = true;
    await assert.rejects(() => h.load('src/lib/email-delivery.ts').deliverEmail('order/test/' + ORDER_ID), /could not be persisted/);
    assert.equal(h.row().status, 'sending');
    assert.equal(h.tables.orders[0].confirmation_sent_at, null);
    assert.equal(h.requests.length, 1);
});
await check('Authoritative sent ledger blocks duplicates if compatibility marker update fails', async () => {
    const h = createHarness();
    await h.webhook();
    h.faults.orderMarker = true;
    const d = h.load('src/lib/email-delivery.ts');
    assert.equal(await d.deliverEmail('order/test/' + ORDER_ID), 'sent');
    assert.equal(h.row().status, 'sent');
    assert.equal(h.tables.orders[0].confirmation_sent_at, null);
    assert.equal(await d.deliverEmail('order/test/' + ORDER_ID), 'already_sent_or_pending');
    assert.equal(h.requests.length, 1);
    assert.ok(h.errors.some(x => x.includes('ledger remains authoritative')));
});
finish(15);
