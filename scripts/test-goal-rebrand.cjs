const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function load(file, mocks = {}, cache = {}) {
  const full = path.resolve(file);
  if (cache[full]) return cache[full];
  const source = ts.transpileModule(fs.readFileSync(full, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  const module = { exports: {} };
  const req = id => {
    if (id in mocks) return mocks[id];
    if (id === 'next/server') return { NextResponse: { json: (body, options = {}) => ({ status: options.status || 200, body }) } };
    if (id.startsWith('@/')) return load('src/' + id.slice(2) + '.ts', mocks, cache);
    if (id.startsWith('.')) return load(path.resolve(path.dirname(full), id + '.ts'), mocks, cache);
    return require(id);
  };
  new Function('require', 'module', 'exports', source)(req, module, module.exports);
  return cache[full] = module.exports;
}

async function main() {
  const id = '1234abcd-1234-4000-8000-000000000001';
  const orders = [{ id, status: 'paid', fulfillment_status: 'shipped' }];
  const route = load('src/app/api/track-order/route.ts', {
    '@/lib/orders-store': { getOrdersStore: () => ({
      listOrdersByEmail: async email => email === 'owner@example.test' ? orders : [],
      listShipments: async () => [{ tracking_company: 'USPS', tracking_numbers: ['123'], tracking_urls: ['https://example.test/123'] }],
    }) },
  });
  for (const reference of ['GOAL-1234ABCD', 'GOOOL-1234ABCD', '  goool-1234abcd  ']) {
    const response = await route.POST({ json: async () => ({ reference, email: 'owner@example.test' }) });
    assert.equal(response.status, 200);
    assert.equal(response.body.reference, 'GOAL-1234ABCD');
    assert.equal(response.body.shipments.length, 1);
    const wrongEmail = await route.POST({ json: async () => ({ reference, email: 'someone@example.test' }) });
    assert.equal(wrongEmail.status, 404);
  }
  for (const reference of ['GOAL-1234ABC', 'OTHER-1234ABCD', 'GOAL-1234ABCDX']) {
    assert.equal((await route.POST({ json: async () => ({ reference, email: 'owner@example.test' }) })).status, 400);
  }
  console.log('PASS New and historical order references work only with the correct email.');

  const discount = load('src/lib/discount.ts', { './supabase': { getSupabaseAdmin: () => null } });
  for (const code of ['GOAL20-AB23', 'GOOOL20-AB23']) {
    const promo = { id: 'promo-test', active: true, max_redemptions: 1, times_redeemed: 0,
      metadata: { email_hash: discount.emailHash('owner@example.test') }, coupon: { valid: true, percent_off: 20 } };
    const stripe = { promotionCodes: { list: async query => { assert.equal(query.code, code); return { data: [promo] }; } } };
    assert.equal((await discount.validatePromotionCode(stripe, code.toLowerCase(), 'owner@example.test')).ok, true);
    assert.deepEqual(await discount.validatePromotionCode(stripe, code, 'someone@example.test'), { ok: false, reason: 'email' });
    promo.times_redeemed = 1;
    assert.deepEqual(await discount.validatePromotionCode(stripe, code, 'owner@example.test'), { ok: false, reason: 'used' });
  }
  console.log('PASS New and historical discount codes retain ownership and single-use checks.');
  const receipt = load('src/lib/emails/order-confirmation.ts');
  assert.equal(receipt.orderNumberFor(id), 'GOAL-1234ABCD');
  console.log('PASS Receipts use the same GOAL reference as tracking.');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
