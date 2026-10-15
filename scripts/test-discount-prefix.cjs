const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const harness = fs.readFileSync(path.join(__dirname, 'test-launch-backend.cjs'), 'utf8').split('(async()=>{')[0];
const { load, memory } = new Function('require', '__dirname', harness + ';return {load,memory};')(require, __dirname);
let passed = 0;
async function check(name, fn) { await fn(); passed++; console.log('PASS ' + name); }

(async () => {
  process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
  const db = memory(), created = [];
  class Stripe {
    coupons = { list: async () => ({ data: [{ id: 'existing_coupon', valid: true, percent_off: 20, metadata: { source: 'goool20-popup' } }] }) };
    promotionCodes = {
      create: async params => { created.push(params); return { id: 'promo_' + created.length }; },
      retrieve: async () => ({ times_redeemed: 0 }),
      update: async () => ({}),
    };
  }
  const discount = load('src/lib/discount.ts', { stripe: Stripe, './supabase': { getSupabaseAdmin: () => db } });
  await check('New codes use GOAL20 and preserve the existing coupon, one-use rule and 14-day expiry', async () => {
    const before = Math.floor(Date.now() / 1000);
    const result = await discount.issueDiscountCode('new@example.com');
    assert.equal(result.status, 'issued');
    assert.match(result.code, /^GOAL20-[A-HJ-NP-Z2-9]{4}$/);
    const params = created[0], row = db.tables.discount_codes[0];
    assert.equal(params.code, result.code);
    assert.equal(params.coupon, 'existing_coupon');
    assert.equal(params.max_redemptions, 1);
    assert.deepEqual(params.restrictions, { first_time_transaction: true });
    assert.ok(Math.abs(params.expires_at - (before + 14 * 86400)) <= 2);
    assert.equal(row.expires_at, new Date(params.expires_at * 1000).toISOString());
    assert.deepEqual(await discount.issueDiscountCode('new@example.com'), { status: 'existing', code: result.code });
    assert.equal(created.length, 1);
  });
  const legacy = { email_hash: discount.emailHash('legacy@example.com'), code: 'GOOOL20-DH52', stripe_promotion_code_id: 'legacy', livemode: false, expires_at: new Date(Date.now() + 86400000).toISOString(), redeemed_at: null };
  db.tables.discount_codes.push(legacy);
  await check('An unexpired legacy code remains unchanged on repeat signup', async () => {
    assert.deepEqual(await discount.issueDiscountCode('legacy@example.com'), { status: 'existing', code: legacy.code });
    assert.equal(created.length, 1);
  });
  await check('An expired unused legacy code renews with GOAL20; a redeemed code gets no second discount', async () => {
    legacy.expires_at = '2000-01-01';
    const result = await discount.issueDiscountCode('legacy@example.com');
    assert.equal(result.status, 'issued');
    assert.match(result.code, /^GOAL20-/);
    assert.equal(db.tables.discount_codes.length, 2);
    legacy.redeemed_at = new Date().toISOString();
    assert.deepEqual(await discount.issueDiscountCode('legacy@example.com'), { status: 'redeemed' });
    assert.equal(created.length, 2);
  });
  for (const prefix of ['GOAL20', 'GOOOL20']) {
    await check(prefix + ' validates with the same email, expiry and redemption checks', async () => {
      const code = prefix + '-DH52';
      const promo = { id: 'validation', active: true, expires_at: Math.floor(Date.now() / 1000) + 86400, max_redemptions: 1, times_redeemed: 0, metadata: { email_hash: discount.emailHash('buyer@example.com') }, coupon: { valid: true, percent_off: 20 } };
      const stripe = { promotionCodes: { list: async params => { assert.equal(params.code, code); return { data: [promo] }; } } };
      assert.deepEqual(await discount.validatePromotionCode(stripe, ' ' + code.toLowerCase() + ' ', 'buyer@example.com'), { ok: true, promotionCodeId: promo.id, code, percentOff: 20 });
      assert.deepEqual(await discount.validatePromotionCode(stripe, code, 'other@example.com'), { ok: false, reason: 'email' });
      promo.times_redeemed = 1;
      assert.deepEqual(await discount.validatePromotionCode(stripe, code, 'buyer@example.com'), { ok: false, reason: 'used' });
      promo.times_redeemed = 0;
      promo.expires_at = 1;
      assert.deepEqual(await discount.validatePromotionCode(stripe, code, 'buyer@example.com'), { ok: false, reason: 'expired' });
    });
  }
  await check('Invalid code formats are rejected before Stripe and show the new branded example', async () => {
    const stripe = { promotionCodes: { list: async () => { throw new Error('Invalid code reached Stripe'); } } };
    for (const code of ['GOAL20', 'GOOOL20', 'GOAL20-ABC', 'GOAL20-ABCDE', 'OTHER20-DH52']) {
      assert.deepEqual(await discount.validatePromotionCode(stripe, code, 'buyer@example.com'), { ok: false, reason: 'format' });
    }
    assert.match(discount.CODE_REJECTION_MESSAGE.format, /GOAL20-XXXX/);
  });
  console.log(`${passed} discount prefix checks passed.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
