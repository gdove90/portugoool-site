# Handoff: GOOOL Core Matchday Tee (was: GOOOL Athletics Modern Sport Performance Tee), all three colourways

**New product name: GOOOL Core Matchday Tee.** Use it on the site and in the Apliiq design names. Keep the existing slug `goool-athletics-modern-sport-performance-tee` so live links keep working, or add a 301 redirect if you change it.

Act as GOOOL's apparel production and storefront lead. This package brings **Black, True Royal and White** to one set of print files. Every letter clears Apliiq's 2 mm DTF minimum with margin: GOOOL's target is 2.5 mm stroke and gap at final size. The measurements are in `MEASUREMENTS.json`.

Seller: GOOOL Athletics LLC. Supplier: Apliiq. Don't place paid orders or send messages to the supplier without the owner's instruction.

## What changed and why

- **Front: no change.** GA-01-F v3 at 11.00 in measures ATHLETICS 3.03 mm stroke and 2.65 mm gap, and GOOOL 5.73 / 4.30 mm. It passes as saved.
- **Back: replaced.** The pending v5 back at 3.25 in failed. ATHLETICS gaps measured 1.45 mm and GOOOL gaps 1.83 mm, both below Apliiq's 2 mm, and the size was under the brand's 4 in lockup minimum. **v6** is the same artwork with the open A kept, at **5.00 × 1.812 in**, with wider letter spacing and ATHLETICS strokes matched to the front. Now the smallest stroke is 3.03 mm and the smallest gap 2.58 mm.
- **White colourway: new.** Same files, recoloured: Ink #0A0A0A in place of white, and the red rule stays Red #C52D32.

## 1. Garment spec (all three colourways)

| Item | Value |
|---|---|
| Blank | Sport-Tek ST720 Sustainable Athletic Tee, 3.8 oz, 100% recycled polyester (PosiCharge) |
| Colours | Black · True Royal · White (Apliiq: "black", "true royal", "white") |
| Sizes sold | S, M, L, XL, XXL (Apliiq offers XS–XXXL) |
| Decoration | DTF transfer ("transfer print") on both placements, and nothing else |
| Sleeves | Blank |
| Label | Keep the label service already on 6112037 |
| Price | $48.00 |

## 2. Placements and files

| Placement | Size (W × H) | Position | Black & True Royal file | White file | Colours |
|---|---|---|---|---|---|
| Front chest | **11.00 × 3.72 in** (279.4 × 94.5 mm) | On centre front. Top of the visible artwork **3.00 in below the front collar seam** | `print-files/front/GA-01-F_v3_WHITE-PRINT_3300px_300ppi.png` | `print-files/front/GA-01-F_v3_INK-PRINT_3300px_300ppi.png` | GOOOL + ATHLETICS in White #FFFFFF (Ink #0A0A0A on White); rule in Red #C52D32 |
| Upper back | **5.00 × 1.812 in** (127.0 × 46.0 mm) | On the back centreline. Top of the visible artwork **2.00 in below the back collar seam** | `print-files/back/GA-01-B_v6_5IN_WHITE-PRINT_3000px_600ppi.png` | `print-files/back/GA-01-B_v6_5IN_INK-PRINT_3000px_600ppi.png` | All White #FFFFFF (Ink #0A0A0A on White) |

- The files are tight-cropped, transparent PNGs, drawn at their final size: front 3300 px = 11 in at 300 ppi, back 3000 px = 5 in at 600 ppi. **Enter the sizes exactly as given. Never let Apliiq auto-fit or shrink the art.** A smaller size would take the details below 2.5 mm.
- Keep the aspect ratio. Lock the proportions before typing the width.
- **Positions:** if the saved front on 6112037 isn't at 3.00 in from the collar seam, keep 6112037's front position, record the measured offset, and use that same offset for all three. The back moves to the v6 size, with its top 2.00 in below the collar seam on all three.

## 3. Apliiq steps

Rename all three saved designs to `GOOOL Core Matchday Tee - <Colour>`.

**A. Black: update saved design 6112037.** Keep the ID, the SKUs and the blank.
1. Open 6112037 and go to the **back** placement.
2. Replace the artwork with `GA-01-B_v6_5IN_WHITE-PRINT_3000px_600ppi.png`. Lock the proportions, and set the width to 5.00 in (height 1.812 in).
3. Centre it on the back, with the top 2.00 in below the back collar seam.
4. On the **front**, check the linked file is GA-01-F v3 at 11.00 in, and the offset matches section 2. Leave it as is otherwise.
5. Save. Record the linked filename, the size and the activity-log entry.

**B. True Royal: update saved design 6113361.** Same as A.

**C. White: create the new design.**
1. Start from 6112037, using "save as new" or duplicate if Apliiq offers it. Otherwise start a new ST720 design.
2. **Colors:** white only.
3. Front: `GA-01-F_v3_INK-PRINT_3300px_300ppi.png` at 11.00 × 3.72 in, same position as Black.
4. Back: `GA-01-B_v6_5IN_INK-PRINT_3000px_600ppi.png` at 5.00 × 1.812 in, same position as Black.
5. Transfer print, and the same label as 6112037. Save it as `GOOOL Core Matchday Tee - White`.
6. Read the new **design ID** and five SKUs from the account (`APQ-<id>S6A1` S, `S7A1` M, `S8A1` L, `S1A1` XL, `S2A1` XXL). Don't infer them.
7. In **mockups**, sample the rendered garment body colour for the website swatch.

**D. Proof check, on all three.** Check that the A's triangular opening shows, the E arms and S openings are clear, GOOOL's cut tips are there, and the front rule is solid. If any placement shows a size other than the one in section 2, stop and report.

## 4. Website changes (repo `GOOOL/`)

**a. Images.** Copy `site-images/*` into `public/products/`:
- `GOOOL_MODERN_PERFORMANCE_BACK_DETAIL_V6.png` (Black)
- `GOOOL_MODERN_PERFORMANCE_ROYAL_BACK_DETAIL_V6.png` (True Royal)
- `GOOOL_MODERN_PERFORMANCE_WHITE_FRONT_V3.png` and `GOOOL_MODERN_PERFORMANCE_WHITE_BACK_DETAIL_V6.png` (White)

The back renders show the print at the new 5.00 in size, on the same garment framing and #F2F2F2 backdrop. The Black and True Royal fronts are unchanged. They're concept renders: keep the existing "Concept render" captions.

**b. `src/lib/products.ts`.** Update product `80000000-0000-4000-8000-000000000006`:
- Set `name: "GOOOL Core Matchday Tee"`. Update the image alt texts from "GOOOL Athletics Modern Sport Performance Tee" to "GOOOL Core Matchday Tee".
- In the top-level `images` and in the Black variant, point the back image at `/products/GOOOL_MODERN_PERFORMANCE_BACK_DETAIL_V6.png`.
- In the True Royal variant, point the back image at `/products/GOOOL_MODERN_PERFORMANCE_ROYAL_BACK_DETAIL_V6.png`.
- Add the White variant after True Royal:
```ts
{
  name: "White",
  supplierColor: "white",
  hex: "#FFFFFF", // replace with the body colour sampled from Apliiq's render
  skuFragment: "WHITE",
  images: [
    { src: "/products/GOOOL_MODERN_PERFORMANCE_WHITE_FRONT_V3.png",
      alt: "GOOOL Core Matchday Tee in white, front view with the black GOOOL wordmark, red underline and ATHLETICS",
      caption: "Concept render. Not a photograph of a manufactured sample." },
    { src: "/products/GOOOL_MODERN_PERFORMANCE_WHITE_BACK_DETAIL_V6.png",
      alt: "Close-up concept of the Core Matchday Tee's black upper-back GOOOL Athletics print, white garment",
      caption: "Back print detail - concept render. Not a photograph of a manufactured sample." },
  ],
},
```
- Change `description` to: `"Performance training tee in black, true royal or white. GOOOL with a red underline and spaced ATHLETICS across the chest, GOOOL Athletics mark at the upper back."`
- Update the comment block above the product: back v6 at 5.00 × 1.812 in, the White colourway, and a pointer to this package.
- Make sure the White swatch has a visible border on the white page.

**c. `src/lib/fulfillment.ts`.**
- Change the product comment to: front GA-01-F 11 × 3.72 in, back GA-01-B v6 5.00 × 1.812 in, transfer print; the White colourway uses ink versions of the same files.
- Add a `White` entry with the real design ID and SKUs from 3C.6. Don't change the Black or True Royal IDs or SKUs.

**d. `src/lib/product-image.ts`.** Allow `WHITE_` and the V6 backs in the regexes, and add a new revision so caches refresh:
```ts
const isRevisedBack = /^\/products\/GOOOL_MODERN_PERFORMANCE_(?:ROYAL_|WHITE_)?BACK_DETAIL_V6\.png$/.test(url.pathname);
const revision = isRevisedBack
  ? "modern-back-v6-5in-20260926"
  : /^\/products\/GOOOL_MODERN_PERFORMANCE_(?:ROYAL_|WHITE_)?(?:FRONT|BACK_DETAIL)_V[36]\.png$/.test(url.pathname)
  ? "modern-print-20260925-v4"
  : "backdrop-20260925";
```

**e. Size chart.** No change (`st720`).

**f. Canonical files and launch folder.**
- Put the four print files in a new `designs/31_modern-sport-v6-all-colours-2026-09-26/exports/`, along with `MEASUREMENTS.json` and this handoff. Mark `02_modern-sport-performance-tee/artwork/pending-v5/` as superseded by v6. Don't upload v5.
- Add the White row to `CORE-CAPSULE-LAUNCH-2026-09-25/README.md`, then re-run `python scripts/assemble-core-capsule.py`.

**g. Go-live gate.** Keep White off sale until `resolveApliiqSku` returns a real SKU for every size.

## 5. Report back

- For each of 6112037, 6113361 and the new White ID: the linked front and back filenames, the sizes entered, and the measured offsets from the collar seams.
- The White design ID and its 5 SKUs.
- The site shows Black, True Royal and White, each with its front and V6 back. Checkout resolves all 15 SKUs.
- The production deploy ID, and the public PDP URL returning 200.

## 6. Owner notes

- The back is now larger: **5.00 in wide instead of 3.25 in.** That's the smallest clean size where every letter clears 2.5 mm. At the old size the details would fall below Apliiq's minimum.
- ATHLETICS on the back is slightly lighter than v5, so it matches the front's ATHLETICS weight (3.03 mm strokes on both).
- The website images are concept renders. Replace them with photos once there's a physical sample.
