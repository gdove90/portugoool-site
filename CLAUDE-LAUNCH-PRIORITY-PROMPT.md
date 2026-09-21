> **Latest owner decisions (2026-09-21):** Modern Sport is performance-only; cotton is archived with files retained. Pricing now targets 25% modeled contribution: [current price model](designs/18_launch_operations/PRICING-25-PERCENT.md). [Current design review](designs/19_colorway-and-back-print-review/README.md) supersedes the straight crewneck back layout and seven-active-product color plan: six color proposals remain, crew lettering follows the collar curve, and detail views apply only to small back prints. Keep sewn-tag/sample/payment requirements.

# Claude — execute GOOOL launch preparation

Work in C:\Users\gdove\OneDrive\Desktop\GOOOL as the lead commerce engineer and garment-production coordinator. Execute the next unblocked work to a reviewable result; do not stop at another plan. Read CLAUDE.md, LAUNCH-TASK-LIST.md, designs/18_launch_operations/TASKS.json and designs/00_asset-library/START-HERE.md. Preserve concurrent work and use existing canonical packages. Include a ready-to-copy next-action prompt in your response.

## Current owner decisions and evidence

- The owner wants to launch within 24 hours if feasible. No physical samples have been approved. Live Stripe activation is unknown to the owner. Do not manufacture approvals, equate a concept mockup with a sample, or promise supplier turnaround.
- All ten website products now have prices. Preserve the six newly published USD prices: Modern Sport cotton 64; Varsity 68; Minimal Club 64; Circular Badge 48; Circular Center Crewneck 128; Modern Sport Performance 64. Read PRICING-RELEASE-2026-09-21.md and PRICING-LIVE-VERIFICATION.json in designs/18_launch_operations. Publication was explicitly authorized; older instructions to leave these six unpriced are superseded. Unknown landed costs remain unknown and must be resolved before sales.
- Preserve the deployed reference-style 4:5 studio tiles, visible separation and light-garment contrast. Read PRODUCT-TILES-IMPLEMENTATION.md. Model images and price-area Printed in the USA badges stay removed. Do not repeat blanket whitening or change garment color/geometry. Originals remain preserved.
- TAG-IMPLEMENTATION-AUDIT-2026-09-21.json records an authenticated Apliiq account with no neck-print, private-label, printed-label or woven-label supplies. Crewneck 6112046 still shows setup new branding. The tag is not implemented.
- LAUNCH-CONFIG-AUDIT-2026-09-21.json records zero paid sessions among all three returned Stripe test sessions, missing production APLIIQ_APP_ID/APLIIQ_SHARED_SECRET, and a live signup form with Mailchimp settings present. Presence does not prove valid credentials or a successful subscription. The Stripe test-key account preflight reports charges_enabled=false, payouts_enabled=false, details_submitted=false; empty requirements does not establish live onboarding status. Verify live status directly.

## 1. Stripe first — complete a real test rehearsal and resolve live activation

Help the owner check the correct GOOOL account in Stripe and complete business/bank requirements directly there. Do not ask for secrets or sensitive identity/bank details in chat. Keep independent work moving during owner-only steps.

Recheck current order schema and access in Supabase project oexibflpshttgzmdvhpr. Read SESSION-EVIDENCE-2026-09-21.md before repeating migration work: 0026 was reported applied through the SQL editor. Connector authentication failure is not missing schema. Never use an unrelated project or blindly replay 0027, which can reset prices/images.

Create or reuse one valid TEST checkout; prove livemode=false and real supplier submission disabled before completing payment. Verify Stripe payment/event delivery, one stripe_events record, one order with order number/paid_at/amounts, immutable product/color/size/Apliiq snapshot, success page, tracking, and replay without duplicate order or fulfillment. Do not claim a signed synthetic event proves card payment. Report action results separately from persisted database status: left_pending_disabled is an action, pending_submission is the expected stored status while submission is disabled. Redact customer tokens and secrets in shared evidence.

Configure LIVE key, matching LIVE webhook secret and LIVE shipping rate only after activation and successful rehearsal. The $9.50 GOOOL TEST shipping object is not a live shipping policy. Do not remove Coming Soon or enable automatic supplier submission before product and launch gates pass.

## 2. Implement the approved sewn tag; show any necessary alternative first

The owner explicitly wants designs/goool-athletics-brand-label/approved-tag-concept.png implemented: a sewn black fabric tag, exact white navigation GOOOL with three Os, WHITE–RED–WHITE segmented underline, and white ATHLETICS beneath. Nominal appearance is 1 inch square, subject to demonstrated production legibility. The source-derived flat SVG/PNG is a candidate, not an exact reproduction or supplier-approved master; reconcile its spacing with the approved concept before upload.

Inspect actual color-capable sewn-label services for each intended blank and cap. Verify finished dimensions, safe/sewing margins, minimum text and line size, placement, setup/inventory/application costs, stock and lead time. Show a dimensioned artwork proof and in-garment mockup at a stated scale; get a supplier manufacturing proof where available. Do not silently enlarge the tag, remove ATHLETICS/red, substitute black-only private labels, or choose a heat transfer because it is faster. Apliiq's full-color printed label is heat-applied, not the approved sewn finish.

If Apliiq cannot reproduce the approved concept, document the exact constraint and show a feasible alternative mockup alongside the approved reference BEFORE requesting approval or implementation of that alternative. A mockup is not manufacturing verification. Prepare all artwork and an exact itemized quote before any purchase approval request. No label stock, paid samples or subscription purchase is authorized yet.

Once the chosen service/artwork and any necessary purchase are approved and supply is available, apply it to each compatible saved design, reopen and verify persistence, and record service/supply ID, product/variant coverage, interior placement, dimensions and proof links. Preserve mandatory garment-specific size/fiber/care/origin information. Account-level inventory alone is not proof of product attachment. Do not claim every garment is covered from one spot check.

## 3. Finish garment placement and fulfillment preparation

The Casual Wordmark Tee remains unfinished. Follow CLAUDE-CASUAL-TEE-PLACEMENT-PROMPT.md for both Washed Black and Washed Grey: visible artwork TOP 3.00 inches below the bottom center-front collar seam; width 6.75 inches unchanged. Existing designs are 6098963 and 6099060. Fix actual saved supplier placement and garment-only website mockups, preserve original logo geometry, and provide dimensioned before/after evidence. Moving the entire image or CSS panel does not fix print placement. If recreation is necessary, verify new IDs/SKUs and future checkout mappings without altering historical order snapshots. Do not restore model images.

Resolve Circular Badge visible-art scale and Modern Sport Performance 9-inch target versus saved 11-inch width using authoritative specs/proofs. Keep cotton and performance blanks distinct. Verify all offered variants against actual Apliiq blank/color/size availability.

Use the existing Apliiq custom store GOOOL, ID 199130; do not create a duplicate. Configure its missing app credentials securely and verify the supported integration/callback path with production submission still disabled. Verify credential and fulfillment gates; environment-variable presence alone is not success. Finalize label, fulfillment, packing, size surcharges and real single/multi-item shipping costs, without double-counting or converting unknown costs to zero. Preserve published prices while reporting any material margin issue for decision.

Prepare the smallest practical sample order with exact garment, print and sewn-label proof, quantities, total and shipping for owner review. Do not purchase before approval. Recommend the first ready subset, but keep every unapproved piece closed. No physical samples are approved today.

## 4. Use the 24-hour window honestly: prepare Instagram and signup readiness

Paid-sales launch depends on sample/tag approval, accurate supplier mapping, live Stripe, completed order rehearsal and verified shipping/returns/support. Do not bypass those gates to meet the target. If manufacturing/sample timing prevents sales within 24 hours, present a brand reveal and signup launch as the feasible alternative, clearly separated from opening purchases.

Prepare Instagram-only teaser Reel/story/carousel drafts using existing approved brand artwork and garment-only concepts accurately labeled. Use INSTAGRAM-COPY-READY.md and INSTAGRAM-LAUNCH-PLAN.md; no new platforms, ads, DMs, email campaigns, unsupported sample-quality claims or invented delivery dates. Confirm actual handle/access and reviewable final content before publishing. Verify bio link and signup API/integration, with a consented real test subscriber if an end-to-end signup test is needed. Mailchimp settings and a visible form alone do not prove signup works. No sales countdown or Shop Now while purchases remain closed.

## 5. Verification and handoff

Check relevant build/types, mobile/desktop catalog and affected variants, complete silhouettes, light-garment contrast, sharp unchanged artwork, prices and gates. Do not run a dev/harness server against the same .next directory during deployment. Deploy completed authorized website fixes and verify the real production output; documentation-only changes do not require a site rebuild.

Update the existing TASKS.json and TASK-LIST.md with evidence and keep them consistent. Report what changed, what passed, what is pending externally and the next owner action. No repeated permission request for previously authorized website fixes or price publication. Do not mark a task complete because its instructions or artwork files exist.
