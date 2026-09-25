const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sharp=require('C:/Users/gdove/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{const records=[];for(const item of require('./inventory.json')){
const file=path.basename(item.src),stem=path.parse(file).name,dest=path.join(__dirname,'site-images',file),src=path.join(__dirname,'originals',file);
if(item.alreadyStandard){for(const d of ['masters','masks'])fs.copyFileSync(path.join(__dirname,'../product-backdrop-standard',d,stem+'.png'),path.join(__dirname,d,stem+'.png'));}
const {data:rgb,info}=await sharp(dest).removeAlpha().raw().toBuffer({resolveWithObject:true}),old=await sharp(src).removeAlpha().raw().toBuffer(),alpha=await sharp(path.join(__dirname,'masks',stem+'.png')).greyscale().raw().toBuffer();
if(info.width!==item.width||info.height!==item.height)throw Error('Dimensions changed '+file);
let retained=0,changed=0,bg=0,badBg=0;for(let i=0;i<alpha.length;i++){if(alpha[i]===255){retained++;if([0,1,2].some(k=>rgb[i*3+k]!==old[i*3+k]))changed++;}if(alpha[i]===0){bg++;if([0,1,2].some(k=>rgb[i*3+k]!==242))badBg++;}}
if(changed||badBg)throw Error('Pixel verification failed '+file);
records.push({id:item.id,src:item.src,width:info.width,height:info.height,alreadyStandard:item.alreadyStandard,sourceSha256:hash(fs.readFileSync(src)),outputSha256:hash(fs.readFileSync(dest)),retainedOpaquePixels:retained,changedOpaquePixels:changed,backgroundPixels:bg,incorrectBackgroundPixels:badBg,backdrop:'#F2F2F2'});
}const summary={date:'2026-09-25',scope:'All 36 unique active catalog images across 9 products',background:{hex:'#F2F2F2',rgb:[242,242,242],colorSpace:'sRGB',finish:'opaque flat solid; no gradient, vignette, floor shadow or texture'},images:records.length,updated:records.filter(x=>!x.alreadyStandard).length,retainedOpaquePixels:records.reduce((s,x)=>s+x.retainedOpaquePixels,0),changedOpaquePixels:0,incorrectBackgroundPixels:0,records};fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify({...summary,records:undefined}));})();
