# GOAL Athletics Heritage Hoodie: four Apliiq designs, catalog row gated (2026-10-22)

Owner request on 2026-10-22: put the four Heritage Hoodie colourways on
the site. The only source in hand is a screenshot of the Apliiq
saved-designs list (`apliiq-saved-designs-2026-10-22.png`, cropped to the
table). This session ran in a cloud container with no browser on the
owner's Apliiq login, so nothing below the list was read.

## What the list shows

| Apliiq name | Blank | Sizes | Artworks |
|---|---|---|---|
| goal athletics heritage hoodie · black | ind4000 / independent trading co | 9 (xs-5xl) | hidden by the edit menu in the screenshot |
| goal athletics heritage hoodie · grey heather | ind4000 / independent trading co | 9 (xs-5xl) | 2 |
| goal athletics heritage hoodie · bone | ind4000 / independent trading co | 9 (xs-5xl) | 2 |
| goal athletics heritage hoodie · navy | ind4000 / independent trading co | 9 (xs-5xl) | 2 |

Thumbnails: the Black row shows the front with the GA monogram (white G,
red strike) centred on the chest; the other three rows show the garment
from the side with a small GA monogram on the sleeve just above the cuff.
Which sleeve, and the print sizes, are to be confirmed on each design
page. Garment body sampled from the Navy thumbnail: `#1E243A` (the site
swatch). Black, Grey Heather and Bone reuse the hexes the Core Hoodie rows
settled on for this blank.

## What is NOT in hand

- The four design ids (only on each design's page URL,
  `https://www.apliiq.com/product/<id>/...`).
- The five per-size SKUs per design (`APQ-<id>S6A1` S, `S7A1` M, `S8A1` L,
  `S1A1` XL, `S2A1` XXL), from the "color offered" section of each page.
- Renders or product shots for `public/products/`.
- Print sizes and positions, hi-res link status, activity log.

The retail price is set: $78, owner decision 2026-10-22 (the Core Hoodie
price on this blank).

## What was applied in the repo

- `src/lib/products.ts`: row `80000000-0000-4000-8000-000000000014`,
  slug `goal-athletics-heritage-hoodie`, category `hoodie`, blank
  `IND4000`, four colourways in the list's order (Black, Grey Heather,
  Bone, Navy), `priceCents: 7800`. Gated two ways, one per missing input:
  `isActive: false` while the galleries are empty, every colourway
  `comingSoon: true` while `fulfillment.ts` has no entry. Fabric, fit,
  care and origin carried over from the Core Hoodie rows (same blank).
- `src/lib/fulfillment.ts`: comment block only; no ids are recorded until
  read off the design pages, so `resolveApliiqSku` returns null and
  checkout refuses every colourway.
- `src/lib/size-charts.ts`: the row reads the IND4000 chart.
- `src/v84/catalog-data.ts`: assigned to the men's audience, so it lists
  on `/men` and `/shop` the moment it is activated.
- `supabase/migrations/0041_heritage_hoodie.sql`: catalog row for the
  audit trail (hidden, not for sale, $78). Not yet applied.
- `scripts/test-heritage-hoodie.cjs`: holds the gates and runs the real
  checkout route against every colourway and size, as shipped and with
  the flags forced on; all refused before Stripe.

Nothing is visible on goool.shop from this change, and nothing was
deployed.

## To publish

1. Open each of the four design pages on the owner's Apliiq login; copy
   the URL (the id) and the "color offered" section (the SKUs).
2. Download each design's renders (front, back, sleeve detail) or shoot
   product fronts; file them here under `site-images/` and copy to
   `public/products/` as `goal-heritage-hoodie-<colour>-<view>-<date>.webp`,
   then fill the `images` arrays and remove `isActive: false`. Add the
   new paths to `isPublic` in `src/middleware.ts` (the renovation gate
   lets Next image optimization fetch only allowlisted product files) and
   record them in `docs/catalog/`.
3. Add the four entries to `fulfillment.ts` and remove `comingSoon`.
4. Set `availableForSale: true`; update and run migration 0041 in the
   Supabase SQL editor.
5. `node scripts/test-heritage-hoodie.cjs` must still pass (it flips to
   expecting a 200 from checkout once every input is in).
