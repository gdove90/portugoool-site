import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'asset-manifest.json'),'utf8'));
const paths=[...manifest.flatMap(e=>e.gallery),'performance-concepts/athletics-performance-front.png','performance-concepts/training-line-performance-front.png'];
const seen=new Map(), results=[], errors=[];
for(const rel of paths){
 const p=path.resolve(root,rel);
 if(!p.startsWith(root+path.sep)){errors.push('Outside package: '+rel);continue;}
 if(!fs.existsSync(p)){errors.push('Missing: '+rel);continue;}
 const b=fs.readFileSync(p);
 if(b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'){errors.push('Invalid PNG: '+rel);continue;}
 const w=b.readUInt32BE(16),h=b.readUInt32BE(20),hash=crypto.createHash('sha256').update(b).digest('hex');
 if(seen.has(hash))errors.push('Duplicate image: '+rel+' and '+seen.get(hash));seen.set(hash,rel);
 if(w<1000||h<1000)errors.push('Low resolution: '+rel);
 results.push({path:rel,width:w,height:h,bytes:b.length,sha256:hash});
}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
 const rel=match[1];if(!rel.startsWith('http')&&!fs.existsSync(path.resolve(root,rel)))errors.push('Broken preview link: '+rel);
}
const report={generatedAt:new Date().toISOString(),products:new Set(manifest.map(e=>e.slug)).size,colorways:manifest.length,galleryImages:manifest.flatMap(e=>e.gallery).length,conceptImages:2,checked:results.length,errors,results};
fs.writeFileSync(path.join(root,'file-audit.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({products:report.products,colorways:report.colorways,checked:report.checked,errors},null,2));
if(errors.length)process.exitCode=1;

