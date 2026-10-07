const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const code = ts.transpileModule(fs.readFileSync('src/v84/admin-controller.js', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
function harness() {
  const elements = new Map(), listeners = {}, requests = [], intervals = [], redirects = [];
  function element(selector) {
    if (!elements.has(selector)) elements.set(selector, {
      value: '', textContent: '', innerHTML: '', hidden: false, disabled: false, isConnected: true,
      classList: { toggle() {} }, addEventListener() {}, querySelector: element
    });
    return elements.get(selector);
  }
  const root = {
    querySelector: element, querySelectorAll: () => [],
    addEventListener(name, fn) { (listeners[name] ??= []).push(fn); }
  };
  const location = { hash: '', assign(url) { redirects.push(url); } };
  const context = {
    exports: {}, AbortController, URLSearchParams, location, confirm: () => true,
    document: { querySelector: element },
    window: { addEventListener(name, fn) { (listeners[name] ??= []).push(fn); }, scrollTo() {} },
    setInterval: callback => { intervals.push(callback); return 1; }, clearInterval() {}, setTimeout: () => 1, clearTimeout() {},
    fetch(path, options) { return new Promise(resolve => requests.push({ path, options, reply(data, ok = true) { resolve({ ok, json: async () => data }); } })); }
  };
  vm.runInNewContext(code, context);
  const cleanup = context.exports.mountAdmin(root);
  const navigate = id => { location.hash = id ? '#' + id : ''; return listeners.hashchange[0](); };
  const submission = (id, name) => ({
    id, kind: 'story', category: 'Story', status: 'new', submittedAt: '2026-10-06T12:00:00Z', notes: '', files: [],
    payload: { name, email: 'fixture@example.test', goal: '<fixture goal>', story: 'Local fixture', marketing: false },
    consent: { acceptedAt: '2026-10-06T12:00:00Z', version: 'fixture' }
  });
  return { element, location, requests, cleanup, navigate, submission, listeners, intervals, redirects };
}
async function main() {
  let passed = 0;
  async function check(name, fn) { await fn(); passed++; console.log('PASS ' + name); }
  await check('late initial session replies cannot reopen the dashboard after unmount', async () => {
    const h = harness(); h.cleanup(); h.requests[0].reply({ email: 'fixture@example.test' });
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(h.element('#admin-email').textContent, ''); assert.equal(h.requests.length, 1);
  });
  await check('refresh failures after unmount cannot redirect another page', async () => {
    const h = harness(), refresh = h.intervals[0](); h.cleanup();
    h.requests[1].reply({ error: 'Expired' }, false); await refresh;
    assert.equal(h.redirects.length, 0);
  });
  await check('late deletion replies cannot navigate away from another submission', async () => {
    const h = harness(), first = h.navigate('first');
    h.requests[1].reply(h.submission('first', 'First')); await first;
    const deleted = h.listeners.click[0]({ target: { closest: selector => selector === '#delete-submission' ? h.element(selector) : null } });
    const second = h.navigate('second'); h.requests[3].reply(h.submission('second', 'Second')); await second;
    h.requests[2].reply({ deleted: true }); await deleted;
    assert.equal(h.requests[2].path, '/api/admin/submissions/first');
    assert.equal(h.location.hash, '#second'); h.cleanup();
  });
  await check('a late detail response cannot replace the newly selected submission', async () => {
    const h = harness(), first = h.navigate('first'), second = h.navigate('second');
    h.requests[2].reply(h.submission('second', 'Second fixture')); await second;
    h.requests[1].reply(h.submission('first', 'First fixture')); await first;
    assert.ok(h.element('#detail').innerHTML.includes('Second fixture'));
    assert.ok(!h.element('#detail').innerHTML.includes('First fixture')); h.cleanup();
  });
  await check('a late detail error cannot replace the newly selected submission', async () => {
    const h = harness(), first = h.navigate('first'), second = h.navigate('second');
    h.requests[2].reply(h.submission('second', 'Second fixture')); await second;
    h.requests[1].reply({ error: 'Old request failed' }, false); await first;
    assert.ok(h.element('#detail').innerHTML.includes('Second fixture'));
    assert.ok(!h.element('#detail').innerHTML.includes('Old request failed')); h.cleanup();
  });
  await check('returning to the inbox invalidates an outstanding detail request', async () => {
    const h = harness(), pending = h.navigate('first'), inbox = h.navigate('');
    h.requests[2].reply({ items: [], counts: [], hasMore: false }); await inbox;
    const before = h.element('#detail').innerHTML;
    h.requests[1].reply(h.submission('first', 'First fixture')); await pending;
    assert.equal(h.element('#detail').innerHTML, before);
    assert.equal(h.element('#detail').hidden, true); h.cleanup();
  });
  await check('unmount aborts requests and rejects late detail changes', async () => {
    const h = harness(), pending = h.navigate('first'), before = h.element('#detail').innerHTML;
    h.cleanup(); assert.equal(h.requests[1].options.signal.aborted, true);
    h.requests[1].reply(h.submission('first', 'First fixture')); await pending;
    assert.equal(h.element('#detail').innerHTML, before);
  });
  await check('review saves retain their original id and cannot announce success on another form', async () => {
    const h = harness(), first = h.navigate('first');
    h.requests[1].reply(h.submission('first', 'First fixture')); await first;
    const feedback = { textContent: '' }, button = { disabled: false };
    const form = { id: 'review-form', isConnected: true, querySelector: s => s === 'button' ? button : feedback };
    h.element('#review-status').value = 'reviewing'; h.element('#review-notes').value = 'Fixture notes';
    const save = h.listeners.submit[0]({ target: form, preventDefault() {} });
    assert.equal(h.requests[2].path, '/api/admin/submissions/first');
    assert.deepEqual(JSON.parse(h.requests[2].options.body), { status: 'reviewing', notes: 'Fixture notes' });
    form.isConnected = false;
    const second = h.navigate('second'); h.requests[3].reply(h.submission('second', 'Second fixture')); await second;
    h.requests[2].reply({ saved: true }); await save;
    assert.equal(feedback.textContent, ''); h.cleanup();
  });
  await check('review failure is announced on the active form and re-enables retry', async () => {
    const h = harness(), first = h.navigate('first');
    h.requests[1].reply(h.submission('first', 'First fixture')); await first;
    const feedback = { textContent: '' }, button = { disabled: false };
    const form = { id: 'review-form', isConnected: true, querySelector: s => s === 'button' ? button : feedback };
    const save = h.listeners.submit[0]({ target: form, preventDefault() {} });
    h.requests[2].reply({ error: 'Retry this fixture' }, false); await save;
    assert.equal(feedback.textContent, 'Retry this fixture'); assert.equal(button.disabled, false); h.cleanup();
  });
  console.log(`\n${passed} dashboard controller checks passed. These use a local DOM/transport harness, not provider authentication.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
