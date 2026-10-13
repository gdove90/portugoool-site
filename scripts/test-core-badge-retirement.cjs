const fs=require('fs'),assert=require('assert/strict'),ts=require('typescript'),vm=require('vm'),cp=require('child_process');
const {ID,retireCoreBadgeBaseline}=require('./retirement-baseline.cjs');
const baseline='34586c6fd8a05924b051bb72be3c570e75946478';
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const p=require('../src/lib/products.ts'),f=require('../src/lib/fulfillment.ts');
const normal=s=>s.replace(/\r\n/g,'\n');
(async()=>{
 const before=normal(cp.execFileSync('git',['show',baseline+':src/lib/products.ts'],{encoding:'utf8'}));
 assert.equal(normal(fs.readFileSync('src/lib/products.ts','utf8')),retireCoreBadgeBaseline(before));
 assert(!p.getProducts().some(x=>x.id===ID));assert.equal(p.getProductById(ID),undefined);assert.equal(p.getProductBySlug('goool-performance-tee'),undefined);
 const match=p.getProductById('80000000-0000-4000-8000-000000000006');assert(match&&match.isActive&&match.availableForSale);
 for(const color of ['Black','White','True Royal'])for(const size of ['S','M','L','XL','XXL'])assert(f.resolveApliiqSku(ID,color,size)?.sku);
 for(const file of ['src/lib/fulfillment.ts','src/lib/fulfillment-submit.ts','src/lib/orders-store.ts','src/lib/shipment.ts','src/lib/emails/order-confirmation.ts','src/lib/emails/shipment-notification.ts','src/app/api/stripe-webhook/route.ts','src/app/api/apliiq-fulfillment/route.ts','src/app/api/checkout/route.ts'])assert.equal(normal(fs.readFileSync(file,'utf8')),normal(cp.execFileSync('git',['show',baseline+':'+file],{encoding:'utf8'})),file);
 const source=fs.readFileSync('src/app/api/checkout/route.ts','utf8'),compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 let providerCalls=0;
 const context={exports:{},process:{env:{STRIPE_SECRET_KEY:'sk_live_fixture_not_a_key'}},require:n=>n==='next/server'?{NextResponse:{json:(body,init)=>({body,status:init?.status??200})}}:n==='stripe'?{default:class{constructor(){providerCalls++;throw Error('Provider must never be reached');}}}:n==='@/lib/migration-preview'?{MIGRATION_PREVIEW:false}:n==='@/lib/store-status'?{storeClosed:()=>false}:n==='@/lib/products'?p:n==='@/lib/types'?require('../src/lib/types.ts'):n==='@/lib/fulfillment'?f:{}};
 vm.runInNewContext(compiled,context);
 for(const color of ['Black','White','True Royal']){const r=await context.exports.POST({json:async()=>({items:[{productId:ID,size:'S',color,quantity:1,customName:null,customNumber:null}]}),headers:{get:()=>null}});assert.equal(r.status,400);assert(r.body.error.includes('no longer available'));}
 assert.equal(providerCalls,0);
 console.log('PASS retired product absent from active listings/detail lookup; forged checkout rejected in all three colors with store-open fixture before Stripe; Matchday and 15 legacy SKUs preserved; only two catalog flags change and nine operational/history files equal production. No network/database/provider calls.');
})().catch(e=>{console.error(e);process.exitCode=1;});
