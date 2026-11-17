import { createHmac } from 'node:crypto';
const brand='goal',host='goalathletics.shop';
const reply=status=>new Response(null,{status,headers:{'Cache-Control':'no-store'}});
const pages=['home','shop','product','bag','checkout','chefs','chef-application','chef-onboarding','experiences','candidate-signup','employer-signup','jobs','pricing','about','help','other'];
const sources=['direct','google','bing','instagram','facebook','tiktok','linkedin','youtube','pinterest','x','email','paid','search','social','referral','unattributed'];
export default async function(req,context){
 if(req.method!=='POST')return reply(405);
 const origin=req.headers.get('origin');
 if(!['https://'+host,'https://www.'+host].includes(origin))return reply(403);
 if(req.headers.get('sec-gpc')==='1'||req.headers.get('dnt')==='1'||/bot|crawl|spider|headless|lighthouse|curl|wget/i.test(req.headers.get('user-agent')||''))return reply(204);
 if(Number(req.headers.get('content-length')||0)>1024)return reply(413);
 const token=process.env.CC_EVENTS_TOKEN;if(!token)return reply(503);
 try{
 const reader=req.body?.getReader();if(!reader)return reply(400);let bytes=0,raw='';const decoder=new TextDecoder();
 for(;;){const {value,done}=await reader.read();if(done)break;bytes+=value.length;if(bytes>1024){await reader.cancel();return reply(413);}raw+=decoder.decode(value,{stream:true});}raw+=decoder.decode();const e=JSON.parse(raw);
 if(!/^[a-f0-9-]{36}$/.test(e.id)||!pages.includes(e.page)||!sources.includes(e.source)||!['desktop','mobile','tablet'].includes(e.device)||typeof e.verification!=='boolean')return reply(400);
 const country=context?.geo?.country?.code||'';
 const r=await fetch('https://ctwncttnrbhiczmcmqqx.supabase.co/functions/v1/website-presence',{method:'POST',headers:{Authorization:'Bearer '+token,'x-website-brand':brand,'Content-Type':'application/json'},body:JSON.stringify({visit_id:createHmac('sha256',token).update(brand+':presence:'+e.id).digest('hex'),page:e.page,source:e.source,device:e.device,country:/^[A-Z]{2}$/.test(country)?country:'',verification:e.verification||(brand==='hotf'&&(req.headers.get('cookie')||'').includes('hotf_team_view='))}),signal:AbortSignal.timeout(6000)});
 return reply(r.ok?204:503);
 }catch{return reply(400);}
}
export const config={rateLimit:{windowLimit:30,windowSize:60,aggregateBy:['ip','domain']}};
