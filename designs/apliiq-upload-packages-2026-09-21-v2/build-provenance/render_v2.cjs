const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sharp=require('C:/Users/gdove/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'../apliiq-upload-packages-2026-09-21-v2');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,x)=>fs.writeFileSync(p,typeof x==='string'?x:JSON.stringify(x,null,2)+'\n');
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const assets=read(path.join(root,'production-assets/ARTWORK-PROVENANCE.json'));
(async()=>{
 for(const a of Object.values(assets)){
   const svg=path.join(root,'production-assets',a.svg), png=svg.replace('.svg','.png');
   const physical=a.physical_size_in||[a.visible_width_in,a.visible_height_in];
   const expected=physical.map(n=>Math.round(n*600));
   const renderSource=fs.readFileSync(svg,'utf8').replace(/width="[^"]+in"/,`width="${expected[0]}"`).replace(/height="[^"]+in"/,`height="${expected[1]}"`);
   await sharp(Buffer.from(renderSource),{density:72}).png().withMetadata({density:600}).toFile(png);
   const m=await sharp(png).metadata(); a.png=path.basename(png);a.png_sha256=hash(png);a.svg_sha256=hash(svg);a.export_pixels=[m.width,m.height];a.export_ppi=600;a.note_export='Rasterized from newly authored SVG at 600ppi. Export sampling does not add detail to source-derived outlines.';
   if(m.width!==expected[0]||m.height!==expected[1])throw Error('Physical export size mismatch: '+a.svg);
 }
 write(path.join(root,'production-assets/ARTWORK-PROVENANCE.json'),assets);
 const index=read(path.join(root,'CATALOG-INDEX.json'));
 const cards=[];
 const styles=`*{box-sizing:border-box}body{margin:0;background:#f4f4f2;color:#121212;font:15px/1.5 Arial,sans-serif}main{max-width:1240px;margin:auto;padding:36px}h1{font-size:30px;line-height:1.15;margin:10px 0}h2{font-size:20px}.eyebrow{font-size:12px;letter-spacing:2px;font-weight:bold}.note{padding:14px 18px;background:#fff1cb;border-left:4px solid #bb7b00}.panels,.references{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:24px 0}.panel,.card{background:white;border:1px solid #ddd;border-radius:12px;padding:18px}.panel svg{width:100%;height:auto}.references img{width:100%;height:320px;object-fit:contain;background:#ecece9}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.card img{width:100%;height:240px;object-fit:contain;background:#ecece9}.card a,a{color:#173e60}.label{display:flex;gap:25px;align-items:center;background:#fff;padding:20px;border-radius:12px}.label img{width:160px;height:160px}.label p{max-width:700px}table{border-collapse:collapse;width:100%;background:white}td,th{border:1px solid #ddd;padding:10px;text-align:left;font-size:13px}@media(max-width:750px){main{padding:18px}.panels,.references,.grid{grid-template-columns:1fr}.label{display:block}}@media print{body{background:white}main{padding:0}.references img{height:180px}.panels{break-inside:avoid}a{color:inherit}}`;
 function panel(spec,face){
   const cap=spec.product.slug.includes('cap'),hood=spec.product.slug.includes('hoodie'),crew=spec.product.slug.includes('crewneck');
   const color=spec.product.website_color;const fill=({'White':'#fafafa','True Royal':'#2e48b6','Black':'#1b1b1b','Bone':'#ded7c6','Natural':'#e7e1ce','Ivory':'#eee8d8','Gray Heather':'#aaaead','Washed Black':'#373737','Washed Grey':'#858581','Black/Natural':'#c6bda7'})[color]||'#ddd';
   const a=spec.decoration.artwork.find(x=>x.face===face);const unit=16,cx=280,collar=100;
   let shape=cap?`<path d="M130 295Q130 95 280 88Q430 95 430 295Z" fill="${fill}" stroke="#777"/><path d="M130 295Q280 263 430 295L465 335Q280 368 95 335Z" fill="#252525" stroke="#777"/>`:
    `<path d="M${hood?205:210} 60L155 77L60 ${crew||hood?280:138}L${crew||hood?103:126} ${crew||hood?300:188}L145 153L145 475L415 475L415 153L${crew||hood?457:434} ${crew||hood?300:188}L500 ${crew||hood?280:138}L405 77L350 60Q${face==='front'?330:325} 100 280 ${face==='front'?100:89}Q230 100 210 60Z" fill="${fill}" stroke="#777" stroke-width="1.5"/>`;
   if(hood)shape+=`<path d="M210 70Q190 5 280 12Q370 5 350 70Q322 105 280 100Q238 105 210 70Z" fill="${fill}" stroke="#777"/><path d="M205 374L355 374L380 442L180 442Z" fill="none" stroke="#777"/>`;
   const grid=`<line x1="${cx}" y1="75" x2="${cx}" y2="480" stroke="#4d8097" stroke-dasharray="4 5"/><line x1="170" y1="${cap?295:collar}" x2="390" y2="${cap?295:collar}" stroke="#4d8097" stroke-dasharray="4 5"/>`;
   let mark='',measure='';
   if(a){
      const w=a.visible_width_in*unit,h=a.proportional_visible_height_in*unit;
      const mid=cx+a.horizontal_offset_wearer_left_in*unit;
      const x=mid-w/2, y=cap?295-a.vertical_offset_in*unit-h:collar+a.vertical_offset_in*unit;
      const pw=(a.canvas_width_in_for_target_visible_width||a.visible_width_in)*unit;
      let ph=h,dx=0;
      if(a.pixels){ph=pw*a.pixels[1]/a.pixels[0];dx=(a.alpha_bbox_px?.[0]||0)*pw/a.pixels[0]}
      const py=y-(a.visible_top_inset_in_at_target||0)*unit;
      const artpath=a.png_export_path||a.path;
      mark=`<image href="${esc(artpath)}" x="${x-dx}" y="${py}" width="${pw}" height="${ph}" preserveAspectRatio="none"/>`;
      measure=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#cd352b" stroke-width="1"/><path d="M${x} ${y+h+12}v7M${x} ${y+h+16}h${w}M${x+w} ${y+h+12}v7" fill="none" stroke="#cd352b"/><text x="${mid}" y="${y+h+34}" fill="#a12c23" font-size="13" text-anchor="middle">${a.visible_width_in.toFixed(2)} in visible width</text>`;
      const dimensionX=cap?465:450,anchorY=cap?295:collar,targetY=cap?y+h:y;
      measure+=`<path d="M${dimensionX-5} ${anchorY}h10M${dimensionX} ${anchorY}V${targetY}M${dimensionX-5} ${targetY}h10" stroke="#12627b" fill="none"/><text x="${dimensionX+12}" y="${(anchorY+targetY)/2}" font-size="12" fill="#12627b">${a.vertical_offset_in.toFixed(2)} in</text>`;
      if(a.horizontal_offset_wearer_left_in)measure+=`<path d="M${cx} ${y-13}H${mid}" stroke="#12627b"/><text x="${(cx+mid)/2}" y="${y-20}" text-anchor="middle" font-size="12" fill="#12627b">${a.horizontal_offset_wearer_left_in} in left</text>`;
   }else mark=`<text x="280" y="240" fill="${['Black','Washed Black','True Royal'].includes(color)?'#fff':'#222'}" font-size="20" text-anchor="middle">NO EXTERIOR ARTWORK</text>`;
   shape=shape.replace('280 89','280 100');
   measure=measure.replaceAll('<text ', '<text stroke="#ffffff" stroke-width="2.5" paint-order="stroke fill" ');
   return `<div class="panel"><h2>${face==='front'?'Front':'Back'}</h2><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 510" role="img" aria-label="${face} dimensioned schematic">${shape}${grid}${mark}${measure}<text x="280" y="504" font-size="12" text-anchor="middle" fill="#555">Schematic geometry only • dimensions govern</text></svg><p>${a?esc(a.horizontal_position)+'; '+a.vertical_offset_in+' in — '+esc(a.vertical_anchor):'Keep this exterior face blank.'}</p></div>`;
 }
 for(const e of index.packages){
   const b=path.join(root,path.dirname(e.spec)), sp=path.join(b,'spec.json'),spec=read(sp);
   for(const k of ['LABEL-1IN','LABEL-2IN']){const a=assets[k];fs.copyFileSync(path.join(root,'production-assets',a.png),path.join(b,'label/artwork',a.png));}
   write(path.join(b,'label/artwork/ARTWORK-PROVENANCE.json'),Object.fromEntries(['LABEL-1IN','LABEL-2IN'].map(k=>[k,assets[k]])));
   spec.label.flat_master_sha256=assets['LABEL-1IN'].svg_sha256;spec.label.flat_png_sha256=assets['LABEL-1IN'].png_sha256;
   for(const a of spec.decoration.artwork){
     if(a.asset_type==='source-derived_svg_outlines'){
       const k=spec.product.slug.includes('badge-tee')?'GA-CIRCLE-08-NAVY':'GA-CIRCLE-09-FOREST',asset=assets[k];
       fs.copyFileSync(path.join(root,'production-assets',asset.png),path.join(b,a.png_export_path));a.png_export_sha256=asset.png_sha256;a.png_export_pixels=asset.export_pixels;a.png_export_ppi=600;
       write(path.join(b,'artwork/ARTWORK-PROVENANCE.json'),asset);
     }
   }
   write(sp,spec);
   const name=esc(spec.product.name),col=esc(spec.product.website_color),refs=spec.mockup_references||[];
   const refhtml=refs.length?'<h2>Original mockup intent — concept references</h2><div class="references">'+refs.map(r=>`<div><img src="${esc(r.path)}" alt="Existing concept reference"><p>Concept reference; verify blank construction, color and print placement.</p></div>`).join('')+'</div>':'';
   const rows=spec.decoration.artwork.map(a=>`<tr><td>${a.face}</td><td>${a.visible_width_in.toFixed(3)} × ${a.proportional_visible_height_in.toFixed(3)} in<br>${a.width_mm.toFixed(2)} × ${a.height_mm.toFixed(2)} mm</td><td>${a.vertical_offset_in} in<br>${a.vertical_offset_mm.toFixed(2)} mm</td><td>${esc(a.dimension_status)}</td></tr>`).join('');
   const page=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${name} — ${col} proof</title><style>${styles}</style><main><div class="eyebrow">GOOOL / REVISION 2 / GARMENT EXECUTION</div><h1>${name}<br>${col}</h1><p>${esc(spec.garment.brand_model)} · Supplier color candidate: <strong>${esc(spec.garment.supplier_color_candidate)}</strong> · ${spec.product.website_sizes.join(' / ')}</p><div class="note"><strong>Prepared design target — supplier proof and physical sample still required.</strong> These diagrams establish print placement; they do not certify blank pattern, fit, color, label service or supplier availability. Wearer-left is viewer-right. Collar measurements begin at the bottom seam and end at the visible artwork, not its transparent canvas.</div><div class="panels">${panel(spec,'front')}${panel(spec,'back')}</div><table><tr><th>Face</th><th>Visible width × height</th><th>Anchor offset</th><th>Dimension basis</th></tr>${rows}</table><p>Method: ${esc(spec.decoration.method)}. Use <a href="spec.json">spec.json</a> for exact artwork files, pixel insets, tolerances and source hashes. Confirm each offered size's print area; record any scaling instead of silently changing width.</p><h2>Brand label — flat art now supplied</h2><div class="label"><img src="label/artwork/GOOOL-ATHLETICS-LABEL-1IN-FLAT.png" alt="GOOOL Athletics black label with white-red-white segmented underline"><div><p><strong>Nominal one-inch square.</strong> Enlarged preview. Three Os; white/red/white separated underline; ATHLETICS beneath. Full-color service and interior placement require approval on this blank. One-inch woven detail needs artist resolution. The two-inch comparison file is not an automatic size substitution.</p><a href="label/README.md">Label production requirements</a></div></div>${refhtml}<h2>Before a customer order</h2><p>Complete <a href="verification-record.json">supplier and per-size verification</a> and <a href="SAMPLE-ACCEPTANCE.json">physical sample acceptance</a>. Match the actual blank, art, print size, color, label and product photography. Keep sales/fulfillment gates until the recorded checks pass.</p></main></html>`;
   write(path.join(b,'PLACEMENT-PROOF.html'),page);
   cards.push(`<article class="card">${refs[0]?`<img src="packages/${e.package_id}/${refs[0].path}" alt="${name} concept">`:''}<h2>${name}</h2><p>${col} → ${esc(spec.garment.supplier_color_candidate)}<br>${esc(spec.garment.brand_model)}</p><a href="packages/${e.package_id}/PLACEMENT-PROOF.html">Open dimensions and front/back proof</a></article>`);
 }
 write(path.join(root,'CATALOG-PROOFS.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>GOOOL garment execution proofs</title><style>${styles}</style><main><div class="eyebrow">GOOOL ATHLETICS / MANUFACTURING HANDOFF</div><h1>14 colorways. One checked specification per garment.</h1><p>Revision 2 · 10 products · artwork, front/back measurements, label files and per-size verification.</p><div class="note">Local preparation complete. These are design targets and concept references, not manufactured samples. Supplier proofs, label compatibility and actual sample approval remain required before customer release.</div><div class="grid">${cards.join('')}</div></main></html>`);
 fs.copyFileSync(__filename,path.join(root,'build-provenance/render_v2.cjs'));
 console.log(JSON.stringify({assetsRendered:Object.keys(assets).length,proofSheets:index.packages.length}));
})();

