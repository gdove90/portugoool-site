const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),React=require('react');
const {renderToStaticMarkup}=require('react-dom/server'),{createSourceLoader,root}=require('./fixtures/test-source-loader.cjs');
const load=createSourceLoader(),catalog=load('src/lib/products.ts'),guides=load('src/lib/size-guide.ts'),audience=load('src/v84/catalog-data.ts'),fits=load('src/lib/womens-fit.ts');
const sources=require('../docs/catalog/womens-fit-sizing-sources-20261107.json'),plain=x=>JSON.parse(JSON.stringify(x));
function component(file,overrides={}){
 const module={exports:{}},dependencies={react:React,'react/jsx-runtime':require('react/jsx-runtime'),'next/link':({href,children,...props})=>React.createElement('a',{href,...props},children),'@/lib/size-guide':guides,...overrides};
 const code=ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 new Function('require','module','exports',code)(name=>{assert.ok(name in dependencies,'Unexpected component dependency '+name);return dependencies[name]},module,module.exports);return module.exports.default;
}
const FitDetails=component('src/components/FitDetails.tsx'),SizeGuide=component('src/components/SizeGuide.tsx',{'./FitDetails':FitDetails});
const women=catalog.products.filter(p=>audience.audienceAssignments[p.id]?.includes('women'));
assert.equal(women.length,8);assert.deepEqual(plain(women.map(p=>p.id).sort()),sources.records.map(s=>s.productId).sort());
for(const source of sources.records){
 const product=women.find(p=>p.id===source.productId),guide=guides.sizeGuideFor(product.id),profile=fits.womensFitFor(product.id);
 assert.ok(guide&&profile,source.slug+' has chart and fit facts');
 assert.equal(product.slug,source.slug);assert.deepEqual(plain(product.sizes),source.sizes);assert.deepEqual(plain(product.sizes),['S','M','L','XL'],'Owner-approved women sizes only');
 assert.deepEqual(plain(guide.rows),source.rows,source.slug+' independently reviewed supplier measurements');
 assert.deepEqual(plain(guide.columns.map(c=>c.label)),source.columns,source.slug+' explicit measurement labels');
 assert.deepEqual(plain(profile.facts.map(f=>f.label)),sources.standard,source.slug+' common four-field standard');
 assert.ok(profile.facts.every(f=>f.value.length>20));assert.equal(product.fit,profile.summary);
 assert.ok(!/true to size/i.test(profile.summary+' '+profile.facts.map(f=>f.value).join(' ')),source.slug+' avoids blanket sizing promise');
 assert.ok(!/model.{0,30}(?:wears|height)|squat.proof|high.impact|compression grade/i.test(JSON.stringify(profile)),source.slug+' no inferred fit-trial claims');
 if(source.bodyRows){
  assert.deepEqual(plain(guide.bodyReference.rows),source.bodyRows,source.slug+' published body ranges');
  assert.deepEqual(plain(guide.bodyReference.columns.map(c=>c.label)),source.bodyColumns);
 }else assert.equal(guide.bodyReference,undefined,source.slug+' no inferred body-size conversion');
 if(source.toleranceCm)assert.equal(guides.formatMeasurement(guide.toleranceIn,'cm'),String(source.toleranceCm));
 const html=renderToStaticMarkup(React.createElement(SizeGuide,{productId:product.id}));
 assert.equal((html.match(/<table/g)||[]).length,source.bodyRows?2:1,source.slug+' separate body and garment tables');
 assert.equal((html.match(/<dl/g)||[]).length,1);
 for(const label of sources.standard)assert.ok(html.includes(label.replace('&','&amp;')),source.slug+' '+label);
 assert.ok(html.includes('flat, unstretched garment measurements')&&html.includes('edge to edge'));
 assert.ok(!/href="https?:|tapstitch|apliiq|sanmar|bellacanvas|supplier|WT0092|WB0025/i.test(html),source.slug+' customer-facing copy only');
 assert.equal((html.match(/aria-pressed=/g)||[]).length,2);
 assert.deepEqual(plain(guide.rows.map(r=>r.size)),source.sizes,source.slug+' each offered size has one row');
}
const bra=guides.sizeGuideFor('80000000-0000-4000-8000-000000000025');
assert.equal(bra.columns[1].label,'Underbust, flat');assert.ok(!bra.columns.some(c=>c.label==='Waist, flat'));
const leggings=guides.sizeGuideFor('80000000-0000-4000-8000-000000000026');
assert.equal(leggings.columns.at(-1).label,'Full length');assert.equal(leggings.columns.at(-1).method,'waistband to hem');
const shorts=guides.sizeGuideFor('80000000-0000-4000-8000-000000000022');
assert.deepEqual(plain(shorts.rows.map(r=>r.values.at(-1))),[3.5,3.5,3.75,3.75]);
const hoodie=guides.sizeGuideFor('80000000-0000-4000-8000-000000000020');
assert.ok(!hoodie.columns.some(c=>/sleeve/i.test(c.label)),'Unpublished hoodie sleeves are omitted');
assert.equal(guides.formatMeasurement(4.25,'cm'),'10.8');assert.equal(guides.formatMeasurement(12.20,'cm'),'31');
assert.equal(guides.formatMeasurement([37,38],'cm'),'94–96.5');
let unit='in';
const InteractiveGuide=component('src/components/SizeGuide.tsx',{'./FitDetails':FitDetails,react:{...React,useState:()=>[unit,next=>{unit=next}],useId:()=> 'women-units'}});
const elements=tree=>!tree||typeof tree!=='object'?[]:[tree,...React.Children.toArray(tree.props?.children).flatMap(elements)];
let tree=InteractiveGuide({productId:'80000000-0000-4000-8000-000000000022'});
const cm=elements(tree).find(e=>e.type==='button'&&e.props.children==='Centimeters');assert.ok(cm);cm.props.onClick();
const cmHtml=renderToStaticMarkup(React.createElement(InteractiveGuide,{productId:'80000000-0000-4000-8000-000000000022'}));
assert.ok(cmHtml.includes('<td>9.5</td>'),'Garment inseam switches to centimeters');
assert.ok(cmHtml.includes('<td>111.8–116.8</td>'),'Body hip range switches with the same unit control');
const pdp=fs.readFileSync(path.join(root,'src/v84/ProductDetail.tsx'),'utf8');
assert.ok(pdp.includes('<FitDetails facts={fitProfile?.facts} fallbackFit={product.fit}/>'));
assert.ok(pdp.includes('product.fitNote || fitProfile?.summary'),'Fit summary is visible by size selection');
console.log('PASS eight women styles: independent source measurements, four common fit labels, offered-size coverage, underbust/hips/shoulders/sleeves, graded shorts inseams, distinct body and garment tables, shared unit switching, supplier-free copy and no invented fit claims.');

