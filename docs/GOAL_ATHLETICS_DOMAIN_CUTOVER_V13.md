# GOAL ATHLETICS: domain cutover + V1.3 website release

**Source:** https://goool.shop (existing Netlify site id `047c082c-2bc2-42d5-889f-57876fa55b78`; Netlify project `goool-shop`).
**Destination:** https://goalathletics.shop (new primary).
**Production rule:** Continue using the EXISTING Netlify site and GitHub repository. Do NOT create another store, change Supabase IDs, Stripe secrets, Apliiq IDs, fulfillment SKUs, order data, or billing providers.

## Phase 0 — current status

- Domain cutover code and V1.3 Style 3 header are staged in this PR only.
- Neither a Netlify custom-domain assignment nor GoDaddy DNS change has been performed by this PR.
- Existing store currently uses a renovation gate controlled by the production `PREVIEW_KEY` environment variable. **Do not remove this gate without owner approval.**
- Current legal entity remains GOOOL Athletics LLC and transactional email stays `hello@goool.shop` until a separate legal/email-domain verification. Never silently change an email sender domain.

## Phase 1 — configure domain, without removing the old one

1. Open Netlify **goool-shop** → Domain management → Add a domain → add `goalathletics.shop`, then `www.goalathletics.shop` to the SAME Netlify site. Do not rename the site or create a replacement project.
2. In the GoDaddy account that owns `goalathletics.shop`, modify ONLY the web records (apex @ and www) using the exact DNS records Netlify displays for this configuration. Preserve MX, TXT, email verification, and non-web records. If an apex A/ALIAS already exists, reconcile rather than add conflicting records.
3. Wait until Netlify confirms verified domain ownership, green DNS/HTTPS, and the site answers correctly at BOTH `https://goalathletics.shop` and `https://www.goalathletics.shop`. HTTPS must be valid before making the new primary.
4. Assign `goalathletics.shop` as the primary Netlify domain; KEEP `goool.shop`, `www.goool.shop`, and any existing `portugoool.com` aliases connected so that old URLs, links and supplier callbacks still reach this site.
5. **Do not enable platform blanket redirects for /api/*, /print/*, /success, /track-order** from `goool.shop` without verifying POST and receipt behavior. The middleware permits those old-host requests; Netlify domain redirects must not supersede them.

## Phase 2 — env and integrations

1. Netlify production environment: `NEXT_PUBLIC_SITE_URL=https://goalathletics.shop` (no slash). Confirm it exists for both build and server runtime, then perform a fresh production build after DNS/SSL is ready. This is required for sitemap, SEO canonicals, product schema and Stripe success/cancel URLs.
2. Keep existing `PREVIEW_KEY` (renovation gate) during cutover. Confirm owner access on new domain: old domain cookies do not transfer.
3. Stripe: test checkout in test mode if enabled, then a supervised live check; verify success and cancel point to the new host. **Leave pre-cutover webhook URL alive** on the old host or add the new `/api/stripe-webhook` endpoint only after signing secret and replay/idempotency are verified. Do not accidentally configure duplicate webhook delivery.
4. Apliiq/supplier: ensure legacy `/print/*` URLs and `/api/apliiq-fulfillment` callbacks work without redirects or authentication. Confirm a shipped-order update and purchase handoff non-destructively.
5. If there are Supabase OAuth allowed redirect URLs, add new domain before removing old. Do not modify databases or secrets.
6. Keep `hello@goool.shop` as the verified Resend sender and customer-service inbox until `hello@goalathletics.shop` has SPF/DKIM/MX verified and is tested end-to-end; then change sender in a separate release. Do not change legal-name declarations without corporate approval.
7. Check Meta business domain verification, ad links, Pixel + CAPI events, newsletter forms, analytics, Search Console property, shopping feeds, and any email/footer/contact URLs. Add new domain to the appropriate allowed-domain lists.
8. Update legacy social links, QR campaigns, scheduled social posts, e-commerce policies and paid advertising URLs only after cutover verification; avoid broken redirects.

## Phase 3 — approve and merge PR

- Inspect branch deployment before merge at 320, 375, 390, 768, 1024, 1440, 1920 px.
- Check Style 3 desktop and mobile: GA on left, V1.3 GOAL ATHLETICS outlined wordmark, search, bag, menu, nav focus, dropdown, modal controls, and no overflow.
- Confirm approved GA white-background SVG favicon (browser cache may require hard reload) and old `favicon.ico` handling; generate a matching ICO and Apple icon before release if still exposed.
- Confirm no strike symbol in the navbar; strike remains in apparel and other brand contexts.
- Run `npm run typecheck`, `npm run build`, and existing available regression suites.
- Verify no new hard-coded `goool.shop` website URLs remain in SEO, metadata, sitemap, OG, customer-facing links, except intentional legacy email, legal data and historical order links.
- Once domain/SSL/environment/integrations have passed, merge and deploy this PR.
- Verify new canonical HTTP 200 and new-host metadata, `www.goalathletics.shop` 301 to apex; old public `goool.shop` URL 301 to same new path/query while old API callbacks and supplier images still work. Validate schema.org URLs and `/robots.txt` and `/sitemap.xml`.
- Watch checkout, order emails, Stripe webhook deliveries and Apliiq callbacks closely after cutover. On failure, revert the deployment and restore old primary domain and environment URL; do not drop aliases.

## Known additional rebrand scope

This staged release prioritizes the main navbar, favicon, top-level SEO and domain. The original logo raster in `src/app/opengraph-image.tsx`, legacy `favicon.ico`, broader historical GOOOL naming throughout product names, policy copy, photos and outbound communications require asset-by-asset QA. Do not automatically alter existing product IDs, historical transaction records, legal-name copy, or SKU mapping.

**Source artwork caveat:** V1.3 logo geometry was recreated from a low-resolution GoDaddy preview. Confirm the original GoDaddy export and commercial rights before final mass-production/paid-media use.
