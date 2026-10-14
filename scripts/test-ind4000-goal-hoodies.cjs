// IND4000 GOAL hoodie handoff 2026-10-14: three hidden products, twelve Apliiq
// designs. Verifies the catalog rows, exact Apliiq SKUs, images on disk and that
// they stay off the site and out of checkout pending publication approval.
// Handoff v2: Big Stack dropped (its Apliiq designs are never mapped) and no
// back print on any style, so every back image is the plain Lockup back.
// No network, database or provider calls.
const fs = require('fs'), assert = require('assert/strict'), ts = require('typescript'), vm = require('vm');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, resolveJsonModule: true, esModuleInterop: true } }).outputText, f);
const p = require('../src/lib/products.ts'), f = require('../src/lib/fulfillment.ts'), types = require('../src/lib/types.ts');
const ORDER = ['Black', 'Navy', 'Bone', 'Grey Heather'];
const HOODIES = {
  'goal-athletics-heritage-hoodie': { id: '80000000-0000-4000-8000-000000000013', ids: [6206334, 6206365, 6206384, 6206395], views: 3 },
  'goal-athletics-minimal-hoodie': { id: '80000000-0000-4000-8000-000000000014', ids: [6206401, 6206408, 6206414, 6206424], views: 2 },
  'goal-athletics-lockup-hoodie': { id: '80000000-0000-4000-8000-000000000015', ids: [6206733, 6206737, 6206741, 6206746], views: 2 },
};
const SIZES = { S: 6, M: 7, L: 8, XL: 1, XXL: 2 };
(async () => {
  let variants = 0;
  for (const [slug, hoodie] of Object.entries(HOODIES)) {
    const product = p.products.find(x => x.slug === slug);
    assert(product && product.id === hoodie.id, `${slug} present`);
    assert.equal(product.isActive, false, `${slug} must stay hidden`);
    assert.equal(product.availableForSale, false);
    assert.equal(types.hasPrice(product), true, `${slug} is priced`);
    assert.equal(product.priceCents, 3800, `${slug} owner-approved $38 price`);
    assert.equal(p.getProductBySlug(slug), undefined);
    assert.equal(p.getProductById(hoodie.id), undefined);
    assert.equal(product.category, 'hoodie');
    assert.equal(product.blank, 'IND4000');
    assert.deepEqual(product.sizes, Object.keys(SIZES));
    assert.deepEqual(product.colorVariants.map(v => v.name), ORDER);
    product.colorVariants.forEach((variant, i) => {
      const id = hoodie.ids[i];
      for (const [size, code] of Object.entries(SIZES))
        assert.deepEqual(f.resolveApliiqSku(hoodie.id, variant.name, size), { apliiqProductId: id, sku: `APQ-${id}S${code}A1` }, `${slug} ${variant.name} ${size}`);
      assert.equal(variant.images.length, hoodie.views);
      for (const image of variant.images) {
        assert(fs.existsSync('public' + image.src), image.src);
        assert.equal(image.caption, 'Concept render. Not a photograph of a manufactured sample.');
      }
      assert(variant.images.find(image => image.src.endsWith('-back.webp')).src.startsWith('/products/goal-lockup-hoodie-'), `${slug} ${variant.name} plain back`);
      variants++;
    });
  }
  assert.equal(p.products.some(x => /big-stack/.test(x.slug)), false, 'Big Stack is not on the site');
  for (const id of [6206428, 6206432, 6206441, 6206442]) assert.equal(fs.readFileSync('src/lib/fulfillment.ts', 'utf8').includes(String(id)), false, `Big Stack ${id} not mapped`);
  assert.equal(new Set(p.products.map(x => x.slug)).size, p.products.length, 'no duplicate slugs');
  assert.equal(new Set(p.products.map(x => x.id)).size, p.products.length, 'no duplicate ids');
  // Forged checkout with the store open refuses every hidden variant before Stripe.
  const source = fs.readFileSync('src/app/api/checkout/route.ts', 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  let providerCalls = 0;
  const context = { exports: {}, process: { env: { STRIPE_SECRET_KEY: 'sk_live_fixture_not_a_key' } }, require: n => n === 'next/server' ? { NextResponse: { json: (body, init) => ({ body, status: init?.status ?? 200 }) } } : n === 'stripe' ? { default: class { constructor() { providerCalls++; throw Error('Provider must never be reached'); } } } : n === '@/lib/migration-preview' ? { MIGRATION_PREVIEW: false } : n === '@/lib/store-status' ? { storeClosed: () => false } : n === '@/lib/products' ? p : n === '@/lib/types' ? types : n === '@/lib/fulfillment' ? f : {} };
  vm.runInNewContext(compiled, context);
  for (const hoodie of Object.values(HOODIES)) for (const color of ORDER) {
    const r = await context.exports.POST({ json: async () => ({ items: [{ productId: hoodie.id, size: 'M', color, quantity: 1, customName: null, customNumber: null }] }), headers: { get: () => null } });
    assert.equal(r.status, 400, `${hoodie.id} ${color} refused`);
  }
  assert.equal(providerCalls, 0);
  console.log(`PASS 3 staged IND4000 hoodies at $38 each, ${variants} colorways: exact Apliiq SKUs S–2XL, renders preserved; products remain hidden and checkout refuses all variants before Stripe. No network/database/provider calls.`);
})().catch(e => { console.error(e); process.exitCode = 1; });
