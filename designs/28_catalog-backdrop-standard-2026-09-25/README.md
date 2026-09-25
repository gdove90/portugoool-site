# GOOOL catalog backdrop standard — 2026-09-25

Every active catalog image uses **#F2F2F2**, RGB **242, 242, 242**, in **sRGB**. Use one opaque, flat fill with no gradient, vignette, floor shadow, texture, or color cast. Preserve the garment's own lighting and shading.

Scope: 36 unique product images across all 9 active products, including all Red and Club Blue hoodie colors, casual and performance tees, caps, thumbnails and back detail views. Thirty files were updated in this pass; six Club Blue hoodies already met the standard. Brand logos and the stadium hero are separate artwork, not catalog backdrops.

Only the background and the antialiased silhouette boundary are composited. Original garment interiors, printed artwork, texture, colors, positions, crop and canvas dimensions are preserved. AI-generated files are coarse masking guides, never replacement garment pixels. Source-based contour refinement removes guide artifacts. The same cap back source uses one shared mask. The floor visible through its rear opening is also replaced.

## Future uploads

- New full-product masters: 1600 × 2000 pixels, 4:5, sRGB, opaque #F2F2F2 background. Do not upscale existing images merely to claim this resolution.
- Match the established framing for that product category. Preserve full cuffs, hems and brims. Keep an intentional close-up crop for detail views.
- Keep a lossless PNG master and export a lossless WebP site copy; existing PNG references can stay PNG.
- The CSS token is `--product-backdrop: #f2f2f2`. Apply it to all product image containers, including cards, galleries, thumbnails and cart images.
- Inspect at full resolution for halos, shadow remnants, clipped fabric and mask artifacts. Compare adjacent variants in a contact sheet and in the actual site gallery.
- Verify every fully retained foreground pixel against the source and every fully masked background pixel against RGB 242,242,242. Preserve source archives.

## Package

`originals/` is the pre-change archive for this pass. The six blue hoodie originals here already have the previously approved backdrop; their earlier untouched sources remain in design package 27. `masters/`, `site-images/`, `masks/` and `mask-guides/` record final files and processing evidence. `verification.json` records dimensions, hashes and exact pixel checks. `contact-sheet.png` presents all 36 images.

Processing was performed with Node/Sharp using original pixels, imagegen silhouette guides and the checked-in scripts. No Apliiq production artwork or product configuration is changed by this background work.

## Public launch

Deployed to https://goool.shop on 2026-09-25. Production PREVIEW_KEY was unset and the middleware preview gate removed at the owner's instruction. Canonical and retired-route redirects remain. Verified 14 public endpoints and all 36 original/optimized catalog images without a cookie. Deployment: 6ab6303c01d7acc5da6d5954. See verified-public-launch.json.
