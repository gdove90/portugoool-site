# GA Matchday Cap, Red/Natural: catalog photos (2026-10-22)

Owner supplied four photos of the Red/Natural GA Matchday Cap (catalog id
`80000000-0000-4000-8000-000000000009`, slug `goal-athletics-monogram-cap`,
Apliiq design 6205977): the cap front and three model views. Originals,
unchanged, are in `as-received/`; the deployed files in `public/products/`
are the same pixels brought to the site's 2:3 model-photo frame with
`scripts/frame-model-photo-2x3.py`
(designs/00_asset-library/MODEL-PHOTO-FRAME-STANDARD.md).

| View | Received | Deployed | Framing |
|---|---|---|---|
| product-front | 556 x 723 | `goal-monogram-cap-red-catalog-product-front-20261022.webp`, 556 x 834 | 2 seam rows dropped at the top, backdrop extended above and below |
| model-front | 555 x 671 | `goal-monogram-cap-red-catalog-model-front-20261022.webp`, 447 x 671 | cropped 54 px each side |
| model-three-quarter | 556 x 671 | `goal-monogram-cap-red-catalog-model-three-quarter-20261022.webp`, 447 x 671 | cropped 54/55 px from the sides |
| model-side | 555 x 723 | `goal-monogram-cap-red-catalog-model-side-20261022.webp`, 482 x 723 | cropped 36/37 px from the sides |

The model shots are wider than 2:3 with the shoes touching the bottom edge,
so extending the backdrop below them was not possible; they were cropped
at the sides instead, which removed only empty backdrop. The product shot
spans nearly the full width, so it was extended above and below; its top
two rows were a crop seam and were dropped first (the script now strips
top and bottom seams on wide photos as it already did on the sides of
narrow ones).

The Apliiq render for Red/Natural (`goal-monogram-cap-red.webp`) left
`public/products/` and is kept in `retired-render/`. Black, Royal and Dark
Green keep their renders on the site until their photos arrive. Checksums
and sizes: `docs/catalog/ga-matchday-cap-red-20261022.json`. The cap stays
visible and not for sale. Thread rule for the embroidery:
`designs/45_ga-matchday-cap-thread-spec-2026-10-22/README.md`.
