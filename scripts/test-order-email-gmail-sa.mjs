/** Historical filename retained. This now protects supported Resend transport,
 * mode isolation and queue retry boundaries, not the removed Gmail adapter.
 * No server, credentials or positional arguments are required. */
import assert from 'node:assert/strict';
import harness from './fixtures/resend-queue-harness.cjs';
const { createHarness, reporter, ORDER_ID } = harness, { check, finish } = reporter('Resend isolation');
const message = { to: 'buyer@example.test', subject: 'Fixture receipt', html: '<p>Fixture receipt</p>', text: 'Fixture receipt', replyTo: 'legacy@example.test', headers: { 'X-Fixture': 'queue' } };
await check('SMTP and Gmail settings alone cannot enable an unsupported sender', async () => {
    const h = createHarness({ RESEND_API_KEY: '', SMTP_HOST: 'smtp.fixture.invalid', SMTP_USER: 'old@example.test', SMTP_PASS: 'dummy', GMAIL_SERVICE_ACCOUNT_EMAIL: 'old@example.test', GMAIL_PRIVATE_KEY: 'dummy', EMAIL_FROM: 'spoof@example.test' }), e = h.load('src/lib/email.ts');
    assert.equal(e.emailEnabled(), false);
    assert.equal(e.emailProvider(), 'disabled');
    const r = await e.sendEmail(message, 'fixture/disabled');
    assert.equal(r.sent, false);
    assert.equal(r.disabled, true);
    assert.equal(h.requests.length, 0);
});
await check('Resend payload retains brand sender, Support reply, content and delivery identity', async () => {
    const h = createHarness({ SMTP_HOST: 'ignored.invalid', GMAIL_SERVICE_ACCOUNT_EMAIL: 'ignored@example.test', EMAIL_FROM: 'spoof@example.test' }), e = h.load('src/lib/email.ts');
    assert.equal(e.emailProvider(), 'resend');
    assert.equal(e.emailFrom(), 'GOAL Athletics <hello@goalathletics.shop>');
    assert.equal((await e.sendEmail(message, 'fixture/identity')).provider, 'resend');
    const r = h.requests[0];
    assert.equal(r.body.from, 'GOAL Athletics <hello@goalathletics.shop>');
    assert.equal(r.body.reply_to, 'support@goalathletics.shop');
    assert.deepEqual(r.body.to, ['buyer@example.test']);
    assert.equal(r.headers['Idempotency-Key'], 'fixture/identity');
    assert.equal(r.headers['Content-Type'], 'application/json');
    assert.deepEqual(r.body.headers, { 'X-Fixture': 'queue' });
    assert.equal(r.body.html, message.html);
    assert.equal(r.body.text, message.text);
    assert.equal(r.body.subject, message.subject);
});
await check('Invalid recipients are rejected before any provider request', async () => {
    for (const to of ['missing-at', 'buyer@example.test\nBcc: other@example.test', 'x'.repeat(255) + '@example.test']) {
        const h = createHarness(), r = await h.load('src/lib/email.ts').sendEmail({ ...message, to }, 'fixture/invalid');
        assert.equal(r.sent, false);
        assert.equal(r.reason, 'Invalid recipient address.');
        assert.equal(h.requests.length, 0);
    }
});
await check('Missing delivery identity cannot send without idempotency', async () => {
    const h = createHarness(), r = await h.load('src/lib/email.ts').sendEmail(message, '');
    assert.equal(r.sent, false);
    assert.equal(r.reason, 'Missing delivery identity.');
    assert.equal(h.requests.length, 0);
});
await check('Local fixture override is allowed outside production', async () => {
    const h = createHarness({ RESEND_API_BASE: 'http://127.0.0.1:4455' });
    assert.equal((await h.load('src/lib/email.ts').sendEmail(message, 'fixture/local')).sent, true);
    assert.equal(h.requests[0].url, 'http://127.0.0.1:4455/emails');
});
await check('Production and Netlify contexts reject the local endpoint override', async () => {
    for (const extra of [{ NODE_ENV: 'production' }, { NETLIFY: 'true' }]) {
        const h = createHarness({ RESEND_API_BASE: 'http://127.0.0.1:4455', ...extra });
        await h.load('src/lib/email.ts').sendEmail(message, 'fixture/production');
        assert.equal(h.requests[0].url, 'https://api.resend.com/emails');
        assert.equal(h.requests.length, 1);
    }
});
await check('HTTP errors, missing provider IDs and malformed responses cannot claim success', async () => {
    for (const mode of ['reject', 'server', 'missing-id', 'bad-json']) {
        const h = createHarness();
        h.transport.mode = mode;
        const r = await h.load('src/lib/email.ts').sendEmail(message, 'fixture/error/' + mode);
        assert.equal(r.sent, false);
        assert.match(r.reason, /Email provider returned HTTP (200|422|503)/);
        assert.equal(h.requests.length, 1);
    }
});
await check('Ambiguous responses retry only Resend with the same idempotency key', async () => {
    const h = createHarness({ SMTP_HOST: 'ignored.invalid', GMAIL_SERVICE_ACCOUNT_EMAIL: 'ignored@example.test' });
    h.transport.mode = 'ambiguous';
    const e = h.load('src/lib/email.ts');
    assert.equal((await e.sendEmail(message, 'fixture/ambiguous')).sent, false);
    h.transport.mode = 'ok';
    assert.equal((await e.sendEmail(message, 'fixture/ambiguous')).sent, true);
    assert.deepEqual(h.requests.map(r => r.url), ['https://api.resend.com/emails', 'https://api.resend.com/emails']);
    assert.deepEqual(h.requests.map(r => r.headers['Idempotency-Key']), ['fixture/ambiguous', 'fixture/ambiguous']);
});
await check('Live and test receipt keys cannot collapse into one ledger row', async () => {
    const h = createHarness(), d = h.load('src/lib/email-delivery.ts');
    await d.queueEmail('order/live/' + ORDER_ID, 'order', message, true, ORDER_ID);
    await d.queueEmail('order/test/' + ORDER_ID, 'order', message, false, ORDER_ID);
    assert.equal(h.tables.email_deliveries.length, 2);
    assert.deepEqual(h.tables.email_deliveries.map(r => [r.key, r.livemode]), [['order/live/' + ORDER_ID, true], ['order/test/' + ORDER_ID, false]]);
});
await check('Queue drain sends only requested mode and no more than three due deliveries', async () => {
    const h = createHarness(), d = h.load('src/lib/email-delivery.ts');
    for (let i = 0; i < 5; i++)
        await d.queueEmail('order/test/fixture-' + i, 'order', message, false);
    await d.queueEmail('order/live/live-only', 'order', message, true);
    const r = await d.drainEmailQueue(false);
    assert.equal(r.sent, 3);
    assert.equal(h.requests.length, 3);
    assert.ok(h.requests.every(r => r.headers['Idempotency-Key'].startsWith('order/test/')));
    assert.equal(h.tables.email_deliveries.filter(r => r.livemode === false && r.status === 'pending').length, 2);
    assert.equal(h.tables.email_deliveries.find(r => r.key === 'order/live/live-only').status, 'pending');
});
await check('Future retry backoff is not drained early', async () => {
    const h = createHarness(), d = h.load('src/lib/email-delivery.ts');
    await d.queueEmail('order/test/future', 'order', message, false);
    h.tables.email_deliveries[0].next_attempt_at = new Date(h.clock.now + 60000).toISOString();
    assert.equal(Object.keys(await d.drainEmailQueue(false)).length, 0);
    assert.equal(h.requests.length, 0);
    assert.equal(h.tables.email_deliveries[0].attempts, 0);
});
await check('23-hour retry window parks selected-mode records without another provider send', async () => {
    const h = createHarness(), d = h.load('src/lib/email-delivery.ts');
    await d.queueEmail('order/test/expired', 'order', message, false);
    await d.queueEmail('order/live/other-mode', 'order', message, true);
    h.tables.email_deliveries.forEach(r => { r.first_attempt_at = new Date(h.clock.now - 24 * 3600000).toISOString(); });
    assert.equal(Object.keys(await d.drainEmailQueue(false)).length, 0);
    assert.equal(h.requests.length, 0);
    assert.equal(h.tables.email_deliveries[0].status, 'needs_review');
    assert.match(h.tables.email_deliveries[0].last_error, /reconcile provider before resending/);
    assert.equal(h.tables.email_deliveries[1].status, 'pending');
});
await check('Active lease blocks a second send while an expired lease retries the same identity', async () => {
    const h = createHarness(), d = h.load('src/lib/email-delivery.ts'), key = 'order/test/lease';
    await d.queueEmail(key, 'order', message, false);
    const r = h.tables.email_deliveries[0];
    r.status = 'sending';
    r.lease_until = new Date(h.clock.now + 120000).toISOString();
    r.first_attempt_at = new Date(h.clock.now).toISOString();
    assert.equal(await d.deliverEmail(key), 'already_sent_or_pending');
    assert.equal(h.requests.length, 0);
    h.advance(120001);
    assert.equal(await d.deliverEmail(key), 'sent');
    assert.equal(h.requests[0].headers['Idempotency-Key'], key);
});
await check('Unsubscribed marketing is suppressed while transactional receipts still send', async () => {
    const h = createHarness(), d = h.load('src/lib/email-delivery.ts');
    h.tables.newsletter_signups.push({ email: 'buyer@example.test', unsubscribed_at: '2026-10-27T00:00:00Z' });
    await d.queueEmail('discount/test/fixture', 'discount', message, false);
    assert.equal(await d.deliverEmail('discount/test/fixture'), 'suppressed');
    assert.equal(h.requests.length, 0);
    assert.equal(h.tables.email_deliveries[0].status, 'needs_review');
    await d.queueEmail('order/test/receipt', 'order', message, false);
    assert.equal(await d.deliverEmail('order/test/receipt'), 'sent');
    assert.equal(h.requests.length, 1);
});
await check('Claim, read and parking storage failures stay explicit instead of reporting sent', async () => {
    const h = createHarness(), d = h.load('src/lib/email-delivery.ts');
    await d.queueEmail('order/test/failure', 'order', message, false);
    h.faults.claim = true;
    await assert.rejects(() => d.deliverEmail('order/test/failure'), /claim unavailable/);
    assert.equal(h.requests.length, 0);
    h.faults.claim = false;
    h.faults.queueRead = true;
    await assert.rejects(() => d.drainEmailQueue(false), /queue read failed/);
    assert.equal(h.requests.length, 0);
    h.faults.queueRead = false;
    h.faults.park = true;
    await assert.rejects(() => d.drainEmailQueue(false), /retry-window check failed/);
    assert.equal(h.requests.length, 0);
});
await check('Disabled configuration neither claims a row nor invokes an old adapter', async () => {
    const h = createHarness({ RESEND_API_KEY: '', SMTP_HOST: 'ignored.invalid', GMAIL_SERVICE_ACCOUNT_EMAIL: 'ignored@example.test' }), d = h.load('src/lib/email-delivery.ts');
    await d.queueEmail('order/test/disabled', 'order', message, false);
    assert.equal((await d.drainEmailQueue(false)).disabled, 1);
    assert.equal(await d.deliverEmail('order/test/disabled'), 'disabled');
    assert.equal(h.tables.email_deliveries[0].status, 'pending');
    assert.equal(h.tables.email_deliveries[0].attempts, 0);
    assert.equal(h.requests.length, 0);
});
finish(16);
