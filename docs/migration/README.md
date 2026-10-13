# GOAL Athletics migration audit and release runbook

Status: staged development; not approved for production. Audit date: 12 October 2026. Tracker: https://github.com/gdove90/portugoool-site/issues/24.

## Verified baseline

| System | Evidence | Outcome |
| --- | --- | --- |
| Repository | main `24903a4ae6ea63c22bf5b34d9169dc4a4762e9ca` | Dedicated branch `codex/goal-athletics-shop-migration`; existing checkout preserved |
| Netlify | site `047c082c-2bc2-42d5-889f-57876fa55b78`, `goool-shop`; published deploy `6acd5bf24cad2bdcce632bf3` | Next.js 15.5.24; Node 20; Next adapter 5.16.2; primary remains goool.shop |
| Supabase | project `oexibflpshttgzmdvhpr`, authenticated dashboard | 11 public application tables exported and count-verified; daily physical backup 2026-10-12 08:50:13 UTC |
| Storage | authenticated SQL inventory | One private bucket, goool-intake, zero objects |
| Stripe | live account and webhook inspection | Existing goool.shop webhook enabled for checkout completion, asynchronous success/failure, refund and dispute events |
| Workers | published deploy configuration | Email worker every minute; intake maintenance hourly |
| Email | live DNS and existing code | Google Workspace MX; hello@goool.shop remains the active address; Resend delivery remains on existing sender |
| APLIIQ | authenticated saved products and 2026 order list | 45 grouped saved products; open jobs present; no design or order changed |

Environment variable names and scopes were recorded locally without values. PREVIEW_KEY is populated for production and preview contexts. The connected Supabase MCP lists an unrelated project; it was not used. Correct-account database reads used the authenticated dashboard.

## Production closure findings

Unauthenticated GET /, /shop, /men, /women and /cart redirect to /gate. /track-order, /success, /privacy, /terms and /refunds return 200. Payment/supplier/operations endpoints return method responses rather than the gate. These read-only probes prove reachability, not a fresh signed transaction.

Contact, Support, FAQ and Shipping & Returns currently redirect to the gate in production. The branch fixes this and adds a server-side checkout closure check. Production remains unchanged pending owner approval.

Closure now defaults on even when PREVIEW_KEY is absent. A missing key disables team access rather than exposing the catalog. Reopening requires both STORE_OPEN=true and removing PREVIEW_KEY, after release approval. A valid hashed team cookie grants catalog review only; closed-store checkout still fails.

Broad Netlify host redirects were removed from the branch. Middleware canonicalizes only GET/HEAD consumer routes; API, supplier print, service, unsubscribe and worker routes retain their host and request body. Netlify platform apex/www behavior still needs cutover testing; code alone cannot override every platform redirect.

## Staged implementation

The horizontal identity uses the original V1.2 polygon coordinates, a mandatory visible divider and the reference-derived GOAL ATHLETICS outline. Header, mobile menu, footer, gate, accessible branding, favicon, touch icon and social preview were updated. Custom outlined lettering remains a digital reconstruction; it is not a newly identified licensed font or a manufacturer-certified master.

The Goal Collective has a dedicated entry, mobile navigation and men's/women's lifestyle sections. Legal seller text remains GOOOL Athletics LLC. Historical slugs, event keys, customer references, prices, inventory IDs and fulfillment mappings remain unchanged.

PR #22 was reconciled by retaining its vector/governance assets and integrity checks without merging its older reconstructed wordmark over the corrected current-main assets. The original PR remains intact. The branch starts from the newer main, including PR #26.

Netlify deploy-preview and branch-deploy builds automatically enter design-preview mode. They show the staged site but reject operational APIs, unsubscribe writes and checkout; promotional popups and Meta Pixel are disabled. Product grids, product detail and kitwear imagery remain on hold because the legacy galleries show the old artwork. No product has been activated or published. This preview is for visual review, not live commerce.

## Inventory and manufacturing blockers

The local GOAL-Product-Migration.xlsx includes all 68 repository products, 288 size/color combinations, 113 mapped combinations and 25 unique mapped APLIIQ designs, plus all 45 live grouped supplier records. Of the mapped combinations, 108 match a current supplier design ID; the remaining five need manual reconciliation. The database has 64 product rows, while repository catalog has 68; this difference requires reconciliation before a catalog write.

The workbook marks missing decoration/placement/artwork IDs and physical dimensions explicitly. It is a complete repository variant census and supplier product census, not a completed manufacturer specification pack. Existing supplier account rows may group several saved-design IDs under one product. Never use a group ID alone as the variant mapping.

Release blockers:

- Native/master confirmation and exact output proof for reconstructed GOAL wordmark and Halo lettering.
- Final manufacturing masters for The Goal Collective's distinct symbol and TGC families.
- APLIIQ placement dimensions, print/embroidery minima, approved colors, decoration costs and sample approval for each replacement.
- Clone-only replacement design IDs; retain every legacy design used by paid or historical orders.
- Neutral studio front/back/model/detail mockups derived from approved garment and artwork sources. Do not render speculative artwork as approved merchandise.
- One live paid order remains in needs_reconcile without a supplier order ID. A separate paid order is in production. Private local audit has the references. Reconcile manually before any resubmission to avoid duplicate fulfillment.

The original strike geometry is retained, but geometry alone does not approve a garment placement. No new supplier submissions, payments, customer messages or refunds were made.

## Domain and email checklist

Observed DNS: goool.shop and portugoool.com resolve to existing Netlify addresses. goalathletics.shop remains GoDaddy parked with ns09.domaincontrol.com and ns10.domaincontrol.com, apex 3.33.130.190 / 15.197.148.33, www CNAME to apex. No MX or root TXT was returned for the new domain. An existing GoDaddy DMARC quarantine record is present; preserve it until the approved mail configuration is known.

The current goool.shop certificate is valid, including the old www/apex hostnames, through 6 December 2026. New-domain storefront TLS has not been provisioned or verified.

- [ ] Verify registration and zone access in the owner's GoDaddy account; export the full zone before changes.
- [ ] Capture existing Netlify primary domain and domain list immediately before any addition. Review the exact final confirmation; adding/assigning a domain may establish its primary status and trigger apex/www redirects.
- [ ] Obtain explicit approval for the concrete domain change. Use the existing site and GoDaddy external DNS; do not change nameservers or create another storefront.
- [ ] Record the exact DNS values returned for this site. Do not copy current parked addresses as destination values or invent a target from generic documentation.
- [ ] Verify apex/www HTTPS and all deep links, print assets, tracking, payment callbacks and supplier callbacks before primary cutover.
- [ ] Add the new domain to the existing Google Workspace only after its administrator confirms domain/alias configuration. Keep the old mailbox and message history; retain old inbound aliases for 6–12 months.
- [ ] Obtain the actual Google Workspace MX/SPF/DKIM and Resend verification records from their consoles. Publish only approved records, with one coherent SPF policy and the appropriate Resend return-path subdomain.
- [ ] Verify DNS authentication, mailbox send/receive, Reply-To, bounce handling, receipt, refund and shipment messages before enabling hello@goalathletics.shop in code or Resend.
- [ ] Coordinate canonical SITE_URL, sitemap, JSON-LD, OG URLs, Stripe return URLs, email links, Search Console, Meta/CAPI allowed domains, social profiles and QR destinations in one release. Existing production URLs remain until then.
- [ ] Test path/query preserving consumer redirects separately from machine URLs. Keep old supplier artwork URLs available for outstanding orders.

Netlify documents automatic apex/www redirection when assigning a primary custom domain: https://docs.netlify.com/manage/domains/manage-domains/manage-multiple-domains/. The exact add-domain flow was not submitted; no assumption of an invisible alias change is made.

## Backup and rollback

The verified Git bundle covers all 63 available refs and tracked source/assets, including the migration baseline and PR #22. The local private JSON export contains all 11 public tables with counts matching the source query. A SHA-256 manifest is included. Orders, line items, shipments, Stripe events, delivery logs, newsletter records, products and discount records are covered. Supabase's automated physical backup supplies a separate server-side recovery source. The JSON export is not a pg_dump, does not recreate roles/triggers/RLS, and has not been restore-tested. Do not claim a full disaster recovery rehearsal.

No storage object copy was needed because the sole bucket was empty. Preserve the private backup outside Git. Do not attach it to the public issue or PR. Production may continue receiving callbacks, so take a fresh snapshot immediately before any eventual migration.

Rollback sequence:

1. Keep the renovation gate closed and stop any newly enabled checkout if payment, order or supplier consistency fails. Do not disable webhooks or customer tracking.
2. Revert the migration commit in Git on a reviewed branch and build/deploy through normal CI after owner authorization. Use fix-forward source reversion, not Netlify dashboard restore/publish of an old deploy. Baseline is 24903a4ae6ea63c22bf5b34d9169dc4a4762e9ca.
3. If a future approved cutover changed DNS, restore the saved GoDaddy zone and previous Netlify primary configuration. Preserve both domains' certificates, mail records and machine URLs while propagation settles.
4. Revert sender/reply-to to the verified old mailbox if new-domain delivery fails; preserve queued messages and delivery idempotency keys. Never replay already-sent email indiscriminately.
5. Revert only future catalog-to-new-design mappings. Historical order_items retain their original design IDs and SKUs. Never bulk rewrite historical orders to new designs.
6. Restore data only for confirmed corruption, first into an isolated project. Compare row counts, foreign keys, RLS, functions, storage and paid-order totals. Reconcile all transactions after the snapshot; do not overwrite production with an old snapshot while orders are still arriving.
7. Re-run closure/service probes, signed local callback tests and tracking checks. Monitor webhook errors, shipment updates, email queues and supplier failures for 48–72 hours after an approved release.

## Approval boundary

The next production action is a reviewed deployment of the closure/service fix or the complete migration, not a DNS edit. Production deployment, domain addition/cutover, live product publication, supplier submissions and announcements remain blocked pending explicit owner approval. Manufacturing and new email activation also require their verification evidence first.
