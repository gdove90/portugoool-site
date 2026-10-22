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

The shots are 1200 x 1500 (4:5) on a flat #F2F2F2 backdrop. Each had the
backdrop extended 150 px above and below to the 2:3 frame with
`scripts/frame-model-photo-2x3.py` (joins 0.00).

| View | Received | Deployed |
|---|---|---|
| product-front | 1024 x 1536 | `goal-ga-minimal-black-catalog-product-front-20261022.webp`, 1024 x 1536 (already 2:3, deployed byte-for-byte; replaced later the same day) |
| product-back | 1200 x 1500 | `goal-ga-minimal-black-catalog-product-back-20261022.webp`, 1200 x 1800 |

The Apliiq renders `goal-ga-minimal-tee-black-front.webp` and `-back.webp`
left `public/products/` and are kept in `retired-render/`. The other
colourways' renders stay. Checksums and sizes:
`docs/catalog/ga-minimal-tee-black-product-20261022.json`.

The front was replaced after the first set had gone live on 2026-10-22:
the 1200 x 1500 shot on flat #F2F2F2 gave way to a 1024 x 1536 shot on the
same soft grey studio backdrop as the True Royal and True Red sets. The
first is kept as `as-received/black-product-front-SUPERSEDED-F2F2F2-as-received.png`;
the path is reused with revision tag `black-front-v2-20261022` in
`src/lib/product-image.ts`, because the first file had been published.

Note the backdrop of the back: still flat #F2F2F2, lighter than the
studio grey of the front and the model photos, so its thumbnail sits
paler than the others.
