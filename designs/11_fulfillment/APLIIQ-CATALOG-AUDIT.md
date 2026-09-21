# Apliiq full-catalog reconciliation (started 2026-09-21)

Workflow: the previously successful Apliiq work was in-session
**browser-pane automation** (no named skill exists): authenticated
apliiq.com session in Claude's browser pane, the old customizer with
real drag events on `.svgWrap` for placement persistence, saved-design
verification by reopening, and `POST /merchandise/detail` for garment
records and per-size SKUs. That is the workflow this audit resumes.

Status legend: VERIFIED = confirmed against the live Apliiq account
this audit; PRIOR = verified in the 2026-09-17/18 session and recorded
in apliiq-product-mapping.md, awaiting re-verification; MISSING = no
saved design exists; BLOCKED = needs the authenticated session.

## Current catalog (source of truth: src/lib/products.ts, live site)

Ten products, fourteen colorways. The old nine/thirteen count is
superseded by the Modern Sport Performance addition (owner update
2026-09-21).

| # | Product / color | Blank (spec) | Saved design | Per-size SKUs | Status |
|---|---|---|---|---|---|
| 1 | Performance Badge Tee / Black | Sport-Tek ST720 Black | 6098962 | APQ-6098962S{6,7,8,1,2}A1 | PRIOR |
| 2 | Performance Badge Tee / White | ST720 White | 6099046 | APQ-6099046S{6,7,8,1,2}A1 | PRIOR |
| 3 | Performance Badge Tee / True Royal | ST720 True Royal | 6099129 | APQ-6099129S{6,7,8,1,2}A1 | PRIOR |
| 4 | Core Hoodie / Black | Independent IND4000 Black | 6098974 | APQ-6098974S{6,7,8,1,2}A1 | PRIOR |
| 5 | Core Hoodie / Bone | IND4000 Bone | 6099064 | APQ-6099064S{6,7,8,1,2}A1 | PRIOR |
| 6 | Casual Wordmark Tee / Washed Black | Bella+Canvas 4810GD Washed Black | 6098963 | APQ-6098963S{6,7,8,1,2}A1 | PRIOR |
| 7 | Casual Wordmark Tee / Washed Grey | 4810GD washed grey | 6099060 | APQ-6099060S{...}A1 | PRIOR |
| 8 | Touchline Cap / Black-Natural | OTTO 31-069, front embroidery only | 6098980 | APQ-6098980S34A1 (OS) | PRIOR |
| 9 | Modern Sport Tee / Black | BC 3010 Black (packet proposal) | none | none | MISSING |
| 10 | Varsity Tee / Washed Black | 4810GD Washed Black (packet proposal) | none | none | MISSING |
| 11 | Minimal Club Tee / Natural | BC 3010 Natural (packet proposal) | none | none | MISSING |
| 12 | Circular Badge Tee / Ivory | Comfort Colors 1717 ivory (UNVERIFIED) | none | none | MISSING |
| 13 | Circular Crewneck / Gray Heather | AS Colour 5150 Athletic Heather | 6112046 | APQ-6112046S{6,7,8,1,2}A1 | VERIFIED |
| 14 | Modern Sport Performance Tee / Black | ST720 Black (candidate, verify set-in sleeves) | none | none | MISSING |

Per-size mapping completeness: rows 1-8 have full offered-size SKU
coverage recorded in `src/lib/fulfillment.ts` (S-2XL scheme S6/S7/S8/
S1/S2; cap one-size S34). Rows 9-14 have zero SKU coverage.

## Artwork authority for the missing designs

- Modern Sport (cotton and performance): GA-01-F_3300px / GA-01-B_975px
  print masters. KNOWN DEFECT: rough extracted edges and small holes
  (QA-NOTES) - faithful cleanup required before supplier upload.
  Rear mark is WHITE ONLY, no red underline.
- Varsity: GA-02-F_3300px / GA-02-B_975px. Rear mark IVORY ONLY.
- Minimal Club: GA-03-F_1050px (front left chest) / GA-03-B_3600px
  (large rear with red rule).
- Circular pair: production masters DO NOT EXIST yet; prepare from
  designs/16_goool_athletics/logos/GOOOL_ATHLETICS_CIRCULAR_WORDMARK_1254px.png
  (approved reference) at 3 in (badge tee) and 2.5 in (crewneck).
- Decoration: DTF per current project records. Cap remains front
  embroidery only (owner removed the side slogan).

## Completion update (2026-09-22, authenticated session via Chrome)

All eight PRIOR rows re-verified live (garment, color, origin, actual
per-size SKUs from /merchandise/detail). Five missing designs CREATED,
placed with the packet dimensions, saved, reopened and verified
(views, artwork sizes, colors, SKUs read back):

- 6112026 GOOOL Athletics Modern Sport Tee - BC 3010 black, F 11x3.73
  + B 3.25x1.11 (white only), Front+Back confirmed.
- 6112032 GOOOL Athletics Varsity Tee - 4810GD Washed Black,
  F 11x5.28 + B 3.25x1.56 (ivory only), Front+Back confirmed.
- 6112018 GOOOL Athletics Minimal Club Tee - BC 3010 Natural,
  F 3.5x1.1 wearer-left badge + B 12x4.63, Front+Back confirmed.
- 6112033 GOOOL Athletics Circular Badge Tee - C1717 Ivory (made in
  Dominican Republic), front-only 3x3 navy badge, sizes S-3XL.
- 6112037 GOOOL Athletics Modern Sport Performance Tee - ST720 black
  (Ethiopia, set-in sleeves), F 11x3.73 + B 3.25x1.11.

Workflow notes discovered this session (for future runs): the
customizer multi-selects colors (deselect the default before saving);
switching view tabs re-binds the currently SELECTED artwork to the new
view, so deselect (click empty canvas) after each placement; artwork
placement view is confirmed by the svgWrap image#### class and,
authoritatively, by merchandise/detail images[].ViewLabel.

Superseded intermediates 6112001 and 6112012 are renamed "SUPERSEDED
do not use" (not deleted, per the no-deletion rule); the owner may
delete them.

Vertical placement uses the box-calibration convention (print box top
= collar + 0.91in) carried over from the approved capsule designs;
physical sample proofs remain the final geometric gate.

## Final colorway closed (2026-09-21, owner decision + same-session build)

OWNER DECISION: Athletic Heather approved for the Circular Center
Crewneck. The four colors offered on AS Colour 5150 Made Crew were
re-read live from the customizer before building - black (50), Natural
(923), Ink Blue (2846), Athletic Heather (2873) - independently
confirming that no "gray heather" exists on this blank.

- 6112046 GOOOL Athletics Circular Center Crewneck - AS Colour 5150
  Made Crew (garment 1488, 100% cotton French terry, made in China),
  Athletic Heather ONLY (color 2873, default black deselected), front
  2.5 x 2.53 in forest-green circular mark from
  GA-CIRCLE-09-FOREST-PRINT.png, transfer print, FRONT VIEW ONLY (back
  blank per spec). Sizes s-xxxl (6; no XS on this blank, so the sold
  S-2XL range is fully covered). Reopened and verified against
  merchandise/detail, and the rendered mockup visually confirms a small
  centered upper-chest mark.

All 14 colorways now have verified saved designs and per-size SKUs.

### Placement note specific to this build

The saved geometry is X 442 / Y 566 / W 64 / H 65 in the customizer's
canonical space (25.6 px/in = DOM 8 px/in x scaleSize 3.2). Against the
15 x 19 in print box at X 281.6 / Y 499.2 that is horizontally centered
and 2.61 in below the box top, i.e. 3.52 in below the collar seam on
the box-calibration convention (target 3.50 in; 0.02 in of integer-pixel
rounding, well inside the +/-0.25 in tolerance).

WORKFLOW CORRECTION for future runs: `designState.GetSelectedArts()`
(the save payload) is built from the MODEL, not from the DOM. Writing
`.svgWrap` CSS alone changes nothing, and synthetic jQuery-UI resize
drags did not take either. What worked was setting the artwork model
fields - `position.left/top`, `size.width/height`, `Width_Inch`,
`Height_Inch` - and the matching CSS, then saving. Two further traps
hit this session: resizing the browser window RESET the color selection
back to the default (re-check colors immediately before saving), and
the canvas silently re-renders at a different scale (scale16 -> 8 px/in),
so always re-measure the print box and derive px/in from it rather than
reusing a remembered scale.

## Original blocked / next actions (superseded above)

1. BLOCKED on the authenticated apliiq.com session (login page is up
   in the browser pane; owner signs in as hello@goool.shop, no stored
   password). Everything below resumes the moment it exists:
   re-verify rows 1-8 (reopen each saved design, confirm garment,
   artwork, placement persisted); verify blank availability for rows
   9-14 (esp. Comfort Colors 1717 ivory, AS Colour 5150 gray heather,
   ST720 Black construction); create the six missing unpaid saved
   designs with real drag placement; reopen each to confirm
   persistence; read actual per-size SKUs from /merchandise/detail.
2. Clean the GA-01 master edges faithfully before any upload.
3. On any unavailable blank/color: present the closest available
   alternative with material/fit/cost differences; owner chooses; no
   silent substitution.
4. Update this table + reconciliation.json + fulfillment.ts as each
   row is verified.

No paid orders, no deletions, no payment changes, purchasing stays
closed; sample-approval gates preserved.
