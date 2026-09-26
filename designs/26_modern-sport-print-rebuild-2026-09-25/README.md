> **Superseded 2026-09-25 (later the same day):** the 3.25 in back on
> 6112037 / 6113361 failed the 2 mm minimum on re-measurement. Both
> designs were renamed "delete" on Apliiq and replaced by 6136475 (Black),
> 6136494 (True Royal) and 6136511 (White) with the v6 back at
> 5.00 x 1.812 in. See
> [designs/31_matchday-tee-v6-all-colours-2026-09-25/README.md](../31_matchday-tee-v6-all-colours-2026-09-25/README.md).

# Modern Sport Performance Tee — GA-01 print rebuild (2026-09-25)

Correction of the GOOOL Athletics Modern Sport Performance Tee print
artwork so every lettering stroke clears Apliiq's DTF minimum, applied to
the two saved designs and to the website imagery. Audit that triggered it:
`output/modern-sport-print-scale-audit-2026-09-25.md`.

**Artwork compliance is done. Physical production approval is not:** no
supplier proof, printed sample or wash test exists for this artwork. See
"What remains unverified" at the end.

## Verified supplier setup (read from the account, 2026-09-25 ~02:30 AM ET)

| | Black | True Royal |
|---|---|---|
| Saved design | 6112037 | 6113361 |
| Blank | Sport-Tek ST720 "sustainable athletic tee", 100% recycled polyester, made in Ethiopia | same |
| Decoration | transfer print (DTF), full color, both placements | same |
| Front | `ga-01-f_3300px_clean` at **11 in x 3.73 in** | same |
| Back | `ga-01-b_975px_clean` at **3.25 in x 1.11 in** | same |
| Sizes offered | 7 (XS–XXXL); the site sells S–XXL | same |
| Website | `/shop/goool-athletics-modern-sport-performance-tee`, Black + True Royal colourways, `fulfillment.ts` maps S–XXL SKUs `APQ-6112037…` / `APQ-6113361…` | |

The customizer holds one print size for every garment size; nothing in
the saved design scales the art per size, so the stroke figures below
apply to XS through XXXL alike. Placement offsets are not exposed as
numbers in this view of the saved design; the package v2 targets (front
top 3 in below the front collar seam, back top 2 in below the rear collar
seam, both centred) remain the documented intent and still need a
dimensioned supplier proof.

The cotton Modern Sport Tee (saved design 6112026, Bella+Canvas) is a
separate product and was not touched.

## The problem, measured

Apliiq's transfer-printing guidance (help.apliiq.com, read 2026-09-25):
PNG, RGB, 300 dpi at print size, every pixel 100% opaque, **all parts of
the font at least 2 mm thick**, isolated details under 2 mm may not
transfer, avoid sharp points, add a stroke to thin lettering.

| | old back @ 3.25 in | old front @ 11 in (saved) | old front @ 9 in (proposal) |
|---|---|---|---|
| ATHLETICS stem | 8 px = **0.68 mm** | 22 px = **1.86 mm** | 22 px = **1.52 mm** |
| ATHLETICS cap height | 4.8 mm | 13.4 mm | 10.9 mm |
| GOOOL stroke (median) | 3.4 mm | 11.4 mm | 9.3 mm |

Every letter of ATHLETICS failed on the back by a factor of three, and
the front failed at either width. At 4.8 mm cap height a 2 mm stroke
would close the A and E, so the back lettering had to be re-sized as well
as thickened; "just outline it" was not an option.

## What was done to the artwork

`scripts/rebuild-modern-sport-athletics.py` (deterministic, re-runnable):

- **GOOOL wordmark and red underline: unchanged.** Taken pixel for pixel
  from the front upload master (the highest-resolution source of the
  mark) and used for both faces; the old back file was the same mark at
  975 px. Underline colour sampled from the master: RGB 197,45,50.
- **ATHLETICS: re-set from the original glyphs.** Each of the nine
  original letterforms was scaled to the new cap height and thickened by
  an even round expansion of every edge (for a monoline glyph this is the
  same as re-stroking its own centreline heavier: Apliiq's "add a stroke"
  done evenly, without changing the letter skeleton). Two pinholes that
  the expansion left where the A's crossbar meets its legs were filled.
  Letters were re-spaced so the word keeps its original width relative to
  the wordmark; the block is centred under the mark as before.
- Corners are rounded by the expansion radius (0.5 mm front, 0.7 mm
  back), which also removes the sharp terminals Apliiq warns about. The
  wordmark's own O-cut tips are pointed by design and were left alone
  (see below).
- Exports are RGB PNG with **binary alpha** (only 0 and 255): every
  printed pixel is 100% opaque.

### Measured result (MEASUREMENTS.json, OPENING-TEST.json)

| | back @ 3.25 in | front @ 11 in (saved) | front @ 9 in |
|---|---|---|---|
| File / effective ppi | `GA-01-B_v3_1950px_600ppi.png`, 600 ppi | `GA-01-F_v3_3300px.png`, 300 ppi | same file, 366.7 ppi |
| Visible artwork | 82.55 x 28.91 mm (3.25 x 1.138 in) | 279.4 x 94.49 mm (11 x 3.72 in) | 228.6 x 77.31 mm (9 x 3.04 in) |
| ATHLETICS stroke, median | **2.37 mm** | **3.22 mm** | **2.63 mm** |
| ATHLETICS stroke, per-letter minimum (terminal spurs excluded) | 2.04 mm (S), all others ≥ 2.06 | ≥ 2.36 mm | ≥ 1.93 mm (A apex), others ≥ 2.08 |
| ATHLETICS cap height | 8.34 mm | 14.65 mm | 11.98 mm |
| Word width / letter gap | 74.3 mm / 2.73 mm | 204.5 mm / 14.5 mm | 167.3 mm / 11.9 mm |
| Smallest open counter (A) | 2.2 mm inscribed | 3.6 mm | 2.9 mm |
| S/C apertures | 1.33 mm inscribed | 3.0 mm | 2.4 mm |
| GOOOL O-cut channel (negative gap) | 1.64–1.73 mm | 5.6–5.9 mm | 4.6–4.8 mm |
| 2.0 mm round-opening test: pixels removed | 1.5 % (all on wordmark tips and G/L corners) | 0.08 % | 0.16 % |

The opening test is the decisive check: a 2.0 mm disc is rolled through
the artwork and whatever it cannot reach is thinner than 2 mm. On every
face the only such pixels are the pointed tips of the O-cuts and the
acute corners of the G and L in the wordmark (overlays in `proofs/`,
red). None are on ATHLETICS. Those tips are part of the mark's design;
Apliiq's guidance says sharp points "may not transfer perfectly", meaning
a tip prints slightly blunted, which does not affect legibility. They are
noted for the proof review, not changed.

Front weight was chosen for the 9 in case so that both candidate widths
comply; at the saved 11 in it lands at 3.2 mm.

## Front width: 11 in (saved) versus 9 in (package v2 proposal)

The account resolves the record conflict: **11 in is what is saved and
what would print today**, on both colourways. The 9 in figure exists only
in the 2026-09-21 v2 package as an authored target and was never applied.
Nothing was changed about the size: the corrected files were linked to
the placements as they stand. Both options are compliant with the v3
file; the owner's decision is only about the look:

| | 11 in (current) | 9 in (proposal) |
|---|---|---|
| Wordmark width | 279 mm, 11.0 in | 229 mm, 9.0 in |
| Artwork height | 94 mm, 3.7 in | 77 mm, 3.0 in |
| ATHLETICS stroke | 3.2 mm | 2.6 mm |
| Effective resolution | 300 ppi (exact) | 367 ppi |
| Fit on a size S ST720 chest (~18 in wide) | 61 % of chest width | 50 % |

Recommendation: keep 11 in. It is the saved setting, it is exactly 300
ppi, and the site renders were drawn at that proportion. Switching to
9 in means editing the size on both designs in the customizer and a new
placement proof. Print `proofs/PROOF-front-11in.png` and
`proofs/PROOF-front-9in.png` at 100% and hold them against a tee to
decide.

## What was changed in the Apliiq account

On each saved design, per placement, "… → upload hi res" was used to link
the v3 file as the production file. The placement's own art and size were
left exactly as saved (this is the supplier's mechanism for supplying the
production-resolution file behind a placement; it does not recreate the
design, so the design IDs and every size SKU are unchanged). Activity log
entries, as shown after reopening each design:

| Design | Placement | Log entry |
|---|---|---|
| 6112037 Black | front | 9/25/2026 2:37:57 AM — new hi res file uploaded 'GA-01-F_v3_3300px.png (27.05 KB)' |
| 6112037 Black | back | 9/25/2026 2:40:19 AM — new hi res file uploaded 'GA-01-B_v3_1950px_600ppi.png (13.67 KB)' |
| 6113361 True Royal | back | 9/25/2026 2:43:54 AM — new hi res file uploaded 'GA-01-B_v3_1950px_600ppi.png (13.67 KB)' |
| 6113361 True Royal | front | 9/25/2026 2:44:50 AM — new hi res file uploaded 'GA-01-F_v3_3300px.png (27.05 KB)' |

No design was created, duplicated or deleted; `fulfillment.ts` needed no
change. Apliiq's own mockup thumbnails still draw the placement art (the
old thin lettering); production uses the linked hi-res file. If the
mockups matter, the placement art can be replaced in the customizer,
which is a larger edit and was not done here.

## Website imagery (V3)

The four product images are the existing concept renders with the v3
artwork composited in place of the old print
(`scripts/composite-modern-sport-v3-imagery.py`, records in
`SITE-IMAGERY-V3.json`): the old print is detected and painted out, and
the v3 art is placed at the same scale and position, matched on the
wordmark's width and top-left, with a mild fabric-shading pass. Framing,
garment and background are untouched; the depicted print size is the one
the previous renders already showed. Captions still say "Concept render.
Not a photograph of a manufactured sample." The V2 files are in
`designs/_archive/modern-sport-performance-imagery-v2-2026-09-21/`.

Deployed to goool.shop (deploy 6ab6173f, 2026-09-25) behind the preview
gate; the four V3 files verified live byte for byte through the gate.

## Files

- `exports/GA-01-F_v3_3300px.png` — front production export (3300 x 1116)
- `exports/GA-01-B_v3_1950px_600ppi.png` — back production export, 600 ppi (1950 x 683)
- `exports/GA-01-B_v3_975px_300ppi.png` — back at 300 ppi
- `proofs/PROOF-*.png` — dimensioned actual-size sheets (300 ppi, print at 100%)
- `proofs/opening-test-2mm-*.png` — prepress overlays
- `proofs/preview-*-on-dark.png`, `proofs/site-imagery-v2-vs-v3.png`
- `MEASUREMENTS.json`, `OPENING-TEST.json`, `SITE-IMAGERY-V3.json`, `FILES.json` (sha256 of everything above and of the superseded masters)
- Scripts: `scripts/rebuild-modern-sport-athletics.py`, `scripts/composite-modern-sport-v3-imagery.py`
- Superseded, kept unchanged in place: `designs/16_goool_athletics/print_masters/upload/GA-01-F_3300px_CLEAN.png`, `GA-01-B_975px_CLEAN.png`

## What remains unverified

- **No physical proof or sample.** The 2 mm figure is Apliiq's published
  recommendation; whether these strokes hold on the ST720's polyester
  under their DTF process is only known from a printed sample. Order one
  sample of each colourway (owner authorisation required; not placed).
- Placement offsets on the garment (3 in / 2 in below the collar seams)
  are the documented targets, not a supplier-confirmed measurement.
- The wordmark's pointed O-cut tips (below 2 mm at the very tip by
  geometry) should be looked at on the sample.
- Apliiq's mockup thumbnails still show the old placement art.
- Wash durability: untested.
