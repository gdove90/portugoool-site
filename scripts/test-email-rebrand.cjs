// Pure template generation only. Never imports the sender or email queue.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const ts = require('typescript'), sharp = require('sharp');
require.extensions['.ts'] = (m,f) => m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
const {buildOrderConfirmation,orderNumberFor}=require('../src/lib/emails/order-confirmation.ts');
const {buildOrderDelayNotice}=require('../src/lib/emails/order-delay-notice.ts');
const {buildShipmentNotification}=require('../src/lib/emails/shipment-notification.ts');
const {buildWelcome1}=require('../src/lib/emails/welcome-1.ts');
const {buildWelcome2}=require('../src/lib/emails/welcome-2.ts');
const {buildWelcome3}=require('../src/lib/emails/welcome-3.ts');
(async()=>{
  const order={id:'12345678-1111-4444-8888-999999999999',shipping_name:'Preview Athlete',customer_email:'preview@example.invalid',currency:'usd',total_cents:4800,amount_subtotal_cents:4800,amount_shipping_cents:0,amount_tax_cents:0,shipping_address:{line1:'Synthetic preview address',city:'Example',country:'US'},created_at:'2026-10-13T12:00:00Z'};
  const items=[{product_id:'preview-only',apliiq_sku:'LEGACY-SKU-UNCHANGED',quantity:1,unit_price_cents:4800,size:'M',color:'Black'}];
  const unsubscribeUrl='https://goalathletics.shop/unsubscribe/preview-only';
  const welcome={code:'PREVIEW-CODE',unsubscribeUrl};
  assert(buildWelcome1({code:'GOOOL20-DEMO',unsubscribeUrl}).text.includes('GOOOL20-DEMO'));
  const previews={
    'order-confirmation':buildOrderConfirmation({order,items}),
    'order-delay':buildOrderDelayNotice(order),
    'shipment':buildShipmentNotification(order,{tracking_company:'Example Carrier',tracking_numbers:['PREVIEW-TRACKING'],tracking_urls:['javascript:alert(1)']}),
    'welcome-1':buildWelcome1(welcome),
  };
  assert.equal(orderNumberFor(order.id),'GOOOL-12345678');
  const sender=fs.readFileSync('src/lib/email.ts','utf8');
  assert(sender.includes('return "GOAL Athletics <hello@goalathletics.shop>";'));
  assert(sender.includes('reply_to: "support@goalathletics.shop"'));
  for(const [name,m] of Object.entries(previews)) {
    assert(m.html.includes('goal-athletics-email-wordmark-white.png'),name);
    assert(m.html.includes('alt="GOAL Athletics"'),name);
    assert(/<body[^>]*background(?:-color)?:#(?:FFFFFF|fff)/.test(m.html),name+' white outer canvas');
    if(name==='welcome-1') {assert(!m.html.includes('Tees $38'));assert(!m.html.includes('Shop the drop'));}
    assert(m.text.includes('goalathletics.shop'),name);
    assert(m.text.includes('support@goalathletics.shop'),name);
    assert(!m.html.includes('hello@goool.shop'),name);
    assert(!m.html.includes('mailto:hello@goalathletics.shop'),name);
    assert(!m.html.includes('/brand/goool-athletics-lockup'),name);
    assert(!m.html.includes('javascript:'),name);
    if(name.startsWith('welcome')) {assert(m.text.includes('PREVIEW-CODE'));assert(m.html.includes(unsubscribeUrl));assert(m.html.includes('GOOOL Athletics LLC'));}
    else {assert(m.text.includes('GOOOL-12345678'));assert(m.html.includes('GOOOL-12345678'));}
    if(name==='order-confirmation') {assert(m.text.includes('LEGACY-SKU-UNCHANGED'));assert(m.text.includes('$48.00'));assert(m.text.includes('GOOOL Athletics LLC'));}
    if(name==='order-delay') {assert(m.subject.includes('GOAL Athletics'));assert(m.text.includes('GOOOL Athletics LLC'));}
    if(name==='welcome-2') assert(!m.html.includes('old-logo.png'));
    console.log('PASS '+name+' branding, links and preserved identifiers');
  }
  global.fetch = async()=>{throw new Error('Network forbidden during template tests');};
  assert.deepEqual(await require('../src/lib/welcome.ts').runWelcomePass(true),{promotional_followups_disabled:1});
  for(const mode of ['live','test'])for(const step of [2,3]) assert.equal(await require('../src/lib/email-delivery.ts').deliverEmail(`welcome/${mode}/${step}/preview-only`),'promotional_followups_disabled');
  console.log('PASS promotional passes and pre-existing follow-up deliveries cannot send or access the database');
  const previousKey=process.env.RESEND_API_KEY;
  let captured;
  global.fetch=async (_url,options)=>{captured=JSON.parse(options.body);return {ok:true,json:async()=>({id:'synthetic-local-only'})};};
  process.env.RESEND_API_KEY='synthetic-local-only';
  try {
    await require('../src/lib/email.ts').sendEmail({to:'preview@example.invalid',subject:'local fixture',html:'fixture',text:'fixture',replyTo:'hello@goool.shop'},'synthetic-local-only');
    assert.equal(captured.from,'GOAL Athletics <hello@goalathletics.shop>');
    assert.equal(captured.reply_to,'support@goalathletics.shop');
  } finally {
    if(previousKey===undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY=previousKey;
    global.fetch=async()=>{throw Error('Network forbidden');};
  }
  console.log('PASS local mock payload uses approved From and support Reply-To, including a legacy override');

  const meta=await sharp('public/brand/goal-athletics-email-wordmark-white.png').metadata();
  assert.equal(meta.width,1734);assert.equal(meta.height,544);assert(meta.hasAlpha);
  if(process.env.EMAIL_PREVIEW_DIR) {
    const dir=path.resolve(process.env.EMAIL_PREVIEW_DIR);fs.mkdirSync(dir,{recursive:true});
    fs.copyFileSync('public/brand/goal-athletics-email-wordmark-white.png',path.join(dir,'goal-athletics-email-wordmark-white.png'));
    for(const [name,m] of Object.entries(previews)) {
      fs.writeFileSync(path.join(dir,name+'.html'),m.html.replace(/https:\/\/[^"\s]+\/brand\/goal-athletics-email-wordmark-white\.png/g,'goal-athletics-email-wordmark-white.png'));
      fs.writeFileSync(path.join(dir,name+'.txt'),'Subject: '+m.subject+'\n\n'+m.text);
    }
  }
  console.log('PASS approved sender, support-only Reply-To, legacy reference format and transparent V1.3 PNG. No messages sent.');
})().catch(e=>{console.error(e);process.exitCode=1});
