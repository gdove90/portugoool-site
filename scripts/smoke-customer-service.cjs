// Read-only HTTP checks. Run against a build with PREVIEW_KEY configured.
const assert = require('node:assert/strict');
const base = process.env.SERVICE_TEST_URL || 'http://127.0.0.1:3035';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname), 'Use only an isolated local server.');
const { parse } = require('parse5');
function elements(html) {
  const out = [];
  function visit(node) { if (node.tagName) out.push(node); for (const child of node.childNodes || []) visit(child); }
  visit(parse(html)); return out;
}
const attr = (node, name) => node.attrs.find(a => a.name === name)?.value;
(async () => {
  let count = 0;
  for (const [route, heading] of [['/contact', 'Here to help.'], ['/faq', 'A few answers.'], ['/shipping-returns', 'Shipping &amp; returns.'], ['/track-order', 'Track']]) {
    const response = await fetch(base + route, { redirect: 'manual' });
    assert.equal(response.status, 200, route);
    const html = await response.text(), nodes = elements(html);
    assert.ok(html.includes(heading), route + ' content');
    assert.ok(nodes.some(n => attr(n, 'aria-label') === 'Customer service'), route + ' service navigation');
    assert.ok(nodes.some(n => n.tagName === 'a' && attr(n, 'href') === '/contact'), route + ' contact link');
    assert.ok(!nodes.some(n => n.tagName === 'dialog' || ['search-results', 'bag-dialog'].includes(attr(n, 'id'))), route + ' no catalog dialogs');
    assert.ok(!nodes.some(n => n.tagName === 'a' && /^\/shop(?:\/|$)/.test(attr(n, 'href') || '')), route + ' no catalog links');
    count++;
  }
  const support = await fetch(base + '/support', { redirect: 'manual' });
  assert.equal(support.status, 308);
  assert.equal(new URL(support.headers.get('location'), base).pathname, '/contact'); count++;
  for (const route of ['/', '/shop', '/men', '/cart', '/shop/goool-athletics-badge-cap']) {
    const response = await fetch(base + route, { redirect: 'manual' });
    assert.equal(response.status, 307, route);
    assert.equal(new URL(response.headers.get('location'), base).pathname, '/gate'); count++;
  }
  // Public TEMPO announcement is the reviewed exception; its products remain gated.
  const women = await fetch(base + '/women', { redirect: 'manual' });
  assert.equal(women.status, 200, 'TEMPO coming-soon page is publicly readable while store is closed');
  const womenHtml = await women.text(), womenNodes = elements(womenHtml);
  assert.match(womenHtml, /Coming soon/i, 'TEMPO announcement retains its coming-soon status');
  assert.match(womenHtml, /Tempo/, 'TEMPO collection identity remains present');
  assert.ok(!womenNodes.some(n => n.tagName === 'a' && /^\/shop\//.test(attr(n, 'href') || '')), 'Public announcement does not expose product routes');
  assert.ok(!womenNodes.some(n => n.tagName === 'button' && /Add to bag/i.test((n.childNodes || []).map(c => c.value || '').join(''))), 'Public announcement has no purchase action');
  const womenCanonical = womenNodes.find(n => n.tagName === 'link' && attr(n, 'rel') === 'canonical');
  assert.equal(new URL(attr(womenCanonical, 'href'), base).pathname, '/women'); count++;
  const tempo = await fetch(base + '/shop/tempo-core-training-tee', { redirect: 'manual' });
  assert.equal(tempo.status, 307, 'A public announcement never opens gated TEMPO shopping');
  assert.equal(new URL(tempo.headers.get('location'), base).pathname, '/gate'); count++;
  const checkout = await fetch(base + '/api/checkout', { redirect: 'manual' });
  assert.equal(checkout.status, 401); assert.match(checkout.headers.get('content-type'), /json/); count++;
  const gate = await fetch(base + '/gate');
  const gateNodes = elements(await gate.text());
  assert.ok(gateNodes.some(n => n.tagName === 'a' && attr(n, 'href') === '/contact'));
  assert.ok(!gateNodes.some(n => n.tagName === 'dialog')); count++;
  console.log(`${count} read-only HTTP checks passed at ${base}; no orders, emails or supplier requests sent.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
