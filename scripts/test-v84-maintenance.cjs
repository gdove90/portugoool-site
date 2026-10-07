const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const code = ts.transpileModule(fs.readFileSync('netlify/functions/intake-maintenance.mts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
function harness(env, status = 200) {
  const exports = {}, requests = [];
  vm.runInNewContext(code, { exports, AbortSignal, Netlify: { env: { get: name => env[name] } },
    fetch: async (url, options) => { requests.push({ url, options }); return { ok: status < 400, status }; },
  });
  return { run: exports.default, schedule: exports.config.schedule, requests };
}
async function main() {
  let passed = 0;
  for (const enabled of [undefined, 'false']) {
    const h = harness({ INTAKE_ENABLED: enabled }); await h.run();
    assert.equal(h.requests.length, 0); passed++;
  }
  for (const secret of [undefined, 'short']) {
    const h = harness({ INTAKE_ENABLED: 'true', INTAKE_MAINTENANCE_SECRET: secret });
    await assert.rejects(h.run(), /not configured/); assert.equal(h.requests.length, 0); passed++;
  }
  const secret = 'x'.repeat(32), h = harness({ INTAKE_ENABLED: 'true', INTAKE_MAINTENANCE_SECRET: secret });
  await h.run(); assert.equal(h.schedule, '@hourly');
  assert.equal(h.requests.length, 1); assert.equal(h.requests[0].url, 'https://goool.shop/api/intake/maintenance');
  assert.equal(h.requests[0].options.method, 'POST'); assert.equal(h.requests[0].options.headers.Authorization, `Bearer ${secret}`);
  assert.equal(h.requests[0].options.redirect, 'error'); assert.ok(h.requests[0].options.signal); passed++;
  await assert.rejects(harness({ INTAKE_ENABLED: 'true', INTAKE_MAINTENANCE_SECRET: secret }, 503).run(), /failed: 503/); passed++;
  console.log(`${passed} maintenance scheduler checks passed. No live requests or data deletion occurred.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
