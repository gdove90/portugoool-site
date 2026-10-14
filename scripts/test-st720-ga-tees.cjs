// ST720 GA tee handoff 2026-10-14: two hidden products, twelve Apliiq designs.
// Verifies the catalog rows, exact Apliiq SKUs, images on disk and that they
// stay off the site and out of checkout until the owner sets the price.
// No network, database or provider calls.
const fs = require('fs'), assert = require('assert/strict'), ts = require('typescript'), vm = require('vm');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, resolveJsonModule: true, esModuleInterop: true } }).outputText, f);
const p = require('../src/lib/products.ts'), f = require('../src/lib/fulfillment.ts'), types = require('../src/lib/types.ts');
const ORDER = ['Black', 'True Royal', 'White · Black-Red', 'White · Royal', 'Silver', 'True Red'];
const TEES = {
  'goal-athletics-ga-minimal-tee': { id: '80000000-0000-4000-8000-000000000011', ids: [6206215, 6206254, 6206255, 6206257, 6206263, 6206277] },
  'goal-athletics-ga-big-tee': { id: '80000000-0000-4000-8000-000000000012', ids: [6206229, 6206234, 6206236, 6206239, 6206241, 6206251] },
};
const SIZES = { S: 6, M: 7, L: 8, XL: 1, XXL: 2 };
(async () => {
  let variants = 0;
  for (const [slug, tee] of Object.entries(TEES)) {
    const product = p.products.find(x => x.slug === slug);
    assert(product && product.id === tee.id, `${slug} present`);
    assert.equal(product.isActive, false, `${slug} must stay hidden`);
    assert.equal(product.availableForSale, false);
    assert.equal(types.hasPrice(product), false, `${slug} has no price until the owner sets it`);
    assert.equal(p.getProductBySlug(slug), undefined);
    assert.equal(p.getProductById(tee.id), undefined);
    assert.equal(product.category, 'tshirt');
    assert.equal(product.blank, 'ST720');
    assert.deepEqual(product.sizes, Object.keys(SIZES));
    assert.deepEqual(product.colorVariants.map(v => v.name), ORDER);
    product.colorVariants.forEach((variant, i) => {
      const id = tee.ids[i];
      for (const [size, code] of Object.entries(SIZES))
        assert.deepEqual(f.resolveApliiqSku(tee.id, variant.name, size), { apliiqProductId: id, sku: `APQ-${id}S${code}A1` }, `${slug} ${variant.name} ${size}`);
      assert.equal(variant.images.length, 2);
      for (const image of variant.images) {
        assert(fs.existsSync('public' + image.src), image.src);
        assert.equal(image.caption, 'Concept render. Not a photograph of a manufactured sample.');
      }
      variants++;
    });
  }
  assert.equal(new Set(p.products.map(x => x.slug)).size, p.products.length, 'no duplicate slugs');
  assert.equal(new Set(p.products.map(x => x.id)).size, p.products.length, 'no duplicate ids');
  // Forged checkout with the store open refuses every hidden variant before Stripe.
  const source = fs.readFileSync('src/app/api/checkout/route.ts', 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  let providerCalls = 0;
  const context = { exports: {}, process: { env: { STRIPE_SECRET_KEY: 'sk_live_fixture_not_a_key' } }, require: n => n === 'next/server' ? { NextResponse: { json: (body, init) => ({ body, status: init?.status ?? 200 }) } } : n === 'stripe' ? { default: class { constructor() { providerCalls++; throw Error('Provider must never be reached'); } } } : n === '@/lib/migration-preview' ? { MIGRATION_PREVIEW: false } : n === '@/lib/store-status' ? { storeClosed: () => false } : n === '@/lib/products' ? p : n === '@/lib/types' ? types : n === '@/lib/fulfillment' ? f : {} };
  vm.runInNewContext(compiled, context);
  for (const tee of Object.values(TEES)) for (const color of ORDER) {
    const r = await context.exports.POST({ json: async () => ({ items: [{ productId: tee.id, size: 'M', color, quantity: 1, customName: null, customNumber: null }] }), headers: { get: () => null } });
    assert.equal(r.status, 400, `${tee.id} ${color} refused`);
  }
  assert.equal(providerCalls, 0);
  console.log(`PASS 2 hidden ST720 GA tees, ${variants} colourways: exact Apliiq SKUs S-XXL, front and back renders on disk with the concept caption, no price, off the site, checkout refuses all ${variants} before Stripe. No network/database/provider calls.`);
})().catch(e => { console.error(e); process.exitCode = 1; });
