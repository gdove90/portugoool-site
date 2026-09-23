# Cap embroidery: four designs, two blanks

**Concepts. Nothing saved to Apliiq, nothing ordered, nothing on the site.**

## Blanks, both verified on Apliiq 2026-09-22

| | OTTO 31-069 | Valucap 8869 |
|---|---|---|
| name | Otto Natural Baseball Cap | Five-Panel Twill Cap |
| base id | 1295 | - |
| silhouette | mid-profile 6-panel | **flat-brim snapback** |
| price w/ 1 imprint | $26.81 unit · $17.16 at 144 | $23.26 |
| colours | 5, **all with a Natural crown** | solid Black, Navy, Red, White, Khaki, Forest |
| black crown? | **no** | **yes** (Black, id 619, `323332`) |

The OTTO's colour name refers to the BRIM. Its crown is always natural, so a
dark-crown cap is not possible on that blank - which is why the 8869 was
sourced. It is the all-black snapback.

## Embroidery, measured not assumed

Apliiq confirms embroidery on both, up to 5 thread colours, 3D puff at
+$3.50 per colour.

- The OTTO front **auto-caps the badge at 2.00 x 2.02 in**. A 2.25in badge
  does not fit; Apliiq resized it without being asked.
- Stitch count: 6,522 at 3in, **2,898 at 2in**.
- Existing Touchline Cap wordmark for reference: embroidery, 3.75 x 1.3 in.

Stroke widths at finished size, against a ~1.0mm satin minimum:

| mark | size | ATHLETICS stroke, median |
|---|---|---|
| circular badge | 2.00in | 1.41mm |
| Modern Sport lockup | 3.50in | ~3.4mm |

The lockup has roughly double the margin. If only one file gets digitised,
it is the safer one.

## Artwork

`artwork/` holds the four files, with thread colour baked in so Apliiq's
picker resolves it automatically rather than defaulting to the art's own ink:

- `BADGE-INK.png` / `BADGE-CREAM.png`
- `LOCKUP-INK.png` / `LOCKUP-CREAM.png` (each keeps the red rule as a
  second thread colour)

## What these renders are NOT

Concept composites built on Apliiq's own blank photography at
supplier-verified dimensions. They are **not** Apliiq mockups and **not**
embroidery renders - the raised-thread look is a lighting treatment, not
simulated stitching. A real embroidery preview has to come from Apliiq
after a design is saved, and how the small ATHLETICS letters actually
resolve is decided by the digitiser, not by these files.

---

# UPDATE: black dropped, and both marks thickened for stitch

The owner declined the black snapback renders and kept the cream OTTO. The
8869 research stands as a record - it remains the only blank found with a
solid black crown - but no black concepts are carried forward.

## A correction, on the record

An earlier note in this file claimed the Modern Sport lockup had "roughly
double the margin" of the circular badge. **That was wrong.** It came from
taking the median stroke width of the whole lockup file, a figure carried
by the heavy GOOOL glyphs and the solid red rule. Measured by row band,
the lockup's ATHLETICS is the THINNEST element in either mark:

| element | size | p25 | median |
|---|---|---|---|
| lockup GOOOL | 3.5in | 2.94mm | 3.57mm |
| lockup red rule | 3.5in | 2.77mm | 2.77mm |
| **lockup ATHLETICS** | 3.5in | **0.57mm** | **0.57mm** |
| badge GOOOL | 2.0in | 2.36mm | 2.56mm |
| **badge ATHLETICS** | 2.0in | **1.27mm** | **1.41mm** |

Every part of the lockup's ATHLETICS sat below the ~1.0mm satin minimum.
It was not stitchable as drawn.

## What was thickened, and by how much

Dilation of the ATHLETICS glyphs only. GOOOL and the rule were already
clear and are untouched. The radius in each case is the smallest that
reaches target while keeping all nine letters separate - verified by
connected-component count, not by eye.

| file | dilation | p25 before | p25 after |
|---|---|---|---|
| `BADGE-*-THICK.png` | 4px | 1.27mm | **1.65mm** |
| `LOCKUP-*-THICK.png` | 16px | 0.57mm | **1.32mm** |

The lockup's ATHLETICS necessarily changes character: it was a light,
wide-tracked sans and is now medium weight. That is the unavoidable cost
of embroidering it at all, and it is a design change the owner should see
rather than have slipped past them.

`concepts/FINAL-*` are the two carried forward. Still composites, not
Apliiq mockups, and the digitiser still has the final say.
