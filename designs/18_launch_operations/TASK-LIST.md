> **Backend release 2026-09-26:** [Verified repair verdict](LAUNCH-REPAIR-VERDICT-2026-09-26.md) and [source of truth](LAUNCH-SOURCE-OF-TRUTH-2026-09-26.md) supersede older payment/email configuration statuses below. Resend is the only transactional sender; Google Workspace receives support replies. Real inbox and paid-order rehearsals remain separate from passed simulator and unpaid checkout tests.

> **Current direction:** Read [25% pricing](PRICING-25-PERCENT.md) and [current design review](../19_colorway-and-back-print-review/README.md). These supersede historical prices, straight crewneck placement and cotton launch plans below. TASKS.json contains latest statuses.

# GOOOL launch task list

Current execution authority: [Claude launch prompt](../../CLAUDE-LAUNCH-PRIORITY-PROMPT.md). Stripe first. Six new prices are published by owner authorization. Preserve reference-style studio tiles. Approved sewn tag required; alternatives need mockup review. No physical samples approved. Instagram only. A 24-hour sales launch is not yet substantiated.

| ID | Priority | Task | Status | Owner |
|---|---|---|---|---|
| PAY-01 | P0 | Verify deployed Stripe test connection | complete | Codex |
| PAY-02 | P0 | Complete Stripe business activation and bank onboarding | complete | Owner with Claude guidance |
| DB-01 | P0 | Restore GOOOL Supabase query access and inspect migrations | complete | Owner/Claude |
| DB-02 | P0 | Apply only missing order/catalog migrations | 0026_reported_applied_remaining_catalog_reconciliation_pending | Claude |
| PAY-03 | P0 | Complete test purchase through webhook, order and tracking | unpaid_test_sessions_rehearsal_pending | Claude |
| COST-01 | P1 | Verify supplier costs for every offered variant | 30_new_variant_item_quotes_verified_landed_costs_pending | Claude in authenticated Apliiq session |
| PRICE-01 | P1 | Calculate and review six new retail prices | six_display_prices_owner_authorized | Claude/Owner |
| PRICE-02 | P1 | Publish owner-authorized prices consistently | deployed_verified_all_10_products | Claude |
| SHIP-01 | P1 | Finalize actual shipping charge and delivery wording | live_charge_and_wording_verified_supplier_cost_separate | Claude/Owner |
| TAG-01 | P1 | Choose compatible label with actual-size proof | not_implemented_sewn_service_and_proof_pending | Claude/Owner |
| ART-01 | P1 | Apply casual tee3in placement in supplier and website | prompt_ready_execution_pending | Claude |
| ART-02 | P1 | Close circular scale and Modern Sport performance width issues | pending_proof | Claude/Owner |
| SAMPLE-01 | P1 | Approve physical samples for the first release subset | owner_confirmed_none_approved | Owner |
| PAY-04 | P0 | Configure live Stripe credentials/webhook/shipping and validate mode separation | configured_and_verified_paid_rehearsal_pending | Claude |
| IG-01 | P2 | Prepare Instagram-only teaser and reveal drafts | drafts_prepared | Codex/Claude |
| IG-02 | P2 | Verify Instagram profile, link and measurement | account_action_pending | Owner/Claude |
| IG-03 | P2 | Review and publish brand-only Instagram teasers | awaiting_content_review | Owner/Claude |
| IG-04 | P2 | Capture real garment launch content | waiting_samples | Owner/Claude |
| LAUNCH-01 | P0 | Launch the first fully ready subset | store_public_backend_repaired_final_rehearsal_pending | Owner/Claude |
| IG-05 | P2 | Publish launch-day Instagram sequence | waiting_launch | Owner/Claude |
| IMG-01 | P1 | Remove generated model views from active galleries | deployed_verified | Claude |
| IMG-02 | P1 | Standardize sharp garment imagery and seamless 4:5 frames | reference_tiles_deployed_placement_work_separate | Claude |
| COPY-01 | P1 | Remove Printed in the USA price-area marketing badges | deployed_verified | Claude |
| WEB-QA | P1 | Verify imagery cleanup and release preview | deployed_tiles_and_prices_verified | Claude |
| FUL-01 | P0 | Configure and verify existing Apliiq store integration | authenticated_enabled_paid_rehearsal_pending | Claude |

## Completion requirements and evidence

- **PAY-01:** Test key matches goool.shop account; enabled test webhook; HTTP200 test checkout created; livemode false, unpaid, $47.50 total. This does not prove paid-webhook persistence.
- **PAY-02:** Business details submitted, activation requirements cleared, charges and payouts enabled. Enter sensitive details directly in Stripe, never chat.
- **DB-01:** Correct project oexibflpshttgzmdvhpr query succeeds; run LAUNCH-DB-CHECK.sql. Connector currently returns password authentication failure. Do not touch the other listed project. Latest evidence: SESSION-EVIDENCE-2026-09-21.md reports SQL editor access and 0026 applied; connector failure must not be interpreted as missing database. Recheck the working access path before migration work.
- **DB-02:** Verify0026 order schema and0027–0029 product records. Apply only necessary changes and read back. Do not blindly replay0027: it resets prices/images.
- **PAY-03:** Complete controlled Stripe test payment; verify event delivered once, correct order number/immutable snapshot persisted, success and tracking work, retry produces no duplicate, no Apliiq production submission. Latest evidence: LAUNCH-CONFIG-AUDIT-2026-09-21.json: all three returned test sessions unpaid; paid order chain is unproven.
- **COST-01:** Fill COST-INPUTS.json for66 size/color variants with exact saved-design quote, print/embroidery, label, application, packing, shipping, size surcharges and evidence. Thirty new variant item costs verified; complete all remaining landed costs with evidence. Public starting-price ranges are insufficient. Latest evidence: APLIIQ-PRICING-RESEARCH-2026-09-21.json; labels, packing and actual shipping remain unresolved.
- **PRICE-01:** Run calculate-prices.py after quotes; compare contribution and largest-size costs. Internal previous 48/48/48/42/78/52 suggestions are not approved website prices. Latest evidence: PRICING-RELEASE-2026-09-21.md
- **PRICE-02:** Owner-authorized prices appear consistently in runtime catalog, cards, details and metadata; checkout reads server-authoritative prices. Verify DB price authority before any future switch; no blind migration overwrite. Unknown costs remain launch checks. Latest evidence: PRICING-LIVE-VERIFICATION.json; runtime catalog src/lib/products.ts; no database price migration performed.
- **SHIP-01:** Quote single and multi-item US orders including size/fulfillment split effects. $9.50 is a TEST placeholder, not an approved live policy. Record shipping handling and realistic production/transit windows.
- **TAG-01:** Keep approved black/white/red Athletics visual. Compare color-capable service per blank, actual 1in legibility, attachment, supply+application cost. No standard white-stock black-only substitution. No label purchase without owner review. Owner reaffirmed sewn approved mockup. Any required alternative must be shown as a feasible mockup and approved before implementation. Verify per-design attachment after supply exists. Latest evidence: TAG-IMPLEMENTATION-AUDIT-2026-09-21.json; owner requires approved sewn concept or alternative mockup approval first.
- **ART-01:** Apply existing prompt to6098963/6099060; front visible top3in below bottom collar seam, width6.75in unchanged. Reopen proof; update both colors and retained garment-only front/gallery images; do not regenerate model views.
- **ART-02:** Verify circular visible art dimensions; reconcile performance9in target vs saved11in with a dimensioned approved proof. Preserve original geometry and distinct cotton/performance blanks.
- **SAMPLE-01:** Approve blank, sizing, decoration, label and after-care evidence per released variant. Apply artwork tasks only to affected products in the release. Select the first ready subset; unready pieces remain Coming Soon. No paid sample orders are authorized by this task list alone. Latest evidence: Owner explicit reply 2026-09-21: No physical samples approved yet.
- **PAY-04:** Use matching LIVE key, LIVE webhook secret and LIVE shipping rate in correct Netlify function contexts; remove test bypass, verify signature and event modes, redeploy safely. Keep product gates until launch review.
- **IG-01:** Use INSTAGRAM-LAUNCH-PLAN.md and INSTAGRAM-COPY-READY.md. Reuse existing atmosphere assets and current wordmark; exclude stale FOUR PIECES/old prices/countdowns. No other social channels.
- **IG-02:** Confirm actual handle, professional dashboard, profile copy and working bio link; use Insights and tracked links where supported. No passwords in chat, no assumed publishing access.
- **IG-03:** Review first3 drafts; post organically to Instagram only when authorized. Avoid sales/date claims; no ads, outreach DMs, crossposts or auto email campaigns.
- **IG-04:** Photograph/film approved samples: fit, chest/back, fabric, tag and movement. Generated imagery is not evidence of actual sample quality.
- **LAUNCH-01:** Finalize product subset, verified costs/prices for each included variant (unready pieces stay closed), shipping/returns/support, payment/order/confirmation/track test, sample approval, accurate imagery and homepage routing. Then open only approved products and verify mobile purchase flow.
- **IG-05:** After live checkout and product links work publicly: launch Reel, product carousel and Stories with exact approved prices/links. No launch countdown until date is real.
- **IMG-01:** All product/color galleries and other customer-facing references use garment-only images; original files preserved. New audit inventory reviewed before edits. No replacement people generated. Latest evidence: PRODUCT-TILES-IMPLEMENTATION.md and PRODUCT-TILES-VERIFICATION.json
- **IMG-02:** Preserve reference-style 4:5 tiles with visible separation, complete silhouettes and light-garment contrast. Use exact approved blanks/colors/artwork; retain concept captions and source images. No blanket whitening or destructive garment masking. Latest evidence: PRODUCT-TILES-IMPLEMENTATION.md; existing garment assets preserved; ART-01/ART-02 remain open.
- **COPY-01:** Remove the three current product badges and any other current marketing occurrences. No replacement price badge. Preserve accurate required origin records. Optional artwork-specific brand copy only. Latest evidence: PRODUCT-TILES-IMPLEMENTATION.md and production pricing verification; no replacement origin badge.
- **WEB-QA:** Review every active product/colorway at mobile and desktop sizes, image clarity, complete silhouettes, gallery controls, alt text, related cards, no stale model/origin references and unchanged pricing/sales gates. Run relevant checks and provide preview evidence. Latest evidence: PRODUCT-TILES-VERIFICATION.json and PRICING-LIVE-VERIFICATION.json; new placement changes still require their own QA.
- **FUL-01:** Use existing GOOOL custom store 199130; configure credentials securely, verify integration and callbacks, exact SKU mappings and disabled submission during rehearsal. Activate only after product/launch gates pass. Latest evidence: LAUNCH-CONFIG-AUDIT-2026-09-21.json

## New owner requests — colorways, back print and affordable launch

New target: tees preferably $30–$40, hoodies $80–$85, 20–30% contribution before overhead/tax; revised final prices have not been approved or applied.

- **COLOR-01 — mockups_prepared_owner_review_and_supplier_proof_pending:** Review seven boards in designs/19_colorway-and-back-print-review. After owner choices, verify actual supplier color/size availability, exact artwork contrast, complete front/back proofs and per-variant quotes. Implement and reopen Apliiq designs before website variants. Preserve historical order snapshots.
- **ART-03 — mockups_prepared_owner_review_and_supplier_proof_pending:** Obtain review of the small below-collar exterior print; measure 2 mm font/detail strokes and true 300 dpi at intended size, confirm seam clearance and Apliiq method. Requote second print plus approved sewn label, require supplier proof and physical sample before sales.
