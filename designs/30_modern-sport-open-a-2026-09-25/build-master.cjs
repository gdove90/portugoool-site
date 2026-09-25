const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sharp=require('C:/Users/gdove/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const repo='C:/Users/gdove/OneDrive/Desktop/GOOOL',root=__dirname;
const source=path.join(repo,'designs/26_modern-sport-print-rebuild-2026-09-25/exports/GA-01-B_v3_1950px_600ppi.png');
(async()=>{
 fs.mkdirSync(path.join(root,'exports'),{recursive:true}); fs.mkdirSync(path.join(root,'proofs'),{recursive:true});
 const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const rows=[];for(let y=0;y<info.height;y++){let ink=false;for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>127){ink=true;break;}if(ink)rows.push(y);}
 const bands=[];for(const y of rows){if(!bands.length||y>bands.at(-1).at(-1)+1)bands.push([]);bands.at(-1).push(y);}
 const bottom=bands.at(-1),y0=bottom[0],height=bottom.length;
 const cols=[];for(let x=0;x<info.width;x++){let ink=false;for(let y=y0;y<info.height;y++)if(data[(y*info.width+x)*4+3]>127){ink=true;break;}if(ink)cols.push(x);}
 const glyphCols=[];for(const x of cols){if(!glyphCols.length||x>glyphCols.at(-1).at(-1)+1)glyphCols.push([]);glyphCols.at(-1).push(x);}
 if(glyphCols.length!==9)throw Error('Expected 9 ATHLETICS glyphs');
 const ppmm=600/25.4,capMm=10.8,cap=Math.round(capMm*ppmm),wmHeight=bands[0].length,gap=Math.round(5*ppmm),outH=wmHeight+gap+cap;
 const A=`<svg xmlns="http://www.w3.org/2000/svg" width="10.2mm" height="10.8mm" viewBox="0 0 10.2 10.8"><path d="M1.25 9.55 L5.1 1.25 L8.95 9.55 M2.3 7.4 L7.9 7.4" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
 fs.writeFileSync(path.join(root,'exports/A-open-counter.svg'),A);
 const aWidth=Math.round(10.2*ppmm);
 const pieces=[{letter:'A',width:aWidth,png:await sharp(Buffer.from(A),{density:600}).resize(aWidth,cap,{fit:'fill'}).png().toBuffer()}];
 const vectorPaths={
  T:'M1.4 1.4 H6.77 M4.085 1.4 V9.4',
  H:'M1.4 1.4 V9.4 M6.77 1.4 V9.4 M1.4 5.4 H6.77',
  L:'M1.4 1.4 V9.4 H6.18',
  E:'M6.22 1.4 H1.4 V9.4 H6.22 M1.4 5.4 H5.45',
  I:'M1.5 1.5 V9.3',
  C:'M6.48 2.0 C5.7 1.5 5.2 1.4 4.2 1.4 C2.1 1.4 1.4 2.5 1.4 5.4 C1.4 8.3 2.1 9.4 4.2 9.4 C5.2 9.4 5.7 9.3 6.48 8.8',
  S:'M6.77 1.9 C5.9 1.4 5.2 1.4 4.1 1.4 C2.4 1.4 1.4 2.2 1.4 3.3 C1.4 4.6 2.7 5.0 4.1 5.4 C5.8 5.8 6.77 6.4 6.77 7.6 C6.77 8.8 5.6 9.4 4.1 9.4 C2.8 9.4 2.1 9.1 1.4 8.6'
 };
 const widthsMm={T:8.17,H:8.17,L:7.58,E:7.62,I:3,C:7.88,S:8.17};
 for(let i=1;i<9;i++){
  const L='ATHLETICS'[i],w=widthsMm[L],tw=Math.round(w*ppmm);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="10.8mm" viewBox="0 0 ${w} 10.8"><path d="${vectorPaths[L]}" fill="none" stroke="white" stroke-width="${L==='I'?3:2.8}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  fs.writeFileSync(path.join(root,'exports',L+'-glyph.svg'),svg);
  pieces.push({letter:L,width:tw,png:await sharp(Buffer.from(svg),{density:600}).resize(tw,cap,{fit:'fill'}).png().toBuffer()});
 }
 const targetW=Math.round(80*ppmm),letterGap=(targetW-pieces.reduce((s,p)=>s+p.width,0))/8;
 if(letterGap<20)throw Error('Letter spacing too narrow');
 let x=(1950-targetW)/2;const overlays=[];const boxes=[];
 const wm=await sharp(source).extract({left:0,top:0,width:1950,height:wmHeight}).png().toBuffer();
 overlays.push({input:wm,left:0,top:0});
 for(const p of pieces){const left=Math.round(x);overlays.push({input:p.png,left,top:wmHeight+gap});boxes.push({letter:p.letter,left,top:wmHeight+gap,width:p.width,height:cap});x+=p.width+letterGap;}
 const rgba=await sharp({create:{width:1950,height:outH,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite(overlays).raw().toBuffer();
 for(let p=0;p<rgba.length;p+=4){const a=rgba[p+3]>=128?255:0;rgba[p]=rgba[p+1]=rgba[p+2]=rgba[p+3]=a;}
 const out=path.join(root,'exports/GA-01-B_v5_OPEN-A_1950px_600ppi.png');
 await sharp(rgba,{raw:{width:1950,height:outH,channels:4}}).png({compressionLevel:9}).withMetadata({density:600}).toFile(out);
 await sharp(out).flatten({background:'#373737'}).png().toFile(path.join(root,'proofs/print-master-on-dark.png'));
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="82.55mm" height="${outH/ppmm}mm" viewBox="0 0 1950 ${outH}">${overlays.map((o,i)=>`<image x="${o.left}" y="${o.top}" width="${i===0?1950:boxes[i-1].width}" height="${i===0?wmHeight:cap}" xlink:href="data:image/png;base64,${o.input.toString('base64')}"/>`).join('')}</svg>`;
 fs.writeFileSync(path.join(root,'exports/GA-01-B_v5-layout.svg'),svg);
 const record={source,sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),file:path.basename(out),widthIn:3.25,widthMm:82.55,heightIn:outH/600,heightMm:outH/ppmm,pixels:[1950,outH],dpi:600,athleticsCapHeightMm:cap/ppmm,previousCapHeightMm:height/ppmm,capIncreasePercent:100*(cap/height-1),athleticsWidthMm:targetW/ppmm,letterGapMm:letterGap/ppmm,aNominalStrokeMm:2.5,boxes,sha256:crypto.createHash('sha256').update(fs.readFileSync(out)).digest('hex'),supplierStatus:'Prepared revision; not uploaded to Apliiq. Preserve native aspect ratio.'};
 fs.writeFileSync(path.join(root,'master-spec.json'),JSON.stringify(record,null,2));console.log(JSON.stringify(record,null,2));
})();
