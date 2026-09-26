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
  size change or a new colourway means building a new design in the
  customizer (products → blank → customize), which yields a new design id
  and new SKUs. That changes what live orders print: stop and get the
  owner's go-ahead, then create it, read the id and SKUs off the account,
  update `fulfillment.ts`, and only then remove `comingSoon`.
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
  `designs/31_matchday-tee-v6-all-colours-2026-09-25/`. Site done; Apliiq
  blocked on the size-change limitation above.
