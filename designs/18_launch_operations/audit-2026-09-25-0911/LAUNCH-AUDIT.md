# GOOOL launch audit — September 25, 2026

**Verdict: the public storefront and live checkout work, but the launch is not operationally ready for unattended sales.** The gate remains removed. No production settings, supplier designs, source code, or customer records were changed.

Checked September 25, approximately 08:52–09:11 EDT. Live site: https://goool.shop. Current Netlify deployment: 6ab657e46cce8061fd574772, published 07:21 EDT, ready, HTTPS enabled. Current local project: C:\Users\gdove\OneDrive\Desktop\GOOOL, HEAD c3cef25. Netlify records no commit ref for this manual deployment; source/deployment identity is not fully established by Git metadata. All 36 live catalog images independently match the current local files byte for byte.

## Findings to resolve before promoting the launch

### 1. Blocker — paid orders will not automatically reach Apliiq

Fresh production configuration lacks APLIIQ_APP_ID, APLIIQ_SHARED_SECRET, and APLIIQ_SUBMIT_ENABLED. APLIIQ_ALLOW_LIVE=true is present, but does not enable submission by itself. The current code returns left_pending_disabled when submission is off. Stripe can collect payment while the supplier never receives the order.

FULFILLMENT_OPS_KEY is also missing, so the protected operations route cannot currently provide the intended recovery workflow.

Evidence: production-config.json; src/lib/apliiq.ts:73; src/lib/fulfillment-submit.ts:147; src/app/api/fulfillment-ops/route.ts:37.

Remedy: configure the real supplier credentials and an operator recovery mechanism, verify the saved designs and billing readiness, then deliberately enable production submission. Confirm one paid order reaches the correct supplier design, color, size and shipping address exactly once. Existing pending orders need reconciliation; enabling the switch alone does not prove recovery. Until then, any orders require an explicit manual fulfillment process.

### 2. Blocker — GOOOL order-confirmation email is disabled

None of the supported production transactional email providers is configured: no Gmail service-account pair, SMTP user/password pair, or Resend key. Mailchimp credentials and audience ID are present, but they serve the marketing list, not transactional order confirmations.

The application attempts a Stripe receipt separately, but delivery has not been verified. The code catches email failures and still records the webhook event as processed; replaying that same event then hits the duplicate-event return. A released email claim alone is not a complete retry mechanism.

Evidence: production-config.json; src/lib/email.ts:82; src/app/api/stripe-webhook/route.ts:195 and :311.

Remedy: configure and verify a transactional provider, verify inbox delivery of the order reference and tracking link, and establish a retry/recovery route for missed confirmations.

### 3. Blocker for the Modern Sport tee — corrected website artwork is not verified in Apliiq

Both Black and True Royal website back images have the enlarged ATHLETICS lettering and open A. The local v5 production handoff explicitly remains pending supplier upload. The browser available for this audit showed Apliiq signed out, so a later upload by another operator could not be checked.

Target saved designs: 6112037 (Black), 6113361 (True Royal).
Prepared file: designs/30_modern-sport-open-a-2026-09-25/exports/GA-01-B_v5_OPEN-A_1950px_600ppi.png.
Use 3.25 × 1.235 inches, aspect ratio locked. Do not force it into the previous shorter placement height.

The existing local measurement record reports a 2.1981 mm minimum ATHLETICS stroke at that scale. That number does not certify the entire logo: the original GOOOL wordmark has pointed terminals, and the A's internal opening is a separate negative-space check. Apliiq recommends font parts at least 2 mm thick, opaque artwork and adequate resolution at final print size; a supplier proof or sample remains necessary to establish physical output quality. [Apliiq artwork requirements](https://help.apliiq.com/portal/en/kb/articles/how-to-prepare-artwork-for-transfer-printing)

Evidence: designs/30_modern-sport-open-a-2026-09-25/README.md, print-audit.json and master-spec.json; current live-image hashes in public-audit.json. This audit did not repeat the physical print measurements or upload artwork.

### 4. High priority — dependency security remediation is overdue

The current project pins Next.js 14.2.5. A fresh production-dependency npm audit reports six affected package entries: one critical, two high, one moderate and two low. Next.js carries the critical package rating; other flagged entries are nanoid, PostCSS, qs and the Supabase packages.

The maintainer lists security issues covering this Next.js version, including an App Router denial-of-service issue and an AVIF image-optimization issue. These are package findings, not proof that every exploit applies to this Netlify deployment. The app has no remote image hosts configured; Netlify adapter/runtime mitigations were not independently verified. No exploit attempts were made. [Next.js App Router advisory](https://github.com/vercel/next.js/security/advisories/GHSA-5j59-xgg2-r9c4), [image-optimization advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4)

Remedy: upgrade to a currently supported, patched compatible release, review transitive advisories, then rebuild and repeat checkout/image/API smoke checks before deployment. Do not assume npm's suggested 14.2.35 update resolves advisories that list later patched branches.

### 5. International checkout needs correction

Selecting Portugal in the live Stripe form leaves Standard shipping labelled 7–12 business days, while adjacent copy says international delivery takes 3–5 weeks. One $9.50 rate with a 7–12 business-day estimate is applied to US, Canada, Portugal and UK checkout.

Remedy: use destination-appropriate delivery estimates or remove the misleading universal estimate, and confirm international shipping economics with the supplier.

The refund page also applies a blanket final-sale policy to every country. UK/EU distance-selling rules commonly provide cancellation rights, subject to exceptions. Whether these standard catalog garments qualify for any exception should be reviewed by a qualified adviser before international promotion; do not treat ordinary print-on-demand production as verified exemption. The terms include a general statutory-rights safeguard, but the specific customer-facing policy still needs review. [UK guidance](https://www.gov.uk/online-and-distance-selling-for-businesses), [EU withdrawal guidance](https://europa.eu/youreurope/citizens/consumers/shopping/returns/index_en.htm)

## Checks that passed

| Area | Fresh result |
|---|---|
| Public access | 40 page/variant URL checks returned 200 without a preview cookie; no tested public page carried noindex. |
| Catalog | Nine active products; 78 color/size combinations have supplier mappings. This verifies mappings exist, not supplier inventory or proof approval. |
| Images | All 36 current catalog images returned 200 and matched local SHA-256 hashes. |
| Background | Sampled actual background regions match sRGB #F2F2F2, RGB 242/242/242, within one channel value. |
| Detail-crop handling | Two Modern Sport back close-ups include garment in their bottom corners. Those pixels were excluded from backdrop assessment; top background samples pass. No image edit was needed. |
| Desktop shopping | Color selection, front/back gallery, size guide and missing-size validation worked. |
| Cart | Natural / M tee entered correctly; quantity 1→2 changed $48→$96; reload retained selection and quantity; decrease returned $48. |
| Live checkout | Hosted Stripe checkout loaded the correct Natural / M tee: $48 + $9.50 shipping = $57.50. No payment or customer data entered. |
| Stripe account | Charges and payouts enabled; no currently-due or past-due requirements returned. |
| Stripe webhook | Enabled live endpoint at /api/stripe-webhook, subscribing to checkout completion, async success/failure, refunds and disputes. |
| Mobile | At a 390×844 viewport, cart and hoodie page showed no horizontal overflow; menu, collection filter, color and back-image controls worked. |
| Browser errors | No captured warnings/errors on the final storefront page. |
| Redirects | Ten canonical-domain/retired-route checks returned 301 to the expected destinations. |
| Validation/authentication | Nine negative API checks returned expected 400/401/404 statuses; no signups, messages or orders submitted. |
| Tracking connectivity | A syntactically valid nonexistent order lookup returned 404 rather than storage-unavailable 503. This supports read-path connectivity, not a full database audit. |
| SEO basics | robots.txt, sitemap.xml, canonical tags, homepage metadata and Product structured data present; sitemap has 18 URLs including all nine active products. |
| Missing page | Unknown URL returned 404. |
| Local type check | tsc --noEmit --incremental false passed. No build/deployment was run during this audit. |

## Unverified or follow-up items

- No completed live checkout appeared in the account's 11 returned checkout sessions at the time of inspection; all were open/unpaid or expired/unpaid. This is a checkout-session observation, not a claim about every payment elsewhere in the account.
- One additional unpaid checkout was created by this audit. It was left unpaid and the temporary cart item was removed.
- The full payment → persistent order → supplier acceptance → email → tracking → delivery chain has not passed a real paid-order test.
- Supplier billing method, current stock, all saved production proofs, physical samples and print durability remain unverified.
- Sales-tax calculation is off in the inspected checkout sessions, and the terms disclose no current collection. Whether this is correct depends on the business's registrations and obligations; get accounting confirmation.
- Support contact uses a clearly labelled mail-app handoff to hello@goool.shop. Actual mailbox delivery/response was not tested.
- No Google verification meta tag was found. DNS-based Search Console verification and sitemap submission were not checked, so this does not establish that the property is unverified.
- Business entity registration behind the displayed LLC name, formal policy compliance, database RLS/backups, accessibility conformance and measured Core Web Vitals were not certified by this launch smoke audit.

## Completion criteria

Keep the public gate removed. Resolve supplier automation and email, verify v5 artwork in both Apliiq designs, remediate security advisories, and correct international delivery/policy wording. Then run an explicitly authorized controlled purchase and verify persistence, one supplier submission, inbox delivery and tracking. Do not call checkout creation alone a completed fulfillment test.

Evidence files alongside this report: public-audit.json, production-config.json, stripe-audit.json, dependency-audit.json and browser-checks.json. Audit scripts are retained for reproducibility; they are read-only except for writing local audit outputs. Existing unrelated repository changes were left untouched.


## Remediation progress — September 25, afternoon

- Verified Apliiq VIP active at $29.99/month, renewal October 25. Existing GOOOL custom store 199130 retained.
- Saved the existing store fulfillment callback as https://goool.shop/api/apliiq-fulfillment; Apliiq confirmed the URL was saved.
- Netlify connector reported successful production/function-scope secret upserts for APLIIQ_APP_ID and APLIIQ_SHARED_SECRET. Runtime authentication is not yet verified, and APLIIQ_SUBMIT_ENABLED remains off/absent. No new deployment was made.
- Netlify CLI session expired. A renewal ticket is awaiting Netlify confirmation; checks after the owner reported authorization still returned pending. The connected Netlify tool remains accessible.
- The Black tee saved design 6112037 still has the older v3 high-resolution back artwork and 3.25 x 1.11 inch placement. Apliiq rejected a second high-resolution upload because one is already attached. Current official guidance requires a new design for significant artwork changes. Replacement supplier designs for Black and True Royal require owner approval after automatic approval review blocked the new-design action under the no-redundancy instruction. No supplier designs or SKU mappings were changed.
- Reused the selected satin-label master, correcting only density metadata from 72 to 300 DPI; decoded pixels were verified identical. Apliiq accepted 1 x 1 inch / 300 DPI (ideal quality), saved label design 6135701 / subscription sb-2-158901, and activated 10 free sample tags. Owner instructed PREPARE ONLY. The account explicitly reports no products using this label. No labels purchased or attached. See the existing label README for specs and current official sources.
- Transactional email credentials are still awaiting owner input. No test email or real order was sent.
- Automatic approval review rejected proposed fulfillment/webhook source changes because email credentials remain unresolved and the changes were not tested. Those changes were NOT applied; application source remains unchanged.
- Dependency and international-delivery findings above remain unresolved. The storefront gate remains removed.

Next required inputs: finish Netlify authorization; identify the existing Google Workspace sending credentials or authorize setup; approve the two necessary supplier replacement designs or an Apliiq support handoff. Do not report unattended fulfillment as launch-ready yet.
