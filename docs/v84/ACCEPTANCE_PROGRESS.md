# Acceptance progress - 2026-10-07

This is an evidence overlay on the 331-row discovery ledger. Unlisted IDs retain their discovery state. `Implemented` means local code exists, not that the finished staging acceptance gate passed. No scope is deferred.

| Requirement ID | Current state | Evidence / remaining gate |
|---|---|---|
| S01-04 | Verified | Isolated branch starts at production 11b1a2f; excludes unreleased primary-checkout changes. |
| S01-09 | Verified | UI tests cannot submit live fulfillment; backend regression network disabled. Separately authorized October 6 recovery submitted one cap order, verified an owner-submitted hoodie, and reconciled both supplier IDs, without deploying UI changes. |
| S01-10 | Verified | Reference stays local; no deployment or upload. |
| S02-05 | Verified | Owner's explicit complete-v84 implementation approval in this chat. |
| S02-06 | Verified | Isolated branch is pushed to draft PR #4 and deploy preview; no production merge/deployment. |
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
| S20-06 | Implemented | Inventory/asset mapping retained; Men and four homepage products now approved and mapped to real existing IDs. Women remains unassigned. |
| S20-07 | Implemented | .env.v84.example and implementation status list names only, no secret values. |
| S20-08 | Verified | New CLI-generated additive intake migration applied and provider history aligned; roles/RLS/private bucket read-back and provider tests pass. No commerce migrations replayed. |
| S20-11 | Pending | No finished staged release exists yet; no request for production approval made. |
| S20-12 | Pending | Production deployment is authorized, but full visual/browser-to-provider acceptance is not complete. No merge/deployment merely to escape a browser block. |
| S21-01 | Implemented | /collection redirects to /shop; Next App Router retained. |
| S21-02 | Implemented | Nine approved Men products; Women unassigned. Homepage: Core Hoodie Red, Terrace Tee Red, Matchday Tee, Touchline Cap in approved order. |
| S21-03 | Verified | Existing GOOOL organization is Pro; private bucket exactly 100 MiB, global capacity 105 MB, exact 100 MiB provider upload verified and fixture removed. |
| S21-04 | Implemented | Dedicated intake credentials/tables; no commerce/newsletter fallback or schema edits. |
| S21-05 | Verified | Actual provider private media, scoped uploads, anonymous rejection and signed owner reads pass; browser acceptance remains separately pending. |
| S21-06 | Pending | Local transaction/idempotency/deletion tests pass; real concurrent network/storage test pending. |
| S21-07 | Blocked | Applied order_export restriction is not in deployed migration files; no production migration replay attempted. |
| S21-08 | Implemented / Pending | Storage/Auth provisioned and nine scoped INTAKE variables configured; verified real owner UUID allowlisted. Preview Stripe test key absent. Browser-to-provider and real-owner UI acceptance remain unverified. |

October 6 continuation: dashboard stale-request protection passes nine local controller checks; upload retries/concurrency pass five local transport checks. Men count/filter and story review/failure/edit retention verified in the rebuilt browser preview. Header breakpoint geometry and four hero comparisons at actual 390/1440 pass; complete screenshot matrix and live integrations remain pending. Owner email confirmed; access not provisioned.

Tests: `scripts/test-v84.cjs`, `scripts/test-v84-admin.cjs`, `scripts/test-v84-upload.cjs`, `scripts/smoke-v84.cjs`, original `scripts/test-launch-backend.cjs`.
See `IMPLEMENTATION_STATUS.md` for test limitations, implementation coverage and remaining requirements.

October 7 current overlay: the latest ready preview is application commit b21a534 and deploy 6ac5c49cc8f15a0008bf4b99. The historical October 6 note about unprovisioned access is superseded by verified confirmed Auth UUID and functions-scoped Netlify configuration. Browser access to the preview remains denied by a saved preference, and the independent localhost browser request was also denied. See RELEASE_ACCESS_AUDIT.md for permitted alternatives, exact unavailable acceptance and recovery target. No new browser evidence or production release is claimed.
