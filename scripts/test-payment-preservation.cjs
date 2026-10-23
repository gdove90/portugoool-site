// Non-transactional migration checks: no Stripe SDK, fetch, credentials,
// Checkout Sessions, server launch, database writes or supplier submissions.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const {execFileSync} = require('node:child_process');
const {createHash} = require('node:crypto');
// The reviewed production commit the payment path is pinned to. Move it only
// after a change to these files has been reviewed and deployed 
// 0392275, the rebranded customer emails and legal lines, after the Stripe inspection
// and the owner alert address). The legacy pin predates the catalog
// retirements and the hat/ST720 blocks, which its comparison normalises away.
const LEGACY_BASELINE = 'e5f900866117d5e792638e1cff8e02ff076dc407';
const baseline = process.argv[2] || '039227515b2a52f5c97987b10d3a79a8a14b92b2';
const legacy = baseline === LEGACY_BASELINE;
const text = file => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const original = file => execFileSync('git', ['show', `${baseline}:${file}`], {encoding:'utf8'}).replace(/\r\n/g, '\n');
const files = [
  'src/app/api/stripe-webhook/route.ts', 'src/app/api/apliiq-fulfillment/route.ts',
  'src/app/api/fulfillment-ops/route.ts', 'src/app/api/track-order/route.ts',
  'src/lib/apliiq.ts', 'src/lib/fulfillment.ts', 'src/lib/fulfillment-submit.ts',
  'src/lib/orders-store.ts', 'src/lib/products.ts', 'src/lib/shipping.ts',
  'src/lib/discount.ts', 'src/lib/email.ts', 'src/lib/email-delivery.ts',
  'src/lib/shipment.ts', 'src/lib/types.ts', 'src/lib/supabase.ts',
  'src/lib/emails/order-confirmation.ts', 'src/lib/emails/shipment-notification.ts',
];
let checks = 0;
const evidence = {baseline, files:[], checks:[]};
function check(name, fn) {fn();checks++;evidence.checks.push(name);console.log('PASS '+name);}
check('payment, webhook authentication/handling, pricing, orders and fulfillment files equal production', () => {
  for (const file of files) {
    const content = legacy ? require('./retirement-baseline.cjs').withoutHatAdditions(text(file)) : text(file);
    let expected = original(file);
    if (legacy && file === 'src/lib/products.ts') expected = require('./retirement-baseline.cjs').applyRetirements(expected);
    if (legacy && file === 'src/app/api/track-order/route.ts') expected = expected.replaceAll('Email hello@goool.shop and', 'Email support@goalathletics.shop and');
    assert.equal(content, expected, file);
    evidence.files.push({file, normalizedSha256:createHash('sha256').update(content).digest('hex')});
  }
});
const checkout = text('src/app/api/checkout/route.ts');
check('checkout differs only by the explicit renovation/preview refusal', () => {
  const additions = [
    'import { MIGRATION_PREVIEW } from "@/lib/migration-preview";\n',
    'import { storeClosed } from "@/lib/store-status";\n',
    '  if (MIGRATION_PREVIEW || storeClosed()) return NextResponse.json({ error: "The store is closed for renovation. Existing orders remain supported." }, { status: 503 });\n',
  ];
  const stripAdditions = source => {
    for (const addition of additions) {assert.equal(source.split(addition).length, 2);source = source.replace(addition,'');}
    return source;
  };
  // The legacy pin predates the refusal; the current pin already carries it.
  const expected = original('src/app/api/checkout/route.ts');
  assert.equal(stripAdditions(checkout), legacy ? expected : stripAdditions(expected));
});
// Evaluate only the existing URL expressions from the syntax tree. Never
// evaluate the route, import Stripe or invoke sessions.create (even as a mock).
const source = ts.createSourceFile('checkout.ts', checkout, ts.ScriptTarget.Latest, true);
let originExpression, successExpression, cancelExpression;
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(source)==='siteUrl') originExpression=node.initializer.getText(source);
  if (ts.isPropertyAssignment(node)) {
    if(node.name.getText(source)==='success_url') successExpression=node.initializer.getText(source);
    if(node.name.getText(source)==='cancel_url') cancelExpression=node.initializer.getText(source);
  }
  ts.forEachChild(node, visit);
}
visit(source);
assert(originExpression && successExpression && cancelExpression);
function urls(env, origin) {
  const context={process:{env},req:{nextUrl:{origin}}};
  const siteUrl=vm.runInNewContext(originExpression,context,{timeout:100});
  return {success:vm.runInNewContext(successExpression,{siteUrl},{timeout:100}),cancel:vm.runInNewContext(cancelExpression,{siteUrl},{timeout:100})};
}
check('cutover configuration points success and cancel to goalathletics.shop even from a legacy origin', () => {
  const result=urls({NEXT_PUBLIC_SITE_URL:'https://goalathletics.shop',DOMAIN_CUTOVER_ENABLED:'true'},'https://goool.shop');
  assert.deepEqual(result,{success:'https://goalathletics.shop/success?session_id={CHECKOUT_SESSION_ID}',cancel:'https://goalathletics.shop/cart'});
  evidence.cutoverUrls=result;
});
check('unset site URL uses the new request origin without inventing a transaction', () => {
  assert.deepEqual(urls({},'https://goalathletics.shop'),evidence.cutoverUrls);
});
check('cutover flag alone does not override an old explicit site URL', () => {
  assert.equal(urls({NEXT_PUBLIC_SITE_URL:'https://goool.shop',DOMAIN_CUTOVER_ENABLED:'true'},'https://goalathletics.shop').cancel,'https://goool.shop/cart');
});
check('renovation refusal precedes credential lookup and all Checkout Session code', () => {
  assert(checkout.indexOf('if (MIGRATION_PREVIEW || storeClosed())') < checkout.indexOf('const secretKey'));
  assert(checkout.indexOf('if (MIGRATION_PREVIEW || storeClosed())') < checkout.indexOf('stripe.checkout.sessions.create'));
});
evidence.limit='No transaction performed. Hosted Checkout, issuer approval, fresh signed payment receipt and new supplier processing remain unverified by these checks.';
if(process.env.PAYMENT_AUDIT_OUTPUT) fs.writeFileSync(path.resolve(process.env.PAYMENT_AUDIT_OUTPUT),JSON.stringify(evidence,null,2));
console.log(`${checks} non-transactional payment preservation checks passed; ${files.length} core files match production.`);
