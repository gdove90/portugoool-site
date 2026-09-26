const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const harness=fs.readFileSync(path.join(__dirname,'test-launch-backend.cjs'),'utf8').split('(async()=>{')[0];
const {load}=new Function('require','__dirname',harness+';return {load};')(require,__dirname);
let passed=0;async function check(name,fn){await fn();passed++;console.log('PASS '+name);}
(async()=>{
 const storage=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)}};
 global.localStorage=storage();global.sessionStorage=storage();
 global.window={dispatchEvent:()=>{}};global.location={pathname:'/shop',search:''};
 Object.defineProperty(global,'navigator',{value:{globalPrivacyControl:false},configurable:true});
 const scripts=[];global.document={head:{appendChild:s=>scripts.push(s)},createElement:()=>({}),cookie:''};
 process.env.NEXT_PUBLIC_META_PIXEL_ID='123456789012345';
 const pixel=load('src/lib/meta-pixel.ts');
 const event={id:'purchase_'+'a'.repeat(32),value:57.50,currency:'USD'};
 await check('No advertising script or event before consent',()=>{pixel.trackPageView();pixel.trackVerifiedPurchase(event);assert.equal(scripts.length,0);assert.equal(window.fbq,undefined);});
 await check('Declining keeps Meta unloaded',()=>{pixel.setMarketingConsent('denied');assert.equal(scripts.length,0);});
 await check('Grant loads once and sends the pending verified purchase once',()=>{pixel.setMarketingConsent('granted');pixel.trackVerifiedPurchase(event);assert.equal(scripts.length,1);assert.equal(window.fbq.queue.filter(a=>a[2]==='Purchase').length,1);assert.equal(window.fbq.queue.filter(a=>a[2]==='Purchase')[0][3].value,57.50);});
 await check('Automatic form/microdata collection is disabled',()=>{assert.deepEqual(window.fbq.queue[0],['set','autoConfig',false,'123456789012345']);});
 await check('Withdrawal and Global Privacy Control block future events',()=>{pixel.setMarketingConsent('denied');const count=window.fbq.queue.length;pixel.trackVerifiedPurchase({...event,id:'purchase_'+'b'.repeat(32)});assert.equal(window.fbq.queue.length,count);navigator.globalPrivacyControl=true;pixel.setMarketingConsent('granted');assert.equal(pixel.marketingConsent(),'denied');navigator.globalPrivacyControl=false;});
 await check('Checkout token in URL prevents loading Meta',()=>{window.fbq=undefined;window._fbq=undefined;location.pathname='/success';location.search='?session_id=cs_live_secret';const p=load('src/lib/meta-pixel.ts');const before=scripts.length;p.trackVerifiedPurchase({...event,id:'purchase_'+'c'.repeat(32)});assert.equal(scripts.length,before);assert.equal(window.fbq,undefined);});
 await check('No configured Pixel ID means no scripts even with consent',()=>{location.pathname='/shop';location.search='';delete process.env.NEXT_PUBLIC_META_PIXEL_ID;const p=load('src/lib/meta-pixel.ts');const before=scripts.length;p.trackPageView();assert.equal(scripts.length,before);});
 let live=true,orderStatus='paid',paid=true,found=true;
 class Stripe{checkout={sessions:{retrieve:async()=>({id:'cs_live_secret',livemode:live,payment_status:paid?'paid':'unpaid',status:paid?'complete':'open',amount_total:5750,currency:'usd'})}};}
 const route=load('src/app/api/order-status/route.ts',{stripe:Stripe,'@/lib/orders-store':{getOrdersStore:()=>({getOrderBySession:async()=>found?{id:'99999999-1111-4444-8888-999999999999',status:orderStatus,livemode:live}:null})}});
 process.env.STRIPE_SECRET_KEY='rk_live_mock';
 const req={nextUrl:new URL('https://goool.shop/api/order-status?session_id=cs_live_secret')};
 await check('Purchase value and currency come from verified live Stripe payment',async()=>{const r=await route.GET(req);assert.equal(r.body.purchaseEvent.value,57.5);assert.equal(r.body.purchaseEvent.currency,'USD');assert.match(r.body.purchaseEvent.id,/^purchase_[a-f0-9]{32}$/);assert.ok(!JSON.stringify(r.body.purchaseEvent).includes('cs_live'));});
 await check('Test, refunded, unpaid and unrecorded orders never produce purchase events',async()=>{live=false;assert.equal((await route.GET(req)).body.purchaseEvent,null);live=true;orderStatus='refunded';assert.equal((await route.GET(req)).body.purchaseEvent,null);orderStatus='paid';paid=false;assert.equal((await route.GET(req)).body.purchaseEvent,null);paid=true;found=false;assert.equal((await route.GET(req)).body.purchaseEvent,null);});
 console.log(`${passed} Meta readiness checks passed.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
