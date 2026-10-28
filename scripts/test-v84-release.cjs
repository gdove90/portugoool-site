const assert = require('node:assert/strict');
const { parse } = require('parse5');
const base = process.env.V84_TEST_URL || 'http://127.0.0.1:3184';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname), 'Use an isolated local preview only.');
const routes = ['/', '/men', '/women', '/shop', '/about', '/kit-wear', '/references', '/whats-your-goool', '/contact', '/faq', '/shipping-returns', '/size-guide', '/privacy', '/terms', '/refunds', '/cart', '/success', '/track-order', '/admin/sign-in', '/share-your-goals/preview/goal', '/share-your-goals/preview/highlight', '/share-your-goals/preview/save'];
function nodes(root) {
  const result = [];
  function visit(node) { result.push(node); for (const child of node.childNodes || []) visit(child); }
  visit(root); return result;
}
async function main() {
  // Owner-only pages send a signed-out visitor to the owner sign-in.
  // /whats-your-goool is the public What's Your GOAL? funnel again (2026-10-28).
  for (const route of ['/share-your-goals', '/share-your-goals/preview/goal']) {
    const response = await fetch(base + route, { redirect: 'manual' });
    assert.ok([303, 307, 308].includes(response.status), route + ' is owner-only, got ' + response.status);
    assert.equal(new URL(response.headers.get('location'), base).pathname, '/admin/sign-in', route + ' redirects to the owner sign-in');
  }
  const links = new Set(), assets = new Set(); let checked = 0;
  for (const route of routes) {
    const response = await fetch(base + route); assert.equal(response.status, 200, route);
    const tree = nodes(parse(await response.text()));
    assert.ok(tree.some(n => n.tagName === 'h1'), route + ' needs a heading');
    const canonical = tree.find(n => n.tagName === 'link' && n.attrs.some(a => a.name === 'rel' && a.value === 'canonical'));
    assert.ok(canonical, route + ' needs a canonical');
    if (route === '/') {
      const footer = tree.find(node => node.tagName === 'footer');
      assert.ok(footer, 'Homepage needs the shared footer');
      const collection = nodes(footer).find(node => node.tagName === 'a' && node.attrs.some(attr => attr.name === 'href' && attr.value === '/shop'));
      assert.ok(collection, 'Footer needs its collection link');
      assert.equal(nodes(collection).filter(node => node.nodeName === '#text').map(node => node.value).join('').trim(), 'The collection', 'Match the approved footer label');
      // Your Story and Match Highlights are owner-only since 2026-10-22: no
      // desktop, mobile or footer link reaches them.
      for (const scope of [...tree.filter(node => node.tagName === 'nav'), footer]) {
        for (const href of ['/whats-your-goool', '/share-your-goals']) {
          const link = nodes(scope).find(node => node.tagName === 'a' && node.attrs.some(attr => attr.name === 'href' && attr.value === href));
          assert.equal(link, undefined, 'Shared navigation no longer links ' + href);
        }
      }
    }
    for (const node of tree) {
      for (const attr of node.attrs || []) {
        if (!['href', 'src'].includes(attr.name) || !attr.value.startsWith('/') || attr.value.startsWith('//')) continue;
        const url = new URL(attr.value, base);
        if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/image')) continue;
        if (node.tagName === 'a' && attr.name === 'href') links.add(url.pathname + url.search);
        else if (attr.name === 'src' || node.tagName === 'link' && ['.css', '.woff2'].some(ext => url.pathname.endsWith(ext))) assets.add(url.pathname + url.search);
      }
    }
    checked++;
  }
  for (const url of new Set([...links, ...assets])) {
    const response = await fetch(base + url, { method: 'HEAD' });
    assert.ok(response.ok, `${url}: ${response.status}`); checked++;
  }
  const designPreview = process.env.V84_DESIGN_PREVIEW === 'true';
  let productRoutes = [...links].filter(path => path.startsWith('/shop/'));
  if (designPreview) {
    assert.equal(productRoutes.length, 0, 'Unapproved products must remain absent from design-preview navigation.');
    const manifest = JSON.parse(require('node:fs').readFileSync(require('node:path').join(__dirname, '..', process.env.NEXT_DIST_DIR || '.next', 'prerender-manifest.json'), 'utf8'));
    productRoutes = Object.keys(manifest.routes).filter(route => route.startsWith('/shop/'));
    for (const endpoint of ['/api/checkout','/api/stripe-webhook','/api/apliiq-fulfillment','/.netlify/functions/deliver-emails']) {
      assert.equal((await fetch(base+endpoint)).status, 503, endpoint+' must be non-operational in design preview'); checked++;
    }
  }
  // Seven catalog routes since 2026-10-22: five clothing products and the two caps.
  assert.equal(productRoutes.length, 7, 'All seven existing product routes must remain available.');
  for (const route of productRoutes) {
    const response = await fetch(base + route); assert.equal(response.status, 200, route);
    const tree = nodes(parse(await response.text()));
    const headings = tree.filter(node => node.tagName === 'h1');
    assert.equal(headings.length, 1, route + ' needs exactly one primary heading');
    assert.ok(headings[0].childNodes.some(node => node.nodeName === '#text' && node.value.trim()), route + ' needs its product name');
    const canonical = tree.find(node => node.tagName === 'link' && node.attrs.some(attr => attr.name === 'rel' && attr.value === 'canonical'));
    assert.ok(canonical, route + ' needs a canonical');
    const href = canonical.attrs.find(attr => attr.name === 'href')?.value;
    assert.equal(new URL(href, base).pathname, route, route + ' must not inherit the homepage canonical');
    checked++;
  }
  for (const path of ['/participation-agreement.html', '/story-participation-agreement.html', '/intake-privacy.html']) {
    assert.equal((await fetch(base + path)).status, 200, path); checked++;
  }
  const alias = await fetch(base + '/collection', { redirect: 'manual' });
  assert.equal(alias.status, 308); assert.equal(alias.headers.get('location'), '/shop'); checked++;
  const unknown = await fetch(base + '/v84-test-route-that-does-not-exist');
  assert.equal(unknown.status, 404); checked++;
  console.log(`${checked} local release route/link/asset checks passed across ${routes.length + productRoutes.length} pages, including every product heading and canonical path. No forms, checkout sessions, provider writes or owner authentication were performed.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
