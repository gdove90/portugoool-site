# GOAL Black Friday commerce review

Prepared by Codex, GOAL Ecommerce Growth Implementation Engineer. November 7, 2026, America/New_York. Status: implemented for private review. Follow-up release scope and verified base comparison: [release verification](release-verification-e3d1dc5.md). Campaign launch remains on hold. No production deploy, merge, supplier order, marketing send, promotion activation, schedule change or production SQL.

## Baseline and collaboration

Production Netlify deploy `6aef814247b2319bbaedebb1` is ready at `7b98ba4e2cf44de4117923542f7de61f22a1903c`. The isolated branch is `codex/growth-bf2026-20261107`. Dirty and historical checkouts were preserved. The shared v2 engineering contract was read from setup branch commit `3ef4797`; exact Git-object hashes and adapter validation passed. The old Windows checkout failed byte hashes because of CRLF conversion. The repository-wide lock was acquired and verified. Read-only Netlify inspection confirmed production STORE_OPEN=true and APLIIQ_SUBMIT_ENABLED=true; neither was changed. The active catalog snapshot contains 13 Apliiq and 6 Tapstitch rows. The helper's Windows text-mode stdin created a `state.json` filename with a carriage return; a forward-only coordination commit corrected that filename, preserving the owned lease and earlier checkpoint. A temporary helper using NUL-delimited `git mktree -z` handles subsequent metadata writes. This is a tooling defect, not product authorization or a replacement lock.

## Verified defects and fixes

| Finding | Evidence | Implemented fix |
| --- | --- | --- |
| Core Quarter Zip says both overseas shipping and Printed in the USA | Live page rechecked; catalog product …0023 and fulfillment mapping use Tapstitch MT0063 | Remove the inherited origin label and unsupported combined timeline. TEMPO quarter zip also loses its inherited 10–17-day sentence. No price, SKU, imagery or sellability changes. |
| Blanket US origin and delivery estimates cover different suppliers | FAQ, terms, cart and Checkout source at production baseline | `src/lib/delivery.ts` derives origin from the existing variant mapping. Apliiq items identify US dispatch; Tapstitch dispatch stays unconfirmed. Exact production and transit estimates remain explicitly unconfirmed. Product dropdown, cart, FAQ, policy, terms, tracking and Checkout reuse that source. No supplier average is certified as a product promise. |
| Late discount responses can restore stale totals after edits/removal | Cart handlers used unversioned requests; effect depended only on subtotal | Version and context checks discard late responses. Equal-price variant changes and email edits revalidate. Checkout waits while repricing. Display and handoff use returned server totals. |
| Begin checkout fired before a successful handoff and could use an old total | Cart handler before API response | Emit InitiateCheckout only after successful Checkout creation, with the server's final total. This event is never revenue. |
| Unknown consent permitted server purchase matching; late paid events could revisit refunded orders | CAPI and order-status accepted any consent other than denied; webhook unconditionally sent Purchase for a paid session | Require recorded granted consent. Recheck persisted paid status/mode before server Purchase. Retain shared session-derived event IDs and browser deduplication. No consent default, banner, vendor or cookie changes. |
| Retired footer descriptor | Live footer and Shell | Remove Independent from the brand line, retaining Soccer inspired. Born in Rhode Island. Existing legal entity names and manufacturer names stay unchanged. |

The displayed $38 Tee price, $6.95 per-order shipping, $70 threshold after discounts, 20% welcome offer, refund remedies and tax configuration are unchanged. Cart wording always states the after-discount condition; tax is identified separately where applicable. The server still resolves catalog prices and variants, supplies at most one promotion code, and disables Stripe's promotion box. Forged browser totals and discounts are ignored. Native Shipping & Returns dropdown styling, default closed state and behavior are preserved.

Two product-detail/footer implementations already exist (`src/v84` and legacy `src/components`). Both now consume shared delivery wording where they expose it. Removing the legacy UI is a separate cleanup; building another sales landing page would duplicate the existing destination.

## Supplier and delivery evidence

`src/lib/fulfillment.ts` remains the executable supplier/SKU authority. The generated `supplier-routing-audit.json` is a dated audit snapshot, not a second maintained catalog. Apliiq variants use its saved decorated design IDs and APQ references. Tapstitch variants use saved design IDs with internal TAP references and a manual paid-order handoff; these are not supplier API SKUs.

The authenticated Apliiq saved-design row `productNo-6206620` was matched to Warm-Up Tee Black, Sport-Tek ST720. The expanded record shows a 3 × 2.7 inch front transfer, a 6 × 2.26 inch back transfer and private label `sb-6-161561`. Current itemized charges, packed weight, stock readiness and a route-specific delivery quote were not obtained. Historical records for other ST720 artwork cannot establish this design's current landed cost or delivery date.

Apliiq publishes generic production guidance of about a week and US transit of 1–5 days, with artwork, garment and label dependencies. Its production-status and holiday pages have different average-turnaround descriptions. These are supplier guidance, not a confirmed promise for each GOAL decorated design. [Production process](https://help.apliiq.com/portal/en/kb/articles/how-long-does-it-take-to-get-my-order), [production status](https://help.apliiq.com/portal/en/kb/articles/apliiq-production-status).

Tapstitch offers US and international fulfillment, with times depending on product, location and shipping service. Its shipping time excludes production unless a total fulfillment estimate is explicitly shown. A saved design and internal TAP reference do not establish the chosen dispatch route. [Shipping FAQ](https://www.tapstitch.com/help-center/faq/detail/FAQ-about-shipping), [shipping estimator](https://www.tapstitch.com/shipping).

Apliiq's December 5, 2026 POD cutoff is approximate. It is not a guarantee or an order prohibition after that date, and does not apply to Tapstitch. Tapstitch publishes separate service-dependent recommendations, which require supplier submission and payment by the date. No holiday dates or Christmas guarantees were added to the storefront. [Apliiq holiday guide](https://help.apliiq.com/portal/en/kb/articles/2026-holiday-production-and-shipping-calendar), [Tapstitch holiday guide](https://www.tapstitch.com/blog/post/tapstitch-holiday-shipping-deadlines).

## Measurement inventory and smallest proposal

| Measure | Existing implementation | Verification limit |
| --- | --- | --- |
| Product view | Meta ViewContent on the product component | Consent fixtures pass. Live Events Manager delivery not verified. |
| Add to cart | Meta AddToCart on successful local add | Consent fixtures pass. Live dashboard receipt not verified. |
| Begin checkout | Meta InitiateCheckout, repaired to successful handoff | Actual CartPage handlers tested with deferred HTTP. |
| Purchase | Signed webhook CAPI and verified order-status browser event | Shared session hash deduplicates browser/server twins; paid/mode/refund gates tested locally. Provider dashboard receipt not verified. |
| Refund | Signed charge.refunded and dispute handling affect order state | No refund analytics exporter exists. Partial refunds are flagged, not quantified in retained revenue by a reporting layer. Reconcile Stripe refund amounts separately. |
| Campaign attribution | Pixel can observe page URLs; no order-level UTM persistence was found | Cannot calculate reliable source-to-purchase conversion. Metricool tools are unavailable here. |

No reliable GOAL traffic-to-purchase rate or first external customer count is established. Asset HTTP requests are not sessions. Expired Stripe sessions do not prove abandonment. Checkout creation is not revenue. Keep completed, unique paid orders, refund amounts and retained revenue separate. Server/provider retries share transaction identity; downstream reporting must deduplicate by order/session ID, including across reporting windows.

**Proposal, not installed:** reuse the existing consent-gated Meta integration and Stripe metadata. Allow only the four exact campaign parameters in `bf2026-campaign.json`. With owner approval, retain them in tab-scoped sessionStorage only after granted consent, clear on withdrawal/GPC, and add four bounded values to server-created Stripe session metadata. No new ID, cookie, full URL, referrer, customer field, vendor or database table. Tab retention ends when the tab closes; Stripe's existing record retention applies to copied metadata. The private campaign review demonstrates the exact allowed metadata. No new collection is connected to the store.

Required access/configuration: GOAL Meta Events Manager/Dataset read access and a separate test-event code for receipt verification; owner review of the four-field attribution collection and retention; a confirmed GOAL Stripe sandbox/test account and an isolated local webhook signing secret with disposable order storage. The connected Stripe account is live-only. Follow-up read-only inspection identifies the existing test account as the GOAL legacy-brand sandbox, with the matching historical domain. It has enabled callbacks to the production legacy host and an older preview. The owner explicitly chose to leave provider payment verification blocked rather than change those shared endpoints. No payment was created. The Supabase connector did not resolve the known dedicated GOAL project (oexibflpshttgzmdvhpr); deployed constraints and historical order recovery therefore remain unverified. The production environment has its existing database and email keys configured, but key presence does not prove successful delivery or schema behavior. No HubSpot account/contact changes or cross-company records were used. The prior Hire On the Fly portal finding is not a GOAL data source and was not used as one.

Explicit test signals are Stripe livemode=false, known fixture IDs and this recorded owner-controlled audit. Anonymous nonbuyers remain unclassified. Owner live tests require an explicit known-order exclusion record, never an inference from lack of purchase.

## Controlled organic experiment

Warm-Up Tee, provisionally Black. Use the existing product page, the same owner-approved offer once costs are verified, and the exact CTA **Shop the Warm-Up Tee.** The sole creative variable is the opening: movement/juggling first (A), product detail first (B). Keep product, color, total duration, copy, CTA, offer, format and purchase destination equal. Use approved existing assets; this work generates none and publishes nothing.

A: https://goalathletics.shop/shop/goal-athletics-ga-minimal-tee?utm_source=instagram&utm_medium=organic_social&utm_campaign=goal_bf2026_tee&utm_content=juggle_first_a

B: https://goalathletics.shop/shop/goal-athletics-ga-minimal-tee?utm_source=instagram&utm_medium=organic_social&utm_campaign=goal_bf2026_tee&utm_content=detail_first_b

Community participation: https://goalathletics.shop/whats-your-goal . Keep that link separate from the shopping CTA and outside the purchase test's click denominator.

Use equal 48-hour windows starting at each actual publication time in America/New_York, in comparable slots within the existing approved schedule. Do not automatically change schedules. Record timestamps, creative version, organic reach/impressions, platform link clicks, eligible product views, adds, handoffs, confirmed unique paid orders and later refunds. Stratify BF and Cyber Monday period effects; do not treat sequential organic posts as a randomized causal experiment. Small samples may remain inconclusive. Black Friday is November 27 and Cyber Monday November 30. Owner selects actual slots and assets. Qualified traffic and attributed sales remain unknown until measurement is verified.

## Economics

The internal workbook compares one US Black Tee at full price and at the existing 20% welcome offer. Known customer payments before tax are $44.95 and $37.35 respectively. Garment, two transfers, private label, handling, packed weight, actual supplier shipping, actual payment fees and a supported defect allowance are visibly UNKNOWN. Contribution and contribution margin therefore remain UNKNOWN. No 5% reserve, generic card rate, historical quote or deeper discount was substituted. The private XLSX remains outside the public Git repository.

## Verification and release

See `verification.md` for exact checks and limitations. The local application binds only to 127.0.0.1:3047 and has no Stripe, supplier, Supabase or email credentials. A password-protected Netlify live tunnel now provides remote owner review without a deployment; operational routes are denied by the review proxy. See the follow-up report for the URL, availability limit and checks. It is not a provider payment test. The production build was verified; current source/build metadata contains no new tracker or schedule.

Proposed release: the reviewed delivery-source/copy changes, quote reliability fix, successful-handoff measurement fix, consent/paid-state guards and retired footer adjective removal. No price, offer, tax, imagery, layout, supplier integration, schema, promotion or schedule changes. Review exact final commit before release. Resolve product-specific delivery/cost evidence and the GOAL test environment before certifying campaign readiness.

Rollback approach after a separately approved release: make a forward-only revert of this scoped commit onto then-current main and redeploy after review. No database rollback is needed; preserve all orders, event IDs, purchase snapshots and supplier references. A failed deploy leaves production unchanged. Do not restore an older deployment over another agent's later work.

Next owner decisions: provide current itemized quote/packed weight and shipping service for design 6206620 Black M plus each Tapstitch route; confirm the intended GOAL sandbox; review attribution metadata/retention; select Black and the two approved openings and comparable publication slots. Supplier costs and creative selection block campaign launch. They do not block review of the independently verified correctness/copy scope in the follow-up report. No production release is authorized.
