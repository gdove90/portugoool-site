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
  it to 2:3 instead: columns off a wider photo, rows off a narrower one.
  `--anchor start` keeps the top (or left), `end` the bottom (or right);
  the default trims about the centre. A narrow shorts close-up keeps its
  waistband with `--crop --anchor start` and gives up leg below the hem.
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
brightness (0-255) on every photo. Products without model photos yet (the caps)
still show square concept renders. They meet this standard when their model
photos are uploaded.

## Applied 2026-10-22

| Set | Was | Now |
|---|---|---|
| GA Minimal Shorts Shadow · model front | 941 x 1672 | 1115 x 1672, backdrop extended at the sides (seam steps 0.00 and 0.13 levels) |
| GA Minimal Shorts Shadow · model front close, print detail | 1086 x 1448 (3:4) | 965 x 1448, cropped 60 px from each side |
| GA Minimal Shorts Ink Blue · model front | 487 x 1024 | 683 x 1024, backdrop extended at the sides (seam steps 0.00 and 0.45) |
| GA Minimal Shorts Ink Blue · print detail | 588 x 1024 | 586 x 879, two seam columns dropped, cropped from the bottom (`--anchor start`) |
| GA Minimal Shorts Black · model front | 420 x 1024 | 683 x 1024, one seam column dropped, backdrop extended at the sides (seam steps 0.01 and 0.31) |
| GA Minimal Shorts Black · print detail | 682 x 1024 | 679 x 1018, white seam (2 columns) dropped, 6 rows cropped from the bottom |
| GA Matchday Cap Red · product front | 556 x 723 | 556 x 834, 2 seam rows dropped at the top, backdrop extended above and below (seam steps 0.49 and 0.05) |
| GA Matchday Cap Red · model front, three-quarter, side | 555 x 671, 556 x 671, 555 x 723 | 447 x 671, 447 x 671, 482 x 723, cropped at the sides (shoes touch the bottom edge, so no extension below) |
| GA Matchday Cap Royal · product front | 556 x 727 | 556 x 834, 1 seam row dropped at the top, backdrop extended above and below (seam steps 1.46 and 0.11; the 1.46 is the backdrop gradient, not visible) |
| GA Matchday Cap Royal · model front, three-quarter, side | 556 x 668, 556 x 668, 556 x 727 | 445 x 667, 445 x 667, 484 x 726, one seam row dropped, cropped at the sides |

Records: `docs/catalog/ga-minimal-shorts-{shadow,ink-blue,black}-20261022.json`,
`docs/catalog/ga-matchday-cap-{red,royal}-20261022.json`.
All three Apliiq shorts renders left `public/products/`; they stay in
`designs/28_as5620-goal-shorts-2026-10-14/proofs/apliiq-renders/`.

## Gallery fit on screen (2026-10-22)

Owner decision: the whole primary photo is on screen the moment a product
page opens, with no scrolling, on every product. The gallery frame carries
the photo's own ratio (2:3 for catalog photos; the remaining Apliiq renders
are 590 x 900) and gives up width until its height fits under the header
and breadcrumb with 24px to spare; the photo is never cropped
(`object-fit: contain`) and nothing shows beside it. Rule:
`.v84 .gallery .gallery-main` in `src/v84/integration.css`. A 240px-wide
floor keeps the frame usable on short landscape phones, the one case where
it may still extend below the fold. Collection cards and thumbnails are
unchanged.
