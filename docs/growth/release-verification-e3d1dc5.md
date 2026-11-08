# GOAL growth release verification: e3d1dc5

Codex, GOAL Ecommerce Growth Implementation Engineer. Verified November 7, 2026, America/New_York. This follow-up preserves implementation commit `e3d1dc5caaa18359bd939ccea2dafc4a7e2eda7a` and production base `7b98ba4e2cf44de4117923542f7de61f22a1903c`. Follow-up changes contain review evidence and campaign-status clarification only. No production deploy, merge, order, charge, email, supplier submission, production SQL, account-setting change or schedule change.

## Recommendation

**READY FOR PRODUCTION REVIEW: the correctness and copy scope below. Campaign launch remains HOLD.** The three legacy failures are reproduced on the unchanged base. No new failure or checkout regression was found in the compared checks. This is evidence for reviewing the fixes separately from campaign launch, not production approval or live end-to-end payment certification.

## Equivalent base/candidate comparison

Both detached base and candidate used Node v24.14.1, America/New_York, CI=1, the same npm-ci dependency installation, identical package-lock and suite hashes, with provider credentials removed. The lockfile SHA256 is `3272aaa993a7ded7d50aaf339070f53de6331079e7e0cbb808c7e5f6b7792762`. Original tests were not edited or relaxed.

| Unchanged suite | Base 7b98ba4 | Candidate e3d1dc5 | Diagnosis |
| --- | --- | --- | --- |
| `node scripts/test-halo-checkout.cjs` | FAIL after 17 PASS | FAIL after 17 PASS | Line 262 expects WT0216 unit price 3400 cents; both catalogs and Checkout return 2400. |
| `node scripts/test-size-guide.cjs` | FAIL: 2 vs 1 tables, line 50 | Same failure | Legacy single-table assertion predates body-plus-garment guides. All 19 actual guide renders have identical SHA256 hashes across base/candidate. Three existing guides render two tables. |
| `node scripts/test-payment-preservation.cjs` | FAIL on first raw webhook comparison | Same first failure | Default pin 7659237 predates existing payment/fulfillment changes. It is not the unchanged current production base. |

Additional Halo filters were run independently on both refs so the first failure could not hide later ones: `node scripts/test-halo-checkout.cjs "WT0216 totals"` fails 3095 vs 4095 on both; `"WT0216 invalid"` also fails 200 vs 400 on both, reflecting a stale held-product expectation. These are pre-existing failures; product availability was not changed here. They remain failed, not waived or falsely reported as passing.

The payment-pin audit compares every listed file, not just the first assertion. Base already differs from the old pin in 11 of its 18 core files, plus Checkout. This branch adds shipping-file text/comment changes to that pin mismatch and intentionally changes webhook tracking and three catalog claim fields. Checkout differs only by delivery text and returned quote totals; existing 978 money/snapshot cases pass. Consequently **the failure existed before this work, but not every byte difference is pre-existing**. New differences have been reviewed and behavior-tested separately.

Compact raw evidence: [original suite comparison](evidence/e3d1dc5/legacy-comparison.json), [later Halo checks](evidence/e3d1dc5/halo-unmasked.json), [all pin comparisons](evidence/e3d1dc5/payment-pin-all-files.json), [19 rendered guides](evidence/e3d1dc5/size-guide-render-comparison.json). Full console logs and reproducible isolated audit drivers are in the local `output/growth-release-verification-20261107` evidence directory.

## Checkout, consent, payment and refunds

Re-ran: 13 growth-commerce checks, 4 deferred CartPage interaction checks, 10 Meta checks including 978 money/snapshot combinations, 6 discount-prefix checks, and 10 signup/email checks. All PASS with isolated providers. Typecheck, lint and production build PASS; lint/build retain four existing no-img-element warnings. No price, image, variant, hold, offer percentage, tax rule, refund remedy or shipping-money rule changed.

The actual CartPage rejects stale quote responses, revalidates email and equal-price variant changes, waits during repricing, handles provider errors without recording a handoff, and emits Begin Checkout with the successful server quote. Server prices, shipping after discounts and at-most-one applied coupon remain authoritative. Consent changes only tighten optional event eligibility to recorded `granted`; existing regional defaults, GPC behavior, consent banner, cookies and vendors are unchanged. Optional analytics failure cannot fail a recorded payment.

An additional two-ref test used the real order-store implementation, actual webhook signature validation, actual CAPI serialization and local PostgreSQL constraints, with all providers captured or blocked. The same paid fixture delivered repeatedly/concurrently creates **one order and one order line** in each revision. A sequential identical-event retry sends no additional purchase. Concurrent distinct callbacks make three captured send attempts in total, all with **one identical transaction-derived Purchase ID**, on both revisions. That existing retry behavior relies on Meta deduplication; it is not an exactly-once network send. Meta dashboard receipt/deduplication remains UNVERIFIED. [Results](evidence/e3d1dc5/payment-behavior.json).

After a full-refund fixture and late async-success callback, both revisions preserve `refunded` status and one order. Base makes one more purchase send; candidate makes **zero**. Refund/dispute processing, monetary records, order uniqueness and fulfillment code themselves were not changed. A partial refund still leaves paid status with an operational note, as on base. There is no verified retained-revenue/refund analytics report: do not treat original purchase totals as retained revenue, and do not assume this guard retracts a Purchase already received by Meta.

Read-only Stripe inspection identifies the existing test key as account `acct_1UHzc3BtaM9tSdZu`, displayed as the legacy GOAL sandbox with `https://goool.shop`. Different sandbox/live IDs alone were not evidence of a wrong account. However, enabled test callbacks point to `https://goool.shop/api/stripe-webhook` and `https://meta-tracking--goool-shop.netlify.app/api/stripe-webhook`. A test payment could therefore write beyond disposable local storage. The owner explicitly selected **Leave provider payment verification blocked**. Those endpoints remain unchanged; no Checkout Session or payment was created. **No payment malfunction was established.** Provider-backed confirmation, automatic webhook delivery, deployed Supabase uniqueness and provider-side Meta receipt are not certified by local fixtures.

## Delivery evidence and limits

The saved Apliiq design `6206620` was matched to Warm-Up Tee Black / ST720, with the front and back transfers and private label recorded in the prior audit. Code maps its selected M variant to that design. Apliiq documents routing POD orders to its closest production factory and identifies its Los Angeles/Philadelphia dispatch facilities: [routing](https://help.apliiq.com/portal/en/kb/articles/how-do-shipping-fees-work-with-dropshipping), [factory routing](https://help.apliiq.com/portal/en/kb/articles/philadelphia-factory-coming-soon), [dispatch addresses](https://help.apliiq.com/portal/en/kb/articles/how-to-personalize-your-shipping-label-for-dropshipping). This supports US dispatch for the configured Apliiq route; it does not claim US garment manufacture or a delivery date. Exact factory assignment occurs per order, and stock/label readiness and item-specific production/transit remain unverified.

Core Quarter Zip maps to Tapstitch MT0063, not Apliiq. Tapstitch's [shipping FAQ](https://www.tapstitch.com/help-center/faq/detail/FAQ-about-shipping) allows US or international fulfillment and separates transit from production. The replacement says dispatch and production/transit estimates are unconfirmed, rather than guessing either. The inherited Printed in USA and 10â€“17-day claims were removed. No Apliiq timeline/cutoff was applied to Tapstitch. No numeric delivery estimate or Christmas guarantee was introduced. The [December 5 Apliiq guidance](https://help.apliiq.com/portal/en/kb/articles/2026-holiday-production-and-shipping-calendar) remains approximate and unpublished on the storefront.

These evidence limits are visible in the revised copy. Missing exact production/transit estimates block promises or date-dependent campaign copy; they do not require retaining contradictory claims.

## Remotely accessible private owner preview

[Open the protected Warm-Up Tee preview](https://f94480c1--goool-shop.netlify.live/shop/goal-athletics-ga-minimal-tee). HTTP Basic username/password are supplied privately in the conversation, not in source control. This is a Netlify live tunnel to the local production build of e3d1dc5, **not a site deployment**. It needs the owner's computer and both local processes to stay running. Access expires November 10, 2026 at 11:53 PM America/New_York, or sooner if the host/tunnel stops. No persistent hosting availability is claimed.

HTTP checks verified unauthenticated page/API requests receive 401, authenticated product requests receive 200, and checkout/signup/webhook POSTs receive 503. The local application has no live Stripe, supplier, database, email or Meta credentials. The proxy denies operational paths before the application and adds noindex/no-store. No production access controls, keys, gates or deployment changed. [HTTP evidence](evidence/e3d1dc5/remote-preview-http-checks.json).

Remote Chrome 390px/1440px checks cover fit-guide access/units/close, selection, add to bag, quantity changes, cart persistence and shipping totals. Local review previously covered removal and gallery/color behavior. Actual iPhone/Safari remains for owner review; Windows Chrome viewport checks are not Safari verification. Screenshots are in the local evidence directory: `remote-mobile-delivery-390.jpg`, `remote-mobile-fit-390.jpg`, `remote-mobile-cart-390.jpg`, `remote-desktop-cart-1440.jpg`.

## Exact proposed production scope

The [20-file manifest](evidence/e3d1dc5/correctness-copy-scope.json) names 17 runtime files and 3 relevant test files taken exactly from base-to-e3d1dc5. A separate `correctness-copy-release.patch` was prepared and `git apply --check` passed against the unchanged base. SHA256: `5601a4224894d98954d160b726c75e229f68c7360911721a9bcb485764c42a5c`.

1. Versioned/context-bound cart quotes, returned server totals and checkout error/handoff timing.
2. Consistent existing $6.95 / $70-after-discounts text and separate tax note, without money/config changes.
3. Shared supplier-route delivery copy, removal of the three unsupported catalog claims and retired Independent descriptor.
4. Existing tracking corrections only: granted-consent and persisted-paid-mode checks, successful-handoff timing and unchanged transaction-derived IDs. No new tracker or attribution storage.
5. The three associated regression scripts. No campaign JSON, campaign preview generator or campaign documentation is needed to ship these runtime fixes.

**Deferred campaign/attribution/offer scope:** both A/B openings, provisional Black choice, launch slots, UTM order persistence and retention, Meta receipt/dedup evidence, and any Black Friday offer decision. Campaign JSON now explicitly marks the offer UNSELECTED and contribution UNKNOWN. The current evergreen 20% welcome offer remains unchanged. The workbook's full-price/20% comparison is not a selected campaign discount. Complete current garment, decoration, label, handling, packed weight, supplier freight, actual payment fees and supported defect allowance are required before computing contribution or selecting a BF discount. No deeper discount or exclusive-sale claim is proposed.

## Remaining decisions and rollback

Owner review: open the protected preview on iPhone/Safari and review the exact correctness/copy patch. Separately approve an exact release commit/scope before production work. No release approval is requested or inferred here. Supplier costs and creative selection block campaign launch only. Product-specific timing evidence is required before adding a delivery promise. Provider payment verification remains blocked per the owner's choice; a future test needs a separately isolated GOAL sandbox or explicit coordination of the existing test callbacks.

After any separately approved release, rollback means a reviewed forward-only revert of the scoped code on then-current main and a new deployment. No schema migration or database rollback is part of this scope. Preserve paid data, snapshots, session/event IDs, fulfillment references and all unrelated work. Reverting shared copy could restore the old contradiction, so prefer a narrow corrective commit if that is the fault. Production is still at base deploy `6aef814247b2319bbaedebb1`.
