# Acceptance progress - 2026-10-05

This is an evidence overlay on the 331-row discovery ledger. Unlisted IDs retain their discovery state. `Implemented` means local code exists, not that the finished staging acceptance gate passed. No scope is deferred.

| Requirement ID | Current state | Evidence / remaining gate |
|---|---|---|
| S01-04 | Verified | Isolated branch starts at production 11b1a2f; excludes unreleased primary-checkout changes. |
| S01-09 | Verified | No provider actions, billing edits or fulfillment retries; backend regression network disabled. |
| S01-10 | Verified | Reference stays local; no deployment or upload. |
| S02-05 | Verified | Owner's explicit complete-v84 implementation approval in this chat. |
| S02-06 | Verified | No code push or production deployment. |
| S03-01 | Verified | Catalog unchanged in 89-file baseline comparison. |
| S03-02 | Implemented | Existing slug pages and redirects retained; full URL/SEO audit pending. |
| S03-03 | Verified | Baseline comparison plus 83-variant server-price regression. |
| S03-04 | Verified | All 83 supplier/variant snapshots pass preserved regression suite. |
| S03-05 | Implemented | Existing availability helpers drive new PDP; full unavailable-variant UI matrix pending. |
| S03-06 | Verified | Original cart context unchanged; browser add/quantity/remove tested with a real product. |
| S03-07 | Verified | Discount/shipping regression passes; browser $38+$6.95 and $76/free-shipping totals checked. |
| S03-08 | Implemented | Existing payment/order code unchanged; staging payment and refund verification pending. |
| S03-09 | Verified | Existing webhook and replay tests pass; protected handler unchanged. |
| S03-10 | Verified | Email templates/schedules unchanged; mock delivery/retry/welcome/unsubscribe regressions pass. |
| S03-11 | Implemented | Original consent logic retained, footer opt-out restored; real configured browser audit pending. |
| S03-12 | Implemented | Original tracking modules retained and regression passes; full new-UI analytics audit pending. |
| S03-13 | Implemented | New route canonicals and sitemap; admin/sample noindex; full deployed metadata audit pending. |
| S04-01 | Implemented | Brand.tsx uses approved V1.2 geometry; generated templates preserve original polygons. |
| S04-02 | Implemented | Approved header CSS ported; desktop/mobile spot checks, full width matrix pending. |
| S04-03 | Implemented | Original separation CSS imported; React disclosures use equivalent polygon translations. |
| S04-04 | Implemented | Original reduced-motion rules and depth gating retained; device preference test pending. |
| S04-05 | Implemented | Inter 400/500/600/700 self-hosted; desktop screenshot checked. |
| S04-06 | Implemented | Barlow Condensed 400/500/600/700 self-hosted; desktop screenshot checked. |
| S04-07 | Implemented | Approved hero markup/line breaks retained; comprehensive computed-style comparisons pending. |
| S04-08 | Implemented | Approved source colors imported and scoped. |
| S04-09 | Verified | All 32 packaged visual assets are byte-identical; no generated replacements. |
| S20-04 | Pending | This is a checkpoint overlay, not the completed acceptance ledger. |
| S20-05 | Pending | Browser screenshots inspected; full archived before/after matrix still required. |
| S20-06 | Implemented | Discovery PRODUCT_INVENTORY.json and ASSET_MAPPING.csv retained; owner assignments pending. |
| S20-07 | Implemented | .env.v84.example and implementation status list names only, no secret values. |
| S20-08 | Implemented | Unapplied additive SQL proposal and staging-only procedure; migration generation/application pending. |
| S20-11 | Pending | No finished staged release exists yet; no request for production approval made. |
| S20-12 | Pending | Production deployment is explicitly prohibited until later approval. |
| S21-01 | Implemented | /collection redirects to /shop; Next App Router retained. |
| S21-02 | Blocked | Awaiting owner audience assignments and homepage feature selection. |
| S21-03 | Blocked | Inspected private provider ceiling 50 MB vs required 100 MiB; no upgrade authorized. |
| S21-04 | Implemented | Dedicated intake credentials/tables; no commerce/newsletter fallback or schema edits. |
| S21-05 | Implemented | Owner-gated private media, 60-second signed reads, per-object upload tokens; live storage test pending. |
| S21-06 | Pending | Local transaction/idempotency/deletion tests pass; real concurrent network/storage test pending. |
| S21-07 | Blocked | Applied order_export restriction is not in deployed migration files; no production migration replay attempted. |
| S21-08 | Blocked | Local credentials intentionally unset; isolated cloud storage/auth/payment setup not yet provisioned. |

Tests: `scripts/test-v84.cjs`, `scripts/smoke-v84.cjs`, original `scripts/test-launch-backend.cjs`.
See `IMPLEMENTATION_STATUS.md` for test limitations, implementation coverage and remaining requirements.
