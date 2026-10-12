// Read-only catalog projection. Never mutates supplier products or order mappings.
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),vm=require('node:vm'),cp=require('node:child_process');
const cache={};function load(file){file=path.resolve(file);if(cache[file])return cache[file];const exports={};cache[file]=exports;const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;vm.runInNewContext(code,{exports,require:n=>load(path.resolve(path.dirname(file),n+'.ts'))});return exports;}
const {products}=load('src/lib/products.ts');const {resolveApliiqSku}=load('src/lib/fulfillment.ts');
const old=JSON.parse(cp.execFileSync('git',['show','24903a4:designs/11_fulfillment/apliiq-reconciliation.json'],{encoding:'utf8'}));
const blanks=new Map(old.rows.map(x=>[x.saved_design_id,x.blank]));
const output=process.argv[2]||'docs/migration/catalog-inventory.json';
const rows=[];
for(const p of products)for(const v of p.colorVariants?.length?p.colorVariants:[{name:p.color,images:p.images}])for(const size of p.sizes){
const match=resolveApliiqSku(p.id,v.name,size);
let blank=blanks.get(match?.apliiqProductId)||'UNVERIFIED — supplier record required';
if(/hoodie/i.test(p.name)&&match)blank='Independent IND4000 (source mapping comments)';
if(/terrace/i.test(p.name)&&match)blank='Bella+Canvas 3010 (source mapping comments)';
rows.push({productId:p.id,legacyName:p.name,slug:p.slug,color:v.name,size,priceUSD:p.priceCents/100,isActive:p.isActive,availableForSale:p.availableForSale??false,supplier:p.supplierType,blank,apliiqDesignId:match?.apliiqProductId??null,fulfillmentSKU:match?.sku??null,fabric:p.fabric||'',decoration:'UNVERIFIED — supplier placement export required',artworkId:null,printDimensions:null,newDesignId:null,manufacturerApproval:'HOLD — no new GOAL manufacturing release',legacyImages:(v.images||p.images).map(i=>i.src).join(' | '),source:'src/lib/products.ts + src/lib/fulfillment.ts at 24903a4',proposedDivision:/polyester|performance/i.test(p.fabric||'')?'GOAL Athletics':'The Goal Collective — proposed',approvalNeeded:'Exact new art; placement dimensions; vendor proof; physical sample; live account reconciliation'});
}
const result={generatedAt:new Date().toISOString(),baseline:'24903a4ae6ea63c22bf5b34d9169dc4a4762e9ca',scope:'All repository products and catalog size/color combinations; live supplier data must be reconciled separately.',totals:{products:products.length,activeProducts:products.filter(p=>p.isActive).length,variants:rows.length,mappedVariants:rows.filter(r=>r.fulfillmentSKU).length,designs:new Set(rows.map(r=>r.apliiqDesignId).filter(Boolean)).size},rows};
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(result,null,2));console.log(result.totals);
