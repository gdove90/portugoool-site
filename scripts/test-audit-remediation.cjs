// Read-only preservation checks against the audit's exact production baseline.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), cp = require('child_process');
const root = path.resolve(__dirname, '..');
const baseline = 'dc60d09b5471cd12a2a9a2661a87b95856b26e06';
const original = file => cp.execFileSync('git', ['show', `${baseline}:${file}`], {cwd:root,encoding:'utf8',maxBuffer:16*1024*1024}).replace(/\r\n/g,'\n');
const current = file => fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n');
const harness = current('scripts/test-launch-backend.cjs').split('(async()=>{')[0];
const {load} = new Function('require','__dirname',harness+';return {load};')(require,__dirname);
const loadSeo = () => load('src/lib/seo.ts', { '@/v84/catalog-data': {}, '@/v84/product-gallery-images': {} });
let passed = 0;
function check(name,fn){fn();passed++;console.log('PASS '+name);}
check('All product data, gallery definitions, imagery and approved brand assets remain unchanged',()=>{
 const protectedPaths=['public/products','public/v84','public/brand','src/components/GAMonogram.tsx','src/components/BrandWordmark.tsx','src/lib/products.ts','src/lib/types.ts','src/v84/catalog-data.ts','src/v84/product-gallery-images.ts','src/v84/Brand.tsx'];
 const changed=cp.execFileSync('git',['diff','--name-only',baseline,'--',...protectedPaths],{cwd:root,encoding:'utf8'}).trim();
 assert.equal(changed,'',changed);
});
check('Payment, fulfillment, email, customer records and intentional launch-gate logic are unchanged',()=>{
 const protectedPaths=['src/app/api','src/app/unsubscribe','src/lib/intake','src/lib/emails','src/lib/email.ts','src/lib/email-delivery.ts','src/lib/discount.ts','src/lib/signup-welcome.ts','src/lib/signups.ts','src/lib/orders-store.ts','src/lib/supabase.ts','src/lib/fulfillment.ts','src/lib/fulfillment-submit.ts','src/lib/shipping.ts','src/lib/gate.ts','src/lib/store-status.ts','src/lib/migration-preview.ts','src/lib/marketing-consent.ts','src/lib/meta-pixel.ts','src/middleware.ts','supabase'];
 assert.equal(cp.execFileSync('git',['diff','--name-only',baseline,'--',...protectedPaths],{cwd:root,encoding:'utf8'}).trim(),'');
});
check('Agreement versions and every company-name/consent source line are preserved',()=>{
 assert.equal(current('src/lib/intake/agreements.json'),original('src/lib/intake/agreements.json'));
 const files=cp.execFileSync('git',['ls-files','src'],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(f=>/\.(tsx?|jsx?|mjs|json)$/.test(f));
 const baselineFiles=new Set(cp.execFileSync('git',['ls-tree','-r','--name-only',baseline,'src'],{cwd:root,encoding:'utf8'}).trim().split('\n'));
 for(const file of files){const legalLines=text=>text.split('\n').filter(line=>/LLC|L\.L\.C\./i.test(line)).map(line=>file==='src/v84/Shell.tsx'?line.replace(/<(\/?)(h3)(?=[ >])/g,'<$1h2'):line);assert.deepEqual(legalLines(current(file)),baselineFiles.has(file)?legalLines(original(file)):[],file);}
});
check('Canonical fallback is the GOAL shop domain with no dependency on cutover or a missing variable',()=>{
 const previous={...process.env};
 try {
  delete process.env.NEXT_PUBLIC_SITE_URL; delete process.env.DOMAIN_CUTOVER_ENABLED;
  assert.equal(loadSeo().SITE_URL,'https://goalathletics.shop');
  process.env.NEXT_PUBLIC_SITE_URL='';
  assert.equal(loadSeo().SITE_URL,'https://goalathletics.shop');
  process.env.NEXT_PUBLIC_SITE_URL='https://goalathletics.shop/';
  assert.equal(loadSeo().SITE_URL,'https://goalathletics.shop');
 } finally { for(const key of ['NEXT_PUBLIC_SITE_URL','DOMAIN_CUTOVER_ENABLED']){if(previous[key]===undefined)delete process.env[key];else process.env[key]=previous[key];} }
});
console.log(`${passed} audit preservation checks passed. No provider calls or live mutations.`);
