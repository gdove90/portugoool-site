const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const source=__dirname;
const project='C:/Users/gdove/OneDrive/Desktop/GOOOL';
const destination=path.join(project,'designs/27_product-backdrop-standard-2026-09-25');
const reports=JSON.parse(fs.readFileSync(path.join(source,'verification.json'),'utf8'));
for(const r of reports){
 if(r.changedProtectedInteriorPixels!==0||!r.losslessWebpVerified)throw Error('Image QA failed '+r.file);
 const p=path.join(project,'public/products',r.file+'.webp');
 const sha=crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
 if(sha!==r.sourceSha256)throw Error('Source changed since inspection: '+p);
}
if(fs.existsSync(destination))throw Error('Destination already exists; inspect before repeating installation');
fs.cpSync(source,destination,{recursive:true,errorOnExist:true});
for(const r of reports){
 const file=r.file+'.webp';
 fs.copyFileSync(path.join(source,'site-images',file),path.join(project,'public/products',file));
 const launch=path.join(project,'CORE-CAPSULE-LAUNCH-2026-09-25/04_core-hoodie-club-blue/site-images',file);
 if(fs.existsSync(launch))fs.copyFileSync(path.join(source,'site-images',file),launch);
}
const cssPath=path.join(project,'src/app/globals.css');
let css=fs.readFileSync(cssPath,'utf8');
if(!css.includes('--product-backdrop:')){
 css+='\n/* Shared catalog backdrop. Master specification: designs/27_product-backdrop-standard-2026-09-25. */\n:root {\n  --product-backdrop: #f2f2f2;\n}\n\n/* Outside Tailwind layers so legacy bg-studio/bg-smoke utilities cannot vary product tiles. */\n.product-media {\n  background-color: var(--product-backdrop);\n}\n';
 fs.writeFileSync(cssPath,css);
}
const readme=path.join(project,'designs/25_core-hoodie-remake-2026-09-24/site-imagery/README.md');
fs.appendFileSync(readme,'\n\n## Club Blue backdrop correction — 2026-09-25\n\nThe six Club Blue public images and their launch-package copies now use a uniform sRGB #F2F2F2 backdrop. Original garment pixels and framing are retained; source originals remain archived. The source imagery and masks for this background correction, lossless PNG/WebP outputs, pixel verification and future-upload specification are in `designs/27_product-backdrop-standard-2026-09-25/`. The FILES.json below this folder records the earlier imagery import; use the new correction package verification.json for the backdrop change. Red-band images have not been modified in this correction.\n');
for(const r of reports){
 const file=r.file+'.webp',a=fs.readFileSync(path.join(source,'site-images',file)),b=fs.readFileSync(path.join(project,'public/products',file));
 if(!a.equals(b))throw Error('Copy verification failed '+file);
}
console.log('Installed six images and matching launch copies; preserved originals and correction package at '+destination+'; added shared product backdrop CSS. Not deployed.');
