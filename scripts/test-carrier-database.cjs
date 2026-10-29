// Disposable, in-memory PostgreSQL only. This script never connects to Supabase or a provider.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { PGlite } = require('@electric-sql/pglite');

const root = path.resolve(__dirname, '..');
const migration = fs.readFileSync(path.join(root, 'supabase/migrations/20261029215205_carrier_tracking.sql'), 'utf8');
const db = new PGlite();
const orderA = '10000000-0000-4000-8000-000000000001';
const orderB = '10000000-0000-4000-8000-000000000002';
const leaseA = '20000000-0000-4000-8000-000000000001';
const leaseB = '20000000-0000-4000-8000-000000000002';
let passed = 0;
async function check(name, run) { await run(); passed++; console.log('PASS ' + name); }
async function scalar(sql, args = []) { const result = await db.query(sql, args); return Object.values(result.rows[0])[0]; }
async function reset() {
  await db.exec('reset role; truncate public.carrier_tracking_events, public.carrier_tracking_inbox, public.carrier_tracking_packages; set role service_role');
}
async function addPackage(number = 'TRACK001') {
  return scalar("insert into public.carrier_tracking_packages(order_id,carrier,tracking_number,environment,registration_not_before) values($1,'USPS',$2,'production','2026-10-29T00:00:00Z') returning id", [orderA, number]);
}
function snapshot(id = 'trk_synthetic1', version = '2026-10-29T15:00:00Z', status = 'in_transit', number = 'TRACK001', events = []) {
  return { trackerId: id, mode: 'production', trackingNumber: number, carrier: 'USPS', status, detail: null,
    events, estimatedDelivery: null, updatedAt: version, createdAt: '2026-10-29T12:00:00Z' };
}
const scan = (id, status = 'in_transit') => ({ id, status, detail: null, message: null, occurredAt: '2026-10-29T14:00:00-04:00', location: null });
async function claim(token = leaseA, limit = 2) {
  return (await db.query('select * from public.carrier_tracking_claim($1::uuid,$2)', [token, limit])).rows;
}
async function finish(id, token, data) {
  return scalar('select public.carrier_tracking_finish($1::uuid,$2::uuid,$3::jsonb)', [id, token, JSON.stringify(data)]);
}
async function receive(eventId, data, environment = 'production') {
  return scalar('select public.carrier_tracking_receive($1,$2,$3::jsonb)', [eventId, environment, JSON.stringify(data)]);
}
async function rejected(sql, args = [], pattern) {
  await assert.rejects(() => db.query(sql, args), pattern);
}

(async () => {
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create table public.orders(id uuid primary key,status text not null,livemode boolean not null,created_at timestamptz not null default now()-interval '1 day');
      create table public.order_shipments(id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id),
        tracking_company text,tracking_numbers jsonb,status text,received_at timestamptz not null default now());
      grant select on public.orders,public.order_shipments to service_role;`);
    await check('New migration parses and applies against real PostgreSQL semantics', async () => {
      await db.exec(migration);
      assert.equal(await scalar("select count(*)::integer from pg_tables where schemaname='public' and tablename like 'carrier_tracking_%'"), 4);
    });
    await db.query('insert into public.orders(id,status,livemode) values($1,$2,true),($3,$2,true)', [orderA, 'paid', orderB]);
    await check('Discovery deduplicates split, repeated, reordered and changing-status shipment rows', async () => {
      for (const [carrier, status, numbers] of [
        ['USPS', 'success', ['TRACK001', 'TRACK002', 'TRACK001', null, 123]],
        [' United States Postal Service ', 'shipped', [' track002 ', ' track001 ']],
        ['USPS', 'delivered', ['TRACK001']], ['UPS', 'shipped', ['UPS001']],
      ]) await db.query('insert into public.order_shipments(order_id,tracking_company,status,tracking_numbers) values($1,$2,$3,$4::jsonb)', [orderA, carrier, status, JSON.stringify(numbers)]);
      await db.query("insert into public.order_shipments(order_id,tracking_company,status,tracking_numbers) values($1,'USPS','success','[\"TRACK001\"]')", [orderB]);
      await db.exec('set role service_role');
      assert.equal(await scalar('select public.carrier_tracking_discover()'), 4);
      assert.equal(await scalar('select public.carrier_tracking_discover()'), 0);
      assert.equal(await scalar('select count(*)::integer from public.carrier_tracking_packages'), 4);
      assert.equal(await scalar('select count(*)::integer from public.carrier_tracking_packages p join public.orders o on o.id=p.order_id where p.registration_not_before=o.created_at'), 4);
      assert.equal(await scalar('select count(*)::integer from public.order_shipments'), 5);
    });
    await check('Discovery is bounded to recent live paid shipments and known carriers/numbers', async () => {
      await db.exec('reset role');
      const scoped = [
        ['30000000-0000-4000-8000-000000000001', 'pending', true],
        ['30000000-0000-4000-8000-000000000002', 'refunded', true],
        ['30000000-0000-4000-8000-000000000003', 'cancelled', true],
        ['30000000-0000-4000-8000-000000000004', 'paid', false],
      ];
      for (const [id, status, live] of scoped) {
        await db.query('insert into public.orders(id,status,livemode) values($1,$2,$3)', [id, status, live]);
        await db.query("insert into public.order_shipments(order_id,tracking_company,status,tracking_numbers) values($1,'USPS','shipped','[\"EXCLUDED001\"]')", [id]);
      }
      await db.query("insert into public.orders(id,status,livemode,created_at) values('30000000-0000-4000-8000-000000000005','paid',true,now()-interval '91 days')");
      await db.query("insert into public.order_shipments(order_id,tracking_company,status,tracking_numbers) values('30000000-0000-4000-8000-000000000005','USPS','delivered','[\"LATEOLDORDER\"]')");
      for (const [carrier, numbers, status, age] of [
        ['Unknown Carrier', ['EXCLUDED002'], 'shipped', 0], ['USPS', ['X', {}, null, '<script>', 'NUMBER/URL'], 'shipped', 0],
        ['USPS', ['EXCLUDED003'], 'failed', 0], ['USPS', ['EXCLUDED004'], 'success', 31], ['USPS', {}, 'success', 0],
      ]) await db.query("insert into public.order_shipments(order_id,tracking_company,status,tracking_numbers,received_at) values($1,$2,$3,$4::jsonb,now()-($5::integer*interval '1 day'))", [orderA, carrier, status, JSON.stringify(numbers), age]);
      await db.exec('set role service_role');
      assert.equal(await scalar('select public.carrier_tracking_discover()'), 0);
      await rejected('select public.carrier_tracking_discover(101,30)', [], /Invalid discovery bounds/);
      await rejected('select public.carrier_tracking_discover(100,31)', [], /Invalid discovery bounds/);
      await rejected('select public.carrier_tracking_discover(null,30)', [], /Invalid discovery bounds/);
      await rejected('select public.carrier_tracking_discover(100,null)', [], /Invalid discovery bounds/);
      await db.exec('reset role');
      await db.query("insert into public.order_shipments(order_id,tracking_company,status,tracking_numbers) values($1,'USPS','success','[\"TRACK003\",\"TRACK004\"]')", [orderB]);
      await db.exec('set role service_role');
      assert.equal(await scalar('select public.carrier_tracking_discover(1,30)'), 1);
      assert.equal(await scalar('select public.carrier_tracking_discover(1,30)'), 1);
      assert.equal(await scalar('select public.carrier_tracking_discover(1,30)'), 0);
    });
    await check('Leases are exclusive, expired leases reclaim and stale workers lose ownership', async () => {
      await reset(); const id = await addPackage();
      const first = await claim(leaseA); assert.equal(first.length, 1); assert.equal(first[0].id, id);
      assert.equal((await claim(leaseB)).length, 0);
      assert.equal(await scalar('select public.carrier_tracking_start($1,$2)', [id, leaseA]), true);
      await db.query("update public.carrier_tracking_packages set lease_until=now()-interval '1 second' where id=$1", [id]);
      const second = await claim(leaseB); assert.equal(second.length, 1); assert.equal(second[0].attempts, 2);
      await assert.rejects(() => finish(id, leaseA, snapshot()), /Lease lost/);
      await assert.rejects(() => db.query('select public.carrier_tracking_start($1,$2)', [id, leaseA]), /Lease lost/);
      assert.equal(await scalar('select public.carrier_tracking_fail($1,$2,false,$3)', [id, leaseA, 'private error']), false);
      assert.equal(await finish(id, leaseB, snapshot()), true);
      const row = (await db.query('select state,lease_token,attempts from public.carrier_tracking_packages where id=$1', [id])).rows[0];
      assert.equal(row.state, 'ready'); assert.equal(row.lease_token, null); assert.equal(row.attempts, 0);
    });
    await check('Null or missing leases cannot register packages or claim work', async () => {
      await reset(); const id = await addPackage();
      await assert.rejects(() => finish(id, null, snapshot()), /Lease/);
      await rejected('select * from public.carrier_tracking_claim(null,1)', [], /Invalid claim bounds/);
      await rejected('select * from public.carrier_tracking_claim($1,null)', [leaseA], /Invalid claim bounds/);
      assert.equal(await scalar('select tracker_id from public.carrier_tracking_packages where id=$1', [id]), null);
    });
    await check('Early webhooks persist durably and reconcile atomically when tracker mapping finishes', async () => {
      await reset(); const id = await addPackage(); await claim();
      const early = snapshot('trk_synthetic1', '2026-10-29T16:00:00Z', 'out_for_delivery', 'TRACK001', [scan('scanA'), scan('scanB', 'out_for_delivery')]);
      assert.equal(await receive('evt_early1', early), false);
      assert.equal(await receive('evt_early1', early), false);
      assert.equal(await scalar('select count(*)::integer from public.carrier_tracking_inbox'), 1);
      assert.equal(await scalar('select processed_at from public.carrier_tracking_inbox'), null);
      assert.equal(await finish(id, leaseA, snapshot('trk_synthetic1', '2026-10-29T15:00:00Z', 'in_transit', 'TRACK001', [scan('scanA')])), true);
      assert.equal(await scalar('select snapshot->>\'status\' from public.carrier_tracking_packages where id=$1', [id]), 'out_for_delivery');
      assert.ok(await scalar('select processed_at from public.carrier_tracking_inbox'));
      assert.equal(await scalar('select count(*)::integer from public.carrier_tracking_events'), 2);
      assert.equal(await receive('evt_early1', early), true);
      assert.equal(await scalar('select count(*)::integer from public.carrier_tracking_events'), 2);
    });
    await check('Recycled trackers and pre-order history cannot attach through worker finish or webhook updates', async () => {
      const id = await addPackage('RECYCLED001');
      await claim(leaseB);
      const old = { ...snapshot('trk_recycled', '2026-10-29T20:00:00Z', 'delivered', 'RECYCLED001'), createdAt: '2026-10-28T12:00:00Z' };
      await assert.rejects(() => finish(id, leaseB, old), /Tracker outside order window/);
      assert.equal(await scalar('select tracker_id from public.carrier_tracking_packages where id=$1', [id]), null);
      const historical = { ...old, createdAt: '2026-10-29T12:00:00Z', events: [{ ...scan('oldHistory'), occurredAt: '2026-10-28T12:00:00Z' }] };
      await assert.rejects(() => finish(id, leaseB, historical), /Carrier history predates order/);
      await assert.rejects(() => finish(id, leaseB, { ...old, createdAt: '2099-10-29T12:00:00Z' }), /Tracker outside order window/);
      await assert.rejects(() => finish(id, leaseB, { ...old, createdAt: null }), /Tracker creation time unavailable/);
      assert.equal(await finish(id, leaseB, { ...old, status: 'in_transit', createdAt: '2026-10-29T12:00:00Z' }), true);
      await assert.rejects(() => receive('evt_recycledOld', old), /Tracker outside order window/);
      await assert.rejects(() => receive('evt_recycledHistory', historical), /Carrier history predates order/);
      assert.equal(await scalar('select snapshot->>\'status\' from public.carrier_tracking_packages where id=$1', [id]), 'in_transit');
      assert.equal(await scalar("select count(*)::integer from public.carrier_tracking_inbox where event_id like 'evt_recycled%'"), 0);
      // Missing offsets remain unknown, rather than assigning a timezone to force an ordering claim.
      assert.equal(await receive('evt_recycledNaive', { ...old, status: 'in_transit', createdAt: '2026-10-29T12:00:00Z',
        events: [{ ...scan('naiveHistory'), occurredAt: '2026-10-28T12:00:00' }] }), true);
      await db.query('delete from public.carrier_tracking_inbox where tracker_id=$1', ['trk_recycled']);
      await db.query('delete from public.carrier_tracking_events where package_id=$1', [id]);
      await db.query('delete from public.carrier_tracking_packages where id=$1', [id]);
    });
    await check('Out-of-order snapshots preserve newest state while retaining distinct older scan events', async () => {
      const newer = snapshot('trk_synthetic1', '2026-10-29T17:00:00Z', 'delivered', 'TRACK001', [scan('scanA'), scan('scanC', 'delivered')]);
      assert.equal(await receive('evt_newer1', newer), true);
      assert.equal(await receive('evt_older1', snapshot('trk_synthetic1', '2026-10-29T14:00:00Z', 'pre_transit', 'TRACK001', [scan('scanOld', 'pre_transit')])), true);
      assert.equal(await scalar("select snapshot->>'status' from public.carrier_tracking_packages"), 'delivered');
      assert.equal(await scalar('select count(*)::integer from public.carrier_tracking_events'), 4);
      assert.equal(await receive('evt_newer2', newer), true);
      assert.equal(await scalar('select count(*)::integer from public.carrier_tracking_events'), 4);
      assert.equal(await receive('evt_correction1', snapshot('trk_synthetic1', '2026-10-29T18:00:00Z', 'in_transit')), true);
      assert.equal(await scalar("select snapshot->>'status' from public.carrier_tracking_packages"), 'in_transit');
    });
    await check('Cross-environment and wrong-owner snapshots cannot overwrite a mapped package', async () => {
      await assert.rejects(() => receive('evt_testmode', { ...snapshot(), mode: 'test' }, 'test'), /Invalid tracking event/);
      await assert.rejects(() => receive('evt_badowner', { ...snapshot(), trackingNumber: 'DIFFERENT001' }), /Tracker ownership mismatch/);
      assert.equal(await scalar("select count(*)::integer from public.carrier_tracking_inbox where event_id='evt_badowner'"), 0);
      assert.equal(await scalar("select snapshot->>'status' from public.carrier_tracking_packages"), 'in_transit');
    });
    await check('Persistence failure rolls back snapshots, scan rows and webhook completion together', async () => {
      const before = await scalar('select count(*)::integer from public.carrier_tracking_events');
      const broken = snapshot('trk_synthetic1', '2026-10-29T19:00:00Z', 'delivered', 'TRACK001', [scan('wouldWrite'), { status: 'delivered' }]);
      await assert.rejects(() => receive('evt_dbfailure', broken), /null value|not-null/);
      assert.equal(await scalar('select count(*)::integer from public.carrier_tracking_events'), before);
      assert.equal(await scalar("select count(*)::integer from public.carrier_tracking_inbox where event_id='evt_dbfailure'"), 0);
      assert.equal(await scalar("select snapshot->>'status' from public.carrier_tracking_packages"), 'in_transit');
      assert.equal(await receive('evt_dbfailure', snapshot('trk_synthetic1', '2026-10-29T19:00:00Z', 'delivered', 'TRACK001', [scan('wouldWrite')])), true);
    });
    await check('Unknown trackers remain in the inbox without creating any order or package', async () => {
      const orders = await scalar('select count(*)::integer from public.orders');
      const packages = await scalar('select count(*)::integer from public.carrier_tracking_packages');
      assert.equal(await receive('evt_unknown', snapshot('trk_unknown')), false);
      assert.equal(await scalar('select count(*)::integer from public.orders'), orders);
      assert.equal(await scalar('select count(*)::integer from public.carrier_tracking_packages'), packages);
      assert.equal(await scalar("select processed_at from public.carrier_tracking_inbox where event_id='evt_unknown'"), null);
    });
    await check('Periodic inbox reconciliation closes the concurrent mapping window', async () => {
      const id = await addPackage('RACE001');
      const data = snapshot('trk_race', '2026-10-29T20:00:00Z', 'out_for_delivery', 'RACE001', [scan('raceScan')]);
      assert.equal(await receive('evt_race', data), false);
      // Model mapping committing just after receive's initial mapping lookup.
      await db.query("update public.carrier_tracking_packages set tracker_id='trk_race' where id=$1", [id]);
      assert.equal(await scalar('select public.carrier_tracking_reconcile_inbox()'), 1);
      assert.ok(await scalar("select processed_at from public.carrier_tracking_inbox where event_id='evt_race'"));
      assert.equal(await scalar("select snapshot->>'status' from public.carrier_tracking_packages where id=$1", [id]), 'out_for_delivery');
      assert.equal(await scalar('select public.carrier_tracking_reconcile_inbox()'), 0);
    });
    await check('Failed registration backs off, redacts errors and review state leaves the queue', async () => {
      await reset(); const id = await addPackage(); await claim();
      assert.equal(await scalar('select public.carrier_tracking_fail($1,$2,false,$3)', [id, leaseA, 'PRIVATE provider error']), true);
      let row = (await db.query('select * from public.carrier_tracking_packages where id=$1', [id])).rows[0];
      assert.equal(row.state, 'retry'); assert.equal(row.last_error, 'registration_or_sync_unavailable');
      assert.ok(new Date(row.next_attempt_at).getTime() > Date.now() + 10 * 60_000);
      assert.equal((await claim()).length, 0);
      await db.query('update public.carrier_tracking_packages set next_attempt_at=now() where id=$1', [id]);
      await claim();
      await scalar('select public.carrier_tracking_fail($1,$2,true,$3)', [id, leaseA, 'provider_rejected']);
      await db.query('update public.carrier_tracking_packages set next_attempt_at=now() where id=$1', [id]);
      assert.equal((await claim()).length, 0);
      row = (await db.query('select * from public.carrier_tracking_packages where id=$1', [id])).rows[0];
      assert.equal(row.last_error, 'provider_rejected');
    });
    await check('Private rate buckets count attempts and expire without customer email storage', async () => {
      const key = 'a'.repeat(64);
      assert.equal(await scalar('select public.carrier_tracking_rate($1)', [key]), 1);
      assert.equal(await scalar('select public.carrier_tracking_rate($1)', [key]), 2);
      await db.query("update public.carrier_tracking_limits set expires_at=now()-interval '1 second'");
      assert.equal(await scalar('select public.carrier_tracking_rate($1)', [key]), 1);
      await rejected('select public.carrier_tracking_rate($1)', ['email@example.invalid'], /Invalid bucket/);
    });
    await check('RLS is enabled and anon/authenticated have neither table nor function privileges', async () => {
      await db.exec('reset role');
      assert.equal(await scalar("select count(*)::integer from pg_class c join pg_namespace n on c.relnamespace=n.oid where n.nspname='public' and c.relname like 'carrier_tracking_%' and c.relkind='r' and c.relrowsecurity"), 4);
      const functions = (await db.query("select oid::regprocedure::text as name from pg_proc where pronamespace='public'::regnamespace and proname like 'carrier_tracking_%'")).rows;
      for (const role of ['anon', 'authenticated']) {
        for (const table of ['packages', 'events', 'inbox', 'limits']) {
          assert.equal(await scalar('select has_table_privilege($1,$2,$3)', [role, 'public.carrier_tracking_' + table, 'SELECT']), false);
          assert.equal(await scalar('select has_table_privilege($1,$2,$3)', [role, 'public.carrier_tracking_' + table, 'INSERT,UPDATE,DELETE']), false);
        }
        for (const fn of functions) assert.equal(await scalar('select has_function_privilege($1,$2,$3)', [role, fn.name, 'EXECUTE']), false);
        await db.exec('set role ' + role);
        await rejected('select * from public.carrier_tracking_packages', [], /permission denied/);
        await rejected('select public.carrier_tracking_health()', [], /permission denied/);
        await db.exec('reset role');
      }
      for (const fn of functions) assert.equal(await scalar('select has_function_privilege($1,$2,$3)', ['service_role', fn.name, 'EXECUTE']), true);
    });
    console.log(`${passed} carrier database checks passed.`);
  } finally { await db.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
