const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sharp=require('C:/Users/gdove/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const {largest,fillHoles,nearestSeeds,contourRefine}=require('./mask-utils.cjs');
const root='C:/Users/gdove/OneDrive/Desktop/GOOOL',out=__dirname;
const inventory=require('./inventory.json'),guides=require('./all-guides.json');
for(const d of ['originals','masters','site-images','masks','mask-guides','reports'])fs.mkdirSync(path.join(out,d),{recursive:true});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
const selected=process.argv.slice(2);
for(const item of inventory){
 if(selected.length&&!selected.includes(item.id))continue;
 const file=path.basename(item.src),stem=path.parse(file).name,archived=path.join(out,'originals',file),live=path.join(root,'public',item.src);
 if(!fs.existsSync(archived)){if(hash(fs.readFileSync(live))!==item.sha256)throw Error('Source changed since inventory '+file);fs.copyFileSync(live,archived);}
 if(item.alreadyStandard){fs.copyFileSync(archived,path.join(out,'site-images',file));continue;}
 const {data:rgb,info}=await sharp(archived).removeAlpha().raw().toBuffer({resolveWithObject:true}),w=info.width,h=info.height,n=w*h;
 const guide=guides[/CAP_BACK/.test(file)?'34':/CAP_FRONT/.test(file)?'27':item.id];
 fs.copyFileSync(guide,path.join(out,'mask-guides',stem+'.png'));
 const guideData=await sharp(guide).resize(w,h,{fit:'fill'}).removeAlpha().greyscale().raw().toBuffer();
 let mask=Uint8Array.from(guideData,v=>v>120?1:0);
 const detail=['30','32'].includes(item.id);
 if(detail){for(let x=0;x<w;x++){let first=-1;for(let y=100;y<h;y++){if(mask[y*w+x]){first=y;break;}}if(first<0)throw Error('No detail boundary '+x);for(let y=first;y<h;y++)mask[y*w+x]=1;}}
 mask=fillHoles(largest(mask,w,h),w,h);
 let smooth;
 if(/BONE|NATURAL/.test(file)){
  const F=nearestSeeds(mask,w,h);
  mask=fillHoles(largest(Uint8Array.from(mask,(v,i)=>(v||F.dist[i]<24)&&(rgb[i*3]-rgb[i*3+2]>=6)?1:0),w,h),w,h);
  smooth=await contourRefine(mask,rgb,w,h,3,'warm');
 }else {
  if(false&&/CAP_FRONT/.test(file)){
   // Remove detached floor shadow from guide under dark brim; preserve crown.
   const F=nearestSeeds(mask,w,h);
   mask=fillHoles(largest(Uint8Array.from(mask,(v,i)=>{
    const y=Math.floor(i/w),lum=(rgb[i*3]+rgb[i*3+1]+rgb[i*3+2])/3;
    return y>h*.58?(v||F.dist[i]<24)&&lum<100?1:0:v;
   }),w,h),w,h);
  }
  smooth=await contourRefine(mask,rgb,w,h,/CAP/.test(file)?3:18,(/CAP/.test(file)?'warm':/WHITE|ROYAL_BACK_DETAIL/.test(file)?'absolute':'luminance'));
 }
 if(detail){
  const blur=await sharp(rgb,{raw:{width:w,height:h,channels:3}}).blur(1).raw().toBuffer();
  const lum=(x,y)=>(blur[(y*w+x)*3]+blur[(y*w+x)*3+1]+blur[(y*w+x)*3+2])/3;
  const edge=[];
  for(let x=0;x<w;x++){let first=-1;for(let y=0;y<h;y++)if(mask[y*w+x]){first=y;break;}let best=first,score=-Infinity;for(let y=first-18;y<=first+18;y++){const s=Math.abs(lum(x,y+2)-lum(x,y-2))-.2*Math.abs(y-first);if(s>score){score=s;best=y;}}edge.push(best);}
  const med=edge.map((v,x)=>{const a=edge.slice(Math.max(0,x-3),Math.min(w,x+4)).sort((a,b)=>a-b);return a[Math.floor(a.length/2)];});
  const p=med.map((y,x)=>`${x},${y}`).join(' L');
  const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="black"/><path d="M0,${h} L${p} L${w},${med[w-1]} L${w},${h} Z" fill="white"/></svg>`);
  smooth=await sharp(svg).removeAlpha().greyscale().raw().toBuffer();
 }
 if(/CAP_BACK/.test(file)){
  // The source back views are byte-identical. Trace only the visible floor
  // strip between interior crown fabric and the upper edge of the strap.
  const blur=await sharp(rgb,{raw:{width:w,height:h,channels:3}}).blur(1).raw().toBuffer();
  const lum=(x,y)=>(blur[(y*w+x)*3]+blur[(y*w+x)*3+1]+blur[(y*w+x)*3+2])/3;
  const top=[],bottom=[];
  for(let x=333;x<=786;x++){
   let t=0,b=0,score=-Infinity;
   for(let y=837;y<899;y++){let i=(y*w+x)*3;if(blur[i]-blur[i+2]<9&&lum(x,y)>53){t=y;break;}}
   for(let y=891;y<=911;y++){let s=lum(x,y-2)-lum(x,y+2);if(s>score){score=s;b=y;}}
   if(t&&b>t){top.push([x,t]);bottom.push([x,b]);}
  }
  const smoothLine=a=>a.map((p,i)=>{let sum=0,count=0;for(let d=-4;d<=4;d++){if(a[i+d]){sum+=a[i+d][1];count++;}}return[p[0],sum/count];});
  const points=[...smoothLine(top),...smoothLine(bottom).reverse()];
  const d=points.map((p,i)=>(i?'L':'M')+p.join(',')).join(' ')+' Z';
  const gap=await sharp(Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="black"/><path d="${d}" fill="white"/></svg>`)).removeAlpha().greyscale().raw().toBuffer();
  for(let i=0;i<n;i++)smooth[i]=Math.min(smooth[i],255-gap[i]);
 }
 mask=Uint8Array.from(smooth,v=>v>=128?1:0);
 const F=nearestSeeds(mask,w,h),B=nearestSeeds(Uint8Array.from(mask,v=>1-v),w,h);
 const fg=Uint8Array.from(mask,(v,i)=>v&&B.dist[i]>=12?1:0),bg=Uint8Array.from(mask,(v,i)=>!v&&F.dist[i]>=12?1:0),bgNearest=nearestSeeds(bg,w,h);
 const result=Buffer.alloc(n*3),alpha=Buffer.alloc(n);let protectedPixels=0,changedProtectedPixels=0,backgroundPixels=0;
 for(let i=0;i<n;i++){
  let a=smooth[i]/255,bi=bgNearest.nearest[i];if(bi<0)bi=i%w;
  if(fg[i]||a>.95)a=1;if(a<.06)a=0;alpha[i]=Math.round(a*255);
  for(let k=0;k<3;k++)result[i*3+k]=a===0?242:a===1?rgb[i*3+k]:Math.max(0,Math.min(255,Math.round(rgb[i*3+k]+(1-a)*(242-rgb[bi*3+k]))));
  if(fg[i]){protectedPixels++;if([0,1,2].some(k=>result[i*3+k]!==rgb[i*3+k]))changedProtectedPixels++;}if(a===0)backgroundPixels++;
 }
 const raw={raw:{width:w,height:h,channels:3}},master=path.join(out,'masters',stem+'.png'),dest=path.join(out,'site-images',file);
 await sharp(result,raw).png().toFile(master);
 if(file.endsWith('.webp'))await sharp(result,raw).webp({lossless:true,effort:6}).toFile(dest);else fs.copyFileSync(master,dest);
 await sharp(alpha,{raw:{width:w,height:h,channels:1}}).png().toFile(path.join(out,'masks',stem+'.png'));
 const decoded=await sharp(dest).removeAlpha().raw().toBuffer();if(!decoded.equals(result))throw Error('Lossless mismatch '+file);
 const report={id:item.id,file,width:w,height:h,sourceSha256:hash(fs.readFileSync(archived)),outputSha256:hash(fs.readFileSync(dest)),protectedPixels,changedProtectedPixels,backgroundPixels,backdrop:'#F2F2F2',losslessVerified:true};
 fs.writeFileSync(path.join(out,'reports',item.id+'.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}
})().catch(e=>{console.error(e);process.exit(1)});
