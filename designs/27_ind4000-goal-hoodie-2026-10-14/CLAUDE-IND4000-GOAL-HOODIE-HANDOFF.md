# Claude: upload and launch the GOAL Athletics IND4000 Hoodies (Apliiq + website)

Work in `C:\Users\gdove\OneDrive\Desktop\GOOOL`. Read `CLAUDE.md`, `brand/MARK-SYSTEM.md`, `APLIIQ-UPLOAD-START-HERE.md`, `designs/26_st720-ga-tee-2026-10-14/CLAUDE-ST720-GA-TEE-HANDOFF.md` and `uploads/GOAL Stacked Colorways/05 Guides/READ ME.txt` first. This package follows the format of the ST720 tee handoff.

**Say up front** which role you are working in (Apliiq operator for the supplier steps, Next.js engineer for the site steps), and whether you are using helper agents. This package was prepared in the apparel production designer role, without helper agents.

## Owner decisions (14 Oct 2026)

- Brand is **GOAL Athletics**. Legal entity (GOOOL Athletics LLC) and domain (goool.shop) unchanged until the owner confirms.
- Blank: **Independent Trading Co IND4000** heavyweight pullover hoodie. Four colours: **Black, Classic Navy, Bone, Grey Heather**.
- Three styles: **Heritage**, **Minimal** and **Lockup**. Twelve Apliiq designs.
- **Big Stack is dropped (owner, 14 Oct 2026).** Don't save any Big Stack design. If one was already saved, leave it, don't add it to the store, and list its ID in your report.
- **No back print (owner, 14 Oct 2026).** Apliiq can't place back art just under the back collar; the highest it allows is below the hood, and the owner doesn't like it there. Don't add any back print. If a hoodie design was already saved with a back print, remove the back transfer, save it again, and note the change in your report.
- Minimal carries the GA once (front). Heritage carries the GA on the chest and the left sleeve (owner request).
- Artwork is from the owner's V1.3 vector masters (`vector/`). Don't redraw, stretch or recolour beyond the manifest colours.
- Record this in `designs/00_asset-library/IND4000-GOAL-HOODIE-DECISION.md` before touching Apliiq or code.

## Garment

- **Blank:** independent trading co independent heavyweight pullover hoodie (ind4000), 10 oz. Apliiq: `https://www.apliiq.com/customize/v5/mens/hoodies/independent-heavyweight-pullover-hoodie/design`.
- **Colours:** Black, Classic Navy, Bone, Grey Heather. Confirm the exact navy swatch name in the designer (it may read "Classic Navy" or "Navy"); use Apliiq's exact name everywhere.
- **Method:** DTF transfer, every placement. No DTG, screen print, sublimation, vinyl or embroidery.
- **Apliiq transfer limits (owner screenshot, 14 Oct 2026):** front 13.5 × 15 in (4050 × 4500 px), back 15 × 19 in (4500 × 5700 px), left and right sleeve 3.5 × 19 in (1050 × 5700 px).
- **Sizes sold:** S–XXL.

### Size data (Independent IND4000 chart)

| Size | Body length from HPS | Chest 1 in below armhole |
|---|---|---|
| S | 28.5 in | 21.0 in |
| M | 29.5 in | 23.0 in |
| L | 30.5 in | 24.5 in |
| XL | 31.5 in | 26.5 in |
| XXL | 32.5 in | 27.5 in |

Planning estimates (measure them): hood seam at CF 3.0 in below HPS; back hood seam at CB 1.0 in below HPS; kangaroo pocket top 15.0 in below the CF hood seam on S; hood lying flat ends 11.8 in below the back hood seam.

## Owner's instructions to Claude

Before placing art, open the IND4000 template (transfer print, size S), measure, and record in your report and in `FILES.json` → `measurements`:

1. **Front:** CF hood seam down to the pocket top, for the record (the 3.15 in GA ends 6.15 in below the seam, well clear).
2. **Sleeve:** confirm the left sleeve area is 3.5 in wide at the placement (3.00 in above the cuff seam). If it narrows below 3.00 in there, stop and report.
3. **Navy name and swatch hexes** for all four colours.

## Placements (same on every size)

| Zone | Size (W × H) | Position | Used by |
|---|---|---|---|
| Centre chest GA | **3.50 × 3.15 in** (88.9 × 80.0 mm), 1050 × 946 px | Centred on centre front. Top of art **3.00 in** (76.2 mm) below the hood seam at CF. | Heritage |
| Left chest GA | **3.50 × 3.15 in**, 1050 × 946 px | Wearer's left. Centre of art **4.00 in** (101.6 mm) left of centre front. Top of art **3.00 in** below the hood seam at CF. | Minimal |
| Chest lockup | **10.00 × 2.67 in** (254.0 × 67.8 mm), 3000 × 802 px | Centred on centre front. Top of art **3.00 in** (76.2 mm) below the hood seam at CF. | Lockup |
| Left sleeve GA | **3.00 × 2.70 in** (76.2 × 68.6 mm), 900 × 810 px | Centred on the outer left sleeve, upright. Bottom of art **3.00 in** (76.2 mm) above the cuff seam. | Heritage |

The PNGs are tight-cropped, so the top of the visible art is the top edge of the file.

## Designs to save (12)

Name each design exactly as below (middle-dot separators). Files are in `designs/27_ind4000-goal-hoodie-2026-10-14/print/`.

| # | Apliiq design name | Front | Left sleeve |
|---|---|---|---|
| 1 | GOAL Athletics Heritage Hoodie · Black | `GA-LeftChest_WhiteRed_3.50in.png` (centre chest) | `GA-Sleeve_WhiteRed_3.00in.png` |
| 2 | GOAL Athletics Heritage Hoodie · Classic Navy | `GA-LeftChest_Cream_3.50in.png` (centre chest) | `GA-Sleeve_Cream_3.00in.png` |
| 3 | GOAL Athletics Heritage Hoodie · Bone | `GA-LeftChest_BlackRed_3.50in.png` (centre chest) | `GA-Sleeve_BlackRed_3.00in.png` |
| 4 | GOAL Athletics Heritage Hoodie · Grey Heather | `GA-LeftChest_BlackRed_3.50in.png` (centre chest) | `GA-Sleeve_BlackRed_3.00in.png` |
| 5 | GOAL Athletics Minimal Hoodie · Black | `GA-LeftChest_WhiteRed_3.50in.png` (left chest) | — |
| 6 | GOAL Athletics Minimal Hoodie · Classic Navy | `GA-LeftChest_Cream_3.50in.png` (left chest) | — |
| 7 | GOAL Athletics Minimal Hoodie · Bone | `GA-LeftChest_BlackRed_3.50in.png` (left chest) | — |
| 8 | GOAL Athletics Minimal Hoodie · Grey Heather | `GA-LeftChest_BlackRed_3.50in.png` (left chest) | — |
| 9 | GOAL Athletics Lockup Hoodie · Black | `Lockup-Front_WhiteRed_10.00in.png` | — |
| 10 | GOAL Athletics Lockup Hoodie · Classic Navy | `Lockup-Front_Cream_10.00in.png` | — |
| 11 | GOAL Athletics Lockup Hoodie · Bone | `Lockup-Front_BlackRed_10.00in.png` | — |
| 12 | GOAL Athletics Lockup Hoodie · Grey Heather | `Lockup-Front_BlackRed_10.00in.png` | — |

If the navy swatch name isn't "Classic Navy", use Apliiq's name in rows 2, 6 and 10.

### Ink by colour

| Garment | Files | Ink |
|---|---|---|
| Black | `*_WhiteRed_*` | White #FFFFFF + Red #E51226 |
| Classic Navy | `*_Cream_*` | Cream #F9F1DF, one colour |
| Bone | `*_BlackRed_*` | Black #080808 + Red #E51226 |
| Grey Heather | `*_BlackRed_*` | Black #080808 + Red #E51226 |

Contrast (planning swatches): white on black 19:1, red on black 4.4:1, cream on navy 11.6:1, black on Bone 12:1, red on Bone 2.8:1, black on Grey Heather 9.5:1, **red on Grey Heather 2.3:1**. The red A is soft on Grey Heather; flag it on the proof. Ask for colour matches to #E51226 and #F9F1DF on the DTF proof.

## Print check (measured at final size, 300 dpi, `tmp/measure.js`)

- **Lockup at 10.00 in:** smallest gap 2.35 mm. Don't scale below 8.50 in. **Source:** enlarged from the owner's 1125 px PNG (no vector master yet). Ask the owner for the horizontal lockup vector before saving; if it arrives, re-export at 10.00 in and update `FILES.json`. Check the Apliiq proof for soft edges.
- **GA at 3.50 in:** smallest gap 3.78 mm. **GA at 3.00 in (sleeve):** smallest gap 3.33 mm. The 1.9 mm stroke reading is the pointed tips of the G and A, which taper to zero at any size. GA minimum is 3.0 in wide; don't go smaller.
- All files are rendered from the vector masters, not enlarged PNGs.

## Production notes (paste into Apliiq, one per zone)

Also in `PRODUCTION-NOTES.md`.

Heritage front:
> FRONT · DTF. GA monogram 3.50 x 3.15 in, centred on centre front. Top of art 3.00 in (76.2 mm) below the hood seam at CF. Same on every size. Do not scale. Match inks to file.

Lockup front:
> FRONT · DTF. GA + GOAL ATHLETICS lockup 10.00 x 2.67 in, centred on centre front. Top of art 3.00 in (76.2 mm) below the hood seam at CF. Same on every size. Do not scale. Match inks to file.

Minimal front:
> FRONT · DTF. GA monogram 3.50 x 3.15 in, wearer's left chest. Centre of art 4.00 in left of centre front. Top of art 3.00 in (76.2 mm) below the hood seam at CF. Same on every size. Do not scale. Match inks to file.

Left sleeve (Heritage):
> LEFT SLEEVE · DTF. GA monogram 3.00 x 2.70 in, centred on outer left sleeve, upright. Bottom of art 3.00 in (76.2 mm) above the cuff seam. Same on every size. Do not scale. Match inks to file.

## Label

The current private label reads GOOOL ATHLETICS. Don't add it. The owner's package includes `04 Tags/AutoCap Black Stack Tag.png`, but its READ ME warns the stack may not be legible at 1 in. Don't use it without an owner-approved Apliiq preview. Save with the blank's standard label and report the label as pending.

## Apliiq steps

1. Open the IND4000 customizer and confirm the product name above.
2. Take the measurements in "Owner's instructions to Claude". Record them.
3. For each row in the design table: select the colour, confirm the swatch name, upload each file to its zone and set size and position from the placement table.
4. Check the dimensions Apliiq shows match the table exactly. Paste the production note for each zone.
5. Name the design exactly, recheck the colour, save, reopen, and capture front and sleeve proofs, the design ID and the dimensions.
6. Check S–XXL keep the same scale and placement. On S, confirm the sleeve GA stays inside the sleeve area. Report any supplier constraint rather than resizing.
7. Read the dropship quote (S and XXL) from the first saved design of each style. Don't make duplicate designs or delete anything. Leave the old GOOOL Core Hoodie designs (6098974, 6099064 and the designs from `designs/25_core-hoodie-remake-2026-09-24/`) alone.

## Price

Use `designs/18_launch_operations/PRICING-25-PERCENT.md`:

floor = (worst-size Apliiq quote + $3 label contingency + $1 fulfilment + $0.30 card fee) ÷ 0.671, rounded up to the next dollar.

- Heritage has two transfers (front + sleeve), Minimal one small, Lockup one large front. Quote each style separately; Grey Heather may price differently from the solids.
- Record `quote_verified: false` until a real dropship quote is read. Don't set a display price; report the three floors and wait for the owner.

## Website

- Three products: **GOAL Athletics Heritage Hoodie**, **GOAL Athletics Minimal Hoodie** and **GOAL Athletics Lockup Hoodie**. Use the next unused ids in `products.ts` and `supabase/`; add rows with `ensureProductRows` plus a migration.
- Variant order on each: Black, Classic Navy, Bone, Grey Heather. `supplierColor` = the exact Apliiq name. Each variant maps to its own design ID in `fulfillment.ts`.
- The existing GOOOL Core Hoodie products stay as they are. Don't remove or rename them in this task.
- The site still uses the GOOOL brand. Don't rebrand the site in this task; report the mismatch.
- Build front, back and sleeve gallery images from the real IND4000 blank and these files, positioned from the seam distances above. Keep "Concept render. Not a photograph of a manufactured sample." until a sample is photographed.
- Don't publish or activate checkout until the owner sets prices.

## Not included

No paid orders, samples or checkout activation. Report: the 12 design IDs (plus any Big Stack IDs already saved), proof URLs, measured template figures, the three dropship quotes and floors, and anything pending (label, prices, site rebrand, Grey Heather red A).

## Files in this folder

- `CLAUDE-IND4000-GOAL-HOODIE-HANDOFF.md` (this file)
- `PRODUCTION-NOTES.md`
- `FILES.json` (sha256 and sizes of the print files, plus the measurements to fill in)
- `print/` (12 PNGs, 300 dpi, final size)
- `vector/` (V1.3 vector masters used: White Red, Cream, Black Red)
- `src/` (owner's apparel PNGs, for reference only)
- `IND4000 GOAL Hoodie Proof.dc.html` (visual proof; open in a browser from the project root)

