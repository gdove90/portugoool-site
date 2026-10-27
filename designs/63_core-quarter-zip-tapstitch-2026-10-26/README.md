# GOAL Athletics Core Quarter Zip on Tapstitch — 2026-10-26

Owner instruction 2026-10-26: the men's quarter zip in three colours
(Black, White, Dark Gray), no size above 2XL on the site, Tapstitch
connected to the store as far as it can be, and the order flow written down.

## Blank and designs

Tapstitch **Men's Quarter-Zip Training T-Shirt, MT0063-P001-V2**
(230 gsm performance knit, S to 4XL offered; the site sells S to XXL).
Unit cost $12.99 blank + $2.99 front DTF = **$15.98**, plus Tapstitch's
shipping at checkout (about $5 for one piece to the US). A back print
would add $2.99 (seen in the designer) and is not used.

| Colour | Tapstitch design | Mark (final, 2026-10-26 evening) | Placement |
|---|---|---|---|
| Black | 1564299910617194496 | V1.3 GA monogram, white/red, 2.00 x 1.80 in | wearer's left chest beside the zip: GA centre about 1.5 in right of the zipper line, level with the bottom of the zip placket; back blank |
| White | 1564523403115982848 | GA monogram, all black (owner), 2.00 x 1.80 in | same; measured on the mockups the three centres agree within 2 px (about 0.06 in) |
| Dark Gray | 1564524205054324736 | GA monogram, all black (owner), 2.00 x 1.80 in | same |

Design ids never changed: every revision was made with "Edit design" and
"Save Design" on the same three designs.

### How the mark got here (all on 2026-10-26)

1. Built with the V1.3 horizontal lockup 4.00 x 1.07 in in the crest spot
   (the owner's earlier direction for this piece).
2. **2 mm rule:** the owner's size brief measured the lockup's thinnest gaps
   at 2.20 mm at 6.00 in wide, so 4.00 in came to about 1.47 mm, under the
   2 mm DTF rule the house holds Apliiq to. Tapstitch's own minimum is
   unconfirmed and the owner chose to keep the 2 mm rule regardless, so the
   lockup went to 5.50 x 1.47 in (the smallest width that keeps every gap at
   2.00 mm or more).
3. At 5.50 in the lockup did not fit the chest spot uncropped: half an inch
   clear of the zip it ran into the raglan sleeve seam; tight to the zip the
   mockup still clipped the G. The owner wanted the mark to stay on the
   chest where it was, so the lockup was dropped in favour of the
   **GA monogram alone at 2.00 x 1.80 in** (gap 2.35 mm), which fits the
   crest spot with room on both sides. A stacked lockup on the back was
   considered for a few minutes and withdrawn: **front only**.
4. Inks: white/red on Black; **all black on White and Dark Gray** (owner).
   Print files in `print/`: `GOAL_GA_04_White_Red_2.00in_300dpi.png`,
   `GOAL_GA_01_Solid_Black_2.00in_300dpi.png` (the vertical lockup exports
   there are unused). Mockups `quarter-zip-<colour>-ga-<id>.png` are the
   saved state; earlier lockup mockups were removed.

## Site

Row `80000000-0000-4000-8000-000000000023` "GOAL Athletics Core Quarter
Zip", slug `goal-athletics-core-quarter-zip`, men's audience, category
`pullover`, supplier `tapstitch`, sizes S to XXL, **$36 (owner decision
2026-10-26, "final offer"; $32 for an hour before that; the 25% model
floor was $41 and the first listing price $48)**, disclosure
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

## Owner model photos, Black, 2026-10-26

Three photos supplied by the owner (941 x 1672 each; `owner-photos/`),
brought to the 2:3 catalog frame with `scripts/frame-model-photo-2x3.py`
and added after the product front on the Black colourway and the product's
lead gallery: model front, three-quarter and rear
(`public/products/goal-core-quarter-zip-black-catalog-model-*-20261026.webp`).
Uploaded as given (owner rule 2026-10-20: never retouch or flag the sneakers).

## Owner model photos, White, 2026-10-26

Three photos (941 x 1672; `owner-photos/white-*`), framed to 2:3 the same
way and added after the White product front in the owner's order: model
front, three-quarter, rear. Uploaded as given.

## Owner model photos, Dark Gray, 2026-10-26

Three photos (941 x 1672; `owner-photos/dark-gray-*`), framed to 2:3 and
added after the Dark Gray product front: model front, three-quarter, rear.
Uploaded as given. All three colours now carry the owner's model shots.

## Owner product front, Black, 2026-10-26

The owner's own product shot (`owner-photos/black-product-front-as-received.webp`,
1024 x 1536) replaced the Tapstitch mockup at
`public/products/goal-core-quarter-zip-black-catalog-product-front-20261026.webp`
(cache revision `owner-front-20261026`). Nothing else changed.

## Owner product front, White, 2026-10-26

The owner's own product shot (`owner-photos/white-product-front-as-received.webp`,
1120 x 1440, used byte for byte at the owner's instruction) replaced the
mockup at `public/products/goal-core-quarter-zip-white-catalog-product-front-20261026.webp`
(cache revision `owner-front-20261026`). Nothing else changed.
