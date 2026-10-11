// Pure catalog/metadata regression checks. No network, credentials or orders.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),cache=new Map();
function load(file){
 if(!path.extname(file))file+=fs.existsSync(file+'.ts')?'.ts':'.js';
 if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));
 if(cache.has(file))return cache.get(file);
 const exports={};cache.set(file,exports);
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 vm.runInNewContext(code,{exports,URL,Map,process:{env:{}},require:name=>load(name.startsWith('@/')?root+'/src/'+name.slice(2):path.resolve(path.dirname(file),name))});return exports;
}
let passed=0;function check(name,run){run();passed++;console.log('PASS '+name);}
const products=load(root+'/src/lib/products.ts').getProducts(),seo=load(root+'/src/lib/seo.ts'),catalog=load(root+'/src/v84/catalog-data.ts'),gallery=load(root+'/src/v84/product-gallery-images.ts'),fulfillment=load(root+'/src/lib/fulfillment.ts');
const variants=s=>s.hasVariant||[s];let count=0;const skus=new Set();
check('every active product variant matches the approved price, SKU, color, size and gallery',()=>{
 assert.equal(products.length,9);
 for(const p of products){
  const s=seo.productJsonLd(p),entries=variants(s);assert.equal(s.name,p.name);
  assert.equal(entries.length,(p.colorVariants?.length||1)*p.sizes.length);
  assert.equal(s.image[0],seo.absolute(gallery.productGalleryImages(p,catalog.defaultVariant(p)?.index||0)[0].src));
  for(const v of entries){count++;const u=new URL(v.url),size=u.searchParams.get('size')||p.sizes[0],color=u.searchParams.get('color')||p.colorVariants?.[0]?.name||p.color;
   assert.equal(u.pathname,'/shop/'+p.slug);assert.ok(p.sizes.includes(size));assert.equal(v.color,color);
   const index=p.colorVariants?.findIndex(c=>c.name===color)||0;
   assert.equal(v.image[0],seo.absolute(gallery.productGalleryImages(p,index)[0].src));
   assert.equal(v.sku,fulfillment.resolveApliiqSku(p.id,color,size)?.sku);assert.ok(v.sku);assert.ok(!skus.has(v.sku));skus.add(v.sku);
   assert.equal(v.offers.price,(p.priceCents/100).toFixed(2));assert.equal(v.offers.priceCurrency,'USD');assert.equal(v.offers.availability,'https://schema.org/InStock');assert.equal(v.offers.url,v.url);
   assert.equal(v.gtin,undefined);assert.equal(v.aggregateRating,undefined);assert.equal(v.review,undefined);
   for(const shipping of v.offers.shippingDetails)assert.equal(shipping.shippingRate.value,p.priceCents>=7000?'0.00':'6.95');
   assert.equal(v.offers.hasMerchantReturnPolicy.returnPolicyCategory,'https://schema.org/MerchantReturnNotPermitted');
  }
 }
});
check('sale, sold-out, inactive and coming-soon states never emit purchasable offers',()=>{
 const p=products[0];
 for(const change of [{availableForSale:false},{dropLimit:1,dropSoldCount:1},{isActive:false}])assert.ok(variants(seo.productJsonLd({...p,...change})).every(v=>v.offers.availability==='https://schema.org/OutOfStock'));
 const gated=seo.productJsonLd({...p,colorVariants:p.colorVariants.map((v,i)=>({...v,comingSoon:i===0}))});
 assert.equal(gated.hasVariant[0].offers.availability,'https://schema.org/OutOfStock');assert.equal(gated.hasVariant.at(-1).offers.availability,'https://schema.org/InStock');
 assert.ok(variants(seo.productJsonLd({...p,priceCents:0})).every(v=>v.offers===undefined));
});
check('public sitemap excludes private, retired and gated internal routes without invented dates',()=>{
 const rows=load(root+'/src/app/sitemap.ts').default();assert.equal(rows.length,26);assert.equal(new Set(rows.map(r=>r.url)).size,26);
 for(const row of rows){assert.ok(row.url.startsWith('https://goool.shop/'));assert.equal(row.lastModified,undefined);assert.ok(!/\/(cart|success|gate|admin|api|print)(\/|$)/.test(new URL(row.url).pathname));}
 assert.equal(load(root+'/src/lib/collection-launch.ts').TEMPO_COLLECTION_COMING_SOON,true);
 const robots=load(root+'/src/app/robots.ts').default();assert.ok(!robots.rules[0].disallow.includes('/cart'));assert.ok(robots.rules[0].disallow.includes('/success'));
 for(const name of ['cart','success'])assert.match(fs.readFileSync(root+'/src/app/'+name+'/layout.tsx','utf8'),/index: false/);
});
check('canonical and social metadata are page-specific and JSON-LD escapes embedded markup',()=>{
 const m=load(root+'/src/lib/page-metadata.ts').pageMetadata('/about','Our World','Approved description');
 assert.equal(m.alternates.canonical,'/about');assert.equal(m.openGraph.url,'/about');assert.equal(m.twitter.description,'Approved description');assert.equal(m.openGraph.title,'Our World · GOOOL');
 assert.ok(!seo.jsonLdScript({name:'</script>'}).__html.includes('<'));
 const org=seo.organizationJsonLd()['@graph'];assert.equal(org[0].name,'GOOOL Athletics');assert.equal(org[0].logo,'https://goool.shop/brand/goool-wordmark-ink.png');assert.equal(org[0].address,undefined);assert.equal(org[1].potentialAction,undefined);
});
console.log(`${passed} SEO checks passed; ${products.length} products, ${count} exact fulfillment variants.`);
