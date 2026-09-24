# Claude: rebuild the GOOOL casual tee on Bella+Canvas 3010 (Apliiq + website)

Work in `C:\Users\gdove\OneDrive\Desktop\GOOOL`. Read `CLAUDE.md`, `ARTWORK-START-HERE.md` and `APLIIQ-UPLOAD-START-HERE.md` first.

**Say up front** which role you are working in (apparel production / Apliiq operator for the supplier steps, Next.js engineer for the site steps). Say whether you are using helper agents and what each one does. If you aren't using any, say so.

## Owner decision (23 Sep 2026)

- This design replaces the casual tee that was taken off the website, product `goool-heavyweight-casual-tee`.
- It supersedes `designs/00_asset-library/CASUAL-TEE-PLACEMENT-REVISION.md`: the 4810GD blank, the Washed Black and Washed Grey colours, and the 6.75 in wordmark-only print.
- Record this decision in `designs/00_asset-library/` before touching Apliiq or code.

## Garment

- **Blank:** Bella+Canvas 3010 Heavyweight Tee (Apliiq URL `/customize/mens/tshirts/Heavyweight-Tee`).
- **Colours:** exactly three: **Natural**, **Black**, **Athletic Heather**. Make one Apliiq design per colour.
- **Method:** DTF transfer, front and back. No DTG, screen print, vinyl or embroidery.
- **Apliiq transfer limits on the 3010:** front 15 × 19 in, back 15 × 19 in (4500 × 5700 px). Both prints below fit.

## Placements (same on every colour)

| Zone | File | Visible size | Position |
|---|---|---|---|
| Front | `4a-<colour>-front.png` | **11.10 × 4.59 in** (282 × 117 mm), 3330 × 1377 px | Centred on the body centreline. Top of the visible artwork is **3.00 in / 76.20 mm below the bottom of the centre-front collar seam**. |
| Back yoke (2l band) | `4a-back-yoke.png` | **12.00 × 2.00 in** (305 × 51 mm), 3600 × 600 px | Centred on centre back. Top of the band is **1.50 in / 38.10 mm below the back collar seam**. |

Front file by colour:

- **Natural:** `4a-natural-front.png`. GOOOL, outer dashes and ATHLETICS are Ink #0A0A0A. The centre dash is Red #C52D32.
- **Black:** `4a-black-front.png`. GOOOL, outer dashes and ATHLETICS are White #F7F5F0. The centre dash is Red #C52D32.
- **Athletic Heather:** `4a-athletic-heather-front.png`. Same colours as Natural.

The back band is the same file on all three 4a tees: a Red #C52D32 band with White #F7F5F0 GOOOL · ATHLETICS lettering.

### 4b: blue yoke version (three more designs)

Build three more Apliiq designs, using the same blank, colours, sizes and positions as 4a, with their own front files and a blue back band.

Front files (11.10 × 4.59 in, same placement as 4a):

- **Black:** `4b-black-front.png`. GOOOL and ATHLETICS are Club Blue #3D6CC4. All three dashes are Natural #EFE8D8.
- **Natural:** `4b-natural-front.png`. GOOOL and ATHLETICS are Club Blue #3D6CC4. All three dashes are Ink #0A0A0A.
- **Athletic Heather:** `4b-athletic-heather-front.png`. GOOOL and ATHLETICS are True Royal #1F4FB5, which is deeper so it reads on heather. All three dashes are Ink #0A0A0A.

Back file: `4b-back-yoke-blue.png`, a **Club Blue #3D6CC4** band with **Natural #EFE8D8** lettering, at 12.00 × 2.00 in, top 1.50 in below the back collar seam. Club Blue is a lighter version of the 2c True Royal. Ask for colour matches to #3D6CC4 and #1F4FB5 on the DTF proof.

On the website, add the blue yoke as a second option on the same product (for example, a "Back band: Red / Blue" selector) unless the owner asks for a separate product. That makes six Apliiq designs in total.

## Label

Use the owner-approved sewn tag, the same as the other packages (see the `label/` folder in the v2 packages and `CLAUDE-LAUNCH-PRIORITY-PROMPT.md`). Any other label needs a mockup and owner approval first.

## Print check (measured at final size, 300 dpi)

- **Front lockup:** smallest stroke 4.2 mm, smallest gap 4.0 mm, ATHLETICS cap height 38.2 mm. Passes the 2 mm Apliiq minimum.
- **Back band:** smallest stroke 2.4 mm, smallest gap 2.4 mm, letters 14.5 mm. Passes.
- **Don't scale either file down.** If Apliiq forces a smaller size on any size, stop and report it.

## Apliiq steps

Use the Apliiq workflow skill used on earlier uploads.

1. Open the 3010 customizer and confirm the product is **bella canvas heavyweight tee (3010)**.
2. For each colour, select it and confirm the swatch name is exactly Natural, Black or Athletic Heather.
3. Upload the front file. The PNGs are tight-cropped, so the visible top is the file's top edge. Measure the collar-to-print relationship on the real template and set the top at 3.00 in. Don't reuse old pixel offsets.
4. Upload `4a-back-yoke.png` to the back at 12 in wide, top 1.50 in below the back collar seam.
5. Check that the design dimensions read 11.10 × 4.59 in (front) and 12.00 × 2.00 in (back).
6. Recheck the colour, then save. Reopen each saved design and capture front and back proofs, the design ID and the dimensions.
7. Check every offered size keeps the same scale and placement. On the smallest size, make sure the 11.10 in front and the 12 in back band stay clear of the side seams and armholes. Report any supplier constraint rather than resizing.
8. Archive the old 4810GD designs **6098963** (Washed Black) and **6099060** (Washed Grey). Don't delete them. Don't make duplicate designs.

## Website

- Keep the slug `goool-heavyweight-casual-tee` and its URL. Replace the variants with Natural, Black and Athletic Heather.
- Build new front and back gallery images, thumbnails and collection-card images from the real 3010 blank and these print files.
- Position artwork using the collar-to-artwork distance, not by cropping the photo. Keep the concept disclosure until real sample photos exist.
- **Price:** the 3010 cost differs from the 4810GD. Re-run `designs/18_launch_operations/PRICING-25-PERCENT.md` and get the owner's approval before changing the displayed price.
- Update the gallery manifests, the package `spec.json`, `SHA256SUMS.json` and `verification-record.json`. Keep the old casual-tee packages in `designs/_archive`.
- Check desktop and mobile, colour switching and thumbnails, then run the existing build checks.

## Not included

No paid orders, sample purchases or checkout activation. Don't claim it's finished from an upload alone. Report the saved Apliiq IDs, proofs, and anything still pending.

## Files in this folder

- `4a-natural-front.png`
- `4a-black-front.png`
- `4a-athletic-heather-front.png`
- `4a-back-yoke.png`
- `4b-black-front.png`
- `4b-natural-front.png`
- `4b-athletic-heather-front.png`
- `4b-back-yoke-blue.png`
- `CLAUDE-CASUAL-TEE-3010-HANDOFF.md` (this file)

The visual spec is `Casual Tee 3010 Production Spec.dc.html` in the design project.
