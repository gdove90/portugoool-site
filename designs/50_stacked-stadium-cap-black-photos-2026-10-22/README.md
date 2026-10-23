# Stacked Stadium Cap, Black/Natural: catalog photos (2026-10-22)

Owner supplied four photos of the Black/Natural Stacked Stadium Cap (catalog
id `80000000-0000-4000-8000-000000000010`, slug
`goal-athletics-wordmark-cap`, Apliiq design 6205992): the cap front and
three head-and-shoulders model views, the product shot leading. Black/Natural
is the card's default colourway, so the product shot is also the collection
card image. Originals, unchanged, are in `as-received/`.

These arrived landscape (about 3:2), the opposite of the 2:3 frame. A plain
2:3 crop would have left the model shots 339 px wide, below what the gallery
displays, so each was handled in two steps with
`scripts/frame-model-photo-2x3.py`: trim the empty sides to a width that
keeps the whole subject (`--crop-width`), then extend the photo's own
backdrop to 2:3. The model shots sit at the bottom of their canvas with the
extension above the head (`--extend-anchor end`), because the tee runs off
the bottom edge; the product shot is extended above and below.

| View | Received | Deployed | Framing |
|---|---|---|---|
| product-front | 764 x 510 | `goal-wordmark-cap-black-catalog-product-front-20261022.webp`, 600 x 900 | 2 seam rows dropped, sides trimmed to 600, extended 196 px above and below |
| model-front | 764 x 508 | `goal-wordmark-cap-black-catalog-model-front-20261022.webp`, 480 x 720 | seam rows dropped, sides trimmed to 480, extended 216 px above |
| model-three-quarter | 764 x 508 | `goal-wordmark-cap-black-catalog-model-three-quarter-20261022.webp`, 480 x 720 | same |
| model-side | 764 x 510 | `goal-wordmark-cap-black-catalog-model-side-20261022.webp`, 480 x 720 | same; a bright and a dark seam line dropped at the top |

The joins measure 0.23 to 0.9 levels on backdrop pixels. Doing this set
changed the script in three ways, recorded in the frame standard: the
extension now carries the backdrop's gradient outward instead of a flat
colour (which also removes the small steps earlier cap sets had), seam
lines are stripped at 1.5 levels instead of 3, and the two options above
exist.

The Apliiq render for Black/Natural (`goal-wordmark-cap-black.webp`) left
`public/products/` and is kept in `retired-render/`. Checksums and sizes:
`docs/catalog/stacked-stadium-cap-black-20261022.json`. The cap stays
visible and not for sale.

## Product shot v2 (2026-10-23)

The first front showed the supplier's sticker on the visor. The owner sent a
clean front (70.webp) matching the Red, Royal and Dark Green set: 1024 x 1536,
already 2:3 on a clean backdrop, deployed byte for byte at the same path.
Cache revision `black-front-v2-20261023`. The first version is in
`retired-render/` (`*-owner-v1-*`); the new original is in `as-received/`.
Record: `docs/catalog/stacked-stadium-cap-black-20261022.json`.
