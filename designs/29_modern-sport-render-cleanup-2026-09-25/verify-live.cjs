const fs=require('fs'),path=require('path'),crypto=require('crypto');
const sharp=require('C:/Users/gdove/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=__dirname,base='https://goool.shop';
const records=require('./render-verification.json').records;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
  const report={checkedAt:new Date().toISOString(),base,usesCookies:false,pages:[],images:[],optimizer:[]};
  for(const route of ['/','/shop','/robots.txt','/sitemap.xml','/shop/goool-athletics-modern-sport-performance-tee','/shop/goool-athletics-modern-sport-performance-tee?color=True+Royal']){
    const r=await fetch(base+route,{redirect:'manual'}),t=await r.text();
    if(r.status!==200)throw Error('Page not public: '+route+' '+r.status);
    if(route.includes('modern-sport')&&!t.includes('modern-print-20260925-v4'))throw Error('Missing fresh image revision '+route);
    if(route==='/robots.txt'&&!t.includes('Allow: /'))throw Error('Robots closed');
    if(route==='/sitemap.xml'&&!t.includes('goool-athletics-modern-sport-performance-tee'))throw Error('Missing sitemap product');
    if(['/','/shop'].includes(route)&&(/name="robots"[^>]*noindex/i.test(t)||/noindex/i.test(r.headers.get('x-robots-tag')||'')))throw Error('Noindex present');
    report.pages.push({route,status:r.status,location:r.headers.get('location'),newRevision:route.includes('modern-sport')?t.includes('modern-print-20260925-v4'):undefined});
  }
  fs.mkdirSync(path.join(root,'live-optimizer'),{recursive:true});
  await Promise.all(records.map(async rec=>{
    const src='/products/'+rec.file+'?v=modern-print-20260925-v4';
    const r=await fetch(base+src,{redirect:'manual'}),b=Buffer.from(await r.arrayBuffer());
    if(r.status!==200||hash(b)!==rec.finalSha256)throw Error('Asset bytes do not match '+rec.file);
    report.images.push({file:rec.file,status:r.status,sha256:hash(b),byteMatch:true});
    const opt=await fetch(base+'/_next/image?url='+encodeURIComponent(src)+'&w=640&q=90',{headers:{accept:'image/webp'},redirect:'manual'});
    const bytes=Buffer.from(await opt.arrayBuffer());
    if(opt.status!==200||!opt.headers.get('content-type')?.startsWith('image/'))throw Error('Optimizer failure '+rec.file);
    const {data,info}=await sharp(bytes).removeAlpha().raw().toBuffer({resolveWithObject:true});
    const samples=[0,info.width-1,10*info.width+10].map(p=>Array.from(data.subarray(p*3,p*3+3)));
    if(samples.some(p=>p.some(c=>Math.abs(c-242)>1)))throw Error('Backdrop changed '+rec.file);
    fs.writeFileSync(path.join(root,'live-optimizer',rec.file+'.webp'),bytes);
    report.optimizer.push({file:rec.file,status:opt.status,type:opt.headers.get('content-type'),width:info.width,height:info.height,backgroundSamples:samples});
  }));
  report.allPassed=true;
  fs.writeFileSync(path.join(root,'verified-production.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1);});
