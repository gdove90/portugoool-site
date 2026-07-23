// Printful catalog mapping — consumed by the future fulfillment webhook.
// Store: "Portugoool" (id 18439032), token in PRINTFUL_API_KEY (Netlify env
// + .env.local). Managed at developers.printful.com/tokens.
//
// Verified against the live catalog 2026-07-08.

import { Size } from "./types";

/** Printful catalog product 644 — All-Over Print Recycled Unisex Sports Jersey. */
export const PRINTFUL_JERSEY_PRODUCT_ID = 644;

/**
 * Our jersey sizes → Printful catalog variant ids (product 644).
 * Base costs at mapping time: S–XL $30.55 · 2XL $32.55 · 3XL $34.55.
 */
export const JERSEY_VARIANT_IDS: Partial<Record<Size, number>> = {
  XS: 16259,
  S: 16260,
  M: 16261,
  L: 16262,
  XL: 16263,
  XXL: 16264, // Printful calls this 2XL
};

/**
 * Printful catalog product 1589 — American Apparel 1301GD Unisex Garment-Dyed
 * Heavyweight Cotton Tee. Crest V2 line prints via DTF (catalog technique
 * key "DTFILM"). Verified against the live catalog 2026-07-22.
 */
export const PRINTFUL_HEAVY_TEE_PRODUCT_ID = 1589;

/** Crest V2 tee colors → per-size Printful variant ids (product 1589). */
export const HEAVY_TEE_VARIANT_IDS: Record<string, Partial<Record<Size, number>>> = {
  "Faded Black": { S: 50019, M: 50014, L: 50022, XL: 50015, XXL: 50028 }, // Printful calls XXL "2XL"; no XS on the 1301GD blank
  "Faded Cream": { S: 50020, M: 50009, L: 50012, XL: 50023, XXL: 50026 },
  "Faded Navy": { S: 50021, M: 50013, L: 50007, XL: 50006, XXL: 50025 },
};

/**
 * Printful catalog product 713 — AS Colour 5082 Men's Oversized Faded
 * T-Shirt. GOOOL Oval Mark Oversized Tee prints via DTF ("DTFILM" — the
 * technique Printful markets as DTFlex). Verified against the live catalog
 * 2026-07-23. All 18 variants (3 colors x S–3XL) in stock at mapping time.
 */
export const PRINTFUL_OVERSIZED_TEE_PRODUCT_ID = 713;

/** Website color name → Printful source color + per-size variant ids + SKUs. */
export const OVERSIZED_TEE_VARIANTS: Record<
  string,
  { supplierColor: string; sku: Partial<Record<Size, string>>; variantIds: Partial<Record<Size, number>> }
> = {
  "Faded Cream": {
    supplierColor: "Faded Bone",
    sku: { S: "GOOOL-OVAL-TEE-CREAM-S", M: "GOOOL-OVAL-TEE-CREAM-M", L: "GOOOL-OVAL-TEE-CREAM-L", XL: "GOOOL-OVAL-TEE-CREAM-XL", XXL: "GOOOL-OVAL-TEE-CREAM-2XL", "3XL": "GOOOL-OVAL-TEE-CREAM-3XL" },
    variantIds: { S: 17570, M: 17575, L: 17580, XL: 17585, XXL: 17590, "3XL": 17595 }, // Printful calls XXL "2XL"
  },
  "Washed Charcoal": {
    supplierColor: "Faded Black",
    sku: { S: "GOOOL-OVAL-TEE-CHARCOAL-S", M: "GOOOL-OVAL-TEE-CHARCOAL-M", L: "GOOOL-OVAL-TEE-CHARCOAL-L", XL: "GOOOL-OVAL-TEE-CHARCOAL-XL", XXL: "GOOOL-OVAL-TEE-CHARCOAL-2XL", "3XL": "GOOOL-OVAL-TEE-CHARCOAL-3XL" },
    variantIds: { S: 17569, M: 17574, L: 17579, XL: 17584, XXL: 17589, "3XL": 17594 },
  },
  "Dusty Navy": {
    supplierColor: "Faded Indigo",
    sku: { S: "GOOOL-OVAL-TEE-NAVY-S", M: "GOOOL-OVAL-TEE-NAVY-M", L: "GOOOL-OVAL-TEE-NAVY-L", XL: "GOOOL-OVAL-TEE-NAVY-XL", XXL: "GOOOL-OVAL-TEE-NAVY-2XL", "3XL": "GOOOL-OVAL-TEE-NAVY-3XL" },
    variantIds: { S: 34463, M: 34465, L: 34467, XL: 34469, XXL: 34471, "3XL": 34473 },
  },
};

/**
 * Product slug → Printful mapping. Jerseys + crest-v2 tees — GOL casual tees,
 * cap, and stickers get mapped once their blanks are chosen and sampled.
 * The oval tee is variant-based: resolve by color via OVERSIZED_TEE_VARIANTS.
 * Scarf + flag are specialty-supplier products (see materials.md).
 */
export const PRINTFUL_PRODUCTS: Record<
  string,
  { catalogProductId: number; variantIds: Partial<Record<Size, number>> }
> = {
  "home-red-jersey": { catalogProductId: PRINTFUL_JERSEY_PRODUCT_ID, variantIds: JERSEY_VARIANT_IDS },
  "away-white-jersey": { catalogProductId: PRINTFUL_JERSEY_PRODUCT_ID, variantIds: JERSEY_VARIANT_IDS },
  "blackout-edition-jersey": { catalogProductId: PRINTFUL_JERSEY_PRODUCT_ID, variantIds: JERSEY_VARIANT_IDS },
  "emerald-edition-jersey": { catalogProductId: PRINTFUL_JERSEY_PRODUCT_ID, variantIds: JERSEY_VARIANT_IDS },
  "crest-statement-tee-cream": { catalogProductId: PRINTFUL_HEAVY_TEE_PRODUCT_ID, variantIds: HEAVY_TEE_VARIANT_IDS["Faded Cream"] },
  "crest-statement-tee-faded-black": { catalogProductId: PRINTFUL_HEAVY_TEE_PRODUCT_ID, variantIds: HEAVY_TEE_VARIANT_IDS["Faded Black"] },
  "crest-statement-tee-faded-navy": { catalogProductId: PRINTFUL_HEAVY_TEE_PRODUCT_ID, variantIds: HEAVY_TEE_VARIANT_IDS["Faded Navy"] },
};
