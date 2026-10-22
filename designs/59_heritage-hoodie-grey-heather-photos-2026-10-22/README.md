# Heritage Hoodie, Grey Heather: catalog photos (2026-10-22)

Owner supplied four photos of the Grey Heather Heritage Hoodie (Independent
IND4000, black and red GA monogram centred on the chest, small GA on the
wearer's left sleeve above the cuff, no back print) to go online in the
same catalog style as the other products, product shot first. Second
colourway of the listing recorded in
`designs/58_heritage-hoodie-black-photos-2026-10-22/`. Originals,
unchanged, are in `as-received/`. The Apliiq saved design
"goal athletics heritage hoodie · grey heather" exists; its id and SKUs
were not read in this session, so the listing still does not sell.

## Photos

All four arrived on the soft grey studio backdrop and were brought to 2:3
by continuing that backdrop outward (`scripts/frame-model-photo-2x3.py`):

| View | Received | Deployed |
|---|---|---|
| Product front | 1122 x 1402 | `goal-heritage-hoodie-grey-heather-catalog-product-front-20261022.webp`, 1122 x 1683 (140/141 rows above and below; joins 0.36 / 0.00) |
| Model front (sleeve GA visible at the left cuff) | 941 x 1672 | `goal-heritage-hoodie-grey-heather-catalog-model-front-20261022.webp`, 1115 x 1672 (87 columns each side; joins 0.00 / 0.29) |
| Model three-quarter (turned left, sleeve GA visible) | 941 x 1672 | `goal-heritage-hoodie-grey-heather-catalog-model-three-quarter-20261022.webp`, 1115 x 1672 (87 columns each side; joins 0.00 / 0.41) |
| Model side (quarter turn right) | 941 x 1672 | `goal-heritage-hoodie-grey-heather-catalog-model-side-20261022.webp`, 1115 x 1672 (87 columns each side; joins 0.01 / 0.15) |

Join steps are in `docs/catalog/heritage-hoodie-grey-heather-20261022.json`
with checksums and sizes. Gallery order: product front, model front,
three-quarter, side. Swatch hex `#D9D9D9`, the Core Hoodie's value for the
same IND4000 colour; the photos read darker (about `#AEAEB0`) under their
studio light. The four paths are on the gated site's public-image
allowlist (`src/middleware.ts`).

## Still to do

- Apliiq id and SKUs for this colourway in `src/lib/fulfillment.ts`; the
  price; then `availableForSale` on the product.
- Bone and Navy photos as the owner supplies them.
- Physical sample.
