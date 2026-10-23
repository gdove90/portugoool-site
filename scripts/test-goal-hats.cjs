// Owner hat upload 2026-10-14: two caps, eight Apliiq colourways. Verifies the
// catalog rows, exact Apliiq SKUs, images on disk and that checkout refuses
// any cap that is not for sale (none since 2026-10-23: both caps went on sale
// for the first live Apliiq order, owner: nothing is coming soon). No network, database or
// provider calls.
const fs = require('fs'), assert = require('assert/strict'), ts = require('typescript'), vm = require('vm');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, resolveJsonModule: true, esModuleInterop: true } }).outputText, f);
const p = require('../src/lib/products.ts'), f = require('../src/lib/fulfillment.ts');
const HATS = {
  'goal-athletics-monogram-cap': { id: '80000000-0000-4000-8000-000000000009', forSale: true, variants: { 'Black/Natural': 6205981, 'Red/Natural': 6205977, 'Royal/Natural': 6205982, 'Dark Green/Natural': 6205989 } },
  'goal-athletics-wordmark-cap': { id: '80000000-0000-4000-8000-000000000010', forSale: true, variants: { 'Black/Natural': 6205992, 'Red/Natural': 6205994, 'Royal/Natural': 6205995, 'Dark Green/Natural': 6206101 } },
};
(async () => {
  let variants = 0;
  for (const [slug, hat] of Object.entries(HATS)) {
    const product = p.getProductBySlug(slug);
    assert(product && product.id === hat.id && product.isActive, `${slug} listed`);
    assert.equal(product.category, 'hat');
    assert.equal(product.availableForSale, hat.forSale === true, `${slug} sale state`);
    assert.equal(product.priceCents, 3200);
    assert.deepEqual(product.colorVariants.map(v => v.name), Object.keys(hat.variants));
    for (const variant of product.colorVariants) {
      const id = hat.variants[variant.name];
      assert.deepEqual(f.resolveApliiqSku(hat.id, variant.name, 'OS'), { apliiqProductId: id, sku: `APQ-${id}S34A1` }, `${slug} ${variant.name}`);
      assert(variant.images.length >= 1, `${slug} ${variant.name} has images`);
      for (const image of variant.images) assert(fs.existsSync('public' + image.src), image.src);
      variants++;
    }
  }
  assert.equal(p.getProducts().filter(x => x.category === 'hat').length, 2, 'only the two new caps are listed');
  assert.equal(new Set(p.products.map(x => x.slug)).size, p.products.length, 'no duplicate slugs');
  // Forged checkout with the store open still refuses Coming Soon hats before Stripe.
  const source = fs.readFileSync('src/app/api/checkout/route.ts', 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  let providerCalls = 0;
  const context = { exports: {}, process: { env: { STRIPE_SECRET_KEY: 'sk_live_fixture_not_a_key' } }, require: n => n === 'next/server' ? { NextResponse: { json: (body, init) => ({ body, status: init?.status ?? 200 }) } } : n === 'stripe' ? { default: class { constructor() { providerCalls++; throw Error('Provider must never be reached'); } } } : n === '@/lib/migration-preview' ? { MIGRATION_PREVIEW: false } : n === '@/lib/store-status' ? { storeClosed: () => false } : n === '@/lib/products' ? p : n === '@/lib/types' ? require('../src/lib/types.ts') : n === '@/lib/fulfillment' ? f : {} };
  vm.runInNewContext(compiled, context);
  for (const hat of Object.values(HATS).filter(h => !h.forSale)) for (const color of Object.keys(hat.variants)) {
    const r = await context.exports.POST({ json: async () => ({ items: [{ productId: hat.id, size: 'OS', color, quantity: 1, customName: null, customNumber: null }] }), headers: { get: () => null } });
    assert.equal(r.status, 400, `${hat.id} ${color} refused`);
  }
  assert.equal(providerCalls, 0);
  console.log(`PASS 2 caps, ${variants} colourways: exact Apliiq SKUs, images on disk, listed as hats, not purchasable (checkout refuses all ${variants} before Stripe). No network/database/provider calls.`);
})().catch(e => { console.error(e); process.exitCode = 1; });
