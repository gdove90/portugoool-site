// Extracted unchanged validation from approved v84. Transport and authorization are implemented separately.
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
const str=(v,max,required=false)=>{if(typeof v!=='string'||v.length>max||(required&&!v.trim()))fail(400,'Please check the form fields.');return v.trim();};
function cleanPayload(data){
 const kind=data.kind;if(!['kit','video','story'].includes(kind))fail(400,'Choose a submission type.');
 const p=data.payload||{},name=str(p.name,80,true),email=str(p.email,254,true).toLowerCase(),team=str(p.team||'',100);
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))fail(400,'Enter a valid email address.');
 let payload,consent,category;
 if(kind==='kit'){
  if(!['original','legacy','future'].includes(p.design)||!['Black','True Royal','Iron Grey','True Red','Silver','White'].includes(p.color)||!Number.isSafeInteger(p.quantity)||p.quantity<10||p.quantity>10000||!Number.isInteger(p.number)||p.number<1||p.number>99||!['goool','custom'].includes(p.numberStyle))fail(400,'Please check the kit choices.');
  if(p.rights!==true)fail(400,'Confirm you have permission to use the artwork.');
  payload={name,email,team,design:p.design,color:p.color,quantity:p.quantity,number:p.number,numberStyle:p.numberStyle,backName:str(p.backName||'',24),removeChestLogo:typeof p.removeChestLogo==='boolean'?p.removeChestLogo:p.removeBranding===true,removeFrontSponsor:typeof p.removeFrontSponsor==='boolean'?p.removeFrontSponsor:p.removeBranding===true,sizes:str(p.sizes||'',500),notes:str(p.notes||'',1000)};
  category='Kit request';consent={version:'KIT-2026-10-04-1',artworkRights:true,notice:'I own this artwork or have permission to use it on apparel. I agree that GOOOL Athletics LLC may store and review this request and contact me about it. This is a quote request, not an order or marketing signup.'};
 }else if(kind==='story'){
  if(p.adult!==true||p.rights!==true||p.permission!==true||p.termsVersion!=='WYG-2026-10-04-live-1')fail(400,'Read and accept all three story acknowledgments.');
  const handle=str(p.handle||'',31);if(handle&&!/^@?[A-Za-z0-9_.]{1,30}$/.test(handle))fail(400,'Enter an Instagram handle, or leave it blank.');
  payload={name:str(p.name,60,true),email,team:'',goal:str(p.goal,100,true),story:str(p.story,250,true),handle,marketing:p.marketing===true};
  category='Personal story';
  consent={version:p.termsVersion,adult:true,rights:true,permission:true,tagHandle:handle,marketing:p.marketing===true,marketingNotice:'Also send me new pieces and updates from GOOOL Athletics LLC. Optional.'};
 }else{
  category=p.category;if(!['Goals','Highlights','Saves'].includes(category))fail(400,'Choose goals, highlights or saves.');
  if(!['Player','Coach or team representative','Parent or guardian','Videographer','Friend / teammate'].includes(p.role))fail(400,'Choose how you are sharing.');
  if(p.adult!==true||p.rights!==true||p.permission!==true||p.termsVersion!=='SYG-2026-10-04-live-1')fail(400,'Read and accept all three acknowledgments.');
  if(p.friend===true&&p.friendPermission!==true)fail(400,'Confirm the player’s permission.');
  const tags={};for(const key of ['submitter','program','player']){const t=p.tags?.[key]||{};const selected=t.selected===true&&(key!=='player'||p.friend===true);const handle=selected?str(t.handle||'',31,true):'';if(selected&&!/^@?[A-Za-z0-9_.]{1,30}$/.test(handle))fail(400,'Check the selected Instagram handles.');tags[key]={selected,handle};}
  if(tags.program.selected&&!team)fail(400,'Add the program name for its tag.');
  payload={name,email,team,category,role:p.role,player:str(p.player,80,true),location:str(p.location||'',100),camera:str(p.camera,100,true),context:str(p.context||'',250),friend:p.friend===true,tags};
  consent={version:p.termsVersion,adult:true,rights:true,permission:true,friendPermission:p.friend===true&&p.friendPermission===true,tags};
 }
 return {kind,name,email,team,payload,consent,category};
}
function filesMeta(files,record){
 if(!Array.isArray(files)||files.length<(record.kind==='story'?0:1)||files.length>(record.kind==='kit'?2:3))fail(400,'Please choose the required files.');
 const normalized=files.map((f,i)=>{const name=str(f.name,180,true),ext=name.split('.').pop().toLowerCase();let mime;
  if(record.kind!=='kit'){mime={mp4:'video/mp4',mov:'video/quicktime',webm:'video/webm'}[ext];if(!mime||f.purpose!==(i?'support':'main'))fail(400,'Choose MP4, MOV or WebM footage.');}
  else {mime={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',svg:'image/svg+xml',pdf:'application/pdf'}[ext];if(!mime||!['crest','numbers'].includes(f.purpose))fail(400,'Choose PNG, JPG, SVG or PDF artwork.');}
  const max=(record.kind==='kit'?20:100)*1024*1024;if(!Number.isSafeInteger(f.size)||f.size<1||f.size>max)fail(400,'A file exceeds the allowed size.');
  return {name,mime,size:f.size,purpose:f.purpose};});
 if(record.kind==='kit'&&(!normalized.some(f=>f.purpose==='crest')||(record.payload.numberStyle==='custom'&&!normalized.some(f=>f.purpose==='numbers'))||new Set(normalized.map(f=>f.purpose)).size!==normalized.length))fail(400,'Upload your crest and any custom numbers.');
 return normalized;
}
function checkMagic(bytes,mime){const b=new Uint8Array(bytes),ascii=(a,z)=>String.fromCharCode(...b.slice(a,z));if(mime==='image/png')return b[0]===137&&ascii(1,4)==='PNG';if(mime==='image/jpeg')return b[0]===255&&b[1]===216&&b[2]===255;if(mime==='application/pdf')return ascii(0,5)==='%PDF-';if(mime==='video/webm')return b[0]===26&&b[1]===69&&b[2]===223&&b[3]===163;if(mime.startsWith('video/'))return ascii(4,8)==='ftyp'||(mime==='video/quicktime'&&['moov','mdat','wide','free'].includes(ascii(4,8)));if(mime==='image/svg+xml')return /<svg[\s>]/i.test(new TextDecoder().decode(b.slice(0,16384)));return false;}
export { cleanPayload, filesMeta, checkMagic };
