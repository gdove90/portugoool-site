// Read-only HTTP checks. Synthetic nonexistent credentials only; never calls an ops action.
const assert = require('node:assert/strict');
const base = process.argv[2] || 'http://127.0.0.1:3997';
const preview = process.argv[3] === 'preview';
const baseline = process.argv[4];
if (baseline && !/^https:\/\/[a-f0-9]{24}--goool-shop\.netlify\.app$/.test(baseline)) throw new Error('Baseline must be an immutable GOAL deploy.');
const url = new URL(base);
if (!(url.protocol === 'http:' && ['127.0.0.1','localhost'].includes(url.hostname)) &&
    !['https://goalathletics.shop','https://deploy-preview-60--goool-shop.netlify.app'].includes(url.origin)) {
  throw new Error('HTTP checks are restricted to GOAL and loopback.');
}
let passed = 0;
async function check(name, run) { await run(); passed++; console.log('PASS ' + name); }
async function post(path, body) {
  return fetch(base + path, { method:'POST', headers:{'content-type':'application/json'},
    body:JSON.stringify(body), redirect:'manual', signal:AbortSignal.timeout(30000) });
}
(async()=>{
  await check('Tracking page is public without a preview cookie', async()=>{
    const response = await fetch(base+'/track-order', {redirect:'manual',signal:AbortSignal.timeout(30000)});
    assert.equal(response.status,200); assert.match(await response.text(),/Check your order status/);
  });
  await check('Both customer routes retain generic mismatch or immutable preview denial', async()=>{
    const body={reference:'GOOOL-00000000',email:'fixture-nonexistent@example.invalid'};
    for (const path of ['/api/track-order','/api/track-order-details']) {
      const response=await post(path,body);
      assert.equal(response.status,preview?503:404,path);
      const value=await response.json();
      assert.match(value.error,preview?/Design preview/:/No order matches that reference and email/);
      if(!preview && path.endsWith('details')) assert.match(response.headers.get('cache-control')||'',/no-store/);
    }
  });
  await check('Webhook and ops routes refuse unauthenticated work without gate redirects', async()=>{
    for(const path of ['/api/carrier-tracking-webhook','/api/carrier-tracking-ops']) {
      const response=await post(path,{});
      assert.ok([401,503].includes(response.status),path+': expected authentication refusal or disabled configuration');
      assert.equal(response.headers.get('location'),null); assert.ok((await response.json()).error);
    }
  });
  await check('Unrelated API and storefront gates retain their existing behavior', async()=>{
    const response=await post('/api/not-a-tracking-route',{});
    if(baseline){
      const original=await fetch(baseline+'/api/not-a-tracking-route',{method:'POST',headers:{'content-type':'application/json'},body:'{}',redirect:'manual',signal:AbortSignal.timeout(30000)});
      assert.equal(response.status,original.status);
      const [shop,oldShop]=await Promise.all([base,baseline].map(origin=>fetch(origin+'/shop',{redirect:'manual',signal:AbortSignal.timeout(30000)})));
      assert.equal(shop.status,oldShop.status);
      const location=response=>response.headers.get('location')?new URL(response.headers.get('location')).pathname+new URL(response.headers.get('location')).search:null;
      assert.equal(location(shop),location(oldShop));
      return;
    }
    assert.equal(response.status,preview?503:401);
    if(!preview){
      const shop=await fetch(base+'/shop',{redirect:'manual',signal:AbortSignal.timeout(30000)});
      assert.equal(shop.status,307); assert.match(shop.headers.get('location')||'',/\/gate\?/);
    }
  });
  console.log(`${passed} HTTP tracking checks passed (${preview?'immutable preview':'disabled tracking'}). No provider requests or real customer data.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
