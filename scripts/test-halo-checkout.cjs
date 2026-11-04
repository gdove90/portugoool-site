'use strict';
// Isolated integration regressions: real application modules, real local
// PostgreSQL constraints, signed fixture webhooks, and captured providers.
// No production credentials, network calls, email, charges or supplier orders.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const ts = require('typescript');
const StripeSdk = require('stripe');
const { PGlite } = require('@electric-sql/pglite');
const { createHarness } = require('./fixtures/resend-queue-harness.cjs');
const ROOT = path.resolve(__dirname, '..');
const PRODUCT = '90000000-0000-4000-8000-000000000001';
const EXPECTED = {
  Black: '1567484017748627456',
  'Haze Blue': '1567487271354122240',
  Oat: '1567489152965033984',
  'Flower Gray': '1567491247352987648',
};
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const plain = value => JSON.parse(JSON.stringify(value));
const signed = new StripeSdk('sk_test_offline_fixture');
const secret = 'whsec_halo_offline_fixture';
let passed = 0;
async function check(name, run) {
  if (process.argv[2] && !name.includes(process.argv[2])) return;
  await run(); passed++; console.log('PASS ' + name);
}

function postgresAdapter(pg) {
  const faults = { failItems: 0, barrier: null, queueRead: false };
  const jsonFields = new Set(['sizes', 'shipping_address', 'tracking_numbers', 'tracking_urls', 'line_items']);
  const ident = name => '"' + name.replaceAll('"', '""') + '"';
  return { faults, from(table) {
    const filters = []; let op = 'read', values, options = {}, single = false, maximum, columns='*';
    const q = {
      select(value='*') { columns=value; return q; }, single() { single = true; return q; }, maybeSingle() { single = true; return q; },
      eq(k, v) { filters.push([k, '=', v]); return q; },
      in(k, v) { filters.push([k, 'in', v]); return q; },
      is(k, v) { filters.push([k, 'is', v]); return q; },
      order() { return q; }, limit(n) { maximum = n; return q; },
      insert(v) { op = 'insert'; values = v; return q; },
      upsert(v, o) { op = 'upsert'; values = v; options = o; return q; },
      update(v) { op = 'update'; values = v; return q; },
      then(resolve, reject) { return (async () => {
        try {
          if (table === 'email_deliveries' && faults.queueRead) throw new Error('fixture queue read failed');
          if (table === 'order_items' && op !== 'read') {
            if (faults.failItems > 0) { faults.failItems--; throw new Error('fixture item write failed'); }
            if (faults.barrier) {
              const b = faults.barrier; b.arrived++;
              if (b.arrived === b.parties) { faults.barrier = null; b.release(); }
              await b.promise;
            }
          }
          const params = [];
          const bind = (key, value) => { params.push(jsonFields.has(key) && value != null ? JSON.stringify(value) : value); return '$' + params.length; };
          const where = () => filters.length ? ' where ' + filters.map(([k, op, v]) => op === 'in' ? '('+v.map(value=>ident(k)+'='+bind(k,value)).join(' or ')+')' : op === 'is' && v === null ? ident(k) + ' is null' : ident(k) + ' = ' + bind(k, v)).join(' and ') : '';
          let sql;
          if (op === 'insert' || op === 'upsert') {
            const rows = Array.isArray(values) ? values : [values];
            const keys = Object.keys(rows[0]);
            sql = 'insert into ' + ident(table) + ' (' + keys.map(ident).join(',') + ') values ' + rows.map(row => '(' + keys.map(k => bind(k, row[k])).join(',') + ')').join(',');
            if (op === 'upsert') {
              sql += ' on conflict (' + options.onConflict.split(',').map(ident).join(',') + ') ';
              sql += options.ignoreDuplicates ? 'do nothing' : 'do update set ' + keys.map(k => ident(k) + '=excluded.' + ident(k)).join(',');
            }
            sql += ' returning *';
          } else if (op === 'update') {
            sql = 'update ' + ident(table) + ' set ' + Object.entries(values).map(([k,v]) => ident(k) + '=' + bind(k,v)).join(',') + where() + ' returning *';
          } else {
            sql = 'select '+(columns==='*'?'*':columns.split(',').map(k=>ident(k.trim())).join(','))+' from ' + ident(table) + where() + (maximum ? ' limit ' + Number(maximum) : '');
          }
          const { rows } = await pg.query(sql, params);
          return { data: single ? rows[0] ?? null : rows, error: null };
        } catch (e) { return { data: null, error: { code: e.code, message: e.message } }; }
      })().then(resolve, reject); },
    }; return q;
  } };
}

function loader(env, mocks) {
  const cache = new Map();
  function load(file) {
    let full = path.resolve(ROOT, file);
    if (!path.extname(full)) full += fs.existsSync(full + '.ts') ? '.ts' : '.json';
    if (cache.has(full)) return cache.get(full).exports;
    if (full.endsWith('.json')) return JSON.parse(fs.readFileSync(full, 'utf8'));
    const module = { exports: {} }; cache.set(full, module);
    const code = ts.transpileModule(fs.readFileSync(full, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    function req(name) {
      if (Object.hasOwn(mocks, name)) return mocks[name];
      if (name.startsWith('@/')) return load('src/' + name.slice(2));
      if (name.startsWith('.')) return load(path.relative(ROOT, path.resolve(path.dirname(full), name)));
      if (['crypto', 'node:crypto', 'fs', 'path'].includes(name)) return require(name);
      throw new Error('Unexpected provider dependency: ' + name);
    }
    vm.runInNewContext(code, { module, exports:module.exports, require:req, process:{env}, Buffer, URL, Date, AbortSignal,
      fetch() { throw new Error('No network is permitted in Halo integration tests.'); },
      console:{log(){},error(){}}, setTimeout, clearTimeout }, {filename:full});
    return module.exports;
  }
  return load;
}

async function main() {
  const pg = new PGlite();
  await pg.exec(`
    create table products(id uuid primary key,name text,slug text,description text,price_cents int,color text,color_hex text,sizes jsonb,product_category text,supplier_type text,is_active bool,available_for_sale bool);
    create table orders(id uuid primary key default gen_random_uuid(),stripe_session_id text unique,stripe_payment_intent text,customer_email text,
      status text check(status in ('pending','paid','cancelled','refunded')),fulfillment_status text check(fulfillment_status in ('unfulfilled','submitted','in_production','shipped','delivered','cancelled')),
      submission_status text check(submission_status in ('not_submitted','pending_submission','submitting','submitted','accepted','failed','needs_reconcile')),
      total_cents int,amount_subtotal_cents int,amount_shipping_cents int,amount_tax_cents int,amount_discount_cents int,currency text,shipping_name text,shipping_address jsonb,
      apliiq_order_id text,submission_last_error text,paid_at text,livemode bool,submission_attempt_id text,submission_started_at text);
    create table order_items(id uuid primary key default gen_random_uuid(),order_id uuid references orders(id),product_id uuid references products(id),size text,color text,quantity int check(quantity>0),
      custom_name text,custom_number text,unit_price_cents int check(unit_price_cents>=0),apliiq_product_id bigint,apliiq_sku text);
    create table stripe_events(id text primary key,type text);
    create table email_deliveries(key text primary key,kind text,message jsonb,livemode bool,order_id uuid,status text);
    create table order_shipments(id uuid primary key,order_id uuid references orders(id),status text,tracking_company text,tracking_numbers jsonb,tracking_urls jsonb,line_items jsonb);
  `);
  const db = postgresAdapter(pg);
  const env = { STORE_OPEN:'true', STRIPE_SECRET_KEY:'sk_live_fixture', STRIPE_WEBHOOK_SECRET:secret, RESEND_API_KEY:'re_fixture', NEXT_PUBLIC_SITE_URL:'https://goalathletics.shop' };
  const state = { enabled:true, environment:true, email:true, queueFailure:false, sessions:[], alerts:new Map(), confirmations:new Set(), delay:0, provider:[] };
  let store;
  class Response { static json(body, options={}) { return {body,status:options.status??200}; } }
  class Stripe {
    webhooks = signed.webhooks;
    checkout = {sessions:{create:async p => { state.sessions.push(plain(p)); return {url:'https://checkout.stripe.com/offline-fixture'}; },retrieve:async()=>{throw new Error('Unexpected provider retrieval');}}};
    paymentIntents = {update:async()=>({})};
  }
  const mocks = {
    'next/server':{NextResponse:Response}, stripe:Stripe,
    './supabase':{getSupabaseAdmin:()=>db},
    './email':{emailEnabled:()=>state.email,SUPPORT_EMAIL:'support@goalathletics.shop'},
    './apliiq':{apliiqSubmitEnabled:()=>state.enabled,submissionEnvironmentAllowed:()=>({allowed:state.environment}),
      isSimulatedDestination:()=>true,submitOrder:async payload=>{state.provider.push(plain(payload));return{outcome:'accepted',apliiqOrderId:'supplier-fixture'};}},
    './email-delivery':{
      queueFulfillmentAlert:async(s,id,live,parked,reason)=>{if(state.queueFailure)throw new Error('fixture task ledger unavailable');state.alerts.set(id+'/'+parked,{id,parked,reason,items:plain(await s.listOrderItems(id))});return'queued';},
      queueOrderDelayNotice:async()=>{state.delay++;},
    },
    '@/lib/email-delivery':{queueOrderConfirmation:async(s,id)=>{state.confirmations.add(id);return'queued';}},
    '@/lib/discount':{CODE_REJECTION_MESSAGE:{},discountCentsFor:(amount,percent)=>Math.round(amount*percent/100),validatePromotionCode:async()=>({ok:true,code:'GOOOL20-FIXTURE',percentOff:20,promotionCodeId:'promo_fixture'}),markRedeemed:async()=>{}},
    '@/lib/signups':{EMAIL_RE:/^[^@]+@[^@]+\.[^@]+$/},
    '@/lib/meta-capi':{clientIpFrom:()=>null,metaCapiConfigured:()=>false,sendMetaServerEvent:async()=>{throw new Error('No advertising calls.');}},
    '@/lib/meta-events':{metaEventId:async()=> 'fixture'},
  };
  const load = loader(env,mocks);
  const actual = load('src/lib/products.ts');
  await pg.exec(`insert into products(id,supplier_type,product_category) values
    ('80000000-0000-4000-8000-000000000023','tapstitch','pullover'),
    ('80000000-0000-4000-8000-000000000024','apliiq','pants');`);
  // Candidate availability is exercised before the live release flag flips.
  const original = actual.products.find(p=>p.id===PRODUCT);
  assert.equal(original.priceCents,3800,'Owner-approved catalog price');
  assert.deepEqual(plain(original.sizes),SIZES,'Verified supplier size range');
  assert.deepEqual(plain(original.colorVariants.map(v=>v.name)),Object.keys(EXPECTED),'Four approved customer colorways');
  const candidate = {...original,priceCents:3800,availableForSale:true,colorVariants:original.colorVariants.map(v=>({...v,comingSoon:false}))};
  mocks['@/lib/products'] = {...actual,getProductById:(id,opts)=>id===PRODUCT?candidate:actual.getProductById(id,opts)};
  store = load('src/lib/orders-store.ts').getOrdersStore();
  mocks['@/lib/orders-store'] = {getOrdersStore:()=>store};
  const submit = load('src/lib/fulfillment-submit.ts');
  mocks['@/lib/fulfillment-submit'] = submit;
  const checkout = load('src/app/api/checkout/route.ts');
  const webhook = load('src/app/api/stripe-webhook/route.ts');
  const fulfillment = load('src/lib/fulfillment.ts');
  const req = body => ({json:async()=>body,headers:{get:()=>null},cookies:{get:()=>undefined},nextUrl:new URL('https://goalathletics.shop/api/checkout')});
  const cart = (color,size,quantity=1) => ({productId:PRODUCT,color,size,quantity,priceCents:1,customName:null,customNumber:null});
  function event(params,extra={}) {
    const session={id:'cs_fixture_'+crypto.randomUUID(),object:'checkout.session',payment_status:'paid',currency:'usd',payment_intent:'pi_fixture_'+crypto.randomUUID(),
      amount_subtotal:params.line_items.reduce((n,i)=>n+i.price_data.unit_amount*i.quantity,0),amount_total:4495,total_details:{amount_shipping:695,amount_tax:0,amount_discount:0},
      customer_details:{email:'buyer@example.test'},collected_information:{shipping_details:{name:'Fixture Buyer',address:{line1:'1 Fixture Way',city:'Newport',state:'RI',postal_code:'02840',country:'US'}}},metadata:params.metadata,...extra.session};
    return {id:'evt_fixture_'+crypto.randomUUID(),type:'checkout.session.completed',livemode:true,created:Math.floor(Date.now()/1000),data:{object:session},...extra,event:undefined};
  }
  async function deliver(e,invalid=false) {
    const body=JSON.stringify(e);const signature=invalid?'bad-signature':signed.webhooks.generateTestHeaderString({payload:body,secret});
    return webhook.POST({text:async()=>body,headers:{get:n=>n==='stripe-signature'?signature:null}});
  }
  async function start(color='Black',size='M',quantity=1) {
    const response=await checkout.POST(req({items:[cart(color,size,quantity)]}));assert.equal(response.status,200,JSON.stringify(response));return state.sessions.at(-1);
  }

  await check('All 20 exact supplier references and $38 server prices survive Checkout, signed payment, persisted rows and manual handoff',async()=>{
    for(const [color,design] of Object.entries(EXPECTED))for(const size of SIZES){
      const params=await start(color,size);assert.equal(params.line_items[0].price_data.unit_amount,3800);
      const snapshot=JSON.parse(params.metadata.items_0)[0];assert.deepEqual(snapshot,{p:PRODUCT,c:color,s:size,q:1,u:3800,k:`TAP-${design}-${size}`,a:null});
      const response=await deliver(event(params));assert.equal(response.status,200);assert.equal(response.body.submission,'manual_tapstitch');
      const order=await store.getOrderById(response.body.order);assert.equal(order.status,'paid');assert.equal(order.submission_status,'not_submitted');assert.equal(order.fulfillment_status,'unfulfilled');
      const lines=await store.listOrderItems(order.id);assert.equal(lines.length,1);assert.equal(lines[0].apliiq_sku,snapshot.k);assert.equal(lines[0].apliiq_product_id,null);assert.equal(lines[0].unit_price_cents,3800);
    }
    assert.equal(state.provider.length,0);assert.equal(state.delay,0);assert.equal(state.alerts.size,20);
  });
  await check('One pair totals $44.95; two pairs total $76 with free shipping; 20% discount uses the post-discount threshold',async()=>{
    for(const [quantity,code,total,shipping] of [[1,'',4495,695],[2,'',7600,0],[2,'GOOOL20-FIXTURE',6775,695]]){
      const r=await checkout.POST(req({items:[cart('Oat','XXL',quantity)],preview:true,code,email:code?'buyer@example.test':''}));
      assert.equal(r.status,200);assert.equal(r.body.totalCents,total);assert.equal(r.body.shippingCents,shipping);
    }
  });
  await check('Invalid size, supplier Apricot submitted as site color, and malformed quantity cannot reach Stripe',async()=>{
    const before=state.sessions.length;for(const line of [cart('Apricot','M'),cart('Oat','3XL'),cart('Black','M',0),cart('Black','M',1.5)])assert.equal((await checkout.POST(req({items:[line]}))).status,400);assert.equal(state.sessions.length,before);
  });
  await check('Manual readiness fails closed for unavailable production context, email configuration or task ledger',async()=>{
    const before=state.sessions.length;
    for(const flag of ['environment','email']){state[flag]=false;assert.equal((await checkout.POST(req({items:[cart('Black','M')]}))).status,503);state[flag]=true;}
    db.faults.queueRead=true;assert.equal((await checkout.POST(req({items:[cart('Black','M')]}))).status,503);db.faults.queueRead=false;assert.equal(state.sessions.length,before);
  });
  await check('Unsigned payment cannot create an order or task',async()=>{const e=event(await start());const before=(await pg.query('select count(*)::int n from orders')).rows[0].n;assert.equal((await deliver(e,true)).status,400);assert.equal((await pg.query('select count(*)::int n from orders')).rows[0].n,before);});
  await check('Missing deployed supplier/category compatibility proof blocks checkout before payment',async()=>{
    await pg.exec("update products set supplier_type='apliiq' where id='80000000-0000-4000-8000-000000000023'");assert.equal((await checkout.POST(req({items:[cart('Black','M')]}))).status,503);
    await pg.exec("update products set supplier_type='tapstitch' where id='80000000-0000-4000-8000-000000000023'");
    await pg.exec("update products set product_category='pullover' where id='80000000-0000-4000-8000-000000000024'");assert.equal((await checkout.POST(req({items:[cart('Black','M')]}))).status,503);
    await pg.exec("update products set product_category='pants' where id='80000000-0000-4000-8000-000000000024'");
  });
  await check('Duplicate event and concurrent first deliveries create one order, one line and one durable manual task',async()=>{
    const e=event(await start());const r=await Promise.all([deliver(e),deliver({...e,id:e.id+'_parallel'})]);assert(r.every(x=>x.status===200));const o=await store.getOrderBySession(e.data.object.id);assert.equal((await store.listOrderItems(o.id)).length,1);assert.equal([...state.alerts.values()].filter(a=>a.id===o.id).length,1);assert.equal((await deliver(e)).body.duplicate,true);
  });
  await check('Manual task persistence failure returns 503 without acknowledging event; replay recovers once',async()=>{
    const e=event(await start());state.queueFailure=true;assert.equal((await deliver(e)).status,503);assert.equal(await store.hasEvent(e.id),false);state.queueFailure=false;const r=await deliver(e);assert.equal(r.status,200);assert.equal(r.body.submission,'manual_tapstitch');assert.equal((await store.listOrderItems(r.body.order)).length,1);
  });
  await check('Missing order lines heal after failure; concurrent repairs deduplicate against the PostgreSQL primary key',async()=>{
    const e=event(await start());db.faults.failItems=1;assert.equal((await deliver(e)).status,500);assert.equal(await store.hasEvent(e.id),false);
    let release;const promise=new Promise(r=>{release=r;});db.faults.barrier={parties:2,arrived:0,promise,release};
    const result=await Promise.all([deliver(e),deliver({...e,id:e.id+'_repair'})]);assert(result.every(r=>r.status===200));const o=await store.getOrderBySession(e.data.object.id);assert.equal((await store.listOrderItems(o.id)).length,1);
  });
  await check('Repeated identical cart lines keep distinct positions without multiplying on replay',async()=>{
    const p=await start();p.metadata.items_0=JSON.stringify([JSON.parse(p.metadata.items_0)[0],JSON.parse(p.metadata.items_0)[0]]);const e=event(p);const r=await deliver(e);assert.equal(r.status,200);await deliver({...e,id:e.id+'_again'});assert.equal((await store.listOrderItems(r.body.order)).length,2);
  });
  await check('Delayed payments wait for success, including out-of-order delivery, and never place twice',async()=>{
    const e=event(await start(),{session:{payment_status:'unpaid'}});const unpaid=await deliver(e);assert.equal(unpaid.status,200);assert(!state.alerts.has(unpaid.body.order+'/tapstitch_manual'));
    const success={...e,id:e.id+'_success',type:'checkout.session.async_payment_succeeded'};const paid=await deliver(success);assert.equal(paid.status,200);assert.equal((await store.getOrderById(paid.body.order)).status,'paid');await deliver({...e,id:e.id+'_late'});assert.equal((await store.listOrderItems(paid.body.order)).length,1);
  });
  await check('Malformed supplier snapshot remains failed instead of being guessed',async()=>{
    for(const change of [{k:'TAP-bad-M'},{k:`TAP-${EXPECTED.Black}-L`},{a:123}]){const p=await start();p.metadata.items_0=JSON.stringify([{...JSON.parse(p.metadata.items_0)[0],...change}]);const r=await deliver(event(p));assert.equal(r.status,200);assert.equal((await store.getOrderById(r.body.order)).submission_status,'failed');}
  });
  await check('Tapstitch handoff remains operational with Apliiq submission disabled',async()=>{state.enabled=false;const r=await deliver(event(await start()));assert.equal(r.body.submission,'manual_tapstitch');state.enabled=true;});
  await check('Mixed-supplier cart routes only Apliiq lines to its API and keeps Tapstitch manual',async()=>{
    const ap=actual.getProducts().find(p=>p.supplierType==='apliiq'&&p.availableForSale);
    const body={items:[cart('Oat','XXL'),{productId:ap.id,color:ap.colorVariants[0].name,size:ap.sizes[0],quantity:1}]};
    const checkoutResult=await checkout.POST(req(body));assert.equal(checkoutResult.status,200);const before=state.provider.length;const r=await deliver(event(state.sessions.at(-1)));assert.equal(r.status,200);assert.equal(state.provider.length,before+1);assert(state.provider.at(-1).line_items.every(i=>!i.sku.startsWith('TAP-')));assert.equal((await store.listOrderItems(r.body.order)).length,2);assert(state.alerts.has(r.body.order+'/tapstitch_manual'));
  });
  await check('Manual owner task clearly identifies supplier Apricot, 2XL, saved design, order link and shipping address',async()=>{
    const p=await start('Oat','XXL');const r=await deliver(event(p));const o=await store.getOrderById(r.body.order),items=await store.listOrderItems(o.id);
    const template=load('src/lib/emails/fulfillment-alert.ts').buildFulfillmentAlert({order:o,items,parkedAs:'tapstitch_manual',reason:''});
    for(const required of ['supplier color Apricot','supplier size 2XL',EXPECTED.Oat,'1567489153183207424','1 Fixture Way','tapstitch_order_id'])assert(template.text.includes(required),required);assert(!template.subject.includes('not accepted by Apliiq'));
  });
  await check('Existing manual shipment operation persists tracking idempotently',async()=>{
    const p=await start();const r=await deliver(event(p));const shipment={order_id:r.body.order,status:'shipped',tracking_company:'USPS',tracking_numbers:['9400111899223334445556'],tracking_urls:['https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899223334445556'],line_items:[]};await Promise.all([store.addShipment(shipment),store.addShipment(shipment)]);assert.equal((await store.listShipments(r.body.order)).length,1);
  });
  await check('Actual notification ledger uses one manual task across later Apliiq attempt IDs and delivery retries',async()=>{
    const h=createHarness();const f=h.seedReceipt();f.items=[{product_id:PRODUCT,size:'XXL',color:'Oat',quantity:1,custom_name:null,custom_number:null,unit_price_cents:3800,apliiq_product_id:null,apliiq_sku:`TAP-${EXPECTED.Oat}-XXL`}];h.itemRows.set(f.order.id,f.items);
    h.transport.mode='fail';const mail=h.load('src/lib/email-delivery.ts');await mail.queueFulfillmentAlert(h.store,f.order.id,false,'tapstitch_manual','manual');h.tables.orders[0].submission_attempt_id='different-apliiq-attempt';await mail.queueFulfillmentAlert(h.store,f.order.id,false,'tapstitch_manual','manual');assert.equal(h.tables.email_deliveries.length,1);assert(h.tables.email_deliveries[0].key.endsWith('/tapstitch_manual/first'));
  });
  await pg.close();
  if (!process.argv[2]) assert.equal(passed,17,'All independent checks must run');
  else assert(passed > 0,'The requested test filter must match a check');
  console.log(`${passed} Halo integration checks passed; 20 exact variants covered. No production writes or provider requests.`);
}
main().catch(e=>{console.error(e);process.exit(1);});
