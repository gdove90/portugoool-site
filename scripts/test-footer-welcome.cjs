const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const harness = fs.readFileSync(path.join(__dirname, 'test-launch-backend.cjs'), 'utf8').split('(async()=>{')[0];
const { load, memory } = new Function('require', '__dirname', harness + ';return {load,memory};')(require, __dirname);
let passed = 0;
async function check(name, fn) { await fn(); passed++; console.log('PASS ' + name); }
const req = email => ({ json: async () => ({ email, consent: 'denied' }) });

(async () => {
  process.env.RESEND_API_KEY = 're_mock';
  process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
  const db = memory();
  const sent = [], attempts = [], codes = new Map();
  let unavailable = false, failProvider = false;
  global.fetch = async (url, opt = {}) => {
    const body = opt.body ? JSON.parse(opt.body) : null;
    if (String(url).endsWith('/emails')) {
      attempts.push(opt.headers['Idempotency-Key']);
      if (failProvider) return { ok: false, status: 503, json: async () => ({}) };
      sent.push({ body, key: opt.headers['Idempotency-Key'] });
      return { ok: true, status: 200, json: async () => ({ id: 'mock-' + sent.length }) };
    }
    if (String(url).endsWith('/audiences')) return { ok: true, json: async () => ({ data: [{ id: 'aud_mock', name: 'goool' }] }) };
    if (String(url).includes('/audiences/aud_mock/contacts')) return { ok: true, status: 200, json: async () => ({ id: 'contact' }) };
    throw new Error('Unexpected network destination: ' + url);
  };
  const mocks = {
    './supabase': { getSupabaseAdmin: () => db },
    '@/lib/discount': { issueDiscountCode: async email => {
      if (unavailable) return { status: 'unavailable', reason: 'mock outage' };
      if (email === 'returning@example.com') return { status: 'redeemed' };
      if (!codes.has(email)) codes.set(email, 'GOOOL20-QA' + codes.size);
      return { status: 'existing', code: codes.get(email) };
    } },
    '@/lib/meta-capi': { clientIpFrom: () => null, sendMetaServerEvent: async () => {} },
  };
  const cache = {};
  const newsletter = load('src/app/api/newsletter/route.ts', mocks, cache);
  const popup = load('src/app/api/discount/route.ts', mocks, cache);
  const delivery = load('src/lib/email-delivery.ts', mocks, cache);
  const signups = load('src/lib/signups.ts', mocks, cache);
  await check('Footer and renovation signup sends a welcome from Hello with Support replies and discount', async () => {
    const response = await newsletter.POST(req('  New@Example.com  '));
    assert.equal(response.status, 200);
    assert.equal(response.body.code, 'GOOOL20-QA0');
    const row = db.tables.newsletter_signups[0];
    assert.equal(row.email, 'new@example.com'); assert.equal(row.source, 'footer'); assert.ok(row.sent_at_email1);
    const message = sent[0].body;
    assert.equal(message.from, 'GOAL Athletics <hello@goalathletics.shop>');
    assert.equal(message.reply_to, 'support@goalathletics.shop');
    assert.deepEqual(message.to, ['new@example.com']);
    assert.match(message.text, /Thanks for joining our community/);
    assert.match(message.text, /Your code: GOOOL20-QA0/);
    assert.match(message.html, /href="mailto:support@goalathletics.shop"/);
    assert.match(message.text, /PO Box 19, Saunderstown, RI 02874/);
    assert.ok(message.headers['List-Unsubscribe'].includes('https://goalathletics.shop/unsubscribe/' + row.unsubscribe_token));
    assert.equal(message.headers['List-Unsubscribe-Post'], 'List-Unsubscribe=One-Click');
    fs.mkdirSync(path.join(__dirname, '../tmp'), { recursive: true });
    fs.writeFileSync(path.join(__dirname, '../tmp/welcome-email-preview.html'), message.html);
  });
  await check('Repeated and concurrent popup/footer signups cannot duplicate welcome delivery', async () => {
    await Promise.all([newsletter.POST(req('new@example.com')), popup.POST(req('new@example.com')), newsletter.POST(req('new@example.com'))]);
    assert.equal(sent.length, 1); assert.equal(db.tables.email_deliveries.length, 1);
    await Promise.all([newsletter.POST(req('race@example.com')), popup.POST(req('race@example.com'))]);
    assert.equal(sent.length, 2); assert.equal(db.tables.newsletter_signups.length, 2);
  });
  await check('Invalid input has no signup, code or delivery side effects', async () => {
    const count = db.tables.newsletter_signups.length;
    for (const route of [newsletter, popup]) for (const email of ['', 'no-address', 'x'.repeat(255) + '@example.com']) {
      assert.equal((await route.POST(req(email))).status, 400);
    }
    assert.equal(db.tables.newsletter_signups.length, count);
  });
  await check('A subscriber who used their offer still receives a welcome without a second discount', async () => {
    const response = await newsletter.POST(req('returning@example.com'));
    assert.equal(response.status, 200); assert.equal(response.body.code, null); assert.equal(response.body.redeemed, true);
    assert.equal(sent.at(-1).body.subject, 'Welcome back to GOAL');
    assert.match(sent.at(-1).body.text, /discount has already been used/);
    const count = sent.length;
    await popup.POST(req('returning@example.com')); assert.equal(sent.length, count);
  });
  await check('Code outage returns a retryable error and recovers without losing the signup', async () => {
    unavailable = true;
    assert.equal((await newsletter.POST(req('recover@example.com'))).status, 503);
    assert.ok(db.tables.newsletter_signups.some(row => row.email === 'recover@example.com'));
    unavailable = false;
    assert.equal((await newsletter.POST(req('recover@example.com'))).status, 200);
  });
  await check('Disabled email and failed durable storage never report a welcome success', async () => {
    delete process.env.RESEND_API_KEY;
    assert.equal((await newsletter.POST(req('disabled@example.com'))).status, 503);
    assert.ok(!db.tables.newsletter_signups.some(row => row.email === 'disabled@example.com'));
    process.env.RESEND_API_KEY = 're_mock';
    const broken = load('src/app/api/newsletter/route.ts', { ...mocks,
      '@/lib/email-delivery': { queueEmail: async () => { throw Error('storage down'); } },
    });
    assert.equal((await broken.POST(req('storage@example.com'))).status, 503);
  });
  await check('Provider failure stays durable and retries with the same identity', async () => {
    failProvider = true;
    assert.equal((await newsletter.POST(req('retry@example.com'))).status, 200);
    const row = db.tables.email_deliveries.find(row => row.message.to === 'retry@example.com');
    assert.equal(row.status, 'pending'); assert.ok(!row.sent_at);
    failProvider = false; row.next_attempt_at = new Date(0).toISOString();
    assert.equal(await delivery.deliverEmail(row.key), 'sent');
    assert.equal(attempts.filter(key => key === row.key).length, 2);
    assert.equal(sent.filter(message => message.key === row.key).length, 1);
  });
  await check('Unsubscribe suppresses an already-queued welcome and future retries', async () => {
    failProvider = true;
    await newsletter.POST(req('leave@example.com'));
    const subscriber = db.tables.newsletter_signups.find(row => row.email === 'leave@example.com');
    await signups.unsubscribeByToken(subscriber.unsubscribe_token);
    const row = db.tables.email_deliveries.find(row => row.message.to === subscriber.email);
    row.next_attempt_at = new Date(0).toISOString(); failProvider = false;
    const count = attempts.length;
    assert.equal(await delivery.deliverEmail(row.key), 'suppressed');
    assert.equal(row.status, 'needs_review'); assert.ok(!row.sent_at);
    await delivery.deliverEmail(row.key); await delivery.drainEmailQueue(false);
    assert.equal(attempts.length, count);
  });
  await check('Marketing requires an active subscription; transactional updates remain deliverable after opt-out', async () => {
    const message = { to: 'unknown@example.com', subject: 'test', text: 'test', html: 'test' };
    await delivery.queueEmail('missing', 'discount', message, false);
    assert.equal(await delivery.deliverEmail('missing'), 'suppressed');
    await delivery.queueEmail('shipment/test/check', 'order', { ...message, to: 'leave@example.com' }, false);
    assert.equal(await delivery.deliverEmail('shipment/test/check'), 'sent');
  });
  await check('Every automated email template has a linked Support address and plain-text contact', async () => {
    const url = 'https://goalathletics.shop/unsubscribe/00000000-0000-4000-8000-000000000000';
    const order = { id: '99999999-1111-4444-8888-999999999999', status: 'paid', currency: 'usd', total_cents: 1000, subtotal_cents: 1000, shipping_cents: 0, tax_cents: 0, discount_cents: 0, livemode: false };
    const messages = [
      load('src/lib/emails/welcome-1.ts').buildWelcome1({ code: 'QA', unsubscribeUrl: url }),
      load('src/lib/emails/welcome-2.ts').buildWelcome2({ code: 'QA', productUrl: 'https://goalathletics.shop/shop', imageUrl: '', imageAlt: '', unsubscribeUrl: url }),
      load('src/lib/emails/welcome-3.ts').buildWelcome3({ code: 'QA', unsubscribeUrl: url }),
      load('src/lib/emails/order-confirmation.ts').buildOrderConfirmation({ order, items: [] }),
      load('src/lib/emails/order-delay-notice.ts').buildOrderDelayNotice(order),
      load('src/lib/emails/shipment-notification.ts').buildShipmentNotification(order, { tracking_numbers: ['TEST'], tracking_company: 'USPS' }),
      load('src/lib/emails/fulfillment-alert.ts').buildFulfillmentAlert({ order, items: [], parkedAs: 'failed', reason: 'test' }),
    ];
    for (const message of messages) {
      assert.match(message.html, /href="mailto:support@goalathletics.shop"/, message.subject);
      assert.match(message.text, /support@goalathletics.shop/, message.subject);
    }
  });
  console.log(`${passed} signup and email checks passed. All provider calls were mocked.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
