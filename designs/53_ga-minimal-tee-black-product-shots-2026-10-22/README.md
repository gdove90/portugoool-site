# GA Minimal Tee, Black: product shots (2026-10-22)

Owner supplied a product front and back of the Black GA Minimal Tee
(catalog id `80000000-0000-4000-8000-000000000011`, slug
`goal-athletics-ga-minimal-tee`, Apliiq design 6206620): the white and red
GA monogram centred on the chest, the stacked GOAL ATHLETICS lockup with
red bar on the back. They lead the Black gallery ahead of the four model
views and, Black being the card default, the front is the collection card.
Originals, unchanged, are in `as-received/`.

True Red and True Royal shots arrived in the same batch; the owner said
they did not come out properly and only Black was to go up. They are not
filed here.

The first shots were 1200 x 1500 (4:5) on a flat #F2F2F2 backdrop, each
extended 150 px above and below to the 2:3 frame with
`scripts/frame-model-photo-2x3.py` (joins 0.00); see below for their
replacements.

| View | Received | Deployed |
|---|---|---|
| product-front | 1024 x 1536 | `goal-ga-minimal-black-catalog-product-front-20261022.webp`, 1024 x 1536 (already 2:3, deployed byte-for-byte; replaced later the same day) |
| product-back | 1024 x 1536 | `goal-ga-minimal-black-catalog-product-back-20261022.webp`, 1024 x 1536 (already 2:3, deployed byte-for-byte; replaced later the same day) |

The Apliiq renders `goal-ga-minimal-tee-black-front.webp` and `-back.webp`
left `public/products/` and are kept in `retired-render/`. The other
colourways' renders stay. Checksums and sizes:
`docs/catalog/ga-minimal-tee-black-product-20261022.json`.

Both shots were replaced after the first set had gone live on 2026-10-22:
the 1200 x 1500 shots on flat #F2F2F2 gave way to 1024 x 1536 shots on
the same soft grey studio backdrop as the True Royal and True Red sets, so
the whole Black gallery now sits on one grey. The first files are kept as
`as-received/black-product-{front,back}-SUPERSEDED-F2F2F2-as-received.png`;
the paths are reused with revision tags `black-front-v2-20261022` and
`black-back-v2-20261022` in `src/lib/product-image.ts`, because the first
files had been published.
