const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const cp = require('node:child_process'), crypto = require('node:crypto'), ts = require('typescript');
const ROOT = path.resolve(__dirname, '..'), BASE = '7ea51b999cdcec386b5d5cf0ce579706ffaadc0b';
const ID = '80000000-0000-4000-8000-000000000025';
const plain = value => JSON.parse(JSON.stringify(value));
function loader(old = false) {
  const cache = new Map();
  return function load(file) {
    file = path.relative(ROOT, path.resolve(ROOT, file));
    if (cache.has(file)) return cache.get(file).exports;
    const source = old ? cp.execFileSync('git', ['show', BASE + ':' + file], { cwd: ROOT, encoding: 'utf8' }) : fs.readFileSync(path.join(ROOT, file), 'utf8');
    if (file.endsWith('.json')) return JSON.parse(source);
    const module = { exports: {} }; cache.set(file, module);
    const req = id => id.startsWith('@/') || id.startsWith('.') ? load((id.startsWith('@/') ? 'src/' + id.slice(2) : path.join(path.dirname(file), id)) + (id.endsWith('.json') ? '' : '.ts')) : require(id);
    new Function('require', 'module', 'exports', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText)(req, module, module.exports);
    return module.exports;
  };
}
const load = loader(), old = loader(true), catalog = load('src/lib/products.ts'), before = old('src/lib/products.ts');
const bra = catalog.getProductById(ID);
assert.ok(bra); assert.equal(bra.slug, 'tempo-training-bra'); assert.equal(bra.priceCents, 1800);
assert.equal(bra.availableForSale, false); assert.equal(bra.category, 'bra');
assert.deepEqual(bra.sizes, ['S', 'M', 'L', 'XL']);
assert.deepEqual(bra.colorVariants.map(v => v.name), ['Black', 'Blue', 'Grey', 'Brick']);
for (const product of before.products) {
  // The separate, owner-authorized WT0216 purchase release changes only
  // its availability; every other field and every other product is frozen.
  const expected = product.id === '80000000-0000-4000-8000-000000000021'
    ? { ...product, availableForSale: true } : product;
  assert.deepEqual(catalog.products.find(p => p.id === product.id), expected);
}
assert.equal(catalog.products.length, before.products.length + 1);
const presentation = load('src/v84/catalog-data.ts');
assert.deepEqual(presentation.forAudience('men'), old('src/v84/catalog-data.ts').forAudience('men'));
assert.deepEqual(presentation.forAudience('women').map(p => p.id), ['80000000-0000-4000-8000-000000000017', '80000000-0000-4000-8000-000000000021', ID]);
assert.equal(presentation.productType(bra), 'sports bras');
const launch = load('src/lib/collection-launch.ts');
for (const id of launch.TEMPO_PRODUCT_IDS) if (!launch.TEMPO_PUBLIC_PRODUCT_IDS.has(id)) assert.equal(catalog.getProductById(id), undefined);
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/catalog/tempo-training-bra-gallery-20261104.json'))), seen = new Set();
assert.equal(manifest.files.length, 24); assert.equal(manifest.available_for_sale, false); assert.equal(manifest.supplier_designs, null);
const gallery = load('src/v84/product-gallery-images.ts');
for (const [index, variant] of bra.colorVariants.entries()) {
  assert.equal(variant.comingSoon, true); assert.equal(variant.skuFragment, '');
  assert.deepEqual(gallery.productGalleryImages(bra, index), variant.images);
  assert.deepEqual(variant.images.map(image => manifest.files.find(row => '/' + row.path.replace(/^public\//, '') === image.src)?.view), ['ghost-front', 'model-front', 'model-quarter', 'model-back', 'fabric-print-detail', 'ghost-back']);
  for (const image of variant.images) {
    assert.ok(!seen.has(image.src)); seen.add(image.src);
    const row = manifest.files.find(row => '/' + row.path.replace(/^public\//, '') === image.src);
    const bytes = fs.readFileSync(path.join(ROOT, row.path));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), row.sha256);
    assert.deepEqual(bytes, fs.readFileSync(path.join(ROOT, row.source_path)));
    assert.equal(row.width, 1024); assert.equal(row.height, 1536);
  }
}
const chart = load('src/lib/size-charts.ts').sizeChartFor(ID);
assert.equal(chart.measure, 'bust'); assert.deepEqual(chart.rows.map(row => row.size), bra.sizes);
assert.deepEqual(chart.rows.map(row => [row.chestIn, row.lengthIn]), [[12.99,12.17],[13.78,12.48],[14.57,12.8],[15.35,13.11]]);
for (const file of ['src/app/api/checkout/route.ts', 'src/app/api/stripe-webhook/route.ts', 'src/lib/orders-store.ts', 'src/lib/fulfillment-submit.ts', 'src/lib/fulfillment.ts', 'src/lib/tapstitch-readiness.ts', 'src/lib/store-status.ts', 'netlify.toml', 'src/v84/ProductGallery.tsx', 'src/v84/ProductDetail.tsx', 'src/v84/integration.css', 'src/app/globals.css']) assert.equal(fs.readFileSync(path.join(ROOT, file), 'utf8'), cp.execFileSync('git', ['show', BASE + ':' + file], { cwd: ROOT, encoding: 'utf8' }), file);
const source = fs.readFileSync(path.join(ROOT, 'src/app/api/checkout/route.ts'), 'utf8'), fixture = { exports: {} };
const mocks = {
  'next/server': { NextResponse: { json: (body, opts = {}) => ({ status: opts.status || 200, body }) } },
  stripe: class { constructor() { throw Error('Unexpected Stripe provider path'); } },
  '@/lib/migration-preview': { MIGRATION_PREVIEW: false }, '@/lib/store-status': { storeClosed: () => false },
  '@/lib/products': catalog, '@/lib/types': load('src/lib/types.ts'), '@/lib/fulfillment': load('src/lib/fulfillment.ts'),
  '@/lib/shipping': {}, '@/lib/discount': {}, '@/lib/signups': { EMAIL_RE: /@/ }, '@/lib/meta-capi': {}, '@/lib/tapstitch-readiness': {}
};
new Function('require', 'module', 'exports', 'process', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText)(name => { assert.ok(name in mocks, name); return mocks[name]; }, fixture, fixture.exports, { env: { STRIPE_SECRET_KEY: 'sk_test_offline_fixture', CHECKOUT_TEST_MODE: 'false' } });
(async () => {
  for (const variant of bra.colorVariants) for (const size of bra.sizes) {
    const result = await fixture.exports.POST({ json: async () => ({ items: [{ productId: ID, size, color: variant.name, quantity: 1 }] }), headers: { get: () => null } });
    assert.equal(result.status, 400); assert.match(result.body.error, /coming soon/);
  }
  console.log('PASS $18/S-XL/four colors/24 byte-identical images and six-view order; correct women catalog and bust chart; every prior product and protected commerce/UI file unchanged; all16 variants rejected before Stripe.');
})().catch(error => { console.error(error); process.exitCode = 1; });
