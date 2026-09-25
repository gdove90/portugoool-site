const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('C:/Users/gdove/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = __dirname;
const repo = 'C:/Users/gdove/OneDrive/Desktop/GOOOL';
const artRoot = path.join(repo, 'designs/26_modern-sport-print-rebuild-2026-09-25/exports');
const plates = require('./plates.json');
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const smooth = v => { v=Math.min(1,Math.max(0,v));return v*v*(3-2*v); };
(async()=>{
  for (const dir of ['originals','imagegen-plates','finals','proofs']) fs.mkdirSync(path.join(root,dir),{recursive:true});
  const records=[]; const proofPanels=[];
  for (const rec of plates) {
    const back=rec.file.includes('BACK'),royal=rec.file.includes('ROYAL');
    const original=fs.readFileSync(path.join(repo,'public/products',rec.file));
    fs.writeFileSync(path.join(root,'originals',rec.file),original);
    fs.copyFileSync(rec.path,path.join(root,'imagegen-plates',rec.file));
    const {data:old,info}=await sharp(original).removeAlpha().raw().toBuffer({resolveWithObject:true});
    const plate=await sharp(rec.path).resize(info.width,info.height,{fit:'fill'}).removeAlpha().raw().toBuffer();
    const roi=back?{left:398,top:507,width:324,height:155}:{left:380,top:382,width:364,height:166};
    const offsets=[0,0,0];let count=0;
    for(let y=0;y<roi.height;y++)for(let x=0;x<roi.width;x++) {
      const d=Math.min(x,y,roi.width-1-x,roi.height-1-y);
      if(d>=4&&d<14){const p=((y+roi.top)*info.width+x+roi.left)*3;for(let c=0;c<3;c++)offsets[c]+=old[p+c]-plate[p+c];count++;}
    }
    offsets.forEach((v,c)=>offsets[c]=v/count);
    const base=Buffer.from(old);
    for(let y=0;y<roi.height;y++)for(let x=0;x<roi.width;x++) {
      const a=smooth(Math.min(x,y,roi.width-1-x,roi.height-1-y)/22);
      const p=((y+roi.top)*info.width+x+roi.left)*3;
      for(let c=0;c<3;c++)base[p+c]=Math.round(old[p+c]*(1-a)+Math.max(0,Math.min(255,plate[p+c]+offsets[c]))*a);
    }
    const placement=back?{left:430,top:royal?538:537,width:259,height:91}:{left:royal?413:412,top:414,width:royal?297:299,height:royal?100:101};
    const artFile=back?'GA-01-B_v3_1950px_600ppi.png':'GA-01-F_v3_3300px.png';
    const art=await sharp(path.join(artRoot,artFile)).resize(placement.width,placement.height,{fit:'fill',kernel:'lanczos3'}).toBuffer();
    const png=await sharp(base,{raw:{width:info.width,height:info.height,channels:3}}).composite([{input:art,left:placement.left,top:placement.top}]).removeAlpha().png({compressionLevel:9}).toBuffer();
    fs.writeFileSync(path.join(root,'finals',rec.file),png);
    const out=await sharp(png).removeAlpha().raw().toBuffer();
    let outsideChanged=0,unchangedBackground=0;
    for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
      const p=(y*info.width+x)*3, inside=x>=roi.left&&x<roi.left+roi.width&&y>=roi.top&&y<roi.top+roi.height;
      if(!inside&&(old[p]!==out[p]||old[p+1]!==out[p+1]||old[p+2]!==out[p+2]))outsideChanged++;
      if(old[p]===242&&old[p+1]===242&&old[p+2]===242&&out[p]===242&&out[p+1]===242&&out[p+2]===242)unchangedBackground++;
    }
    if(outsideChanged)throw Error('Pixel preservation failed: '+rec.file);
    const crop={left:roi.left,top:roi.top,width:roi.width,height:roi.height};
    const before=await sharp(original).extract(crop).resize(728,332,{fit:'contain',background:'#F2F2F2'}).png().toBuffer();
    const after=await sharp(png).extract(crop).resize(728,332,{fit:'contain',background:'#F2F2F2'}).png().toBuffer();
    const panel=await sharp({create:{width:1456,height:372,channels:3,background:'#F2F2F2'}}).composite([{input:before,left:0,top:40},{input:after,left:728,top:40},{input:Buffer.from(`<svg width="1456" height="40"><text x="15" y="28" font-family="Arial" font-size="22">BEFORE — ${royal?'True Royal':'Black'} ${back?'back':'front'}</text><text x="743" y="28" font-family="Arial" font-size="22">AFTER — exact production art</text></svg>`),left:0,top:0}]).png().toBuffer();
    proofPanels.push({input:panel,left:0,top:(records.length)*372});
    records.push({file:rec.file,dimensions:[info.width,info.height],originalSha256:hash(original),finalSha256:hash(png),productionArt:artFile,productionArtSha256:hash(fs.readFileSync(path.join(artRoot,artFile))),patch:roi,placement,plateColorOffset:offsets,outsidePatchChangedPixels:outsideChanged,preservedExactF2F2F2Pixels:unchangedBackground});
  }
  await sharp({create:{width:1456,height:1488,channels:3,background:'#F2F2F2'}}).composite(proofPanels).png().toFile(path.join(root,'proofs/lettering-before-after.png'));
  fs.writeFileSync(path.join(root,'render-verification.json'),JSON.stringify({date:'2026-09-25',background:'#F2F2F2',method:'ImageGen blank fabric cleanup restricted to print rectangles; original pixels outside rectangles retained exactly; existing production masters reapplied with alpha-aware Lanczos resizing.',records},null,2));
  console.log(JSON.stringify(records.map(r=>({file:r.file,outsidePatchChangedPixels:r.outsidePatchChangedPixels,backgroundPixels:r.preservedExactF2F2F2Pixels})),null,2));
})();
