const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const harness=fs.readFileSync(path.join(__dirname,'test-launch-backend.cjs'),'utf8').split('(async()=>{')[0];
const {load,memory}=new Function('require','__dirname',harness+';return {load,memory};')(require,__dirname);
let passed=0;async function check(name,fn){await fn();passed++;console.log('PASS '+name);}
(async()=>{
 const order={id:'99999999-1111-4444-8888-999999999999',status:'paid',customer_email:'qa@example.com',livemode:true,currency:'usd',confirmation_sent_at:null};
 const db=memory({orders:[order]});let sends=0;
 const delivery=load('src/lib/email-delivery.ts',{'./supabase':{getSupabaseAdmin:()=>db},'./email':{emailEnabled:()=>true,sendEmail:async()=>{sends++;return {sent:true,id:'mock'}}}});
 const shipment={order_id:order.id,status:'success',tracking_company:'USPS',tracking_numbers:['Z2','Z1'],tracking_urls:['javascript:alert(1)'],line_items:[]};
 await check('Callback replay and tracking reordering queue only one shipment notice',async()=>{await Promise.all([delivery.queueShipmentNotification(order,shipment),delivery.queueShipmentNotification(order,{...shipment,status:'shipped',tracking_numbers:['Z1','Z2','Z1']})]);assert.equal(db.tables.email_deliveries.length,1);});
 await check('A separate parcel queues its own notice',async()=>{await delivery.queueShipmentNotification(order,{...shipment,tracking_numbers:['Z3']});assert.equal(db.tables.email_deliveries.length,2);});
 await check('Refunded orders, cancelled orders, failed status and missing tracking never claim shipment',async()=>{for(const status of ['refunded','cancelled','pending'])await delivery.queueShipmentNotification({...order,status},shipment);for(const status of ['pending','failed','delivered'])await delivery.queueShipmentNotification(order,{...shipment,status});await delivery.queueShipmentNotification(order,{...shipment,tracking_numbers:[' ',{}]});assert.equal(db.tables.email_deliveries.length,2);});
 await check('Shipment delivery never sets the payment receipt marker',async()=>{await delivery.deliverEmail(db.tables.email_deliveries[0].key);assert.equal(db.tables.orders[0].confirmation_sent_at,null);assert.equal(sends,1);});
 await check('Receipt delivery still sets its own confirmation marker',async()=>{const key='order/live/'+order.id;await delivery.queueEmail(key,'order',{to:'qa@example.com',subject:'receipt',text:'receipt',html:'receipt'},true,order.id);await delivery.deliverEmail(key);assert.ok(db.tables.orders[0].confirmation_sent_at);});
 const template=load('src/lib/emails/shipment-notification.ts');
 await check('Supplier strings are escaped and supplier links cannot enter the email',()=>{const msg=template.buildShipmentNotification(order,{...shipment,tracking_company:'<img src=x onerror=alert(1)>',tracking_numbers:['<script>oops</script>']});assert.ok(!msg.html.includes('<script>'));assert.ok(!msg.html.includes('javascript:'));assert.match(msg.html,/&lt;script&gt;/);assert.match(msg.html,/mailto:hello@goool.shop/);assert.match(msg.html,/Items in your order may ship separately/);});
 const identity=load('src/lib/shipment.ts');
 await check('Shipment row IDs deduplicate equivalent statuses without losing delivered updates',()=>{assert.equal(identity.shipmentRowId(shipment),identity.shipmentRowId({...shipment,status:'shipped',tracking_numbers:['Z1','Z2']}));assert.notEqual(identity.shipmentRowId(shipment),identity.shipmentRowId({...shipment,status:'delivered'}));});
 let signed=true,queueFails=true;const rows=new Set();
 const store={getOrderByExternalId:async()=>order,getOrderByApliiqId:async()=>null,addShipment:async s=>rows.add(identity.shipmentRowId(s)),setFulfillmentStatus:async()=>{}};
 const route=load('src/app/api/apliiq-fulfillment/route.ts',{'@/lib/apliiq':{verifyFulfillmentSignature:()=>signed},'@/lib/orders-store':{getOrdersStore:()=>store},'@/lib/email-delivery':{queueShipmentNotification:async(o,s)=>{if(queueFails)throw new Error('database unavailable');return delivery.queueShipmentNotification(o,s);}}});
 const req={text:async()=>JSON.stringify({fulfillment:{...shipment,order_id:123}}),headers:{get:()=>signed?'signed':null}};
 await check('Untrusted callbacks cannot store shipments or queue emails',async()=>{signed=false;assert.equal((await route.POST(req)).status,401);assert.equal(rows.size,0);signed=true;});
 await check('Queue failure does not acknowledge success; replay safely recovers',async()=>{await assert.rejects(()=>route.POST(req));queueFails=false;assert.equal((await route.POST(req)).status,200);assert.equal(rows.size,1);assert.equal(db.tables.email_deliveries.filter(r=>r.key.startsWith('shipment/')).length,2);});
 const preview=template.buildShipmentNotification(order,shipment);
 fs.mkdirSync(path.join(__dirname,'../tmp'),{recursive:true});fs.writeFileSync(path.join(__dirname,'../tmp/shipment-email-preview.html'),preview.html);
 console.log(`${passed} shipment checks passed.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
