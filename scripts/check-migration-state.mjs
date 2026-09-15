/**
 * Read-only probe of the LIVE Supabase project's migration state.
 * Uses only the public anon key (shipped to every browser by design);
 * RLS keeps all order data invisible. Prints findings, never values.
 *
 *   npx netlify dev:exec -- node scripts/check-migration-state.mjs
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anon) {
  console.error("Supabase env not injected; run under `netlify dev:exec`.");
  process.exit(1);
}
const headers = { apikey: anon, Authorization: `Bearer ${anon}` };

async function probe(path, label) {
  const res = await fetch(`${url}/rest/v1/${path}`, { headers });
  const body = await res.text();
  let verdict;
  if (res.status === 200) verdict = "EXISTS (RLS returns empty set to anon)";
  else if (res.status === 404 || /PGRST205|does not exist/.test(body)) verdict = "MISSING";
  else if (res.status === 400 && /column/.test(body)) verdict = "TABLE EXISTS, COLUMN MISSING";
  else if (res.status === 401 || res.status === 403) verdict = "EXISTS (denied to anon)";
  else verdict = `UNCLEAR (HTTP ${res.status}: ${body.slice(0, 120)})`;
  console.log(`${label.padEnd(46)} ${verdict}`);
  return verdict;
}

console.log("— Live Supabase migration state —");
// base schema (0001)
await probe("products?select=id&limit=1", "products (0001)");
const products = await fetch(`${url}/rest/v1/products?select=id&is_active=eq.true`, {
  headers: { ...headers, Prefer: "count=exact", Range: "0-0" },
});
console.log(`active products visible to storefront:${" ".repeat(9)}${products.headers.get("content-range") ?? "?"}`);
await probe("orders?select=id&limit=1", "orders (0001)");
await probe("order_items?select=id&limit=1", "order_items (0001)");
// 0026 tables
await probe("stripe_events?select=id&limit=1", "stripe_events (0026)");
await probe("order_shipments?select=id&limit=1", "order_shipments (0026)");
// 0026 columns on orders
await probe("orders?select=livemode&limit=1", "orders.livemode (0026)");
await probe("orders?select=submission_attempt_id&limit=1", "orders.submission_attempt_id (0026)");
await probe("orders?select=submission_status&limit=1", "orders.submission_status (0026)");
await probe("orders?select=lookup_token&limit=1", "orders.lookup_token (0026)");
