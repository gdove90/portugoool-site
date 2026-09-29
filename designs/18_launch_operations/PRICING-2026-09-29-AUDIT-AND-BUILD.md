# Pricing and shipping change, 2026-09-29 (deployed 2026-09-29, deploy 6abbae78)

Owner decisions (final): tees $38, caps $32 (permanent, owner 2026-09-29), hoodie $78; flat $6.95 shipping per
order, free at $70; no compare-at prices; no new discount codes.

## Where things live
- Retail prices: `src/lib/products.ts` (`priceCents`). Cards, product pages and the
  server-side checkout (`src/app/api/checkout/route.ts`, `getProductById`) all read it.
  The Supabase `products` table only mirrors id/name/price for order-row FK parity
  (`ensureProductRows`); it is written by the site, never read for pricing.
- Apliiq does not sync prices to the site. The custom-store integration only
  submits orders. There is nothing on Apliiq's side that can overwrite retail prices.
- Shipping (before): one Stripe dashboard rate, shr_1UK1I2BG7q8OBDEmCg1LC3OB ($9.50),
  attached via `STRIPE_SHIPPING_RATE_ID` for all four countries; no free-shipping rule;
  cart said "Calculated at checkout".
- Shipping (after): `src/lib/shipping.ts` (695 cents flat, free at 7000), passed to
  Stripe inline as `shipping_rate_data`; the cart reads the same constants. The old
  rate object and env var are unused (leave or delete in Stripe/Netlify).
- Compare-at: `compareAtPriceCents` is null on every live SKU before and after.
- Discounts: GOOOL20 first-order codes (pre-existing, 2026-09-25) stay; nothing added.

## Apliiq VIP costs used
Dropship unit quotes read from each saved design's dropship dialog (2026-09-21..24)
times 0.80 (VIP flat 20%, per Apliiq help; confirmed on a real order line: hoodie
$44.43 x 0.8 = $35.54 on pending order goool-9d606faa). Plus $1.00 fulfilment per item.
US shipping from Apliiq's rate sheet (Google Sheet "Apliiq Shipping Rates 5/12/2026",
copy in APLIIQ-SHIPPING-RATES-2026-05-12.csv): <=7.9 oz $5.96, <=11.9 $6.92,
<=15.9 $8.85, <=31.9 $11.80, <=47.9 $15.65. Weight bands assumed: tee 6-8 oz,
cap 4 oz, hoodie ~24 oz (Apliiq sets variant weights; confirm on first shipments).
NOT on file: dropship quotes for the Athletics Badge Cap (6117349) and Stacked Cap
(6117282); the Touchline Cap quote ($18.88) is used as the same-construction proxy.
International Apliiq rates: attachment 2026-08-11_ShippingRates.csv on Apliiq's
international shipping help article (not pulled programmatically).

## Margin table (single item, US, Stripe 2.9% + $0.30)
See the chat report of 2026-09-29; lowest is the hoodie at ~35% (free shipping),
tees 44-60%, caps ~51%. Old prices: hoodie 47%, tees 58-71%, caps 70%.

## Verification (local dev server, Stripe TEST sessions)
- All 9 product pages show $40 / $78 / $34 with no strikethrough.
- Stripe sessions: one tee -> $6.95 "Standard shipping"; one hoodie -> $0 "Free
  shipping"; tee + cap ($74) -> $6.95. The owner's expected "tee + hat = free" does
  not hold at $75: the pair is $74. Not adjusted; owner to decide.

## Final numbers, live since 2026-09-29 (deploy 6abbae78)
Tees $38 (all four), caps $32 (all three, permanent), hoodies $78. Shipping $6.95
flat, free at $70 or more. Live Stripe sessions verified: one tee -> $6.95, tee + hat
($70) -> Free, hoodie -> Free. Margins at final prices (single item, US): Core Badge
Tee 58%, Matchday 42%, Terrace 42%, hoodie 35%, caps 48%.
