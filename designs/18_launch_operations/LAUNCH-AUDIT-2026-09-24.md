# Core Capsule launch audit · checkout readiness

**24 September 2026, ~18:00 UTC · for the Friday 2026-09-25 launch.**
Everything below was measured on goool.shop or run against the launch
commit (`84fbc4a`, local main, pushed to GitHub). Nothing was assumed
from an env listing alone.

## Verdict

**Checkout works on the build that is live today.** A visitor holding
the gate password can go product → cart → Stripe hosted checkout, and
Stripe renders the payment form with the right shipping countries and
the delivery notice. Payment capture, order recording and the webhook
path are configured in production.

**The build that is live is not the launch build.** Production still
serves the 06:51 UTC deploy. The hoodie remake, the three retirements
and the Core Capsule catalogue are not on the site. Netlify refuses new
production deploys until credits are added or the usage period resets.

**Two things stop a paid order from becoming a shipped garment:** the
Apliiq credentials and submit switch are absent from production, and no
email adapter is configured. Money would be captured and the order
recorded, then it would sit in `pending_submission` with no GOOOL
confirmation email.

## Blockers, in order

| # | Blocker | Evidence | Owner action |
|---|---|---|---|
| 1 | **Netlify deploys blocked** | `netlify deploy --prod` → HTTP 403 `Account credit usage exceeded - new deploys are blocked until credits are added`. Published deploy is still `6ab4c889…` from 06:51 UTC. Local `netlify build --context production` succeeds; only the upload is refused. | Add credits in Netlify billing (team Doves), or wait: the usage period resets **2026-09-25 00:00 Pacific / 03:00 Eastern**. Then run the deploy command below. |
| 2 | **Apliiq not wired in production** | Production env has `APLIIQ_ALLOW_LIVE=true` but no `APLIIQ_APP_ID`, `APLIIQ_SHARED_SECRET` or `APLIIQ_SUBMIT_ENABLED`. `submitPaidOrder` returns `left_pending_disabled` for every paid order. | Set the three variables in the **production** context, then redeploy. Runbook: `designs/11_fulfillment/apliiq-product-mapping.md` step 3. Until then, paid orders are recoverable through `/api/fulfillment-ops` once the keys exist. |
| 3 | **No confirmation email** | None of `GOOGLE_SA_EMAIL`/`GOOGLE_SA_PRIVATE_KEY`, `SMTP_USER`/`SMTP_PASS` or `RESEND_API_KEY` in production. `sendEmail` reports `disabled`. Stripe's own receipt is forced via `receipt_email`, so the buyer still gets proof of charge. | Configure the Gmail service account (`scripts/test-order-email-gmail-sa.mjs` verifies it), then redeploy. Launching without it is survivable; launching without #2 is not. |
| 4 | **Gate is up** | `PREVIEW_KEY` set in production; every page 307s to `/gate`. Only `/api/stripe-webhook`, `/api/apliiq-fulfillment`, `/print/*`, `/brand/*` answer publicly. | Owner's call. To open: `npx netlify env:unset PREVIEW_KEY --context production` and redeploy. Do not open before #1 ships the launch build, or the public sees the retired products. |

## What passed

**Live production, through the gate (cookie from `/api/preview`):**

| Probe | Result |
|---|---|
| `POST /api/checkout` empty body | 400 `Invalid cart.` (Stripe key present) |
| `POST /api/checkout` Performance Badge Tee · Black · M | 200, `cs_live_…` Checkout URL |
| Stripe hosted page | Renders: $48 + $9.50 standard shipping = $57.50; countries US/CA/GB/PT; delivery notice text; Card, Cash App Pay, Affirm, Klarna, Bank |
| `POST /api/stripe-webhook` no signature | 400 `Missing signature.` (webhook secret present) |
| `POST /api/track-order` bad body | 400 validation (route alive) |
| `/`, `/shop`, `/cart`, `/success` | 200 with cookie |
| Supabase `orders`, `order_items`, `stripe_events` | exist (anon key gets RLS-empty 200, not 404) |

**Launch commit, local:**

| Check | Result |
|---|---|
| `next build` | passes; 9 product pages, middleware 27.9 kB |
| `netlify build --context production` | passes (plugin-nextjs bundle built) |
| Catalogue audit | 9 active rows of 68; all `availableForSale`, all priced ($48 tees and caps, $78 hoodies), no sold-out, **every colour × size resolves to an Apliiq SKU**, 0 failures |
| Retired URLs | middleware 301s varsity, circular badge, circular crewneck → `/shop` (not yet live; production still 200s them) |
| Git | local main merged with GitHub's footer commit (kept the reviewed local footer), pushed as `84fbc4a`. Netlify's CI build of that push errored on credits, as expected. |

## Observed in passing

- The Stripe hosted page failed once with "We couldn't load checkout"
  on the first attempt and loaded cleanly on the second. Console showed
  no Stripe-side error for the working attempt. Treat as transient;
  watch for it on launch day.
- Supabase `products` still lists the retired rows as `is_active=true`
  and lacks the …0005 / …0006 rows (Club Blue tee, Club Blue hoodie).
  The site reads `products.ts`, and the order store upserts catalogue
  rows before writing order items, so this cannot break a purchase.
  Migrations 0034 and 0035 remain to run in the SQL editor for the audit
  trail.
- Two working-tree changes were left uncommitted on purpose:
  `scripts/go-live-stripe.mjs` (script edit, not shipped) and the
  deleted `GOOOL_STD_HOODIE_BONE_RED_FRONT.webp` in the launch folder
  (curated copy; canonical file untouched).
- A `deploy-preview` titled "credit probe" exists on Netlify from this
  audit: a static upload of `public/` used to test whether any deploy
  was accepted. It is not production and can be deleted.

## Launch-morning sequence

1. Confirm Netlify accepts deploys (credits added or period reset).
2. From the repo root:
   ```
   rm -rf .next && npx netlify deploy --prod --build
   ```
3. Verify the launch build is live:
   `curl -sI https://goool.shop/shop/goool-athletics-varsity-tee` → `301 /shop`;
   with the gate cookie, `/shop/goool-heavyweight-hoodie-blue` → 200.
4. Set `APLIIQ_APP_ID`, `APLIIQ_SHARED_SECRET`, `APLIIQ_SUBMIT_ENABLED=true`
   in the production context. Redeploy.
5. Optional but recommended: Gmail service account vars. Redeploy.
6. Open the store: unset `PREVIEW_KEY` in production. Redeploy.
7. Place one real order on the cheapest item, confirm it appears in
   Supabase `orders` as `paid` / `pending_submission` → `submitted`, and
   refund it from the Stripe dashboard (the webhook marks it `refunded`).
