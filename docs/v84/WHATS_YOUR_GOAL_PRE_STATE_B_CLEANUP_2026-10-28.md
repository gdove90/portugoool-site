# What's Your Goal? Final pre-State-B cleanup (2026-10-28)

Mode: FINAL PRE-STATE-B CLEANUP. Preparation only. NOT DEPLOYED. State A stays closed.

## 1. Starting point

- Starting `main`: `0fda828c35b1e988b33ab710a3001da1fbe379f2` (Merge approved test-only legacy suite repair, PR 57). Work branch `claude/pre-state-b-cleanup` was cut from that commit after `git fetch origin main`.
- GOAL Athletics repositioning present: `src/v84/reference-experience.js` carries "A goal is just the beginning.", "PERFORMANCE ATHLETICWEAR. BUILT FOR WHAT'S NEXT." and "Train. Play. Recover."; `/shop` heading "Train. Play. Recover.".
- Test maintenance present: PR 57 commit `4a4b46d` (14 scripts updated, 7 fixtures under `scripts/fixtures/`).
- State A present: `src/app/whats-your-goal/page.tsx` renders `ReferencePage route="story" submissionsOpen={storyIntakeOpen()}`; `src/lib/intake/server.ts` refuses story starts with 503 while closed.
- `STORY_INTAKE_OPEN` in the Netlify production context: `false` before the work, `false` after (never touched).

## 2. Case-insensitive GOOOL inventory

`git grep -n -i -I goool` over tracked text files (binary images, archives and fonts excluded) returns matches in 1,139 files. By top-level folder:

| Folder | Files | Classification |
|---|---|---|
| `designs/` | 887 | C. Design records, tech packs, prompts and decision logs. Never served; `designs/` is not imported by app code. |
| `CORE-CAPSULE-LAUNCH-2026-09-25/` | 72 | C. Curated launch archive, rebuilt from `designs/`. Never served. |
| `src/` | 59 | Itemised below. |
| `scripts/` | 40 | C. Test harnesses and fixtures that pin historical catalog rows, slugs, SKUs and the Match Highlights agreement. Never served. |
| `supabase/migrations/` | 28 | C. Applied migration identifiers and seed text (`0027_goool_athletics.sql` and others). Immutable by rule. |
| `docs/` | 15 | C. Historical reports, including the State A activation report. |
| `brand-assets/`, `tmp/`, `output/`, `.claude/`, `Instagram posts/` | 22 | C. Local working material and skills. Never served. |
| Root docs (`CLAUDE.md`, `README.md`, `LAUNCH-TASK-LIST.md`, `CLAUDE-*.md`, `ARTWORK-START-HERE.md`, `APLIIQ-UPLOAD-START-HERE.md`) | 8 | C. Operating manual and historical prompts; `CLAUDE.md` itself records the GOOOL-to-GoalAthletics decision. `README.md` is still titled PORTUGOOOL: an internal repository page, not production. |
| `netlify.toml`, `tailwind.config.ts`, `.env.example`, `.gitignore` | 4 | B/C. The `/whats-your-goool` fallback 301 (B); comments and ignore patterns (C). |
| `public/` | 1 text file (`participation-agreement.html`) + 20 placeholder SVGs | D and C, see below. |
| `netlify/functions/` | 2 | B. Scheduled functions call `https://goool.shop/api/...`; the legacy host is a kept alias and `/api/` paths are exempt from the host redirect (verified: POST to the legacy host returns 403 from the route, not a 301). |

### 2a. Category A. Active references, fixed in this pass

| Location | Spelling | Fix |
|---|---|---|
| `src/v84/admin-controller.js` (kit request detail, "Number style") | `GOOOL numbers` | `GOAL Athletics numbers`, matching the public form label "Use GOAL Athletics numbers". |

Count after this pass: **0** code-controlled active references. Three public legal-text references and three Stripe account strings remain and are listed in 2e because they need the owner's decision, not a code edit.

### 2b. Category B. Backward-compatibility routes and identifiers (retained)

Changing any of these would break existing cookies, saved codes, order references, stored rows or file paths, and would be a commerce or storage change outside this pass.

- Route: `/whats-your-goool` 301 to `/whats-your-goal` in `src/middleware.ts` plus the `netlify.toml` fallback. Verified absent from canonical metadata, sitemap, robots rules, page copy, navigation, footer, emails, admin labels, consent text and CTA links (only code comments in `robots.ts`, `sitemap.ts`, `whats-your-goal/page.tsx` mention it).
- Legacy host: `goool.shop` and `portugoool.com` canonicalise to `goalathletics.shop` in `src/middleware.ts`; `src/lib/seo.ts` falls back to the legacy host only when `DOMAIN_CUTOVER_ENABLED` is not `true` (production: `true`, `NEXT_PUBLIC_SITE_URL=https://goalathletics.shop`). Retired product slug redirects in the middleware.
- Order reference prefix `GOOOL-XXXXXXXX`: `src/lib/emails/order-confirmation.ts`, `src/lib/fulfillment-submit.ts`, `src/app/api/track-order/route.ts`, `src/app/track-order/page.tsx` (help text and placeholder show the real format). Real orders carry it (GOOOL-9A8DA279); a new prefix is a commerce decision.
- Cookies and storage keys: `goool_geo`, `goool_gate`, `goool_preview` (legacy, rejected), `goool-owner-access`, `goool-owner-refresh`, `goool_marketing_consent_v1`, `goool_meta_em`, `goool_checkout_session`, `goool20_popup`.
- DOM events and attributes: `goool:open-bag`, `goool:cookie-settings`, `goool:marketing-consent`, `goool20:open`, `data-goool-consent`, `data-goool-us`, `data-goool-nonus`, `data-goool-prompt`, `data-goool-region` (CSS in `layout.tsx`, `integration.css`, `mobile.css`, `globals.css` keyframe `goool20-up`).
- Catalog identifiers: product slugs (`goool-performance-tee`, `goool-heavyweight-hoodie`, ...), image paths under `/products/`, gallery manifests `mens-studio-v3/v4.json`, `studio-backgrounds-v5.json`, `mens-on-body-v2.json`, `src/lib/collections.ts`, `src/lib/welcome.ts` slug, `src/lib/product-image.ts` path tests, `number-art.js` asset names. Every product whose name starts with GOOOL is `availableForSale: false`; the live sitemap lists ten `goal-athletics-*` products and none of their pages carry GOOOL in visible text or attributes.
- Supplier and provider identifiers: Printful store "Portugoool" and `GOOOL-OVAL-TEE-*` SKUs (`src/lib/printful.ts`), Resend audience `goool` (`src/lib/signups.ts`), coupon metadata source `goool20-popup` and the `GOOOL20|GOAL20` code regex (`src/lib/discount.ts`, `src/app/api/discount/route.ts`, Meta `content_name` "GOOOL20 sign-up"), kit form value `goool` (`reference-experience.js`, `validation.mjs`).
- Scheduled functions: `netlify/functions/intake-maintenance.mts` and `deliver-emails.mts` call `https://goool.shop/api/...` with `redirect: "error"`. Works today because `/api/` is exempt from the host redirect. Recommendation for a later pass: point both at `https://goalathletics.shop` so the hourly cleanup does not depend on the alias domain.

### 2c. Category C. Historical, engineering and migration artifacts (retained)

- Code comments only: `src/middleware.ts`, `src/lib/fulfillment.ts` (saved-design history), `src/components/Hero.tsx` (unreferenced legacy component), `src/components/FeelingBand.tsx`, `src/components/ProductCard.tsx`, `src/app/shop/[slug]/page.tsx` (strips a legacy "GOOOL " prefix), `src/app/api/checkout/route.ts`, `src/app/api/stripe-webhook/route.ts`, `src/app/api/preview/route.ts`, `src/app/cart/page.tsx`, `src/app/gate/page.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/whats-your-goal/page.tsx`, `src/lib/gate.ts`, `src/lib/signups.ts`, `src/lib/supabase.ts`, `src/lib/types.ts`, `src/lib/welcome.ts`, `src/lib/emails/order-confirmation.ts`, `src/lib/emails/order-delay-notice.ts`, `src/lib/business-address.ts` (records the Stripe public name as of 2026-10-23), `src/v84/catalog-data.ts`, `src/v84/style.css`, `src/lib/meta-pixel.ts`.
- Dormant copy: `src/lib/emails/welcome-2.ts` says "GA on the chest, GOOOL ATHLETICS on the back" about the retired tri-blend tee. The sender gate in `src/lib/welcome.ts` is closed (`blank !== "BC3413"`), so Email 2 is never sent. Left as is because rewriting it would describe a product that no longer exists; it cannot surface while the gate is closed.
- Placeholder SVGs in `public/products/` (`goool-cap.svg`, `goool-tee.svg`, `supporters-scarf.svg`, `terrace-flag.svg`, jersey placeholders) carry PORTUGOOOL / GOOOOOL text. Referenced only by retired catalog rows; reachable by direct URL only. Not deleted (imagery freeze).
- `src/lib/products.ts` retired rows: names, descriptions and alt text of products that are off sale. Never rendered publicly (sitemap, shop grids and product pages verified).
- Supabase migrations, `designs/`, `docs/`, `scripts/`, root prompts and README as tabled above.

### 2d. Category D. Historical consent and audit records (retained, must not be rewritten)

- `src/lib/intake/agreements.json` key `participation-agreement.html`: the Match Highlights snapshot `SYG-2026-10-04-live-1` naming "GOOOL Athletics LLC" and "Share Your GOOOLS!". Stored per submission as `consent.termsSnapshot` with `termsHash`; the hash must keep matching.
- `public/story-participation-agreement.html` and the story snapshot are `WYG-2026-10-28-live-3` and contain no GOOOL.
- Historical submissions keep the exact `termsVersion`, snapshot and hash they accepted. Nothing in `intake_submissions` was read or written in this pass.

### 2e. Public legal text and Stripe account strings that still say GOOOL (owner decision required)

These are active and can surface publicly. They were left unchanged because each is a legal party name, an agreement clause or a Stripe account object, and the owner's standing instruction excludes the Kit Wear and Match Highlights agreements and all commerce changes from campaign cleanup.

| Surface | Current text | Can surface | Proposed resolution |
|---|---|---|---|
| Kit Wear consent (`/kit-wear`, live, public): `src/v84/reference-experience.js` and `src/lib/intake/validation.mjs`, version `KIT-2026-10-04-1` | "I agree that GOOOL Athletics LLC may store and review this request and contact me about it." | Yes, on every Kit Wear quote request | New version `KIT-2026-10-28-2` naming the confirmed operator (same wording as the story live-4 party line), synchronised in the controller and validator. Needs the operator decision below first. |
| Match Highlights consent (`/share-your-goals`, owner-only page; agreement file public by URL): `reference-experience.js` STORY/SYG terms, `public/participation-agreement.html`, snapshot in `agreements.json`, version `SYG-2026-10-04-live-1` | "This agreement is between GOOOL Athletics LLC (the Company)...", dialog eyebrow "GOOOL ATHLETICS LLC", "Share Your GOOOLS!" | Page: owner only. File: direct URL, noindex | New version `SYG-2026-10-28-live-2` with the confirmed operator and "Match Highlights"; the live-1 snapshot stays for existing rows. |
| Terms page (`/terms`), Intellectual property clause | "The GOOOL and GOAL ATHLETICS names, wordmarks, designs, and site content are our property." | Yes | Replace with "The GOAL ATHLETICS name, wordmarks, designs, and site content, including our earlier marks, are our property." The legacy mark is still on the alias domain and on garments already sold, so the clause keeps "earlier marks" without spelling GOOOL. Owner's call because it is an agreement clause. |
| Stripe live account `acct_1UHzboBG7q8OBDEm` | Dashboard display name "GOOOL ATHLETICS"; statement descriptor "GOOOL ATHLETICS" (what customers see on card statements); public name already "GOAL Athletics" | Yes, on every card statement | Owner changes both in the Stripe dashboard (Settings, Business details and Public details). Not a code change. |
| Stripe coupon | Name "GOOOL20 · 20% off first order" (`src/lib/discount.ts` `COUPON_NAME`; the existing coupon is found by metadata, so a code edit would not rename it). Shown as the discount label in Stripe Checkout when a code is applied | Yes, at checkout | Owner renames the coupon in the Stripe dashboard to "GOAL20 · 20% off first order"; then `COUPON_NAME` can follow in code. |

## 3. Legal and operator identity audit

Surfaces audited and what each says today:

| Surface | Identity today |
|---|---|
| What's Your Goal? agreement (`STORY_TERMS`, `WYG-2026-10-28-live-3`) | "GOAL Athletics, an independent athletic apparel brand based in Rhode Island (the Company)". No legal person named. |
| Stored story snapshot (`agreements.json`, `public/story-participation-agreement.html`) | Same text, sha256 `ed80e6ec...0981`. |
| Terms (`/terms`, "Who we are") | "GOAL Athletics is an independent brand of The Goal Brand Group LLC." |
| Privacy (`/privacy`) | Brand only ("GOAL Athletics", "we"); no entity. |
| Footer (`src/v84/Shell.tsx`) and customer-service shell | "GOAL Athletics · PO Box 19, Saunderstown, RI 02874". No entity (State A correction). |
| Organization JSON-LD (`src/lib/seo.ts`) | `name` GOAL Athletics, no `legalName` (State A correction). |
| Order confirmation and delay emails, marketing email footer (`src/lib/emails/*.ts`) | "The Goal Brand Group LLC" plus "GOAL Athletics is an independent brand of The Goal Brand Group LLC." |
| Unsubscribe page (`src/app/unsubscribe/[token]/route.ts`) | "The Goal Brand Group LLC · goalathletics.shop". |
| Payment success page (`/success`) | "The Goal Brand Group LLC · Saunderstown, RI 02874". |
| Closed-store gate (`src/components/Gate.tsx`; only rendered when `STORE_OPEN` is false) | "© 2026 The Goal Brand Group LLC". |
| Old `src/components/Footer.tsx` | "© The Goal Brand Group LLC"; the component is not imported anywhere (dead). |
| Admin (`/admin`) | GOAL ATHLETICS header; no entity. |
| Campaign intake (`server.ts`), validator (`validation.mjs`), controller (`reference-experience.js`) | Story: brand only, live-3. Kit: "GOOOL Athletics LLC" (KIT-2026-10-04-1). Match: "GOOOL Athletics LLC" (SYG-2026-10-04-live-1). |
| Legal downloads | `/story-participation-agreement.html` brand only; `/participation-agreement.html` GOOOL Athletics LLC; `/intake-privacy.html` brand only. |
| Stripe live account (read through the authenticated, read-only `stripe-webhooks` ops action on 2026-10-28) | `business_type: individual`; legal/public name "GOAL Athletics"; dashboard name and statement descriptor "GOOOL ATHLETICS". |
| Supabase, Netlify, Apliiq, Tapstitch | Technical accounts; no legal entity recorded in the repository. |

Evidence summary:

1. The Goal Brand Group LLC is not formed (owner statement 2026-10-28; the Rhode Island registry showed no filing on 2026-10-23 per `business-address.ts`). It cannot be the contracting party today.
2. The only verified business configuration that names a legal person is the Stripe live account, and it is an **individual** account. The merchant of record for every sale is therefore the owner personally, trading as GOAL Athletics.
3. "GOAL Athletics" by itself is a brand, not a legal person. The live-3 agreement is accurate but names no party who can be bound or sued.

Decision rule result: **OWNER LEGAL ENTITY CONFIRMATION REQUIRED BEFORE STATE B.** The repository cannot establish the operator's legal name or any trade-name filing, so no wording was changed and submissions stay closed.

Exact wording options for the owner to pick from (nothing else is invented):

- Operator is the owner personally, before the LLC exists: "This agreement is between [owner's full legal name], an individual doing business as GOAL Athletics in Rhode Island (the Company), and the adult identified as the submitter (you)." Use the same party line in the Terms "Who we are" section, the email footers, the unsubscribe page, the success page and the gate.
- The LLC is formed before State B: "This agreement is between The Goal Brand Group LLC, a Rhode Island limited liability company doing business as GOAL Athletics (the Company), and the adult identified as the submitter (you)." The existing `LEGAL_NAME` lines then become accurate as they stand.

Either choice ships as consent version `WYG-2026-10-28-live-4` (new STORY_TERMS text, validator pin, `agreements.json` snapshot and hash, regenerated `public/story-participation-agreement.html`); live-3 records stay untouched.

## 4. Consent versioning

- Before: `WYG-2026-10-28-live-3`. After: `WYG-2026-10-28-live-3` (unchanged; no operator wording exists to ship).
- Historical versions live-1, live-2 and live-3 and the SYG/KIT versions were not rewritten. `src/lib/intake/agreements.json` is byte-identical to `main`.

## 5. Admin, campaign name, routes

- Admin brand cleanup: header already "GOAL ATHLETICS"; the one remaining legacy label ("GOOOL numbers") is now "GOAL Athletics numbers". Authentication, authorisation, inbox, statuses, signed video reads, notes, delete and moderation logic untouched (`Admin.tsx`, `admin.ts`, `auth.ts` unchanged).
- Campaign name: "What's Your GOAL?" everywhere (page title, metadata, intake copy, agreement). No "What's Your Next Goal?", "What Comes Next?", "Your Next Goal" or "GOAL Stories".
- Recording guidance preserved: "Optional. Tell us who you are, what your goal is, and why it matters. 15 to 60 seconds works best."
- Canonical `https://goalathletics.shop/whats-your-goal` (page metadata, sitemap, no robots rule). `/whats-your-goool` 301s there (middleware plus toml fallback); live check on 2026-10-28 returned 301 to `/whats-your-goal`.

## 6. Validation

All runs on the work branch after the edits, with `STORY_INTAKE_OPEN` unset locally (State A closed) and the Netlify production value read back as `false` before and after.

| Check | Result |
|---|---|
| Safe local inventory, 35 suites | **35 PASS / 0 FAIL** |
| Offline suites (26): core-badge-retirement, customer-service-gate, discount-popup, discount-prefix, footer-welcome, goal-brand-assets, goal-hats, goal-hoodies, goal-migration, launch-backend, meta-readiness, meta-tracking, payment-preservation (baseline `0fda828`, 18 core files match production), preview-workers, product-imagery, seo, shipment-email, st720-ga-tees, studio-galleries, v84-admin, v84-maintenance, v84-upload, v84, visible-branding (now also guards the admin markup and controller), order-email-gmail-sa, order-email-smtp | 26 pass |
| Release preview on 127.0.0.1:3184 (`.next-review`, local secrets blanked): test-v84-release (179 route/link/asset checks over 32 pages, legacy slug 301, `/whats-your-goal` canonical, no nav links to either slug), smoke-v84 (6 checks: forged owner headers rejected, admin redirects, cross-origin writes fail, story intake fails closed with "not open") | 2 pass |
| Customer-service gate preview on 127.0.0.1:3035 (store closed, PREVIEW_KEY set): smoke-customer-service, 14 read-only checks | 1 pass |
| Commerce fixture on 127.0.0.1:3040 with the loopback PostgREST fixture on 4243 and the Apliiq simulator on 4242 (fresh order stores under the session scratchpad, outside OneDrive): test-integration (62), test-fulfillment-gaps (34), test-recovery-path (9), test-launch-status (12) | 4 pass |
| Commerce-mail fixture on 127.0.0.1:3041 with the Resend stub on 4455: test-order-email (50) | 1 pass |
| Environment gate on 127.0.0.1:3042 (real Apliiq base, submissions enabled, non-production context, external fetch blocked by `network-local.cjs`): test-env-isolation with a TEST-mode event and with a live-mode event, both `left_pending_environment` | 1 pass (2 runs) |
| Excluded by rule | test-v84-cloud, test-v84-provider-routes (live Supabase mutation suites) |
| `npm run lint` | exit 0 (one pre-existing `<img>` warning in `src/v84/Admin.tsx`) |
| `npm run typecheck` | exit 0 |
| `npm run build` (optimized production build) | exit 0, "Compiled successfully"; `/whats-your-goal` and `/admin` routes present |
| `git diff --check` | clean |
| Preservation: payment-preservation against production `0fda828`; test-product-imagery, test-studio-galleries and the approved catalog fixtures | pass; no file under `public/`, `src/lib/products.ts`, `src/app/api/*`, `src/lib/*` changed |
| Browser check of the release preview (built-in browser): `/whats-your-goal` label "SUBMISSIONS OPEN SOON", zero GOOOL in rendered text, title "What's Your GOAL? · GOAL" | pass |
| Live production (read-only, 2026-10-28): 33 public routes scanned for GOOOL in text and attributes. Visible hits: `/kit-wear` consent (GOOOL Athletics LLC), `/track-order` order-reference format, `/terms` IP clause, `/participation-agreement.html` (Match Highlights, SYG live-1). Every other route, the sitemap, robots, the story agreement and all ten live product pages: zero | recorded in section 2e |

No live Supabase mutation suite ran. No real email, checkout, supplier submission or intake request was made. All fixture servers were stopped afterwards and the scratch dist directories removed.

Files changed on the branch:

- `src/v84/admin-controller.js` (one label string)
- `scripts/test-visible-branding.cjs` (admin text guard, 6 lines)
- `docs/v84/WHATS_YOUR_GOAL_PRE_STATE_B_CLEANUP_2026-10-28.md` (this report)

## 7. Freeze confirmations

- GOAL BRAND POSITIONING UNCHANGED (hero, home, landing and shop copy untouched).
- CAMPAIGN SECURITY UNCHANGED (`server.ts`, `auth.ts`, `admin.ts`, `upload-client.js`, maintenance function, RLS and bucket untouched).
- VIDEO/STORAGE ARCHITECTURE UNCHANGED.
- IMAGERY UNCHANGED (no file under `public/` changed).
- LAYOUT UNCHANGED (no CSS, markup structure or component change; the admin edit is one label string).
- CATALOG UNCHANGED (`src/lib/products.ts` untouched).
- COMMERCE UNCHANGED (checkout, Stripe, discount, orders, emails untouched; payment preservation suite passes against production `0fda828`).
- SUPPLIER INTEGRATIONS UNCHANGED (Apliiq, Tapstitch, Printful files untouched).
- `STORY_INTAKE_OPEN=false` before and after; no live intake request, no production submission, no Netlify change.

## 8. Remaining State B blockers

1. OWNER LEGAL ENTITY CONFIRMATION REQUIRED BEFORE STATE B (section 3), then consent live-4.
2. Owner decisions on the five public legal/Stripe strings in section 2e (Kit Wear consent is the one that collects public data today under "GOOOL Athletics LLC").
3. State B activation itself: `STORY_INTAKE_OPEN=true` in Netlify, redeploy, one controlled real submission, end-to-end check of video, consent snapshot and owner alert, then delete the test submission. Separate authorisation.

Deployment status: **NOT DEPLOYED.** Branch `claude/pre-state-b-cleanup` holds the change locally; nothing pushed, nothing merged, no Netlify or Supabase change.
