# GA Monogram — Type Specification

Source: design spec received 2026-07-23. Companion art:
`GA-MONOGRAM-LETTERING-v1.png` (raster reference) and
`GA-BADGE-PRINT-v1.png` (shield lockup using this monogram).

## Lettering type

Custom outlined vector monogram.
Do not type the letters G and A using a standard font.

Overall style:
- Bold geometric sports lettering
- Forward leaning
- Wide horizontal proportions
- Rounded outside corners
- Sharp angled terminals
- Single color
- No stroke outline · no shadows · no gradients

## Master artboard

- Artboard: 1000 × 1000 units
- Monogram bounding box: 760 × 760 units
- Horizontal alignment: centered
- Vertical alignment: centered

## Forward slant

- Italic angle: 12° forward to the right
- All major vertical strokes must follow the same 12° angle
- Do not independently rotate the G and A

## Stroke system

- Primary stroke thickness: 145 units (permitted 135–150)
- All major strokes must appear visually equal in weight
- Minimum internal negative space: 105 units
- Minimum production gap: 0.08 in at final embroidery size

## Corner treatment

- Outer rounded corner radius: 55 units
- Inner rounded corner radius: 38 units
- Top-right terminals: sharp 12° diagonal cut
- Bottom terminals: sharp diagonal cut matching the italic angle
- Do not use fully square corners
- Do not make the lettering soft or bubble shaped

## G construction

The G is the dominant upper-left letter.

- G overall: 610 w × 560 h units
- G top begins 120 units from the top of the bounding box
- G left edge 120 units from the left of the bounding box
- Top horizontal bar: ~500 units long
- Left descending stroke: 145 units thick
- Lower horizontal return: ~390 units long
- Interior opening: ~325 w × ~255 h units — rectangular with slightly
  rounded inner corners
- The G lower return must connect visually into the A crossbar
- Do not use a circular or traditional typographic G

## A construction

The A begins beneath and slightly to the right of the G.

- A overall: 500 w × 550 h units
- A top position: ~350 units from the top of the bounding box
- A left leg begins beneath the G lower return
- A right leg extends lower than the G
- Two heavy angled legs; the crossbar is formed by the shared horizontal
  overlap with the G
- A counter opening: parallelogram, ~205 w × ~145 h units, leaning at the
  same 12° angle
- Do not add a pointed top to the A
- Do not create a conventional triangular A

## Interlock

- The G lower-right section passes visually into the A upper-left section
- The letters share one continuous central junction
- The overlap must look intentionally woven rather than stacked
- No visible gap between the G and A at the central connection
- No duplicated strokes at the overlap
- Unite the final artwork into one compound vector shape

## Proportions

- G visual dominance ~55% · A ~45%
- Overall width-to-height ratio ~1.05 : 1
- The mark should feel compact and badge ready
- Do not stretch vertically · do not compress into a wide horizontal logo

## Color

- Master artwork: solid black `#000000`
- Light garment version: black / near-black thread
- Dark garment version: white or soft silver thread — recommended soft
  silver `#E6E7E8`

## Embroidery version

- Recommended finished size: 2.4 in w × 2.3 in h
- Minimum finished width: 2.1 in · maximum: 2.75 in
- Satin stitching for the monogram; tatami fill only where satin width
  exceeds the provider's recommended maximum
- Minimum satin column: 1.5 mm · minimum gap: 2 mm
- Remove details that would create isolated stitches
- Do not add thin internal outlines

## Vector output

Required formats: SVG · EPS · PDF · transparent PNG

- Convert all artwork to closed vector paths
- Unite overlapping shapes
- Remove stray points, live text, clipping masks
- Keep the monogram as one solid compound mark
