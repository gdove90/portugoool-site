const assert = require('node:assert/strict');
const base = process.env.V84_TEST_URL || 'http://127.0.0.1:3184';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('This test is restricted to a local, unconfigured preview.');
async function main() {
  let passed = 0;
  for (const path of ['/api/admin/session', '/api/admin/submissions', '/api/admin/files/00000000-0000-0000-0000-000000000001']) {
    const response = await fetch(base + path, { headers: { 'x-is-admin': 'true', 'x-owner-email': 'owner@example.test' } });
    assert.equal(response.status, 403, path); assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.match((await response.json()).error, /restricted/); passed++;
  }
  const admin = await fetch(base + '/admin', { redirect: 'manual' });
  assert.equal(admin.status, 307); assert.equal(admin.headers.get('location'), '/admin/sign-in'); passed++;
  const crossOrigin = await fetch(base + '/api/intake/start', { method: 'POST', headers: { Origin: 'https://other.example.test', 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(crossOrigin.status, 403); passed++;
  const data = { kind: 'story', files: [], payload: { name: 'Local test', email: 'fixture@example.test', goal: 'Test safely', story: 'A local test fixture, never sent to a live service.', adult: true, rights: true, permission: true, termsVersion: 'WYG-2026-10-04-live-1' } };
  const disabled = await fetch(base + '/api/intake/start', { method: 'POST', headers: { Origin: base, 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  assert.equal(disabled.status, 503); assert.match((await disabled.json()).error, /not ready/); passed++;
  console.log(`${passed} local HTTP checks passed: owner-only endpoints reject forged headers, admin redirects, cross-origin writes fail, and unconfigured intake fails closed.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
