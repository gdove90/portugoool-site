// Read-only public-page checks. No cart, checkout, account or provider calls.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const parse5 = require('parse5');
const { createSourceLoader } = require('./fixtures/test-source-loader.cjs');
const load = createSourceLoader();
const products = load('src/lib/products.ts').getProducts();
const guide = load('src/lib/size-guide.ts');
const base = process.env.SIZE_GUIDE_BASE_URL || 'http://127.0.0.1:3026';
const all = node => [node, ...(node.childNodes || []).flatMap(all)];
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;

(async () => {
  const results = [];
  const scripts = new Set();
  const collectScripts = nodes => {
    for (const node of nodes) {
      const src = attr(node, 'src');
      if (node.tagName === 'script' && src?.startsWith('/_next/static/')) scripts.add(src);
    }
  };
  for (const product of products) {
    const response = await fetch(base + '/shop/' + product.slug);
    assert.equal(response.status, 200, product.slug);
    const nodes = all(parse5.parse(await response.text()));
    collectScripts(nodes);
    const dialog = nodes.find(node => node.tagName === 'dialog' && attr(node, 'class') === 'info-dialog');
    assert.ok(dialog, product.slug + ' fit dialog');
    const inside = all(dialog);
    assert.equal(inside.filter(node => node.tagName === 'table').length, 1, product.slug);
    assert.ok(inside.some(node => attr(node, 'data-size-guide') === product.id));
    const sizes = inside.filter(node => node.tagName === 'th' && attr(node, 'scope') === 'row').map(node => node.childNodes.map(child => child.value || '').join(''));
    assert.deepEqual(sizes, Array.from(product.sizes, size => size === 'OS' ? 'One size' : size));
    const links = inside.filter(node => node.tagName === 'a');
    assert.equal(links.length, 1);
    assert.equal(attr(links[0], 'href'), guide.sizeGuideHref(product.id));
    assert.ok(!links.some(node => /^https?:/i.test(attr(node, 'href') || '')), 'No external links in ' + product.slug + ' sizing guide');
    results.push({ slug: product.slug, status: response.status, rows: sizes.length, table: 'PASS', directLink: 'PASS' });
  }
  const response = await fetch(base + '/size-guide');
  assert.equal(response.status, 200);
  const nodes = all(parse5.parse(await response.text()));
  collectScripts(nodes);
  const audienceTabs = nodes.filter(node => attr(node, 'role') === 'tab' && attr(node, 'id')?.startsWith('size-guide-audience-'));
  assert.deepEqual(audienceTabs.map(node => node.childNodes.map(child => child.value || '').join('')), ['Men', 'Women']);
  assert.ok(!nodes.some(node => node.tagName === 'select'), 'Sizing navigation has no dropdown');
  const productTabs = nodes.filter(node => attr(node, 'data-guide-product'));
  assert.deepEqual(productTabs.map(node => attr(node, 'data-guide-product')), Array.from(guide.guideProducts('men'), product => product.id));
  assert.equal(productTabs.filter(node => attr(node, 'aria-selected') === 'true').length, 1);
  for (const src of scripts) {
    const response = await fetch(base + src);
    assert.equal(response.status, 200, src);
    assert.ok(!/(?:apliiq|tapstitch|sanmar|bellacanvas|independenttradingco|comfortcolors|ascolour|ottocap|blankstyle|bigcommerce|dc-onesource)\.com/i.test(await response.text()), 'No supplier website references in public JavaScript: ' + src);
  }
  if (process.env.SIZE_GUIDE_EVIDENCE) fs.writeFileSync(process.env.SIZE_GUIDE_EVIDENCE, JSON.stringify({ base, products: results, mainGuideAudiences: ['Men', 'Women'], initialProductTabs: productTabs.length, publicScriptsChecked: scripts.size, passed: true }, null, 2));
  console.log(`PASS ${base}: all ${products.length} product guides and ${scripts.size} public scripts; correct tables/sizes/links and no supplier website references.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
