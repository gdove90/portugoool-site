# Claude — complete GOOOL launch preparation

Work in C:\Users\gdove\OneDrive\Desktop\GOOOL. The owner has approved the imagery-cleanup recommendations below. Implement the website cleanup and prepare the launch; do not stop at another plan. Read CLAUDE.md, LAUNCH-TASK-LIST.md, designs/18_launch_operations/TASKS.json, and designs/00_asset-library/START-HERE.md. Re-check current work before editing so concurrent changes are preserved. Update existing canonical records rather than create competing packages. Include a ready-to-copy next-action prompt in every response.

## 1. Stripe first; keep useful website work moving during account blockers

Re-check current status. The last verified state was a working deployed TEST Checkout Session, unpaid and livemode=false; a complete paid test/webhook/order rehearsal is still unproven. See designs/18_launch_operations/STRIPE-NEXT-STEPS.md and STRIPE-PREFLIGHT-RESULT.json. Guide the owner through any outstanding live business verification/bank steps directly in Stripe, never by sharing credentials in chat.

Restore query access to GOOOL Supabase project oexibflpshttgzmdvhpr. Use the read-only LAUNCH-DB-CHECK.sql before applying only missing/necessary migrations. Authentication failure does not prove missing schema. Do not blindly replay migration0027, which can overwrite prices/images, or run insert-based production schema probes. Prove a controlled test-card checkout through webhook delivery, one stored order and immutable item snapshot, confirmation and tracking; replay the event and verify no duplicate order or fulfillment. Keep real supplier submission disabled throughout testing. Configure matching LIVE Stripe key, webhook signing secret and verified shipping rate only after onboarding/rehearsal; $9.50 is test shipping, not approved live shipping. Never expose secrets. Retain sales gates until launch conditions pass.

## 2. Implement the approved catalog imagery cleanup

Read designs/18_launch_operations/IMAGERY-AUDIT.md and imagery-audit evidence. At audit time the 10 active products referenced53 images, including26 model shots; all53 matched the publicly served source files. Re-inventory current catalog before editing in case new work has landed.

Remove generated model/stadium shots from all active product and color-variant galleries, thumbnails and any other customer-facing references. Preserve originals and source provenance; do not delete manufacturing artwork or unrelated crowd/brand imagery. Do not generate replacement people. This supersedes older instructions to refresh model images, including the model portion of the casual-placement handoff.

Use garment-only front, back and useful print-detail views. Show the exact approved blank/color/fit and artwork placement; uniform framing must not make different blanks artificially identical. Modern Sport Performance currently has only a front view: add an accurate back/detail view from its verified spec, never reuse the cotton blank as the performance garment. Preserve concept-render captions until real sample photographs replace concepts; do not invent photographic fabric or construction evidence.

Make product cards, related products and main galleries use a consistent4:5 portrait frame. Standardize optical scale and safe margins by garment category. Fully retain necklines, sleeves and hems; avoid automatic square cover crops and hover zoom that clips edges. Use a seamless white presentation with no visible gray rounded panel. The current gray backgrounds exist both in CSS and inside image pixels: fix both. Preserve white/ivory garment edges with restrained natural shadows. Use the highest-quality originals and exact artwork masters, not screenshots or repeatedly compressed website exports. Do not redraw logos, alter proportions or fabricate detail with aggressive sharpening/upscaling. Check responsive image sizing, thumbnails, compression and actual high-density screen rendering.

Apply the approved casual tee placement to both colors and supplier proofs: top of visible art3.00in below the bottom center-front collar seam,6.75in width unchanged. Follow CLAUDE-CASUAL-TEE-PLACEMENT-PROMPT.md except for its now-superseded model-image requirements. Reconcile circular artwork scale and Modern Sport Performance9in/11in discrepancy before rendering or releasing those pieces.

## 3. Remove the price-area origin badge

Remove "Printed in the USA" from customer-facing cards and product price areas for Performance Badge Tee, Core Hoodie and Casual Wordmark Tee, and check other current occurrences. Keep price/name presentation uncluttered; no replacement badge is required. If brand-story copy needs an alternative, use "Original GOOOL artwork" or "Designed by GOOOL" clearly referring to the artwork. Do not substitute "Crafted in the USA," "Made in USA," or unsupported design-location claims. Preserve accurate supplier and mandatory garment-origin records/labels; marketing-badge removal does not authorize deleting them.

## 4. Verify costs before publishing any new prices

The owner explicitly requires new prices to remain unpublished until costs are verified. Do not publish the earlier provisional48/48/48/42/78/52 figures. In your authenticated Apliiq session verify saved design/blank/color/size costs, decoration, chosen labeling supply/application, packaging, size surcharges and shipping. Populate COST-INPUTS.json with evidence and avoid double-counting. Run calculate-prices.py; planning margins/reserves are assumptions to review. Finalize prices from verified costs and synchronize catalog/database/checkout/card/detail/structured data. Keep unresolved products unpriced and unpurchasable; never display$0. Check existing priced products' margins too. Prioritize quotes for the first release, then finish all66 offered variants.

## 5. Garments, labeling and fulfillment

Maintain the approved Athletics label visual: black background, navigation GOOOL lettering, white/red/white segmented line, ATHLETICS below. Standard white-stock/black-only private labels do not reproduce this design. Confirm current color-capable service compatibility, actual-size legibility, attachment and exact costs for each relevant blank. Printed labels and sewn woven tags are not interchangeable; obtain a reviewable proof and state the difference. No silent design substitution or unauthorized label/sample purchase.

Confirm every released SKU/size/color maps to the correct saved Apliiq design and agreed artwork. Recommend the first1–3 fully ready products; keep other pieces Coming Soon. Require the owner's physical sample approval for the released variants. Verify shipping/returns/support wording, production timelines and order-to-supplier mapping. Retain intentional fulfillment approval gates until their existing requirements are satisfied; no paid supplier submission from rehearsal.

## 6. Instagram only

Use INSTAGRAM-LAUNCH-PLAN.md, INSTAGRAM-COPY-READY.md and INSTAGRAM-ASSET-SELECTION.json. Prepare brand teasers now using existing atmosphere art and exact brand assets. Product teasers must follow the new garment-only presentation; use real sample footage for fit/fabric/tag claims and launch product reveals. Replace stale FOUR PIECES, old prices and premature door-open language. Prepare the first teaser Reel, product-detail carousel and Stories, plus launch-day versions with verified prices and tracked product links. Confirm the actual Instagram handle/access. Keep posts as reviewable drafts until publishing is authorized. No other social platforms, paid ads, outreach DMs or email campaign. No countdown or Shop Now until the launch date and public purchasing flow are ready.

## 7. Validate and report

Verify all active products/colorways on mobile and desktop: no generated model references, no accidental garment cropping, no gray-box seams, sharp exact artwork, accessible gallery controls/alt text, accurate pricing state, no obsolete origin badge and no checkout regressions. Run appropriate existing checks once; inspect the actual preview. Do not build while a dev/harness server shares the same.next directory. Prepare a reviewable preview and evidence before production rollout.

Update TASKS.json and TASK-LIST.md with actual evidence. Prepare the final release checklist for only the sample-approved subset: verified costs/prices, approved images/labels/SKU mappings, shipping/support policies, live payment configuration, tested order/confirmation/tracking and correct public homepage/store routing. Do not announce or claim a launch while any required gate remains unresolved. Report completed changes, what is still blocked, where owner action is actually necessary, and the single next best action. Never request approval again for the image cleanup already authorized here.
