// Fixed regression expectations reviewed from main 6b4cc47 on 2026-10-28.
// Change only with an explicitly approved catalog release; never derive these
// expectations from the current runtime's catalog or ordering implementation.
const assert = require('node:assert/strict');
const APPROVED_BASELINE = '6b4cc47960752dda3ae0ef2d55a8e23c228ae6f8';
const PUBLIC_ORDER = [
  ['80000000-0000-4000-8000-000000000009', 'goal-athletics-monogram-cap'],
  ['80000000-0000-4000-8000-000000000010', 'goal-athletics-wordmark-cap'],
  ['80000000-0000-4000-8000-000000000011', 'goal-athletics-ga-minimal-tee'],
  ['80000000-0000-4000-8000-000000000012', 'goal-athletics-ga-big-tee'],
  ['80000000-0000-4000-8000-000000000013', 'goal-athletics-ga-minimal-shorts'],
  ['80000000-0000-4000-8000-000000000024', 'goal-athletics-core-jogger'],
  ['80000000-0000-4000-8000-000000000023', 'goal-athletics-core-quarter-zip'],
  ['80000000-0000-4000-8000-000000000014', 'goal-athletics-heritage-hoodie'],
  ['80000000-0000-4000-8000-000000000015', 'goal-athletics-lockup-hoodie'],
  ['80000000-0000-4000-8000-000000000016', 'goal-athletics-core-everyday-raincoat'],
];
const TEMPO_IDS = ['017','018','019','020','021','022'].map(n => '80000000-0000-4000-8000-000000000' + n);
const RETIRED_IDS = [
  '70000000-0000-4000-8000-000000000001', '70000000-0000-4000-8000-000000000004',
  '80000000-0000-4000-8000-000000000007', '80000000-0000-4000-8000-000000000008',
  '70000000-0000-4000-8000-000000000002', '70000000-0000-4000-8000-000000000006',
  '70000000-0000-4000-8000-000000000003', '70000000-0000-4000-8000-000000000005',
  '80000000-0000-4000-8000-000000000006',
];
// Fixed approved middleware dispositions, not inferred from a response or the
// current implementation. Old clothing links redirect; the other archives404.
const RETIRED_REDIRECT_SLUGS = [
  'goool-heavyweight-hoodie', 'goool-heavyweight-hoodie-blue',
  'goool-heavyweight-casual-tee', 'goool-heavyweight-casual-tee-blue',
  'goool-athletics-modern-sport-tee', 'goool-athletics-varsity-tee',
  'goool-athletics-minimal-club-tee', 'goool-athletics-circular-badge-tee',
  'goool-athletics-circular-center-crewneck', 'goool-athletics-modern-sport-performance-tee',
];
const RETIRED_NOT_FOUND_SLUGS = [
  'goool-tee', 'goool-oval-tee', 'goool-cap', 'goool-cap-black', 'goool-cap-white',
  'goool-england-cap', 'goool-england-cap-white', 'goool-england-cap-navy', 'goool-england-cap-red',
  'goool-argentina-cap-white', 'goool-argentina-cap-sky', 'goool-italy-cap-navy', 'goool-italy-cap-white',
  'goool-netherlands-cap-navy', 'goool-netherlands-cap-white', 'goool-germany-cap-black', 'goool-germany-cap-white',
  'goool-belgium-cap-red', 'goool-belgium-cap-black', 'goool-norway-cap-navy', 'goool-norway-cap-red',
  'goool-spain-cap-black', 'goool-spain-cap-red', 'goool-france-cap-navy', 'goool-france-cap-white',
  'goool-performance-tee', 'goool-touchline-cap', 'goool-athletics-badge-cap', 'goool-athletics-stacked-cap',
];
function assertApprovedCatalog(catalog, ordering) {
  assert.equal(catalog.getProducts().length, 10, 'ten public approved products');
  assert.equal(catalog.getProducts({ includeTempo: true }).length, 16, 'six additional gated TEMPO products');
  assert.deepEqual(Array.from(ordering.catalogOrder(catalog.getProducts()), p => [p.id, p.slug]), PUBLIC_ORDER, 'approved public product identity and ordering');
  for (const id of TEMPO_IDS) {
    assert.equal(catalog.getProductById(id), undefined, 'TEMPO remains absent from public detail lookup');
    const product = catalog.getProductById(id, { includeTempo: true });
    assert.ok(product?.isActive, 'TEMPO stays active for authorized catalog readers');
    assert.equal(catalog.getProductBySlug(product.slug), undefined, 'TEMPO slug remains gated');
  }
  for (const id of RETIRED_IDS) {
    const historical = catalog.products.find(p => p.id === id);
    assert.ok(historical, 'retired historical catalog record remains available for order history');
    assert.equal(historical.isActive, false);
    assert.equal(historical.availableForSale, false);
    assert.equal(catalog.getProductById(id), undefined);
    assert.equal(catalog.getProductBySlug(historical.slug), undefined);
  }
  const retiredSlugs = [...RETIRED_REDIRECT_SLUGS, ...RETIRED_NOT_FOUND_SLUGS];
  assert.equal(RETIRED_REDIRECT_SLUGS.length, 10);
  assert.equal(RETIRED_NOT_FOUND_SLUGS.length, 29);
  assert.deepEqual(Array.from(catalog.products.filter(p => !p.isActive && /^goool-/.test(p.slug)), p => p.slug).sort(), retiredSlugs.slice().sort(), 'all 39 approved archived GOOOL records stay retired');
  for (const slug of retiredSlugs) {
    const historical = catalog.products.find(p => p.slug === slug);
    // isActive is the access gate. Some older archive rows intentionally retain
    // supplier availability metadata; the targeted nine retirement flags above
    // still have their separate exact availableForSale:false contract.
    assert.equal(historical.isActive, false, slug + ': archived record is inactive');
    assert.equal(catalog.getProductById(historical.id, { includeTempo: true }), undefined, slug + ': no archived ID lookup');
    assert.equal(catalog.getProductBySlug(slug, { includeTempo: true }), undefined, slug + ': no public or gated reactivation');
  }
  assert.ok(catalog.getProducts().every(p => !/goool/i.test(p.name)), 'no retired brand spelling in public product names');
}
module.exports = { APPROVED_BASELINE, PUBLIC_ORDER, TEMPO_IDS, RETIRED_IDS, RETIRED_REDIRECT_SLUGS, RETIRED_NOT_FOUND_SLUGS, assertApprovedCatalog };
