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
page. The Navy site swatch, `#2A3043`, is the garment body sampled from
Apliiq's larger grid thumbnail of the Lockup Hoodie (same blank, same
colour); it was `#1E243A` from this list's tile until 2026-10-22, later
the same day. Black, Grey Heather and Bone reuse the hexes the Core Hoodie rows
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
- `scripts/test-goal-hoodies.cjs`: holds the gates and runs the real
  checkout route against every colourway and size, as shipped and with
  the flags forced on; all refused before Stripe.

Nothing is visible on goool.shop from this change, and nothing was
deployed.

## Published 2026-10-22 (owner: all four lockup and heritage hoodies uploaded)

Read off each design's own page on the owner's Apliiq login:

| Colourway | Design | Ink | SKUs S / M / L / XL / XXL |
|---|---|---|---|
| Black | 6210750 | white and red | APQ-6210750S6A1 / S7A1 / S8A1 / S1A1 / S2A1 |
| Grey Heather | 6210742 | black and red | APQ-6210742S6A1 / S7A1 / S8A1 / S1A1 / S2A1 |
| Bone | 6210734 | black and red | APQ-6210734S6A1 / S7A1 / S8A1 / S1A1 / S2A1 |
| Navy | 6210732 | cream | APQ-6210732S6A1 / S7A1 / S8A1 / S1A1 / S2A1 |

- Two transfers on every design:
  - Front: GA monogram 4.00 x 3.61 in (`ga-chest_<ink>_4-00in`), centred on
    centre front, top of art 3.00 in (76.2 mm) below the hood seam.
  - Sleeve: GA monogram 2.00 x 1.80 in (`ga-sleeve_<ink>_2-00in`), outer
    left sleeve, upright, bottom of art 3.00 in above the cuff seam.
  - Each placement carries a "do not scale" note. The private label sb-6
    sits inside the neck (activity log 2026-10-15).
- Not mapped: an older "goal athletics heritage hoodie · grey heather",
  design 6206395 (chest `ga-leftchest` 3.50 x 3.15 in, sleeve 3.00 x 2.70 in),
  is still on the saved-designs list. It is a superseded draft; renaming it
  "delete" is the owner's call.
- Renders: Apliiq's own front (template 6399) and sleeve-side (5947) render
  of each design are kept unchanged in `as-received/`. Black's exist only at
  590 x 900; the others are 944 x 1440. The Black design also carries two
  override images uploaded on Apliiq on 2026-10-16. They show a larger sleeve
  mark than the saved 2.00 in placement, so they are filed but not used.
  The white was replaced by the studio backdrop at 2:3 with
  `scripts/studio-backdrop-product-shot.py`. Grey Heather and Bone take their
  mask from the Navy render of the same template, with `--erode 3` on the
  front and `--erode 6` on the side view, because that template rim-lights
  the garment edge brighter than the backdrop. Results are in
  `site-images/` and `public/products/` as
  `goal-heritage-hoodie-<colour>-catalog-product-{front,sleeve}-20261022.webp`,
  recorded in `docs/catalog/goal-heritage-hoodie-product-20261022.json`.
- Site: the ids and SKUs are in `src/lib/fulfillment.ts`, every gallery
  shows front then sleeve ("Concept render" caption), `comingSoon` is
  removed, and the row is `isActive` and `availableForSale` at $78. The
  paths are allowlisted in `src/middleware.ts`. `node
  scripts/test-goal-hoodies.cjs` passes, with every colourway and size
  opening a session that carries its own SKU. Migration 0041 is updated to
  active and for sale. It has not been run; the order store upserts the row
  before any order item.
- Still open: the owner's model pictures, a physical sample, and the hi-res
  link status on each placement (not read).

### Grey Heather photos (later on 2026-10-22)

The owner supplied a product shot and three model photos for Grey Heather
("yes these are the heritage hoodies").
- Originals are kept unchanged in `as-received-owner/`.
- Each photo was framed 2:3 with `scripts/frame-model-photo-2x3.py`: the
  product shot gained backdrop above and below, the model photos at the sides.
  Every seam measured under one level.
- The gallery order is now: product shot, model front, model quarter left,
  model quarter right, then Apliiq's sleeve-side render.
- The product shot replaced the Apliiq front render at the same path, with
  cache revision `grey-heather-front-photo-20261022`. The render moved to
  `retired-render/`.
- Record: `docs/catalog/goal-heritage-hoodie-grey-heather-photos-20261022.json`.
- Black followed the same afternoon in the same order and the same way.
  Its product shot was 1199 x 1312, extended above and below to 1199 x 1798.
  The three model photos were 510 x 1024, extended at the sides to 683 x 1024.
  Every seam measured under one level. Cache revision
  `black-front-photo-20261022`. Record:
  `docs/catalog/goal-heritage-hoodie-black-photos-20261022.json`. Black is the
  card default, so its product shot is now the collection card.
- Navy followed in the same order: four 1122 x 1402 photos, each extended
  above and below to 1122 x 1683 (seams 0.31 to 0.52). Cache revision
  `navy-front-photo-20261022`. Record:
  `docs/catalog/goal-heritage-hoodie-navy-photos-20261022.json`.
- Bone still shows Apliiq's renders until its photos land.

## Original publish checklist

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
5. `node scripts/test-goal-hoodies.cjs` must still pass (it flips to
   expecting a 200 from checkout once every input is in).
