# GOOOL Four-Product Capsule — Website Catalog Replacement

Act as a coordinated senior ecommerce implementation team consisting of:

- Executive Apparel Creative Director
- Senior Ecommerce Product Designer
- Frontend Technical Lead
- Supabase Data Engineer
- Digital Asset and Performance Specialist
- Quality-Assurance Director

Execute this as a controlled premium-brand catalog release. Work directly in the existing `portugoool` repository, preserve established architecture, and make no production deployment.

## Objective

Replace the currently active GOOOL.shop catalog with a four-product launch capsule in a recoverable, preview-only branch. The new products must display as **Coming Soon** and must not be purchasable.

Create or use the branch:

`goool-four-product-capsule`

Do not deploy to production. Finish with a Netlify branch-preview URL for owner approval.

## Approved capsule

| Product | Blank | Color | Sizes | Retail |
|---|---|---|---|---:|
| GOOOL Performance Badge Tee | Sport-Tek ST720 | Black | S, M, L, XL, 2XL | $48 |
| GOOOL Core Hoodie | Independent Trading Co. IND4000 | Black | S, M, L, XL, 2XL | $78 |
| GOOOL Casual Wordmark Tee | Bella+Canvas 4810GD | Washed Black | S, M, L, XL, 2XL | $38 |
| GOOOL Touchline Cap | OTTO 31-069 | Black/Natural | One Size | $36 |

Do not add XS, 3XL, alternative colors, bundles, discounts, invented inventory, or additional products.

## Approved public image mapping

All approved public images belong in `public/products/`.

### Performance tee

Primary:
`GOOOL_MOCKUP_01_ST720_PERFORMANCE_TEE_BLACK.png`

Secondary:
`GOOOL_LIFESTYLE_01_ST720_PERFORMANCE_TEE_SOCCER_FIELD.png`

### Hoodie

Primary:
`GOOOL_MOCKUP_02_IND4000_HOODIE_BLACK.png`

Secondary:
`GOOOL_LIFESTYLE_02_IND4000_HOODIE_STADIUM_TUNNEL.png`

### Casual tee

Primary:
`GOOOL_MOCKUP_03_4810GD_CASUAL_TEE_WASHED_BLACK.png`

Secondary:
`GOOOL_LIFESTYLE_03_4810GD_CASUAL_TEE_SOCCER_FIELD.png`

### Cap

Primary:
`GOOOL_MOCKUP_04_OTTO31069_CAP_BLACK_NATURAL.png`

Secondary:
`GOOOL_LIFESTYLE_04_OTTO31069_CAP_STADIUM.png`

Use the clean product-only image as the first/primary image and the on-model image as the second image. Do not crop the artwork, stretch the image, generate substitutes, or use any old website product image.

## Cap revision — mandatory

The cap uses the centered front GOOOL wordmark only.

`THE SOUND OF VICTORY` has been rejected and must not appear on the website, in product copy, in alt text, in image filenames, or as a side embroidery claim. Do not use the older two-cap mockup.

## Private production files

The verified POD masters and specification packet remain private under:

`designs/GOOOL_POD_SAMPLE_PACKET/`

They must remain ignored by Git and must never be copied, imported, referenced, or bundled into `public/`, application code, a deployment artifact, or a public URL.

Use the specification PDF only to verify factual garment and decoration details. Do not expose private artwork paths or production hashes to customers.

## Catalog and data implementation

1. Inspect the existing product model, `src/lib/products.ts`, Supabase migrations, product queries, product detail pages, cart logic, and checkout enforcement before changing anything.
2. Preserve the current six products as inactive/recoverable records. Do not delete their images, migrations, history, identifiers, or database rows.
3. Make only the four approved capsule products active and visible.
4. Add the smallest clear availability mechanism required by the existing architecture, such as `availableForSale`, with the four new products set to `false`.
5. Enforce non-purchasability server-side as well as in the interface. A customer must not be able to add a Coming Soon product through a direct request, stale client state, manually constructed URL, or API call.
6. Display a clear `Coming Soon` status and disabled purchase control without presenting false inventory.
7. Keep prices visible for market testing.
8. Follow the repository's established migration, type, and product-data conventions. Do not create duplicate sources of truth.

## Product copy

Write concise premium product descriptions grounded only in the approved blank and the private specification packet. Describe fit, intended use, fabric category, color, decoration placement, and care only when verified.

Do not invent sustainability claims, performance ratings, shipping dates, inventory quantities, fulfillment times, warranties, certifications, or Apliiq quality guarantees.

## Image implementation

- Preserve the supplied 1600×1600 PNG masters.
- Follow the site's existing image-loading and optimization system.
- Prevent layout shift and preserve a 1:1 aspect ratio.
- Use meaningful product-specific alt text; do not keyword-stuff.
- Confirm that the primary image appears first in catalog cards and product galleries.
- Confirm that the secondary on-model image is reachable in the product gallery on mobile and desktop.

## Quality gates

Before producing the preview URL, verify:

- Exactly four active catalog products.
- Correct names, prices, colors, sizes, and image order.
- S through 2XL only for apparel; One Size only for the cap.
- No `THE SOUND OF VICTORY` reference anywhere public.
- Current six products archived/inactive, not deleted.
- All four new products visibly marked Coming Soon.
- Add-to-cart and checkout fail closed for all four products.
- No private production artwork appears in Git status, the public bundle, or deployed assets.
- Responsive catalog and product pages pass at common mobile, tablet, and desktop widths.
- No broken images, hydration errors, console errors, type errors, migration conflicts, or failed tests.
- Existing unrelated site functionality remains intact.

Run the repository's available lint, type-check, unit-test, build, and migration-validation commands. Report any pre-existing failures separately from changes introduced by this branch.

## Stop conditions

Stop and report rather than improvising if:

- Any of the eight approved public images is missing or corrupt.
- The exact product record to deactivate cannot be determined safely.
- A database migration would be destructive or irreversible.
- Checkout cannot be reliably disabled server-side.
- A production deployment would be required to continue.

## Final handoff

Return:

1. Branch name and commit hash.
2. Netlify branch-preview URL.
3. Final four-product catalog table.
4. Files and migrations changed.
5. Test/build results.
6. Confirmation that the old products remain recoverable.
7. Confirmation that private production files remain ignored and undeployed.
8. Confirmation that no production deployment occurred.

Do not merge, deploy to production, enable purchasing, connect live checkout, or place an Apliiq order without explicit written owner approval after the preview is reviewed.
