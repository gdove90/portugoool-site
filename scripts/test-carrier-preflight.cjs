// Isolated PostgreSQL + mocked provider only. No credentials, live SQL or network requests.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { PGlite } = require('@electric-sql/pglite');
const root = path.resolve(__dirname,'..');
const db = new PGlite();
const orderA='10000000-0000-4000-8000-000000000001', orderB='10000000-0000-4000-8000-000000000002';
const shipmentA='30000000-0000-4000-8000-000000000001',shipmentB='30000000-0000-4000-8000-000000000002';
const lease='20000000-0000-4000-8000-000000000001', otherLease='20000000-0000-4000-8000-000000000002';
const when=offset=>new Date(Date.now()+offset).toISOString();
let passed=0;
async function check(name,run){await run();passed++;console.log('PASS '+name);}
async function scalar(sql,args=[]){return Object.values((await db.query(sql,args)).rows[0])[0];}
async function claim(shipment=shipmentA,index=0,token=lease){return (await db.query('select * from public.carrier_tracking_preflight_claim($1,$2,$3)',[shipment,index,token])).rows;}
async function receive(id,snapshot,mode='production'){return scalar('select public.carrier_tracking_preflight_receive($1,$2,$3::jsonb)',[id,mode,JSON.stringify(snapshot)]);}
function snapshot(overrides={}){return {trackerId:'trk_preflight',mode:'production',carrier:'USPS',trackingNumber:'TRACK001',status:'pre_transit',detail:'label_created',events:[],estimatedDelivery:null,createdAt:when(-60000),updatedAt:when(0),...overrides};}
async function release(id){await db.query('update public.carrier_tracking_packages set lease_token=null,lease_until=null,attempts=0 where id=$1',[id]);}
async function reset(){await db.exec('reset role;truncate public.carrier_tracking_events,public.carrier_tracking_inbox,public.carrier_tracking_packages;set role service_role');}

(async()=>{try{
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
    create table public.orders(id uuid primary key,status text not null,livemode boolean not null,created_at timestamptz not null default now()-interval '1 day');
    create table public.order_shipments(id uuid primary key,order_id uuid references public.orders(id),tracking_company text,tracking_numbers jsonb,status text,received_at timestamptz default now());
    grant select on public.orders,public.order_shipments to service_role;`);
  await db.exec(fs.readFileSync(path.join(root,'supabase/migrations/20261029215205_carrier_tracking.sql'),'utf8'));
  await db.exec(fs.readFileSync(path.join(root,'supabase/migrations/20261029235556_carrier_tracking_preflight.sql'),'utf8'));
  await db.query("insert into public.orders(id,status,livemode) values($1,'paid',true),($2,'paid',true)",[orderA,orderB]);
  await db.query("insert into public.order_shipments(id,order_id,tracking_company,tracking_numbers,status) values($1,$2,'USPS','[\"TRACK001\",\"TRACK002\"]','success'),($3,$4,'USPS','[\"TRACK003\"]','shipped')",[shipmentA,orderA,shipmentB,orderB]);
  await db.exec('set role service_role');
  await check('New preflight migration applies without changing existing commerce tables or creating public grants',async()=>{
    assert.equal(await scalar("select count(*)::integer from information_schema.columns where table_name='carrier_tracking_packages' and column_name='preflight_until'"),1);
    for(const role of ['anon','authenticated'])for(const signature of ['public.carrier_tracking_preflight_claim(uuid,integer,uuid)','public.carrier_tracking_preflight_receive(text,text,jsonb)'])
      assert.equal(await scalar('select has_function_privilege($1,$2,\'EXECUTE\')',[role,signature]),false);
    assert.equal(await scalar("select bool_and(not prosecdef) from pg_proc where proname in ('carrier_tracking_preflight_claim','carrier_tracking_preflight_receive')"),true);
  });
  await check('Targeted claims derive exactly one persisted package and cannot enroll another active target',async()=>{
    const [pkg]=await claim();assert.equal(pkg.tracking_number,'TRACK001');assert.equal(pkg.carrier,'USPS');assert.equal(pkg.order_id,orderA);
    const duration=Date.parse(pkg.preflight_until)-Date.now();assert.ok(duration>23*3600000&&duration<=24*3600000);
    assert.equal(await scalar('select count(*)::integer from public.carrier_tracking_packages'),1);
    await assert.rejects(()=>claim(shipmentB),/Another preflight/);
    await assert.rejects(()=>claim(shipmentA,1),/Another preflight/);
    await assert.rejects(()=>claim(shipmentA,0,otherLease),/busy/);
    await release(pkg.id);
    const [again]=await claim();assert.equal(again.id,pkg.id);assert.equal(again.attempts,1);
  });
  await check('Null, out-of-range and unpersisted selections cannot expand discovery',async()=>{
    for(const index of [null,-1,100,2])await assert.rejects(()=>claim(shipmentA,index),/Invalid preflight/);
    await assert.rejects(()=>claim(null),/Invalid preflight/);
    await assert.rejects(()=>claim(shipmentA,0,null),/Invalid preflight/);
    await assert.rejects(()=>claim('30000000-0000-4000-8000-000000000099'),/not eligible/);
  });
  await check('Review state and invalid persisted eligibility cannot be bypassed by preflight',async()=>{
    await reset();
    for(const mutation of ["update public.orders set status='refunded' where id=$1","update public.orders set livemode=false where id=$1","update public.orders set created_at=now()-interval '91 days' where id=$1"]){
      await db.exec('reset role');await db.query(mutation,[orderA]);await db.exec('set role service_role');
      await assert.rejects(()=>claim(),/not eligible/);
      await db.exec('reset role');await db.query("update public.orders set status='paid',livemode=true,created_at=now()-interval '1 day' where id=$1",[orderA]);await db.exec('set role service_role');
    }
    await db.exec('reset role');await db.query("update public.order_shipments set tracking_company='UPS' where id=$1",[shipmentA]);await db.exec('set role service_role');
    await assert.rejects(()=>claim(),/not eligible/);
    await db.exec('reset role');await db.query("update public.order_shipments set tracking_company='USPS' where id=$1",[shipmentA]);await db.exec('set role service_role');
    const [pkg]=await claim();await release(pkg.id);await db.query("update public.carrier_tracking_packages set state='review' where id=$1",[pkg.id]);
    await assert.rejects(()=>claim(),/operator review/);
  });
  await check('Signed early mapping data remains durable and duplicate-safe, then finish reconciles it',async()=>{
    await reset();const [pkg]=await claim();const newer=snapshot({status:'in_transit',updatedAt:when(1000)});
    assert.equal(await receive('evt_early',newer),false);assert.equal(await receive('evt_early',newer),false);
    assert.equal(await scalar('select count(*)::integer from public.carrier_tracking_inbox'),1);
    assert.equal(await scalar('select processed_at from public.carrier_tracking_inbox'),null);
    await scalar('select public.carrier_tracking_finish($1,$2,$3::jsonb)',[pkg.id,lease,JSON.stringify(snapshot({updatedAt:when(-10000)}))]);
    assert.equal(await scalar("select snapshot->>'status' from public.carrier_tracking_packages"),'in_transit');
    assert.notEqual(await scalar('select processed_at from public.carrier_tracking_inbox'),null);
    assert.equal(await receive('evt_mapped',snapshot({updatedAt:when(2000)})),true);
  });
  await check('OFF-mode callbacks reject unrelated, expired, recycled and cross-environment histories',async()=>{
    const invalid=[snapshot({trackingNumber:'TRACK003'}),snapshot({carrier:'UPS'}),snapshot({trackerId:'trk_wrong'}),snapshot({createdAt:when(-2*86400000)}),snapshot({createdAt:when(60000)}),snapshot({events:[{id:'old',occurredAt:when(-2*86400000)}]})];
    for(const item of invalid)await assert.rejects(()=>receive('evt_invalid',item),/preflight|order window|predates/i);
    await assert.rejects(()=>receive('evt_invalid',snapshot(),'test'),/Invalid preflight/);
    const before=await scalar('select count(*)::integer from public.carrier_tracking_inbox');
    await db.query("update public.carrier_tracking_packages set preflight_until=now()-interval '1 second'");
    await assert.rejects(()=>receive('evt_expired',snapshot()),/No enrolled/);
    assert.equal(await scalar('select count(*)::integer from public.carrier_tracking_inbox'),before);
  });

  // Load only the new module with provider/storage mocks and a fail-closed network stub.
  const load=Module._load, extension=require.extensions['.ts'], realFetch=global.fetch;
  require.extensions['.ts']=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,file);
  class ProviderError extends Error{constructor(code,retryable=false,ambiguousCreate=false){super(code);Object.assign(this,{code,retryable,ambiguousCreate});}}
  const providerCalls=[];let mode='none',postAttempts=0,finished=[];
  const provider={TrackingProviderError:ProviderError,validateTrackerWindow:(data,anchor)=>{if(Date.parse(data.createdAt)<Date.parse(anchor))throw new ProviderError('ambiguous');},
    findTracker:async options=>{providerCalls.push('find');assert.ok(Date.parse(options.createdBefore)-Date.parse(options.createdAfter)<=90*86400000);return mode==='reuse'?snapshot():mode==='old'?snapshot({createdAt:when(-2*86400000)}):null;},
    retrieveTracker:async()=>{providerCalls.push('get');return snapshot();},
    createTracker:async()=>{providerCalls.push('create');postAttempts++;if(mode==='timeout')throw new ProviderError('timeout',true,true);return mode==='empty'?snapshot({status:'unknown'}):snapshot();}};
  const checked=result=>{if(result.error)throw new Error('Persistence unavailable');return result.data;};
  Module._load=function(request,parent,isMain){if(parent?.filename===path.join(root,'src/lib/carrier-tracking/preflight.ts')){
    if(request==='./easypost')return provider;if(request==='./storage')return {checked,finishPackage:async(db,pkg,data)=>finished.push(data)};
  }return load.call(this,request,parent,isMain);};
  global.fetch=async()=>{throw new Error('Unexpected network request blocked');};
  try{
    const {runTrackingPreflight}=require('../src/lib/carrier-tracking/preflight.ts');
    const config={key:'fixture',webhookSecret:'fixture',opsSecret:'fixture',mode:'production'};
    const input={shipmentId:shipmentA,trackingIndex:0};let calls=[],updates=[];
    const pkg={id:'40000000-0000-4000-8000-000000000001',order_id:orderA,carrier:'USPS',tracking_number:'TRACK001',environment:'production',tracker_id:null,lease_token:lease,attempts:1,registration_started_at:null,registration_not_before:when(-86400000)};
    const mockDb={rpc:async(name,args)=>{calls.push({name,args});return {data:name==='carrier_tracking_preflight_claim'?[{...pkg}]:true,error:null};},from:table=>{assert.equal(table,'carrier_tracking_packages');const query={update:value=>{updates.push(value);return query;},eq:()=>query,then:(resolve,reject)=>Promise.resolve({data:null,error:null}).then(resolve,reject)};return query;}};
    const clean=()=>{calls=[];updates=[];providerCalls.length=0;finished=[];postAttempts=0;mode='none';pkg.tracker_id=null;pkg.registration_started_at=null;};
    await check('Default preflight performs only provider reads and releases its own lease without consuming an attempt',async()=>{
      clean();const result=await runTrackingPreflight(mockDb,config,input);assert.equal(result.outcome,'authorization_required');assert.equal(result.registrationAttempted,false);
      assert.deepEqual(providerCalls,['find']);assert.equal(postAttempts,0);assert.equal(updates[0].attempts,0);assert.ok(!calls.some(c=>/discover|^carrier_tracking_claim$/.test(c.name)));
    });
    await check('Existing provider trackers are durably reused without POST even when registration is allowed',async()=>{
      clean();mode='reuse';const result=await runTrackingPreflight(mockDb,config,{...input,allowRegistration:true});assert.equal(result.outcome,'verified');assert.equal(result.reused,true);assert.equal(result.registered,false);assert.equal(finished.length,1);assert.deepEqual(providerCalls,['find']);
      clean();pkg.tracker_id='trk_preflight';await runTrackingPreflight(mockDb,config,input);assert.deepEqual(providerCalls,['get']);
    });
    await check('Only explicit authorization permits one POST after durable registration intent',async()=>{
      clean();const result=await runTrackingPreflight(mockDb,config,{...input,allowRegistration:true});assert.equal(result.outcome,'verified');assert.equal(result.registered,true);assert.equal(result.registrationAttempted,true);assert.equal(postAttempts,1);assert.ok(calls.some(c=>c.name==='carrier_tracking_start'));assert.equal(finished.length,1);
    });
    await check('Unknown empty trackers are stored but cannot claim carrier access verification',async()=>{
      clean();mode='empty';const result=await runTrackingPreflight(mockDb,config,{...input,allowRegistration:true});assert.equal(result.outcome,'awaiting_carrier_data');assert.equal(result.registered,true);assert.equal(result.registrationAttempted,true);assert.equal(finished.length,1);
    });
    await check('A prior recycled tracker is rejected through read-only search before any authorized POST',async()=>{
      clean();mode='old';const result=await runTrackingPreflight(mockDb,config,{...input,allowRegistration:true});assert.equal(result.outcome,'review');assert.equal(result.registrationAttempted,false);assert.equal(postAttempts,0);assert.equal(finished.length,0);
    });
    await check('Ambiguous registration never repeats POST and reports uncertainty without customer identifiers',async()=>{
      clean();mode='timeout';let result=await runTrackingPreflight(mockDb,config,{...input,allowRegistration:true});assert.equal(result.outcome,'retry');assert.equal(result.registrationAttempted,true);assert.equal(result.registered,false);assert.equal(postAttempts,1);
      pkg.registration_started_at=when(-30000);result=await runTrackingPreflight(mockDb,config,{...input,allowRegistration:true});assert.equal(result.outcome,'retry');assert.equal(postAttempts,1);assert.ok(calls.some(c=>c.name==='carrier_tracking_fail'));
      const output=JSON.stringify(result);for(const value of [pkg.id,pkg.order_id,pkg.tracking_number,'trk_preflight'])assert.ok(!output.includes(value));
    });
  }finally{Module._load=load;if(extension)require.extensions['.ts']=extension;else delete require.extensions['.ts'];global.fetch=realFetch;}
  console.log(`${passed} isolated carrier preflight checks passed. No live calls or commerce mutations.`);
}finally{await db.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
