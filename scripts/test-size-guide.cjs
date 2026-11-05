const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { createSourceLoader, root } = require('./fixtures/test-source-loader.cjs');
const load = createSourceLoader();
const catalog = load('src/lib/products.ts');
const charts = load('src/lib/size-charts.ts');
const guides = load('src/lib/size-guide.ts');
const sources = require('../docs/catalog/size-guide-sources-20261104.json');
const plain = value => JSON.parse(JSON.stringify(value));

function component(file, overrides = {}) {
  const module = { exports: {} };
  const dependencies = {
    react: React, 'react/jsx-runtime': require('react/jsx-runtime'),
    'next/link': ({ href, children, ...props }) => React.createElement('a', { href, ...props }, children),
    '@/lib/size-guide': guides, ...overrides,
  };
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  new Function('require', 'module', 'exports', code)(name => {
    assert.ok(name in dependencies, 'Unexpected component dependency: ' + name);
    return dependencies[name];
  }, module, module.exports);
  return module.exports.default;
}
const SizeGuide = component('src/components/SizeGuide.tsx');
const Picker = component('src/components/SizeGuideTabs.tsx', { './SizeGuide': SizeGuide });
const publicProducts = catalog.getProducts();
assert.equal(publicProducts.length, 14, 'Audit scope changed; review size guide coverage');
assert.deepEqual(plain(guides.guideProducts().map(p => p.id)), plain(publicProducts.map(p => p.id)));
for (const product of publicProducts) {
  const guide = guides.sizeGuideFor(product.id);
  assert.ok(guide, product.slug);
  assert.equal(guide.title, product.name);
  assert.deepEqual(plain(guide.rows.map(row => row.size === 'One size' ? 'OS' : row.size)), plain(product.sizes), product.slug + ' offered sizes');
  assert.ok(guide.columns.length > 0 && guide.rows.length > 0, product.slug + ' complete table');
  assert.equal(guides.productForGuideHash(product.slug)?.id, product.id);
  assert.equal(guides.sizeGuideHref(product.id), '/size-guide#' + product.slug);
  assert.ok(!guide.columns.some(column => /around|measure yourself/i.test(column.label + column.method)));
  for (const row of guide.rows) {
    assert.equal(row.values.length, guide.columns.length);
    for (const value of row.values.flat()) assert.ok(typeof value === 'number' && Number.isFinite(value) && value > 0, product.slug);
  }
  const html = renderToStaticMarkup(React.createElement(SizeGuide, { productId: product.id }));
  assert.equal((html.match(/<table/g) || []).length, 1);
  assert.ok(!html.includes('<details'), 'Guide table is immediately visible');
  assert.equal((html.match(/<a /g) || []).length, 1, 'One guide link');
  assert.ok(html.includes('scope="row"') && html.includes('<caption'));
  assert.equal((html.match(/aria-pressed=/g) || []).length, 2);
  assert.ok(!/measure yourself|still to be published|Chest, around/.test(html));
}
for (const entry of guides.GUIDE) assert.ok(entry.productIds.includes(guides.productForGuideHash(entry.id)?.id), entry.id + ' legacy alias');
const ids = guides.GUIDE.flatMap(entry => entry.productIds);
assert.equal(new Set(ids).size, ids.length, 'No ambiguous product mappings');
assert.equal(guides.productForGuideHash('unknown-product'), undefined);
assert.equal(guides.sizeGuideFor('unknown-product'), null);
const pickerHtml = renderToStaticMarkup(React.createElement(Picker));
assert.equal((pickerHtml.match(/<option /g) || []).length, publicProducts.length);
assert.equal((pickerHtml.match(/<table/g) || []).length, 1);
for (const [key, source] of Object.entries(sources.charts)) {
  const chart = charts.SIZE_CHARTS[key];
  const actual = chart.rows.map(row => key === 'as5620' ? [row.chestIn,row.lengthIn,row.inseamIn] : key === 'pst871' ? [row.chestIn,row.lengthIn] : key === 'ub0050' ? [row.chestIn,row.hipIn,row.lengthIn] : [row.chestIn,row.lengthIn,row.sleeveIn]);
  assert.deepEqual(plain(actual), source.rows, key + ' independent source measurements');
  assert.equal(chart.source, source.source);
}
assert.deepEqual(plain(guides.sizeGuideFor('80000000-0000-4000-8000-000000000009').rows[0].values[0]), sources.headwear.headRangeIn);
assert.equal(guides.sizeGuideFor('80000000-0000-4000-8000-000000000023').columns.at(-1).method, 'shoulder seam to cuff');
assert.equal(guides.sizeGuideFor('90000000-0000-4000-8000-000000000001').columns.at(-1).label, 'Full length');
assert.equal(guides.sizeGuideFor('80000000-0000-4000-8000-000000000017').columns[0].label, 'Bust, flat');
assert.equal(guides.formatMeasurement(13.78, 'in'), '13.78');
assert.equal(guides.formatMeasurement(13.78, 'cm'), '35');
assert.equal(guides.formatMeasurement(21.5, 'cm'), '54.6');
assert.equal(guides.formatMeasurement(100, 'in'), '100');
assert.equal(guides.formatMeasurement([20.5,24], 'in'), '20.5–24');
assert.equal(guides.formatMeasurement(3 / 2.54, 'cm'), '3');
assert.equal(guides.formatMeasurement(null, 'in'), '—');
console.log('PASS all 14 public product guides: complete tables, exact offered sizes, source measurements, correct garment methods, unit conversion, direct/legacy links, semantic immediate rendering and one navigation link. No provider calls.');
