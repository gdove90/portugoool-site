const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const cp = require('node:child_process'), crypto = require('node:crypto'), ts = require('typescript');
const ROOT = path.resolve(__dirname, '..'), BASE = '522500ddc7aa94e9990734564a3fd309a682e868';
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
assert.ok(tee); assert.equal(tee.slug, prior.slug); assert.equal(tee.priceCents, 3400); assert.equal(tee.availableForSale, false);
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
// Exercise the real checkout route with an isolated request. A mocked Stripe
// constructor throws if reached; all variants must refuse before any session.
const checkoutSource = fs.readFileSync(path.join(ROOT, 'src/app/api/checkout/route.ts'), 'utf8');
const moduleFixture = { exports: {} };
const mocks = {
  'next/server': { NextResponse: { json: (body, opts = {}) => ({ status: opts.status || 200, body }) } },
  stripe: class { constructor() { throw Error('Unexpected Stripe session path'); } },
  '@/lib/migration-preview': { MIGRATION_PREVIEW: false }, '@/lib/store-status': { storeClosed: () => false },
  '@/lib/products': catalog, '@/lib/types': load('src/lib/types.ts'), '@/lib/fulfillment': load('src/lib/fulfillment.ts'),
  '@/lib/shipping': {}, '@/lib/discount': {}, '@/lib/signups': { EMAIL_RE: /@/ }, '@/lib/meta-capi': {}, '@/lib/tapstitch-readiness': {}
};
new Function('require', 'module', 'exports', 'process', ts.transpileModule(checkoutSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText)(name => { assert.ok(name in mocks, name); return mocks[name]; }, moduleFixture, moduleFixture.exports, { env: { STRIPE_SECRET_KEY: 'sk_test_offline_fixture', CHECKOUT_TEST_MODE: 'false' } });
(async () => {
  for (const color of tee.colorVariants) {
    const result = await moduleFixture.exports.POST({ json: async () => ({ items: [{ productId: ID, size: 'S', color: color.name, quantity: 1 }] }), headers: { get: () => null } });
    assert.equal(result.status, 400); assert.match(result.body.error, /coming soon/);
  }
  console.log('PASS 15 approved images and gallery order; three colors/S-XL/$34; correct women order; other products and payment/UI files unchanged; real checkout refuses every color without provider calls.');
})().catch(error => { console.error(error); process.exitCode = 1; });
