# Claude: remake the GOOOL Core Hoodie on the IND4000 with the 3010 tee print sets (Apliiq + website)

Work in `C:\Users\gdove\OneDrive\Desktop\GOOOL`. Read `CLAUDE.md`, `ARTWORK-START-HERE.md`, `APLIIQ-UPLOAD-START-HERE.md` and `designs/24_casual-tee-3010-2026-09-23/CLAUDE-CASUAL-TEE-3010-HANDOFF-4a-4b.md` first. This hoodie follows that handoff's format, rules and artwork.

**Say up front** which role you are working in (apparel production / Apliiq operator for the supplier steps, Next.js engineer for the site steps). Say whether you are using helper agents and what each one does. If you aren't using any, say so.

This package was prepared in the apparel production designer role, without helper agents.

## Owner decision (24 Sep 2026)

- Remake the GOOOL Core Hoodie (`goool-heavyweight-hoodie`) with the same print sets as the 3010 Casual Wordmark Tees: the full GOOOL Athletics lockup on the front, the club band on the back.
- The band moves from the yoke to the **back hem**, because the hood would cover a yoke band.
- Two shop rows, mirroring the tees: **GOOOL Core Hoodie · Red** and **GOOOL Core Hoodie · Club Blue**.
- It supersedes the 6.75 × 2.34 in underlined wordmark front on saved designs **6098974** (Black) and **6099064** (Bone).
- Record this decision in `designs/00_asset-library/` (for example `CORE-HOODIE-REMAKE-DECISION.md`) before touching Apliiq or code.

## Owner's instructions to Claude (24 Sep 2026)

- **Colours are final:** Black, Bone and Grey Heather, in that order, each in both sets (Red Band and Blue Band). Six designs. Don't add Smoke or any other colour.
- **You take the measurements.** The owner doesn't have them. Before placing any art, measure on the Apliiq IND4000 template (transfer print, size S) and record the results in your report and in this folder's `FILES.json` notes:
  1. **Front:** hood seam at centre front down to the top of the kangaroo pocket. It must be at least **9.59 in (243.6 mm)**, which gives the 2.00 in clearance under the lockup. If it's less, stop and report. Don't scale.
  2. **Back:** back hood seam at CB down to the top edge of the back print area. If it's 0, the band bottom goes 19.00 in below the seam. If it's d in, the band bottom goes on the area's bottom edge, 19.00 + d in below the seam. Use the measured figure in the back production note.
  3. **Grey Heather swatch:** read the hex Apliiq shows for Grey Heather. Replace the #B5B4B2 planning value in the website copy with it. If the True Royal front drops below 3:1 or the ink below 4.5:1 on the real value, stop and report.
- If the template doesn't show seams clearly, measure on the first saved design's proof and say which source you used.

## Garment (unchanged)

- **Blank:** Independent Trading Co IND4000 Heavyweight Hooded Pullover, 10 oz 3-end fleece (Apliiq URL `/customize/mens/hoodies/Heavyweight-Hooded-Pullover`; the live listing now resolves at `/customize/mens/hoodies/independent-heavyweight-pullover-hoodie`).
- **Colours:** exactly three, in this order: **Black**, **Bone**, **Grey Heather** (Grey Heather added by owner 24 Sep 2026). One Apliiq design per colour per set: six designs.
- **Method:** DTF transfer, front and back. No DTG, screen print, vinyl or embroidery.
- **Apliiq transfer limits on the IND4000** (listing read 24 Sep 2026): front **13.5 × 15 in** (4050 × 4500 px), back **15 × 19 in** (4500 × 5700 px), each sleeve 3.5 × 19 in (unused).
- **Stock** (Apliiq, "last updated 5 days ago"): Black XS–5XL all in stock; Bone XS–XXXL in stock, no 4XL/5XL; Grey Heather XS–5XL all in stock. The site sells S–XXL, so all three colours are covered.

## Size data used (Independent IND4000 size chart)

S to XL confirmed against the "find your fit" chart on Apliiq's IND4000 page (read 24 Sep 2026: "nice generous fit"). Apliiq lists S to XL only; XXL is from Independent's own chart.

| Size | Body length from HPS | Chest 1 in below armhole |
|---|---|---|
| S | 28.5 in | 21.0 in |
| M | 29.5 in | 23.0 in |
| L | 30.5 in | 24.5 in |
| XL | 31.5 in | 26.5 in |
| XXL | 32.5 in | 27.5 in |

Independent does not publish neck drops, waistband depth or pocket height. The diagrams use these **estimates, which must be measured on the Apliiq template before saving**: hood seam at centre front 3.0 in below HPS; back hood seam at CB 1.0 in below HPS; ribbed waistband 3.0 in; kangaroo pocket top 10.5 in above the hem (18.0 in below HPS on S).

## Placements (same on every colour and size)

| Zone | File | Visible size | Position |
|---|---|---|---|
| Front | `4a-<black · natural · athletic-heather>-front.png` / `4b-…-front.png` | **11.10 × 4.59 in** (282 × 117 mm), 3330 × 1377 px | Centred on the body centreline. Top of the visible artwork **3.00 in / 76.20 mm below the hood seam at centre front**. |
| Back hem band | `4a-back-yoke.png` / `4b-back-yoke-blue.png` | **12.00 × 2.00 in** (305 × 51 mm), 3600 × 600 px | Centred on centre back. Bottom edge of the band **19.00 in / 482.60 mm below the back hood seam at CB** (top edge 17.00 in / 431.80 mm). See the back finding below. |

### Front: pocket clearance (smallest size, S)

Artwork spans 3.00 to 7.59 in (76.2 to 192.8 mm) below the CF hood seam. With the pocket top estimated at 15.00 in below the CF hood seam on S, clearance is **7.41 in (188.2 mm)**, above the 2.00 in (50.8 mm) minimum. **Pass.** The check still passes as long as the pocket top on S sits at least **9.59 in (243.6 mm) below the CF hood seam**; measure it on the template. Larger sizes have more room. The drawcords hang across the lockup when worn; that is expected.

The lockup fits the 13.5 in front area width with 1.20 in each side, and on S (21 in chest) leaves 4.95 in to each side seam.

### Back: owner position falls outside Apliiq's back area

The owner position (band bottom 1.50 in / 38.1 mm above the top of the ribbed waistband) puts the band bottom 23.00 in (584.2 mm) below the back hood seam on S, and up to 27.00 in on XXL. Apliiq's back area is 19 in deep, so the band would sit **4.00 in (101.6 mm) outside the area on S and 8.00 in outside on XXL**. It is outside on every size.

**Nearest position inside the area:** band bottom on the bottom edge of the back print area, **19.00 in (482.6 mm) below the back hood seam at CB**, assuming the area starts at the seam. If the Apliiq template's back area starts lower than the seam, place the band on the area's bottom edge and record the measured seam-to-band distance. Never place it below the area and never scale it.

At that position the band stays clear of the hood lying flat (hood estimated to end 11.8 in below the back hood seam), leaving about 5.2 in between hood tip and band top. Gap from band bottom to waistband top: S 5.50 in (139.7 mm), M 6.50, L 7.50, XL 8.50, XXL 9.50 in.

If the owner wants the band nearer the hem on every size, that needs a different supplier method or a blank with a deeper back area. Report it; don't improvise.

### Colour and file by design

| Apliiq design name | Front file | Front colours | Back file | Back colours |
|---|---|---|---|---|
| GOOOL Core Hoodie · Black · Red Band | `4a-black-front.png` | GOOOL, outer dashes, ATHLETICS White #F7F5F0 · centre dash Red #C52D32 | `4a-back-yoke.png` | Band Red #C52D32 · lettering White #F7F5F0 |
| GOOOL Core Hoodie · Bone · Red Band | `4a-natural-front.png` | GOOOL, outer dashes, ATHLETICS Ink #0A0A0A · centre dash Red #C52D32 | `4a-back-yoke.png` | as above |
| GOOOL Core Hoodie · Black · Blue Band | `4b-black-front.png` | GOOOL, ATHLETICS Club Blue #3D6CC4 · all dashes Natural #EFE8D8 | `4b-back-yoke-blue.png` | Band Club Blue #3D6CC4 · lettering Natural #EFE8D8 |
| GOOOL Core Hoodie · Bone · Blue Band | `4b-natural-front.png` | GOOOL, ATHLETICS Club Blue #3D6CC4 · all dashes Ink #0A0A0A | `4b-back-yoke-blue.png` | as above |
| GOOOL Core Hoodie · Grey Heather · Red Band | `4a-athletic-heather-front.png` | GOOOL, outer dashes, ATHLETICS Ink #0A0A0A · centre dash Red #C52D32 | `4a-back-yoke.png` | Band Red #C52D32 · lettering White #F7F5F0 |
| GOOOL Core Hoodie · Grey Heather · Blue Band | `4b-athletic-heather-front.png` | GOOOL, ATHLETICS **True Royal #1F4FB5** · all dashes Ink #0A0A0A | `4b-back-yoke-blue.png` | Band Club Blue #3D6CC4 · lettering Natural #EFE8D8 |

**Bone check.** Bone is cooler and greyer than the 3010 Natural, and lighter than the site swatch suggests. On Apliiq Bone #EBE3E0 the Natural files read the same as on Natural or better: ink 15.7:1 (Natural 15.3), red dash 4.4:1 (4.3), Club Blue 4.0:1 (3.9). On the darker photographed Bone #DEDAD7 Club Blue is 3.7:1, still above the 3:1 graphic minimum. **No dash or lettering colour change is needed; use the Natural files unchanged on Bone.** The back bands are opaque, so the ground doesn't affect their lettering. Ask for colour matches to #C52D32 and #3D6CC4 on the DTF proof.

**Grey Heather check.** Reuses the 3010 tee's Athletic Heather fronts unchanged (sha256 matches the tee FILES.json). Planning ground #B5B4B2 (confirm against the Apliiq swatch): ink 9.6:1. Club Blue lettering would reach only 2.5:1, so the Blue Band design uses the deeper **True Royal #1F4FB5** front (3.6:1), as on the heather tee. The red centre dash (2.7:1) and band edges (red 2.7:1, Club Blue 2.5:1) are softer than on Bone. The band lettering sits on the opaque band (White 5.2:1 on red, Natural 4.2:1 on Club Blue), so it stays readable. Ask for a colour match to #1F4FB5 as well.

## Label

Use the owner-approved sewn tag, the same as the other packages (see the `label/` folder in the v2 packages and `CLAUDE-LAUNCH-PRIORITY-PROMPT.md`). No label changes without an owner-approved mockup.

## Print check (measured at final size, 300 dpi)

Re-measured on 24 Sep 2026 with `tmp/measure.js` (opening/closing test at final size), same files as the tee package, checksums unchanged.

- **Front lockup (all six fronts share one geometry):** smallest stroke **4.22 mm**, smallest gap **4.00 mm**, cap heights GOOOL 52.3 mm, ATHLETICS **38.2 mm**, dash row 4.7 mm. Passes the 2 mm Apliiq minimum.
- **Back band (red and blue):** lettering smallest stroke **2.35 mm**, smallest gap **2.35 mm**, smallest cap height **14.4 mm** (tallest 21.4 mm). Passes; margin is 0.35 mm, so **don't scale either file down**.
- If Apliiq forces a smaller size on any size, stop and report it. Details: `PRINT-CHECK.md`.

## Production notes (paste into Apliiq, one per zone)

Front (227 characters):

> FRONT · DTF. Lockup 11.10 x 4.59 in, centred on body centreline. Top of artwork 3.00 in (76.2 mm) below the hood seam at centre front. Same size and position on every size. Do not scale. Match inks to the file colours on proof.

Back (238 characters):

> BACK · DTF. Band 12.00 x 2.00 in, centred on centre back. Bottom edge of band 19.00 in (482.6 mm) below the back hood seam at CB, on the bottom edge of the back print area. Same on every size. Do not scale. Match colours to file on proof.

Also in `PRODUCTION-NOTES.md`.

## Apliiq steps

Use the Apliiq workflow skill used on earlier uploads.

1. Open the IND4000 customizer and confirm the product is **independent trading co independent heavyweight pullover hoodie (ind4000)**.
2. For each colour, select it and confirm the swatch name is exactly Black, Bone or Grey Heather.
3. Take the three measurements in "Owner's instructions to Claude" above before placing art. Record them.
4. Upload the front file. The PNGs are tight-cropped, so the visible top is the file's top edge. Set the top 3.00 in below the CF hood seam. Don't reuse old pixel offsets from 6098974/6099064.
5. Upload the back band at 12 in wide, bottom edge on the bottom of the back area (19.00 in below the back hood seam if the area starts at the seam).
6. Check the design dimensions read 11.10 × 4.59 in (front) and 12.00 × 2.00 in (back). Paste the two production notes.
7. Name the design exactly as in the table above (middle dot separators). Recheck the colour, then save. Reopen each saved design and capture front and back proofs, the design ID and the dimensions.
8. Check every offered size keeps the same scale and placement. On S, confirm the front clears the pocket by at least 2.00 in and the band stays inside the back area and clear of the side seams. Report any supplier constraint rather than resizing.
9. Keep **6098974** (Black) and **6099064** (Bone) until the six new designs are saved and mapped in `fulfillment.ts`. Don't delete anything. Don't make duplicate designs.

## Website

- **GOOOL Core Hoodie · Red** keeps id `70000000-0000-4000-8000-000000000002` and slug `goool-heavyweight-hoodie`.
- **GOOOL Core Hoodie · Club Blue** is a new product: id `70000000-0000-4000-8000-000000000006` (unused in `products.ts` and `supabase/` as of 24 Sep 2026), slug `goool-heavyweight-hoodie-blue`. Add the Supabase row the same way as the Club Blue tee (`ensureProductRows` plus a migration for the audit trail).
- Colour order **Black, Bone, Grey Heather** on both. Variants: Black `supplierColor: "Black"`, hex #1E1E1E, `BLACK`; Bone `supplierColor: "Bone"`, hex #CFCAC7, `BONE`; Grey Heather `supplierColor: "Grey Heather"`, hex #B5B4B2 (planning value, replace with the measured swatch), `GREYHEATHER`.
- Copy in `WEBSITE-COPY-DRAFT.md`. This is the off-the-pitch layer, never "the match".
- Build new front and back gallery images, thumbnails and collection-card images from the real IND4000 blank and these print files. Position artwork using the seam distances above, not by cropping. Keep "Concept render. Not a photograph of a manufactured sample." until a sample is photographed.
- Update the gallery manifests, the package `spec.json`, `SHA256SUMS.json` and `verification-record.json`. Keep the old hoodie images and packages in `designs/_archive`.
- Check desktop and mobile, colour switching and thumbnails, then run the existing build checks.

## Price

Re-run of `designs/18_launch_operations/PRICING-25-PERCENT.md` with the second (back) transfer added:

- Current saved-design quote (front only): $36.94, XXL +$2.00.
- Second transfer: +$7.49, the standard extra-transfer figure already used in the model (crewneck note).
- Worst size (XXL) garment + decoration: $36.94 + $7.49 + $2.00 = **$46.43**.
- Plus $3 label contingency + $1 fulfilment = $50.43; plus $0.30 card fixed fee = $50.73.
- ÷ (1 − 0.029 − 0.05 − 0.25) = ÷ 0.671 = $75.60.
- **New floor: $76.**

At the displayed **$78** the modelled worst-size contribution is $21.11, **27.06%**. The displayed price stays **$78** until the owner changes it. $78 still holds 25% as long as the new saved designs quote no more than **$46.04 base ($48.04 at XXL)**.

The front transfer also grows from 6.75 × 2.34 in to 11.10 × 4.59 in, which Apliiq may price differently. Heather colours can price differently from solids; read the Grey Heather quote too. Read the real unit price from the first saved design's dropship dialog and replace the $7.49 estimate before recording the floor in `PRICING-25-PERCENT.md` / `.json` and `COST-INPUTS.json` (keep `quote_verified: false`).

## Not included

No paid orders, sample purchases or checkout activation. Don't claim it's finished from an upload alone. Report the saved Apliiq IDs, proofs, measured template distances and anything still pending.

## Files in this folder

- `CLAUDE-CORE-HOODIE-HANDOFF.md` (this file)
- `placement-front-size-S.png`, `placement-back-size-S.png` (to-scale placement diagrams)
- `PRODUCTION-NOTES.md`
- `PRINT-CHECK.md`
- `WEBSITE-COPY-DRAFT.md`
- `FILES.json` (sha256 of every file above and of the eight reused print files)

Artwork is reused, not copied: `designs/24_casual-tee-3010-2026-09-23/print-files/` (`4a-black-front.png`, `4a-natural-front.png`, `4a-athletic-heather-front.png`, `4b-black-front.png`, `4b-natural-front.png`, `4b-athletic-heather-front.png`, `4a-back-yoke.png`, `4b-back-yoke-blue.png`).

The visual spec is `Core Hoodie IND4000 Production Spec.dc.html` in the design project.
