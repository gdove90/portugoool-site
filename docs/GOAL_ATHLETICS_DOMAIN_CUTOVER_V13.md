# GOAL Athletics V1.3 implementation and release runbook

Verified 13 October 2026. Migration remains staged in draft PR #31. Separate owner approval authorized only customer-service PR #29, which is now merged and deployed. DNS and email-test approvals do not authorize the full migration deployment, primary-domain promotion, reopening, supplier submission or customer announcements.

## A. Status

The existing business infrastructure remains in use. The new domain reaches the existing closed production store over valid HTTPS. V1.3 website changes are available in the non-operational design preview: https://deploy-preview-31--goool-shop.netlify.app.

## B. GitHub

Repository: gdove90/portugoool-site. Branch: codex/goalathletics-domain-cutover-v13-20261013. Draft PR #31 reconciles PR #27's migration work, PR #29's customer-service exceptions and the owner's exact copy without replacing the original V1.3 GA/wordmark paths. Approved PR #29 merged to main e5f900866117d5e792638e1cff8e02ff076dc407. PR #31 includes that main update; migration code remains unmerged.

## C. Netlify

Same project goool-shop, site 047c082c-2bc2-42d5-889f-57876fa55b78. Customer-service production deploy 6ace2311512fd0a82cb43927 published at 2026-10-13T12:26:28.403Z from main e5f900866117d5e792638e1cff8e02ff076dc407. Primary remains https://goool.shop. New apex and www are domain aliases, added using the alias workflow and verified by read-back. PR #31 preview deploy 6ace234fb3ac998bbf5ab7a4 is ready at reconciled code commit bcbd19f58fd6a14e309043c2a96b11a575499268. Local production build passes; four existing no-img-element lint warnings remain.

## D. Domain

- [x] GoDaddy domain ownership and editor access verified.
- [x] Original seven-record zone captured before editing.
- [x] Owner-approved apex A: @ = 75.2.60.5, TTL 600.
- [x] Owner-approved www CNAME: goool-shop.netlify.app, TTL one hour.
- [x] Other five records and ns09/ns10.domaincontrol.com nameservers preserved.
- [x] Authoritative DNS verified; normal public HTTPS on both new hosts redirects to /gate with Netlify request IDs.
- [x] Certificate renewal includes goalathletics.shop and www.goalathletics.shop alongside existing domains. Strict certificate validation passes.
- [ ] Promote goalathletics.shop to primary only after provider checks and explicit production approval.
- [ ] Verify platform-level legacy endpoint continuity after the approved release and promotion. Current portugoool.com and www.goool.shop blanket redirects are a known pre-existing concern.

New-domain MX now points to smtp.google.com with priority 1 after separate owner approval. Google ownership TXT, Google SPF and the account-issued 2048-bit DKIM record are saved and authoritatively verified. Existing goool.shop mail routing is unchanged. The alias is Verified/All ok in the same Workspace account. Both approved owner-only tests delivered; the incoming alias test reached Inbox, but the new-domain sending test reached Spam despite SPF/DKIM/DMARC PASS. Sender activation remains blocked.

## E. Branding

V1.3 GA and custom outlined GOAL ATHLETICS wordmark are retained from original PR #31 reconstruction. Style 3 white/black navbar, right-side search/bag/mobile menu, footer and customer-service lockups are staged. The navbar uses GA; authentic V1.2 strike paths remain available for apparel, with divider lockups preserved separately.

Owner's performance statement appears below the homepage hero; the intersection of athletic performance, personal ambition and futbol statement appears on About. The Goal Collective has its own page and navigation entry. Public support links now use support@goalathletics.shop. The owner identifies Goal Brand Group LLC as the planned seller name; the current registered GOOOL Athletics LLC disclosure remains until the amendment takes effect. Historical order IDs and supplier artwork paths remain functional. Production sender activation remains a separate release gate.

GA SVG, six PNG sizes (16/32/48/180/192/512), ICO and manifest are staged. Favicon translation is corrected so 512px artwork center equals (255.5,255.5), retaining every SVG path. This is placement correction, not original-export certification.

## F. Master artwork and source verification

OneDrive source: Desktop/GOOOL/GOOOL ATHLETICS LOGOS/GOAL BRAND GROUP — MASTER BRAND ASSETS. Organized v3 ZIP contains 111 entries; all 110 manifest hashes match. Authentic ink/white V1.2 source SVGs also match OneDrive exactly, and website strike polygons match a uniform coordinate scale.

The newer V1.3 handoff ZIP and original GoDaddy vector export have not been supplied. No original Style 3 board comparison or full nine-colorway manufacturing certification is claimed.

Private local GOAL-V1.3-ARTWORK-REVIEW.zip contains 12 monochrome/web review variants with SVG, vector PDF, EPS, 1200px and 3600px PNGs, plus verified V1.2 sources and printer-handoff notes. It is not published in the public directory and is not approved for manufacture. Six chromatic sets are explicitly SOURCE_REQUIRED; exact colors must come from the forthcoming source boards. Black/white web background previews are not garment printing masters. All physical dimensions, decoration minima, digitization and supplier samples remain approval gates. Halo/TGC proof artwork remains unverified for manufacture.

## G. Commerce and customer operations

Preview blocks checkout, payment/supplier callbacks and scheduled worker operations with 503; product navigation and galleries are held pending verified new art. Nine existing product paths remain preserved. STORE_OPEN defaults closed. DOMAIN_CUTOVER_ENABLED defaults false; NEXT_PUBLIC_SITE_URL is a deliberate release setting.

Customer-service PR #29 is deployed after explicit owner approval. Contact, FAQ and Shipping & Returns return 200; Support redirects to Contact. Service-only navigation is live, while public root and shopping routes remain gated. Tracking and receipt pages remain accessible. All 13 production service smoke checks and 33 additional route/asset continuity checks across old primary and new apex/www passed. Webhook GET requests return 405 as expected; this does not certify real signed POST handling.

The prior private catalog audit covers 68 repository products, 288 variants, 113 mapped variants and 25 design IDs. Of 113 mappings, 108 match the live APLIIQ census; five legacy variants for design 6112026 remain unmatched. Decoration/art IDs, physical sizes and supplier approvals are incomplete. No supplier design or paid order was overwritten or resubmitted.

Two paid/unfulfilled orders remain operational blockers. Authenticated APLIIQ follow-up checked all seven 2026 orders on one page plus Pending Orders (no unprocessed jobs). No matching reference appears for the unreconciled cap. The unmatched open job contains two hoodies, not that cap; it must not be assigned to the cap. The known submitted order remains In Production. An existing 12 October supplier reply also confirms they could not locate the cap, requests storefront evidence and recommends manual submission. That recommendation does not authorize submission. The owner separately approved a status-only inquiry; it was sent to cs@apliiq.com from the retained support mailbox, explicitly forbidding order/design modifications. Gmail confirmed Message sent. Final recovery decision remains open; no order was resubmitted. Customer identity/address data and inquiry details stay private.

62 isolated HTTP integration checks passed with synthetic orders, loopback fixtures and fake provider signatures: duplicate/concurrent payment callbacks, pending supplier responses, timeout handling, reconciliation parking, explicit operator release, shipment/delivery updates, tracking privacy, stable identifiers and historical SKU/price snapshots. Empty reconciliation results do not trigger resubmission. These fixtures do not certify live Supabase, Stripe, APLIIQ or Resend delivery. Final fixture run blocked outbound provider networking; an earlier dummy Stripe call returned 401 and performed no real checkout.

Email checklist:
- [x] Sign in to existing Resend account; goool.shop remains verified. No new sender address activated in application configuration.
- [x] Obtain separate owner approval and save exactly three Resend records: TXT resend._domainkey (exact dashboard public key), CNAME rsend to rsend.forge.rmta.net, CNAME send to send.forge.rmta.net. Authoritative DNS and GoDaddy read-back match. All seven prior records remain intact. Resend now marks domain, DKIM and both sending CNAMEs Verified. Receiving is not enabled in Resend.
- [x] Sign in to existing Google Workspace administrator hello@goool.shop; goool.shop primary is Verified/All ok. Prepare goalathletics.shop as a no-cost user alias domain, preserving the existing inbox, login, history and license.
- [x] Separately approve, save and authoritatively verify Google ownership TXT at @, MX @ smtp.google.com priority 1 and Google SPF TXT at @. Add the separately approved exact 2048-bit Google DKIM TXT at google._domainkey and confirm authentication in Workspace. Google reports Gmail ready; Manage Domains shows new alias Verified/All ok and old primary Verified/All ok. No existing old-domain MX changed. Primary-mail-domain promotion is not part of this work.
- [x] Obtain exact account-issued ownership/DKIM and Resend records; Google MX/SPF also verified against official administrator documentation. Preserve existing DMARC. One SPF record is published at apex; Resend uses separate authenticated return-path CNAMEs.
- [x] Send exactly the two separately approved owner-only Resend tests. Both Delivered; new receiving alias reaches existing Inbox. New-domain outgoing test passes SPF, DKIM and DMARC but lands in Spam. No spam label or filter changed to manufacture a pass.
- [x] Revoke the separately approved temporary sending-only test key and remove the temporary local credential immediately after sending. Existing production/preview keys and sender configuration preserved.
- [x] Independently verify support@goalathletics.shop receiving: owner-requested external personal Gmail test reached the business Inbox on 13 October at 8:52:07 AM America/New_York. Delivered-To matches support alias; transit 11 seconds, TLS. Incoming SPF/DKIM/DMARC PASS authenticate gmail.com, not the receiving domain. Prior new-domain Resend sending test separately passed SPF/DKIM/DMARC for goalathletics.shop; its Spam placement remains unresolved. Google and Resend public DNS authentication records rechecked.
- [ ] Test incoming mail, authenticated outgoing mail, replies, receipts, returns and shipment delivery with owner-controlled test recipients.
- [ ] Activate hello@goalathletics.shop only after authentication and delivery tests pass, through an approved separate release.
- [ ] Inventory and approve Search Console/Meta/analytics/QR/social/mail-campaign link changes before announcements.

## H. SEO

Later owner-directed cleanup replaces remaining public support addresses, service-page metadata, community/kit confirmation wording and legacy component logo references in PR #31. Old Instagram branding is removed from the gate; optional footer social link is shown only when a verified NEXT_PUBLIC_INSTAGRAM_URL is configured. No replacement social handle is invented. Domain fallbacks, legacy endpoints, internal cookies/events and paid-order identifiers remain compatibility records rather than new consumer branding. Existing email transport/templates still require a coordinated sender/delivery release; this cleanup does not certify every historical record or account has been renamed.

Workspace support address: saved support@goool.shop on the existing user; automatically generated support@goalathletics.shop under the verified alias domain, confirmed visually after read-back. No added mailbox/license. Earlier self-addressed Gmail test did not independently prove receiving. The subsequent owner-requested independent external test now proves Inbox receipt at support@goalathletics.shop with exact Delivered-To header; no default sender change.

GOAL metadata, SVG-based social image, manifest, canonicals, sitemap and structured data are staged. Product previews now use each preserved product canonical path rather than inheriting the homepage canonical. Track-order and success are noindex. Before cutover, default canonical host remains goool.shop; explicit preview configuration uses the new host. At approved release set NEXT_PUBLIC_SITE_URL=https://goalathletics.shop and DOMAIN_CUTOVER_ENABLED=true together for the appropriate build/runtime scopes. Verify generated sitemap, robots, schema and image URLs on production. Preview is noindex and non-operational.

## I. QA

Passing: npm ci, typecheck, production build, 7 customer-service suites, 11 migration suites, 6 vector proof checks, 27 v84 regressions, admin 9, upload 5, maintenance 6, backend 44, shipment 9, Meta 10 + readiness 9, SEO 4, worker isolation 4. Studio gallery checks cover 8 products, 18 colors, 103 views and 54 assets. Protected baseline: 97 files and 32 campaign assets unchanged. The old product-imagery harness still has obsolete dependencies and is not counted as passing.

114 hosted read-only route/link/asset checks passed across 32 pages, including nine preserved product headings and canonical paths. No forms, checkout sessions, provider writes or owner authentication were performed. 62 isolated commerce HTTP checks passed. Local release-server restarts were blocked by automatic approval review with no specific reason; hosted checks were used safely. A full active storefront/provider end-to-end certification remains outstanding.

After the approved PR #29 merge, all 13 production service smoke checks and 33 additional HTTPS continuity checks passed; live Contact screenshot inspected. PR #31 was reconciled with new main, then 7 service suites, 11 migration suites, 6 vector checks and typecheck passed again. Netlify's resulting preview build is ready. Two separately approved live email tests completed as described above; those writes are distinct from the read-only website checks.

Nine responsive widths (320,360,375,390,430,768,1024,1440,1920) show no horizontal overflow or logo/action overlap. Desktop/mobile screenshots reviewed; mobile menu, search and bag tested. Exact original Style 3 comparison requires the missing source handoff. Artwork PDFs rendered and inspected as review proofs only.

Latest infrastructure verification: 24 normal HTTPS route/signature checks across old primary/new apex/www reach Netlify: catalog remains gated; support, tracking, receipts and the known legacy supplier PNG return 200; deliberately invalid Stripe/APLIIQ signatures return 400/401 without processing. All three certificates validate and cover their hostnames. GoDaddy authoritative, Google and Cloudflare DNS match @ 75.2.60.5/www Netlify CNAME. Initial Wi-Fi resolver still returned parked IPs; it refreshed during the audit without network changes, and a subsequent normal check reached Netlify. Keep this transient DNS observation in release evidence. Eight legacy-host GET checks still show pre-existing blanket redirects for machine/print paths; staged fixes await production compatibility verification.

Read-only live Stripe endpoint is enabled at the retained legacy webhook URL with all three checkout lifecycle events. Five paid checkout events have pending_webhooks=0 and each matches a processed Supabase stripe_events row. Filtered checkout events with delivery_success=false returns none. Correct Supabase project is ACTIVE_HEALTHY; aggregate read-back confirms two live paid/unfulfilled orders (one submitted, one needs_reconcile), one success shipment callback and zero orphan order items. Live order-email queue entries are sent; test-mode pending entries remain isolated. Historical processing is verified, not a new end-to-end test. No event replay, charge, customer email or supplier mutation performed. Stripe connection exposes live mode only; the owner explicitly elected to keep the fresh sandbox checkout test blocked for now.

## J. Release blockers and rollback

- [ ] Receive V1.3 handoff: nine boards, GA, wordmark and approved desktop/mobile mockups; compare geometry and palettes before replacing masters.
- [ ] Obtain original GoDaddy export if the handoff only contains reconstruction; confirm ownership and approved manufacturing geometry.
- [ ] Complete 36 verified primary artwork variants, physical placement specs, supplier proofs and samples; retain authentic V1.2 for apparel.
- [ ] Reconcile outstanding paid supplier order and five unmatched legacy variants; never automatically resubmit.
- [ ] Resolve new-domain outgoing test Spam placement and complete reply/transactional receipt/return/shipment validation. Both approved owner-only tests were sent and Delivered; receiving alias Inbox verified, outgoing SPF/DKIM/DMARC PASS. The outgoing test's Spam placement is a release blocker. Temporary sending-only key was owner-approved, used only for those two messages, revoked and removed locally. Existing masked keys were never unmasked and no production secret setting changed. New production sender activation remains forbidden until delivery tests and separate approval pass.
- [ ] Run provider sandbox checkout/fulfillment/email tests and actual platform redirect compatibility checks. Fresh Stripe sandbox test is explicitly blocked per owner instruction pending test-mode access; never use the live account as its substitute.
- [x] Obtain separate approval, merge and deploy isolated customer-service PR #29; verify service access and shopping closure on production.
- [ ] Obtain explicit approval for full migration PR #31 merge/deploy, primary-domain promotion and any reopening. Prior narrow approvals do not authorize these actions.

Rollback uses a reviewed source revert or targeted fix through the existing CI pipeline after approval, not republishing an old Netlify snapshot. Current production baseline is the verified customer-service release e5f900866117d5e792638e1cff8e02ff076dc407; historical pre-service source was 24903a4ae6ea63c22bf5b34d9169dc4a4762e9ca. Reverting the service release would restore the support-page access defect, so prefer a targeted repair. Failed builds leave published production in place. Preserve the owner renovation access key and shopping closure; staged migration STORE_OPEN remains false. If an approved domain promotion fails, retain all aliases, restore goool.shop primary and coordinated prior canonical/cutover environment, rebuild and verify callbacks, receipts and supplier artwork URLs. No database restore or supplier-record changes are required for this code-only release.

Private backups already verified: Git bundle with 63 refs; 11 public Supabase tables/134 rows count-checked; 160-column schema inventory; daily physical backup captured. Restore rehearsal is not complete. Protect these files outside GitHub; restoration requires a separate scoped recovery decision.

If DNS itself must be reversed after approval, use the captured zone: apex @ A was Parked and www CNAME was goalathletics.shop, preserving the other five records and nameservers. Prefer restoring application/primary settings first when DNS remains healthy; DNS reversal can disable the new host.
