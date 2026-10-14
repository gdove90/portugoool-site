const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const Module = require('node:module');
const {execFileSync} = require('node:child_process');
const original = Module._resolveFilename;
Module._resolveFilename = function(name, parent, ...rest) {
  return original.call(this, name.startsWith('@/') ? path.resolve('src', name.slice(2)) : name, parent, ...rest);
};
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {NextRequest} = require('next/server');
const {middleware} = require('../src/middleware.ts');
const {gateToken,GATE_COOKIE} = require('../src/lib/gate.ts');
const {POST:preview} = require('../src/app/api/preview/route.ts');
const {POST:checkout} = require('../src/app/api/checkout/route.ts');
let count=0;
async function check(name, fn){await fn();count++;console.log('PASS '+name)}
const request=(p,host='goool.shop',cookie='',method='GET')=>new NextRequest(`https://${host}${p}`,{method,headers:{host,cookie}});
(async()=>{
delete process.env.STORE_OPEN;delete process.env.PREVIEW_KEY;
await check('default closure survives missing password',async()=>{for(const p of ['/','/shop','/men','/cart','/shop/a-product'])assert.equal((await middleware(request(p))).status,307);assert.equal((await preview(request('/api/preview','goool.shop','','POST'))).status,503)});
await check('all customer operations bypass closure on every legacy host',async()=>{for(const host of ['goool.shop','portugoool.com','www.portugoool.com','www.goool.shop'])for(const p of ['/contact','/support','/faq','/shipping-returns','/size-guide','/privacy','/terms','/refunds','/track-order','/success','/api/stripe-webhook','/api/apliiq-fulfillment','/api/fulfillment-ops','/api/intake/maintenance','/api/newsletter','/api/track-order','/api/order-status','/print/legacy.png','/unsubscribe/token']){const r=await middleware(request(p,host,'',p.startsWith('/api/')?'POST':'GET'));assert.equal(r.headers.get('x-middleware-next'),'1',host+p)}});
await check('direct checkout is refused while closed before credentials or input',async()=>assert.equal((await checkout(request('/api/checkout','goool.shop','','POST'))).status,503));
process.env.PREVIEW_KEY='local-test-only';
await check('legacy, wrong and absent cookies do not open catalog',async()=>{for(const cookie of ['', 'goool_preview=local-test-only',GATE_COOKIE+'=invalid'])assert.equal((await middleware(request('/shop','goool.shop',cookie))).status,307)});
await check('valid team cookie previews catalog but cannot buy',async()=>{const cookie=GATE_COOKIE+'='+await gateToken('local-test-only');assert.equal((await middleware(request('/shop','goool.shop',cookie))).status,200);assert.equal((await checkout(request('/api/checkout','goool.shop',cookie,'POST'))).status,503)});
await check('closure errors remain JSON for API clients',async()=>{const r=await middleware(request('/api/checkout'));assert.equal(r.status,401);assert.match(r.headers.get('content-type'),/json/)});
delete process.env.PREVIEW_KEY;process.env.STORE_OPEN='true';
await check('explicit reopening works independently of password',async()=>assert.equal((await middleware(request('/shop'))).headers.get('x-middleware-next'),'1'));
await check('canonical consumer redirects preserve path and query',async()=>{const r=await middleware(request('/contact-not-service?x=1','portugoool.com'));assert.equal(r.status,301);assert.equal(r.headers.get('location'),'https://goool.shop/contact-not-service?x=1')});
await check('product IDs, prices, fulfillment maps and callbacks preserved with only authorized retirement flags',()=>{for(const f of ['src/lib/products.ts','src/lib/fulfillment.ts','src/lib/apliiq.ts','src/app/api/stripe-webhook/route.ts','src/app/api/apliiq-fulfillment/route.ts','src/lib/email.ts'])assert.equal(require('./retirement-baseline.cjs').withoutHatAdditions(fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n')),(f === 'src/lib/products.ts' ? require('./retirement-baseline.cjs').applyRetirements(execFileSync('git',['show','24903a4:'+f],{encoding:'utf8'}).replace(/\r\n/g,'\n')) : execFileSync('git',['show','24903a4:'+f],{encoding:'utf8'}).replace(/\r\n/g,'\n')),f)});
await check('current lockups retain exact strike and visible divider',()=>{const s=fs.readFileSync('src/components/BrandLockup.tsx','utf8');for(const points of ['0,400 360.161617719,0 550.161617719,0 190,400','340,400 700.161617719,0 890.161617719,0 530,400'])assert.ok(s.includes(points));assert.match(s,/goal-lockup-divider/);assert.match(fs.readFileSync('src/v84/Brand.tsx','utf8'),/<GAMonogram/); assert.match(fs.readFileSync('src/v84/Brand.tsx','utf8'),/<BrandWordmark/)});
await check('cutover redirects consumers once while protecting machine and receipt routes',async()=>{process.env.DOMAIN_CUTOVER_ENABLED='true';for(const host of ['goool.shop','portugoool.com','www.goool.shop','www.goalathletics.shop']){const r=await middleware(request('/about?campaign=legacy',host));assert.equal(r.status,301);assert.equal(r.headers.get('location'),'https://goalathletics.shop/about?campaign=legacy');for(const p of ['/api/stripe-webhook','/api/apliiq-fulfillment','/print/legacy.png','/success','/track-order'])assert.equal((await middleware(request(p,host,'',p.startsWith('/api/')?'POST':'GET'))).headers.get('x-middleware-next'),'1');}delete process.env.DOMAIN_CUTOVER_ENABLED;});
await check('cutover canonicalizes help/legal GET and HEAD but never redirects POST callbacks',async()=>{
 process.env.DOMAIN_CUTOVER_ENABLED='true';
 for(const host of ['goool.shop','www.goool.shop','portugoool.com','www.portugoool.com']) {
  for(const method of ['GET','HEAD']) for(const p of ['/contact','/support','/faq','/shipping-returns','/terms','/privacy','/refunds','/sitemap.xml']) {
   const r=await middleware(request(p+'?source=legacy',host,'',method));
   assert.equal(r.status,301);assert.equal(r.headers.get('location'),'https://goalathletics.shop'+p+'?source=legacy');
  }
  for(const p of ['/api/stripe-webhook','/api/apliiq-fulfillment','/api/fulfillment-ops','/api/intake/maintenance','/.netlify/functions/deliver-emails','/.netlify/functions/intake-maintenance']) {
   const r=await middleware(request(p,host,'','POST'));assert.equal(r.headers.get('location'),null);assert.equal(r.headers.get('x-middleware-next'),'1');
  }
 }
 delete process.env.DOMAIN_CUTOVER_ENABLED;
 assert.ok(!/from\s*=\s*"https?:\/\//.test(fs.readFileSync('netlify.toml','utf8')),'blanket Netlify domain redirects would intercept callbacks');
});
console.log(`${count} migration suites passed.`);
})().catch(e=>{console.error(e);process.exitCode=1});
