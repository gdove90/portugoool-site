const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const code = ts.transpileModule(fs.readFileSync('src/v84/upload-client.js', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const files = [{ file: { name: 'fixture.mp4', size: 128, lastModified: 1, type: 'video/mp4' }, purpose: 'main' }];
function harness() {
  const exported = {}, requests = [], uploads = [], listeners = new Map();
  let uploadFails = false, finishFails = false, holdUpload = false;
  class Upload {
    constructor(file, options) { this.options = options; uploads.push(this); }
    start() {
      this.url = 'https://storage.example.test/resumable/fixture';
      this.options.onUploadUrlAvailable();
      if (holdUpload) return;
      if (uploadFails) this.options.onError();
      else this.options.onSuccess();
    }
  }
  const fetch = async (url, options) => {
    requests.push({ url, options });
    if (url.endsWith('/start')) return { ok: true, json: async () => ({
      id: 'fixture', token: 'scoped-token', expiresAt: Date.now() + 86400000,
      bucket: 'private-fixture', uploadEndpoint: 'https://storage.example.test/resumable',
      files: JSON.parse(options.body).files.map((file, i) => ({ ...file, id: String(i), objectKey: `fixture/${i}`, signature: 'first-signature' })),
    }) };
    if (url.endsWith('/refresh')) return { ok: true, json: async () => ({ files: [{ id: '0', signature: 'renewed-signature' }] }) };
    if (url.endsWith('/finish')) return { ok: !finishFails, json: async () => finishFails ? { error: 'Receipt unavailable' } : { id: 'fixture' } };
    throw new Error('Unexpected request ' + url);
  };
  vm.runInNewContext(code, { exports: exported, require: name => {
    assert.equal(name, 'tus-js-client'); return { Upload };
  }, fetch, window: {
    addEventListener: (type, callback) => listeners.set(type, callback),
    removeEventListener: (type, callback) => { assert.equal(listeners.get(type), callback); listeners.delete(type); },
  }, Map, Date });
  return { send: exported.sendIntake, requests, uploads, listeners,
    failUpload: value => { uploadFails = value; }, failFinish: value => { finishFails = value; }, hold: value => { holdUpload = value; } };
}
let passed = 0;
async function check(name, run) { await run(); console.log('PASS ' + name); passed++; }
async function main() {
  await check('interrupted uploads renew the scoped signature and resume without a second draft', async () => {
    const h = harness(); h.failUpload(true);
    await assert.rejects(h.send('video', { name: 'Fixture' }, files, () => {}), /Upload interrupted/);
    assert.equal(h.listeners.size, 0);
    h.failUpload(false);
    assert.equal((await h.send('video', { name: 'Fixture' }, files, () => {})).id, 'fixture');
    assert.equal(h.requests.filter(r => r.url.endsWith('/start')).length, 1);
    assert.equal(h.requests.filter(r => r.url.endsWith('/refresh')).length, 1);
    assert.equal(h.uploads[1].options.uploadUrl, h.uploads[0].url);
    assert.equal(h.uploads[1].options.headers['x-signature'], 'renewed-signature');
    assert.equal(h.uploads[1].options.chunkSize, 6 * 1024 * 1024);
    assert.equal(h.uploads[1].options.storeFingerprintForResuming, false);
    assert.equal(h.listeners.size, 0);
  });
  await check('receipt failures retry completion without re-uploading completed files', async () => {
    const h = harness(); h.failFinish(true);
    await assert.rejects(h.send('video', {}, files, () => {}), /Receipt unavailable/);
    h.failFinish(false); await h.send('video', {}, files, () => {});
    assert.equal(h.uploads.length, 1);
    assert.equal(h.requests.filter(r => r.url.endsWith('/start')).length, 1);
    assert.equal(h.requests.filter(r => r.url.endsWith('/finish')).length, 2);
    assert.equal(h.listeners.size, 0);
  });
  await check('changed payload starts a fresh draft instead of reusing old consent', async () => {
    const h = harness(); h.failUpload(true);
    await assert.rejects(h.send('video', { permission: true }, files, () => {}));
    h.failUpload(false); await h.send('video', { permission: false }, files, () => {});
    assert.equal(h.requests.filter(r => r.url.endsWith('/start')).length, 2);
  });
  await check('concurrent submissions are rejected while the original can still complete', async () => {
    const h = harness(); h.hold(true);
    const first = h.send('video', {}, files, () => {});
    // Start awaits the local transport before constructing the upload.
    while (!h.uploads.length) await Promise.resolve();
    await assert.rejects(h.send('story', {}, [], () => {}), /Another submission/);
    assert.equal(h.listeners.size, 1);
    h.uploads[0].options.onSuccess(); await first;
    assert.equal(h.listeners.size, 0);
  });
  await check('successful submissions discard sessions and zero-file stories need no upload', async () => {
    const h = harness(); await h.send('story', {}, [], () => {}); await h.send('story', {}, [], () => {});
    assert.equal(h.uploads.length, 0);
    assert.equal(h.requests.filter(r => r.url.endsWith('/start')).length, 2);
    assert.equal(h.requests[1].options.headers['X-Upload-Token'], 'scoped-token');
    assert.equal(h.listeners.size, 0);
  });
  console.log(`\n${passed} upload client checks passed. No live storage or provider calls were made.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
