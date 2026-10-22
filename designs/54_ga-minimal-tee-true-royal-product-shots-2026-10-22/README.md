# GA Minimal Tee, True Royal: product shots (2026-10-22)

Owner supplied a product front and back of the True Royal GA Minimal Tee
(catalog id `80000000-0000-4000-8000-000000000011`, slug
`goal-athletics-ga-minimal-tee`): the cream GA monogram centred on the
chest, the cream stacked GOAL ATHLETICS lockup on the back. They lead the
True Royal gallery ahead of the four model views. Originals, unchanged, are
in `as-received/`.

Unlike the Black product shots (designs/53, flat #F2F2F2), these sit on a
soft grey studio backdrop with a floor shadow, closer to the model photos.
Each was extended above and below to the 2:3 frame with
`scripts/frame-model-photo-2x3.py`. Neither current source needed side
extension.

| View | Received | Deployed |
|---|---|---|
| product-front | 1024 x 1536 | `goal-ga-minimal-true-royal-catalog-product-front-20261022.webp`, 1024 x 1536 (already 2:3, deployed byte-for-byte) |
| product-back | 1122 x 1402 | `goal-ga-minimal-true-royal-catalog-product-back-20261022.webp`, 1122 x 1683 (joins 0.10 and 0.00; third back, cream lettering) |

The back was replaced later on 2026-10-22 by owner instruction: the first
back shot (cream lettering, 737 x 1024, extended to 737 x 1106) gave way to
a white-lettered 1122 x 1402 shot matching the True Red set. The first one
is kept as `as-received/true-royal-product-back-SUPERSEDED-cream-as-received.webp`;
the deployed path is unchanged because it had not been published, and
`src/lib/product-image.ts` tags it with revision `true-royal-back-white-20261022`
so no image cache (the dev optimizer held the first file even after its
on-disk cache was cleared) can serve the first file.

The back was replaced a second time, after the white-lettered one had
gone live: a cream-lettered 1122 x 1402 shot on the same backdrop, framed
the same way. The white-lettered file is kept as
`as-received/true-royal-product-back-SUPERSEDED-white-as-received.webp`; the
revision tag moved on to `true-royal-back-v3-20261022`.

The front was replaced too, after the first set had gone live on
2026-10-22: the 799 x 1024 shot gave way to a 1024 x 1536 one, already
2:3, deployed without re-encoding. The first is kept as
`as-received/true-royal-product-front-SUPERSEDED-799x1024-as-received.webp`;
the path is reused with revision tag `true-royal-front-v2-20261022`, which
matters here because the first file had been published.

The Apliiq renders `goal-ga-minimal-tee-true-royal-front.webp` and
`-back.webp` (not used by the True Royal gallery since the model photos
arrived) left `public/products/` and are kept in `retired-render/`. True
Red and White keep their renders. Checksums and sizes:
`docs/catalog/ga-minimal-tee-true-royal-product-20261022.json`.
