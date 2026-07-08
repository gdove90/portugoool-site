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
  S: 16260,
  M: 16261,
  L: 16262,
  XL: 16263,
  XXL: 16264, // Printful calls this 2XL
  "3XL": 16265,
};

/**
 * Product slug → Printful mapping. Jerseys only for now — casual tees,
 * cap, and stickers get mapped once their blanks are chosen and sampled.
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
};
