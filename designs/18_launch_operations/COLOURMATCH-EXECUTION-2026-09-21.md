# Colour match execution — 2026-09-21

Owner directive: "the colorways should match always." Applied catalogue-wide,
overriding my earlier recommendation to leave the neutrals alone.

## Shipped — 8 colourways, 16 images

Fabric corrected to the colour measured from Apliiq's own rendered saved
design. Swatch hexes updated to match, so selector and imagery agree.

| Colourway | was | now |
|---|---|---|
| Performance Badge / Black | #1B1B1B | #373737 |
| Performance Badge / True Royal | #1D45B4 | #3249A6 |
| Core Hoodie / Black | #181818 | #1E1E1E |
| Core Hoodie / Bone | #DEDAD7 | #CFCAC7 |
| Casual Wordmark / Washed Black | #1C1C1C | #262626 |
| Casual Wordmark / Washed Grey | #898885 | #7D7D7B |
| Minimal Club / Natural | #E9E3D5 | #E5E5DD |
| Circular Crewneck / Gray Heather | #CFCFD1 | #B2B2B2 |

Each was inspected by an independent verifier against a before/after strip.
All eight: artwork intact, silhouette intact, background clean, no banding,
distinct tonal levels went UP rather than down (no posterisation).

Expect the blacks to read lighter and slightly more textured than before.
That is an honest consequence of lifting a crushed near-black to Apliiq's
#373737 - the texture was always in the file, compressed below visibility.

## Blocked — 2 colourways, fully reverted

**Modern Sport Performance / Black** and **Varsity / Washed Black** are back
at their original colour, every file, byte-identical to the archive.

Both failed on their close-up DETAIL crops, and the pattern is exact: every
asset shot on the light studio backdrop passed; both failures are detail
crops on dark or vignetted backdrops. The mask keyed off the light
background, so on a detail crop it either missed entirely (Varsity: +0.8
grey levels where +7 was needed, leaving a ~20% luminance gap against its
own siblings) or bisected the garment (Modern Sport: only 36% corrected,
shipping visibly two-tone, plus 2,577 adjacent-pixel jumps above 10 levels
that did not exist before).

A second attempt with a frame-based mask hit both targets exactly and raised
coverage, but speckle exploded - 24k to 160k jumps on Modern Sport, 351k to
685k on Varsity. That is inherent: a 2x lift on a crushed near-black doubles
its compression noise, and on a close-up that reads as blotchy. These two
need re-rendered source assets, not a pixel correction.

Reverted WHOLE, not partially. Half-reverting would leave a colourway with
two files at the new colour and one at the old - the exact mismatch the
directive exists to prevent.

## Not corrected

Performance Badge White and Circular Badge Ivory were skipped: their garment
occupancy measures 0.231 and 0.26, far outside the 0.28-0.72 safety band, so
masking them risks the fabric-eating failure that destroyed assets earlier.
Both already measured as matching (delta 7 and 2), so nothing is lost.

Touchline Cap was attempted and reverted: it is two-tone, so a single
per-channel factor lightened the black brim toward grey. Two-tone garments
need per-region handling.

## Process failure worth recording

The recolour pipeline's own report marked BOTH failures as successful. It
sampled a single band per image, and on Modern Sport that band happened to
sit in the one region that had been corrected. Every file was green.

Single-point sampling is not verification. Any future run of this pipeline
must report, per image: coverage (fraction of fabric whose correction ratio
lands in the expected band, broken out per row band) and speckle delta
(adjacent-pixel jumps above 10 levels, before vs after). Both failures would
have been caught immediately by either metric.

## Caveat

All targets come from Apliiq's rendered mockups, which are the supplier's own
renders, not photographs of manufactured samples. This establishes
render-to-render agreement, not colorimetric accuracy against physical
fabric. Physical sample approval remains the gate.
