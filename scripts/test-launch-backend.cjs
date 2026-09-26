const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const ROOT=path.resolve(__dirname,"..");const ts=require(ROOT+'/node_modules/typescript');
const NextResponse={json:(body,opt={})=>({status:opt.status||200,body})};
function load(file,mocks={},cache={}){
 const full=path.resolve(ROOT,file);if(cache[full])return cache[full];
 const source=ts.transpileModule(fs.readFileSync(full,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 const module={exports:{}};cache[full]=module.exports;
 const req=id=>{if(Object.hasOwn(mocks,id))return mocks[id];if(id==='next/server')return {NextResponse};if(id.startsWith('@/'))return load('src/'+id.slice(2)+'.ts',mocks,cache);if(id.startsWith('.'))return load(path.relative(ROOT,path.resolve(path.dirname(full),id+'.ts')),mocks,cache);return require(id);};
 new Function('require','module','exports',source)(req,module,module.exports);cache[full]=module.exports;return module.exports;
}
const results=[];async function test(name,fn){try{await fn();results.push({name,pass:true});console.log('PASS '+name)}catch(e){results.push({name,pass:false,error:e.message});console.log('FAIL '+name+' '+e.message)}}
function request(body){return {json:async()=>body,nextUrl:new URL('https://goool.shop/api/checkout')}}
// A minimal deterministic in-memory PostgREST substitute. SQL lease behavior is also
// checked separately against the real database in a rolled-back transaction.
function memory(initial={}){
 const tables=structuredClone(initial);
 function from(table){tables[table]??=[];let filters=[],op='read',values,options={},single=false,limit=100;
  const q={select(){return q},eq(k,v){filters.push(r=>r[k]===v);return q},is(k,v){filters.push(r=>(r[k]??null)===v);return q},in(k,v){filters.push(r=>v.includes(r[k]));return q},lt(k,v){filters.push(r=>r[k]!=null&&r[k]<v);return q},lte(k,v){filters.push(r=>r[k]<=v);return q},order(){return q},limit(v){limit=v;return q},maybeSingle(){single=true;return q},insert(v){op='insert';values=v;return q},upsert(v,o){op='upsert';values=v;options=o;return q},update(v){op='update';values=v;return q},then(resolve,reject){try{
    let rows=tables[table].filter(r=>filters.every(f=>f(r))).slice(0,limit);
    if(op==='upsert'){let exists=tables[table].some(r=>r[options.onConflict]===values[options.onConflict]);if(!exists)tables[table].push({status:'pending',attempts:0,next_attempt_at:new Date(0).toISOString(),...values});rows=[];}
    if(op==='insert'){if(tables[table].some(r=>r.email_hash===values.email_hash&&r.livemode===values.livemode))return Promise.resolve({data:null,error:{code:'23505'}}).then(resolve,reject);tables[table].push({...values});rows=[values];}
    if(op==='update')for(const r of rows)Object.assign(r,values);
    return Promise.resolve({data:single?(rows[0]??null):structuredClone(rows),error:null}).then(resolve,reject);
  }catch(e){return Promise.reject(e).then(resolve,reject)}}};return q;
 }
 return {tables,from,rpc:async(name,{p_key,p_token})=>{const r=tables.email_deliveries?.find(r=>r.key===p_key);if(!r||r.status==='sent'||r.status==='sending'||Date.parse(r.next_attempt_at)>Date.now())return {data:[],error:null};Object.assign(r,{status:'sending',claim_token:p_token,first_attempt_at:r.first_attempt_at??new Date().toISOString(),attempts:r.attempts+1});return {data:[structuredClone(r)],error:null}}};
}
(async()=>{
 process.env.STRIPE_SECRET_KEY='sk_live_mock';process.env.STRIPE_SHIPPING_RATE_ID='shr_mock';process.env.STRIPE_WEBHOOK_SECRET='whsec_mock';process.env.RESEND_API_KEY='re_mock';
 let sessions=[];class Stripe{checkout={sessions:{create:async p=>{sessions.push(p);return {url:'https://checkout.stripe.com/mock'}}}}}
 const checkout=load('src/app/api/checkout/route.ts',{stripe:Stripe});const catalog=load('src/lib/products.ts');
 const p=catalog.getProducts()[0];const item={productId:p.id,color:p.colorVariants?.[0].name??p.color,size:p.sizes[0],quantity:1};
 for(const [name,body] of Object.entries({nullBody:null,empty:{items:[]},nullLine:{items:[null]},missingQty:{items:[{...item,quantity:undefined}]},stringQty:{items:[{...item,quantity:'1'}]},fraction:{items:[{...item,quantity:1.5}]},negative:{items:[{...item,quantity:-1}]},excess:{items:[{...item,quantity:11}]},badCustom:{items:[{...item,customName:123}]},badSize:{items:[{...item,size:'BAD'}]},badColor:{items:[{...item,color:'BAD'}]}}))await test('Reject malformed checkout: '+name,async()=>assert.equal((await checkout.POST(request(body))).status,400));
 await test('All 83 sellable variants use identical server prices and fulfillment snapshots',async()=>{let count=0;for(const prod of catalog.getProducts())for(const color of prod.colorVariants?.filter(v=>!v.comingSoon).map(v=>v.name)??[prod.color])for(const size of prod.sizes){const r=await checkout.POST(request({items:[{productId:prod.id,color,size,quantity:2,priceCents:1}]}));assert.equal(r.status,200);const session=sessions.at(-1);const snap=JSON.parse(Object.keys(session.metadata).sort((a,b)=>Number(a.slice(6))-Number(b.slice(6))).map(k=>session.metadata[k]).join(''))[0];assert.equal(snap.u,prod.priceCents);assert.equal(snap.u,session.line_items[0].price_data.unit_amount);assert.equal(snap.q,2);assert.ok(snap.k&&snap.a);count++}assert.equal(count,83)});
 const mail=load('src/lib/emails/order-confirmation.ts');await test('Discounted receipt reconciles subtotal, discount, shipping and total',()=>{const m=mail.buildOrderConfirmation({order:{id:'abc',amount_subtotal_cents:5000,amount_discount_cents:1000,amount_shipping_cents:950,amount_tax_cents:0,total_cents:4950,currency:'usd'},items:[]});assert.match(m.text,/Discount: -\$10.00/);assert.match(m.html,/-\$10.00/);assert.match(m.text,/Total paid: \$49.50/)});
 let promoSeq=0;class DiscountStripe{coupons={list:async()=>({data:[{id:'coupon',valid:true,percent_off:20,metadata:{source:'goool20-popup'}}]})};promotionCodes={retrieve:async()=>({times_redeemed:0}),create:async()=>({id:'promo'+(++promoSeq)}),update:async()=>({})}}
 const ledger=memory({discount_codes:[{email_hash:load('src/lib/discount.ts',{stripe:DiscountStripe,'./supabase':{getSupabaseAdmin:()=>null}}).emailHash('qa@example.com'),code:'GOOOL20-OLD',stripe_promotion_code_id:'old',livemode:true,expires_at:'2000-01-01',redeemed_at:null}]});
 const discount=load('src/lib/discount.ts',{stripe:DiscountStripe,'./supabase':{getSupabaseAdmin:()=>ledger}});
 await test('Expired code renews once and repeat signup returns same replacement',async()=>{const a=await discount.issueDiscountCode('qa@example.com'),b=await discount.issueDiscountCode('qa@example.com');assert.equal(a.status,'issued');assert.notEqual(a.code,'GOOOL20-OLD');assert.equal(a.code,b.code);assert.equal(ledger.tables.discount_codes.length,1)});
 await test('Live and test codes coexist without crossing modes',async()=>{process.env.STRIPE_SECRET_KEY='sk_test_mock';const t=await discount.issueDiscountCode('qa@example.com');process.env.STRIPE_SECRET_KEY='rk_live_mock';const l=await discount.issueDiscountCode('qa@example.com');assert.notEqual(t.code,l.code);assert.equal(ledger.tables.discount_codes.length,2)});
 const db=memory({orders:[]});let fail=true,sends=[];
 const delivery=load('src/lib/email-delivery.ts',{'./supabase':{getSupabaseAdmin:()=>db},'./email':{emailEnabled:()=>true,sendEmail:async(m,key)=>{sends.push(key);return fail?{sent:false,reason:'temporary'}:{sent:true,id:'accepted'}}}});
 const message={to:'qa@example.com',subject:'Test',text:'Test',html:'Test'};
 await test('Repeated queue requests preserve one immutable email',async()=>{await delivery.queueEmail('qa','discount',message,true);await delivery.queueEmail('qa','discount',{...message,text:'changed'},true);assert.equal(db.tables.email_deliveries.length,1);assert.equal(db.tables.email_deliveries[0].message.text,'Test')});
 await test('Failed send remains queued and retries with the same provider identity',async()=>{assert.equal(await delivery.deliverEmail('qa'),'queued');assert.equal(db.tables.email_deliveries[0].sent_at,undefined);db.tables.email_deliveries[0].next_attempt_at=new Date(0).toISOString();fail=false;assert.equal(await delivery.deliverEmail('qa'),'sent');assert.deepEqual(sends,['qa','qa']);await delivery.deliverEmail('qa');assert.equal(sends.length,2)});
 await test('Concurrent sends claim only one delivery',async()=>{await delivery.queueEmail('concurrent','discount',message,true);await Promise.all([delivery.deliverEmail('concurrent'),delivery.deliverEmail('concurrent')]);assert.equal(sends.filter(s=>s==='concurrent').length,1)});
 await test('Worker parks ambiguous deliveries beyond provider deduplication window',async()=>{await delivery.queueEmail('stale','discount',message,true);Object.assign(db.tables.email_deliveries.find(r=>r.key==='stale'),{first_attempt_at:'2000-01-01'});await delivery.drainEmailQueue(true);assert.equal(db.tables.email_deliveries.find(r=>r.key==='stale').status,'needs_review')});
 await test('Live worker never sends a test-mode delivery',async()=>{await delivery.queueEmail('test-only','discount',message,false);await delivery.drainEmailQueue(true);assert.ok(!sends.includes('test-only'))});
 let saved=new Set(),order=null,queueFailure=true,queues=0,submissions=0;
 const store={hasEvent:async id=>saved.has(id),recordEvent:async id=>saved.add(id),createOrder:async row=>{const created=!order;order??={...row,id:'order-qa'};return {orderId:order.id,created}},getOrderBySession:async()=>order};
 const event={id:'evt_qa',type:'checkout.session.completed',livemode:true,data:{object:{id:'cs_qa',payment_status:'paid',payment_intent:'pi_qa',customer_details:{email:'qa@example.com'},amount_total:5950,amount_subtotal:5000,currency:'usd',total_details:{amount_shipping:950,amount_tax:0,amount_discount:0},metadata:{items_0:JSON.stringify([{p:p.id,c:item.color,s:item.size,q:1,u:5000,k:'sku',a:1}])}}}};
 class WebhookStripe{webhooks={constructEvent:()=>event};paymentIntents={update:async()=>({})}}
 const webhook=load('src/app/api/stripe-webhook/route.ts',{stripe:WebhookStripe,'@/lib/orders-store':{getOrdersStore:()=>store},'@/lib/email-delivery':{queueOrderConfirmation:async()=>{if(queueFailure)throw Error('queue unavailable');queues++;return 'queued'}},'@/lib/fulfillment-submit':{submitPaidOrder:async()=>{submissions++;return {action:'safe'}}},'@/lib/discount':{markRedeemed:async()=>{}}});
 const wr={text:async()=>'',headers:{get:()=> 'signed'}};
 await test('Queue persistence failure keeps Stripe event retryable; replay recovers',async()=>{assert.equal((await webhook.POST(wr)).status,500);assert.equal(saved.size,0);queueFailure=false;assert.equal((await webhook.POST(wr)).status,200);assert.equal(saved.size,1);const n=submissions;assert.equal((await webhook.POST(wr)).body.duplicate,true);assert.equal(submissions,n);assert.equal(queues,2)});
 const originalFetch=global.fetch;let called=[];global.fetch=async(url,opt)=>{called.push({url,opt});return {ok:true,status:200,json:async()=>({id:'email-id'})}};
 const transport=load('src/lib/email.ts');await test('Only Resend sends, with stable idempotency header and GOOOL sender',async()=>{process.env.SMTP_USER='ignored';process.env.SMTP_PASS='ignored';const result=await transport.sendEmail(message,'delivery-1');assert.ok(result.sent);assert.equal(called[0].opt.headers['Idempotency-Key'],'delivery-1');assert.equal(JSON.parse(called[0].opt.body).from,'GOOOL <hello@goool.shop>')});
 global.fetch=async()=>({ok:true,status:200,json:async()=>({status:'unsubscribed'})});process.env.MAILCHIMP_API_KEY='test-us6';process.env.MAILCHIMP_AUDIENCE_ID='aud';
 await test('Unsubscribed member is not reported as a new subscriber',async()=>assert.equal((await load('src/lib/mailchimp.ts').subscribeToAudience('qa@example.com',[])).ok,false));global.fetch=originalFetch;
 const route=load('src/app/api/discount/route.ts',{'@/lib/mailchimp':{EMAIL_RE:/@/,subscribeToAudience:async()=>({ok:true})},'@/lib/email':{emailEnabled:()=>true},'@/lib/discount':{issueDiscountCode:async()=>({status:'unavailable',reason:'database'})},'@/lib/email-delivery':{queueEmail:async()=>{throw Error('must not queue')}}});
 await test('Failed code issuance returns retryable error without a false email promise',async()=>{const r=await route.POST(request({email:'qa@example.com'}));assert.equal(r.status,503);assert.ok(!r.body.message)});
 fs.writeFileSync(path.join(ROOT,'tmp/launch-fix-test-results.json'),JSON.stringify({checkedAt:new Date().toISOString(),passed:results.filter(r=>r.pass).length,failed:results.filter(r=>!r.pass).length,results},null,2));
 if(results.some(r=>!r.pass))process.exitCode=1;
})();
