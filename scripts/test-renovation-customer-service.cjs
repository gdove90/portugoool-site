// Renovation customer-service access regression test.
// This must pass before shipping the isolated support-page hotfix.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(name, parent, ...rest) {
  if (name.startsWith("@/")) name = path.resolve(__dirname, "../src", name.slice(2));
  return originalResolve.call(this, name, parent, ...rest);
};
require.extensions[".ts"] = (mod, filename) =>
  mod._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText, filename);

const { NextRequest } = require("next/server");
const { middleware } = require("../src/middleware.ts");
const savedPreviewKey = process.env.PREVIEW_KEY;
const req = (pathname, method = "GET", host = "goool.shop") =>
  new NextRequest(`https://${host}${pathname}`, { method, headers: { host } });

async function expectPass(pathname) {
  const response = await middleware(req(pathname));
  assert.equal(response.status, 200, `Expected 200 middleware pass for ${pathname}`);
  assert.equal(response.headers.get("x-middleware-next"), "1",
    `Unexpected redirect/block for ${pathname}`);
}

async function expectGated(pathname) {
  const response = await middleware(req(pathname));
  assert.equal(response.status, 307, `Expected renovation gate for ${pathname}`);
  const target = new URL(response.headers.get("location"));
  assert.equal(target.pathname, "/gate", `Not redirected to gate: ${pathname}`);
}

(async () => {
  try {
    process.env.PREVIEW_KEY = "isolated-service-regression-test-secret";

    for (const pathname of ["/contact", "/support", "/faq", "/shipping-returns", "/size-guide"]) {
      await expectPass(pathname);
      const page = path.resolve(__dirname, "../src/app", pathname.slice(1), "page.tsx");
      assert.ok(fs.existsSync(page), `Customer service page missing: ${pathname}`);
    }

    // Existing order, policy and machine endpoints must remain unaffected.
    for (const pathname of [
      "/gate", "/track-order", "/success", "/privacy", "/terms", "/refunds",
      "/api/stripe-webhook", "/api/apliiq-fulfillment",
      "/api/fulfillment-ops", "/api/intake/maintenance",
      "/api/newsletter", "/api/track-order", "/api/order-status",
      "/print/legacy-art.svg"
    ]) await expectPass(pathname);

    for (const pathname of [
      "/", "/shop", "/men", "/women", "/cart",
      "/shop/goool-heavyweight-hoodie", "/contact-fake", "/faq/private"
    ]) await expectGated(pathname);

    const checkoutResponse = await middleware(req("/api/checkout", "POST"));
    assert.equal(checkoutResponse.status, 401, "Checkout API must remain gated");
    assert.match(checkoutResponse.headers.get("content-type") || "", /json/);

    // Old domain redirects still point to existing canonical host. No DNS changes here.
    const legacyResponse = await middleware(req("/contact", "GET", "www.goool.shop"));
    assert.equal(legacyResponse.status, 301);
    assert.equal(legacyResponse.headers.get("location"), "https://goool.shop/contact");

    console.log("PASS renovation gate: 5 support pages accessible, 14 legacy service routes preserved, catalog gated and checkout blocked.");
  } finally {
    if (savedPreviewKey === undefined) delete process.env.PREVIEW_KEY;
    else process.env.PREVIEW_KEY = savedPreviewKey;
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
