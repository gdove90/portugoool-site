// Published ST720 GA tees: $38, S–2XL, four selectable colorways each.
// Silver and White/Royal removed; historical mappings stay intact.
// No network, database or provider calls.
const fs = require('fs'), assert = require('assert/strict'), ts = require('typescript'), vm = require('vm');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, resolveJsonModule: true, esModuleInterop: true } }).outputText, f);
const p = require('../src/lib/products.ts'), f = require('../src/lib/fulfillment.ts'), types = require('../src/lib/types.ts');
const ORDER = ['Black', 'True Royal', 'White · Black-Red', 'True Red'];
const TEES = {
  'goal-athletics-ga-minimal-tee': { id: '80000000-0000-4000-8000-000000000011', ids: [6206620, 6206254, 6206255, 6206681], removed: { Silver: 6206263, 'White · Royal': 6206257 } },
  'goal-athletics-ga-big-tee': { id: '80000000-0000-4000-8000-000000000012', ids: [6206229, 6206234, 6206236, 6206251], removed: { Silver: 6206241, 'White · Royal': 6206239 } },
};
const SIZES = { S: 6, M: 7, L: 8, XL: 1, XXL: 2 };
const APPROVED = require('./fixtures/approved-supplier-catalog-20261028.json');
(async () => {
  let variants = 0;
  for (const [slug, tee] of Object.entries(TEES)) {
    const product = p.products.find(x => x.slug === slug);
    assert(product && product.id === tee.id, `${slug} present`);
    assert.equal(product.isActive, true, `${slug} published in catalog`);
    assert.equal(product.availableForSale, true);
    assert.equal(product.priceCents, 3800, `${slug} owner approved current tee price`);
    assert.equal(p.getProductBySlug(slug), product);
    assert.equal(p.getProductById(tee.id), product);
    assert.equal(product.category, 'tshirt');
    assert.equal(product.blank, 'ST720');
    assert.deepEqual(product.sizes, Object.keys(SIZES));
    assert.deepEqual(product.colorVariants.map(v => v.name), ORDER);
    product.colorVariants.forEach((variant, i) => {
      const id = tee.ids[i];
      for (const [size, code] of Object.entries(SIZES))
        assert.deepEqual(f.resolveApliiqSku(tee.id, variant.name, size), { supplier: 'apliiq', apliiqProductId: id, sku: `APQ-${id}S${code}A1` }, `${slug} ${variant.name} ${size}`);
      const expectedImages = APPROVED.products.find(p => p.id === tee.id).colors.find(c => c.name === variant.name).images;
      assert.deepEqual(variant.images, expectedImages, 'approved image sequence and alt text');
      for (const image of variant.images) {
        assert(fs.existsSync('public' + image.src), image.src);
        assert.equal(image.caption, undefined, 'retired concept-render captions stay absent');
      }
      variants++;
    });
  }
  assert.equal(new Set(p.products.map(x => x.slug)).size, p.products.length, 'no duplicate slugs');
  assert.equal(new Set(p.products.map(x => x.id)).size, p.products.length, 'no duplicate ids');
  // The renovation gate still refuses checkout before Stripe.
  const source = fs.readFileSync('src/app/api/checkout/route.ts', 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  let providerCalls = 0;
  const context = { exports: {}, process: { env: { STRIPE_SECRET_KEY: 'sk_live_fixture_not_a_key' } }, require: n => n === 'next/server' ? { NextResponse: { json: (body, init) => ({ body, status: init?.status ?? 200 }) } } : n === 'stripe' ? { default: class { constructor() { providerCalls++; throw Error('Provider must never be reached'); } } } : n === '@/lib/migration-preview' ? { MIGRATION_PREVIEW: false } : n === '@/lib/store-status' ? { storeClosed: () => true } : n === '@/lib/products' ? p : n === '@/lib/types' ? types : n === '@/lib/fulfillment' ? f : {} };
  vm.runInNewContext(compiled, context);
  for (const tee of Object.values(TEES)) for (const color of ORDER) {
    const r = await context.exports.POST({ json: async () => ({ items: [{ productId: tee.id, size: 'M', color, quantity: 1, customName: null, customNumber: null }] }), headers: { get: () => null } });
    assert.equal(r.status, 503, `${tee.id} ${color} refused by renovation gate`);
  }
  assert.equal(providerCalls, 0);
  // Execute the real route with an in-memory Stripe adapter: verify the
  // price and immutable supplier snapshot, without creating any real session.
  let captured;
  const open = { exports: {}, process: { env: { STRIPE_SECRET_KEY: 'sk_test_fixture_not_a_key', NEXT_PUBLIC_SITE_URL: 'https://goalathletics.shop' } }, require: n => {
    if (n === 'stripe') return class { constructor() { this.checkout = { sessions: { create: async input => { captured = input; return { url: 'https://checkout.example.test/fixture' }; } } }; } };
    if (n === '@/lib/store-status') return { storeClosed: () => false };
    if (n === '@/lib/shipping') return require('../src/lib/shipping.ts');
    if (n === '@/lib/meta-capi') return { clientIpFrom: () => null };
    return context.require(n);
  } };
  vm.runInNewContext(compiled, open);
  for (const tee of Object.values(TEES)) for (const color of ORDER) for (const size of Object.keys(SIZES)) {
    const r = await open.exports.POST({ json: async () => ({ items: [{ productId: tee.id, size, color, quantity: 2, customName: null, customNumber: null }] }), headers: { get: () => null } });
    assert.equal(r.status, 200);
    assert.equal(captured.line_items[0].price_data.unit_amount, 3800);
    assert.equal(captured.line_items[0].quantity, 2);
    const snapshot = JSON.parse(Object.keys(captured.metadata).filter(k => k.startsWith('items_')).sort().map(k => captured.metadata[k]).join(''))[0];
    assert.equal(snapshot.k, f.resolveApliiqSku(tee.id, color, size).sku);
    assert.equal(snapshot.a, f.resolveApliiqSku(tee.id, color, size).apliiqProductId);
    assert.equal(snapshot.u * snapshot.q, 7600);
    assert.equal(captured.cancel_url, 'https://goalathletics.shop/cart');
    assert.match(captured.success_url, /^https:\/\/goalathletics\.shop\/success/);
  }
  for (const tee of Object.values(TEES)) for (const [color, supplierId] of Object.entries(tee.removed)) {
    captured = undefined;
    const r = await open.exports.POST({ json: async () => ({ items: [{ productId: tee.id, size: 'M', color, quantity: 1, customName: null, customNumber: null }] }), headers: { get: () => null } });
    assert.equal(r.status, 400, `removed ${color} rejected even if store opens`);
    assert.equal(captured, undefined, 'removed color never creates checkout');
    for (const [size, code] of Object.entries(SIZES)) assert.deepEqual(f.resolveApliiqSku(tee.id, color, size), { supplier: 'apliiq', apliiqProductId: supplierId, sku: `APQ-${supplierId}S${code}A1` }, `historical ${color} mapping preserved`);
  }
  console.log(`PASS 2 ST720 tees at $38, ${variants} selectable colorways and 40 size mappings; removed colors denied, historical mappings preserved, S–2XL unchanged. No network/database/provider calls.`);
})().catch(e => { console.error(e); process.exitCode = 1; });
