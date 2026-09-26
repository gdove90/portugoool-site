---
name: apliiq-asset-to-website
description: Take a print package (files, measurements, renders) for a GOOOL garment, file it, update or create the Apliiq saved design, wire the SKUs, and put the product on goool.shop. Use for any new colourway, print revision or new product.
---

# From print package to Apliiq to goool.shop

The owner hands over a package (usually a zip in Downloads) with print
files, a measurements file, site renders and a handoff note. This is the
full path from that zip to a sellable product. Read the whole thing once;
then it is a checklist.

## 0. Ground rules

- **The site is the source of truth for what is sold.** Never retire or
  add a product because a note says so; the owner decides. Names the
  owner has locked win over names a handoff proposes.
- **Never place paid orders or message the supplier** without the owner.
- **Print minimums:** Apliiq DTF ("transfer print") needs every stroke
  and gap at least 2 mm at final size; the house target is 2.5 mm. Files
  must be RGB PNG, transparent, fully opaque pixels, drawn at final size
  (300 ppi, or 600 ppi for small back marks). Never let Apliiq auto-fit
  or shrink art; type the size the package specifies.
- **Concept renders stay labelled** "Concept render. Not a photograph of
  a manufactured sample." until a physical sample exists.
- Brand rules: GOOOL with three O's; no crests, federation or league
  marks; red = #C1121F on the site, print rule red #C52D32.

## 1. File the package (repo)

1. Extract to the scratchpad; read the handoff and MEASUREMENTS first.
2. Create `designs/NN_<product>-<what>-<date>/` (next number after the
   highest in `designs/`) with `exports/front`, `exports/back`,
   `site-images/`, `MEASUREMENTS.json`, `HANDOFF-AS-RECEIVED.md`,
   `package-as-received.zip`, and a `README.md` that records: sizes,
   positions, measured stroke/gap, what changed and why, what was
   applied, what is still to do at the supplier.
3. Copy `site-images/*` into `public/products/`. Keep the package's
   filenames; they carry the version (V3, V6).
4. `CORE-CAPSULE-LAUNCH-2026-09-25/` is a curated copy. Add the new
   source folder to the product's PLAN entry in
   `scripts/assemble-core-capsule.py`, then regenerate:
   `cmd //c "rmdir /s /q CORE-CAPSULE-LAUNCH-2026-09-25"` (OneDrive locks
   defeat rmtree) then `python scripts/assemble-core-capsule.py`.
   Mark superseded artwork with a `SUPERSEDED-BY-*.txt` beside it.

## 2. Website (repo `src/`)

- `src/lib/products.ts`: the product block. Update `images` and each
  `colorVariants[].images` to the new render paths, alt text, the
  `description`, and the comment block above the product (sizes, why,
  pointer to the designs folder). New colourway = a new `colorVariants`
  entry with `name`, `supplierColor` (Apliiq's colour word),
  `hex` (sample the garment body from Apliiq's own mockup, not their
  swatch), `skuFragment`, `images`.
- **A colourway whose Apliiq design does not exist yet** gets
  `comingSoon: true` on the variant. `ProductDetail` then replaces the buy
  buttons and says "<Colour> is coming soon." Remove the flag only when
  `fulfillment.ts` has its real id and SKUs.
- `src/lib/product-image.ts`: images at reused paths need a new
  `revision` string or browsers keep the old bytes. New filenames need
  their pattern added to the regex.
- `src/lib/fulfillment.ts`: one entry per colour under the product id:
  `apliiqProductId` and the five SKUs `APQ-<id>S6A1` S, `S7A1` M,
  `S8A1` L, `S1A1` XL, `S2A1` XXL. **Read them from the account, never
  infer.** Update the comment with the print sizes.
- `src/lib/size-charts.ts` only if the blank changed.
- Renames: display `name` only. Slugs stay (live, indexed). Sync the
  database name with a migration (see the `supabase-sql-editor` skill).
- `npx tsc --noEmit -p .`, then preview: `preview_start` name
  `portugooool-dev`, open `/shop/<slug>?color=<Colour>`, check images,
  swatches, buy state. Commit. Deploy:
  `rm -rf .next && NEXT_PUBLIC_SITE_URL=https://goool.shop npx netlify deploy --prod --build --context production`
  (stop the preview first; both use `.next`). Verify on goool.shop.

## 3. Apliiq (owner's Chrome, signed in as hello@goool.shop)

Load the Chrome tools with one ToolSearch (`tabs_context_mcp, navigate,
browser_batch, find, computer, get_page_text, javascript_tool`).

- Saved designs list: `https://www.apliiq.com/design` (the left nav
  "saved designs"). `/account` and `/account/designs` are 404s.
- A design's page: `https://www.apliiq.com/product/<id>/<slug>`. It shows
  the colour offered, the blank card (pencil = change the BLANK only),
  "add to store", and one card per placement with the linked file, its
  size and a "..." menu: **upload hi res**, **add note**, **remove**.
- **Upload hi res** links a production file to an existing placement
  without changing its size or the design id. Use it when the art is
  redrawn at the SAME size. Confirm in the design's activity log.
- **There is no way to change a placement's size on a saved design.** A
  size change or a new colourway means building a NEW design in the
  customizer, which yields a new design id and new SKUs. That changes what
  live orders print: get the owner's go-ahead, build it, read the id and
  SKUs off the design page, update `fulfillment.ts`, then remove
  `comingSoon`. Rename the superseded design "delete" (owner convention;
  Apliiq has no delete), never map it again.

### Building a design in the v5 customizer (proven 2026-09-25)

URL: `https://www.apliiq.com/customize/v5/mens/tshirts/<Blank-Slug>/design`
(ST720 = `Sustainable-Athletic-Tee`). Wait ~10 s. Coordinates below are the
1568x653 screenshot frame at a 1707-wide viewport.

1. **Colour:** click the "colors" nav icon (60,265); tiles: white (180,242),
   silver (273,242, selected by default: click it to deselect), true royal
   (368,242), black (180,353). Confirm with the product summary text
   (`colors | <name>`); one colour per design.
2. **Upload:** `find "input type=file (all file inputs)"` and `file_upload`
   the print PNG to the ref named **"upload artwork"** (`#v5ArtworkFileInput`;
   the other refs are the wrong inputs and silently do nothing). Wait 20 s.
   If a "loading artwork" overlay (`.toWait.waitingMsg`) sticks, remove it
   with JS: `document.querySelectorAll('.toWait, .waitingMsg').forEach(w=>w.remove())`.
3. **Select** the art with a REAL click (computer left_click on it; the
   default drop is at frame (855,386) front, (850,300) back). Synthetic JS
   clicks do not activate it. Check `$('#c-svgContainer .activeArtwork').length`.
4. **Size and position numerically.** The customizer is jQuery UI
   resizable at **20 px per inch** (front print box 280 x 380 px at
   container (160,300); back box at (154,206)). The drag handle is hidden,
   so call the widget's own stop handler:
   ```js
   const el=$('#c-svgContainer .activeArtwork');
   const W=in*20, H=in*20, L=boxLeft+boxWidth/2-W/2, T=seamY+offset*20;
   el.css({width:W+'px',height:H+'px',left:L+'px',top:T+'px'});
   el.resizable('option','stop').call(el[0], $.Event('resizestop',{target:el[0]}),
     {size:{width:W,height:H},position:{top:T,left:L},originalSize:{width:75,height:25},originalPosition:{top:300,left:263}});
   const c=customizer.activeArtwork.current; [c.Value.Width_Inch,c.Value.Height_Inch,c.Value.position]
   ```
   Collar seams on Apliiq's ST720 base mockups: front y 252, back y 203
   (container px). Front 3.00 in below seam = top 312; back 2.00 in below
   = top 243. Verify the readout (`.artwork-dim` text, e.g. `11" X 3.72"`).
   The Value.size stays in px; Apliiq stores inches from px/20.
5. **Hi-res:** the size readout says `low (NaN dpi)` until the production
   file is linked. `find "input type=file for linking high resolution
   artwork"` (`#hires_ufileinp`, bound to the active artwork), `file_upload`
   the same PNG, then click the **Yes** in the "continue uploading" dialog
   (find it). Readout becomes `ideal quality` and
   `c.Value.userItem.hiResPath()` is set. Do this per placement while it is
   the active artwork.
6. Production method select (`combobox "transfer print"`, value 17) is the
   default; "enable recoloring" stays unchecked (white art stays white).
7. **Back view:** `find "Back view tab"` (listitem) and click its ref; the
   back base is 4903 with its own bounding box. Repeat 2 to 5.
8. Branding: none for the Matchday Tee (the old design had none). Check
   the old design's page before assuming.
9. **Save:** `find "save design button"`, click; then `find` the name
   textbox ("get creative with a name."), triple-click, type the name
   (`GOOOL <Product> - <Colour>`), dispatch `change` on `#designedname`,
   click the form's **save**. Wait 10 s. The new id is on
   `https://www.apliiq.com/design` (row image `/Image/Product/<id>/…`).
10. **Verify** on `/product/<id>`: scroll down once (the right column
    renders lazily), read `document.body.innerText` from "color offered":
    files, sizes, hi-res names, SKUs `APQ-<id>S6A1…`, activity log.
11. **Rename the old design "delete":** on its page
    `productView.Name('delete'); productView.savetd({currentTarget: <the save button>})`
    (the plain click did not persist); reload to confirm the `h1`.

Screenshots of the customizer time out while an artwork is selected; use
JS readouts instead. `get_page_text` on design pages returns only the
branding article; use `document.body.innerText`.

- After any change: proof-check every placement on the mockup (open
  counters, letter gaps, solid rules, no auto-fit), record the activity
  log entry, and note that no physical sample exists until one is ordered.

## 4. Report

Per design: linked front and back filenames, sizes entered, activity
log lines. New design ids and SKUs. What the site shows per colour, the
deploy id, and the PDP URL returning 200. What is still unverified
(always: physical sample).

## Records

- 2026-09-25 Matchday Tee: back v6 5.00 x 1.812 in, White colourway.
  `designs/31_matchday-tee-v6-all-colours-2026-09-25/`. Three new designs
  built with the procedure above (6136475 Black, 6136494 True Royal,
  6136511 White); 6112037 and 6113361 renamed "delete"; all three
  colourways live on the site.
