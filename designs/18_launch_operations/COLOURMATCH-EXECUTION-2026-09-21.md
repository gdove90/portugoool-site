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

---

# Round 2 — the two blocked colourways, unblocked

Owner approved regenerating the detail crops on a light studio backdrop.

## Why round 1 failed, precisely

Luminance could not separate garment from backdrop on the detail crops: the
separation was NEGATIVE, -8 levels on Modern Sport and -17 on Varsity. The
backdrop and the fabric overlap in brightness, so any luminance-keyed mask
either misses or bisects the garment. That is the whole story.

## The fix

The backdrops are synthetic gradients measuring 0.000 local texture at p99,
against real fabric grain of 1.19 and 4.08. Segmenting on TEXTURE rather
than brightness separates them cleanly. The backdrop was then replaced with
the house studio field and the colour correction applied with a mask that
finally covers the whole garment.

Garment and artwork pixels are original throughout. No lettering was
regenerated, per the CLAUDE.md rule.

## Result

| File | fabric | coverage | per-row band |
|---|---|---|---|
| MODERN_PERFORMANCE_FRONT_V2 | 28 -> 55 (#373737) | 99.5% | 88,100,99,99,100,100,100,100 |
| MODERN_PERFORMANCE_BACK_DETAIL_V2 | 29 -> 55 (#373737) | 99.7% | 94,100,100,100,100,100,100,100 |
| STD_VARSITY_FRONT | 34 -> 38 (#262626) | 100.0% | all 100 |
| STD_VARSITY_BACK | 29 -> 38 (#262626) | 98.9% | 100,100,98,97,100,100,100 |
| VARSITY_BACK_DETAIL_V1 | 30 -> 38 (#262626) | 99.7% | 98,100,100,... |

Background pixels changed: 0 on every studio plate.

Independent verification, both SHIP:
- Modern Sport: front 55.0 and back detail 54.3, a 0.7-level spread. The
  back detail had 48,276 pure-black pixels before and exactly 0 after, so
  backdrop replacement is complete. Partial coverage gone: per-band gain is
  1.875-1.893 top to bottom, dead uniform.
- Varsity: front 37, back 38, detail 38 against a 38 target. The old ~20%
  luminance gap between the detail crop and its plates is gone.
- Speckle is not a defect here: noise multiplier 1.90x against a tonal gain
  of 1.88-1.95x, i.e. existing grain carried along by the lift. A real
  speckle event needs a local multiplier near 6x. Fabric histograms are
  fully contiguous, so no posterisation.

## A correction to a verifier's advice, worth recording

One verifier suggested nudging the regenerated backdrop from #F3F4F1 up to
#F6F5F3 to match the Modern Sport front plate. A survey of all 75 product
images shows that is backwards: #F3F4F1 (242.67) IS the house studio field,
the modal value of the catalogue. The outlier is
GOOOL_MODERN_PERFORMANCE_FRONT_V2 at 245.28, which is untouched original
photography and predates all of this work. The regenerated crops are the
files that match the standard. If anyone wants the set perfectly uniform,
the fix is to bring that front plate DOWN, not the crops up - and it is
~1.1% on a near-white field, cosmetic polish, not a gate.

## Known, not a blocker

The regenerated crops have zero backdrop grain where photographed plates
carry 0.1-0.9. Invisible at PDP tile size or in a grid with whitespace. It
would only show if a regenerated crop sat edge-to-edge at full bleed
against a photographed plate in a hero or lookbook layout.

## Catalogue status after this round

10 of 14 colourways now match Apliiq's shipping colour. Not corrected:
Performance Badge White and Circular Badge Ivory (unsafe to mask, occupancy
0.231 and 0.26, and both already measured as matching), and Touchline Cap
(two-tone, needs per-region handling).

---

# Round 3 — Touchline Cap (two-tone)

Owner approved. The cap needed per-region handling because a single median
conflates the cream crown with the black brim - that is what produced the
brown #776651 in round 1.

Measured separately against Apliiq's own render (design 6098980):

| Region | site before | Apliiq | site after |
|---|---|---|---|
| Crown, front | #E2D4C4 | #E4DFC9 | **#E4DFC9** |
| Crown, back | #E4D6C6 | #E4DFC9 | **#E4DFC8** |
| Brim, front | luminance 37 | 61 | **59** |
| Strap, back | #383029 | no reference | untouched |

Background changed: mean 0.08-0.11, p99 of 2. Embroidery protected.

## A defect caught and fixed before shipping

The first attempt neutralised the dark regions per-channel. Converting a
brown (57,49,41) to neutral grey multiplies the blue channel by 1.49, which
swung every dark pixel blue: the back snapback strap turned navy and the
under-brim shadows picked up a green cast. Visible immediately in the
mockup.

Three corrections: the brim is now lifted by LUMINANCE only, one factor
across all channels, so hue cannot shift; the crown weight falls to zero on
dark pixels so shadows sit at identity instead of blending into the brim
factor; and the back strap is left untouched entirely. It is hardware, not
fabric, and Apliiq renders only a front view, so there is no reference for
it - inventing one would be guessing.

## Note on the crown

This is the most visible change in the whole colour-match exercise. The
crown moves from a warm pinkish cream to a cooler, greener cream, because
that is what Apliiq ships. Cream reads as a hue in a way near-black does
not, so this one is genuinely noticeable. Owner approved it on the mockup.

## Catalogue status

11 of 14 colourways now match Apliiq's shipping colour. Remaining:
Performance Badge White and Circular Badge Ivory, both skipped as unsafe to
mask (occupancy 0.231 and 0.26) and both already measuring as matching.
