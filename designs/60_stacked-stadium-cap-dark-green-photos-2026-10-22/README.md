# Stacked Stadium Cap, Dark Green/Natural: catalog photos (2026-10-22)

Owner instruction 2026-10-22: "remove the hat with the sticker and replace
add this to the proper place". The Dark Green/Natural Stacked Stadium Cap
(catalog id `80000000-0000-4000-8000-000000000010`, slug
`goal-athletics-wordmark-cap`, Apliiq design 6206101) showed a single image
with the supplier's sticker on the visor. It now shows the owner's four
photos, product shot first, like the Black, Red and Royal sets (designs/50
to 52). Originals, unchanged, are in `as-received/`.

The photos arrived as square screenshots (about 622 x 625) with thin light
lines along some edges: 1 px at the top or sides, and 5 white rows under the
tee on the front and side model views. Those lines were trimmed, then each
photo's own backdrop was extended to 2:3 with
`scripts/frame-model-photo-2x3.py`, keeping the subject at native scale. The
model shots sit at the bottom of their canvas with the extension above the
head (`--extend-anchor end`); the product shot is extended above and below.

| View | Received | Deployed | Framing |
|---|---|---|---|
| product-front | 61.png, 622 x 627 | `goal-wordmark-cap-dark-green-catalog-product-front-20261022.webp`, 621 x 932 | top and left lines trimmed, extended above and below |
| model-front | 62.png, 622 x 623 | `goal-wordmark-cap-dark-green-catalog-model-front-20261022.webp`, 620 x 930 | bottom rows and right line trimmed, extended above |
| model-three-quarter | 60.png, 622 x 627 | `goal-wordmark-cap-dark-green-catalog-model-three-quarter-20261022.webp`, 620 x 930 | top and right lines trimmed, extended above |
| model-side | 63.png, 622 x 623 | `goal-wordmark-cap-dark-green-catalog-model-side-20261022.webp`, 621 x 932 | bottom rows and left line trimmed, extended above |

The sticker image (`goal-wordmark-cap-dark-green.webp`) left
`public/products/` and is kept in `retired-render/`. Checksums and sizes:
`docs/catalog/stacked-stadium-cap-dark-green-20261022.json`. The cap stays
visible and not for sale.
