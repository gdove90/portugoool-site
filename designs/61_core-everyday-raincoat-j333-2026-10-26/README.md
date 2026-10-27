# Core Everyday Raincoat (J333) — 2026-10-26

Owner instruction 2026-10-26: put the three rain jacket saved designs on
the site, under Men, live and purchasable. The owner built and named the
designs on Apliiq themselves ("core everyday raincoat", renamed from
"goal athletics torrent rain jacket … v1.3" at 2:20–2:22 am the same day).

## Apliiq saved designs (read off each design page 2026-10-26)

Blank: Torrent Waterproof Jacket, supplier style J333, 100% polyester,
made in Bangladesh, men's. Two transfer prints per design, front only, back
blank; private label `sb-6-161561` inside the neck. Dropship quote on the
Black design: **$64.58** per unit, XXL +$2.00, 3XL +$4.00, 4XL +$6.00.

| Colour | Design id | Left chest (wearer) | Right chest (wearer) | SKUs S–XXL |
|---|---|---|---|---|
| Black | 6240401 | `ga-chest_whitered_4-00in-png1`, 3 x 2.7 in | `wordmark-back_whitered_8-00in-png1`, 3.5 x 1.07 in | APQ-6240401S6A1 / S7A1 / S8A1 / S1A1 / S2A1 |
| True Navy | 6240414 | `ga-chest_cream_4-00in-png`, 3 x 2.7 in (hi-res `ga-chest_cream_4.00in.pdf`) | `wordmark-back_cream_8-00in-png1`, 3.5 x 1.07 in | APQ-6240414S6A1 / S7A1 / S8A1 / S1A1 / S2A1 |
| Dark Grey Heather | 6240424 | `ga-chest_cream_4-00in-png-edited`, 3 x 2.7 in, note: print solid black | `wordmark-back_cream_8-00in-png1-edited`, 3.5 x 1.07 in, note: print solid black | APQ-6240424S6A1 / S7A1 / S8A1 / S1A1 / S2A1 |

Apliiq also lists XS (S5A1), 3XL (S21A1) and 4XL (S61A1); the site sells
S to XXL as on every garment. Placement notes on every artwork: GA v1.3
3.00 in wide, wordmark 3.50 in wide, preserve proportions, no recolouring,
stroke or mirroring, "use transfer suitable for waterproof shell".

**Not verified:** the hi-res production files were not re-opened; no
physical sample exists. Proof-check the first order's mockup.

## Site

- Catalog row `80000000-0000-4000-8000-000000000016`, slug
  `goal-athletics-core-everyday-raincoat`, launched at $108 (25% contribution model
  on the $64.58 quote + $2 XXL + $3 label + $1 fulfilment + $0.30, floor
  $106). Owner decision later on 2026-10-26: **$98**, under the $100 line (about 26% on M, 24% on XXL on the VIP cost basis); migration 0044.
- New product category `jacket` (types, catalog tabs "Jackets", Supabase
  check constraint widened in migration 0043).
- Men's section via `audienceAssignments` in `src/v84/catalog-data.ts`.
- Size chart `j333` from the official spec sheet
  (`SpecSheetMeasurements_J333.pdf`): S–XXL chest 22/23.5/25/26.5/28 in laid
  flat, length 28.5–32.5 in, raglan sleeve 35.5–38.5 in. Care: machine wash
  cold, do not bleach, cool iron if needed, do not dry clean.
- Fabric copy: 5,000 mm waterproof, 3,000 g/m² breathability (the official
  sheet; some retailers print 1,000), mesh lined, zip-off hood, waterproof
  zips, hook-and-loop cuffs, drawcord hem, carry pouch. No supplier brand
  named on the site.

## Images

`apliiq-renders-as-received/`: Apliiq's public front render per design
(`blob.apliiq.com/sitestorage/products/<id>_7535.jpg`, 944 x 1440, white).
`site-images/`: the same renders on the studio backdrop at 2:3 via
`scripts/studio-backdrop-product-shot.py` (default settings), copied to
`public/products/goal-core-everyday-raincoat-<colour>-catalog-product-front-20261026.webp`.
Those renders were on the site from launch until later on 2026-10-26.

**Owner product shots (2026-10-26, later):** the owner supplied a front
and a back per colour (1024 x 1536, 2:3, used as given, no retouching);
originals in `as-received-owner/`. The fronts replaced the renders at the
same `public/products/...-product-front-20261026.webp` paths (revision
`owner-front-20261026` in `src/lib/product-image.ts`) and the backs were
added as `...-product-back-20261026.webp`, second in each gallery. The
owner's ten uploads were five byte-identical pairs; one of each was kept.
Model pictures are next (owner).

## Owner model photos, Black, 2026-10-27

Three photos supplied by the owner (941 x 1672; `owner-photos/black-model-*-as-received.webp`),
framed to the 2:3 catalog frame with `scripts/frame-model-photo-2x3.py`
(1115 x 1672) and added after the Black product front on the lead gallery
and the Black colourway: model front, side, rear
(`public/products/goal-core-everyday-raincoat-black-catalog-model-*-20261027.webp`).
Uploaded as given.

## Owner model photos, Dark Grey Heather and True Navy, 2026-10-27

Three photos per colour (1024 x 1536, already 2:3; `owner-photos/<colour>-model-*-as-received.webp`),
added after each colour's product front: model front, side, rear
(`public/products/goal-core-everyday-raincoat-<colour>-catalog-model-*-20261027.webp`).
Uploaded as given. All three colourways now carry the owner's model shots.
