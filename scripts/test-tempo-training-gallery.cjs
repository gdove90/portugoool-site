const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const cp = require('node:child_process'), crypto = require('node:crypto'), ts = require('typescript');
const ROOT = path.resolve(__dirname, '..'), BASE = '7e159131932aa59317507986f1c3c54b4d5cf50f';
const ID = '80000000-0000-4000-8000-000000000021';
const plain = value => JSON.parse(JSON.stringify(value));
function loader(old = false) {
  const cache = new Map();
  return function load(file) {
    file = path.relative(ROOT, path.resolve(ROOT, file));
    if (cache.has(file)) return cache.get(file).exports;
    const source = old ? cp.execFileSync('git', ['show', BASE + ':' + file], { cwd: ROOT, encoding: 'utf8' }) : fs.readFileSync(path.join(ROOT, file), 'utf8');
    const module = { exports: {} }; cache.set(file, module);
    const req = id => id.startsWith('@/') || id.startsWith('.') ? load((id.startsWith('@/') ? 'src/' + id.slice(2) : path.join(path.dirname(file), id)) + '.ts') : require(id);
    new Function('require', 'module', 'exports', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText)(req, module, module.exports);
    return module.exports;
  };
}
const load = loader(), old = loader(true), catalog = load('src/lib/products.ts'), before = old('src/lib/products.ts');
const tee = catalog.getProductById(ID), prior = before.products.find(p => p.id === ID);
assert.ok(tee); assert.equal(tee.slug, prior.slug); assert.equal(tee.priceCents, 3400); assert.equal(tee.availableForSale, true);
assert.deepEqual(tee, { ...prior, availableForSale: true });
assert.deepEqual(tee.sizes, ['S', 'M', 'L', 'XL']);
assert.deepEqual(tee.colorVariants.map(v => v.name), ['White', 'Lake Blue', 'Light Purple']);
assert.equal(tee.originLabel, undefined); assert.equal(tee.disclosure, undefined);
for (const product of before.products) if (product.id !== ID) assert.deepEqual(catalog.products.find(p => p.id === product.id), product);
assert.deepEqual(load('src/v84/catalog-data.ts').forAudience('men'), old('src/v84/catalog-data.ts').forAudience('men'));
assert.deepEqual(load('src/v84/catalog-data.ts').forAudience('women').map(p => p.id), ['80000000-0000-4000-8000-000000000017', ID, '80000000-0000-4000-8000-000000000025']);
for (const id of load('src/lib/collection-launch.ts').TEMPO_PRODUCT_IDS) if (![ID, '80000000-0000-4000-8000-000000000017', '80000000-0000-4000-8000-000000000025'].includes(id)) assert.equal(catalog.getProductById(id), undefined);
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/catalog/tempo-training-tee-gallery-20261104.json'))), seen = new Set();
assert.equal(manifest.files.length, 15);
for (const variant of tee.colorVariants) {
  assert.deepEqual(variant.images.map(image => manifest.files.find(row => '/' + row.path.replace(/^public\//, '') === image.src)?.view), ['ghost-front', 'model-front', 'model-quarter', 'model-back', 'detail']);
  for (const image of variant.images) {
    assert.ok(!seen.has(image.src)); seen.add(image.src);
    const row = manifest.files.find(row => '/' + row.path.replace(/^public\//, '') === image.src);
    const bytes = fs.readFileSync(path.join(ROOT, row.path));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), row.sha256);
    assert.equal(row.width, 1024); assert.equal(row.height, 1536);
  }
}
assert.deepEqual(load('src/lib/size-charts.ts').sizeChartFor(ID).rows.map(row => row.size), tee.sizes);
const protectedPaths = ['src/app/api/checkout/route.ts', 'src/app/api/stripe-webhook/route.ts', 'src/lib/orders-store.ts', 'src/lib/fulfillment-submit.ts', 'src/lib/tapstitch-readiness.ts', 'src/lib/store-status.ts', 'netlify.toml', 'src/components/ProductGallery.tsx', 'src/components/ProductDetail.tsx', 'src/app/globals.css'];
for (const file of protectedPaths) if (fs.existsSync(path.join(ROOT, file))) assert.equal(fs.readFileSync(path.join(ROOT, file), 'utf8'), cp.execFileSync('git', ['show', BASE + ':' + file], { cwd: ROOT, encoding: 'utf8' }), file);
// Exercise the real checkout route using captured providers only. No real
// Stripe, database, email or supplier request is made.
const checkoutSource = fs.readFileSync(path.join(ROOT, 'src/app/api/checkout/route.ts'), 'utf8');
const moduleFixture = { exports: {} };
const sessions = [];
const mocks = {
  'next/server': { NextResponse: { json: (body, opts = {}) => ({ status: opts.status || 200, body }) } },
  stripe: class { checkout = { sessions: { create: async params => { sessions.push(params); return { url: 'https://checkout.stripe.com/offline-fixture' }; } } }; },
  '@/lib/migration-preview': { MIGRATION_PREVIEW: false }, '@/lib/store-status': { storeClosed: () => false },
  '@/lib/products': catalog, '@/lib/types': load('src/lib/types.ts'), '@/lib/fulfillment': load('src/lib/fulfillment.ts'),
  '@/lib/shipping': load('src/lib/shipping.ts'), '@/lib/discount': {}, '@/lib/signups': { EMAIL_RE: /@/ }, '@/lib/meta-capi': {clientIpFrom:()=>null}, '@/lib/tapstitch-readiness': {tapstitchFulfillmentReady:async()=>true}
};
new Function('require', 'module', 'exports', 'process', ts.transpileModule(checkoutSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText)(name => { assert.ok(name in mocks, name); return mocks[name]; }, moduleFixture, moduleFixture.exports, { env: { STRIPE_SECRET_KEY: 'sk_test_offline_fixture', CHECKOUT_TEST_MODE: 'false' } });
(async () => {
  const request = body => ({ json: async () => body, headers: { get: () => null }, nextUrl: new URL('https://goalathletics.shop/api/checkout') });
  for (const color of tee.colorVariants) for (const size of tee.sizes) {
    const item = { productId: ID, size, color: color.name, quantity: 1, priceCents: 1 };
    const preview = await moduleFixture.exports.POST(request({items:[item],preview:true}));
    assert.equal(preview.status,200); assert.equal(preview.body.subtotalCents,3400); assert.equal(preview.body.totalCents,4095);
    const result = await moduleFixture.exports.POST(request({items:[item]}));
    assert.equal(result.status,200);
    const params=sessions.at(-1), snapshot=JSON.parse(params.metadata.items_0)[0];
    assert.equal(params.line_items[0].price_data.unit_amount,3400);
    assert.equal(snapshot.k,`TAP-${manifest.supplier_designs[color.name]}-${size}`); assert.equal(snapshot.a,null);
  }
  assert.equal(sessions.length,12);
  for (const [size,color] of [['XS','White'],['XXL','White'],['S','Black']]) assert.equal((await moduleFixture.exports.POST(request({items:[{productId:ID,size,color,quantity:1}]}))).status,400);
  assert.equal(sessions.length,12);
  console.log('PASS 15 unchanged images/order; only tee availability changed; 12 exact references at $34 and $40.95 single-item totals; invalid variants rejected; protected UI/commerce files unchanged. Captured providers only.');
})().catch(error => { console.error(error); process.exitCode = 1; });
