const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(name, parent, ...rest) {
  return resolve.call(this, name.startsWith('@/') ? path.resolve('src', name.slice(2)) : name, parent, ...rest);
};
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText, f);
const { NextRequest } = require('next/server');
const { middleware } = require('../src/middleware.ts');
const { gateToken, GATE_COOKIE } = require('../src/lib/gate.ts');
const originalKey = process.env.PREVIEW_KEY;
const request = (route, method = 'GET', cookie = '', host = 'goool.shop') => new NextRequest(`https://${host}${route}`, { method, headers: { host, cookie } });
let passed = 0;
async function check(name, fn) { await fn(); passed++; console.log('PASS ' + name); }
(async () => {
  process.env.PREVIEW_KEY = 'test-only-customer-service';
  await check('four exact customer-service routes bypass the gate without cookies', async () => {
    for (const route of ['/contact', '/support', '/faq', '/shipping-returns']) {
      for (const method of ['GET', 'HEAD']) assert.equal((await middleware(request(route, method))).headers.get('x-middleware-next'), '1', route);
    }
  });
  await check('catalog, product, cart and adjacent service-like paths stay gated', async () => {
    for (const route of ['/', '/shop', '/men', '/women', '/cart', '/shop/goool-athletics-badge-cap', '/contact/catalog', '/faq-private', '/support/shop', '/shipping-returns-extra']) {
      for (const cookie of ['', 'goool_preview=test-only-customer-service', 'goool_gate=invalid']) {
        const response = await middleware(request(route, 'GET', cookie));
        assert.equal(response.status, 307, route);
        assert.equal(new URL(response.headers.get('location')).pathname, '/gate', route);
      }
    }
  });
  await check('checkout and other private APIs still refuse anonymous calls as JSON', async () => {
    for (const route of ['/api/checkout', '/api/discount', '/api/contact']) {
      const response = await middleware(request(route, 'POST'));
      assert.equal(response.status, 401, route);
      assert.match(response.headers.get('content-type'), /json/);
    }
  });
  await check('existing order, policy, callback, worker and supplier-file exceptions survive', async () => {
    for (const route of ['/track-order', '/success', '/privacy', '/terms', '/refunds', '/gate', '/api/preview', '/api/newsletter', '/api/track-order', '/api/order-status', '/api/stripe-webhook', '/api/apliiq-fulfillment', '/api/fulfillment-ops', '/api/intake/maintenance', '/print/legacy.png', '/unsubscribe/legacy-token', '/.netlify/functions/deliver-emails']) {
      assert.equal((await middleware(request(route, route.startsWith('/api/') ? 'POST' : 'GET'))).headers.get('x-middleware-next'), '1', route);
    }
  });
  await check('authorized owner cookie still passes the gate', async () => {
    const cookie = `${GATE_COOKIE}=${await gateToken(process.env.PREVIEW_KEY)}`;
    for (const route of ['/shop', '/cart']) assert.equal((await middleware(request(route, 'GET', cookie))).headers.get('x-middleware-next'), '1');
  });
  await check('legacy customer support remains reachable without redirect', async () => {
    for (const host of ['portugoool.com', 'www.portugoool.com', 'www.goool.shop']) {
      const response = await middleware(request('/contact?from=order', 'GET', '', host));
      assert.equal(response.headers.get('x-middleware-next'), '1');
    }
  });
  await check('explicit reopening works after removing the password', async () => {
    delete process.env.PREVIEW_KEY;
    process.env.STORE_OPEN = 'true';
    assert.equal((await middleware(request('/shop'))).headers.get('x-middleware-next'), '1');
  });
  console.log(`${passed} customer-service gate suites passed. No provider requests made.`);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => {
  if (originalKey === undefined) delete process.env.PREVIEW_KEY; else process.env.PREVIEW_KEY = originalKey;
});
