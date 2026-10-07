# V84 implementation checkpoint - 2026-10-07

## Current release status (supersedes historical checkpoints below)

IN PROGRESS. Complete production deployment is authorized, but not yet performed. Production remains on `11b1a2f8182b71785205f2ff6bd2ba537ce52081`, deploy `6abeb64d0b1957000816ba19`. Isolated branch `codex/v84-facelift` is pushed to draft PR https://github.com/gdove90/portugoool-site/pull/4. Ready staging: https://deploy-preview-4--goool-shop.netlify.app, commit `37553279c9d19cd28f03b15544e9a7aad68a6f2a`, deploy `6ac5bfc684f8ea00084af0b7`. Subsequent local security/test documentation changes are not yet pushed.

- Homepage approval is resolved: Core Hoodie Red ($78), Terrace Tee Red ($38), Matchday Tee ($38), Touchline Cap ($32), in that order. Men contains the nine existing approved adult-fit products; Women remains unassigned. No supplier records were deleted.
- GOOOL organization `lhinkmqrxofihbokgjfo` is Pro; project `oexibflpshttgzmdvhpr` is ACTIVE_HEALTHY. Intake schema, private storage and exact 100 MiB capacity are provisioned and provider-tested. No additional purchase occurred.
- Owner privately created a confirmed `hello@goool.shop` account. Verified UUID `5ad08879-2849-406f-af62-549c8635bec3` is the exact owner allowlist. Nine INTAKE variables are configured functions-only for production and deploy previews, with scoped secrets and exact origins. Existing commerce values remain unchanged. No owner password was requested in chat or stored.
- Actual provider tests pass for all three submission routes, atomic receipts/retries, private media, owner/non-owner/anonymous authorization, notes/status/deletion, refresh/sign-out and search/filter/50+5 pagination. All disposable fixtures/accounts were cleaned. New authenticated maintenance tests verify expired-draft removal, fresh-draft and received-record preservation and unauthorized rejection; cleanup completed.
- An inherited SECURITY DEFINER sold-counter exposure was fixed in migration `20261007034613_restrict_legacy_sold_counter`: fixed search path, service_role-only execution. Cloud privilege read-back and local SQL regression pass. No invocation or customer/product row mutation occurred. The advisor warning is cleared; leaked-password protection remains disabled.
- Latest clean production build, lint and type validation pass, with 42 pages generated. OneDrive's generated-cache readlink error was resolved by removing only the verified `.next` directory and rebuilding. Current local suites pass: 27 v84, nine dashboard, five upload, six maintenance and 44 network-disabled commerce checks. 89 commerce baseline files and 32 approved assets remain unchanged. Final rebuilt preview also passes 123 route/link/asset checks across 32 pages and six fail-closed HTTP checks.
- Production dependency audit reports zero vulnerabilities. Full audit has seven high/two moderate development-tool findings: braces/glob pattern matching and PostCSS selector parsing used by Tailwind/ESLint on repository-controlled inputs. No customer patterns/CSS reach those tools. Residual risk is build-time denial of service from untrusted source contributions. No unrelated major upgrade or framework downgrade was applied.
- Existing live Stripe totals and an unpaid checkout.stripe.com handoff passed without customer email, payment or fulfillment. Production Stripe is unchanged; preview lacks a test key. Paid webhook/provider email acceptance is not verified.
- Latest desktop staging homepage screenshot shows the four approved products and complete footer. Prior responsive geometry and local interaction checks are spot checks, not full browser acceptance.

Exact remaining actions:

1. Restore site permission for `deploy-preview-4--goool-shop.netlify.app` in Codex browser settings. The latest request was explicitly denied; do not bypass through another URL/browser/protocol. Chrome also showed a safety warning requiring user handling.
2. Owner signs in privately at https://deploy-preview-4--goool-shop.netlify.app/admin/sign-in with the already-created account and confirms the inbox opens. No password is needed in chat.
3. Receive pending action-time approval for three disposable participation-form browser fixtures, then verify playable previews, review/edit retention, uploads/receipts and private dashboard behavior; clean only the exact fixtures.
4. Finish desktop/mobile/reference/accessibility acceptance, final local HTTP/crawl checks and full diff review. Commit/push remaining changes and verify the new staging build.
5. Merge and deploy through existing Git continuous deployment; verify actual live commit/deploy, pages, unpaid checkout, intake and owner access, and capture desktop/mobile evidence. Deployment authorization is already recorded and does not need another approval.

## Historical checkpoint log

The following sections preserve earlier progress reports. Statements about missing approvals, absent provider configuration, unpushed code, test counts or unmodified legacy grants describe earlier checkpoints only; the current status above is authoritative.

## Release state

IN PROGRESS. The owner authorized completing, verifying, merging and deploying the full release to the existing goool-shop Netlify site. Release remains gated on real provider verification and the outstanding acceptance checks below. A partial redesign is not authorized.

Branch: `codex/v84-facelift`, based on deployed `11b1a2f8182b71785205f2ff6bd2ba537ce52081`.
Checkout: `C:/Users/gdove/OneDrive/Desktop/Portugoool/v84-implementation`.
This is a separate shared clone. Its Git object store references the original checkout; do not delete or prune the original repository while this clone depends on it.

The storefront remains on its existing production deployment; no code has been pushed. Under the owner's latest direction, the additive intake schema and private bucket have now been provisioned in the existing GOOOL Pro project. The global upload limit was raised from 50 MB to 105 MB; the intake bucket remains capped at exactly 100 MiB and the spend cap remains enabled. No commerce tables, orders, billing plan or existing credentials were changed. The original dirty checkout is excluded. Separately, the owner's explicit order-recovery request resulted in one agent-submitted cap order and one owner-submitted hoodie order; both verified supplier IDs were linked in the existing production order ledger.

### Direct provider verification

- Direct organization query: `lhinkmqrxofihbokgjfo`, GOOOL, `plan: pro`.
- Direct project query: `oexibflpshttgzmdvhpr`, GOOOL, `ACTIVE_HEALTHY`. Project-list omission was not an access failure; the normal Supabase CLI also has access.
- Applied only `v84_private_intake`: three new tables with RLS, five service-only functions, and private `goool-intake` storage. Read-back confirms anonymous/authenticated roles cannot read these tables or execute these functions.
- Actual signed resumable 100 MiB upload succeeded. HEAD reported exactly 104857600 bytes; public download failed. Synthetic fixture was removed afterward.
- Actual atomic receipt, wrong-token rejection, idempotent completion and deletion scrub passed against the provider. No customer records or emails were used.
- Real testing exposed a missing publishable API key and incorrect signed resumable endpoint. Updated the application to use `/storage/v1/upload/resumable/sign` with `apikey` plus the scoped signature; service credentials remain server-only. Five upload-controller regressions and typecheck pass.
- Real application routes tested against Supabase using two disposable Auth accounts: owner login and HttpOnly/Strict cookies; anonymous and non-owner rejection; story, match video and SVG kit start/upload/receipt/idempotency; owner detail, notes/status, signed media and deletion; refresh and sign-out. All fixture accounts, submissions and storage objects were removed. Synthetic video files verify transport/signature handling, not playback.
- Real route testing found and fixed two additional issues: awaiting cancellation of Next's unread fetch clone stalled bounded content checks; SVG responses omitted Content-Length. Bounded cancellation now returns without awaiting the clone, storage fetches have 20-second timeouts, and SVG size is verified against its complete bounded decoded body before sanitization. A local cancellation regression was added.
- Latest complete build/lint/types passes; 26 v84 checks and five upload-controller checks pass. The 123 public route/link/asset checks and six fail-closed HTTP checks also pass on the latest preview build.
- These are actual application API/provider tests, not the final browser-to-provider or deployed acceptance matrix. The real hello@goool.shop account/UUID and Netlify intake variables remain to configure; no owner password was generated, requested or stored. Netlify CLI is authenticated to the existing team.
- Existing advisor finding, not introduced by intake: `public.increment_drop_sold(uuid,integer)` is SECURITY DEFINER, executable by public/anon/authenticated, and lacks a fixed search path. It mutates product sold counts. No invocation or grant change was made; include it in the commerce security review before release.
- Post-change advisor also reports disabled leaked-password protection. Intake's three service-only tables intentionally have RLS and no browser policies, matching the service-only design; do not add public policies to silence this informational result.
- Remote migration history assigned `20261007023050` to `v84_private_intake`; the CLI-generated local migration was aligned with this provider-generated version. Do not bulk-push or replay the existing commerce migrations.

## Implemented locally

- Approved v84 assets, self-hosted fonts, scoped styles, brand, navigation, search, bag, footer and pointer-depth motion.
- Home, Men, Women, collection, product details, Our World, both community flows, kit configurator, support, FAQ, shipping, references and all three match sample routes.
- Actual nine-product production catalog and existing cart context; real identifiers, prices, variants, availability and checkout payloads. Concept products are not sold.
- Approved story/match/kit controllers, retained previews and edits, mandatory acknowledgments, separate optional marketing/tag choices and server validation.
- Server-side owner authentication with verified Supabase user IDs and HttpOnly cookies. Private inbox/list/detail/review/download/delete API and approved dashboard UI.
- Direct resumable private uploads, scoped upload authorization, signature/content checks, request limits, immutable consent snapshots, atomic completion and retry handling.
- Applied additive intake migration with RLS, service-only privileges, transactional functions, deletion protection and private storage. The original proposal remains historical.
- Existing discount workflow kept, with v84 visual treatment and a native modal. Tracking opt-out remains available; original cookie decisions are preserved.
- Existing cart, receipt, tracking and policy screens receive shared typography and restrained controls without changing their commerce handlers or legal text.

## Verified

- Final complete Next production build, lint and types passed, including all 42 generated pages and the nine product pages.
- 24 local v84 checks passed: original-art number markup for 1..99, form rules, 20/100 MiB boundaries, media count, all three acknowledgments, optional tagging, SVG safety, disabled service, SQL roles/RLS, atomic creation, idempotency, expiry and deletion.
- 89 protected baseline files compared unchanged: catalog, cart, checkout, payment, fulfillment, email, existing API handlers and existing migrations.
- 32 approved visual assets compared byte-identical.
- Existing launch-backend regression suite: 44 passed, with external network disabled. Includes all 83 sellable variants, discounts, fulfillment snapshots, webhook retries, email delivery and tracking consent.
- Six local HTTP checks passed in development and production mode: forged admin headers rejected, private files denied anonymously, owner page redirects, cross-origin writes rejected, intake disabled without configuration.
- Browser spot checks at 1440x900 and 390x844: desktop home; kit number/back rendering; story suggestion/sample/edit; mobile Save sample; real product size gating; cart addition, totals and free-shipping threshold; mobile navigation.
- Browser testing found and fixed template fragment nesting, shared-header access, scoped CSS link selectors, font loading, mobile cart minimum widths and local origin normalization.
- Production-mode mobile cart rechecked: content width equals viewport width, no overflowing child elements, all prices/actions visible.
- Updated build/lint/types, 24 v84 checks, 44 existing backend regressions and six production-mode HTTP checks passed again on October 6.
- Catalog keyboard sorting verified: ArrowDown focus, Enter selection, correct ascending prices, Escape closure and focus restoration. Product gallery ArrowRight/Home navigation verified.
- 390x844 production-mode collection and product screenshots inspected: no horizontal overflow or broken product images. Keyboard link navigation verified. Complete gestures and route-width matrix still pending.
- Original high-resolution print numerals found and integrated without a font substitute. Original 90 checked on desktop; mobile 99 canvases confirmed loaded at 512-pixel height. See NUMBER_ARTWORK.md.
- Dependency audit: zero production vulnerabilities (`npm audit --omit=dev`), seven high findings in inherited development tooling. No major upgrade applied.
- Production-mode DOM route checks: 16 routes at 390px, 19 at 1440px, ten at 320px and ten at 768px, all with headings and without horizontal overflow. No loaded source-backed image failures were found; an empty kit-upload placeholder is not an asset failure. These automated geometry checks are not the full reference screenshot comparison.
- October 6 continuation: Men now contains the nine owner-approved existing products; Women remains unassigned. Browser verified nine products and the two-hoodie filter. Homepage selection awaits separate confirmation. Supplier product deletion has not been performed.
- Dashboard request revisions and abort signals prevent stale detail responses/errors, review-save feedback or deletion replies from changing another submission. Nine local controller regression checks pass, including unmount, late session/refresh replies and retry behavior.
- Five upload-client transport checks pass: interrupted retry renews scoped tokens and reuses the upload URL, completed files are not uploaded again after receipt failure, changed payload starts a fresh draft, concurrent requests are rejected, and success clears the session. These tests do not contact storage providers.
- Latest production build generated 42 pages and passed lint/types. Current local checks: 25 v84, nine admin, five upload, 44 commerce/backend and six HTTP checks (89 total). Provider integration remains unverified.
- Header geometry checked at actual widths 1099, 1100, 1102, 1240, 1250 and 1440 without navigation/action overlap. A requested 1101 was rounded to 1102 by the browser viewport backend; exact 1101 remains to verify.
- Approved-reference hero typography and bounding geometry matched at actual 390 and 1440 for About, personal stories, match submissions and Kitwear. Mobile kit screenshot inspected. This is not the full archived visual matrix.
- Local story form browser-tested with disposable fixture data: review, unconfigured-service failure, retry availability and edit retention; optional marketing remained off. No real submission or provider call occurred.

These are local tests. They do not demonstrate a live payment, real email delivery, durable cloud uploads or authenticated owner access. The native browser sandbox did not expose canvas pixel reads; kit number rendering was checked visually.

## Blocking decisions and configuration

The owner reports completing the approved upgrade. Accept that statement; no screenshot or purchase proof is required and no second purchase is authorized. Integration remains unconfigured because the dedicated project's identity and authorized management access are unavailable. The connector still exposes only Hireonthefly, and Chrome control has timed out. Do not use that unrelated organization or guess that the commerce project is the new intake destination. Historical "no purchase" statements below describe earlier checkpoints, not the owner's current report.

Kit browser continuation: approved SVG crest preview, automatic front/back switching on upload/name/number input, permission-gated review, and separate chest-logo/sponsor removal were exercised with disposable local fixture data. Original, Legacy and Future reviews retained the requested choices. The disabled service returned an explicit error, not a receipt; returning to edit retained crest, fields and choices. No provider record or order was created.

A 320px review exposed excessive wrapping from the fixed label column. The integration stylesheet now stacks review labels/values at widths up to 600px without changing hero or desktop geometry. Rebuilt screenshots and DOM checks confirmed readable contact values and no dialog overflow at actual 320, 390, 600, 602 and 1440px. The browser rounded a requested 601px to 602px. No console warnings/errors were captured in this kit test. The new production build passed compilation, lint, types and 42-page generation; all 123 local release checks passed. These spot checks do not complete the entire accessibility/reference matrix.

Browser-blocked continuation: the release crawler now checks 32 pages with 123 route/link/asset checks, including each of the nine product headings and canonical paths. Nine dashboard, five upload-client, 44 network-blocked backend and six fail-closed HTTP checks passed again after the dependency patches. Sharp 0.35.5 decoded and resized the approved hero and all ten original print-number assets successfully. These checks make no provider writes and do not establish cloud integration readiness.

The shared footer's collection label now matches the approved reference exactly ("The collection"); the main navigation remains "Collection". A rendered-HTML regression guards that distinction. The subsequent production build passed compilation, lint, types and generation of 42 pages; all 123 release checks and six fail-closed HTTP checks passed against the rebuilt preview. Chrome access, provider setup and the remaining visual/provider acceptance gates are still pending.

October 6 release continuation: six local HTTP security checks and six maintenance checks passed again. The local release crawler passed 114 route/link/asset checks across 23 pages without submission or provider writes. Nine principal pages were compared with the approved reference at actual 390, 768 and 1440 widths; heading and hero geometry matched apart from an unused Kitwear font fallback. Vertical offsets and complete section/footer screenshots are not covered by that geometry comparison.

A fresh dependency audit identified newly published Sharp and source-map-js advisories. Compatible patch updates to Sharp 0.35.5 and source-map-js 1.2.2 were applied in commit b0131f4; no framework or design-tool major upgrade was made. The refreshed production-only npm audit reports zero vulnerabilities. The full audit still reports seven high and two moderate development-tooling findings, requiring impact review before release. Previous audit counts are historical, not current clearance.

1. Men assignments are approved and implemented for nine real products. Women remains unassigned; the four homepage feature selections still await approval. Identify exact women-only Apliiq products and confirm deletion before removing supplier records; never delete shared adult garments. No active leggings/tanks/shorts were invented.
2. The owner approved a dedicated GOOOL intake Supabase Pro organization with one Micro project at $25/month plus tax, subject to actual checkout verification, spend cap enabled and no paid extras. Provisioning awaits GOOOL account sign-in. The installed connector targets Hireonthefly and must not be used for GOOOL changes. No purchase has occurred.
3. Original number artwork is now found and implemented; review the sharp preview and composition before final staging acceptance. No reconstruction or font substitution is needed.
4. Owner selected ST720. Manufacturer confirms 100% recycled polyester, and its current body-chest sizing chart exactly matches the reference. Supplier lists DTF/embroidery/bulk screen printing. Method-specific quotes and 4XL supplier availability remain unverified. See KIT_MATERIAL_VERIFICATION.md. Real product galleries currently have fewer than the six requested production views.

Exact owner-review proposals are in CATALOG_PROPOSAL.md and STAGING_PROPOSAL.md. The approved intake destination isolates one Pro/Micro project in a separate organization at a published baseline US $25/month plus tax, subject to actual checkout verification. It will support the existing production Netlify site, not a preview-only backend. No purchase or provisioning has occurred.

## Still required before finished staging

- Provision isolated private storage and owner auth through the correct project; disable public signup, set exact owner UUIDs and deployment-scoped environment values.
- Review the SQL proposal against that project's schema, generate a real migration using the Supabase CLI, apply only to staging, and verify bucket privacy and permissions.
- Test actual resumable uploads, token renewal, each supported file type, 100 MiB footage, persistence, interrupted retry, double submission, deletion and cleanup. Never substitute mock success screens.
- Authenticate the owner and test the complete inbox workflow and non-owner rejection, refresh/sign-out, status/notes, filtering, pagination and private media access.
- The hourly authenticated maintenance function is implemented with six passing transport checks. Configure its deployment-scoped secret and verify the real provider schedule before release. It deletes expired abandoned drafts/tombstones after a safety window. Tokens expire after 24 hours; cleanup starts after a further day. Deletion immediately scrubs submission personal fields and removes available objects; opaque identifiers remain only for late-upload cleanup.
- Finish the full visual/accessibility/interaction matrix, including all widths, gallery gestures, upload previews, keyboard sorting, popup and dialogs, validation/failure states, metadata and analytics.
- Perform payment/email/fulfillment staging verification using test-only services and blocked live fulfillment. Do not copy production secrets into local previews.
- Address or explicitly accept the seven inherited npm high-severity findings after reviewing their impact. No unrelated major dependency upgrades were made.
- Complete the provider and design acceptance checks in RELEASE_CHECKLIST.md, then merge and deploy under the existing explicit release authorization. Preserve the known-good commit and use a corrective Git revert and redeploy if a material regression appears.

## Local commands

```powershell
npm ci --ignore-scripts
npm run typecheck
npm run test:v84
npm run test:v84:admin
npm run test:v84:upload
node -e "global.fetch=async()=>{throw new Error('Network disabled for regression tests')};require('./scripts/test-launch-backend.cjs')"
npm run build
npm run start -- --hostname 127.0.0.1 --port 3184
# Only against the local unconfigured preview:
npm run test:v84:http
```

`scripts/import-v84.cjs` regenerates trusted reference templates, styles, media, validation and dashboard code from the audited package copy. Keep changes to generated code in that importer. The source package path can be passed as its first argument.

Local production-mode preview: `http://127.0.0.1:3184`. OneDrive reparse-point errors in generated `.next` output were resolved by clearing that cache and rebuilding successfully. This is localhost only, not deployed staging. Supabase Pro intake schema, private storage and 100 MiB upload capacity have been provisioned and provider-tested. Netlify intake environment values and real owner access are not yet configured.

## October 6 release continuation

- The approved homepage row is Core Hoodie, Casual Tee, Active Leggings and Active Crop Tank. Exact purchasable matches for its first two positions are Core Hoodie Red ($78, Black) and Terrace Tee Red ($38, Black). Those UUIDs now render in reference order. Leggings and crop tank have no live catalog equivalents. The owner is choosing between adding Matchday Tee ($38) plus Touchline Cap ($32), or retaining only the two exact matches. Do not silently apply the earlier proposed row.
- Clean production build passes. Local v84/admin/upload/maintenance checks pass (26/9/5/6), as do 123 route/link/asset checks across 32 pages. Thirty-three browser layout checks at 390/768/1440 confirm headings, shared public footers and no document overflow. The empty hidden crest placeholder is not a loaded-image failure.
- Browser shopping verification covers Black/M hoodie selection, bag quantity changes, cart totals and preserved local checkout-unconfigured handling. This is not a completed payment test.
- Live baseline checkout is active: server totals return $78 with free shipping, and an unpaid checkout handoff returns HTTP 200 with hostname checkout.stripe.com. No customer email, charge or fulfillment was triggered. Production Stripe values were not changed. Deploy-preview currently lacks a Stripe key; test-mode payment/webhook verification is not complete and is not evidence that live Stripe is inactive.
- Real application route tests were rerun against GOOOL Supabase using disposable Auth users and submissions. All three submission kinds, receipt retry/idempotency, private media, status/notes, deletion, refresh/sign-out and anonymous/non-owner rejection passed. Added inbox search, status/kind filtering and 50+5 pagination with 55 uniquely tagged rows; cleanup completed. These are API/provider tests, not full browser-to-provider acceptance or real playable-video tests.
- Owner created hello@goool.shop privately. Direct Auth lookup verifies one confirmed account. New Netlify intake configuration restricts access to that verified UUID, uses functions-only scoped secrets and exact production/preview origins, and leaves commerce variables untouched. The owner must sign into the rebuilt preview privately to verify real-account browser acceptance; no password is needed in chat.
- Production remains on its known-good deploy. Homepage choice, owner activation, scoped Netlify intake configuration and remaining browser/live acceptance gates must finish before merge. Deployment authorization is already recorded; do not ask for it again.

The discovery plan, product inventory, asset map and 331-row requirement ledger remain in `../output/v84-discovery-2026-10-05/`. The ledger is an acceptance checklist, not a blanket completion claim.
