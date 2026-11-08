# GOAL correctness and story review

Prepared November 8, 2026, America/New_York. Branch: `codex/correctness-story-review-20261108`. Production base: `7b98ba4e2cf44de4117923542f7de61f22a1903c`, Netlify published deploy `6aef814247b2319bbaedebb1`. Runtime implementation commit: `ac67af7`. Follow-up changes refine the existing backend test fixture/importer and add this review evidence. This task selectively reuses cart/tracking work; it does not apply e3d1dc5 wholesale. Existing worktrees and historical commits are preserved.

## Scope and behavior

- `src/app/cart/page.tsx`, `src/lib/checkout-quote.ts`: quote identity includes every checkout line field (product, color, size, quantity, custom name/number) and normalized buyer email. Request generations and mounted/context checks discard stale responses after edits, removals, newer requests or unmount. Current server subtotal/discount/shipping/total drive the summary. Checkout waits only during repricing, remains available when settled, ignores duplicate clicks and does not redirect after unmount or a changed cart/discount.
- `src/app/api/checkout/route.ts`: only adds authoritative totals to the successful response. Its request validation, server price/discount/shipping calculations, Stripe payload, methods, URLs, gates and delivery wording remain identical to production. Client-supplied amounts remain ignored. InitiateCheckout fires after successful creation using the returned total; an optional tracking exception cannot prevent redirect.
- `src/lib/meta-capi.ts`, `src/app/api/order-status/route.ts`, `src/app/api/stripe-webhook/route.ts`: Purchase requires recorded granted consent; server tracking confirms persisted paid status and matching event mode. Existing session-derived browser/server IDs remain shared, and a fully refunded order is ineligible. Optional Meta/storage failures skip tracking without changing successful payment handling, order persistence, fulfillment, receipts or event acknowledgment. Payment authority, order store, fulfillment logic and refund processing are unchanged. This is not provider-side Meta deduplication certification.
- `src/v84/Shell.tsx`, `src/components/Footer.tsx`: remove the retired footer descriptor, preserve the legal entity/non-affiliation wording, and rename the public story navigation/footer labels to Our Story. Existing bag markup, prices, shipping note and link presentation are byte-identical.
- `src/app/about/page.tsx`, `src/v84/reference-experience.js`, `src/v84/story-content.js`, `scripts/import-v84.cjs`: use the approved heritage/identity/evolution language, Our Story title/metadata and homepage link. The canonical story module is shared by the current generated bridge and importer, which excludes the historical about function. The obsolete generator story rewrite was removed. An in-memory execution of the actual importer template proves old input cannot restore the old story. Images, element/class structure and all unrelated markup are unchanged; no founder details were added. The full importer was not run against the historical asset package, avoiding unrelated asset/presentation replacement.
- `src/app/page.tsx`, `src/app/sitemap.ts`, `src/middleware.ts`: remove the Collective homepage promotion, public navigation/footer links and sitemap entry. The old route receives a temporary 307 to /shop. Its original page file and every asset remain intact for later use.

## Explicit preservation

**Payment and checkout remain enabled.** Read-only Netlify configuration confirmed production `STORE_OPEN=true`; no settings, modes, keys, gates or methods were changed. Provider payment verification is not a requirement for this scope. No real/provider-backed payment test, Checkout Session, charge, order, supplier submission or email was created/sent.

**Production shipping and delivery claims are untouched**, including product origin/timing, cart/Checkout text, policy/FAQ/email text, thresholds and routes. The cart's original JSX is protected by exact comparison, allowing only authoritative subtotal binding and the pending-price disabled condition. Checkout source equals the base after stripping the added response fields. Catalog, supplier mappings, shipping calculation module, FAQ/policies, emails, product views, fulfillment and store-state files match production exactly. No product/image/CSS/price/tax/offer/campaign configuration changes, no new purchase-area shipping copy or layout, no migrations or production deployment.

Contribution remains **UNKNOWN** and the Black Friday offer remains **UNSELECTED**. No offer or campaign was prepared by this task. The existing evergreen 20% welcome offer is unchanged.

## Verification

[Local check results](correctness-story-20261108/checks.json), [legacy comparison](correctness-story-20261108/legacy-comparison.json), [build results](correctness-story-20261108/build-results.json), [HTTP results](correctness-story-20261108/http-checks.json).

| Check | Result |
| --- | --- |
| `node scripts/test-cart-quotes.cjs` | PASS, 8 deferred-handler cases including unmount, full removal/customization, newer response ordering, email, duplicate clicks and optional tracking failure |
| `node scripts/test-correctness-review.cjs` | PASS, 14 isolated cases: protected production files/markup, server totals and forged-input refusal, successful handoff, signatures, retry IDs, full refunds, consent, mode mismatch and non-blocking analytics failures |
| `node scripts/test-story-review.cjs` | PASS, 4 cases including exact story/home markup comparison, actual importer-template execution, retained Collective source/legal notice and redirect behavior |
| Existing Meta / discount-prefix / footer-welcome / popup / women-fit suites | PASS, 10 / 6 / 10 / 8 / 1 grouped checks; Meta includes 978 supplier/quantity/discount money/snapshot combinations; fit covers eight women styles |
| Typecheck / lint / production build | PASS; four existing no-img-element warnings, no new warnings |
| Local HTTP | PASS: home/story/product/cart/sitemap 200, Collective 307 to /shop and absent from sitemap/public links |

All tests use isolated provider fixtures. A test double models Checkout creation; it creates no Stripe resource. All sends, payment intents, webhooks and order records in these tests are mocked/disposable. No live or sandbox provider payment was attempted. The existing backend tracking fixture now returns its created row from getOrderBySession instead of null, so it models the newly required persisted paid/mode check; all original assertions are retained. Dedicated tests also prove missing/mismatched storage suppresses tracking without failing payment handling.

### Legacy failures compared under equivalent conditions

Exact base `7b98ba4` and runtime candidate `ac67af7` used Node v24.14.1, America/New_York, CI=1, removed provider credentials, identical package-lock and shared exact npm-ci dependencies. The original three suites have identical source hashes and were not weakened.

| Suite | Base | Candidate | Finding |
| --- | --- | --- | --- |
| `test-halo-checkout.cjs` | FAIL after 17 PASS | Same | Line 262 expects WT0216 price 3400; both actual catalogs return 2400. |
| `test-size-guide.cjs` | FAIL, line 50 | Same | Expects one table; existing body/garment guide has two. Guide and product source are unchanged. |
| `test-payment-preservation.cjs` | FAIL on webhook raw equality | Same first failure | Default pin 7659237 predates production base; this branch intentionally changes only optional tracking in the webhook. This raw-file assertion is not a functional payment test. |

Two additional broad suites also retain baseline failures: backend catalog snapshot expects 11 public products where both base and candidate have 19 (44 other checks PASS after the accurate tracking-fixture update); v84 has 27 PASS then its old migration-list comparison fails on the same two already-existing carrier migrations. No production code or old fixture assertion was changed to hide these failures. They are reported as FAIL, not as passing suites. Relevant focused behavior tests pass.

## Browser review and limits

Read-only production inspection confirmed the existing Add-to-bag drawer contains subtotal, Review bag & checkout, and its existing shipping/discount note. The local candidate preserves that presentation. Chrome at 390px and 1440px verified the story/navigation, preserved imagery, product selection, add-to-bag drawer, $44.95 one-Tee cart, $76 two-Tee free-shipping cart, quantity changes, reload persistence, removal, fit-guide units/Escape, no checked-page horizontal overflow and enabled settled Checkout. No checkout click/provider handoff was performed in the browser. Actual iPhone/Safari was not available and was not tested.

Review artifacts are local under `output/correctness-story-review-20261108`: `story-desktop-1440.jpg`, `story-mobile-390.jpg`, `bag-desktop-1440.jpg`, `cart-mobile-390.jpg` and complete suite logs. The local review server is `http://127.0.0.1:3067/about`; it is not a remote preview or deployment and contains no real provider credentials. No new hosting or tracking service was introduced.

## Release authority and rollback

Draft PR only. No merge, deploy, publish, promotion, production SQL, supplier write or settings change is authorized or performed. The draft title and commits carry skip ci / skip netlify markers. Owner reviews the exact scoped PR; no provider-backed payment test is required by this work. After any separately approved release, use a scoped forward revert or corrective commit on then-current main, preserving unrelated work and all paid records. No database rollback is needed. The retained Collective page/assets can be restored to public routing in a separately approved change.

Owner wording correction, November 8: “Evolution is our purpose.” replaces “Movement is our purpose.” in both story placements and the metadata. Reaching goals expresses growth and evolution. Existing screenshots predate this wording-only correction; images and layout remain unchanged.
