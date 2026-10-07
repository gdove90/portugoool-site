# Release access audit - 2026-10-07

## Verified deployment state

- Reviewed application head: `b21a534dfc3e08097a5a0fa431018c6b689ccbfe`.
- Netlify deploy `6ac5c49cc8f15a0008bf4b99`: ready, deploy-preview context, matching head, no deploy error.
- GitHub PR #4: open, draft, mergeable, not merged; base `11b1a2f8182b71785205f2ff6bd2ba537ce52081`.
- GitHub combined status: `netlify/goool-shop/deploy-preview` succeeds. No PR-triggered GitHub Actions workflow runs exist for this head; this is not browser E2E evidence.
- Netlify project metadata still reports published deploy `6abeb64d0b1957000816ba19`. The facelift is not live.

## Access boundary and alternatives

| Path | Evidence / result | What it cannot establish |
|---|---|---|
| Chrome extension, existing staging tab | Chrome warning cleared, but saved user site preference rejects access to `https://deploy-preview-4--goool-shop.netlify.app` | Rendered page inspection, clicks, submissions, sign-in and screenshots on that host are inaccessible to the agent |
| Other browser integration on staging | Not used; browser policy explicitly forbids alternate surfaces as a workaround for the saved block | Cannot legitimately replace the rejected staging browser |
| Independent local built release, in-app browser | Server started successfully on `http://127.0.0.1:3187`; separate browser permission request was denied; server stopped afterward | Local rendered acceptance and screenshots are also unavailable now |
| External Playwright, raw CDP or shell-driven browser | Not used; browser-control instructions require the documented CUA surface and prohibit bypassing denied origins | Installing another automation driver cannot legitimately evade either denial |
| Local controller/SQL/HTTP tests | Already passed: 27 v84, nine admin, five upload, six maintenance, 44 commerce, 123 route/link/asset and six fail-closed HTTP checks | Not a complete rendered desktop/mobile reference comparison or cloud-hosted workflow acceptance |
| Direct Supabase SDK/API tests | Previously verified private 100 MiB upload, application submission routes, owner/non-owner authorization, cookies, inbox/pagination/media/review/delete, refresh/sign-out, expired-draft cleanup; disposable fixtures cleaned | Not browser-to-provider or actual owner's private password sign-in acceptance; no owner credential is available to the agent |
| Netlify connector/CLI and GitHub connector | Independently verifies build/deploy status, commit identity, production deploy and PR state | A ready build does not prove visual geometry, mobile usability, uploaded-video playback, provider checkout completion or owner UI access |
| Preview HTTP through a different tool/domain | Not attempted as a replacement for blocked browser inspection; no changed host, tunnel or production publication to evade the block | Would not supply legitimate rendered browser acceptance |

Native application control is disabled in the available CUA surface. No supported tool can operate the desktop app's browser-permission settings. Reading a skill for native automation does not make its separate runtime available or authorize replacing CUA. The agent did not change blocklists, weaken Chrome protection, request passwords, extract cookies or create credentials for the real owner.

## Remaining release-blocking acceptance

1. Complete rendered desktop/mobile comparison of approved pages, sections, footer, menus/dialogs, keyboard/touch/reduced motion and actual product availability behavior. Existing spot screenshots/geometry checks do not cover this matrix.
2. Browser-to-provider story, match-video and kit flows: playable local preview, required agreement gating, review/edit retention, actual upload, durable receipt and retry behavior, without customer data or marketing enrollment. Final participation-agreement acceptance also requires action-time confirmation under browser policy.
3. Actual owner browser sign-in/inbox acceptance. The confirmed UUID and exact allowlist are configured, but the agent has neither the owner's password nor a usable signed-in owner browser session. Service-role tests are not evidence of that real user flow.
4. Redesigned deployed shopping/cart/Stripe handoff acceptance and post-release intake/scheduler verification. Baseline live unpaid Stripe handoff passed; no paid provider transaction or real email was sent. A preview test key remains absent and live payment/fulfillment must not be used as a substitute test.
5. Actual deployed desktop/mobile screenshots. No new screenshots were captured this audit; do not fabricate image paths or represent older spot images as complete evidence.

No production merge is performed because these acceptance gates have not passed. Deployment remains authorized; this is an access/verification limitation, not a missing release approval.

## Recovery target

Known-good pre-facelift target: commit `11b1a2f8182b71785205f2ff6bd2ba537ce52081`, Netlify deploy `6abeb64d0b1957000816ba19`. After a future published regression, create a corrective Git revert of the recorded release merge/commit and redeploy through CI. Do not reset/force-push main, restore an old Netlify snapshot, roll back customer data or replay commerce migrations. No release has occurred in this audit, so no rollback action is necessary.
