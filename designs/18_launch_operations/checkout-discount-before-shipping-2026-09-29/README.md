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

## Rollback

`git checkout main` and redeploy main (the branch is not merged); or, if
merged, `git revert` the single branch commit.
