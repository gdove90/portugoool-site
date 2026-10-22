# GOAL Athletics Lockup Hoodie: four Apliiq designs, catalog row gated (2026-10-22)

Owner request on 2026-10-22, after the Heritage Hoodie
(`designs/58_heritage-hoodie-ind4000-2026-10-22/`): add the four Lockup
Hoodie colourways to the catalog; the owner will then supply the model
pictures. The only source in hand is a screenshot of the Apliiq
saved-designs grid (`apliiq-saved-designs-2026-10-22.png`, cropped to the
grid). This session ran in a cloud container with no browser on the
owner's Apliiq login, so nothing below the grid was read.

## What the grid shows

Four designs named "goal athletics lockup hoodie · grey heather / bone /
navy / black" on the Independent IND4000 (the same blank as the Heritage
and Core Hoodies). Every tile shows the front: the GA monogram and the
GOAL ATHLETICS lockup across the chest, the same lockup as the GA Big Tee.
On Black and Navy the wordmark prints white with ATHLETICS in red; on
Grey Heather and Bone it prints black with ATHLETICS in red. The back,
the print size and the artwork count are not visible and are to be
confirmed on each design page.

Swatches: Black `#1E1E1E`, Bone `#CFCAC7` and Grey Heather `#D9D9D9` reuse
the hexes the Core Hoodie rows settled on for this blank (the grid tiles
sample to `#1E1E1E`, `#CDC7C5` and `#D1D1D1`, within a few points). Navy
`#2A3043` is the garment body sampled from the Navy tile; the Heritage
row's Navy swatch was moved to the same value so the two rows match.

## What is NOT in hand

- The four design ids (only on each design's page URL,
  `https://www.apliiq.com/product/<id>/...`).
- The five per-size SKUs per design (`APQ-<id>S6A1` S, `S7A1` M, `S8A1` L,
  `S1A1` XL, `S2A1` XXL), from the "color offered" section of each page.
- The model pictures (owner, to follow) or renders for `public/products/`.
- Print sizes and positions, hi-res link status, activity log.

The retail price is set: $78, the owner's hoodie price (2026-10-22).

## What was applied in the repo

- `src/lib/products.ts`: row `80000000-0000-4000-8000-000000000015`,
  slug `goal-athletics-lockup-hoodie`, category `hoodie`, blank
  `IND4000`, four colourways in the Heritage row's order (Black, Grey
  Heather, Bone, Navy), `priceCents: 7800`. Gated two ways, one per
  missing input: `isActive: false` while the galleries are empty, every
  colourway `comingSoon: true` while `fulfillment.ts` has no entry.
  Fabric, fit, care and origin carried over from the Core Hoodie rows.
- `src/lib/fulfillment.ts`: comment block only; no ids are recorded until
  read off the design pages, so `resolveApliiqSku` returns null and
  checkout refuses every colourway.
- `src/lib/size-charts.ts`: the row reads the IND4000 chart.
- `src/v84/catalog-data.ts`: assigned to the men's audience, so it lists
  on `/men` and `/shop` the moment it is activated.
- `supabase/migrations/0042_lockup_hoodie.sql`: catalog row for the audit
  trail (hidden, not for sale, $78). Not yet applied.
- `scripts/test-goal-hoodies.cjs` (renamed from `test-heritage-hoodie.cjs`)
  now covers both hoodie rows: it holds the gates and runs the real
  checkout route against every colourway and size, as shipped and with
  the flags forced on; all refused before Stripe.

Nothing is visible on goool.shop from this change, and nothing was
deployed.

## Published 2026-10-22 (owner: "upload these four lockup hoodies to the website")

Read off each design's own page on the owner's Apliiq login:

| Colourway | Design | Front file (10.00 x 2.67 in) | SKUs S / M / L / XL / XXL |
|---|---|---|---|
| Black | 6206733 | lockup-front_whitered_10-00in | APQ-6206733S6A1 / S7A1 / S8A1 / S1A1 / S2A1 |
| Grey Heather | 6206746 | lockup-front_blackred_10-00in | APQ-6206746S6A1 / S7A1 / S8A1 / S1A1 / S2A1 |
| Bone | 6206741 | lockup-front_blackred_10-00in | APQ-6206741S6A1 / S7A1 / S8A1 / S1A1 / S2A1 |
| Navy | 6206737 | lockup-front_cream_10-00in | APQ-6206737S6A1 / S7A1 / S8A1 / S1A1 / S2A1 |

- Every design has one transfer (artwork count 1, no back print). It is
  centred on centre front, with the top of the art 3.00 in (76.2 mm) below
  the hood seam, the same on every size, and the placement carries a "do not
  scale" note. The private label sb-6 sits inside the neck (activity log
  2026-10-15). Navy prints the cream lockup, not white and red as the grid
  read suggested.
- Renders: Apliiq's own full-size render of each design
  (`blob.apliiq.com/sitestorage/products/<id>_6399.jpg`, 944 x 1440 on
  white) is kept unchanged in `as-received/`. The white was replaced by the
  studio backdrop at 2:3 with `scripts/studio-backdrop-product-shot.py`; Grey
  Heather and Bone took their garment mask from the Black render of the same
  template. The results are in `site-images/` and `public/products/` as
  `goal-lockup-hoodie-<colour>-catalog-product-front-20261022.webp`
  (960 x 1440), recorded in `docs/catalog/goal-lockup-hoodie-product-20261022.json`.
- Site: the four ids and SKUs are in `src/lib/fulfillment.ts`, every gallery
  leads with its render ("Concept render" caption), `comingSoon` is removed,
  and the row is `isActive` and `availableForSale` at $78. The paths are
  allowlisted in `src/middleware.ts`.
  `node scripts/test-goal-hoodies.cjs` passes, and its in-memory Stripe now
  confirms every live colourway and size opens a session carrying its own
  SKU. Migration 0042 is updated to active and for sale. It has not been run;
  the order store upserts the row before any order item.
- Still open: the owner's model pictures (they go after the product front
  in each gallery), a physical sample, and the hi-res link status on each
  placement (not read).

## Original publish checklist

1. Open each of the four design pages on the owner's Apliiq login; copy
   the URL (the id) and the "color offered" section (the SKUs).
2. File the owner's model pictures here under `site-images/` (originals
   unchanged under `as-received/`), frame them per
   `designs/00_asset-library/MODEL-PHOTO-FRAME-STANDARD.md`, copy to
   `public/products/` as
   `goal-lockup-hoodie-<colour>-catalog-<view>-<date>.webp`, fill the
   `images` arrays (product front first, then the model views) and remove
   `isActive: false`. Add the new paths to `isPublic` in
   `src/middleware.ts` (the renovation gate lets Next image optimization
   fetch only allowlisted product files) and record them in
   `docs/catalog/`.
3. Add the four entries to `fulfillment.ts` and remove `comingSoon`.
4. Set `availableForSale: true`; update and run migration 0042 in the
   Supabase SQL editor.
5. `node scripts/test-goal-hoodies.cjs` must still pass (it flips to
   expecting a 200 from checkout once every input is in).
