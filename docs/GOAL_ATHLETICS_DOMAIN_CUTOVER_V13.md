# GOAL Athletics V1.3 implementation and release runbook

Verified 13 October 2026. Migration remains staged in draft PR #31. DNS approval covers the two recorded web changes; it does not authorize production deployment, primary-domain promotion, reopening, supplier submission or customer announcements.

## A. Status

The existing business infrastructure remains in use. The new domain reaches the existing closed production store over valid HTTPS. V1.3 website changes are available in the non-operational design preview: https://deploy-preview-31--goool-shop.netlify.app.

## B. GitHub

Repository: gdove90/portugoool-site. Branch: codex/goalathletics-domain-cutover-v13-20261013. Draft PR #31 reconciles PR #27's migration work, PR #29's customer-service exceptions and the owner's exact copy without replacing the original V1.3 GA/wordmark paths. Existing main remains 24903a4ae6ea63c22bf5b34d9169dc4a4762e9ca. No migration merge has occurred.

## C. Netlify

Same project goool-shop, site 047c082c-2bc2-42d5-889f-57876fa55b78. Published production deploy remains 6acd5bf24cad2bdcce632bf3. Primary remains https://goool.shop. New apex and www are domain aliases, added using the alias workflow and verified by read-back. Latest code preview build and local production build pass; four existing no-img-element lint warnings remain.

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

No new-domain MX record exists. Existing goool.shop MX points to smtp.google.com. This confirms Google mail routing; mailbox/admin configuration still requires verification.

## E. Branding

V1.3 GA and custom outlined GOAL ATHLETICS wordmark are retained from original PR #31 reconstruction. Style 3 white/black navbar, right-side search/bag/mobile menu, footer and customer-service lockups are staged. The navbar uses GA; authentic V1.2 strike paths remain available for apparel, with divider lockups preserved separately.

Owner's performance statement appears below the homepage hero; the intersection of athletic performance, personal ambition and futbol statement appears on About. The Goal Collective has its own page and navigation entry. Registered GOOOL Athletics LLC legal identity and hello@goool.shop remain accurate.

GA SVG, six PNG sizes (16/32/48/180/192/512), ICO and manifest are staged. Favicon translation is corrected so 512px artwork center equals (255.5,255.5), retaining every SVG path. This is placement correction, not original-export certification.

## F. Master artwork and source verification

OneDrive source: Desktop/GOOOL/GOOOL ATHLETICS LOGOS/GOAL BRAND GROUP — MASTER BRAND ASSETS. Organized v3 ZIP contains 111 entries; all 110 manifest hashes match. Authentic ink/white V1.2 source SVGs also match OneDrive exactly, and website strike polygons match a uniform coordinate scale.

The newer V1.3 handoff ZIP and original GoDaddy vector export have not been supplied. No original Style 3 board comparison or full nine-colorway manufacturing certification is claimed.

Private local GOAL-V1.3-ARTWORK-REVIEW.zip contains 12 monochrome/web review variants with SVG, vector PDF, EPS, 1200px and 3600px PNGs, plus verified V1.2 sources and printer-handoff notes. It is not published in the public directory and is not approved for manufacture. Six chromatic sets are explicitly SOURCE_REQUIRED; exact colors must come from the forthcoming source boards. Black/white web background previews are not garment printing masters. All physical dimensions, decoration minima, digitization and supplier samples remain approval gates. Halo/TGC proof artwork remains unverified for manufacture.

## G. Commerce and customer operations

Preview blocks checkout, payment/supplier callbacks and scheduled worker operations with 503; product navigation and galleries are held pending verified new art. Nine existing product paths remain preserved. STORE_OPEN defaults closed. DOMAIN_CUTOVER_ENABLED defaults false; NEXT_PUBLIC_SITE_URL is a deliberate release setting.

Customer-service gate exceptions are staged, not deployed. Production Contact, Support, FAQ and Shipping & Returns still need the separately approved customer-service release. Production tracking and receipts remain accessible.

The prior private catalog audit covers 68 repository products, 288 variants, 113 mapped variants and 25 design IDs. Of 113 mappings, 108 match the live APLIIQ census; five legacy variants for design 6112026 remain unmatched. Decoration/art IDs, physical sizes and supplier approvals are incomplete. No supplier design or paid order was overwritten or resubmitted.

Two paid/unfulfilled orders remain operational blockers: one needs supplier reconciliation without automatic resubmission; the other has a supplier production reference. Sensitive order details and data backups stay in the private local audit. Re-check live status with authorized supplier access before any new product migration.

62 isolated HTTP integration checks passed with synthetic orders, loopback fixtures and fake provider signatures: duplicate/concurrent payment callbacks, pending supplier responses, timeout handling, reconciliation parking, explicit operator release, shipment/delivery updates, tracking privacy, stable identifiers and historical SKU/price snapshots. Empty reconciliation results do not trigger resubmission. These fixtures do not certify live Supabase, Stripe, APLIIQ or Resend delivery. Final fixture run blocked outbound provider networking; an earlier dummy Stripe call returned 401 and performed no real checkout.

Email checklist:
- [x] Sign in to existing Resend account; goool.shop remains verified. No new sender address activated in application configuration.
- [x] Obtain separate owner approval and save exactly three Resend records: TXT resend._domainkey (exact dashboard public key), CNAME rsend to rsend.forge.rmta.net, CNAME send to send.forge.rmta.net. Authoritative DNS and GoDaddy read-back match. All seven prior records remain intact. Resend now marks domain, DKIM and both sending CNAMEs Verified. Receiving is not enabled in Resend.
- [x] Sign in to existing Google Workspace administrator hello@goool.shop; goool.shop primary is Verified/All ok. Prepare goalathletics.shop as a no-cost user alias domain, preserving the existing inbox, login, history and license.
- [ ] Approve and add the prepared Google ownership TXT at @, MX @ smtp.google.com priority 1, and Google SPF TXT at @. Exact ownership token is captured in the private local Workspace handoff. New alias remains unverified and Gmail reception is not configured; no existing MX changed. Primary-mail-domain promotion is not part of this work.
- [ ] Obtain exact Google MX/DKIM and Resend verification/SPF/DKIM records from those accounts; reconcile SPF rather than publishing conflicting records.
- [ ] Test incoming mail, authenticated outgoing mail, replies, receipts, returns and shipment delivery with owner-controlled test recipients.
- [ ] Activate hello@goalathletics.shop only after authentication and delivery tests pass, through an approved separate release.
- [ ] Inventory and approve Search Console/Meta/analytics/QR/social/mail-campaign link changes before announcements.

## H. SEO

GOAL metadata, SVG-based social image, manifest, canonicals, sitemap and structured data are staged. Product previews now use each preserved product canonical path rather than inheriting the homepage canonical. Track-order and success are noindex. Before cutover, default canonical host remains goool.shop; explicit preview configuration uses the new host. At approved release set NEXT_PUBLIC_SITE_URL=https://goalathletics.shop and DOMAIN_CUTOVER_ENABLED=true together for the appropriate build/runtime scopes. Verify generated sitemap, robots, schema and image URLs on production. Preview is noindex and non-operational.

## I. QA

Passing: npm ci, typecheck, production build, 7 customer-service suites, 11 migration suites, 6 vector proof checks, 27 v84 regressions, admin 9, upload 5, maintenance 6, backend 44, shipment 9, Meta 10 + readiness 9, SEO 4, worker isolation 4. Studio gallery checks cover 8 products, 18 colors, 103 views and 54 assets. Protected baseline: 97 files and 32 campaign assets unchanged. The old product-imagery harness still has obsolete dependencies and is not counted as passing.

114 hosted read-only route/link/asset checks passed across 32 pages, including nine preserved product headings and canonical paths. No forms, checkout sessions, provider writes or owner authentication were performed. 62 isolated commerce HTTP checks passed. Local release-server restarts were blocked by automatic approval review with no specific reason; hosted checks were used safely. A full active storefront/provider end-to-end certification remains outstanding.

Nine responsive widths (320,360,375,390,430,768,1024,1440,1920) show no horizontal overflow or logo/action overlap. Desktop/mobile screenshots reviewed; mobile menu, search and bag tested. Exact original Style 3 comparison requires the missing source handoff. Artwork PDFs rendered and inspected as review proofs only.

## J. Release blockers and rollback

- [ ] Receive V1.3 handoff: nine boards, GA, wordmark and approved desktop/mobile mockups; compare geometry and palettes before replacing masters.
- [ ] Obtain original GoDaddy export if the handoff only contains reconstruction; confirm ownership and approved manufacturing geometry.
- [ ] Complete 36 verified primary artwork variants, physical placement specs, supplier proofs and samples; retain authentic V1.2 for apparel.
- [ ] Reconcile outstanding paid supplier order and five unmatched legacy variants; never automatically resubmit.
- [ ] Complete Google ownership/MX/SPF approval, alias verification and DKIM preparation; perform approved delivery tests. Both account sign-ins and Resend domain authentication are complete. New sender activation remains forbidden until tests and separate approval.
- [ ] Run provider sandbox checkout/fulfillment/email tests and actual platform redirect compatibility checks.
- [ ] Obtain explicit approval for production source merge/deploy, primary-domain promotion and any reopening. DNS approval alone does not authorize these actions.

Rollback uses a reviewed source revert or targeted fix through the existing CI pipeline after approval, not republishing an old Netlify snapshot. Failed builds leave published production in place. Keep STORE_OPEN=false and the owner renovation access key. If an approved domain promotion fails, retain all aliases, restore goool.shop primary and coordinated prior canonical/cutover environment, rebuild and verify callbacks, receipts and supplier artwork URLs. No database restore or supplier-record changes are required for this code-only release.

Private backups already verified: Git bundle with 63 refs; 11 public Supabase tables/134 rows count-checked; 160-column schema inventory; daily physical backup captured. Restore rehearsal is not complete. Protect these files outside GitHub; restoration requires a separate scoped recovery decision.

If DNS itself must be reversed after approval, use the captured zone: apex @ A was Parked and www CNAME was goalathletics.shop, preserving the other five records and nameservers. Prefer restoring application/primary settings first when DNS remains healthy; DNS reversal can disable the new host.
