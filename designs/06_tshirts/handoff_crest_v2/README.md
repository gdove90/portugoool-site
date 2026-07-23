# GOOOL Crest V2 — Shirt Lineup Handoff

Approved lineup from design review (July 2026). Implement in the repo at
`C:\Users\gdove\OneDrive\Desktop\Portugoool`. Read `CLAUDE.md` first.
Work on a feature branch (suggested: `design/crest-v2-shirt-lineup`), not main.

## What this package contains
- `mockups/` — 12 composited mockups (front+back per SKU), spec-accurate scale.
  → copy to `designs/06_tshirts/` in the repo (concepts/mockups, NOT public/)
- `production/` — print-ready transparent PNGs, 300 PPI at final size, sRGB.
  → stage under `designs/06_tshirts/handoff_crest-v2-line/production/`
- `LINEUP.md` — the lineup proposal doc → `designs/06_tshirts/` (follow folder naming style)

## Locked POD product
All 6 SKUs print on the **American Apparel 1301GD Unisex Garment-Dyed Heavyweight
Cotton Tee** via **DTF printing** on Printful. Per-SKU exact specs live in `specs/`
(one file per SKU — garment color hex, artwork file, placement, print widths).
Colorways from the Printful dashboard: Faded Black #55565A · Faded Navy #4F5C71 ·
Faded Cream #FFF9E9.

## The 6 SKUs
| SKU | Garment | Placement | Artwork | Files |
|---|---|---|---|---|
| GOOOL-CREST-V2-DTF-LIGHT-LC-25 | Faded Cream #FFF9E9 | Left chest 2.50"w (pro jersey scale) | Light 2-color | crest LC + shoulder wordmark LIGHT + hem GREY |
| GOOOL-CREST-V2-DTF-DARK-LC-25 | Faded Black #55565A | Left chest 2.50"w (pro jersey scale) | Dark reverse | crest LC + shoulder wordmark DARK + hem WHITE |
| GOOOL-CREST-V2-DTF-LIGHT-CC-75 | Faded Cream #FFF9E9 | Center chest 7.50"w | Light 2-color | crest CC + shoulder wordmark LIGHT + hem GREY |
| GOOOL-CREST-V2-DTF-DARK-FB-105 | Faded Black #55565A | Full back 10.50"w + LC 3.25" front | Dark reverse | FB crest + LC crest (no shoulder wordmark — full-back crest instead) |
| GOOOL-CREST-V2-DTF-ONEWHT-CF-9 | Faded Navy #4F5C71 | Center front 9.00"w | One-color white | crest CF + shoulder wordmark ONEWHT + hem WHITE |
| GOOOL-CREST-V2-DTF-DARK-LC-25-NVY | Faded Navy #4F5C71 | Left chest 2.50"w (pro jersey scale) | Dark reverse | crest LC + shoulder wordmark DARK + hem WHITE |

## Back treatment (all SKUs except FB-105)
- Shoulder blades: `GOOOL-WORDMARK-V2-SHOULDER-*.png` at 7.0" wide, centered,
  top edge ~2" below back collar. This is the crest's own wordmark + divider
  cropped 1:1 from the approved master — never retype it.
- Hem: `GOOOL-HEM-URL-*.png` at 5.0" wide, centered, bottom-aligned to the
  lowest allowed back-print position. Grey on white bodies, white on black/grey/red.

## Spec compliance (from GOOOL_Crest_POD_Production_Specification.pdf)
- Crest ratio locked 201:256; files are already at final print size @300 PPI — upload as-is, do not resize/recolor/effect
- Variant per garment: Light on white, Dark on black, one-color on grey/red
- Colors: black #000000, red #C61322, white = negative space
- No caps/small placements from this master

## Execution specs — POD print on cotton tees (Printful/Printify — the 6 tee SKUs)
- Products: 100% cotton tees from the POD catalog (Bella+Canvas 3001 / Comfort Colors 1717 class); "sport grey" = the catalog's Athletic/Sport Heather variant
- Upload the `production/` PNGs as-is: transparent background, sRGB, 300 PPI ("DPI: 300" must show in Printful's file check — no "low resolution" warning)
- In the mockup generator, set print size to the EXACT final width in the filename (LC-25 = 3.25", CC-75 = 7.5", CF-9 = 9", FB-105 = 10.5") — never stretch to fill the print area
- Placements in the POD editor:
  - Left chest (all LC SKUs): crest 2.50"w × 3.18"h (≈8cm, elite-kit scale), heart position — crest TOP 4.0" below the collar/shoulder seam junction, crest CENTER 4.0" left of the center line. One position, every colorway.
  - Centered crests (CC-75 / CF-9): dead center, crest TOP edge 3.5" below the center-front collar seam — upper chest, clear of the collar seam, never stomach-level.
  - Full back (FB-105): centered, crest top 4.5" below back collar seam (name/number zone, clear of the shoulder yoke)
  - Shoulder wordmark: back placement, 7.0" wide, top ~2" below back collar — same back print file can include the hem URL if the platform allows only one back print: stack wordmark (top) + URL (bottom-aligned) in one back-area file on request
  - Hem URL: 5.0" wide, centered, dragged to the lowest allowed back position
- POD handles underbase/pretreatment automatically — the correct variant per garment color is what matters: Light on white, Dark on black, one-color black on grey, one-color white on red
- Colors are solid spot shapes (no gradients/halftones) — DTG-safe on every catalog printer; expect #C61322 to print slightly deeper on dark garments (normal)
- Order one sample per SKU before publishing; check the white negative space inside the crest on the black tee sample

## Execution specs — POD embroidery on athletic wear (Printful embroidery products: polos, quarter-zips, jackets)
- Placement: LEFT CHEST ONLY, set width to 2.75" (height follows the locked 201:256 ratio ≈ 3.5"); caps remain NOT approved for this master
- Upload the one-color PNG for the garment (`onecolor-black` on light garments, `onecolor-white` on dark) OR the vector `GOOOL_Crest_Working_Vector_Trace.svg` from the repo if the platform accepts SVG — Printful digitizes automatically and sends a stitch-file preview
- Technique: FLAT embroidery only — decline 3D puff/partial puff options
- Thread colors: map to catalog threads nearest black, white, and red #C61322 — max 3 threads, no blends
- Small-detail warning: the ball motion swooshes may fall below POD minimum stitch width at 2.75" — if the digitization preview drops or muddies them, either bump to 3.0"w or request the simplified one-color version without swooshes
- ALWAYS approve Printful's digitized preview (and ideally a physical sample) before publishing — embroidery digitization is the single biggest quality risk in the line

## Legal checklist
- No federation/FIFA/UEFA marks, no player references, no Nike/adidas/Puma elements — all-original crest ✓
- "Summer '26" language only, never "World Cup" ✓
- Product listings use real product photos only — these mockups are design refs, not listing imagery ✓

## Out of scope (per task rules)
Do NOT create/modify live products in src/lib/products.ts, Printify, or Supabase.
Listing comes after physical samples pass.
