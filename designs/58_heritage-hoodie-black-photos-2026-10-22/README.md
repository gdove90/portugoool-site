# Heritage Hoodie, Black: catalog photos and the new listing (2026-10-22)

Owner supplied four photos of the Black Heritage Hoodie (Independent
IND4000 heavyweight fleece, GA monogram centred on the chest and a small
GA on the wearer's left sleeve above the cuff, no back print) with the
instruction to put them on the website in the same catalog style as the
other products, product shot first. No listing existed, so this folder
also records the new product. Originals, unchanged, are in `as-received/`.

The owner's Apliiq saved-designs list (screenshot in the session, not
filed) shows "goal athletics heritage hoodie" in Black, Grey Heather,
Bone and Navy, all `ind4000 / independent trading co`, 9 sizes (xs-5xl),
2 artworks. The design ids and SKUs were not read in this session.

## Listing

| Field | Value |
|---|---|
| Catalog id | `80000000-0000-4000-8000-000000000014` |
| Name | GOAL Athletics Heritage Hoodie (Apliiq's name for the saved designs) |
| Slug | `goal-athletics-heritage-hoodie` |
| Blank | IND4000; size chart `ind4000` (same as the Core Hoodies) |
| Sizes sold | S to XXL (Apliiq offers XS to 5XL) |
| Price | not set: `priceCents: 0`, shown as "Price to be announced" |
| Sale state | `availableForSale: false` ("Coming soon") until the Apliiq ids and SKUs are mapped in `src/lib/fulfillment.ts` and a price is set |
| Copy | fabric, fit and care are the Core Hoodie's IND4000 lines |
| Migration | `supabase/migrations/0041_heritage_hoodie.sql`, not yet applied |

## Photos

All four arrived on the soft grey studio backdrop and were brought to 2:3
by continuing that backdrop outward (`scripts/frame-model-photo-2x3.py`):

| View | Received | Deployed |
|---|---|---|
| Product front | 1199 x 1312 | `goal-heritage-hoodie-black-catalog-product-front-20261022.webp`, 1199 x 1798 (243 rows above and below; joins 0.00 / 0.00) |
| Model front | 510 x 1024 | `goal-heritage-hoodie-black-catalog-model-front-20261022.webp`, 683 x 1024 (sides; joins 0.02 / 0.26) |
| Model three-quarter (turned left, sleeve GA visible) | 510 x 1024 | `goal-heritage-hoodie-black-catalog-model-three-quarter-20261022.webp`, 683 x 1024 (sides; joins 0.02 / 0.20) |
| Model side (quarter turn right) | 510 x 1024 | `goal-heritage-hoodie-black-catalog-model-side-20261022.webp`, 683 x 1024 (sides; joins 0.00 / 0.06) |

Gallery order: product front, model front, three-quarter, side. Black is
the card default and the product-level image. Checksums and sizes:
`docs/catalog/heritage-hoodie-black-20261022.json`. The four paths are on
the gated site's public-image allowlist (`src/middleware.ts`).

## Still to do

- Read the four design ids and SKUs off Apliiq and map them in
  `src/lib/fulfillment.ts`; set the price; flip `availableForSale`.
- Grey Heather, Bone and Navy photos as the owner supplies them.
- Apply migration 0041 in the SQL editor.
- Physical sample.
