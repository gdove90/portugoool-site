import http from 'node:http';
import assert from 'node:assert/strict';
const base=process.argv[2];let calls=[],status=200;let passed=0;
const server=http.createServer((req,res)=>{calls.push({method:req.method,url:req.url});res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify([{id:1,email:'private-customer-data'}]));});
await new Promise(r=>server.listen(4242,'127.0.0.1',r));
const call=key=>fetch(base+'/api/fulfillment-ops',{method:'POST',headers:{'content-type':'application/json',...(key?{'x-ops-key':key}:{})},body:JSON.stringify({action:'status'})});
function check(name,condition){assert.ok(condition,name);passed++;console.log('PASS '+name);}
try{
 for(const key of [undefined,'wrong','é'.repeat(32)]){const r=await call(key);check('rejects missing/incorrect/multibyte operator key',r.status===401);}
 check('unauthorized probes never contact supplier',calls.length===0);
 const r=await call('test_ops_key_0123456789abcdef'),text=await r.text(),body=JSON.parse(text);
 check('authorized diagnostic succeeds',r.status===200);
 check('diagnostic is not cached',r.headers.get('cache-control')==='no-store');
 check('supplier authentication reflected',body.supplier.authenticated===true&&body.supplier.status===200);
 check('storage connection checked',body.orderStorageConnected===true);
 check('email correctly reported disabled',body.emailProvider==='disabled');
 check('no secrets or supplier customer data returned',!text.includes('private-customer-data')&&!text.includes('test_apliiq')&&!text.includes('test_app_id'));
 status=401;const rejected=await (await call('test_ops_key_0123456789abcdef')).json();check('rejected supplier credentials reported accurately',rejected.supplier.authenticated===false&&rejected.supplier.status===401);
 check('supplier probes only GET current-month orders',calls.length===2&&calls.every(x=>x.method==='GET'&&/^\/v1\/Order\?month=\d+&year=\d+$/.test(x.url)));
 console.log(`${passed} passed, 0 failed`);
}finally{server.close();}
