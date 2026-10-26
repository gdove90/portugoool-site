# GOAL Athletics Core Quarter Zip on Tapstitch — 2026-10-26

Owner instruction 2026-10-26: the men's quarter zip in three colours
(Black, White, Dark Gray), no size above 2XL on the site, Tapstitch
connected to the store as far as it can be, and the order flow written down.

## Blank and designs

Tapstitch **Men's Quarter-Zip Training T-Shirt, MT0063-P001-V2**
(230 gsm performance knit, S to 4XL offered; the site sells S to XXL).
Unit cost $12.99 blank + $2.99 front DTF = **$15.98**, plus Tapstitch's
shipping at checkout (about $5 for one piece to the US).

| Colour | Tapstitch design | Mark | Placement |
|---|---|---|---|
| Black | 1564299910617194496 (built earlier on 2026-10-26, owner-directed) | V1.3 horizontal lockup, white/red, **5.50 x 1.47 in** (was 4.00 x 1.07) | wearer's left chest: level with the bottom of the zip placket, about half an inch clear of the zip |
| White | 1564523403115982848 | lockup black/red, 5.50 x 1.47 in | same, matched to the Black design on the canvas |
| Dark Gray | 1564524205054324736 | lockup white/red, 5.50 x 1.47 in | same |

Built from the product page ("Design Now" per colour gives a fresh design
id; "Edit design" on an existing one keeps its id). Artwork: the V1.3
lockup PNGs from `designs/62_tempo-collection-proofs-2026-10-26/print/smallest-2026-10-26/`
(1800 x 480 px, 450 ppi at 4 in). Mockups in `tapstitch-mockups/`, framed
on the studio backdrop in `site-images/` and copied to
`public/products/goal-core-quarter-zip-*`.

**2 mm rule (owner, later on 2026-10-26):** the owner's size brief measured
the lockup's thinnest gaps at 2.20 mm at 6.00 in wide, so the 4.00 in crest
first built here came to about 1.47 mm, under the 2 mm DTF rule the house
holds Apliiq to. Tapstitch's own minimum is unconfirmed, and the owner
chose to keep the 2 mm rule regardless: all three designs were resized in
place (ids unchanged) to **5.50 x 1.47 in**, the smallest width that keeps
every gap at 2.00 mm or more (6.00 x 2.00 / 2.20 = 5.45 in, rounded up),
and re-placed. At 5.50 in the lockup only fits the chest panel if its left
edge sits about 0.3 in from the zip tape (the first 5.50 in placement, half
an inch clear, ran into the raglan sleeve seam and the mockup clipped
"GOAL" to "GOA"); the final position keeps the right edge just inside the
body panel at placket-bottom height. The lockup PNG is 1800 px wide,
327 ppi at 5.50 in. Mockups `*-5.5in-v2-*.png` are the saved state.

## Site

Row `80000000-0000-4000-8000-000000000023` "GOAL Athletics Core Quarter
Zip", slug `goal-athletics-core-quarter-zip`, men's audience, category
`pullover`, supplier `tapstitch`, sizes S to XXL, **$48** (25% model floor
$41 on $15.98 + $5 shipping; model price, not owner-set), disclosure
"Ships from our overseas partner: allow 10 to 17 days." Size-guide tab
`quarter-zip` (note; no flat chart published yet). Migration 0047 applied.

## How a Tapstitch order works (print on demand, no API)

Tapstitch has **no public order API and no connector for a custom
storefront** (its integrations are Shopify, Etsy, Wix and its own hosted
store). The site therefore handles a Tapstitch line like this:

1. **Checkout.** The customer pays on goalathletics.shop through Stripe as
   usual. The line carries sku `TAP-<designId>-<SIZE>` (fulfillment.ts).
2. **Webhook.** The Stripe webhook records the order and its items. The
   submitter (`fulfillment-submit.ts`) splits the items: Apliiq lines go to
   Apliiq automatically; Tapstitch lines are **mailed to the owner** as a
   `tapstitch_manual` alert listing design id, colour, size, quantity and
   the ship-to address. An order with only Tapstitch lines is parked as
   `not_submitted` / `manual_tapstitch` so nothing retries it.
3. **Place the order by hand.** On tapstitch.com, Designs, find the design
   id from the email, "Add to cart", choose the size and quantity, enter
   the customer's shipping address at checkout, pay with the company card
   (Tapstitch charges the $15.98 unit cost plus shipping; it ships from its
   international fulfilment centre, 10 to 17 days). The customer never
   hears from Tapstitch; the email channels stay the site's own.
4. **Tell the customer it shipped.** When Tapstitch shows tracking, run the
   ops action and the site sends the normal shipping email:

   ```bash
   curl -X POST https://goalathletics.shop/api/fulfillment-ops -H "x-ops-key: $FULFILLMENT_OPS_KEY" -H "Content-Type: application/json" -d '{"action":"manual-shipped","orderId":"<order id from the alert>","carrier":"<carrier>","trackingNumbers":["<number>"],"trackingUrls":["https://..."]}'
   ```

   It stores the shipment, queues the customer's shipping email (same
   template and dedupe as Apliiq's callbacks) and marks the order shipped.
5. **Mixed orders** (Apliiq + Tapstitch lines) ship in two parcels: Apliiq's
   part goes automatically and emails on its own callback; the Tapstitch
   part follows steps 3 and 4.

The alternative that would make Tapstitch "connected" is a Shopify store
fed by Tapstitch's Shopify app, which this site does not use.
