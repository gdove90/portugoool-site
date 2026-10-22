# Model photo frame standard

Owner decision, 2026-10-20: every photo on every product shows the same
studio background width. This is the set standard for all products.

## The standard

- Every catalog photo is **2:3 portrait**. The studio background fills the
  frame from edge to edge, with no bars, no page colour beside it and no
  narrower strip.
- Every product gallery shows these photos in one 2:3 frame, filled edge to
  edge (`object-fit: cover`). The rule in `src/v84/integration.css` matches
  any file named `*-catalog-*`.
- Name files `goal-<product>-<colour>-catalog-<view>-<YYYYMMDD>.webp` so the
  frame rule and the gate allowlist in `src/middleware.ts` pick them up.

## Bringing a photo to standard

Photos arrive in mixed shapes. Run every new photo through:

```
python scripts/frame-model-photo-2x3.py IN OUT.webp
```

- **Narrower than 2:3:** the photo's own backdrop is extended left and right.
- **Wider than 2:3:** the backdrop is extended above and below.
- **A close-up that fills its frame** (a print detail): add `--crop` to trim
  the sides to 2:3 instead.
- The original pixels sit untouched in the middle at their native scale. A
  1-2 px seam left by a hand crop is dropped first.
- **A model cut off by the photo's own edge** (arms cropped) can't be extended
  this way. Ask the owner for a wider original. Never use Higgsfield or any
  other paid tool without the owner's go-ahead.

## Applied 2026-10-20

| Set | Was | Now |
|---|---|---|
| GA Big Tee Black | 335-354 x 1536 strips, arms cropped | 1685 x 2528. The owner allowed use of the Higgsfield 2:3 outpaints already made; the prints checked against the originals |
| GA Big Tee True Royal | 440-586 x 1024 | 683 x 1024, backdrop extended at the sides |
| GA Big Tee White · Black-Red | 941 x 1672 | 1115 x 1672, backdrop extended at the sides |
| GA Big Tee True Red | 1024 x 1536 | unchanged |
| GA Minimal Black, True Royal | 1024 x 1536 | unchanged |
| GA Minimal True Red | 941 x 1672 | 1115 x 1672, backdrop extended at the sides |
| GA Minimal White · Black-Red (6 views) | 1122 x 1402 (4:5) | 1122 x 1683, backdrop extended above and below; print detail cropped to 935 x 1402 |

The seam between the original and the extension measured under one level of
brightness (0-255) on every photo. Products without model photos yet (GA Minimal
Shorts in Black and Ink Blue, the caps) still show square concept renders. They
meet this standard when their model photos are uploaded.

## Applied 2026-10-22

| Set | Was | Now |
|---|---|---|
| GA Minimal Shorts Shadow · model front | 941 x 1672 | 1115 x 1672, backdrop extended at the sides (seam steps 0.00 and 0.13 levels) |
| GA Minimal Shorts Shadow · model front close, print detail | 1086 x 1448 (3:4) | 965 x 1448, cropped 60 px from each side |

Record: `docs/catalog/ga-minimal-shorts-shadow-20261022.json`. The Shadow
Apliiq render left `public/products/`; the Black and Ink Blue renders remain.
