// Mocked request/database/provider integration only. Never reads local credentials
// or contacts a real provider, commerce service, or customer.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const crypto = require("node:crypto");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const originalLoad = Module._load;
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (name, parent, ...rest) {
  return originalResolve.call(this, name.startsWith("@/") ? path.join(root, "src", name.slice(2)) : name, parent, ...rest);
};
require.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, filename);
const env = { ...process.env };
const realFetch = global.fetch;
const enabledConfig = {
  CONTEXT: "production", CARRIER_TRACKING_ENABLED: "true", EASYPOST_API_KEY: "fixture-key-only",
  EASYPOST_WEBHOOK_SECRET: "fixture-webhook-secret-only", CARRIER_TRACKING_OPS_KEY: "fixture-tracking-ops-key-over-32-characters",
  NEXT_PUBLIC_SUPABASE_URL: "https://oexibflpshttgzmdvhpr.supabase.co", NETLIFY: "true",
};
Object.assign(process.env, enabledConfig);
delete process.env.NEXT_PUBLIC_MIGRATION_PREVIEW;
let requests = 0;
let externalCalls = 0;
global.fetch = async () => { externalCalls++; throw new Error("Unexpected external request blocked by test."); };
let calls = [];
let orderEmailCalls = [];
let db = null;
let storeAvailable = true;
const orders = [
  { id: "11111111-0000-4000-8000-000000000001", status: "paid", customer_email: "fixture@example.invalid", fulfillment_status: "shipped" },
  { id: "22222222-0000-4000-8000-000000000002", status: "pending", customer_email: "fixture@example.invalid", fulfillment_status: "unfulfilled" },
  { id: "33333333-0000-4000-8000-000000000003", status: "refunded", customer_email: "fixture@example.invalid", fulfillment_status: "shipped" },
];
const shipments = [{ tracking_company: "USPS", tracking_numbers: ["TESTTRACK0001"], tracking_urls: [] }];
const store = {
  async listOrdersByEmail(email) { orderEmailCalls.push(email); return orders.filter(order => order.customer_email.toLowerCase() === email.trim().toLowerCase()); },
  async listShipments() { return shipments; },
};
const mocks = {
  [path.join(root, "src/lib/orders-store.ts")]: { getOrdersStore: () => storeAvailable ? store : null },
  [path.join(root, "src/lib/fulfillment-submit.ts")]: { orderNumber: id => "GOOOL-" + id.slice(0, 8).toUpperCase() },
  [path.join(root, "src/lib/supabase.ts")]: { getSupabaseAdmin: () => db },
};
Module._load = function (request, parent, isMain) {
  const filename = Module._resolveFilename(request, parent);
  return mocks[filename] ?? originalLoad.call(this, request, parent, isMain);
};
const { NextRequest } = require("next/server");
const config = require("../src/lib/carrier-tracking/config.ts");
const preview = require("../src/lib/migration-preview.ts");
const detailsRoute = require("../src/app/api/track-order-details/route.ts");
const legacyRoute = require("../src/app/api/track-order/route.ts");
const webhookRoute = require("../src/app/api/carrier-tracking-webhook/route.ts");
const opsRoute = require("../src/app/api/carrier-tracking-ops/route.ts");
const { runTrackingWorker } = require("../src/lib/carrier-tracking/worker.ts");
const { middleware } = require("../src/middleware.ts");
let passed = 0;
async function check(name, callback) { await callback(); passed++; console.log("PASS " + name); }
function request(body, route = "/api/track-order-details", extra = {}) {
  return new NextRequest("https://goalathletics.shop" + route, {
    method: "POST", headers: { "content-type": "application/json", "x-nf-client-connection-ip": `198.51.100.${++requests}`, ...extra },
    ...(body === undefined ? {} : { body: typeof body === "string" ? body : JSON.stringify(body) }),
  });
}
const credentials = { reference: "GOOOL-11111111", email: "fixture@example.invalid" };
let tableRows = {};
let rpc = async name => ({ data: name === "carrier_tracking_rate" ? 1 : null, error: null });
function mockDatabase() {
  return {
    rpc: async (name, args) => { calls.push({ rpc: name, args }); return rpc(name, args); },
    from(table) {
      const filters = [];
      calls.push({ table, filters });
      const query = {};
      for (const method of ["select", "eq", "in", "order", "limit"]) query[method] = (...args) => { filters.push([method, ...args]); return query; };
      query.then = (resolve, reject) => Promise.resolve(typeof tableRows[table] === "function" ? tableRows[table](filters) : { data: tableRows[table] ?? [], error: null }).then(resolve, reject);
      return query;
    },
  };
}
const tracker = (overrides = {}) => ({
  object: "Tracker", id: "trk_fixtureA", mode: "production", tracking_code: "TESTTRACK0001", carrier: "USPS",
  status: "pre_transit", status_detail: "label_created", tracking_details: [],
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...overrides,
});
function signedEvent({ mode = "production", id = "evt_fixtureA", age = 0, invalid = false } = {}) {
  const body = JSON.stringify({ object: "Event", id, mode, description: "tracker.updated", created_at: new Date().toISOString(), result: tracker({ mode }) });
  const sentAt = new Date(Date.now() - age).toUTCString().replace("GMT", "+0000");
  const route = "/api/carrier-tracking-webhook";
  const signature = crypto.createHmac("sha256", enabledConfig.EASYPOST_WEBHOOK_SECRET).update(sentAt + "POST" + route + body).digest("hex");
  return request(body, route, { "x-timestamp": sentAt, "x-path": route, "x-hmac-signature-v2": "hmac-sha256-hex=" + (invalid ? "0".repeat(64) : signature) });
}

(async () => {
  await check("disabled flag and absent credentials keep the original lookup available", async () => {
    process.env.CARRIER_TRACKING_ENABLED = "false";
    let response = await detailsRoute.POST(request(credentials));
    assert.equal(response.status, 200); assert.equal((await response.json()).available, false);
    assert.equal((await legacyRoute.POST(request(credentials, "/api/track-order"))).status, 200);
    Object.assign(process.env, enabledConfig); delete process.env.EASYPOST_API_KEY;
    response = await detailsRoute.POST(request(credentials));
    assert.equal((await response.json()).available, false);
    Object.assign(process.env, enabledConfig);
  });
  await check("details independently require matching reference and checkout email, hide pending, and trim email", async () => {
    db = mockDatabase();
    const failures = [];
    for (const value of [{ ...credentials, email: "wrong@example.invalid" }, { ...credentials, reference: "GOOOL-99999999" }, { ...credentials, reference: "GOOOL-22222222" }]) {
      const response = await detailsRoute.POST(request(value)); failures.push([response.status, await response.json()]);
    }
    assert.deepEqual(failures[0], [404, { error: "No order matches that reference and email." }]);
    assert.deepEqual(failures[1], failures[0]); assert.deepEqual(failures[2], failures[0]);
    const response = await detailsRoute.POST(request({ reference: " goool-11111111 ", email: " FIXTURE@example.invalid " }));
    assert.equal(response.status, 200); assert.equal((await response.json()).available, true);
    assert.equal(orderEmailCalls.at(-1), "FIXTURE@example.invalid");
  });
  await check("invalid bodies and oversized inputs are bounded before data access", async () => {
    for (const body of [null, [], "{", { reference: 42, email: credentials.email }, { ...credentials, email: {} }, { ...credentials, reference: "X".repeat(65) }, { ...credentials, email: "a".repeat(255) }]) {
      assert.equal((await detailsRoute.POST(request(body))).status, 400);
    }
    assert.equal((await detailsRoute.POST(request("X".repeat(2049)))).status, 413);
  });
  await check("cache reads are order-scoped, sanitized, private and never call the provider", async () => {
    calls = []; const beforeExternal = externalCalls;
    tableRows = {
      carrier_tracking_packages: [{ id: "fixture-package", carrier: "USPS", tracking_number: "TESTTRACK0001", last_synced_at: new Date().toISOString(),
        snapshot: { status: "pre_transit", detail: "label_created", events: [], updatedAt: "2026-01-01T12:00:00Z", estimatedDelivery: null, recipient: "PRIVATE RECIPIENT", payment_id: "PRIVATE PAYMENT", raw: {} } }],
      carrier_tracking_events: [],
    };
    const response = await detailsRoute.POST(request(credentials)); const body = await response.json();
    assert.equal(body.available, true); assert.equal(body.packages.length, 1);
    assert.equal(body.packages[0].status, "pre_transit");
    assert.doesNotMatch(JSON.stringify(body), /PRIVATE|payment_id|recipient|raw/);
    assert.match(response.headers.get("cache-control"), /private.*no-store/);
    assert.equal(externalCalls, beforeExternal);
    const query = calls.find(call => call.table === "carrier_tracking_packages");
    assert.ok(query.filters.some(filter => filter[0] === "eq" && filter[1] === "order_id" && filter[2] === orders[0].id));
    assert.ok(query.filters.some(filter => filter[0] === "eq" && filter[1] === "environment" && filter[2] === "production"));
    for (let i = 0; i < 3; i++) await detailsRoute.POST(request(credentials));
    assert.equal(externalCalls, beforeExternal);
    assert.ok(calls.every(call => !call.rpc || call.rpc === "carrier_tracking_rate"));
  });
  await check("missing tracking schema and storage outages do not replace legacy success", async () => {
    tableRows.carrier_tracking_packages = () => ({ data: null, error: { code: "42P01" } });
    assert.equal((await (await detailsRoute.POST(request(credentials))).json()).available, false);
    const legacy = await legacyRoute.POST(request(credentials, "/api/track-order"));
    assert.deepEqual(await legacy.json(), { reference: credentials.reference, status: "Shipped.", shipments: [{ carrier: "USPS", trackingNumbers: ["TESTTRACK0001"], trackingUrls: [] }] });
    db = null;
    assert.equal((await (await detailsRoute.POST(request(credentials))).json()).available, false);
    assert.equal((await legacyRoute.POST(request(credentials, "/api/track-order"))).status, 200);
    db = mockDatabase(); tableRows = {};
  });
  await check("shared abuse control refuses excess attempts without exposing order data", async () => {
    rpc = async name => ({ data: name === "carrier_tracking_rate" ? 31 : null, error: null });
    const before = orderEmailCalls.length;
    assert.equal((await detailsRoute.POST(request(credentials))).status, 429);
    assert.equal(orderEmailCalls.length, before);
    rpc = async name => ({ data: name === "carrier_tracking_rate" ? 1 : null, error: null });
  });
  await check("signed duplicate and early mapping webhooks commit through the durable inbox RPC", async () => {
    calls = [];
    rpc = async name => ({ data: name === "carrier_tracking_receive" ? false : null, error: null });
    for (let i = 0; i < 2; i++) {
      const response = await webhookRoute.POST(signedEvent()); assert.equal(response.status, 200); assert.equal((await response.json()).received, true);
    }
    assert.equal(calls.filter(call => call.rpc === "carrier_tracking_receive").length, 2);
    assert.equal(calls[0].args.p_environment, "production");
    assert.ok(calls.every(call => call.rpc === "carrier_tracking_receive"));
  });
  await check("invalid signatures, stale replays and cross-environment webhooks never write", async () => {
    calls = [];
    assert.equal((await webhookRoute.POST(signedEvent({ invalid: true }))).status, 401);
    assert.equal((await webhookRoute.POST(signedEvent({ age: 120000 }))).status, 401);
    assert.equal((await webhookRoute.POST(signedEvent({ mode: "test" }))).status, 400);
    assert.equal(calls.length, 0);
  });
  await check("webhook database failure returns retryable 503 before acknowledgement", async () => {
    rpc = async () => ({ data: null, error: { code: "fixture_write_failure" } });
    assert.equal((await webhookRoute.POST(signedEvent())).status, 503);
  });
  await check("operations use the separate tracking secret and cannot run in a preview", async () => {
    assert.equal((await opsRoute.POST(request(undefined, "/api/carrier-tracking-ops", { "x-ops-key": enabledConfig.CARRIER_TRACKING_OPS_KEY }))).status, 401);
    process.env.CONTEXT = "deploy-preview";
    assert.equal(config.trackingConfig(), null);
    assert.equal((await opsRoute.POST(request(undefined, "/api/carrier-tracking-ops", { "x-tracking-ops-key": enabledConfig.CARRIER_TRACKING_OPS_KEY }))).status, 503);
    Object.assign(process.env, enabledConfig);
    delete process.env.CONTEXT;
    assert.equal(config.trackingConfig()?.mode, "production");
    process.env.CARRIER_TRACKING_ENABLED = "false";
    assert.equal(config.trackingConfig(), null);
    Object.assign(process.env, enabledConfig);
    preview.MIGRATION_PREVIEW = true;
    assert.equal(config.trackingConfig(), null);
    preview.MIGRATION_PREVIEW = false;
  });
  await check("only exact new tracking paths bypass the store gate, while design preview still denies them", async () => {
    process.env.STORE_OPEN = "false"; process.env.PREVIEW_KEY = "fixture-preview-only";
    for (const route of ["/api/track-order-details", "/api/carrier-tracking-webhook", "/api/carrier-tracking-ops"]) {
      const result = await middleware(request({}, route)); assert.equal(result.headers.get("x-middleware-next"), "1");
      assert.equal((await middleware(request({}, route + "/extra"))).status, 401);
      preview.MIGRATION_PREVIEW = true;
      assert.equal((await middleware(request({}, route))).status, 503);
      preview.MIGRATION_PREVIEW = false;
    }
    assert.equal((await middleware(request({}, "/api/checkout"))).status, 401);
  });
  const claimed = { id: "fixture-package", order_id: orders[0].id, carrier: "USPS", tracking_number: "TESTTRACK0001", environment: "production", tracker_id: null,
    lease_token: "11111111-0000-4000-8000-000000000099", registration_started_at: null, attempts: 1 };
  const workerConfig = { key: "fixture-key-only", webhookSecret: "fixture-secret-only", opsSecret: enabledConfig.CARRIER_TRACKING_OPS_KEY, mode: "production" };
  let claimedRows = [];
  const workerDb = { rpc: async (name, args) => {
    calls.push({ rpc: name, args });
    return { error: null, data: name === "carrier_tracking_claim" ? claimedRows : name === "carrier_tracking_health" ? { review: 0, pendingRetry: 0, stale: 0, unmappedWebhooks: 0 } : name === "carrier_tracking_discover" ? 0 : true };
  } };
  await check("worker registers an individual claimed package once and only through the tracking API", async () => {
    calls = []; claimedRows = [claimed]; const providerRequests = [];
    global.fetch = async (url, init) => { providerRequests.push({ url: String(url), init }); return Response.json(tracker()); };
    const counts = await runTrackingWorker(workerDb, workerConfig);
    assert.equal(counts.processed, 1); assert.equal(providerRequests.length, 1);
    assert.equal(providerRequests[0].url, "https://api.easypost.com/v2/trackers");
    assert.equal(providerRequests[0].init.method, "POST");
    assert.deepEqual(JSON.parse(providerRequests[0].init.body), { tracker: { tracking_code: claimed.tracking_number, carrier: "USPS", options: { is_return: false } } });
    assert.ok(calls.findIndex(call => call.rpc === "carrier_tracking_start") < calls.findIndex(call => call.rpc === "carrier_tracking_finish"));
    assert.ok(calls.every(call => call.rpc.startsWith("carrier_tracking_")));
  });
  await check("ambiguous registration retries search only and never create another billable tracker", async () => {
    calls = []; claimedRows = [{ ...claimed, registration_started_at: new Date(Date.now() - 120000).toISOString() }]; const providerRequests = [];
    global.fetch = async (url, init) => { providerRequests.push({ url: String(url), method: init.method }); return Response.json({ trackers: [], has_more: false }); };
    const counts = await runTrackingWorker(workerDb, workerConfig);
    assert.equal(counts.retry, 1); assert.equal(providerRequests.length, 1);
    assert.equal(providerRequests[0].method, "GET"); assert.match(providerRequests[0].url, /\/trackers\?/);
    assert.ok(!calls.some(call => call.rpc === "carrier_tracking_start" || call.rpc === "carrier_tracking_finish"));
  });
  await check("mapped trackers reconcile through read-only GET and reject mismatched identities", async () => {
    calls = []; claimedRows = [{ ...claimed, tracker_id: "trk_fixtureA", registration_started_at: new Date().toISOString() }]; const providerRequests = [];
    global.fetch = async (url, init) => { providerRequests.push(init.method); return Response.json(tracker()); };
    assert.equal((await runTrackingWorker(workerDb, workerConfig)).processed, 1);
    assert.deepEqual(providerRequests, ["GET"]);
    global.fetch = async () => Response.json(tracker({ tracking_code: "OTHERORDER0001" }));
    calls = [];
    assert.equal((await runTrackingWorker(workerDb, workerConfig)).retry, 1);
    assert.ok(!calls.some(call => call.rpc === "carrier_tracking_finish"));
  });
  await check("provider network timeout enters bounded retry and exhausted claims require review", async () => {
    global.fetch = async () => { throw new TypeError("Fixture network unavailable"); };
    calls = []; claimedRows = [claimed];
    assert.equal((await runTrackingWorker(workerDb, workerConfig)).retry, 1);
    claimedRows = [{ ...claimed, attempts: 6 }];
    assert.equal((await runTrackingWorker(workerDb, workerConfig)).review, 1);
    assert.ok(calls.filter(call => call.rpc === "carrier_tracking_fail").every(call => !JSON.stringify(call).includes("Fixture network")));
  });
  console.log(`${passed} mocked tracking route/worker integration suites passed. No external requests or commerce mutations.`);
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => {
  global.fetch = realFetch;
  Module._load = originalLoad; Module._resolveFilename = originalResolve;
  for (const key of Object.keys(process.env)) if (!(key in env)) delete process.env[key];
  Object.assign(process.env, env);
});
