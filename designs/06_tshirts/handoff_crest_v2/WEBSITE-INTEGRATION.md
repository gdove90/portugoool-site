# Crest V2 Line — goool.shop Website Integration Spec

For Claude Code, working in the repo (read `CLAUDE.md` first).
Branch: `feat/crest-v2-line` — not main.

## What this line is
6 casual tees, all on the **American Apparel 1301GD Unisex Garment-Dyed
Heavyweight Cotton Tee** via **Printful DTF printing**. Per-SKU garment color,
artwork, and placement specs: `specs/*.md` in this package. Print files:
`production/`. Product images for the site: `mockups/` (design mockups —
replace with Printful-generated mockups or real photos before activating;
per CLAUDE.md, listings never ship with concept art).

## 1 · src/lib/products.ts — add 6 products
New ID series `60000000-…` (crest line). Follow the existing entry shape exactly.
Shared values: `category: "casual"`, `supplierType: "printful"`,
`isActive: false` (activate only after samples pass), `sizes: SHIRT_SIZES`,
no drop fields (`isLimitedDrop: false, dropVersion: null, dropLimit: null,
dropSoldCount: 0`), no customization, `fabric: HEAVY_FABRIC`,
`fit: OVERSIZED_FIT`, `careInstructions: CASUAL_CARE`.

| # | id suffix | name | slug | priceCents | color / colorHex |
|---|---|---|---|---|---|
| 1a | …0001 | GOOOL Crest Tee — Cream | crest-tee-cream | 3300 | Faded Cream / #FFF9E9 |
| 1b | …0002 | GOOOL Crest Tee — Faded Black | crest-tee-faded-black | 3300 | Faded Black / #55565A |
| 1c | …0003 | GOOOL Crest Statement Tee — Cream | crest-statement-tee-cream | 3500 | Faded Cream / #FFF9E9 |
| 1d | …0004 | GOOOL Full-Back Crest Tee — Faded Black | crest-fullback-tee-faded-black | 3800 | Faded Black / #55565A |
| 1e | …0005 | GOOOL Crest Tee — Faded Navy (Center Front) | crest-centerfront-tee-faded-navy | 3500 | Faded Navy / #4F5C71 |
| 1g | …0006 | GOOOL Crest Tee — Faded Navy | crest-tee-faded-navy | 3300 | Faded Navy / #4F5C71 |

Descriptions: short, emotional, voice.md rules ("Premium restraint" — suggest
one-liners, e.g. 1a: "The crest, quiet, where it belongs. Heavyweight
garment-dyed cotton."). Images: `/products/<slug>.webp` + `/products/<slug>-back.webp`.

## 2 · src/lib/printful.ts — add the tee mapping
The AA 1301GD is NOT product 644 (that's the AOP jersey). Add:

```ts
/** Printful catalog product — American Apparel 1301GD Garment-Dyed Heavyweight Tee (DTF). */
export const PRINTFUL_HEAVY_TEE_PRODUCT_ID = 0; // TODO: look up via GET /products?search=1301GD
export const HEAVY_TEE_VARIANT_IDS: Record<string /* color */, Partial<Record<Size, number>>> = {
  "Faded Black": {}, "Faded Navy": {}, "Faded Cream": {}, // TODO: fill from GET /products/{id}
};
```

Then extend `PRINTFUL_PRODUCTS` with the 6 slugs → `{ catalogProductId:
PRINTFUL_HEAVY_TEE_PRODUCT_ID, variantIds: HEAVY_TEE_VARIANT_IDS["<color>"] }`.

**Pulling the real IDs** (store "Portugoool" id 18439032, token in
PRINTFUL_API_KEY): `GET https://api.printful.com/products?search=garment-dyed
heavyweight` → find American Apparel 1301GD → `GET /products/{id}` → map each
size variant id per color (S–3XL; Printful spells XXL "2XL"). Verify the DTF
technique flag on the variants. Comment the verified date like the existing file.

## 3 · Printful dashboard (manual or via API)
One sync product per SKU: product = AA 1301GD, technique = **DTF**, color +
size range per `specs/SKU-*.md`, artwork from `production/` at the exact
print width/placement in the spec. Reuse Printful's generated mockups as the
site's product images (`/public/products/<slug>.webp`, front + back).

## 4 · Out of scope
No Supabase writes, no activating products (`isActive` stays false until
physical samples pass), no homepage/nav changes — the line appears in /shop
automatically once activated.
