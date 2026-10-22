# AS5620 GOAL Shorts (GA) · 2026-10-14

Source: Claude Design proof `AS5620 GOAL Shorts Proof.dc.html`, exported by
the owner to Downloads and filed as-received in
`proofs/AS5620-GOAL-Shorts-Proof-as-received.html`. The proof names this
folder; the number follows the design project's own numbering, like
`26_st720-ga-tee-2026-10-14`.

## Blank

AS Colour 5620 Mens Active Shorts via Apliiq ("AS Colour MENS ACTIVE SHORTS
(5620)", customizer `/customize/v5/mens/shorts/MENS-ACTIVE-SHORTS/design`).
Colours: Black, Ink Blue, Shadow. Sizes on Apliiq: waist 30, 32, 34, 36, 38, 40.

## Print files (`print/`)

Extracted from the proof bundle, unchanged pixels, 300 ppi tag added.

| File | Size | Ink |
|---|---|---|
| `GA_WhiteRed_3.00in.png` | 3.00 x 2.70 in (900 x 810 px) | White + Red #E51226 (Black shorts) |
| `GA_Cream_3.00in.png` | 3.00 x 2.70 in | Cream #F9F1DF (Ink Blue shorts) |
| `GA_BlackRed_3.00in.png` | 3.00 x 2.70 in | Black #080808 + Red #E51226 (Shadow shorts) |
| `Wordmark-Vertical_*_2.44x8.00in.png` | 2.44 x 8.00 in (732 x 2400 px) | same three inks |

Measured detail (from the proof): GA smallest gap 3.33 mm at 3.00 in;
wordmark smallest gap 2.65 mm at 8.00 in, fails the 2 mm DTF minimum below
7.45 in.

## Built on Apliiq (2026-10-14): Minimal style

All three: transfer print, Front Bottom Left zone (wearer's left leg), GA
3.00 x 2.70 in, rotation 0, hi-res production file linked ("ideal quality"),
no back print, no branding. Art centred in Apliiq's zone. Each placement
carries this production note (activity log "new note added"):

> Wearer's left leg. Bottom of art 1.75 in above the hem; centre of art 4.00
> in in from the side seam. Rotation 0. Art square to the hem on the straight
> grain: square it to the hem before pressing.

| Design | Name | Colour | Hi-res | SKUs (waist 30 / 32 / 34 / 36 / 38 / 40) |
|---|---|---|---|---|
| 6208695 | GA Minimal Shorts - Black | Black | GA_WhiteRed_3.00in.png | APQ-6208695S71A1 … S76A1 |
| 6208705 | GA Minimal Shorts - Ink Blue | Ink Blue | GA_Cream_3.00in.png | APQ-6208705S71A1 … S76A1 |
| 6208713 | GA Minimal Shorts - Shadow | Shadow | GA_BlackRed_3.00in.png | APQ-6208713S71A1 … S76A1 |

SKU suffix per waist: 30 = S71A1, 32 = S72A1, 34 = S73A1, 36 = S74A1,
38 = S75A1, 40 = S76A1 (read from each design page).

Renders: `proofs/apliiq-renders/` (front only; Apliiq has no back render
without a back print) and `proofs/apliiq-renders-minimal-all-3.png`.

## Not built: Vertical style

Every print zone on the 5620 in Apliiq's customizer is 4 x 4 in (front
Bottom Left/Right, Top Left/Right; back Top Left/Right). The proof assumed
13.5 x 15 in. A test upload of the 2.44 x 8.00 in wordmark was clamped to
1.25 x 4.09 in, which would break the 2 mm minimum. No Vertical design was
saved. Options for the owner: a vertical wordmark redrawn to fit 4 in
(needs new art and a fresh gap check), a different blank with a full-leg
zone, or ask Apliiq about a custom placement.

## Still open

- Website: the site's sizes are letter sizes (S to XXL); the 5620 is sold
  by waist 30 to 40. The size mapping and the price are the owner's
  decisions, so the shorts are not on the site yet.
- Check on Apliiq / sample: which side the zip back pocket is on (matters
  only if a back print is added) and the GA position against the side
  pocket opening.
- No physical sample exists. Renders are Apliiq mockups, not photographs.

## Site photos: Shadow (2026-10-22)

The owner supplied three catalog photos of the Shadow shorts (black and red GA
on the wearer's left leg). Originals, unchanged, are in
`site-images/as-received/`; the deployed files in `public/products/` are the
same pixels brought to the site's 2:3 model-photo frame with
`scripts/frame-model-photo-2x3.py`
(designs/00_asset-library/MODEL-PHOTO-FRAME-STANDARD.md).

| View | Received | Deployed | Framing |
|---|---|---|---|
| model-front | 941 x 1672 | `goal-ga-minimal-shorts-shadow-catalog-model-front-20261022.webp`, 1115 x 1672 | backdrop extended 87 px each side |
| model-front-close | 1086 x 1448 | `goal-ga-minimal-shorts-shadow-catalog-model-front-close-20261022.webp`, 965 x 1448 | cropped 60 px each side |
| print-detail | 1086 x 1448 | `goal-ga-minimal-shorts-shadow-catalog-print-detail-20261022.webp`, 965 x 1448 | cropped 60 px each side |

The Shadow Apliiq render (`goal-ga-minimal-shorts-shadow-front.webp`) was
removed from `public/products/` by owner instruction; the render itself stays
in `proofs/apliiq-renders/6208713_shadow_5658.jpg`. Checksums and sizes:
`docs/catalog/ga-minimal-shorts-shadow-20261022.json`. Print spec is
unchanged: GA 3.00 x 2.70 in, Front Bottom Left, bottom of art 1.75 in above
the hem, centre 4.00 in from the side seam, rotation 0, no back print.

## Site photos: Ink Blue and Black (2026-10-22, later the same day)

Two photos per colourway, same handling. The close-ups touch the frame at
the sides, so they were cropped from the bottom (`--crop --anchor start`,
added to the script for this) rather than extended; the full-length shots
had their backdrop extended at the sides. Crop-seam columns the files
arrived with were dropped first.

| Colourway | View | Received | Deployed |
|---|---|---|---|
| Ink Blue (cream GA) | model-front | 487 x 1024 | `goal-ga-minimal-shorts-ink-blue-catalog-model-front-20261022.webp`, 683 x 1024 |
| Ink Blue (cream GA) | print-detail | 588 x 1024 | `goal-ga-minimal-shorts-ink-blue-catalog-print-detail-20261022.webp`, 586 x 879 |
| Black (white and red GA) | model-front | 420 x 1024 PNG | `goal-ga-minimal-shorts-black-catalog-model-front-20261022.webp`, 683 x 1024 |
| Black (white and red GA) | print-detail | 682 x 1024 | `goal-ga-minimal-shorts-black-catalog-print-detail-20261022.webp`, 679 x 1018 |

The Black and Ink Blue Apliiq renders (`…-black-front.webp`,
`…-ink-blue-front.webp`) left `public/products/`; `proofs/apliiq-renders/`
keeps them. The whole product now shows photos. Records:
`docs/catalog/ga-minimal-shorts-ink-blue-20261022.json` and
`docs/catalog/ga-minimal-shorts-black-20261022.json`. These two sets are
1024 px tall, lower than the Shadow set.
