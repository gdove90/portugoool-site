# GOOOL launch task list

Stripe first; work on approved imagery/copy cleanup while external account steps are pending. New prices remain unpublished until costs are verified. Instagram only. See the root CLAUDE-LAUNCH-PRIORITY-PROMPT.md and IMAGERY-AUDIT.md.

| ID | Priority | Task | Status | Owner |
|---|---|---|---|---|
| PAY-01 | P0 | Verify deployed Stripe test connection | complete | Codex |
| PAY-02 | P0 | Complete Stripe business activation and bank onboarding | owner_action_required | Owner with Claude guidance |
| DB-01 | P0 | Restore GOOOL Supabase query access and inspect migrations | blocked_authentication | Owner/Claude |
| DB-02 | P0 | Apply only missing order/catalog migrations | pending_inspection | Claude |
| PAY-03 | P0 | Complete test purchase through webhook, order and tracking | pending_database | Claude |
| COST-01 | P1 | Verify supplier costs for every offered variant | 30_new_variant_item_quotes_verified_landed_costs_pending | Codex/Claude |
| PRICE-01 | P1 | Calculate and review six new retail prices | six_display_prices_owner_authorized | Codex/Owner |
| PRICE-02 | P1 | Publish owner-authorized prices consistently | implementation_complete_deployment_pending | Codex |
| SHIP-01 | P1 | Finalize actual shipping charge and delivery wording | waiting_supplier_quote | Claude/Owner |
| TAG-01 | P1 | Choose compatible label with actual-size proof | supplier_proof_pending | Claude/Owner |
| ART-01 | P1 | Apply casual tee3in placement in supplier and website | prompt_ready_execution_pending | Claude |
| ART-02 | P1 | Close circular scale and Modern Sport performance width issues | pending_proof | Claude/Owner |
| SAMPLE-01 | P1 | Approve physical samples for the first release subset | owner_sample_approval_required | Owner |
| PAY-04 | P0 | Configure live Stripe credentials/webhook/shipping and validate mode separation | waiting_activation_and_rehearsal | Claude |
| IG-01 | P2 | Prepare Instagram-only teaser and reveal drafts | drafts_prepared | Codex/Claude |
| IG-02 | P2 | Verify Instagram profile, link and measurement | account_action_pending | Owner/Claude |
| IG-03 | P2 | Review and publish brand-only Instagram teasers | awaiting_content_review | Owner/Claude |
| IG-04 | P2 | Capture real garment launch content | waiting_samples | Owner/Claude |
| LAUNCH-01 | P0 | Launch the first fully ready subset | gated | Owner/Claude |
| IG-05 | P2 | Publish launch-day Instagram sequence | waiting_launch | Owner/Claude |
| IMG-01 | P1 | Remove generated model views from active galleries | approved_execution_pending | Claude |
| IMG-02 | P1 | Standardize sharp garment imagery and seamless 4:5 frames | approved_execution_pending | Claude |
| COPY-01 | P1 | Remove Printed in the USA price-area marketing badges | approved_execution_pending | Claude |
| WEB-QA | P1 | Verify imagery cleanup and release preview | approved_execution_pending | Claude |

## Completion requirements

- **PAY-01:** Test key matches goool.shop account; enabled test webhook; HTTP200 test checkout created; livemode false, unpaid, $47.50 total. This does not prove paid-webhook persistence.
- **PAY-02:** Business details submitted, activation requirements cleared, charges and payouts enabled. Enter sensitive details directly in Stripe, never chat.
- **DB-01:** Correct project oexibflpshttgzmdvhpr query succeeds; run LAUNCH-DB-CHECK.sql. Connector currently returns password authentication failure. Do not touch the other listed project.
- **DB-02:** Verify0026 order schema and0027–0029 product records. Apply only necessary changes and read back. Do not blindly replay0027: it resets prices/images.
- **PAY-03:** Complete controlled Stripe test payment; verify event delivered once, correct order number/immutable snapshot persisted, success and tracking work, retry produces no duplicate, no Apliiq production submission.
- **COST-01:** Fill COST-INPUTS.json for66 size/color variants with exact saved-design quote, print/embroidery, label, application, packing, shipping, size surcharges and evidence. Codex signed in and verified all six new saved-design dropship costs and size surcharges (30 variants). Full landed costs remain incomplete. See APLIIQ-PRICING-RESEARCH-2026-09-21.md; public starting-price ranges are insufficient.
- **PRICE-01:** Run calculate-prices.py after quotes; compare contribution and largest-size costs. Internal previous 48/48/48/42/78/52 suggestions are not approved website prices.
- **PRICE-02:** Only after costs verified and prices finalized, update server catalog, DB product records, product cards/detail/metadata and checkout values. All six currently unpriced pieces need real prices; never display $0.
- **SHIP-01:** Quote single and multi-item US orders including size/fulfillment split effects. $9.50 is a TEST placeholder, not an approved live policy. Record shipping handling and realistic production/transit windows.
- **TAG-01:** Keep approved black/white/red Athletics visual. Compare color-capable service per blank, actual 1in legibility, attachment, supply+application cost. No standard white-stock black-only substitution. No label purchase without owner review.
- **ART-01:** Apply existing prompt to6098963/6099060; front visible top3in below bottom collar seam, width6.75in unchanged. Reopen proof; update both colors and retained garment-only front/gallery images; do not regenerate model views.
- **ART-02:** Verify circular visible art dimensions; reconcile performance9in target vs saved11in with a dimensioned approved proof. Preserve original geometry and distinct cotton/performance blanks.
- **SAMPLE-01:** Approve blank, sizing, decoration, label and after-care evidence per released variant. Apply artwork tasks only to affected products in the release. Select the first ready subset; unready pieces remain Coming Soon. No paid sample orders are authorized by this task list alone.
- **PAY-04:** Use matching LIVE key, LIVE webhook secret and LIVE shipping rate in correct Netlify function contexts; remove test bypass, verify signature and event modes, redeploy safely. Keep product gates until launch review.
- **IG-01:** Use INSTAGRAM-LAUNCH-PLAN.md and INSTAGRAM-COPY-READY.md. Reuse existing atmosphere assets and current wordmark; exclude stale FOUR PIECES/old prices/countdowns. No other social channels.
- **IG-02:** Confirm actual handle, professional dashboard, profile copy and working bio link; use Insights and tracked links where supported. No passwords in chat, no assumed publishing access.
- **IG-03:** Review first3 drafts; post organically to Instagram only when authorized. Avoid sales/date claims; no ads, outreach DMs, crossposts or auto email campaigns.
- **IG-04:** Photograph/film approved samples: fit, chest/back, fabric, tag and movement. Generated imagery is not evidence of actual sample quality.
- **LAUNCH-01:** Finalize product subset, verified costs/prices for each included variant (unready pieces stay closed), shipping/returns/support, payment/order/confirmation/track test, sample approval, accurate imagery and homepage routing. Then open only approved products and verify mobile purchase flow.
- **IG-05:** After live checkout and product links work publicly: launch Reel, product carousel and Stories with exact approved prices/links. No launch countdown until date is real.
- **IMG-01:** All product/color galleries and other customer-facing references use garment-only images; original files preserved. New audit inventory reviewed before edits. No replacement people generated.
- **IMG-02:** Front/back/detail use verified blanks/colors and exact approved artwork. Consistent category scale, seamless white backgrounds and restrained shadows; fix baked-in backgrounds and CSS. No cropped edges, unsupported upscaling, or fabricated sample evidence. Retain concept captions.
- **COPY-01:** Remove the three current product badges and any other current marketing occurrences. No replacement price badge. Preserve accurate required origin records. Optional artwork-specific brand copy only.
- **WEB-QA:** Review every active product/colorway at mobile and desktop sizes, image clarity, complete silhouettes, gallery controls, alt text, related cards, no stale model/origin references and unchanged pricing/sales gates. Run relevant checks and provide preview evidence.
