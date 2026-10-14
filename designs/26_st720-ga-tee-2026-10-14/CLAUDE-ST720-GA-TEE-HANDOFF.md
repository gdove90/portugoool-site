# Claude: upload and launch the GOAL Athletics ST720 GA Tees (Apliiq + website)

Work in `C:\Users\gdove\OneDrive\Desktop\GOOOL`. Read `CLAUDE.md`, `brand/MARK-SYSTEM.md`, `ARTWORK-START-HERE.md` and `APLIIQ-UPLOAD-START-HERE.md` first. This package follows the format of `designs/25_core-hoodie-remake-2026-09-24/CLAUDE-CORE-HOODIE-HANDOFF.md`.

**Say up front** which role you are working in (Apliiq operator for the supplier steps, Next.js engineer for the site steps), and whether you are using helper agents. This package was prepared in the apparel production designer role, without helper agents.

## Owner decisions (14 Oct 2026)

- The brand is now **GOAL Athletics**. Artwork comes from the owner's AutoCap uploads (`uploads/AutoCap-*`). The legal entity (GOOOL Athletics LLC) and the domain (goool.shop) are unchanged until the owner confirms.
- The GA monogram is the company's main logo.
- Blank: **Sport-Tek ST720 Sustainable Athletic Tee**, chosen by the owner for this line. `CLAUDE.md` names the Bella+Canvas 3413 as the performance tee; this package is a separate, owner-requested line and does not replace the 3413 products.
- Two styles: **Minimal** (small GA on the left chest + stacked lockup on the back) and **Big** (horizontal GA + GOAL ATHLETICS lockup across the chest, no back print).
- Six colourways per style, twelve Apliiq designs. Indigo was dropped by the owner; don't add it back.
- Record this in `designs/00_asset-library/ST720-GA-TEE-DECISION.md` before touching Apliiq or code.

## Garment

- **Blank:** Sport-Tek ST720 PosiCharge Re-Compete Tee, 3.8 oz, 100% recycled polyester, tear-away label. Apliiq: `https://www.apliiq.com/customize/v5/mens/tshirts/Sustainable-Athletic-Tee/design`.
- **Garment colours (exact Sport-Tek names):** Black, True Royal, White, Silver, True Red. Confirm each swatch name in the Apliiq designer before saving.
- **Method:** DTF transfer, all placements. No DTG, screen print, sublimation, vinyl or embroidery.
- **Sizes sold:** S–XXL.

### Size data (Sport-Tek ST720 published measurements, flat)

| Size | Body length at back from HPS | Chest 1 in below armhole |
|---|---|---|
| S | 28 in | 20 in |
| M | 29 in | 21.5 in |
| L | 30 in | 23 in |
| XL | 31 in | 24.5 in |
| XXL | 32 in | 26 in |

Every print fits the S. Big front 10.00 in on a 20 in chest leaves 5.00 in to each side seam. Minimal GA spans 2.50–5.50 in from centre front, 4.50 in clear of the side seam.

## Owner's instructions to Claude

Before placing art, open the ST720 template (transfer print, size S) and record in your report and in `FILES.json` → `measurements`:

1. **Front and back print area sizes** Apliiq shows. The big front needs at least 10.00 in wide; the back needs 6.00 in. If either area is smaller, stop and report. Don't scale.
2. **Where the area starts** relative to the front and back collar seams. All positions below are measured from the seams, not from the area edge.
3. **Swatch hexes** for the five colours. If Silver reads darker than #A2AAAD, re-check the red A (see colour checks).

## Placements (same on every size)

| Zone | Style | Size (W × H) | Position |
|---|---|---|---|
| Left chest | Minimal | **3.00 × 2.70 in** (76.2 × 68.6 mm), 900 × 811 px | Wearer's left. Centre of art **4.00 in** (101.6 mm) left of centre front. Top of art **3.00 in** (76.2 mm) below the front collar seam at CF. |
| Upper back | Minimal | **6.00 × 2.26 in** (152.4 × 57.4 mm), 1800 × 679 px | Centred on centre back. Top of art **1.50 in** (38.1 mm) below the back collar seam at CB. |
| Centre chest | Big | **10.00 × 2.67 in** (254.0 × 67.8 mm), 3000 × 802 px | Centred on centre front. Top of art **3.00 in** (76.2 mm) below the front collar seam at CF. |
| Back | Big | No print | — |

All PNGs are tight-cropped, transparent, 300 dpi at final size. The visible top of the art is the file's top edge.

## Designs to save (12)

Name each design exactly as below (middle-dot separators).

| # | Apliiq design name | Garment | Front file | Back file | Ink |
|---|---|---|---|---|---|
| 1 | GOAL Athletics GA Minimal Tee · Black | Black | `01_GA-Minimal-Front_WhiteRed_3.00in.png` | `03_Stacked-Back_WhiteRed_6.00in.png` | White #FFFFFF + Red #E51226 |
| 2 | GOAL Athletics GA Minimal Tee · True Royal | True Royal | `02_GA-Minimal-Front_Cream_3.00in.png` | `04_Stacked-Back_Cream_6.00in.png` | Cream #F9F1DF |
| 3 | GOAL Athletics GA Minimal Tee · White · Black-Red | White | `07_GA-Minimal-Front_BlackRed_3.00in.png` | `08_Stacked-Back_BlackRed_6.00in.png` | Black #0A0A0A + Red #E51226 |
| 4 | GOAL Athletics GA Minimal Tee · White · Royal | White | `16_GA-Minimal-Front_Royal_3.00in.png` | `17_Stacked-Back_Royal_6.00in.png` | Royal Blue #03468F |
| 5 | GOAL Athletics GA Minimal Tee · Silver | Silver | `07_GA-Minimal-Front_BlackRed_3.00in.png` | `08_Stacked-Back_BlackRed_6.00in.png` | Black #0A0A0A + Red #E51226 |
| 6 | GOAL Athletics GA Minimal Tee · True Red | True Red | `10_GA-Minimal-Front_White_3.00in.png` | `11_Stacked-Back_White_6.00in.png` | White #FFFFFF |
| 7 | GOAL Athletics GA Big Tee · Black | Black | `05_Lockup-Big-Front_WhiteRed_10.00in.png` | none | White + Red #E51226 |
| 8 | GOAL Athletics GA Big Tee · True Royal | True Royal | `06_Lockup-Big-Front_Cream_10.00in.png` | none | Cream #F9F1DF |
| 9 | GOAL Athletics GA Big Tee · White · Black-Red | White | `09_Lockup-Big-Front_BlackRed_10.00in.png` | none | Black + Red #E51226 |
| 10 | GOAL Athletics GA Big Tee · White · Royal | White | `18_Lockup-Big-Front_Royal_10.00in.png` | none | Royal Blue #03468F |
| 11 | GOAL Athletics GA Big Tee · Silver | Silver | `09_Lockup-Big-Front_BlackRed_10.00in.png` | none | Black + Red #E51226 |
| 12 | GOAL Athletics GA Big Tee · True Red | True Red | `12_Lockup-Big-Front_White_10.00in.png` | none | White #FFFFFF |

All files are in `designs/26_st720-ga-tee-2026-10-14/print/`. Checksums are in `FILES.json`.

### Colour checks (planning values; Sport-Tek PMS references)

- Black (PMS Black C): white 19:1, red 4.4:1.
- True Royal (PMS 7687C, about #1D428A): cream 8.6:1.
- White: black 19:1, red 4.6:1, Royal Blue 9.6:1.
- Silver (PMS 429C, about #A2AAAD): black 8.9:1, **red 2.0:1**. The red A reads weak on Silver. The owner approved Silver; flag it on the proof and ask the owner before saving if the Apliiq proof shows the A fading.
- True Red (PMS 200C, about #BA0C2F): white 6.6:1. The tee is white-ink only; there is no red-on-red.
- Ask for colour matches to #E51226, #03468F and #F9F1DF on the DTF proof.

## Print check (measured at final size, 300 dpi, `tmp/measure.js`)

- **GA, 3.00 in:** smallest gap 3.33 mm. Stroke reading 1.9 mm is the pointed tips of the G and A, which taper to zero at any size (same treatment as wedge apexes in earlier packages). Straight strokes are above 2 mm. GA minimum is 3.0 in wide (`CLAUDE.md`); **don't go smaller**.
- **Stacked back, 6.00 in:** smallest stroke 2.65 mm. Gap reading 1.98 mm is a taper inside the ATHLETICS lettering. **Don't scale it down.**
- **Big lockup, 10.00 in:** smallest gap 2.35 mm; 1.9 mm stroke reading is the GA tips.
- **Source quality:** files were enlarged from the owner's PNGs (GA 675 px, lockup 1125 px) and their edges sharpened again. Before saving, ask the owner for the vector masters (SVG/PDF/AI). If they arrive, re-export at the same sizes, re-measure and update `FILES.json`. If not, save with these files and say so in the report. Watch the 10 in front on the proof for soft edges.

## Production notes (paste into Apliiq, one per zone)

Minimal front:

> FRONT · DTF. GA monogram 3.00 x 2.70 in, wearer's left chest. Centre of art 4.00 in left of centre front. Top of art 3.00 in (76.2 mm) below front collar seam at CF. Same on every size. Do not scale. Match inks to file.

Minimal back:

> BACK · DTF. Stacked lockup 6.00 x 2.26 in, centred on centre back. Top of art 1.50 in (38.1 mm) below back collar seam at CB. Same on every size. Do not scale. Match inks to file.

Big front:

> FRONT · DTF. Lockup 10.00 x 2.67 in, centred on centre front. Top of art 3.00 in (76.2 mm) below front collar seam at CF. Same on every size. Do not scale. Match inks to file.

## Label

The current private label reads GOOOL ATHLETICS. Don't add it to these designs and don't make a GOAL label without an owner-approved mockup. Save with the ST720's tear-away label and report it as pending.

## Apliiq steps

1. Open the ST720 customizer and confirm the product is **Sport-Tek Sustainable Athletic Tee (ST720)**.
2. Take the measurements in "Owner's instructions to Claude". Record them.
3. For each row in the design table: select the garment colour and confirm the swatch name. Upload the front file, set size and position from the placement table, then the back file (Minimal only).
4. Check the dimensions Apliiq shows match the placement table exactly. Paste the production note for each zone.
5. Name the design exactly as in the table. Recheck the colour, save, reopen, and capture front and back proofs, the design ID and the dimensions.
6. Check every size from S to XXL keeps the same scale and placement. On S, confirm the big front stays inside the print area and the minimal GA stays clear of the side seam and armhole. Report any supplier constraint rather than resizing.
7. Read the dropship quote for each style (S and XXL) from the first saved design of each. Don't make duplicate designs or delete anything.

## Price

Use the model in `designs/18_launch_operations/PRICING-25-PERCENT.md`:

floor = (worst-size Apliiq quote + $3 label contingency + $1 fulfilment + $0.30 card fee) ÷ 0.671, rounded up to the next dollar.

- Minimal has two transfers (front + back); Big has one large front. Quote each style separately.
- Apliiq lists the ST720 from $10.60 blank. No decorated quote has been read yet; record `quote_verified: false` until it is.
- Don't set a display price. Report the two floors to the owner and wait for the price.

## Website

- Two products: **GOAL Athletics GA Minimal Tee** and **GOAL Athletics GA Big Tee**. Use the next unused ids in `products.ts` and `supabase/`; add the Supabase rows with `ensureProductRows` plus a migration, as on earlier products.
- Variants, in this order, on both products: Black, True Royal, White · Black-Red, White · Royal, Silver, True Red. Every variant uses `supplierColor` equal to the exact Apliiq name (both White variants use "White"), and maps to its own design ID in `fulfillment.ts`.
- Sizes S–XXL.
- The site still uses the GOOOL brand. Don't rebrand the site, header or footer in this task; product names and images use GOAL Athletics. Report this mismatch to the owner.
- Build front and back gallery images from the real ST720 blank and these files, positioned from the seam distances above. Keep "Concept render. Not a photograph of a manufactured sample." until a sample is photographed.
- Don't publish or activate checkout until the owner sets the price.

## Not included

No paid orders, samples or checkout activation. Report: the 12 design IDs, proof URLs, measured template figures, the two dropship quotes and floors, and anything pending (vector masters, label, price, site rebrand).

## Files in this folder

- `CLAUDE-ST720-GA-TEE-HANDOFF.md` (this file)
- `PRODUCTION-NOTES.md`
- `FILES.json` (sha256 and sizes of all 15 print files, plus the measurements to fill in)
- `print/` (15 PNGs, 300 dpi, final size)

The visual proof is `ST720 GA Tee Proof.dc.html` in the design project.
