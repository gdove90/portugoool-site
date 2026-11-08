'use strict';
// Exercise the actual CartPage handlers and hook effects with deferred HTTP
// responses. Only React scheduling and network transport are isolated.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),ts=require('typescript');
const code=ts.transpileModule(fs.readFileSync('src/app/cart/page.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
const backend=fs.readFileSync('scripts/test-launch-backend.cjs','utf8').split('(async()=>{')[0];
const load=require('./fixtures/test-source-loader.cjs').createSourceLoader();
function app(){
 const slots=[],deps=[],pending=[],events=[],effects=[],cleanups=[];let index=0,tree,unmounted=false;
 const cart={items:[{productId:'80000000-0000-4000-8000-000000000011',slug:'goal-athletics-ga-minimal-tee',name:'Warm-Up Tee',color:'Black',size:'M',quantity:1,unitPriceCents:3800,key:'tee',image:'/fixture.webp'}],notices:[],dismissNotices(){},removeItem(){},updateQuantity(){}};
 const react={useState(value){const i=index++;if(!(i in slots))slots[i]=value;return [slots[i],v=>{assert.equal(unmounted,false,'No state updates after unmount');slots[i]=typeof v==='function'?v(slots[i]):v}];},useRef(value){const i=index++;if(!(i in slots))slots[i]={current:value};return slots[i];},useEffect(fn,next){const i=index++;if(!deps[i]||next.some((v,j)=>v!==deps[i][j])){deps[i]=next;effects.push(()=>{cleanups[i]?.();cleanups[i]=fn()})}}};
 const element=(type,props)=>({type,props:props||{}});
 const module={exports:{}};const window={location:{href:''}};
 const request=(_url,options)=>new Promise(resolve=>pending.push({body:JSON.parse(options.body),resolve}));
 const mocks={react,'react/jsx-runtime':{jsx:element,jsxs:element,Fragment:'fragment'},'next/image':'img','next/link':'a',
  '@/lib/cart':{useCart:()=>({...cart,subtotalCents:cart.items.reduce((n,x)=>n+x.quantity*x.unitPriceCents,0)})},
  '@/lib/meta-pixel':{consentForServer:()=> 'denied',trackInitiateCheckout:e=>events.push(e)}};
 new Function('require','module','exports','fetch','window',code)(n=>mocks[n]??(n.startsWith('@/')?load('src/'+n.slice(2)+'.ts'):require(n)),module,module.exports,request,window);
 function render(){index=0;tree=module.exports.default();while(effects.length)effects.shift()();return tree;}
 function all(node,out=[]){if(arguments.length===0)node=tree;if(Array.isArray(node))node.forEach(n=>all(n,out));else if(node&&typeof node==='object'){out.push(node);all(node.props?.children,out)}return out;}
 const text=node=>Array.isArray(node)?node.map(text).join(''):node&&typeof node==='object'?text(node.props?.children):node==null?'':String(node);
 const button=name=>all().find(n=>n.type==='button'&&text(n)===name);
 const input=(id,value)=>{all().find(n=>n.props?.id===id).props.onChange({target:{value}});render();};
 async function respond(i,body,status=200){pending[i].resolve({ok:status<400,json:async()=>body});await new Promise(r=>setImmediate(r));if(!unmounted)render();}
 render();return{render,all,text,button,input,respond,pending,events,cart,window,unmount(){cleanups.forEach(fn=>fn?.());unmounted=true;},failTracking(){mocks['@/lib/meta-pixel'].trackInitiateCheckout=()=>{throw new Error('Optional tracking failed')};}};
}
const quote=(quantity)=>({code:'GOAL20-QA11',subtotalCents:3800*quantity,discountCents:760*quantity,shippingCents:quantity<3?695:0,totalCents:3040*quantity+(quantity<3?695:0)});
(async()=>{
 const a=app();a.input('cart-email','qa@example.test');a.input('cart-code','GOAL20-QA11');a.button('Apply').props.onClick();a.render();
 assert.equal(a.button('Checkout').props.disabled,true);await a.respond(0,quote(1));assert.match(a.text(a.render()),/37.35/);
 a.cart.items[0].quantity=2;a.render();a.render();assert.equal(a.button('Checkout').props.disabled,true);
 a.cart.items[0].quantity=3;a.render();a.render();await a.respond(2,quote(3));await a.respond(1,quote(2));assert.match(a.text(a.render()),/91.20/);assert.doesNotMatch(a.text(a.render()),/67.75/);
 console.log('PASS Out-of-order discount responses cannot restore older totals; shipping recalculates and checkout waits');
 a.cart.items[0].color='True Red';a.render();a.render();assert.equal(a.pending.length,4);assert.equal(a.button('Checkout').props.disabled,true);
 const removes=a.all().filter(n=>n.type==='button'&&a.text(n)==='Remove');removes.at(-1).props.onClick();a.render();await a.respond(3,quote(3));assert.doesNotMatch(a.text(a.render()),/GOAL20-QA11 applied/);
 console.log('PASS Equal-price variant changes revalidate; removing a code invalidates its in-flight response');
 const b=app();b.input('cart-email','qa@example.test');b.input('cart-code','GOAL20-QA11');b.button('Apply').props.onClick();await b.respond(0,quote(1));
 b.input('cart-email','other@example.test');b.render();assert.equal(b.button('Checkout').props.disabled,true);await b.respond(1,{error:'That code was issued to a different email address.'},400);assert.match(b.text(b.render()),/different email/);assert.doesNotMatch(b.text(b.render()),/GOAL20-QA11 applied/);
 console.log('PASS Email changes immediately invalidate the old discount and show eligibility errors');
 const c=app();let started=c.button('Checkout').props.onClick();await c.respond(0,{error:'Unavailable'},503);await started;c.render();assert.equal(c.events.length,0);
 started=c.button('Checkout').props.onClick();await c.respond(1,{url:'https://checkout.stripe.com/fixture',totalCents:4495});await started;assert.equal(c.events.length,1);assert.equal(c.events[0].value,44.95);assert.equal(c.window.location.href,'https://checkout.stripe.com/fixture');
 console.log('PASS Failed checkout emits nothing; successful handoff uses server totals and redirects once');
 const d=app();d.input('cart-email','qa@example.test');d.input('cart-code','GOAL20-QA11');d.button('Apply').props.onClick();d.render();d.unmount();await d.respond(0,quote(1));
 console.log('PASS Unmounted quote responses cannot update state or revive a discount');
 const e=app();e.input('cart-email','qa@example.test');e.input('cart-code','GOAL20-QA11');e.button('Apply').props.onClick();await e.respond(0,quote(1));e.cart.items[0].customName='TEST';e.cart.items[0].customNumber='7';e.render();e.render();assert.equal(e.pending[1].body.items[0].customName,'TEST');assert.equal(e.pending[1].body.items[0].customNumber,'7');assert.equal(e.button('Checkout').props.disabled,true);e.cart.items=[];e.render();await e.respond(1,quote(1));assert.doesNotMatch(e.text(e.render()),/GOAL20-QA11 applied/);
 console.log('PASS Customization and complete removal invalidate quotes, including equal-price edits');
 const f=app();f.failTracking();const handler=f.button('Checkout').props.onClick;const first=handler(),second=handler();assert.equal(f.pending.length,1);await f.respond(0,{url:'https://checkout.stripe.com/fixture',totalCents:4495});await Promise.all([first,second]);assert.equal(f.window.location.href,'https://checkout.stripe.com/fixture');
 console.log('PASS Duplicate clicks are ignored; optional tracking failure cannot prevent checkout handoff');
 const g=app();const gone=g.button('Checkout').props.onClick();g.unmount();await g.respond(0,{url:'https://checkout.stripe.com/fixture',totalCents:4495});await gone;assert.equal(g.events.length,0);assert.equal(g.window.location.href,'');
 console.log('PASS Checkout responses after unmount cannot track or redirect');
 console.log('8 cart interaction checks passed. Deferred local fixtures; no browser or Stripe provider payment.');
})().catch(e=>{console.error(e);process.exitCode=1});
