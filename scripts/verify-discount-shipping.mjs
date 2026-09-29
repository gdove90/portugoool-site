// Verification for branch checkout/discount-before-shipping. Stripe TEST
// mode only. Posts carts to the local /api/checkout, then reads each
// created session back from Stripe (amount_subtotal, discount, shipping,
// total, allow_promotion_codes) so the numbers come from Stripe itself.
import fs from "node:fs";
import { createRequire } from "node:module";
const Stripe = createRequire("C:/Users/gdove/OneDrive/Desktop/GOOOL/package.json")("stripe");
const BASE = process.argv[2] ?? "http://localhost:3001";
const codes = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
const env = Object.fromEntries(fs.readFileSync(".env.local", "utf8").split(/\r?\n/).filter(l => l.includes("=") && !l.startsWith("#")).map(l => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")]; }));
if (!env.STRIPE_SECRET_KEY.startsWith("sk_test_")) throw new Error("not a test key");
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const TEE = { productId: "70000000-0000-4000-8000-000000000001", size: "M", color: "Black", quantity: 1, customName: null, customNumber: null };
const CAP = { productId: "70000000-0000-4000-8000-000000000004", size: "OS", color: "Black/Natural", quantity: 1, customName: null, customNumber: null };
const HOODIE = { productId: "70000000-0000-4000-8000-000000000002", size: "L", color: "Black", quantity: 1, customName: null, customNumber: null };
const $ = (c) => (c / 100).toFixed(2);

async function post(body) {
  const r = await fetch(BASE + "/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  return { status: r.status, json: await r.json() };
}
async function session(url) {
  const id = new URL(url).pathname.split("/").pop().split("#")[0];
  const s = await stripe.checkout.sessions.retrieve(id, { expand: ["shipping_cost.shipping_rate"] });
  return { id: s.id, subtotal: s.amount_subtotal, discount: s.total_details?.amount_discount ?? 0, shipping: s.total_details?.amount_shipping ?? 0, total: s.amount_total, allow_promotion_codes: s.allow_promotion_codes, discounts: (s.discounts ?? []).map(d => d.promotion_code), shipping_rate: s.shipping_cost?.shipping_rate?.display_name, customer_email: s.customer_email, livemode: s.livemode };
}
const out = [];
async function run(name, body, expect) {
  const preview = await post({ ...body, preview: true });
  let sess = null, create = null;
  if (preview.status === 200) { create = await post(body); if (create.status === 200 && create.json.url) sess = await session(create.json.url); }
  const row = { name, request: { items: body.items.map(i => i.productId.slice(-1)), email: body.email ?? null, code: body.code ?? null }, preview, create: create ? { status: create.status, json: sess ? { url: "(session created)" } : create.json } : null, session: sess, expect };
  const got = sess ? { subtotal: sess.subtotal, discount: sess.discount, shipping: sess.shipping, total: sess.total } : { status: preview.status, reason: preview.json.reason ?? null };
  row.pass = JSON.stringify(got) === JSON.stringify(expect);
  out.push(row);
  console.log(`${row.pass ? "PASS" : "FAIL"}  ${name}`);
  if (sess) console.log(`      preview  $${$(preview.json.subtotalCents)} - $${$(preview.json.discountCents)} + ship $${$(preview.json.shippingCents)} = $${$(preview.json.totalCents)}`);
  if (sess) console.log(`      stripe   ${sess.id}  subtotal $${$(sess.subtotal)}  discount $${$(sess.discount)}  shipping $${$(sess.shipping)} (${sess.shipping_rate})  total $${$(sess.total)}  allow_promotion_codes=${sess.allow_promotion_codes}  discounts=${JSON.stringify(sess.discounts)}  email=${sess.customer_email}  livemode=${sess.livemode}`);
  else console.log(`      response ${preview.status} ${JSON.stringify(preview.json)}`);
  return row;
}

const E = codes.email, V = codes.valid.code;
await run("1 tee + cap, no code", { items: [TEE, CAP] }, { subtotal: 7000, discount: 0, shipping: 0, total: 7000 });
await run("2 tee + cap + GOOOL20", { items: [TEE, CAP], email: E, code: V }, { subtotal: 7000, discount: 1400, shipping: 695, total: 6295 });
await run("3 hoodie + tee + GOOOL20", { items: [HOODIE, TEE], email: E, code: V }, { subtotal: 11600, discount: 2320, shipping: 0, total: 9280 });
await run("4 tee + GOOOL20", { items: [TEE], email: E, code: V }, { subtotal: 3800, discount: 760, shipping: 695, total: 3735 });
await run("5a expired code", { items: [TEE], email: E, code: codes.expiring.code }, { status: 400, reason: "expired" });
await run("5b used code", { items: [TEE], email: E, code: codes.used?.code ?? "GOOOL20-USED" }, { status: 400, reason: codes.used ? "used" : "unknown" });
await run("5c wrong email", { items: [TEE], email: codes.otherEmail, code: V }, { status: 400, reason: "email" });
await run("5d unknown code", { items: [TEE], email: E, code: "GOOOL20-ZZZZ" }, { status: 400, reason: "unknown" });
await run("5e bad format", { items: [TEE], email: E, code: "GOOOL20" }, { status: 400, reason: "format" });
await run("5f code without email", { items: [TEE], code: V }, { status: 400, reason: "email" });
await run("7a tee, no code", { items: [TEE] }, { subtotal: 3800, discount: 0, shipping: 695, total: 4495 });
await run("7b hoodie, no code", { items: [HOODIE] }, { subtotal: 7800, discount: 0, shipping: 0, total: 7800 });
await run("7c cap, no code", { items: [CAP] }, { subtotal: 3200, discount: 0, shipping: 695, total: 3895 });
fs.writeFileSync(process.argv[4] ?? "tmp/verify-results.json", JSON.stringify(out, null, 2));
console.log(`\n${out.filter(r => r.pass).length}/${out.length} passed`);
process.exit(out.every(r => r.pass) ? 0 : 1);
