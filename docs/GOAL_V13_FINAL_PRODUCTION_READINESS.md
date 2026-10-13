# GOAL ATHLETICS V1.3 — final production readiness

Reviewed 13 October 2026. Final reviewed application head `d4fb91ae8ee48dbdcfb53320cd4e34e377167855` has ready preview deploy `6ace372d85380149292445b0`; [latest release read-back](final-release-state.json) confirms production remains unchanged. Recommendation: ready for owner approval of a **gated website release and primary-domain cutover**. This does not approve shopping reopening, a new email sender, supplier submissions, or customer announcements. No remaining known pre-release code/DNS blocker was found. Post-cutover routing must be checked before declaring the release successful.

## Current deployment state

| Area | Status | Evidence |
| --- | --- | --- |
| Existing production | PASSED | Netlify `047c082c-2bc2-42d5-889f-57876fa55b78`, published deploy `6ace2311512fd0a82cb43927`, main `e5f900866117d5e792638e1cff8e02ff076dc407`. Only the separately approved PR #29 support fix is live. |
| Staged migration | PASSED | [PR #31](https://github.com/gdove90/portugoool-site/pull/31), branch `codex/goalathletics-domain-cutover-v13-20261013`, reviewed application/test head `d4fb91ae8ee48dbdcfb53320cd4e34e377167855` (subsequent readiness-document commit has no application changes). Current main is an ancestor; no merge conflict. PR remains draft/open/unmerged. |
| Final preview | PASSED | Deploy `6ace372d85380149292445b0` ready at that head; [preview](https://deploy-preview-31--goool-shop.netlify.app). Includes cutover/sitemap fixes, the isolated Meta test fixture repair and the final holding-header inline lettering correction. Latest build/type/migration/vector/payment and hosted checks pass. |
| Production V1.3 launch | BLOCKED | Requires the owner's explicit merge/deploy and primary-domain approval. No production migration performed. |

## Domain, SSL and integration continuity

**PASSED — DNS/HTTPS readiness.** [Infrastructure evidence](infrastructure-verification.json): GoDaddy nameservers remain ns09/ns10.domaincontrol.com; apex A is 75.2.60.5; www CNAME is goool-shop.netlify.app. Authoritative DNS, Google, Cloudflare and normal local resolution agree. New apex/www and old apex validate strict TLS; certificate covers all required names and expires 11 January 2027. New names reach the existing production site and its closed-store gate.

**PASSED — supported primary/alias routing design; actual post-promotion behavior UNVERIFIED.** [Configuration read-back](release-configuration-readback.json) confirms goool.shop still primary and both new names plus legacy names retained as aliases. Netlify documents automatic canonicalization for the **primary apex/www pair**; this must not be mistaken for a blanket redirect of every ordinary alias. See [Netlify multiple-domain documentation](https://docs.netlify.com/manage/domains/manage-domains/manage-multiple-domains/) and [alias configuration](https://docs.netlify.com/manage/domains/configure-domains/add-a-domain-alias/).

The supported release keeps goool.shop and its www name, portugoool.com and its www name as ordinary aliases after goalathletics.shop becomes primary. PR #31 removes the blanket old-host Netlify redirect rules. Next.js middleware then permanently redirects normal legacy GET/HEAD traffic, preserving path/query, but bypasses redirects for API/function/print/unsubscribe paths and legacy receipt/tracking routes. Consumer Contact, Support, FAQ and legal pages now canonicalize to the new domain after cutover. Other request methods do not enter the host redirect branch. The new primary www alias may automatically redirect to the new apex; providers continue using the existing **old apex**, not either www host.

| Path/integration | Status | Evidence and limit |
| --- | --- | --- |
| Stripe webhook | PASSED | Existing enabled endpoint remains https://goool.shop/api/stripe-webhook. Current intentionally invalid POST returns 400 without Location; signature/event-handling source equals production. Five historical paid events match processed database records, no pending deliveries. [Provider read-back](provider-and-support-verification.json). |
| APLIIQ callback | PASSED | Live supplier settings still show https://goool.shop/api/apliiq-fulfillment. Current invalid POST returns 401 without redirect. Raw-body HMAC handling unchanged. [Dashboard proof](apliiq-callback-preserved.png), [supplier read-back](supplier-readiness.json). |
| Legacy artwork | PASSED | Known existing supplier PNG serves 200 from old/new apex and new www. No legacy print file changed. Future aliases bypass middleware redirects for /print/*. |
| Existing receipts/tracking | PASSED | /success and /track-order serve on current apex/new names. Cutover middleware tests preserve legacy hosts/query tokens without redirect. Existing APIs and order identities unchanged. |
| Scheduled workers | PASSED | Production context retains existing minute/hour schedules and old-apex targets. Preview code disables operations; hosted function/API probes return 503. No job manually executed. |
| Production routing after primary promotion | UNVERIFIED | Cannot observe an unperformed promotion. Required immediate release checks below; do not mark completed in Issue #24 beforehand. |
| Fresh signed transactions/callbacks | UNVERIFIED | Owner declined purchases, Checkout Sessions, account/test-mode changes, event replay and fulfillment submissions. Invalid-signature/historical checks do not certify a fresh transaction. |

Twelve migration suites cover callback POST pass-through, public GET/HEAD canonicalization, path/query retention, receipt exceptions, closure and the absence of blanket Netlify host rules. These routing changes neither forward nor replay an event; existing event deduplication remains intact. This establishes the supported release design, not a guarantee that no future provider failure can occur.

## Final website and SEO verification

| Area | Status | Evidence |
| --- | --- | --- |
| V1.3 geometry and Style 3 header | PASSED | [Source integrity](source-handoff-integrity.json): all 13 handoff manifest hashes/sizes; all 3 GA and 13 wordmark paths match. Single-line header preserves outlines. V1.2 authentic strike/divider remains unchanged for apparel. |
| Responsive layout | PASSED | [Eight widths](final-responsive.json): 320/375/390/768/1024/1280/1440/1920, no horizontal overflow or brand/action overlap. Desktop/mobile screenshots reviewed. The public holding header also passes [all eight widths](final-gate-responsive.json) after its single-line correction. Mobile navigation, search and bag open/close; no transaction performed. |
| Photography/sections/copy | PASSED | 32 protected assets unchanged; original sections retained. Approved performance copy appears on homepage; ambition/futbol culture copy on About; WEAR THE FEELING and The Goal Collective retained. |
| Favicon and touch icons | PASSED | [Hosted checks](final-hosted-readiness.json): served ICO, main PNG, Apple PNG and 192/512 manifest PNGs match updated local bytes. Browser DOM references updated icons; no obsolete public favicon. |
| Canonicals, sharing and organization | PASSED | Preview canonical is https://goalathletics.shop/; organization URL/logo use new host and GOAL identity. Registered legalName remains accurate. Page-specific canonical/OG checks and JSON-LD escaping pass. |
| Product schema and mappings | PASSED | Four pure SEO suites verify 9 active products/83 exact size-color-price-SKU/gallery variants, sale gates and shipping/returns metadata. Preview product pages remain non-purchasable/noindex; unchanged legacy products are not newly published. |
| Sitemap/robots | PASSED | Closed production sitemap now contains only seven public service/legal pages. Planned full sitemap includes Collective and excludes private tracking. Preview robots denies crawling; hosted preview sitemap uses the new host. |
| Renovation/service access | PASSED | Seven service suites plus twelve migration suites: public shopping/private checkout stay refused; Contact, Support, FAQ, Shipping & Returns, tracking, receipts and legal routes bypass closure. Missing password cannot reopen catalog. |
| Legal entity | PASSED | GOOOL Athletics LLC retained in seller disclosures; Goal Brand Group LLC remains planned. No claim that amendment is effective. Historical IDs/slugs/documents retained. |

[Proposed gated release appearance](final-gated-release.png) � [Desktop proof](final-preview-1440.png) · [Mobile proof](final-preview-390.png). The full shopping design is visible in the safe preview. Public production will retain the renovation gate and service navigation; this release does not expose the staged shopping catalog.

## Email readiness

**PASSED — authentication DNS and receiving aliases.** Workspace alias domain Verified/All ok; hello@goalathletics.shop and support@goalathletics.shop receive into the existing inbox. Google MX/SPF/ownership/DKIM and Resend DKIM/CNAMEs resolve; DMARC policy retained. [External support delivery proof](support-external-authentication.txt) shows receiving Inbox, exact Delivered-To and TLS, with 11-second delivery. Incoming SPF/DKIM/DMARC passes authenticate the external Gmail sender, not the receiving domain.

**PASSED — new-domain Resend authentication; outgoing Inbox placement UNVERIFIED.** The two previously approved tests were Delivered. [New-domain headers](new-domain-email-authentication.txt) pass SPF/DKIM/DMARC, but the outgoing test reached Spam. Existing evidence cannot establish Inbox placement; no additional unapproved message was sent. Google DKIM DNS/setup is verified; actual new-domain Google-signed outbound delivery was not separately tested.

**NOT APPLICABLE to this gated release — production sender migration.** Existing application sender remains hello@goool.shop and its working credentials/templates are preserved. Temporary test key was revoked. New-domain sender activation/reply tests/reputation work require a separate approved scope. This does not block the website release.

## Supplier and catalog integrity

**PASSED — preserved records and current dashboard review.** Saved orders currently show 770743 Preparing to Release (due October 19), 769326 / 9D606FAA In Production (due October 15), and 769319 / F2F644D7 Shipped. Pending Orders is empty. Order 770743 contains Black/Red L and Bone/Blue XL hoodies; it is not the disputed cap. No settings, order, design or SKU was changed.

**UNVERIFIED — cap recovery.** GOOOL-143AB6F6/design 6117349 still lacks a matching saved/pending supplier job. Today’s approved status-only inquiry has no new reply. Supplier's earlier inability to locate it remains unresolved. Do not manually submit or link it to 770743. This is an urgent existing-order recovery task; this release preserves its data/tracking/support and does not alter or resubmit the order.

**PASSED — precisely identify five unmatched archived variants.** Product `80000000-0000-4000-8000-000000000001`, legacy Modern Sport Tee, Black, design 6112026:

| Size | Existing fulfillment SKU |
| --- | --- |
| S | APQ-6112026S6A1 |
| M | APQ-6112026S7A1 |
| L | APQ-6112026S8A1 |
| XL | APQ-6112026S1A1 |
| XXL | APQ-6112026S2A1 |

Supplier design presence remains UNVERIFIED. Catalog isActive=false/supplierType=unassigned; its historical availableForSale=true flag does not make it active. getProducts excludes it and checkout rejects inactive products. All active catalog variants resolve locally; checkout rejects any missing mapping before Stripe code. Public shopping/checkout are additionally closed. No invalid mapping can be bypassed by this website release. Existing provider-side correctness remains subject to the recorded reconciliation limits.

**NOT APPLICABLE to the gated website release — new manufacturing.** Original GoDaddy-export fidelity, exact chromatic palettes, decoration dimensions, embroidery digitization, samples and vendor approval remain unverified. Supplied V1.3 reconstruction is usable for this approved website presentation, not certified manufacturing art. No replacement garment/design is released.

## Regression results

PASSED this continuation: typecheck; optimized production build; 6 payment-preservation checks/18 core files; 7 customer-service suites; 12 migration suites; 6 vector constructions; 27 v84 checks/96 protected files/32 assets; 9 shipment checks; 9 admin; 5 upload; 6 maintenance; 9 Meta readiness and 10 Meta tracking checks; 4 SEO suites/83 variants; 40 hosted route/metadata/isolation/icon checks; 8 responsive widths; handoff geometry/hash validation.

The older Meta payload fixture initially expected open checkout; its isolated mock now explicitly tests preserved checkout payload construction while closure is separately verified. No real Stripe request occurred. Four existing img lint warnings remain nonblocking. Historical isolated HTTP results are supplementary; obsolete harnesses and unperformed live transactions are not promoted to current passes. No local server restart was needed for this final verification.

## Approval scope and release sequence

**A — Blocking issues:** owner approval is outstanding. No known unresolved code/DNS/SSL/legal/legacy-apex integration blocker remains. If any immediate production check fails, stop the cutover and follow rollback. Actual post-promotion results remain UNVERIFIED until performed.

**B — Separate follow-ups:** cap supplier recovery; archived design reconciliation; manufacturing masters/samples; optional new sender/Inbox placement; legal amendment; real checkout testing before shopping reopening. None authorizes commerce reopening through this release.

**C — Verified completed work:** code, preview, geometry, DNS/TLS, alias configuration, callback registrations/authentication preservation, service gate, receiving email, tests and rollback preparation above.

The proposed single approval covers merging/deploying PR #31, coordinated production NEXT_PUBLIC_SITE_URL=https://goalathletics.shop (build/functions/runtime), STORE_OPEN=false, DOMAIN_CUTOVER_ENABLED=true, and making goalathletics.shop primary on the same Netlify project. Preserve PREVIEW_KEY, all old/new aliases, existing secrets, payment/provider endpoints, supplier mappings, email sender and DNS records. The primary-switch approval must include the planned environment changes; production has not received them yet.

After approval: re-read main/PR head and production settings; stop for unexpected drift. Deploy the reviewed source with new SITE_URL and closure maintained, initially with cutover flag false. Verify new apex service pages and old-apex machine routes on that deploy. Promote goalathletics.shop while retaining legacy aliases, then enable DOMAIN_CUTOVER_ENABLED and rebuild/publish the same source. This ordering avoids a new-www-to-old-apex redirect loop. Recheck all behavior below immediately; record actual main SHA and published deploy ID.

- New apex/www strict HTTPS; root/shop remain gated; direct checkout refuses before Stripe.
- Contact/Support/FAQ/Shipping & Returns/legal accessible; support links use new aliases.
- Old consumer GET/HEAD path/query redirects to new apex without loops; POST callback probes return 400/401 directly with no Location, even on retained old aliases. Do not follow redirects when probing callbacks.
- Known old print PNG remains 200 and byte-identical; /success and /track-order retain tokens; function/API paths are direct.
- New-host canonical/OG/schema/robots and seven-page closed sitemap; original seller disclosure.
- Existing provider registrations, secret presence, worker schedules and queues preserved; monitor existing event deliveries and error logs without replay/submission. Observe for 48–72 hours.

INTAKE_SITE_ORIGINS still lists old hosts. Public intake forms are restricted during closure, so no origin mutation is required for this gated launch. Before reopening those forms, add new apex/www to that allowlist and verify separately. Gate newsletter behavior/legacy signups remain preserved; final verification did not create a signup or send mail.

## Rollback

Existing [backup manifest](../migration/backup-manifest.json) verifies the October 12 snapshot of 11 public tables/134 rows and Git bundle; private customer backups remain local outside Git. No database/catalog migration is included, so rollback does not require restoring customer tables. Restore rehearsal remains UNVERIFIED; never overwrite subsequently received orders with an old snapshot.

If service/machine routing fails, first disable DOMAIN_CUTOVER_ENABLED and rebuild the reviewed guarded source with old SITE_URL=https://goool.shop while preserving STORE_OPEN=false/PREVIEW_KEY. Restore goool.shop primary with all aliases retained; confirm no reverse canonical loop. For code failure, revert migration commits on current main, retain approved PR #29 support access and closure, and build/publish reviewed rollback source. Baseline is e5f900866117d5e792638e1cff8e02ff076dc407; prior deploy 6ace2311512fd0a82cb43927 identifies known behavior, not permission to restore an unreviewed snapshot. Secrets, DNS, sender, order records, webhook destinations and supplier identities remain unchanged. Fix forward/revert source rather than activating Netlify snapshot restore. Verify service, signature rejection, old print files and worker health again; record failure and rollback deployment in Issue #24.

**Final recommendation: approve only the gated V1.3 website deployment and coordinated domain cutover. Do not call it live or complete until the required production checks pass.**
