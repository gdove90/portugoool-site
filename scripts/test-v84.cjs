const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { createHash, randomUUID } = require('node:crypto');
const { pathToFileURL } = require('node:url');
const { PGlite } = require('@electric-sql/pglite');
const ts = require('typescript');
const vm = require('node:vm');

let passed = 0;
async function check(name, run) { await run(); passed++; console.log(`PASS ${name}`); }
const rejects = fn => assert.throws(fn, e => e.status === 400);
const story = () => ({ kind: 'story', payload: { name: 'Local test', email: 'fixture@example.test', goal: 'Train every week', story: 'A disposable local validation fixture.', adult: true, rights: true, permission: true, termsVersion: 'WYG-2026-10-04-live-1' } });
const kit = () => ({ kind: 'kit', payload: { name: 'Local test', email: 'fixture@example.test', design: 'original', color: 'Black', quantity: 10, number: 10, numberStyle: 'goool', rights: true } });
const video = () => ({ kind: 'video', payload: { name: 'Local test', email: 'fixture@example.test', category: 'Goals', role: 'Player', player: 'Fixture player', camera: 'Fixture camera', adult: true, rights: true, permission: true, termsVersion: 'SYG-2026-10-04-live-1' } });

async function main() {
  const catalogExports = {};
  const approvedMenIds = [
    '70000000-0000-4000-8000-000000000001', '70000000-0000-4000-8000-000000000002',
    '70000000-0000-4000-8000-000000000006', '70000000-0000-4000-8000-000000000003',
    '70000000-0000-4000-8000-000000000005', '70000000-0000-4000-8000-000000000004',
    '80000000-0000-4000-8000-000000000006', '80000000-0000-4000-8000-000000000007',
    '80000000-0000-4000-8000-000000000008',
  ];
  const catalogCode = ts.transpileModule(fs.readFileSync('src/v84/catalog-data.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(catalogCode, { exports: catalogExports, require: name => {
    assert.equal(name, '@/lib/products');
    return { getProducts: () => [...approvedMenIds, 'unapproved-product'].map(id => ({ id })) };
  } });
  await check('only approved existing products appear in Men; Women remains unassigned', () => {
    assert.deepEqual(Array.from(catalogExports.forAudience('men'), p => p.id), approvedMenIds);
    assert.equal(catalogExports.forAudience('women').length, 0);
    assert.deepEqual(Array.from(catalogExports.featuredProducts(), p => p.id), [
      '70000000-0000-4000-8000-000000000002', '70000000-0000-4000-8000-000000000003',
      '80000000-0000-4000-8000-000000000006', '70000000-0000-4000-8000-000000000004',
    ]);
  });
  const numeralExports = {};
  const numeralCode = ts.transpileModule(fs.readFileSync('src/v84/number-art.js', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(numeralCode, { exports: numeralExports, Map });
  await check('original number markup supports 1..99 without font fallback', () => {
    for (let n = 1; n <= 99; n++) {
      const markup = numeralExports.originalNumberMarkup(n);
      assert.equal((markup.match(/<canvas /g) || []).length, String(n).length);
      assert.ok(markup.includes(`aria-label="${n}"`));
      assert.ok(markup.includes('height="512"'));
    }
    for (const n of [0, 100, -1, 1.5, '01', '<script>']) assert.equal(numeralExports.originalNumberMarkup(n), '');
  });
  const { cleanPayload, filesMeta, checkMagic } = await import(pathToFileURL(path.resolve('src/lib/intake/validation.mjs')));
  await check('story requires each of the three acknowledgments', () => {
    for (const field of ['adult', 'rights', 'permission']) { const data = story(); data.payload[field] = false; rejects(() => cleanPayload(data)); }
    assert.equal(cleanPayload(story()).consent.marketing, false);
  });
  await check('terms versions cannot be substituted', () => {
    for (const data of [story(), video()]) { data.payload.termsVersion = 'old'; rejects(() => cleanPayload(data)); }
  });
  await check('story text limits and email normalization', () => {
    const data = story(); data.payload.email = 'TEST@EXAMPLE.TEST';
    assert.equal(cleanPayload(data).email, 'test@example.test');
    data.payload.story = 'x'.repeat(251); rejects(() => cleanPayload(data));
  });
  await check('stories permit zero clips; matches require footage', () => {
    assert.equal(filesMeta([], cleanPayload(story())).length, 0);
    rejects(() => filesMeta([], cleanPayload(video())));
  });
  await check('video count and exact 100 MiB boundary', () => {
    const file = { name: 'fixture.mp4', size: 100 * 1024 * 1024, purpose: 'main' };
    const record = cleanPayload(video()); assert.equal(filesMeta([file], record)[0].mime, 'video/mp4');
    rejects(() => filesMeta([{ ...file, size: file.size + 1 }], record));
    assert.equal(filesMeta([file, { ...file, purpose: 'support' }, { ...file, purpose: 'support' }], record).length, 3);
    rejects(() => filesMeta([file, file, file, file], record));
  });
  await check('kit crest, custom numbers and exact 20 MiB boundary', () => {
    const file = { name: 'fixture.svg', size: 20 * 1024 * 1024, purpose: 'crest' };
    const data = kit(); assert.equal(filesMeta([file], cleanPayload(data)).length, 1);
    rejects(() => filesMeta([{ ...file, size: file.size + 1 }], cleanPayload(data)));
    data.payload.numberStyle = 'custom'; rejects(() => filesMeta([file], cleanPayload(data)));
    assert.equal(filesMeta([file, { ...file, purpose: 'numbers' }], cleanPayload(data)).length, 2);
    rejects(() => filesMeta([file, file], cleanPayload(data)));
  });
  await check('independent kit removal settings survive normalization', () => {
    const data = kit(); data.payload.removeChestLogo = true; data.payload.removeFrontSponsor = false;
    const record = cleanPayload(data); assert.equal(record.payload.removeChestLogo, true); assert.equal(record.payload.removeFrontSponsor, false);
    for (const number of [0, 100, 1.5]) { data.payload.number = number; rejects(() => cleanPayload(data)); }
  });
  await check('only opted-in handles persist; friend needs permission', () => {
    const data = video(); data.payload.tags = { submitter: { selected: false, handle: 'discard_me' }, player: { selected: true, handle: 'discard_me' } };
    const record = cleanPayload(data); assert.equal(record.payload.tags.submitter.handle, ''); assert.equal(record.payload.tags.player.selected, false);
    data.payload.friend = true; rejects(() => cleanPayload(data));
    data.payload.friendPermission = true; assert.equal(cleanPayload(data).consent.friendPermission, true);
  });
  await check('extensions alone cannot pass signature validation', () => {
    assert.equal(checkMagic(Buffer.from('not an image'), 'image/png'), false);
    assert.equal(checkMagic(Buffer.from('%PDF-1.7'), 'application/pdf'), true);
    assert.equal(checkMagic(Buffer.from('0000ftypisom'), 'video/mp4'), true);
  });

  const exports = {};
  const module = { exports };
  const serverCode = ts.transpileModule(fs.readFileSync('src/lib/intake/server.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  vm.runInNewContext(serverCode + '\nexports.readBoundedForTest = readBounded;', { exports, module, Buffer, URL, Request, Response, process: { env: {} }, require: id => {
    if (id === 'server-only') return {};
    if (id === './validation.mjs') return { cleanPayload, filesMeta, checkMagic };
    if (id === './agreements.json') return require('../src/lib/intake/agreements.json');
    return require(id);
  } });
  await check('bounded provider reads return without waiting on an unread Next fetch clone', async () => {
    let cancelled = false, released = false, timer;
    const result = { body: { getReader: () => ({ read: async () => ({ done: false, value: Buffer.alloc(32) }), cancel: () => { cancelled = true; return new Promise(() => {}); }, releaseLock: () => { released = true; } }) } };
    try {
      const bytes = await Promise.race([exports.readBoundedForTest(result, 16), new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Provider read hung')), 1000); })]);
      assert.equal(bytes.length, 16); assert(cancelled && released);
    } finally { clearTimeout(timer); }
  });
  await check('SVG sanitizer rejects active and external content', () => {
    const svg = inner => `<svg xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
    assert.equal(exports.safeSvg(svg('<path d="M0 0h10v10z"/>')), true);
    for (const inner of ['<script>alert(1)</script>', '<image href="https://example.test/a"/>', '<path onload="alert(1)"/>', '<foreignObject/>', '<style>path{fill:red}</style>']) assert.equal(exports.safeSvg(svg(inner)), false);
    assert.equal(exports.safeSvg('<!DOCTYPE svg [<!ENTITY x SYSTEM "file:///secret">]>' + svg('&x;')), false);
  });
  await check('disabled intake cannot create a success receipt', async () => {
    const request = new Request('http://localhost/api/intake/start', { method: 'POST', headers: { Origin: 'http://localhost' }, body: JSON.stringify({ ...story(), files: [] }) });
    await assert.rejects(() => exports.startIntake(request), e => e.status === 503);
  });
  await check('write origin and malformed JSON are rejected', async () => {
    assert.throws(() => exports.sameOrigin(new Request('https://store.test/api/intake/start', { headers: { Origin: 'https://other.test' } })), e => e.status === 403);
    for (const body of ['null', '[]', '{invalid']) await assert.rejects(() => exports.bodyJSON(new Request('http://localhost', { method: 'POST', body })), e => e.status === 400);
  });
  await check('private responses are not cacheable', () => assert.equal(exports.response({}).headers.get('cache-control'), 'private, no-store'));

  const db = new PGlite();
  try {
    await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
    await db.exec(fs.readFileSync('docs/v84/intake-schema-proposal.sql', 'utf8'));
    await check('all private tables have RLS enabled', async () => {
      const result = await db.query("select relname,relrowsecurity from pg_class where relname in ('intake_submissions','intake_files','intake_rate_limits')");
      assert.equal(result.rows.length, 3); assert.ok(result.rows.every(r => r.relrowsecurity));
    });
    await check('anonymous and ordinary authenticated roles have no intake privileges', async () => {
      for (const role of ['anon', 'authenticated']) {
        for (const table of ['intake_submissions', 'intake_files', 'intake_rate_limits']) {
          const { rows } = await db.query('select has_table_privilege($1,$2,$3) as allowed', [role, `public.${table}`, 'SELECT,INSERT,UPDATE,DELETE']); assert.equal(rows[0].allowed, false);
        }
        const { rows } = await db.query("select has_function_privilege($1,'public.intake_finish(uuid,text)','EXECUTE') as allowed", [role]); assert.equal(rows[0].allowed, false);
      }
    });
    await db.exec('set role service_role');
    const id = randomUUID(), token = 'fixture-hash', fileId = randomUUID();
    const record = { ...cleanPayload(story()), id, upload_token_hash: token, upload_expires_at: new Date(Date.now() + 86400000).toISOString() };
    const file = { id: fileId, name: 'fixture.mp4', mime: 'video/mp4', size: 100, objectKey: `intake/${id}/${fileId}`, purpose: 'main' };
    await check('begin atomically creates draft and file metadata', async () => {
      await db.query('select public.intake_begin($1,$2)', [JSON.stringify(record), JSON.stringify([file])]);
      assert.equal((await db.query('select state from public.intake_submissions where id=$1', [id])).rows[0].state, 'draft');
      assert.equal((await db.query('select count(*)::int as count from public.intake_files where submission_id=$1', [id])).rows[0].count, 1);
      assert.equal((await db.query('select * from public.intake_counts()')).rows.length, 0);
    });
    await check('failed file insert leaves no orphan submission', async () => {
      const badId = randomUUID();
      await assert.rejects(() => db.query('select public.intake_begin($1,$2)', [JSON.stringify({ ...record, id: badId }), JSON.stringify([{ ...file, id: randomUUID(), size: -1 }])]));
      assert.equal((await db.query('select count(*)::int as count from public.intake_submissions where id=$1', [badId])).rows[0].count, 0);
    });
    await check('finish rejects wrong token and is idempotent for the right token', async () => {
      assert.equal((await db.query('select public.intake_finish($1,$2) as receipt', [id, 'wrong'])).rows[0].receipt, null);
      const first = (await db.query('select public.intake_finish($1,$2) as receipt', [id, token])).rows[0].receipt;
      const again = (await db.query('select public.intake_finish($1,$2) as receipt', [id, token])).rows[0].receipt;
      assert.equal(first.id, id); assert.deepEqual(first, again);
      assert.equal((await db.query('select state from public.intake_files where id=$1', [fileId])).rows[0].state, 'ready');
      assert.equal(Number((await db.query('select * from public.intake_counts()')).rows[0].count), 1);
    });
    await check('deletion prevents resurrection and removes personal fields', async () => {
      await db.query('select public.intake_mark_deleting($1)', [id]);
      assert.equal((await db.query('select public.intake_finish($1,$2) as receipt', [id, token])).rows[0].receipt, null);
      const row = (await db.query('select name,email,payload,consent from public.intake_submissions where id=$1', [id])).rows[0];
      assert.equal(row.name, ''); assert.equal(row.email, ''); assert.deepEqual(row.payload, {}); assert.deepEqual(row.consent, {});
      assert.equal((await db.query('select * from public.intake_counts()')).rows.length, 0);
    });
    await check('expired drafts cannot finish', async () => {
      const expired = randomUUID(); await db.query('select public.intake_begin($1,$2)', [JSON.stringify({ ...record, id: expired, upload_expires_at: '2020-01-01T00:00:00Z' }), '[]']);
      assert.equal((await db.query('select public.intake_finish($1,$2) as receipt', [expired, token])).rows[0].receipt, null);
    });
    await check('rate limit counts are atomic increments', async () => {
      assert.equal((await db.query("select public.intake_rate('fixture') as count")).rows[0].count, 1);
      assert.equal((await db.query("select public.intake_rate('fixture') as count")).rows[0].count, 2);
    });
    await check('legacy sold counter is callable only by the internal service role with a fixed search path', async () => {
      await db.exec('reset role');
      await db.exec('create function public.increment_drop_sold(uuid,integer) returns void language plpgsql security definer as $$ begin return; end $$;');
      await db.exec(fs.readFileSync('supabase/migrations/20261007034613_restrict_legacy_sold_counter.sql', 'utf8'));
      const row = (await db.query("select has_function_privilege('anon','public.increment_drop_sold(uuid,integer)','execute') as anon, has_function_privilege('authenticated','public.increment_drop_sold(uuid,integer)','execute') as authenticated, has_function_privilege('service_role','public.increment_drop_sold(uuid,integer)','execute') as service")).rows[0];
      assert.deepEqual(row, { anon: false, authenticated: false, service: true });
      assert.deepEqual((await db.query("select proconfig from pg_proc where oid = 'public.increment_drop_sold(uuid,integer)'::regprocedure")).rows[0].proconfig, ['search_path=""']);
    });
  } finally { await db.close(); }

  await check('catalog, cart, checkout, payment, fulfillment and email baseline files are unchanged', () => {
    const files = execFileSync('git', ['ls-tree', '-r', '--name-only', '11b1a2f', 'src/lib', 'src/data', 'src/app/api', 'netlify', 'supabase', 'src/app/cart', 'src/app/success', 'src/app/track-order'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
    for (const file of files) {
      const baseline = execFileSync('git', ['show', `11b1a2f:${file}`]);
      const current = fs.readFileSync(file);
      assert.equal(current.toString().replace(/\r\n/g, '\n'), baseline.toString().replace(/\r\n/g, '\n'), file);
    }
    console.log(`  Compared ${files.length} protected baseline files.`);
  });
  await check('all approved visual assets are byte-identical', () => {
    const source = path.resolve('../output/v84-discovery-2026-10-05/reference-audit/public/assets');
    const files = fs.readdirSync(source, { recursive: true }).filter(file => fs.statSync(path.join(source, file)).isFile());
    const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    for (const file of files) assert.equal(sha(path.join('public/v84/assets', file)), sha(path.join(source, file)), file);
    console.log(`  Compared ${files.length} assets.`);
  });
  console.log(`\n${passed} checks passed. Local SQL tests do not verify a live Supabase project or storage service.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
