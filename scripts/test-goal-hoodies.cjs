// GOAL Athletics hoodies on the Independent IND4000: the Heritage Hoodie (GA
// monogram on the chest and sleeve) and the Lockup Hoodie (GA monogram and
// GOAL ATHLETICS lockup across the chest). Four Apliiq saved designs each
// (Black, Grey Heather, Bone, Navy), priced at $78. The Lockup row is mapped
// and live since 2026-10-22; the Heritage row's ids, SKUs and renders are not
// in the repo yet. This guards the gates that keep a row invisible and
// unsellable until every input lands (hidden while any gallery is empty,
// every unmapped colourway coming soon, not for sale while any colourway is
// coming soon, refused by checkout on every path including a forced
// activation), and that a live row's every colourway and size opens a
// checkout session carrying its own Apliiq SKU. Stripe is an in-memory
// adapter; a refused line never reaches it. No network or database calls.
const fs = require('fs'), assert = require('assert/strict'), ts = require('typescript'), vm = require('vm');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, resolveJsonModule: true, esModuleInterop: true } }).outputText, f);
const p = require('../src/lib/products.ts'), f = require('../src/lib/fulfillment.ts'), types = require('../src/lib/types.ts'), charts = require('../src/lib/size-charts.ts');
const HOODIES = {
  'goal-athletics-heritage-hoodie': { id: '80000000-0000-4000-8000-000000000014' },
  'goal-athletics-lockup-hoodie': { id: '80000000-0000-4000-8000-000000000015' },
};
const ORDER = ['Black', 'Grey Heather', 'Bone', 'Navy'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const PRICE = 7800;
(async () => {
  assert.equal(new Set(p.products.map(x => x.slug)).size, p.products.length, 'no duplicate slugs');
  assert.equal(new Set(p.products.map(x => x.id)).size, p.products.length, 'no duplicate ids');
  const source = fs.readFileSync('src/app/api/checkout/route.ts', 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  let providerCalls = 0;
  let lastSession = null;
  // Run the real checkout route with the store open and an in-memory Stripe
  // adapter against every colourway and size of one product.
  const run = async (productsModule, id) => {
    const ctx = { exports: {}, process: { env: { STRIPE_SECRET_KEY: 'sk_test_fixture_not_a_key', NEXT_PUBLIC_SITE_URL: 'https://goalathletics.shop' } }, require: n => {
      if (n === 'next/server') return { NextResponse: { json: (body, init) => ({ body, status: init?.status ?? 200 }) } };
      if (n === 'stripe') return { __esModule: true, default: class { constructor() { providerCalls++; this.checkout = { sessions: { create: async params => { lastSession = params; return { url: 'https://checkout.stripe.test/session' }; } } }; } } };
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
      const before = providerCalls;
      lastSession = null;
      const r = await ctx.exports.POST({ json: async () => ({ items: [{ productId: id, size, color, quantity: 1, customName: null, customNumber: null }] }), headers: { get: () => null } });
      results.push({ color, size, status: r.status, error: r.body?.error, reachedStripe: providerCalls > before, session: lastSession });
    }
    return results;
  };
  const summary = [];
  for (const [slug, { id }] of Object.entries(HOODIES)) {
    const product = p.products.find(x => x.id === id);
    assert(product && product.slug === slug, `${slug} present`);
    assert.equal(product.category, 'hoodie', slug);
    assert.equal(product.blank, 'IND4000', slug);
    assert.equal(product.supplierType, 'apliiq', slug);
    assert.equal(product.priceCents, PRICE, `${slug}: owner's hoodie price`);
    assert.deepEqual(product.sizes, SIZES, slug);
    assert.deepEqual(product.colorVariants.map(v => v.name), ORDER, slug);
    assert.equal(charts.sizeChartFor(id)?.blank, 'Heavyweight fleece hoodie', `${slug}: IND4000 size chart`);

    // Gate 1: a colourway stays coming soon until fulfillment.ts maps it, and
    // a mapped one carries five real APQ SKUs from one design.
    let mapped = 0;
    for (const v of product.colorVariants) {
      const skus = SIZES.map(s => f.resolveApliiqSku(id, v.name, s));
      if (skus.every(x => x === null)) assert.equal(v.comingSoon, true, `${slug} ${v.name}: unmapped colourway must be comingSoon`);
      else {
        for (const r of skus) assert.match(r?.sku ?? '', /^APQ-\d+S\d+A1$/, `${slug} ${v.name}: every size mapped`);
        assert.equal(new Set(skus.map(r => r.apliiqProductId)).size, 1, `${slug} ${v.name}: one design per colourway`);
        mapped++;
      }
    }
    // Gate 2: hidden while any gallery is empty (ProductCard reads
    // images[0]); every listed image must exist.
    const galleries = [product.images, ...product.colorVariants.map(v => v.images)];
    if (galleries.some(g => g.length === 0)) assert.equal(product.isActive, false, `${slug}: a product with an empty gallery must stay hidden`);
    for (const g of galleries) for (const image of g) assert(fs.existsSync('public' + image.src), image.src);
    // Gate 3: not for sale without a price or while any colourway is coming soon.
    if (!types.hasPrice(product) || product.colorVariants.some(v => v.comingSoon)) assert.equal(product.availableForSale, false, `${slug}: unpriced or partly unmapped, not for sale`);
    if (!product.isActive) {
      assert.equal(p.getProductBySlug(slug), undefined);
      assert.equal(p.getProductById(id), undefined);
    }

    // Checkout as shipped: sellable only once every input is in.
    const sellable = product.isActive && product.availableForSale && types.hasPrice(product) && mapped === ORDER.length;
    for (const r of await run(p, id)) {
      if (sellable) {
        assert.equal(r.status, 200, `${slug} ${r.color} ${r.size} sellable once every input is in: ${r.error ?? ''}`);
        const sku = f.resolveApliiqSku(id, r.color, r.size).sku;
        const items = Object.keys(r.session.metadata).filter(k => /^items_\d+$/.test(k)).sort().map(k => r.session.metadata[k]).join('');
        assert(items.includes(sku), `${slug} ${r.color} ${r.size}: the session carries ${sku}`);
      } else {
        assert.equal(r.status, 400, `${slug} ${r.color} ${r.size} refused as shipped: ${r.error}`);
        assert.equal(r.reachedStripe, false, `${slug} ${r.color} ${r.size}: a refused line never reaches Stripe`);
      }
    }
    // Forced active, for sale and priced (what flipping the flags without
    // SKUs would do): still refused by the comingSoon check or the missing
    // mapping before Stripe is reached.
    const forced = { ...p, getProductById: pid => pid === id ? { ...product, isActive: true, availableForSale: true } : p.getProductById(pid) };
    for (const r of await run(forced, id)) {
      const variant = product.colorVariants.find(v => v.name === r.color);
      const expected = variant.comingSoon || !f.resolveApliiqSku(id, r.color, r.size) ? 400 : 200;
      assert.equal(r.status, expected, `${slug} ${r.color} ${r.size} forced active: ${r.error ?? 'session created'}`);
      if (expected === 400) assert.equal(r.reachedStripe, false, `${slug} ${r.color} ${r.size} forced active: a refused line never reaches Stripe`);
    }
    summary.push(`${slug}: ${mapped}/${ORDER.length} mapped, ${product.isActive ? 'visible' : 'hidden'}, ${product.availableForSale ? 'for sale' : 'not for sale'}`);
  }
  console.log(`PASS GOAL hoodies at $78 (${summary.join('; ')}); checkout refused every unmapped line before Stripe and opened a session with its own SKU for every live one. No network/database calls.`);
})().catch(e => { console.error(e); process.exitCode = 1; });
