const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const ts = require('typescript'), cp = require('node:child_process'), StripeSdk = require('stripe');
const harness = fs.readFileSync(path.join(__dirname,'test-launch-backend.cjs'),'utf8').split('(async()=>{')[0];
const {load} = new Function('require','__dirname',harness+';return {load};')(require,__dirname);
const sourceLoad = require('./fixtures/test-source-loader.cjs').createSourceLoader();
let count = 0;
async function check(name, fn) { await fn(); count++; console.log('PASS '+name); }
const req = body => ({json:async()=>body, headers:{get:()=>null},cookies:{get:()=>null},nextUrl:new URL('https://goalathletics.shop/api/checkout')});
const tee = {productId:'80000000-0000-4000-8000-000000000011',size:'M',color:'Black',quantity:1};
(async()=>{
  const shipping=sourceLoad('src/lib/shipping.ts'), delivery=sourceLoad('src/lib/delivery.ts');
  await check('Threshold uses discounted cents at 6999/7000; one/two/three tees reconcile',()=>{
    assert.equal(shipping.shippingCentsFor(6999),695); assert.equal(shipping.shippingCentsFor(7000),0);
    assert.equal(shipping.SHIPPING_PRICE_COPY,'$6.95 per order. Free shipping from $70 after discounts.');
  });
  const sessions=[];
  class Stripe { checkout={sessions:{create:async p=>{sessions.push(p);return {url:'https://checkout.stripe.com/fixture'}}}}; }
  process.env.STRIPE_SECRET_KEY='sk_test_fixture';
  const checkout=load('src/app/api/checkout/route.ts',{
    stripe:Stripe,'@/lib/store-status':{storeClosed:()=>false},'@/lib/migration-preview':{MIGRATION_PREVIEW:false},
    '@/lib/tapstitch-readiness':{tapstitchFulfillmentReady:async()=>true},
    '@/lib/discount':{...load('src/lib/discount.ts'),validatePromotionCode:async()=>({ok:true,code:'GOAL20-QA11',percentOff:20,promotionCodeId:'promo_fixture'})}
  });
  for(const [quantity,code,expected] of [[1,'',[3800,0,695,4495]],[1,'GOAL20-QA11',[3800,760,695,3735]],[2,'GOAL20-QA11',[7600,1520,695,6775]],[3,'GOAL20-QA11',[11400,2280,0,9120]]]) {
    await check(`Server quote and checkout agree: ${quantity} tee(s), ${code?'20%':'full price'}`,async()=>{
      const body={items:[{...tee,quantity,unitPriceCents:1}],email:'qa@example.test',code,totalCents:1,shippingCents:0,discounts:[{percent_off:100}]};
      const preview=await checkout.POST(req({...body,preview:true})); const created=await checkout.POST(req(body));
      assert.equal(preview.status,200);assert.equal(created.status,200);
      const keys=['subtotalCents','discountCents','shippingCents','totalCents'];
      assert.deepEqual(keys.map(k=>preview.body[k]),expected);assert.deepEqual(keys.map(k=>created.body[k]),expected);
      const session=sessions.at(-1);assert.equal(session.line_items[0].price_data.unit_amount,3800);
      assert.equal(session.shipping_options[0].shipping_rate_data.fixed_amount.amount,expected[2]);
      assert.equal(session.allow_promotion_codes,undefined);assert.equal(session.discounts?.length??0,code?1:0);
    });
  }
  await check('Checkout refuses malformed quantity and never creates a session for a quote',async()=>{
    const before=sessions.length; assert.equal((await checkout.POST(req({items:[{...tee,quantity:1.5}]}))).status,400);
    await checkout.POST(req({items:[tee],preview:true}));assert.equal(sessions.length,before);
  });
  await check('Delivery follows actual variant mapping; no Apliiq origin or cutoff is inherited by Tapstitch',()=>{
    assert.equal(delivery.deliveryForVariant(tee.productId,'Black','M').origin,'Ships from the United States.');
    const other=delivery.deliveryForVariant('80000000-0000-4000-8000-000000000023','Black','M');
    assert.equal(other.supplier,'tapstitch');assert.match(other.origin,/not yet confirmed/);assert.doesNotMatch(other.timing,/December|7.12|10.17/);
  });
  await check('Catalog, images, prices, holds and variants equal the exact production baseline except three removed claims',()=>{
    const original=cp.execFileSync('git',['show','7b98ba4:src/lib/products.ts'],{encoding:'utf8'});
    const mod={exports:{}};const code=ts.transpileModule(original,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
    new Function('require','module','exports',code)(n=>n.startsWith('./')?sourceLoad('src/lib/'+n.slice(2)):require(n),mod,mod.exports);
    const base=mod.exports.products, current=sourceLoad('src/lib/products.ts').products;
    for(const p of base) {
      if(p.id==='80000000-0000-4000-8000-000000000023')delete p.originLabel;
      if(['80000000-0000-4000-8000-000000000023','80000000-0000-4000-8000-000000000018'].includes(p.id))delete p.disclosure;
    }
    assert.equal(JSON.stringify(current),JSON.stringify(base));
  });
  await check('Request generations and context invalidate late, removed and equal-price variant quotes',()=>{
    const {createQuoteRequests,quoteContext}=sourceLoad('src/lib/checkout-quote.ts');const r=createQuoteRequests();
    const a=r.begin(),b=r.begin();assert.equal(r.current(a),false);assert.equal(r.current(b),true);r.invalidate();assert.equal(r.current(b),false);
    assert.notEqual(quoteContext([tee],'qa@example.test'),quoteContext([{...tee,color:'True Red'}],'qa@example.test'));
    assert.notEqual(quoteContext([tee],'qa@example.test'),quoteContext([tee],'other@example.test'));
  });
  // Real webhook signature verification, isolated state/providers. PostgreSQL
  // uniqueness/concurrent repair is covered separately by test-halo-checkout.
  const orders=new Map(), events=new Set(), meta=[], secret='whsec_growth_fixture';let seq=0;
  const store={hasEvent:async id=>events.has(id),recordEvent:async id=>events.add(id),
    createOrder:async(order,items)=>{const old=orders.get(order.stripe_session_id);if(old)return{orderId:old.id,created:false};
      const o={...order,id:'10000000-0000-4000-8000-'+String(++seq).padStart(12,'0'),items};orders.set(order.stripe_session_id,o);return{orderId:o.id,created:true};},
    getOrderBySession:async id=>orders.get(id),getOrderByPaymentIntent:async pi=>[...orders.values()].find(o=>o.stripe_payment_intent===pi),
    setOrderStatus:async(id,status)=>{[...orders.values()].find(o=>o.id===id).status=status;},transitionSubmission:async()=>true};
  class WebhookStripe {webhooks=new StripeSdk('sk_test_fixture').webhooks; paymentIntents={update:async()=>({})};}
  const oldFetch=global.fetch;global.fetch=async(url,options)=>{meta.push(JSON.parse(options.body));return{ok:true}};
  Object.assign(process.env,{STRIPE_WEBHOOK_SECRET:secret,META_CAPI_ACCESS_TOKEN:'fixture_only',NEXT_PUBLIC_META_PIXEL_ID:'123456789'});
  const webhook=load('src/app/api/stripe-webhook/route.ts',{stripe:WebhookStripe,'@/lib/orders-store':{getOrdersStore:()=>store},
    '@/lib/fulfillment-submit':{submitPaidOrder:async()=>({action:'left_pending_environment'}),orderNumber:id=>id},
    '@/lib/email-delivery':{queueOrderConfirmation:async()=> 'disabled'},'@/lib/discount':{markRedeemed:async()=>{}}});
  async function send(session,type='checkout.session.completed',id='evt_growth_'+Math.random()){
    const payload=JSON.stringify({id,object:'event',type,livemode:true,created:Math.floor(Date.now()/1000),data:{object:session}});
    const signature=new StripeSdk('sk_test_fixture').webhooks.generateTestHeaderString({payload,secret});
    return webhook.POST({text:async()=>payload,headers:{get:n=>n==='stripe-signature'?signature:null}});
  }
  const paid={id:'cs_fixture_growth',payment_status:'paid',currency:'usd',payment_intent:'pi_fixture_growth',amount_total:4495,
    metadata:{consent:'granted',items_0:JSON.stringify([{p:tee.productId,c:'Black',s:'M',q:1,u:3800,k:'APQ-6206620S7A1',a:6206620}])}};
  await check('Signed paid event creates one order and one purchase; identical event retry is idempotent',async()=>{
    assert.equal((await send(paid,undefined,'evt_same')).status,200);assert.equal((await send(paid,undefined,'evt_same')).status,200);
    assert.equal(orders.size,1);assert.equal(meta.length,1);assert.equal(meta[0].data[0].event_name,'Purchase');
  });
  await check('Refund followed by a late successful-payment event never recognizes retained revenue again',async()=>{
    await send({payment_intent:paid.payment_intent,refunded:true,amount:4495,amount_refunded:4495},'charge.refunded');
    await send(paid,'checkout.session.async_payment_succeeded');assert.equal(orders.get(paid.id).status,'refunded');assert.equal(meta.length,1);
  });
  await check('Unpaid Checkout and unknown or denied consent produce no purchase event',async()=>{
    await send({...paid,id:'cs_unpaid',payment_status:'unpaid'});
    for(const consent of [undefined,'denied'])await send({...paid,id:'cs_'+String(consent),metadata:{...paid.metadata,consent}});
    assert.equal(meta.length,1);
  });
  await check('Optional analytics lookup failure cannot fail an already recorded payment',async()=>{
    const read=store.getOrderBySession;store.getOrderBySession=async()=>{throw new Error('fixture analytics read failure')};
    const result=await send({...paid,id:'cs_optional_read_failure'});store.getOrderBySession=read;
    assert.equal(result.status,200);assert.equal(orders.get('cs_optional_read_failure').status,'paid');assert.equal(meta.length,1);
  });
  global.fetch=oldFetch;
  console.log(`${count} growth commerce checks passed. Offline fixtures; no live orders, real emails, supplier fulfillment or provider payment verification.`);
})().catch(e=>{console.error(e);process.exitCode=1});
