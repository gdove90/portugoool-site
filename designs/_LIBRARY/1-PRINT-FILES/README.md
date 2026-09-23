# PRINT FILES — the files you upload to Apliiq

This is the answer to "which file do I attach when I add a product?"

When you create a product on Apliiq you upload **one transparent PNG per
placement**. That file is what gets printed or stitched. It is not the
mockup, not the spec sheet, and not the logo — those are elsewhere in this
library. It is the artwork itself, sized to print.

## Folders

| folder | what is in it |
|---|---|
| `tees/` | front and back artwork for every tee currently on the site |
| `hoodies-and-crewnecks/` | same, for the hoodie and crewneck |
| `caps/` | the two embroidery files for the OTTO 31-069 |
| `labels/` | the sewn-label artwork, 1in and 2in |
| `retail-1a-1l/` | print files for the 12 new retail designs, not yet listed |
| `club-kit-2a-2l/` | print files for the club sponsorship line, incl. 25 squad numbers |

Filenames are prefixed with the product they belong to, so
`12-goool-athletics-circular-badge-tee-ivory__GA-CIRCLE-08-NAVY-PRINT.png`
is the front print for the Circular Badge Tee in ivory.

`HANDOFF-2026-09-23-apliiq-print-files.md` is the supplier handoff for the
two new folders: every placement with its measured stroke, gap and letter
height in mm, and a pass mark against the limits below. Those files were
built to this spec, not retro-fitted to it.

`PROVENANCE.json` records where each file in the older folders was copied from. These are
**copies**. If you change a master in its original folder, copy it here
again, or this folder goes stale.

## The rules a file must meet before it is uploaded

From Apliiq's published artwork guide, checked 2026-09-22:

- **PNG, transparent.** Not JPG, not a flattened mockup.
- **300 dpi at final print size.** A 3in print needs 900px. A 2in print
  needs 600px.
- **Cropped tight.** No empty transparent margin around the art — Apliiq
  sizes to the canvas, so padding shrinks the print.
- **Smallest detail 2 mm or larger.** Below that they will alter your file
  themselves, and they will not remake or refund a print that runs badly
  because of fine detail.
- **Embroidery letter height:** 1/2in recommended, 1/4in (6.35 mm)
  acceptable, **below 1/4in is not acceptable**.
- **Max 5 thread colours** on an embroidered design.
- **Stitch count:** 15,000 included, then +$0.40 per additional 1,000.

## Two traps worth knowing

**Measure strokes at final size, not zoomed in.** The Minimal Club Tee was
retired because the narrow stroke of its "I" measured 1.19 mm at actual
print width. On screen it looked perfectly solid. That defect is invisible
until you measure it.

**Wide letter-tracking is what makes letters too small, not the mark being
small.** The Modern Sport lockup's ATHLETICS line was 62% gap by width, so
its letters came out at 4.23 mm — under the floor, and unreachable by
scaling because a cap tops out at 4in. Tightening the tracking put 13 mm
letters in the same width. Check the letter-to-gap ratio before assuming
something just needs to be bigger.

Full cap spec: `../../23_cap-embroidery-2026-09-22/APLIIQ-OTTO-31069-SPEC.md`
