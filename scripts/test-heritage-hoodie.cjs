// GOAL Athletics Heritage Hoodie (IND4000): four Apliiq saved designs exist
// (Black, Grey Heather, Bone, Navy) but their ids, SKUs, renders and retail
// price are not in the repo yet. This guards the gates that keep the product
// invisible and unsellable until each input lands: hidden while any gallery
// is empty, every unmapped colourway coming soon, not for sale without a
// price, and refused by checkout on every path, including a forced
// activation. No network, database or provider calls.
const fs = require('fs'), assert = require('assert/strict'), ts = require('typescript'), vm = require('vm');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, resolveJsonModule: true, esModuleInterop: true } }).outputText, f);
const p = require('../src/lib/products.ts'), f = require('../src/lib/fulfillment.ts'), types = require('../src/lib/types.ts'), charts = require('../src/lib/size-charts.ts');
const ID = '80000000-0000-4000-8000-000000000014', SLUG = 'goal-athletics-heritage-hoodie';
const ORDER = ['Black', 'Grey Heather', 'Bone', 'Navy'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
(async () => {
  const product = p.products.find(x => x.id === ID);
  assert(product && product.slug === SLUG, 'Heritage Hoodie present');
  assert.equal(product.category, 'hoodie');
  assert.equal(product.blank, 'IND4000');
  assert.equal(product.supplierType, 'apliiq');
  assert.deepEqual(product.sizes, SIZES);
  assert.deepEqual(product.colorVariants.map(v => v.name), ORDER);
  assert.equal(charts.sizeChartFor(ID)?.blank, 'Heavyweight fleece hoodie', 'IND4000 size chart');
  assert.equal(new Set(p.products.map(x => x.slug)).size, p.products.length, 'no duplicate slugs');
  assert.equal(new Set(p.products.map(x => x.id)).size, p.products.length, 'no duplicate ids');

  // Gate 1: a colourway stays coming soon until fulfillment.ts maps it, and a
  // mapped one carries five real APQ SKUs.
  let mapped = 0;
  for (const v of product.colorVariants) {
    const skus = SIZES.map(s => f.resolveApliiqSku(ID, v.name, s));
    if (skus.every(x => x === null)) assert.equal(v.comingSoon, true, `${v.name}: unmapped colourway must be comingSoon`);
    else {
      for (const r of skus) assert.match(r?.sku ?? '', /^APQ-\d+S\d+A1$/, `${v.name}: every size mapped`);
      assert.equal(new Set(skus.map(r => r.apliiqProductId)).size, 1, `${v.name}: one design per colourway`);
      mapped++;
    }
  }
  // Gate 2: hidden while any gallery is empty (ProductCard reads images[0]);
  // every listed image must exist.
  const galleries = [product.images, ...product.colorVariants.map(v => v.images)];
  if (galleries.some(g => g.length === 0)) assert.equal(product.isActive, false, 'a product with an empty gallery must stay hidden');
  for (const g of galleries) for (const image of g) assert(fs.existsSync('public' + image.src), image.src);
  // Gate 3: not for sale without a price or while any colourway is coming soon.
  if (!types.hasPrice(product) || product.colorVariants.some(v => v.comingSoon)) assert.equal(product.availableForSale, false, 'unpriced or partly unmapped: not for sale');
  if (!product.isActive) {
    assert.equal(p.getProductBySlug(SLUG), undefined);
    assert.equal(p.getProductById(ID), undefined);
  }

  // Checkout: run the real route with the store open and an in-memory Stripe
  // adapter. As shipped, every colourway is refused. Then force the product
  // active, for sale and priced (what flipping the flags without SKUs would
  // do) and it is still refused, by the comingSoon check or the missing
  // mapping, before Stripe is reached.
  const source = fs.readFileSync('src/app/api/checkout/route.ts', 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  let providerCalls = 0;
  const run = async (productsModule) => {
    const ctx = { exports: {}, process: { env: { STRIPE_SECRET_KEY: 'sk_test_fixture_not_a_key', NEXT_PUBLIC_SITE_URL: 'https://goalathletics.shop' } }, require: n => {
      if (n === 'next/server') return { NextResponse: { json: (body, init) => ({ body, status: init?.status ?? 200 }) } };
      if (n === 'stripe') return { default: class { constructor() { providerCalls++; } } };
      if (n === '@/lib/migration-preview') return { MIGRATION_PREVIEW: false };
      if (n === '@/lib/store-status') return { storeClosed: () => false };
      if (n === '@/lib/products') return productsModule;
      if (n === '@/lib/types') return types;
      if (n === '@/lib/fulfillment') return f;
      if (n === '@/lib/shipping') return require('../src/lib/shipping.ts');
      if (n === '@/lib/meta-capi') return { clientIpFrom: () => null };
      return {};
    } };
    vm.runInNewContext(compiled, ctx);
    const results = [];
    for (const color of ORDER) for (const size of SIZES) {
      const r = await ctx.exports.POST({ json: async () => ({ items: [{ productId: ID, size, color, quantity: 1, customName: null, customNumber: null }] }), headers: { get: () => null } });
      results.push({ color, size, status: r.status, error: r.body?.error });
    }
    return results;
  };
  const sellable = product.isActive && product.availableForSale && types.hasPrice(product) && mapped === ORDER.length;
  for (const r of await run(p)) {
    if (sellable) assert.equal(r.status, 200, `${r.color} ${r.size} sellable once every input is in`);
    else assert.equal(r.status, 400, `${r.color} ${r.size} refused as shipped: ${r.error}`);
  }
  const forced = { ...p, getProductById: id => id === ID ? { ...product, isActive: true, availableForSale: true, priceCents: product.priceCents || 7800 } : p.getProductById(id) };
  for (const r of await run(forced)) {
    const variant = product.colorVariants.find(v => v.name === r.color);
    const expected = variant.comingSoon || !f.resolveApliiqSku(ID, r.color, r.size) ? 400 : 200;
    assert.equal(r.status, expected, `${r.color} ${r.size} forced active: ${r.error ?? 'session created'}`);
  }
  const unmapped = ORDER.length - mapped;
  assert.equal(providerCalls, 0, 'Stripe is never reached for a refused line');
  console.log(`PASS Heritage Hoodie: ${ORDER.length} colourways, ${mapped} mapped, ${unmapped} coming soon; ${product.isActive ? 'visible' : 'hidden'}, ${product.availableForSale ? 'for sale' : 'not for sale'}, ${types.hasPrice(product) ? 'priced' : 'unpriced'}; checkout refused every unmapped line. No network/database/provider calls.`);
})().catch(e => { console.error(e); process.exitCode = 1; });
