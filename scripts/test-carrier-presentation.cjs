const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (name, parent, ...rest) {
  return originalResolve.call(this, name.startsWith("@/") ? path.resolve(__dirname, "../src", name.slice(2)) : name, parent, ...rest);
};
for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, filename);
}
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const helpers = require("../src/lib/carrier-tracking/presentation.ts");
const ShipmentTracking = require("../src/components/ShipmentTracking.tsx").default;
let passed = 0;
function check(name, callback) { callback(); passed++; console.log("PASS " + name); }
// Entirely synthetic identifiers and cities. No customer fixtures or provider requests.
const base = {
  id: "fixture-package", carrier: "USPS", trackingNumber: "TEST-TRACKING-0001", carrierUrl: null,
  status: "pre_transit", detail: null, events: [], estimatedDelivery: null,
  updatedAt: null, lastSyncedAt: null, stale: false,
};
const event = (id, occurredAt, city, message) => ({
  id, occurredAt, message, status: "in_transit", detail: null,
  location: city ? { city, state: null, postalCode: null, country: null } : null,
});
const render = (packages, options = {}) => renderToStaticMarkup(React.createElement(ShipmentTracking, {
  packages, loading: false, available: true, ...options,
}));

check("empty USPS tracking URL gets an encoded official link", () => {
  assert.equal(helpers.safeCarrierUrl("USPS", "TEST/123?x#y", ""), "https://tools.usps.com/go/TrackConfirmAction?tLabels=TEST%2F123%3Fx%23y");
  assert.match(render([base]), /View on carrier website/);
  assert.match(render([base]), /https:\/\/tools\.usps\.com\/go\/TrackConfirmAction\?tLabels=TEST-TRACKING-0001/);
});
check("untrusted carrier URLs cannot inject another scheme, host, credentials, port or checkout email", () => {
  for (const url of ["javascript:alert(1)", "data:text/html,hello", "https://tools.usps.com.attacker.invalid/", "https://tools.usps.com@attacker.invalid/", "https://user:password@tools.usps.com/", "https://tools.usps.com:444/", "http://tools.usps.com/"]) {
    assert.equal(helpers.validateCarrierUrl("USPS", url), null, url);
    assert.equal(helpers.safeCarrierUrl("USPS", base.trackingNumber, url), helpers.safeCarrierUrl("USPS", base.trackingNumber));
  }
  const html = render([{ ...base, carrierUrl: "https://tools.usps.com/?email=fixture%40example.invalid" }]);
  assert.doesNotMatch(html, /fixture|%40|email=/);
  assert.equal(helpers.safeCarrierUrl("UnknownCarrier", base.trackingNumber), null);
  assert.equal(helpers.validateCarrierUrl("USPS", "https://www.ups.com/track"), null);
});
check("repeated callbacks, multiple numbers and number reorderings become independent package cards", () => {
  const shipments = [
    { carrier: "U.S.P.S.", trackingNumbers: ["TEST-A", "TEST-B", "TEST-A"], trackingUrls: [] },
    { carrier: "USPS", trackingNumbers: ["TEST-B", "TEST-A"], trackingUrls: [] },
    { carrier: "UPS", trackingNumbers: ["TEST-C"], trackingUrls: [] },
  ];
  const packages = helpers.uniqueShipmentPackages(shipments);
  assert.equal(packages.length, 3);
  const html = render(packages.map((pkg, index) => ({ ...pkg, status: index === 0 ? "delivered" : "in_transit" })));
  assert.equal((html.match(/<article/g) ?? []).length, 3);
  assert.doesNotMatch(html, /order (?:is |was )?delivered|all (?:items|packages).*delivered/i);
});
check("label creation does not claim carrier possession or present location", () => {
  const html = render([{ ...base, events: [event("label", "2026-01-10T09:00:00-05:00", "Fixture Origin", "Shipping label created")] }]);
  assert.match(html, /Label created — USPS awaiting package/);
  assert.match(html, /does not confirm that the carrier has received/);
  assert.match(html, /Reported event location: Fixture Origin/);
  assert.doesNotMatch(html, /current (?:parcel )?location|live GPS/i);
});
check("supported carrier states remain specific, while provider errors are availability limitations", () => {
  for (const [status, label] of Object.entries({
    accepted: "Accepted by carrier", in_transit: "In transit", out_for_delivery: "Out for delivery",
    delivered: "Delivered", exception: "Delivery exception", available_for_pickup: "Available for pickup",
    return_to_sender: "Returning to sender", returned: "Returned to sender", error: "Tracking information unavailable",
  })) {
    assert.ok(render([{ ...base, status }]).includes(label), status);
  }
  assert.doesNotMatch(render([{ ...base, status: "error" }]), /Carrier-reported delay/);
});
check("carrier scans are chronological and preserve reported timezone offsets", () => {
  const events = [
    event("later", "2026-01-11T03:00:00Z", "Fixture B", "Departed fixture facility"),
    event("earlier", "2026-01-10T20:00:00-05:00", "Fixture A", "Arrived fixture facility"),
  ];
  assert.deepEqual(helpers.chronologicalEvents(events).map(event => event.id), ["earlier", "later"]);
  const html = render([{ ...base, status: "in_transit", events }]);
  assert.match(html, /2026-01-10 20:00:00 \(UTC-05:00\)/);
  assert.match(html, /2026-01-11 03:00:00 \(UTC\)/);
  assert.ok(html.indexOf("<ol>") < html.indexOf("<li"));
  assert.ok(html.lastIndexOf("Arrived fixture facility") < html.lastIndexOf("Departed fixture facility"));
});
check("missing timestamps, locations and estimates remain missing", () => {
  const html = render([{ ...base, status: "in_transit", events: [event("unknown", null, null, "Processing")] }]);
  assert.match(html, /Time unavailable/);
  assert.doesNotMatch(html, /estimated delivery|Reported event location|Event location|2026-/i);
  assert.equal(helpers.formatTimestamp("2026-01-10T10:43:00"), "2026-01-10 10:43:00 (time zone not supplied)");
  assert.equal(helpers.formatTimestamp("2026-01-10"), "2026-01-10 (date only; time zone not supplied)");
});
check("carrier estimate and stale cached history are explicitly labeled", () => {
  const html = render([{ ...base, status: "in_transit", estimatedDelivery: "2026-01-13", stale: true, lastSyncedAt: "2026-01-11T12:00:00Z" }]);
  assert.match(html, /Carrier estimated delivery:/);
  assert.match(html, /last saved carrier updates/);
  assert.match(html, /Last synchronized:/);
  assert.doesNotMatch(html, /7–12|live GPS|guaranteed/i);
});
check("delivery after a return scan does not claim customer delivery", () => {
  const returned = { ...event("return", "2026-01-11T10:00:00Z", null, "Returning to sender"), status: "return_to_sender" };
  const html = render([{ ...base, status: "delivered", events: [returned, { ...event("delivered", "2026-01-12T12:00:00Z", null, "Delivered"), status: "delivered" }] }]);
  assert.match(html, /Delivery reported after return-to-sender scan/);
  assert.doesNotMatch(html, /order delivered|delivered to (?:you|customer)/i);
});
check("missing or incomparable timestamp zones preserve reported order without a precise latest-event claim", () => {
  const events = [event("zoned", "2026-01-11T03:00:00Z", null, "Fixture dated scan"), event("naive", "2026-01-10T20:00:00", null, "Fixture naive scan"), event("undated", null, null, "Fixture undated scan")];
  assert.deepEqual(helpers.chronologicalEvents(events).map(event => event.id), ["zoned", "naive", "undated"]);
  const html = render([{ ...base, status: "in_transit", events }]);
  assert.match(html, /Carrier event report/);
  assert.match(html, /where timestamps or time zones cannot be compared/);
  assert.doesNotMatch(html, /Last reported carrier event/);
});
check("provider unavailable and no-tracking cases give truthful fallback feedback", () => {
  assert.match(render([base], { available: false }), /order status is still shown/);
  assert.match(render([], { available: false }), /No package tracking numbers have been supplied/);
  assert.match(render([base], { loading: true, available: false }), /Checking saved carrier updates/);
  assert.doesNotMatch(render([base], { loading: true, available: false }), /Carrier history is unavailable here/);
});
console.log(`${passed} carrier presentation suites passed. All fixtures synthetic; no external calls made.`);
