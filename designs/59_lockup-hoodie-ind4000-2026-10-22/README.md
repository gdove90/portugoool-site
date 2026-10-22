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

## To publish

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
