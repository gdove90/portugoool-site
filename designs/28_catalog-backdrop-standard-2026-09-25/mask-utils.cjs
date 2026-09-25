const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('C:/Users/gdove/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = 'C:/Users/gdove/OneDrive/Desktop/GOOOL';
const out = __dirname;
const gen = 'C:/Users/gdove/.codex/generated_images/01a0d722-b2ac-7053-b86a-cddd9fc55dea';
const inputs = {
 BLACK_BLUE_FRONT: 'exec-5ec77a3d-1760-47df-9363-fbc0c8759ffb.png',
 BLACK_BLUE_BACK: 'exec-91762b10-aafd-44cc-98f0-54de88e0f961.png',
 BONE_BLUE_FRONT: 'exec-10252ad3-6021-4668-bf13-3163fbc9897b.png',
 BONE_BLUE_BACK: 'exec-d147e761-868b-4a5c-b1bf-63ecaf58061c.png',
 GREYHEATHER_BLUE_FRONT: 'exec-b66d997c-ae35-4cd5-8eb0-a65f8d457961.png',
 GREYHEATHER_BLUE_BACK: 'exec-569ce064-db6c-4de4-ab9c-f289bcf52255.png'
};
for (const d of ['originals','masters','site-images','masks','mask-guides']) fs.mkdirSync(path.join(out,d),{recursive:true});
function largest(mask,w,h) {
 const n=w*h, seen=new Uint8Array(n), q=new Int32Array(n); let best=[];
 for(let p=0;p<n;p++) if(mask[p]&&!seen[p]) {
  let a=0,b=1;q[0]=p;seen[p]=1;
  while(a<b) {const i=q[a++],x=i%w;for(const j of [x?i-1:-1,x<w-1?i+1:-1,i-w,i+w]) if(j>=0&&j<n&&mask[j]&&!seen[j]){seen[j]=1;q[b++]=j;}}
  if(b>best.length)best=Array.from(q.subarray(0,b));
 }
 const result=new Uint8Array(n);for(const i of best)result[i]=1;return result;
}
function fillHoles(mask,w,h) {
 const n=w*h, seen=new Uint8Array(n),q=new Int32Array(n);let a=0,b=0;
 function add(i){if(!mask[i]&&!seen[i]){seen[i]=1;q[b++]=i;}}
 for(let x=0;x<w;x++){add(x);add((h-1)*w+x);}for(let y=0;y<h;y++){add(y*w);add(y*w+w-1);}
 while(a<b){const i=q[a++],x=i%w;for(const j of [x?i-1:-1,x<w-1?i+1:-1,i-w,i+w])if(j>=0&&j<n)add(j);}
 for(let i=0;i<n;i++)if(!seen[i])mask[i]=1;return mask;
}
function nearestSeeds(seed,w,h) {
 const n=w*h,dist=new Int16Array(n).fill(32000),nearest=new Int32Array(n).fill(-1),q=new Int32Array(n);let a=0,b=0;
 for(let i=0;i<n;i++)if(seed[i]){dist[i]=0;nearest[i]=i;q[b++]=i;}
 while(a<b){const i=q[a++];if(dist[i]>=40)continue;const x=i%w;for(const j of [x?i-1:-1,x<w-1?i+1:-1,i-w,i+w])if(j>=0&&j<n&&dist[j]>dist[i]+1){dist[j]=dist[i]+1;nearest[j]=nearest[i];q[b++]=j;}}
 return {dist,nearest};
}
function edgeRefine(mask,rgb,w,h,df,db) {
 const n=w*h, scalar=new Float32Array(n),rows=new Uint8Array(n),cols=new Uint8Array(n);
 // Bone's warm chroma separates pale cotton from its neutral backdrop.
 for(let i=0;i<n;i++)scalar[i]=(rgb[i*3]+rgb[i*3+1]+rgb[i*3+2])/3-2*(rgb[i*3]-rgb[i*3+2]);
 function val(pos,line,vertical){let sum=0,c=0;for(let d=-2;d<=2;d++){let x=vertical?line+d:pos,y=vertical?pos:line+d;if(x>=0&&x<w&&y>=0&&y<h){sum+=scalar[y*w+x];c++;}}return sum/c;}
 function snap(edge,line,vertical,sign){let best=edge,score=-1e9,len=vertical?h:w;for(let p=Math.max(3,edge-20);p<Math.min(len-3,edge+21);p++){const g=sign*(val(p+2,line,vertical)-val(p-2,line,vertical));const s=g-Math.abs(p-edge)*.18;if(s>score){score=s;best=p;}}return best;}
 for(const vertical of [false,true]){
  const lines=vertical?w:h,len=vertical?h:w,dst=vertical?cols:rows;
  for(let line=0;line<lines;line++){
   let start=-1;
   for(let p=0;p<=len;p++){
    const on=p<len&&mask[vertical?p*w+line:line*w+p];
    if(on&&start<0)start=p;
    if(!on&&start>=0){if(p-start>8){const a=snap(start,line,vertical,-1),b=snap(p,line,vertical,1);for(let t=a;t<b;t++)dst[vertical?t*w+line:line*w+t]=1;}start=-1;}
   }
  }
 }
 const result=new Uint8Array(n),sd=i=>mask[i]?db[i]:-df[i];
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=y*w+x;
  if(mask[i]&&db[i]>22){result[i]=1;continue;}
  if(!mask[i]&&df[i]>22)continue;
  const dx=sd(y*w+Math.min(w-1,x+3))-sd(y*w+Math.max(0,x-3));
  const dy=sd(Math.min(h-1,y+3)*w+x)-sd(Math.max(0,y-3)*w+x);
  result[i]=Math.abs(dx)>Math.abs(dy)?rows[i]:cols[i];
 }
 // Remove isolated guide noise and fill only enclosed holes in the garment.
 return fillHoles(largest(result,w,h),w,h);
}
async function contourRefine(mask,rgb,w,h,search=18,metric="warm") {
 const clean=await sharp(Buffer.from(Uint8Array.from(mask,v=>v*255)),{raw:{width:w,height:h,channels:1}}).blur(2).greyscale().raw().toBuffer();
 mask=fillHoles(largest(Uint8Array.from(clean,v=>v>127?1:0),w,h),w,h);
 const stride=w+1,edges=new Map();
 function add(x1,y1,x2,y2){edges.set(y1*stride+x1,y2*stride+x2);}
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(mask[y*w+x]){
  if(!y||!mask[(y-1)*w+x])add(x,y,x+1,y);
  if(x===w-1||!mask[y*w+x+1])add(x+1,y,x+1,y+1);
  if(y===h-1||!mask[(y+1)*w+x])add(x+1,y+1,x,y+1);
  if(!x||!mask[y*w+x-1])add(x,y+1,x,y);
 }
 let points=[];
 while(edges.size){let first=edges.keys().next().value,k=first,loop=[];while(edges.has(k)){loop.push([k%stride,Math.floor(k/stride)]);let next=edges.get(k);edges.delete(k);k=next;if(k===first)break;}if(loop.length>points.length)points=loop;}
 const len=points.length,at=i=>points[(i+len)%len];
 points=points.map((p,i)=>{let x=0,y=0;for(let d=-4;d<=4;d++){const q=at(i+d);x+=q[0];y+=q[1];}return [x/9,y/9];});
 const blur=await sharp(rgb,{raw:{width:w,height:h,channels:3}}).blur(1).raw().toBuffer();
 const scalar=new Float32Array(w*h);for(let i=0;i<w*h;i++)scalar[i]=(blur[i*3]+blur[i*3+1]+blur[i*3+2])/3-(metric==="warm"?2*(blur[i*3]-blur[i*3+2]):0);
 function val(x,y){x=Math.max(0,Math.min(w-2,x));y=Math.max(0,Math.min(h-2,y));const xx=Math.floor(x),yy=Math.floor(y),u=x-xx,v=y-yy,i=yy*w+xx;return scalar[i]*(1-u)*(1-v)+scalar[i+1]*u*(1-v)+scalar[i+w]*(1-u)*v+scalar[i+w+1]*u*v;}
 const offsets=[],normals=[];
 for(let i=0;i<len;i++){const a=at(i-12),b=at(i+12),dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=dy/l,ny=-dx/l,p=at(i);normals.push([nx,ny]);let best=0,score=-Infinity;
  for(let t=-search;t<=search;t+=.5){const g=val(p[0]+(t+2)*nx,p[1]+(t+2)*ny)-val(p[0]+(t-2)*nx,p[1]+(t-2)*ny);const s=(metric==="absolute"?Math.abs(g):g)-.3*Math.abs(t);if(s>score){score=s;best=t;}}
  if(p[0]<2||p[0]>w-2||p[1]>h-2)best=0; offsets.push(best);
 }
 const median=offsets.map((o,i)=>{let a=[];for(let d=-6;d<=6;d++)a.push(offsets[(i+d+len)%len]);a.sort((a,b)=>a-b);return a[6];});
 let refined=points.map((p,i)=>{let d=0;for(let j=-3;j<=3;j++)d+=median[(i+j+len)%len];d/=7;return [p[0]+normals[i][0]*d,p[1]+normals[i][1]*d];});
 const d=refined.filter((p,i)=>i%2===0).map((p,i)=>(i?'L':'M')+p[0].toFixed(2)+','+p[1].toFixed(2)).join(' ')+' Z';
 const svg=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="black"/><path d="${d}" fill="white"/></svg>`);
 return sharp(svg).removeAlpha().greyscale().raw().toBuffer();
}

module.exports={largest,fillHoles,nearestSeeds,contourRefine};
