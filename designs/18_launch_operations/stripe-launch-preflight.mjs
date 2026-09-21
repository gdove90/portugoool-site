import fs from 'node:fs';
import {createRequire} from 'node:module';
const root='C:/Users/gdove/OneDrive/Desktop/GOOOL';
const require=createRequire(root+'/package.json');
const Stripe=require('stripe');
const env={};
for(const line of fs.readFileSync(root+'/.env.local','utf8').split(/\r?\n/)){
 const m=line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);if(m)env[m[1]]=m[2].replace(/^(['"])(.*)\1$/,'$2');
}
const key=env.STRIPE_SECRET_KEY;
const out={checked_at_utc:new Date().toISOString(),mode:key?.startsWith('sk_test_')?'test':key?.startsWith('sk_live_')?'live':'missing_or_unknown',operations:'Stripe read-only account/config inspection; optional test Checkout Session creation without payment',account:null};
if(out.mode!=='test'){console.log(JSON.stringify(out));process.exit(0)}
const stripe=new Stripe(key,{timeout:20000,maxNetworkRetries:0});
try{
 const a=await stripe.accounts.retrieve();
 out.account={id:a.id,business_website:a.business_profile?.url,charges_enabled:a.charges_enabled,payouts_enabled:a.payouts_enabled,details_submitted:a.details_submitted,requirements_currently_due:a.requirements?.currently_due||[],requirements_disabled_reason:a.requirements?.disabled_reason||null};
 const hooks=await stripe.webhookEndpoints.list({limit:100});out.webhooks=hooks.data.filter(h=>h.url.includes('goool.shop')).map(h=>({id:h.id,url:h.url,status:h.status,livemode:h.livemode,events:h.enabled_events}));
 const rates=await stripe.shippingRates.list({limit:100});out.shipping_rates=rates.data.map(r=>({id:r.id,name:r.display_name,active:r.active,livemode:r.livemode,amount:r.fixed_amount?.amount,currency:r.fixed_amount?.currency}));
 if(process.argv.includes('--checkout') && env.PREVIEW_KEY){
  const res=await fetch('https://goool.shop/api/checkout',{method:'POST',redirect:'manual',signal:AbortSignal.timeout(25000),headers:{'Content-Type':'application/json',Cookie:'goool_preview='+encodeURIComponent(env.PREVIEW_KEY)},body:JSON.stringify({items:[{productId:'70000000-0000-4000-8000-000000000003',size:'S',color:'Washed Black',quantity:1,customName:null,customNumber:null}]})});
  out.checkout_http_status=res.status;
  const data=await res.json().catch(()=>({}));
  if(data.url){
   const id=data.url.match(/cs_test_[A-Za-z0-9]+/)?.[0];
   if(id){const s=await stripe.checkout.sessions.retrieve(id);out.checkout={session_id:s.id,livemode:s.livemode,payment_status:s.payment_status,status:s.status,amount_total:s.amount_total,currency:s.currency,shipping_rate_id:s.shipping_cost?.shipping_rate,success_url_path:s.success_url?.split('?')[0]};}
   else out.checkout={state:'response_url_received_but_test_id_not_detected'};
  }else out.checkout_error=typeof data.error==='string'?data.error.slice(0,200):'No checkout URL received';
 }
}catch(e){out.error={type:e.type||e.name,http_status:e.statusCode||null,code:e.code||null};}
fs.writeFileSync(new URL('./stripe-launch-preflight-result.json',import.meta.url),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));
