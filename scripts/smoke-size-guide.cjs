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
  for (const product of products) {
    const response = await fetch(base + '/shop/' + product.slug);
    assert.equal(response.status, 200, product.slug);
    const nodes = all(parse5.parse(await response.text()));
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
    results.push({ slug: product.slug, status: response.status, rows: sizes.length, table: 'PASS', directLink: 'PASS' });
  }
  const response = await fetch(base + '/size-guide');
  assert.equal(response.status, 200);
  const nodes = all(parse5.parse(await response.text()));
  assert.equal(nodes.filter(node => node.tagName === 'option').length, products.length);
  if (process.env.SIZE_GUIDE_EVIDENCE) fs.writeFileSync(process.env.SIZE_GUIDE_EVIDENCE, JSON.stringify({ base, products: results, mainGuideOptions: products.length, passed: true }, null, 2));
  console.log(`PASS ${base}: all ${products.length} product dialogs have a matching table, exact offered sizes and one direct guide link; main guide lists every product.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
