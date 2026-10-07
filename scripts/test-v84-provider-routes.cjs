const assert = require('node:assert/strict');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { randomBytes, randomUUID, createHmac } = require('node:crypto');
const { createClient } = require('@supabase/supabase-js');
const { Upload } = require('tus-js-client');

async function main() {
  let input = ''; for await (const part of process.stdin) input += part;
  const keys = JSON.parse(input), service = keys.find(k => k.name === 'service_role')?.api_key, anon = keys.find(k => k.name === 'anon')?.api_key;
  assert(service && anon);
  const client = createClient('https://oexibflpshttgzmdvhpr.supabase.co', service, { auth: { persistSession: false, autoRefreshToken: false } });
  const checked = result => { if (result.error) throw new Error('Provider fixture operation failed'); return result.data; };
  const origin = 'http://127.0.0.1:3185', bucket = 'goool-intake', fixtures = [], users = [];
  const rateSecret = randomBytes(32).toString('hex'), password = randomBytes(32).toString('hex');
  const maintenanceSecret = randomBytes(32).toString('hex');
  let child;
  try {
    for (const role of ['owner', 'nonowner']) {
      const email = `release-${role}-${randomUUID()}@example.test`;
      const data = checked(await client.auth.admin.createUser({ email, password, email_confirm: true }));
      users.push({ id: data.user.id, email });
    }
    child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3185'], {
      cwd: path.resolve(__dirname, '..'), windowsHide: true, stdio: 'ignore',
      env: { ...process.env, INTAKE_ENABLED: 'true', INTAKE_SUPABASE_URL: 'https://oexibflpshttgzmdvhpr.supabase.co', INTAKE_SERVICE_ROLE_KEY: service, INTAKE_ANON_KEY: anon, INTAKE_BUCKET: bucket, INTAKE_OWNER_IDS: users[0].id, INTAKE_RATE_SECRET: rateSecret, INTAKE_MAINTENANCE_SECRET: maintenanceSecret, INTAKE_SITE_ORIGINS: origin }
    });
    for (let i = 0; i < 60; i++) {
      try { if ((await fetch(origin)).ok) break; } catch {}
      if (i === 59) throw new Error('Fixture server did not start');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    const request = (route, data, cookie = '', method = 'POST', extra = {}) => fetch(origin + route, { method, redirect: 'manual', signal: AbortSignal.timeout(45000), headers: { Origin: origin, 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}), ...extra }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) });
    const cookieFrom = response => response.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
    const rejected = await request('/api/admin/auth', { email: users[1].email, password });
    assert.equal(rejected.status, 403);
    const login = await request('/api/admin/auth', { email: users[0].email, password });
    assert.equal(login.status, 200);
    const ownerCookies = login.headers.getSetCookie().filter(value => value.startsWith('goool-owner-'));
    assert.equal(ownerCookies.length, 2);
    assert(ownerCookies.every(value => /HttpOnly/i.test(value) && /SameSite=Strict/i.test(value)));
    let cookie = cookieFrom(login);
    assert.equal((await request('/api/admin/session', undefined, '', 'GET')).status, 403);
    assert.equal((await request('/api/admin/session', undefined, cookie, 'GET')).status, 200);
    console.log('PASS actual owner login, HttpOnly cookies, non-owner and anonymous rejection');
    const batchTag = `release-pagination-${randomUUID()}`;
    const batch = Array.from({ length: 55 }, (_, index) => ({
      id: randomUUID(), kind: 'story', category: 'story', status: index < 5 ? 'reviewing' : 'new',
      state: 'received', name: batchTag, email: 'release-fixture@example.test', team: '',
      payload: {}, consent: {}, upload_token_hash: randomBytes(32).toString('hex'),
      upload_expires_at: new Date(Date.now() + 86400000).toISOString(),
      submitted_at: new Date(Date.now() - index * 1000).toISOString(),
    }));
    fixtures.push(...batch.map(row => ({ id: row.id, files: [] })));
    checked(await client.from('intake_submissions').insert(batch));
    const first = await (await request(`/api/admin/submissions?q=${batchTag}&kind=story`, undefined, cookie, 'GET')).json();
    assert.equal(first.items.length, 50); assert.equal(first.hasMore, true);
    const second = await (await request(`/api/admin/submissions?q=${batchTag}&kind=story&offset=50`, undefined, cookie, 'GET')).json();
    assert.equal(second.items.length, 5); assert.equal(second.hasMore, false);
    assert.equal(new Set([...first.items, ...second.items].map(row => row.id)).size, 55);
    assert.deepEqual([...first.items, ...second.items].map(row => row.id), batch.map(row => row.id));
    const filtered = await (await request(`/api/admin/submissions?q=${batchTag}&status=reviewing`, undefined, cookie, 'GET')).json();
    assert.equal(filtered.items.length, 5);
    assert.equal((await request('/api/admin/submissions?status=invalid', undefined, cookie, 'GET')).status, 400);
    assert.equal((await request(`/api/admin/submissions?q=${batchTag}`, undefined, '', 'GET')).status, 403);
    console.log('PASS real owner inbox search, status/kind filters, stable 50+5 pagination, invalid filter and anonymous rejection');
    const drafts = [3, -1].map(days => ({ ...batch[0], id: randomUUID(), state: 'draft', submitted_at: null,
      upload_expires_at: new Date(Date.now() - days * 86400000).toISOString() }));
    fixtures.push(...drafts.map(row => ({ id: row.id, files: [] })));
    checked(await client.from('intake_submissions').insert(drafts));
    assert.equal((await request('/api/intake/maintenance', {}, '', 'POST')).status, 403);
    assert.equal((await request('/api/intake/maintenance', {}, '', 'POST', { Authorization: `Bearer ${maintenanceSecret}` })).status, 200);
    assert.equal(checked(await client.from('intake_submissions').select('id').eq('id', drafts[0].id).maybeSingle()), null);
    assert(checked(await client.from('intake_submissions').select('id').eq('id', drafts[1].id).maybeSingle()));
    assert.equal(checked(await client.from('intake_submissions').select('id').in('id', batch.map(row => row.id))).length, 55);
    console.log('PASS real authenticated expired-draft cleanup preserves fresh drafts and all received fixture records');
    const base = { name: 'Release Fixture', email: 'release-fixture@example.test', adult: true, rights: true, permission: true };
    const cases = [
      { kind: 'story', payload: { ...base, goal: 'Provider verification', story: 'Disposable release fixture', termsVersion: 'WYG-2026-10-04-live-1' }, files: [] },
      { kind: 'video', payload: { ...base, category: 'Goals', role: 'Player', player: 'Fixture', camera: 'Fixture camera', termsVersion: 'SYG-2026-10-04-live-1' }, files: [{ name: 'fixture.mp4', purpose: 'main', bytes: Buffer.from([0, 0, 0, 16, 102, 116, 121, 112, 105, 115, 111, 109, 0, 0, 0, 0]) }] },
      { kind: 'kit', payload: { ...base, design: 'original', color: 'Black', quantity: 10, number: 99, numberStyle: 'goool', backName: 'FIXTURE' }, files: [{ name: 'fixture.svg', purpose: 'crest', bytes: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M0 0h20v20H0z"/></svg>') }] }
    ];
    for (const item of cases) {
      const start = await request('/api/intake/start', { kind: item.kind, payload: item.payload, files: item.files.map(file => ({ name: file.name, purpose: file.purpose, size: file.bytes.length })) });
      assert.equal(start.status, 201, `${item.kind} start`);
      const session = await start.json(); fixtures.push(session);
      for (let i = 0; i < item.files.length; i++) await new Promise((resolve, reject) => {
        new Upload(item.files[i].bytes, { endpoint: session.uploadEndpoint, headers: { 'x-signature': session.files[i].signature, apikey: session.uploadApiKey }, chunkSize: 6 * 1024 * 1024, retryDelays: [0, 1000], storeFingerprintForResuming: false, metadata: { bucketName: bucket, objectName: session.files[i].objectKey, contentType: session.files[i].mime, cacheControl: '0' }, onSuccess: resolve, onError: () => reject(new Error('Route fixture upload failed')) }).start();
      });
      const token = { 'X-Upload-Token': session.token };
      for (const file of session.files) {
        const signed = checked(await client.storage.from(bucket).createSignedUrl(file.objectKey, 60));
        const head = await fetch(signed.signedUrl, { method: 'HEAD' });
        console.log(`Fixture ${item.kind} served MIME: ${head.headers.get('content-type')}; size: ${head.headers.get('content-length')}`);
      }
      assert.equal((await request(`/api/intake/${session.id}/finish`, undefined, '', 'POST', { 'X-Upload-Token': 'wrong' })).status, 403);
      const finish = await request(`/api/intake/${session.id}/finish`, undefined, '', 'POST', token); assert.equal(finish.status, 200);
      const receipt = await finish.json();
      assert.deepEqual(await (await request(`/api/intake/${session.id}/finish`, undefined, '', 'POST', token)).json(), receipt);
      const detail = await request(`/api/admin/submissions/${session.id}`, undefined, cookie, 'GET'); assert.equal(detail.status, 200);
      const record = await detail.json(); assert.equal(record.payload.email, base.email);
      if (item.kind !== 'kit') assert(record.consent.termsHash);
      assert.equal((await request(`/api/admin/submissions/${session.id}`, { status: 'reviewing', notes: 'Disposable fixture review' }, cookie, 'PATCH')).status, 200);
      for (const file of record.files) assert.equal((await request(`/api/admin/files/${file.id}`, undefined, cookie, 'GET')).status, 302);
      assert.equal((await request(`/api/admin/submissions/${session.id}`, undefined, cookie, 'DELETE')).status, 200);
      assert.equal((await request(`/api/admin/submissions/${session.id}`, undefined, cookie, 'GET')).status, 404);
      console.log(`PASS real ${item.kind} start/upload/receipt/retry, owner detail/review/media/delete`);
    }
    const refresh = await request('/api/admin/auth', { action: 'refresh' }, cookie); assert.equal(refresh.status, 200); cookie = cookieFrom(refresh);
    assert.equal((await request('/api/admin/auth', { action: 'signout' }, cookie)).status, 200);
    console.log('PASS real session refresh and sign-out');
  } finally {
    if (child) { child.kill(); await new Promise(resolve => child.exitCode !== null ? resolve() : child.once('exit', resolve)); }
    for (const fixture of fixtures) {
      if (fixture.files.length) checked(await client.storage.from(bucket).remove(fixture.files.map(file => file.objectKey)));
      checked(await client.from('intake_submissions').delete().eq('id', fixture.id));
    }
    for (const user of users) checked(await client.auth.admin.deleteUser(user.id));
    for (const scope of ['intake', 'owner-login']) {
      const key = createHmac('sha256', rateSecret).update(`${scope}:local:${Math.floor(Date.now() / 3600000)}`).digest('hex');
      checked(await client.from('intake_rate_limits').delete().eq('key', key));
    }
    console.log('PASS disposable provider-route fixtures and test accounts removed');
  }
}
main().catch(error => {
  if (error.code === 'ERR_ASSERTION' && typeof error.actual === 'number' && typeof error.expected === 'number') console.error(`HTTP/assertion actual ${error.actual}; expected ${error.expected}`);
  console.error(`FAIL provider route verification: ${error.code || 'assertion/provider error'}; credentials withheld`); process.exitCode = 1;
});
