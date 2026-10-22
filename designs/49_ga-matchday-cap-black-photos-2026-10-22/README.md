# GA Matchday Cap, Black/Natural: catalog photos (2026-10-22)

Owner supplied four photos of the Black/Natural GA Matchday Cap (catalog
id `80000000-0000-4000-8000-000000000009`, slug
`goal-athletics-monogram-cap`, Apliiq design 6205981): the cap front and
three model views, the product shot leading. Black/Natural is the card's
default colourway, so the product shot is now also the collection card
image. Originals, unchanged, are in `as-received/`; the deployed files in
`public/products/` are the same pixels brought to the site's 2:3
model-photo frame with `scripts/frame-model-photo-2x3.py`
(designs/00_asset-library/MODEL-PHOTO-FRAME-STANDARD.md).

| View | Received | Deployed | Framing |
|---|---|---|---|
| product-front | 556 x 707 | `goal-monogram-cap-black-catalog-product-front-20261022.webp`, 556 x 834 | 2 seam rows dropped at the top, backdrop extended 64/65 px above and below |
| model-front | 555 x 687 | `goal-monogram-cap-black-catalog-model-front-20261022.webp`, 457 x 686 | 1 seam row dropped at the bottom, cropped 49 px each side |
| model-three-quarter | 556 x 687 | `goal-monogram-cap-black-catalog-model-three-quarter-20261022.webp`, 457 x 686 | 1 seam row dropped at the bottom, cropped 49/50 px from the sides |
| model-side | 555 x 707 | `goal-monogram-cap-black-catalog-model-side-20261022.webp`, 470 x 705 | 2 seam rows dropped (top and bottom), cropped 42/43 px from the sides |

Same handling as the other three colourways (designs/46-48): the model
shots have the shoes on the bottom edge, so they were cropped at the sides
(empty backdrop only); the product shot was extended above and below, with
seam steps of 0.01 and 0.07 levels.

The Apliiq render for Black/Natural (`goal-monogram-cap-black.webp`) left
`public/products/` and is kept in `retired-render/`. With this set every
GA Matchday Cap colourway shows photos. Checksums and sizes:
`docs/catalog/ga-matchday-cap-black-20261022.json`. The cap stays visible
and not for sale. Thread rule for the embroidery:
`designs/45_ga-matchday-cap-thread-spec-2026-10-22/README.md`.
