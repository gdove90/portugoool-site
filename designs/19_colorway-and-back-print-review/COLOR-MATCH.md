# Front/back color matching — 2026-09-21

Owner instruction: match garment and lettering colors between front, back and detail views for each colorway. In particular, the crewneck back must use the front badge's green and rounded upright font on the shallow U collar curve.

The new `crewneck-color-match-review-v4.png` provides a matching front/back concept. It supersedes v3 for color review. Built-in image_gen was used; the exact prompt is in `generation-prompt.json`. Original front and back website assets are preserved. AI imagery is a visual concept, not the production lettering source or a colorimetric proof.

## Measured artwork colors

Read-only audit of all 13 active colorway packages, using the packaged PNG upload candidate (including the colored circular derivatives), excluding archived cotton Modern Sport:

| Product with front/back lettering | Front main ink | Back main ink | Finding |
|---|---|---|---|
| Varsity, Washed Black | `#E8DFCA` | `#E8DFCA` | Main ivory matches; front burgundy accent remains intentional |
| Minimal Club, Natural | `#171717` | `#171717` | Main black matches; existing back red underline remains intentional |
| Modern Sport Performance, Black | `#FFFFFF` | `#FFFFFF` | Main white matches; existing front red accent remains intentional |
| Circular Crewneck, Gray Heather | `#0A371E` | Required: `#0A371E` | Current supplier package is front-only; curved back master still pending |

Other current pieces have front decoration and blank backs. Their back garment shade must match the front. Proposed second colors need the same paired review before implementation. Do not add accents to faces that were intentionally plain.

`COLOR-AUDIT.json` contains source paths, hashes and dominant opaque colors. Dominant ink equality does not certify every pixel, mockup lighting, actual supplier uploads or physical prints. The circular original raster is the shape source; its dark colors must not be mistaken for the colored upload derivative.

## Production handoff

Use `#0A371E` in both crewneck production faces, derived from `GA-CIRCLE-09-FOREST-PRINT.svg` and its PNG export. Reuse the front badge's source glyph shapes for the curved back. Do not trace the generated mockup. Use one ink specification for both faces and review them under the same proof conditions. Keep garment shade consistent across full and detail images.

Existing actual-size lettering failures remain unresolved; see `LETTERING-PREFLIGHT.json` in the main review folder. Prepare source-based thickness/spacing revisions and supplier proofs before manufacturing. Current crewneck pricing still covers a blank back; the extra print cost and final 25% margin require verification.

Next-action prompt: Prepare a source-based crewneck curved-back proof using the front badge's rounded upright glyphs and identical forest green #0A371E. Correct the previously measured small-lettering failures, show actual-size paired front/back proofs, and verify supplier print and sewn-label costs against the 25% target before production.
