# GOOOL product backdrop standard — v1

Established for the background-only consistency request, 2026-09-25.

## Single backdrop

- Name: GOOOL Neutral Light Gray.
- HEX: #F2F2F2.
- RGB, 8-bit sRGB: 242, 242, 242.
- Opacity: 100%.
- Fill: uniform solid color across the whole image canvas.
- No gradient, vignette, texture, horizon, spotlight, tint, or baked-in floor/drop shadow.
- Preserve the garment's own lighting and shadows within its silhouette.
- Use this backdrop for standalone catalog product images, alternate views, color variants, thumbnails, and product detail crops. Lifestyle photography is a separate image type.

This standard covers product-image backdrops and their display containers, not the entire site's page background, navigation, or brand palette.

## Current hoodie correction

Use the current full-resolution source files for the six Club Blue hoodie images: Black front/back, Bone front/back, Grey Heather front/back. Do not extract final assets from browser screenshots. The screenshots supplied in this request are visual references only.

Replace only the exterior background and remove old exterior floor shadows. Preserve the original garment pixels, print, drawstrings, folds, color, texture, silhouette, position and dimensions. Do not regenerate the garment or use a newly generated garment as a replacement.

Use a reviewed subject mask. Preserve garment pixels inside the mask and composite the original subject over the standard color. Inspect the gaps between sleeves and torso as background regions. Protect pale Bone fabric and fine garment edges from erosion. Limit edge decontamination to mixed foreground/background pixels at the silhouette. Do not globally recolor or relight the image.

Preserve current canvas size and crop for these background-only corrections. Do not change subject framing as part of this request.

## Future assets

- Portrait aspect ratio: 4:5.
- New master canvas: 1600 x 2000 px; do not upscale existing images merely to hit this target.
- Full-garment views: centered horizontally, nominal garment height 80% of canvas, top and bottom margins approximately 10%; match framing within each product family. Keep all garment edges visible.
- Master: lossless PNG, sRGB, 8-bit channels, opaque background.
- Web export: lossless WebP when exact background RGB is required. If a delivery optimizer uses lossy encoding, inspect delivered color consistency separately.
- Keep a subject-mask master and original source alongside the flattened master for reproducible future edits.

## Website integration

Use a single shared CSS token:

```css
:root { --product-backdrop: #f2f2f2; }
```

Apply that token to catalog image containers, gallery backgrounds, and thumbnail containers. Changing CSS alone does not replace backgrounds already baked into image files. Avoid blend modes, filters, or overlays that alter garment colors.

## Acceptance checks

1. In each lossless master, unoccluded background samples at all four corners and along each border must be RGB 242/242/242. Check the full background mask, not only corners, for hidden gradients.
2. Compare original versus corrected masters: fully opaque garment-interior pixels must be unchanged. Review the narrow antialiased boundary separately.
3. Inspect at 100% for pale halos, clipped cuffs, damaged drawstrings, removed fabric, and background remnants between sleeves and torso.
4. Review all six images together and click through front/back and color options on the website. Background tone must remain consistent.
5. Preserve source originals and record input/output paths. Update all references that consume the corrected images, then verify actual delivered images rather than assuming cache refresh.

## Status

Six current Club Blue source images were located in `C:/Users/gdove/OneDrive/Desktop/GOOOL/public/products` after the owner identified the correct desktop folder. Corrected PNG masters and lossless WebP exports are in this package, with original files, working masks, a contact sheet, and `verification.json`.

Built-in imagegen created silhouette guides only. Those guides were cleaned and refined against the original source edges; Bone masks also use source chroma to distinguish pale fabric from the neutral ground. Final image pixels come from the original images, with edge compositing confined to the silhouette. All six protected garment interiors have zero changed pixels. Canvas dimensions and image position are retained. Exterior background pixels are RGB 242/242/242, and WebP lossless round trips were verified.

The correction scope is these six Club Blue hoodie views. Other existing product photos have not been retroactively corrected. Website deployment is not included in this package's verification.


## Catalog-wide backdrop update — 2026-09-25
All 36 active catalog images now follow the same #F2F2F2 sRGB flat-background standard. The complete source archive, masters, masks, verification and contact sheet are in `designs/28_catalog-backdrop-standard-2026-09-25`. Product shapes, artwork and canvas dimensions are preserved.
