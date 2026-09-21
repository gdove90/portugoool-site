# Colourway colour audit vs Apliiq shipping renders — 2026-09-21

Owner standard: the colour shown on the site must be the colour Apliiq
actually ships. This audit measures it. **No image was changed.**

## Method

For all 14 active colourways: the website image and Apliiq's own rendered
saved design were sampled with an identical routine — the median colour of
a central fabric band at 62-82% of garment height and the middle 34% of
width, which is plain garment on every render, below every chest print.
Apliiq renders pulled from `resized-products/{design}_{frontViewId}_577_880.jpg`.

Raw RGB deltas alone are misleading, so each pair was also decomposed into
hue / saturation / value. Hue and saturation carry dye identity. Value is
mostly lighting, and the two render styles are lit differently. Hue is
mathematically undefined for near-neutral colours, so the verdict only
trusts hue/saturation where saturation exceeds 0.12.

## Result

| Colourway | site | Apliiq | dHue | dSat | dVal | verdict |
|---|---|---|---|---|---|---|
| Performance Badge / Black | #1B1B1B | #373737 | - | 0.0 | 11.0 | lighting only |
| Performance Badge / White | #E9E8EB | #E4E4E4 | - | 1.3 | 2.7 | match |
| **Performance Badge / True Royal** | **#1D44B3** | **#3249A6** | **3.7** | **13.9** | 5.1 | **COLOUR MISMATCH** |
| Core Hoodie / Black | #181818 | #1E1E1E | - | 0.0 | 2.4 | match |
| Core Hoodie / Bone | #DEDAD7 | #CFCAC7 | 3.2 | 0.7 | 5.9 | match |
| Casual Wordmark / Washed Black | #1C1C1C | #262626 | - | 0.0 | 3.9 | match |
| Casual Wordmark / Washed Grey | #898885 | #7D7D7B | - | 1.3 | 4.7 | match |
| Touchline Cap / Black-Natural | #252625 | #404040 | - | 2.6 | 10.2 | lighting only |
| Varsity / Washed Black | #1F1F1F | #262626 | - | 0.0 | 2.7 | match |
| Minimal Club / Natural | #E9E3D5 | #E5E5DD | - | 5.1 | 1.6 | match |
| Circular Badge / Ivory | #F1ECE3 | #F3EAE1 | - | 1.6 | 0.8 | match |
| Modern Sport Perf / Black | #1B1B1A | #373737 | - | 3.7 | 11.0 | lighting only |
| Modern Sport Perf / True Royal | #334AA6 | #3249A6 | 0.1 | 0.6 | 0.0 | match (corrected today) |
| Circular Crewneck / Gray Heather | #CECED0 | #B2B2B2 | - | 1.0 | 11.8 | lighting, but borderline |

## Conclusion

**Exactly one genuine colour mismatch: Performance Badge Tee / True
Royal.** Its saturation is 13.9 points higher than what ships — the site
render is a more vivid blue than the actual garment. It is the same ST720
"true royal" as the Modern Sport Performance tee, which now measures a
0.1 degree hue and 0.6 point saturation delta after today's correction, so
the target is already proven.

**Do not chase the four large raw deltas on neutrals.** Performance Badge
Black (28), Touchline Cap (27), Modern Sport Black (29) and Gray Heather
(30) all have zero-to-negligible hue and saturation difference; only value
differs, because Apliiq lights its mockups brighter and flatter. Matching
those numbers would make the site's blacks read as washed-out grey and
would misrepresent the garments in the opposite direction.

**One borderline call: Gray Heather.** It is neutral, so the rule says
leave it, but at 11.8 points of value on a mid-grey the site render is
visibly lighter than Apliiq's, and heather lightness does carry some
product identity in a way black does not. Owner decision.

## Sampling caveats

The Touchline Cap is a two-tone garment (black brim, natural crown) and a
different silhouette, so its band sample is less meaningful than the tees;
its neutral verdict should not be read as a precise measurement. All
Apliiq renders are the supplier's own mockups, not photographs of
manufactured samples, so this audit establishes render-to-render
agreement, not colorimetric accuracy against physical fabric. Physical
sample approval remains the real gate.
