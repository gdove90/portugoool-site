# Claude — launch GOOOL as soon as it is actually ready

Work in C:\Users\gdove\OneDrive\Desktop\GOOOL. Read LAUNCH-TASK-LIST.md and designs/18_launch_operations/TASKS.json. Update task status/evidence as work lands. The owner wants every response to include a ready-to-copy next-action prompt. Marketing is strictly Instagram only.

PRIORITY 1 — STRIPE
Codex verified the current TEST key belongs to goool.shop and the deployed checkout creates an unpaid, livemode=false test session. The enabled test webhook exists. This is not a complete payment rehearsal. Account response reports charges/payouts disabled and business details not submitted. Help the owner finish live onboarding/bank details directly in Stripe; never request secret keys or bank details in chat.

Fix the GOOOL Supabase connection for project oexibflpshttgzmdvhpr. Management metadata works, but SQL/migration inspection hit database password-authentication errors. Use an authenticated SQL editor if necessary and run LAUNCH-DB-CHECK.sql. Inspect before applying0026–0029. Do not blindly replay0027 because it resets prices/images, and do not run the insert-based verify-db-schema.sql harness on production. After verifying schema, complete a real Stripe TEST checkout, webhook delivery, stored order number, immutable item snapshot, success page and tracking, including duplicate delivery. Keep real supplier submission disabled. Then prepare matching LIVE key/webhook/shipping settings; $9.50 is only test shipping. Do not open sales before the existing launch gates pass.

PRIORITY 2 — VERIFIED COSTS, THEN WEBSITE PRICES
Owner explicitly chose: KEEP PRICES UNPUBLISHED UNTIL COSTS ARE VERIFIED. Do not publish provisional 48/48/48/42/78/52 prices. Using your authenticated Apliiq session, fill COST-INPUTS.json for all 66 offered size/color variants. Capture exact finished-design prices, size surcharges, chosen label unit/application costs, packaging and shipping, with evidence/date and no double-counting. Run calculate-prices.py and finalize the six new product prices from real margins. Once verified/finalized, synchronize website catalog, database, cards, details, metadata and checkout prices. Keep unpriced items unpurchasable and never display $0.

PRIORITY 3 — PRODUCT READINESS
Finish the color-capable Athletics label comparison and actual-size proof per blank; no black-on-white substitution. Apply the casual tee3in collar-to-art-top revision using CLAUDE-CASUAL-TEE-PLACEMENT-PROMPT.md. Close the circular visible-scale and performance9in/11in proof discrepancies. Recommend the first 1–3 fully ready products for release rather than waiting for every future design. Preserve sample approval; no paid label/sample orders without owner authorization.

PRIORITY 4 — INSTAGRAM ONLY
Use INSTAGRAM-LAUNCH-PLAN.md, INSTAGRAM-COPY-READY.md and INSTAGRAM-ASSET-SELECTION.json. Prepare first 3 brand teaser drafts now using existing atmosphere assets and exact wordmark. Retire stale FOUR PIECES/old-price/door-open copy. Prepare real-sample product reveals, size/detail content and launch-day Reels/carousels/Stories. No fixed countdown or Shop Now until the public links/payment flow are ready. No other channels, crossposts, ads, outreach DMs or email campaigns. Confirm the actual Instagram handle/access and review drafts before publishing.

Report completed changes, exact blockers, proofs/results and the single next most useful action. Separate connected test checkout from live activation and actual fulfillment readiness. Include a ready-to-copy prompt in every response. Do not replace unfinished tasks with a claim that everything is launched.
