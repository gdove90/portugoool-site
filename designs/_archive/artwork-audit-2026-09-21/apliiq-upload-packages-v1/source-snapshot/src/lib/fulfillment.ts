import { Size } from "./types";

// ─────────────────────────────────────────────────────────────
// Authoritative Apliiq fulfillment mapping for the First Capsule.
//
// Every SKU below was read from Apliiq's own saved-design records
// (merchandise/detail) on 2026-09-15 — never invented. A saved-design
// id is NOT a SKU; the per-size SKUs follow Apliiq's APQ-{product}S{size}A1
// scheme and are the identifiers their Order API requires.
//
// designs/11_fulfillment/apliiq-product-mapping.md mirrors this table
// for humans; this module is what the integration executes.
// ─────────────────────────────────────────────────────────────

interface ApliiqVariant {
  /** Apliiq saved-product id (the design that gets printed). */
  apliiqProductId: number;
  /** Exact per-size fulfillment SKUs from Apliiq's records. */
  skus: Partial<Record<Size, string>>;
}

/** productId (catalog UUID) → color name → Apliiq variant. */
const MAPPING: Record<string, Record<string, ApliiqVariant>> = {
  // GOOOL Performance Badge Tee (Sport-Tek ST720)
  "70000000-0000-4000-8000-000000000001": {
    Black: {
      apliiqProductId: 6098962,
      skus: {
        S: "APQ-6098962S6A1",
        M: "APQ-6098962S7A1",
        L: "APQ-6098962S8A1",
        XL: "APQ-6098962S1A1",
        XXL: "APQ-6098962S2A1",
      },
    },
    White: {
      apliiqProductId: 6099046,
      skus: {
        S: "APQ-6099046S6A1",
        M: "APQ-6099046S7A1",
        L: "APQ-6099046S8A1",
        XL: "APQ-6099046S1A1",
        XXL: "APQ-6099046S2A1",
      },
    },
    "True Royal": {
      apliiqProductId: 6099129,
      skus: {
        S: "APQ-6099129S6A1",
        M: "APQ-6099129S7A1",
        L: "APQ-6099129S8A1",
        XL: "APQ-6099129S1A1",
        XXL: "APQ-6099129S2A1",
      },
    },
  },
  // GOOOL Core Hoodie (Independent IND4000)
  "70000000-0000-4000-8000-000000000002": {
    Black: {
      apliiqProductId: 6098974,
      skus: {
        S: "APQ-6098974S6A1",
        M: "APQ-6098974S7A1",
        L: "APQ-6098974S8A1",
        XL: "APQ-6098974S1A1",
        XXL: "APQ-6098974S2A1",
      },
    },
    Bone: {
      apliiqProductId: 6099064,
      skus: {
        S: "APQ-6099064S6A1",
        M: "APQ-6099064S7A1",
        L: "APQ-6099064S8A1",
        XL: "APQ-6099064S1A1",
        XXL: "APQ-6099064S2A1",
      },
    },
  },
  // GOOOL Casual Wordmark Tee (Bella+Canvas 4810GD)
  "70000000-0000-4000-8000-000000000003": {
    "Washed Black": {
      apliiqProductId: 6098963,
      skus: {
        S: "APQ-6098963S6A1",
        M: "APQ-6098963S7A1",
        L: "APQ-6098963S8A1",
        XL: "APQ-6098963S1A1",
        XXL: "APQ-6098963S2A1",
      },
    },
    "Washed Grey": {
      apliiqProductId: 6099060,
      skus: {
        S: "APQ-6099060S6A1",
        M: "APQ-6099060S7A1",
        L: "APQ-6099060S8A1",
        XL: "APQ-6099060S1A1",
        XXL: "APQ-6099060S2A1",
      },
    },
  },
  // GOOOL Touchline Cap (OTTO 31-069, Black/Natural, front-only embroidery)
  "70000000-0000-4000-8000-000000000004": {
    "Black/Natural": {
      apliiqProductId: 6098980,
      skus: { OS: "APQ-6098980S34A1" },
    },
    // The cap has no colorVariants on the site; its catalog color string
    // is "Black/Natural" and that is the only decorated colorway.
  },
};

export interface ResolvedFulfillment {
  apliiqProductId: number;
  sku: string;
}

/**
 * Resolve the exact Apliiq SKU for a purchased variant.
 * Returns null when the combination is not mapped — callers must treat
 * that as a hard stop (never substitute a color, size, or garment).
 */
export function resolveApliiqSku(
  productId: string,
  color: string,
  size: Size
): ResolvedFulfillment | null {
  const byColor = MAPPING[productId];
  if (!byColor) return null;
  const variant = byColor[color];
  if (!variant) return null;
  const sku = variant.skus[size];
  if (!sku) return null;
  return { apliiqProductId: variant.apliiqProductId, sku };
}
