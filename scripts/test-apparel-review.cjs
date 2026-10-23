const fs=require('fs'),path=require('path'),assert=require('assert/strict'),cp=require('child_process'),vm=require('vm'),ts=require('typescript'),sharp=require('sharp');
const data=require('../src/data/apparel-rebrand-review.json');
const root=path.resolve(__dirname,'../../..');
const normalize=s=>s.replace(/\r\n/g,'\n');
const protectedFiles=['src/lib/products.ts','src/lib/fulfillment.ts','src/lib/apliiq.ts','src/lib/email.ts','src/lib/email-delivery.ts','src/lib/welcome.ts','src/lib/discount.ts','src/middleware.ts','src/app/api/checkout/route.ts','src/app/api/stripe-webhook/route.ts','src/app/api/apliiq-fulfillment/route.ts'];
(async()=>{
 for(const f of protectedFiles)assert.equal(normalize(fs.readFileSync(f,'utf8')),normalize(cp.execFileSync('git',['show',data.baseline+':'+f],{encoding:'utf8'})),f);
 assert.equal(data.products.length,6);assert.equal(data.products.reduce((n,p)=>n+p.variants.length,0),16);
 for(const p of data.products)for(const v of p.variants){assert.equal(v.newDesignId,null);assert.equal(v.manufacturerApproval,false);assert.equal(v.legacyFulfillment.length,5);assert(v.legacyFulfillment.every(s=>s.sku&&s.apliiqProductId));}
 const source=fs.readFileSync('src/app/references/apparel/page.tsx','utf8');
 const compiled=ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 for(const preview of [false,true]){const c={exports:{},require:n=>n==='@/lib/migration-preview'?{MIGRATION_PREVIEW:preview}:n==='next/navigation'?{notFound(){throw Error('NOT_FOUND');}}:n==='@/data/apparel-rebrand-review.json'?data:n==='react/jsx-runtime'?{jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})}:{default:'img'}};vm.runInNewContext(compiled,c);if(preview)assert(c.exports.default());else assert.throws(()=>c.exports.default(),/NOT_FOUND/);}
 const front=fs.readFileSync('public/brand/apparel-review/Matchday-Front-White-Red-11IN-REVIEW.svg','utf8');
 const back=fs.readFileSync('public/brand/apparel-review/Matchday-Back-GA-White-2.5IN-REVIEW.svg','utf8');
 assert(front.includes('id="front-separator"')&&front.includes('#C1121F'));assert(!back.includes('front-separator'));
 for(const a of data.assets){const file=path.join('public/brand/apparel-review',a.name+'.png'),m=await sharp(file).metadata(),s=await sharp(file).stats();assert.equal(m.width,Math.round(a.widthIn*300));assert.equal(m.density,300);assert(m.hasAlpha);assert.equal(s.channels[3].min,0);assert.equal(s.channels[3].max,255);assert(fs.statSync(file).size<20*1024*1024);}
 console.log('PASS production guard, 6 listings/16 existing color combinations/80 preserved SKUs, 11 protected files, front-only bar, 8 transparent 300-PPI review exports. No supplier/network calls.');
})().catch(e=>{console.error(e);process.exitCode=1;});
