// Browser QA uses synthetic fixtures and intercepts the two lookup endpoints.
// Run against a local, nonoperational server; all external requests are blocked.
// Set CARRIER_PLAYWRIGHT_MODULE and optional CARRIER_BROWSER_EXECUTABLE when
// Playwright/browser are supplied by the workstation rather than this repository.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.CARRIER_PLAYWRIGHT_MODULE || "playwright");
const origin = process.argv[2] || "http://127.0.0.1:3997";
if (!/^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/.test(origin)) throw new Error("Synthetic browser QA requires a loopback server.");
const output = path.resolve(process.env.CARRIER_QA_OUTPUT || path.join(__dirname, "../tmp/carrier-tracking-qa"));
fs.mkdirSync(output, { recursive: true });
const location = city => ({ city, state: "QA", postalCode: null, country: "TEST" });
const events = [
  { id: "fixture-label", status: "pre_transit", detail: "label_created", message: "Shipping label created", occurredAt: "2026-01-10T09:00:00-05:00", location: location("Fixture Origin") },
  { id: "fixture-accepted", status: "in_transit", detail: "accepted", message: "Accepted by carrier", occurredAt: "2026-01-10T15:00:00-05:00", location: location("Fixture Origin") },
  { id: "fixture-arrived", status: "in_transit", detail: null, message: "Arrived at carrier facility", occurredAt: "2026-01-11T08:00:00-05:00", location: location("Fixture Destination") },
];
const packageFixture = (number, status = "in_transit") => ({
  id: "fixture-" + number, carrier: "USPS", trackingNumber: number, carrierUrl: null, status, detail: status === "pre_transit" ? "label_created" : null,
  events: status === "pre_transit" ? events.slice(0, 1) : events,
  estimatedDelivery: status === "pre_transit" ? null : "2026-01-13", updatedAt: "2026-01-11T13:00:00Z", lastSyncedAt: "2026-01-11T13:10:00Z", stale: false,
});
let passed = 0;
async function check(name, callback) { await callback(); passed++; console.log("PASS " + name); }
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CARRIER_BROWSER_EXECUTABLE ? { executablePath: process.env.CARRIER_BROWSER_EXECUTABLE } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
  const page = await context.newPage();
  let scenario = "normal";
  let releaseFirst;
  let detailsRequests = 0;
  let legacyRequests = 0;
  let abortedExternal = 0;
  const browserErrors = [];
  page.on("pageerror", error => browserErrors.push(error.message));
  await context.route("**/*", async route => {
    const request = route.request(); const url = new URL(request.url());
    if (url.origin !== origin) { abortedExternal++; return route.abort(); }
    if (url.pathname === "/api/track-order") {
      legacyRequests++;
      const { reference, email } = request.postDataJSON();
      assert.ok(email === "fixture@example.invalid");
      const numbers = reference === "GOOOL-22222222" ? ["TEST-PACKAGE-B"] : ["TEST-PACKAGE-A", "TEST-PACKAGE-SPLIT"];
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ reference, status: "Shipped.", shipments: [{ carrier: "USPS", trackingNumbers: numbers, trackingUrls: [] }] }) });
    }
    if (url.pathname === "/api/track-order-details") {
      detailsRequests++;
      const { reference, email } = request.postDataJSON(); assert.equal(email, "fixture@example.invalid");
      if (scenario === "timeout") return new Promise(() => {});
      if (scenario === "race" && reference === "GOOOL-11111111") await new Promise(resolve => { releaseFirst = resolve; });
      const packages = reference === "GOOOL-22222222" ? [packageFixture("TEST-PACKAGE-B", "out_for_delivery")] : [packageFixture("TEST-PACKAGE-A"), packageFixture("TEST-PACKAGE-SPLIT", "pre_transit")];
      try { return await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ available: true, packages }) }); } catch { /* An obsolete request may already be aborted. */ }
      return;
    }
    return route.continue();
  });
  const submit = async reference => {
    await page.locator("#track-ref").fill(reference);
    await page.locator("#track-email").fill("fixture@example.invalid");
    await page.getByRole("button", { name: "Check status", exact: true }).click();
  };
  const banner = async () => page.evaluate(() => {
    document.getElementById("carrier-qa-banner")?.remove();
    const banner = document.createElement("div"); banner.id = "carrier-qa-banner";
    banner.textContent = "SYNTHETIC QA FIXTURE — no live carrier connection";
    banner.style.cssText = "padding:12px 20px;background:#fff2c6;color:#151515;font:600 15px system-ui;text-align:center";
    document.body.prepend(banner);
  });
  try {
    await check("reference prefill, visible labels and keyboard submission remain accessible", async () => {
      await page.goto(origin + "/track-order?reference=GOOOL-11111111", { waitUntil: "networkidle", timeout: 120000 });
      await page.waitForFunction(() => document.getElementById("track-ref")?.value === "GOOOL-11111111", { timeout: 30000 });
      assert.equal(await page.locator("#track-ref").inputValue(), "GOOOL-11111111");
      assert.equal(await page.getByRole("heading", { name: "Track Order", exact: true }).count(), 1);
      await page.locator("#track-ref").focus(); await page.keyboard.press("Tab");
      assert.equal(await page.locator("#track-email").evaluate(element => element === document.activeElement), true);
      await page.keyboard.type("fixture@example.invalid"); await page.keyboard.press("Tab");
      assert.equal(await page.getByRole("button", { name: "Check status", exact: true }).evaluate(element => element === document.activeElement), true);
      await page.keyboard.press("Enter");
      await page.getByText("Carrier estimated delivery:", { exact: true }).waitFor();
      assert.equal(await page.locator("article").count(), 2);
      assert.ok((await page.locator("body").innerText()).includes("Label created — USPS awaiting package"));
      assert.equal(await page.getByRole("link", { name: /View on carrier website/ }).count(), 2);
      await banner(); await page.screenshot({ path: path.join(output, "tracking-desktop-synthetic.png"), fullPage: true });
    });
    await check("new lookup cancels stale enrichment and cannot display the previous customer's packages", async () => {
      scenario = "race";
      await submit("GOOOL-11111111");
      await page.getByText("Checking saved carrier updates…", { exact: true }).waitFor();
      await submit("GOOOL-22222222");
      await page.getByText("Out for delivery", { exact: true }).first().waitFor();
      releaseFirst?.();
      await page.waitForTimeout(300);
      const text = await page.locator("body").innerText();
      assert.ok(text.includes("TEST-PACKAGE-B")); assert.ok(!text.includes("TEST-PACKAGE-A")); assert.ok(!text.includes("TEST-PACKAGE-SPLIT"));
      assert.equal(await page.locator("article").count(), 1);
    });
    await check("enrichment timeout preserves supplier status and official carrier fallback", async () => {
      scenario = "timeout";
      await submit("GOOOL-22222222");
      await page.getByText(/Carrier history is unavailable here right now/).waitFor({ timeout: 15000 });
      assert.equal(await page.getByText("Shipped.", { exact: true }).count(), 1);
      const link = page.getByRole("link", { name: /View on carrier website/ });
      assert.match(await link.getAttribute("href"), /^https:\/\/tools\.usps\.com\/go\/TrackConfirmAction\?tLabels=TEST-PACKAGE-B$/);
      assert.equal(await page.getByRole("button", { name: "Check status", exact: true }).isEnabled(), true);
    });
    await check("mobile layout has no horizontal overflow and keeps both split-package timelines", async () => {
      scenario = "normal";
      await page.setViewportSize({ width: 390, height: 844 });
      await submit("GOOOL-11111111");
      await page.getByText("Carrier estimated delivery:", { exact: true }).waitFor();
      assert.equal(await page.locator("article").count(), 2);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
      await banner(); await page.screenshot({ path: path.join(output, "tracking-mobile-synthetic.png"), fullPage: true });
      for (const link of await page.getByRole("link", { name: /View on carrier website/ }).all()) {
        const box = await link.boundingBox(); assert.ok(box && box.height >= 44);
      }
    });
    assert.deepEqual(browserErrors, []);
    const evidence = { suitesPassed: passed, legacyRequests, detailsRequests, externalRequestsBlocked: abortedExternal, browserErrors,
      fixture: "All tracking results and cities are synthetic. Live tracking/provider activation not tested." };
    fs.writeFileSync(path.join(output, "browser-results.json"), JSON.stringify(evidence, null, 2));
    console.log(`${passed} browser suites passed. Screenshots and evidence: ${output}`);
  } catch (error) {
    await page.screenshot({ path: path.join(output, "browser-failure.png"), fullPage: true }).catch(() => {});
    console.error("Browser diagnostics:", { browserErrors, url: page.url() });
    throw error;
  } finally { await context.close(); await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
