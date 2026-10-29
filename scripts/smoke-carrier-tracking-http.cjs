// Read-only HTTP checks. Synthetic nonexistent credentials only; never calls an ops action.
const assert = require('node:assert/strict');
const base = process.argv[2] || 'http://127.0.0.1:3997';
const preview = process.argv[3] === 'preview';
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
  await check('Webhook and ops routes refuse work with tracking disabled, without gate redirects', async()=>{
    for(const path of ['/api/carrier-tracking-webhook','/api/carrier-tracking-ops']) {
      const response=await post(path,{}); assert.equal(response.status,503,path);
      assert.equal(response.headers.get('location'),null); assert.ok((await response.json()).error);
    }
  });
  await check('Unrelated API and storefront gates retain their existing behavior', async()=>{
    const response=await post('/api/not-a-tracking-route',{});
    assert.equal(response.status,preview?503:401);
    if(!preview){
      const shop=await fetch(base+'/shop',{redirect:'manual',signal:AbortSignal.timeout(30000)});
      assert.equal(shop.status,307); assert.match(shop.headers.get('location')||'',/\/gate\?/);
    }
  });
  console.log(`${passed} HTTP tracking checks passed (${preview?'immutable preview':'disabled tracking'}). No provider requests or real customer data.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
