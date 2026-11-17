(function(){
'use strict';
if(window.__ccPresence)return;window.__ccPresence=true;
const brand='goal',host='goalathletics.shop',key='cc_presence_v1';
let memory,lastSent=0,lastPage='',busy=false;
function allowed(){
 if(location.hostname!==host&&location.hostname!=='www.'+host)return false;
 if(navigator.globalPrivacyControl||navigator.doNotTrack==='1'||document.visibilityState!=='visible')return false;
 if(/^\/(admin|api|auth|ceo|review|reset-password|sign-in|customer|account|messages)(\/|$)/.test(location.pathname))return false;
 if(brand==='goal'){
  let stored;try{stored=JSON.parse(localStorage.getItem('goool_marketing_consent_v1'));}catch{}
  if(stored&&Number.isFinite(stored.at)&&Date.now()>=stored.at&&Date.now()-stored.at<180*86400000)return stored.choice==='granted';
  return /(?:^|;\s*)goool_geo=US(?:;|$)/.test(document.cookie);
 }
 if(brand==='hotf')return localStorage.getItem('hotf_website_consent_v1')==='granted';
 return true;
}
function source(){
 const q=new URLSearchParams(location.search),medium=(q.get('utm_medium')||'').toLowerCase(),tag=(q.get('utm_source')||'').toLowerCase();
 if(/^(email|newsletter)$/.test(medium))return 'email';
 if(/^(cpc|ppc|paid|paid_social|paid_search|display)$/.test(medium))return 'paid';
 const named={ig:'instagram',instagram:'instagram',fb:'facebook',facebook:'facebook',google:'google',bing:'bing',tiktok:'tiktok',linkedin:'linkedin',youtube:'youtube',pinterest:'pinterest',twitter:'x',x:'x'};
 if(named[tag])return named[tag];let ref='';try{ref=new URL(document.referrer).hostname;}catch{}
 for(const [domain,name]of [['instagram.com','instagram'],['facebook.com','facebook'],['tiktok.com','tiktok'],['linkedin.com','linkedin'],['youtube.com','youtube'],['pinterest.com','pinterest'],['x.com','x'],['t.co','x'],['bing.com','bing']])if(ref===domain||ref.endsWith('.'+domain))return name;
 if(/(^|\.)google\.[a-z.]+$/.test(ref))return 'google';
 if(medium==='organic'||/(^|\.)(duckduckgo.com|search.yahoo.com)$/.test(ref))return 'search';
 if(/social/.test(medium))return 'social';
 return !ref||ref===host||ref.endsWith('.'+host)?'direct':'referral';
}
function page(){const p=location.pathname;
 if(p==='/'||p==='/launch')return 'home';if(/^\/shop\/[^/]+/.test(p))return 'product';if(/^\/(shop|collections)/.test(p))return 'shop';
 if(/^\/(bag|cart|basket)/.test(p))return 'bag';if(/checkout/.test(p))return 'checkout';
 if(/onboarding/.test(p))return 'chef-onboarding';if(/^\/(apply|become-a-chef|chef\/apply)/.test(p))return 'chef-application';
 if(/^\/chef/.test(p))return 'chefs';if(/^\/(experiences|pastry)/.test(p))return 'experiences';
 if(p.includes('signup/candidate'))return 'candidate-signup';if(p.includes('signup/employer'))return 'employer-signup';
 if(/^\/(jobs|roles)/.test(p))return 'jobs';if(/pricing/.test(p))return 'pricing';if(/about/.test(p))return 'about';if(/help|faq/.test(p))return 'help';return 'other';
}
async function pulse(){try{
 if(!allowed()){lastPage='';return;}const now=Date.now(),p=page();if(busy||(p===lastPage&&now-lastSent<30000))return;
 let s=memory;try{s=JSON.parse(sessionStorage.getItem(key))||s;}catch{}
 const verify=new URLSearchParams(location.search).get('cc_verify')==='1'||(brand==='hotf'&&document.cookie.includes('hotf_team_view='));
 if(!s||!Number.isFinite(s.at)||now<s.at||now-s.at>=1800000||!(/^[a-f0-9-]{36}$/.test(s.id))||(verify&&!s.verification))s={id:crypto.randomUUID(),source:source(),verification:verify};
 s.at=now;memory=s;try{sessionStorage.setItem(key,JSON.stringify(s));}catch{}
 const ua=navigator.userAgent,device=/iPad|Tablet|Android(?!.*Mobile)/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1)?'tablet':/Mobile|iPhone/i.test(ua)?'mobile':'desktop';
 busy=true;const r=await fetch('/.netlify/functions/cc-presence',{method:'POST',credentials:'same-origin',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({id:s.id,page:p,source:s.source,device,verification:s.verification}),signal:AbortSignal.timeout(8000)});
 if(r.ok){lastSent=now;lastPage=p;}
 }catch{}finally{busy=false;}}
window.addEventListener('cc:page',pulse);window.addEventListener('goool:marketing-consent',pulse);window.addEventListener('hotf:route',pulse);document.addEventListener('visibilitychange',pulse);window.addEventListener('pageshow',pulse);setInterval(pulse,5000);pulse();
})();
