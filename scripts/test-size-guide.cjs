const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { createSourceLoader, root } = require('./fixtures/test-source-loader.cjs');
const load = createSourceLoader();
const catalog = load('src/lib/products.ts');
const audienceCatalog = load('src/v84/catalog-data.ts');
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
const FitDetails = component('src/components/FitDetails.tsx');
const SizeGuide = component('src/components/SizeGuide.tsx', { './FitDetails': FitDetails });
const pickerDependencies = {
  './SizeGuide': SizeGuide,
  './FitDetails': FitDetails,
  '@/v84/catalog-data': audienceCatalog,
  '@/v84/Brand': { Strike: () => null },
  '@/lib/product-image': load('src/lib/product-image.ts'),
  'next/image': props => React.createElement('img', props),
};
const Picker = component('src/components/SizeGuideTabs.tsx', pickerDependencies);
const publicProducts = catalog.getProducts();
assert.ok(publicProducts.length > 0, 'Public catalog has guides to review');
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
  assert.equal((html.match(/<table/g) || []).length, guide.bodyReference ? 2 : 1);
  assert.ok(!html.includes('<details'), 'Guide table is immediately visible');
  assert.equal((html.match(/<a /g) || []).length, 1, 'One guide link');
  assert.ok(!/href="https?:|tapstitch|apliiq|sanmar|bellacanvas|ottocap|blankstyle/i.test(html), 'Customer guide has no supplier names or external links');
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
assert.match(pickerHtml, /<select id="fit-guide-garment"/);
assert.ok(pickerHtml.includes('aria-label="Collection"') && pickerHtml.includes('>Men</button>') && pickerHtml.includes('>Women</button>'));
assert.equal((pickerHtml.match(/<option /g) || []).length, guides.guideProducts('men').length);
assert.equal((pickerHtml.match(/<table/g) || []).length, 1);
for (const audience of ['men', 'women']) {
  const expected = audienceCatalog.catalogOrder(publicProducts.filter(product => audienceCatalog.audienceAssignments[product.id]?.includes(audience)));
  assert.deepEqual(plain(guides.guideProducts(audience).map(product => product.id)), plain(expected.map(product => product.id)), audience + ' uses public catalog assignment and order');
  for (const product of expected) assert.equal(guides.guideAudienceFor(product.id), audience);
}
assert.equal(guides.guideProducts('men').length + guides.guideProducts('women').length, publicProducts.length, 'Every public garment belongs to a navigation row');

// Drive the component's event handlers without a browser or provider calls.
let selection;
let collectMountEffects = true;
const mountEffects = [];
const events = new Map();
const replaced = [];
const originalWindow = global.window;
global.window = {
  location: { hash: '' }, history: { replaceState: (_state, _title, url) => replaced.push(url) },
  addEventListener: (event, callback) => events.set(event, callback), removeEventListener: event => events.delete(event),
};
const InteractivePicker = component('src/components/SizeGuideTabs.tsx', {
  ...pickerDependencies,
  react: {
    ...React,
    useState: initial => [selection ??= initial, next => { selection = typeof next === 'function' ? next(selection) : next; }],
    useEffect: (effect, dependencies) => { if (collectMountEffects && dependencies.length === 0) mountEffects.push(effect); },
  },
});
const elements = tree => !tree || typeof tree !== 'object' ? [] : [tree, ...React.Children.toArray(tree.props?.children).flatMap(elements)];
const tabs = (tree, group) => elements(tree).filter(element => element.props?.role === 'tablist' && element.props['aria-label'] === group).flatMap(element => React.Children.toArray(element.props.children));
const garmentSelect = tree => elements(tree).find(element => element.type === 'select');
let tree = InteractivePicker();
collectMountEffects = false;
for (const effect of mountEffects) effect();
assert.equal(events.has('hashchange'), true);
const clickTab = (group, name) => {
  const tab = tabs(tree, group).find(tab => (tab.props['aria-label'] ?? tab.props.children) === name);
  assert.ok(tab, group + ': ' + name);
  tab.props.onClick(); tree = InteractivePicker();
};
clickTab('Collection', 'Women');
if (guides.guideProducts('women').length === 0) {
  assert.equal(selection.audience, 'men', 'The existing collection gate keeps the public women row empty');
  const directWomenProduct = catalog.products.find(product => audienceCatalog.audienceAssignments[product.id]?.includes('women'));
  global.window.location.hash = '#' + directWomenProduct.slug;
  events.get('hashchange')(); tree = InteractivePicker();
}
assert.equal(selection.audience, 'women');
assert.equal(React.Children.count(garmentSelect(tree).props.children), Math.max(1, guides.guideProducts('women').length));
const womenProduct = guides.guideProducts('women').at(-1) ?? catalog.products.find(product => product.id === selection.productId);
function selectGarment(product) {
  garmentSelect(tree).props.onChange({ target: { value: product.id } });
  tree = InteractivePicker();
}
selectGarment(womenProduct);
assert.equal(selection.productId, womenProduct.id);
assert.equal(replaced.at(-1), guides.sizeGuideHref(womenProduct.id));
assert.ok(renderToStaticMarkup(tree).includes('data-size-guide="' + womenProduct.id + '"'));
clickTab('Collection', 'Men');
const menProduct = guides.guideProducts('men').at(-1);
selectGarment(menProduct);
assert.equal(selection.productId, menProduct.id);
assert.ok(renderToStaticMarkup(tree).includes('data-size-guide="' + menProduct.id + '"'));
for (const entry of guides.GUIDE) {
  global.window.location.hash = '#' + entry.id;
  events.get('hashchange')(); tree = InteractivePicker();
  const product = guides.productForGuideHash(entry.id);
  assert.equal(selection.productId, product.id, entry.id + ' hash selects product');
  assert.equal(selection.audience, guides.guideAudienceFor(product.id), entry.id + ' hash selects audience');
  assert.equal(garmentSelect(tree).props.value, product.id, entry.id + ' hash exposes selected garment');
}
for (const product of publicProducts) {
  global.window.location.hash = '#' + product.slug;
  events.get('hashchange')(); tree = InteractivePicker();
  assert.equal(selection.productId, product.id, product.slug + ' direct hash');
  assert.equal(selection.audience, guides.guideAudienceFor(product.id), product.slug + ' audience');
}
function keyTab(group, fromIndex, key, expectedIndex) {
  const groupTabs = tabs(tree, group);
  let focused;
  let prevented = false;
  const buttons = groupTabs.map((tab, index) => ({ click: tab.props.onClick, focus: () => { focused = index; } }));
  const currentTarget = buttons[fromIndex];
  currentTarget.parentElement = { querySelectorAll: () => buttons };
  groupTabs[fromIndex].props.onKeyDown({ key, currentTarget, preventDefault: () => { prevented = true; } });
  assert.equal(prevented, true, key + ' handled');
  assert.equal(focused, expectedIndex, key + ' moves focus');
  tree = InteractivePicker();
}
keyTab('Collection', 1, 'ArrowRight', 0);
assert.equal(selection.audience, 'men');
if (guides.guideProducts('women').length) {
  keyTab('Collection', 0, 'End', 1);
  assert.equal(selection.audience, 'women');
  keyTab('Collection', 1, 'Home', 0);
  assert.equal(selection.audience, 'men');
}
global.window = originalWindow;
for (const [key, source] of Object.entries(sources.charts)) {
  const chart = charts.SIZE_CHARTS[key];
  const actual = chart.rows.map(row => key === 'as5620' ? [row.chestIn,row.lengthIn,row.inseamIn] : key === 'pst871' ? [row.chestIn,row.lengthIn] : key === 'ub0050' ? [row.chestIn,row.hipIn,row.lengthIn] : [row.chestIn,row.lengthIn,row.sleeveIn]);
  assert.deepEqual(plain(actual), source.rows, key + ' independent source measurements');
  assert.equal(chart.source, undefined, 'Source URLs stay outside public application data');
  assert.ok(source.source.startsWith('https://'), 'Development evidence retains its source');
}
assert.ok(!/https?:\/\//.test(JSON.stringify(charts.SIZE_CHARTS)), 'No supplier URLs in browser-facing chart data');
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
console.log('PASS all ' + publicProducts.length + ' public product guides: collection tabs, garment picker, gated women direct links, keyboard switching, direct/legacy hashes, complete tables, exact offered sizes, source measurements, methods, units and supplier-free rendering. No provider calls.');
