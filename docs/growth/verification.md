# Verification for GOAL Black Friday review

Service date November 7, 2026, America/New_York. Production baseline: `7b98ba4`. All provider interactions in regression tests are fixtures. A signed fixture webhook is not a live Stripe payment or a real provider webhook delivery.

## Passing checks

| Check | Result and coverage |
| --- | --- |
| `npm run typecheck` | PASS on final application source |
| `npm run lint` | PASS; four pre-existing `no-img-element` warnings in OG/MobileImage/Shell |
| `npm run build` | PASS, 52 static pages; build-time worker operations disabled in this local build |
| `node scripts/test-growth-commerce.cjs` | 13 PASS: money boundaries, $38/$44.95 totals, 20% totals ($37.35 for one Tee), forged client totals ignored, no stacking, quote-only behavior, actual variant delivery mapping, complete catalog preservation, signed payment/retry/refund/consent gates, optional analytics failure cannot fail recorded payment |
| `node scripts/test-cart-quotes.cjs` | 4 PASS using actual CartPage handlers: out-of-order responses, removal, same-price variant edits, email eligibility errors, disabled checkout while repricing, successful-only handoff and server event values |
| `node scripts/test-meta-tracking.cjs` | 10 PASS, including 978 supplier/quantity/discount combinations. All money/snapshot payload comparisons remain; only the intentionally changed delivery text is checked separately against its authoritative source. |
| `node scripts/test-discount-prefix.cjs` | 6 PASS: existing coupon reuse, one-use/first-time restrictions, 14-day expiry, email binding and legacy code compatibility |
| `node scripts/test-footer-welcome.cjs` | 10 PASS: common signup-to-code/welcome path, concurrent deduplication, durable retry, unsubscribe and opt-out behavior. All sends mocked. |
| `node scripts/test-discount-popup.cjs` | 8 PASS: existing popup, focus/keyboard/swipe/dismiss behavior and retry/error states |
| `node scripts/test-womens-fit.cjs` | PASS: eight styles, distinct body/garment measurements and shared units |
| Campaign preview generator | PASS: exact same product path, four exact UTM parameters, different content values only |
| `git diff --check` | PASS |
| Economics workbook | PASS: formula recalculation, full/welcome payments, blank versus true zero, incomplete cost inputs, disposable filled-cost calculation followed by complete restoration to UNKNOWN, formula error scan and visual render. Native Excel recalculation not tested. |

The local economics file and logs are in the task's private `output/growth-bf2026-20261107` directory, outside the public Git branch. The worksheet is not a current margin certification.

## Existing suites with failing baseline assumptions

- `test-halo-checkout.cjs`: 17 PostgreSQL-backed checks pass, including concurrent paid events, unique orders/lines, partial-write recovery, delayed payments, mixed Apliiq/Tapstitch carts, durable manual handoffs and notification retry identity. The full suite then fails on its older catalog fixture: TEMPO Session Tee White expects $34 while current production is $24. This failure was reproduced before implementation. No price was changed or assertion weakened.
- `test-size-guide.cjs`: fails at line 50 because it expects one table for every guide; current women's guides include separate body and garment tables. Guide code and measurements were not changed. The current women's-fit suite and the Warm-Up Tee browser guide pass.
- `test-payment-preservation.cjs`: raw-file equality against its old `7659237` pin fails. That pin predates existing Tapstitch/order changes and this task intentionally changes checkout delivery text and analytics guards. It is not a passing functional test for this diff. Exact current-baseline catalog comparison plus the money, snapshot, signed-webhook and PostgreSQL cases provide scoped evidence. The old pin remains unchanged for review.

These suites are not reported as green. Refreshing historical expected catalog data or changing a preservation policy requires its own review.

## Browser checks

Chrome on Windows, actual overridden CSS viewports 390 × 844 and 1440 × 1000. These are responsive browser checks, not physical iPhone or Safari tests. iPhone/Safari was unavailable.

- Warm-Up Tee: Black/True Red changes, M selection, missing-size error, add to bag, bag details, full cart, quantity increase/decrease, removal and persisted bag across reload verified.
- Warm-Up Tee fit modal opens and closes; product-specific garment table and inches/centimeters switch work. Native modal remains reachable and scrollable on the narrow viewport.
- One Black/M Tee displays $38 plus $6.95 shipping, total $44.95. Two Tees display $76 and free shipping. Discount arithmetic and successful handoff are fixture-tested; the private browser has no payment key and correctly shows an unavailable-provider error instead of creating a session.
- Existing Shipping & Returns dropdown remains closed by default and expands normally. Its cost, after-discount condition and unconfirmed production/transit dependency are visible.
- Quarter Zip no longer renders the inherited USA-print or overseas 10–17-day labels; expanded details identify unconfirmed dispatch location and timing. $36, imagery and selection controls are retained.
- Observed document widths were 375 at viewport 390 and 1425 at viewport 1440, with scrollbars and no horizontal overflow. Gallery images loaded. No tracker scripts loaded in the credential-free local preview.
- No live checkout, issuer approval, real payment confirmation, GOAL production order creation, supplier acceptance, current email inbox delivery, refund exporter, live Meta dashboard receipt, source-to-order attribution or deployed Supabase constraints are certified by these checks.

## Private preview and evidence

- Store: http://127.0.0.1:3047/shop/goal-athletics-ga-minimal-tee
- Internal campaign/attribution proposal: http://127.0.0.1:3048/campaign-review.html
- Screenshots: `desktop-product-delivery-1440.jpg`, `desktop-cart-1440.jpg`, `mobile-product-delivery-390.jpg`, `mobile-cart-390.jpg`, `mobile-fit-390.jpg`, `quarter-zip-delivery-1440.jpg`, `campaign-review-1440.jpg` in the private output directory.

Both servers bind to loopback only. There is no public hosted preview and no production release. Existing Netlify previews were not reused because their configured audience is not private. Current production flags, supplier submission gates and schedules are unchanged.

## Follow-up release verification

The exact unchanged base and e3d1dc5 were compared under equivalent conditions. See [release verification](release-verification-e3d1dc5.md) for all three failures, the additional unmasked Halo failures, 19 identical guide renders, real local PostgreSQL retry/refund behavior, protected remote preview and separate production/campaign scopes. Provider payment verification is blocked by the owner because existing sandbox callbacks target shared external endpoints; no provider payment was attempted. Contribution remains UNKNOWN and the Black Friday offer is UNSELECTED.
