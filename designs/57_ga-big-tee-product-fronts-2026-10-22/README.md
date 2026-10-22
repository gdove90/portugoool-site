# GA Big Tee: product fronts on the studio backdrop (2026-10-22)

Owner supplied one product front per colourway of the GA Big Tee (catalog
id `80000000-0000-4000-8000-000000000012`, slug `goal-athletics-ga-big-tee`):
Black, True Royal, White · Black-Red and True Red, each with the GA monogram
and GOAL ATHLETICS lockup across the chest, on a pure white background. The
instruction was to put them up on the same backdrop every other garment
has. Originals, unchanged, are in `as-received/`.

## How the white became the studio grey

`scripts/studio-backdrop-product-shot.py` (written for this set):

- A white background means every non-garment pixel is white darkened by
  shadow, so its shadow strength is pixel / white. The new pixel is the
  studio backdrop at that point times that strength: the garment's own
  cast shadow carries over and only the white goes.
- Garment pixels are copied unchanged through a 1 px feather, eroded one
  pixel so the anti-aliased edge takes the shadow treatment instead of
  leaving a light halo.
- The garment mask comes from colour (saturated or dark pixels, holes
  filled for the white lettering, largest blob). The white tee has no
  such cue, so the Black shot of the same render served as the prior: its
  mask grown into the white shot's non-white pixels and clipped 4 px
  outside the prior, so the cast shadow beyond the hem stayed shadow.
- The backdrop is the vertical gradient of the site's product shots (194
  at the top, 208 at mid height, 223 at the bottom, grain 1), drawn over
  the whole 2:3 canvas, so the extension above and below is seamless.

| Colourway | Received | Deployed |
|---|---|---|
| Black | 1374 x 1145 | `goal-ga-big-tee-black-catalog-product-front-20261022.webp`, 1210 x 1815 (columns 80-1290 kept) |
| True Royal | 1145 x 1374 | `goal-ga-big-tee-true-royal-catalog-product-front-20261022.webp`, 1145 x 1718 |
| White · Black-Red | 1374 x 1145 | `goal-ga-big-tee-white-black-red-catalog-product-front-20261022.webp`, 1210 x 1815 (mask prior: the Black shot) |
| True Red | 1145 x 1374 | `goal-ga-big-tee-true-red-catalog-product-front-20261022.webp`, 1145 x 1718 |

The True Royal and True Red sources have their sleeve cuffs at the side
edges of the frame; the sides are not extended, so the cuffs sit at the
canvas edge as they arrived.

## On the site

Each colourway's gallery now opens on its product front, then the three
model views. Black is the card default, so its front is the collection
card and the product-level image. The four Apliiq front renders
(`goal-ga-big-tee-<colour>-front.webp`) left `public/products/` for
`retired-render/`; the back renders were never in a gallery and stay as
they were. Checksums and sizes:
`docs/catalog/ga-big-tee-product-fronts-20261022.json`.
