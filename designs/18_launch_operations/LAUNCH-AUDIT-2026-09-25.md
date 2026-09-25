# Launch audit — 2026-09-25 (~03:10 ET), Core Capsule launch day

Measured on goool.shop (published deploy `6ab61ca9`, built from local main
`8817e56`) through the preview gate, plus the production Netlify
environment (variable names only) and a catalogue/SKU audit of main.
Supersedes LAUNCH-AUDIT-2026-09-24.md.

## Since the last audit

| 2026-09-24 blocker | Now |
|---|---|
| 1 Netlify deploys blocked (credits) | **Cleared.** Credits reset; five production deploys shipped today (launch build `6ab603d6`, hoodie imagery `6ab60c34`/`6ab60fb6`, Modern Sport v3 `6ab6173f`, Club Blue backdrop `6ab61ca9`). |
| 2 Apliiq not wired in production | **Still open.** Production env has `APLIIQ_ALLOW_LIVE` but no `APLIIQ_APP_ID`, `APLIIQ_SHARED_SECRET`, `APLIIQ_SUBMIT_ENABLED`. A paid order parks as pending and nothing reaches the supplier. |
| 3 No confirmation email | **Still open.** No `GOOGLE_SA_*`, `SMTP_*` or `RESEND_API_KEY` in production. Stripe's own receipt still goes out. |
| 4 Gate is up | **Still up**, owner's call. `/`, `/shop`, `robots.txt`, `sitemap.xml` all 307 to `/gate`. |

## Blockers, in order

| # | Blocker | Evidence | Owner action |
|---|---|---|---|
| 1 | **Apliiq credentials absent from production** | env list: `APLIIQ_ALLOW_LIVE` only. `submitPaidOrder` cannot run. | Set `APLIIQ_APP_ID`, `APLIIQ_SHARED_SECRET`, `APLIIQ_SUBMIT_ENABLED=true` in the production context, redeploy, then place one real order on the cheapest item and watch it reach `submitted` (runbook: designs/11_fulfillment/apliiq-product-mapping.md step 3). Do not open the gate before this. |
| 2 | **No physical sample or supplier proof for any launch piece** | Unchanged since 2026-09-21; today's Modern Sport v3 lettering is artwork-compliant only. | Owner decision: order samples (cheapest first) or accept launching on supplier renders with the "concept render" captions as they stand. |
| 3 | **Sewn tag not implemented** | Owner requires the approved sewn tag; no label service, supply id or proof exists. | Owner decision: launch without the tag for the first orders, or hold. |
| 4 | **Confirmation email disabled** | `sendEmail` reports disabled in production. | Configure the Gmail service account (`scripts/test-order-email-gmail-sa.mjs`), redeploy. Survivable for launch; Stripe receipts cover proof of charge. |
| 5 | **Supabase migrations 0034 and 0035 unapplied** (audit trail only) | Files exist; not run in the SQL editor. The order store upserts catalogue rows itself, so orders still record. | Run both in the SQL editor when convenient. |
| 6 | ~~Gate~~ | **Opened by owner decision 2026-09-25 ~03:20 ET**, before #1 was resolved (owner informed). `PREVIEW_KEY` unset in the production context; deploy `6ab6284e`. `/`, `/shop`, all product pages, `robots.txt` and `sitemap.xml` return 200 publicly; portugoool.com and www 301 to goool.shop. | Next: add goool.shop to Google Search Console (Domain property, DNS TXT in Netlify DNS), submit the sitemap, request indexing for `/` and `/shop`. |

## What passed today

**Production, through the gate**

| Probe | Result |
|---|---|
| Every page: `/`, `/shop`, `/cart`, `/about`, `/faq`, `/contact`, `/track-order`, `/terms`, `/privacy`, `/refunds`, `/success` | 200 |
| All nine product pages | 200 |
| Retired URLs (varsity, circular badge, circular crewneck, minimal club) | 301 → `/shop` (now live; was local-only on 09-24) |
| `POST /api/checkout` empty | 400 `Invalid cart.` |
| `POST /api/checkout` Performance Badge Tee · Black · M | 200, **`cs_live_…`** session; hosted page renders $48 + $9.50 shipping = $57.50 |
| `POST /api/stripe-webhook` unsigned | 400 `Missing signature.` |
| `POST /api/track-order` bad body | 400 validation |
| `/api/apliiq-fulfillment` GET | 405 (route alive, POST-only) |
| Public surface without cookie | everything 307 → `/gate`; gate page `noindex` |

**Catalogue (main `8817e56`)**

| Check | Result |
|---|---|
| Active rows | 9, all `availableForSale`, all priced ($48 tees/caps, $78 hoodies), none sold out |
| Colour × size rows | 78; **0 unmapped**; 18 Apliiq designs referenced |
| Imagery | Core Hoodie: all six owner renders in place (Bone·Red and Grey Heather·Red replaced today); Club Blue six on the #F2F2F2 backdrop standard; Modern Sport Performance on V3 renders with the corrected print |
| Print artwork | Modern Sport Performance ATHLETICS rebuilt to Apliiq's 2 mm DTF minimum and linked on designs 6112037/6113361 (designs/26). Other preflight failures belong to retired products. |

**Repo**: local main is 4 commits ahead of `origin/main` (imagery, Modern Sport rebuild, backdrop). Push when ready; GitHub CI builds do not deploy here.

## Not verified today

- Stripe account activation/payout status beyond "live-mode sessions are created and render". A real paid order is the only full test and needs the owner.
- Landed cost per product (shipping, tag, DTF) versus the 25% model; unchanged since PRICING-25-PERCENT.md.
- Instagram assets/copy: drafts only, not reviewed here.
