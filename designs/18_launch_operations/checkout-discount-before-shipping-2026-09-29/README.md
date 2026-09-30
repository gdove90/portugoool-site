# Checkout: discount before shipping (2026-09-29)

Branch `checkout/discount-before-shipping`. Built and verified in Stripe
TEST mode against a local build. NOT deployed. Production keeps the old
flow until the owner says deploy.

## Problem

The live checkout computed shipping on the pre-discount subtotal and let
Stripe's own promotion-code box apply GOOOL20 afterwards. A $70 cart
(tee + cap) got free shipping, then the code took it to $56. Rule now:
free shipping only when the subtotal AFTER the discount is $70 or more.

## Audit findings (before the change)

- Code entry: Stripe Checkout's box (`allow_promotion_codes: true` in
  `src/app/api/checkout/route.ts`). The site had no code field.
- Codes: Stripe promotion codes `GOOOL20-XXXX` on one shared 20% "once"
  coupon, issued per sign-up by `src/lib/discount.ts` (max_redemptions 1,
  `restrictions.first_time_transaction`, `metadata.email_hash`, expiry).
  A Supabase `discount_codes` ledger mirrors them; the webhook marks
  `redeemed_at`. The task text says 14-day expiry; the code issues 30 days
  (`CODE_DAYS = 30`). Not changed in this task.
- Shipping: `shippingCentsFor(subtotalCents)` in `src/lib/shipping.ts`,
  passed inline as `shipping_rate_data`. Constants untouched.
- Failure path: Stripe applied the code after our shipping line was fixed,
  so the free-shipping decision never saw the discount.

## The one code path that now decides shipping

`POST /api/checkout` is the only place. Order of operations:

1. Build line items from server-side prices (unchanged).
2. If a code is present: `validatePromotionCode(stripe, code, email)` in
   `src/lib/discount.ts` (the single validation function): format, Stripe
   lookup, email hash match, expiry, redemptions, active, coupon valid,
   ledger `redeemed_at`. Any failure returns 400 with a cart message and
   no session is created.
3. `discountCents = round(subtotal * percentOff / 100)`.
4. `shippingCents = shippingCentsFor(subtotalCents - discountCents)`.
5. `preview: true` returns the four numbers; otherwise the session is
   created with `discounts: [{ promotion_code }]` and `customer_email`.
   `allow_promotion_codes` is gone, so Stripe's box is off and nothing
   can change the subtotal after the shipping decision.

The cart (`src/app/cart/page.tsx`) has an Email field and, below it, a
Promotion code field with Apply. Apply calls the same route in preview
mode and shows Subtotal, Discount, Shipping, Total. The cart re-prices
through the same call whenever quantities change while a code is applied,
and Checkout sends the email and applied code to the same route.

## Verification (Stripe test mode, local build on :3001)

`node scripts/verify-discount-shipping.mjs http://localhost:3001 <codes.json>`
posts each cart, then reads the created session back from Stripe.
Results: `verify-results-api.json` (13/13). Sessions read back:

| Case | Subtotal | Discount | Shipping | Total | Session |
|---|---|---|---|---|---|
| 1 tee + cap, no code | 70.00 | 0 | 0 (Free) | 70.00 | cs_test_b1iTJr… |
| 2 tee + cap + GOOOL20 | 70.00 | 14.00 | 6.95 | 62.95 | cs_test_b16Z07… |
| 3 hoodie + tee + GOOOL20 | 116.00 | 23.20 | 0 (Free) | 92.80 | cs_test_b1pGDZ… |
| 4 tee + GOOOL20 | 38.00 | 7.60 | 6.95 | 37.35 | cs_test_a1HtOQ… |
| 7 tee, no code | 38.00 | 0 | 6.95 | 44.95 | cs_test_a1OQBB… |
| 7 hoodie, no code | 78.00 | 0 | 0 (Free) | 78.00 | cs_test_a15V3H… |
| 7 cap, no code | 32.00 | 0 | 6.95 | 38.95 | cs_test_a1MmWn… |

Every session: `allow_promotion_codes` null (box off), `livemode` false;
cases 2 to 4 carry `discounts[0].promotion_code` and the shipping line.

Rejections (400, no session): expired code, used code (GOOOL20-TNGF,
redeemed by a completed 4242 test payment, session paid $62.95), wrong
email, unknown code, bad format, code without email.

Screenshots (built-in browser, mobile viewport):

- `case2-cart-tee-cap-code-62.95.jpg`, `case2-stripe-checkout-62.95.jpg`,
  `case2-stripe-details-70-minus-14-plus-6.95.jpg` (no promo box on Stripe)
- `case3-cart-hoodie-tee-code-92.80-free.jpg`
- `case4-cart-tee-code-37.35.jpg` (re-priced live after removing the hoodie)
- `case1-cart-tee-cap-no-code-70-free.jpg`
- `case5-expired-code-rejected.jpg`, `case5-used-code-rejected.jpg`,
  `case5-wrong-email-rejected.jpg`

Existing suite `node scripts/test-launch-backend.cjs`: all pass on the
branch (83 sellable variants, malformed carts, discount reconciliation).

## Not verifiable here

- The Supabase ledger check (`redeemed_at`) needs database credentials
  the local machine does not have; the Stripe redemption check covers the
  same case and was exercised.
- The live webhook still reads `session.discounts[0].promotion_code`
  (unchanged), so ledger marking works the same for codes attached at
  creation, but this was not run against live.
- Local `NEXT_PUBLIC_SITE_URL` points at :3000, so the test success
  redirect went to a dead port. Production env is untouched.

## Expiry change (same day, before deploy)

Owner decision: GOOOL20 codes expire 14 days from sign-up, not 30.
`CODE_DAYS` in `src/lib/discount.ts` is the one place; Stripe
`expires_at` and the ledger `expires_at` are written from that same value.
Existing codes keep their expiry. Copy updated: the code email
(`src/lib/emails/discount-code.ts`, text and HTML footer) now says
"Valid for 14 days from issue". The popup and cart state no window.
New suite test: a code issued today carries now + 14 d in both Stripe and
the ledger, is rejected at day 15 and accepted at day 13 (mocked clock).
Suite 25/25, API verification 13/13 after the change.

## Deployed 2026-09-29 (Netlify deploy 6abc4fd0), close-out without a live payment

Live checks done: production cart shows the code field below the email
field; tee + cap $70 free; single tee $44.95; live code GOOOL20-PXAH
(issued to the owner, expires Oct 13 = 14 days) gave $70 - $14 + $6.95 =
$62.95 in the cart and on the live Stripe Checkout page with no promotion
code box (`live-stripe-checkout-62.95-no-code-box.jpg`). The payment was
not made (no card available). The staged live session
cs_live_b1hxgn9I... could not be expired from this machine: the live
secret key exists only in Netlify (masked, `netlify dev:exec` injects
"********" for secrets) and Stripe's dashboard Shell is read-only in live
mode. It lapses on its own 24 hours after creation, about 00:05 UTC on
2026-10-01. GOOOL20-PXAH reads 0/1 redemptions in Stripe and
redeemed_at NULL in the ledger; it expires Oct 13.

Production proof from real orders (read-only SQL, 2026-09-29): the two
live codes redeemed on the Sep 28 test orders, GOOOL20-3L55 and
GOOOL20-AFYG, carry `redeemed_at` 2026-09-29 02:58 and 03:00 UTC in
`discount_codes`, so the production webhook does mark the ledger. The
matching `orders` rows store `amount_shipping_cents` 950 and
`amount_discount_cents` 1560 / 960 with totals 7190 / 4790 that reconcile
(subtotal - discount + shipping), so both columns are populated by the
live handler. The session shape the new flow produces (`discounts[0]
.promotion_code`, `total_details`) is identical to what those orders had.

Webhook proof without money: `scripts/test-launch-backend.cjs` replays
the exact shape of the paid TEST session cs_test_b1D0wV... (discounts[0]
.promotion_code string, total_details discount 1400 / shipping 695)
through the production handler: the order row stores total 6295, subtotal
7000, shipping 695, discount 1400, and the real markRedeemed sets
redeemed_at and redeemed_session_id on the ledger row. The real database
write could not run on this machine: it needs SUPABASE_SERVICE_ROLE_KEY
and NEXT_PUBLIC_SUPABASE_URL, which live only in Netlify.

**Check on the first real production order that uses a GOOOL20 code:**
1. `discount_codes` row for that code has `redeemed_at` and
   `redeemed_session_id` set (webhook marked the ledger).
2. `orders` row for that session has `amount_shipping_cents` and
   `amount_discount_cents` matching the Stripe session (695 and the 20%
   of the subtotal when the discounted subtotal is under $70; 0 shipping
   at $70 or more after the discount).

## Rollback

`git checkout main` and redeploy main (the branch is not merged); or, if
merged, `git revert` the single branch commit.
