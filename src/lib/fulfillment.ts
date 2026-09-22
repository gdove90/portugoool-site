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
  // GOOOL Casual Wordmark Tee (Bella+Canvas 4810GD). Front print rebuilt at
  // 10in (was 6.75in) on 2026-09-21; each color is a NEW saved design because
  // Apliiq has no in-place artwork swap. Old designs 6098963/6099060 (and a
  // misconfigured intermediate, 6113937 - Washed Black with the wrong ink -
  // created while switching the grey colorway) are still live in the Apliiq
  // account with no delete path there; do not resurrect their SKUs here.
  "70000000-0000-4000-8000-000000000003": {
    "Washed Black": {
      apliiqProductId: 6113934,
      skus: {
        S: "APQ-6113934S6A1",
        M: "APQ-6113934S7A1",
        L: "APQ-6113934S8A1",
        XL: "APQ-6113934S1A1",
        XXL: "APQ-6113934S2A1",
      },
    },
    "Washed Grey": {
      apliiqProductId: 6113938,
      skus: {
        S: "APQ-6113938S6A1",
        M: "APQ-6113938S7A1",
        L: "APQ-6113938S8A1",
        XL: "APQ-6113938S1A1",
        XXL: "APQ-6113938S2A1",
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
  // ── GOOOL Athletics additions (saved designs created and SKUs read
  // from merchandise/detail on 2026-09-22). The catalog still gates all
  // of these behind priceCents 0 + availableForSale false +
  // supplierType "unassigned"; mapping them here does NOT open
  // purchasing, it records the verified supplier identifiers.
  // GOOOL Athletics Modern Sport Tee (Bella+Canvas 3010, black)
  "80000000-0000-4000-8000-000000000001": {
    Black: {
      apliiqProductId: 6112026,
      skus: {
        S: "APQ-6112026S6A1",
        M: "APQ-6112026S7A1",
        L: "APQ-6112026S8A1",
        XL: "APQ-6112026S1A1",
        XXL: "APQ-6112026S2A1",
      },
    },
  },
  // GOOOL Athletics Varsity Tee (Bella+Canvas 4810GD, Washed Black)
  // Front print only (11in, GA-02-F) - the back mark (GA-02-B) was dropped
  // 2026-09-21 because it could not be placed to match the site's concept
  // art within Back Box 1 (see products.ts). Washed Black rebuilt at
  // 6113914 (was 6112032, front+back - now VOID in Apliiq); Washed Navy is
  // a genuinely new colorway at 6113912.
  "80000000-0000-4000-8000-000000000002": {
    "Washed Black": {
      apliiqProductId: 6113914,
      skus: {
        S: "APQ-6113914S6A1",
        M: "APQ-6113914S7A1",
        L: "APQ-6113914S8A1",
        XL: "APQ-6113914S1A1",
        XXL: "APQ-6113914S2A1",
      },
    },
    "Washed Navy": {
      apliiqProductId: 6113912,
      skus: {
        S: "APQ-6113912S6A1",
        M: "APQ-6113912S7A1",
        L: "APQ-6113912S8A1",
        XL: "APQ-6113912S1A1",
        XXL: "APQ-6113912S2A1",
      },
    },
  },
  // GOOOL Athletics Minimal Club Tee (Bella+Canvas 3010, Natural)
  "80000000-0000-4000-8000-000000000003": {
    Natural: {
      apliiqProductId: 6112018,
      skus: {
        S: "APQ-6112018S6A1",
        M: "APQ-6112018S7A1",
        L: "APQ-6112018S8A1",
        XL: "APQ-6112018S1A1",
        XXL: "APQ-6112018S2A1",
      },
    },
  },
  // GOOOL Athletics Circular Badge Tee (Comfort Colors C1717, Ivory)
  "80000000-0000-4000-8000-000000000004": {
    Ivory: {
      apliiqProductId: 6112033,
      skus: {
        S: "APQ-6112033S6A1",
        M: "APQ-6112033S7A1",
        L: "APQ-6112033S8A1",
        XL: "APQ-6112033S1A1",
        XXL: "APQ-6112033S2A1",
      },
    },
  },
  // GOOOL Athletics Modern Sport Performance Tee (Sport-Tek ST720).
  // Two colourways on the SAME blank (garment 782) with the SAME artwork
  // files at the same sizes - front GA-01-F 11 x 3.73 in, back GA-01-B
  // 3.25 x 1.11 in, transfer print. Apliiq keeps one saved design per
  // colour, so each colour resolves to its own product id and SKU set.
  "80000000-0000-4000-8000-000000000006": {
    Black: {
      apliiqProductId: 6112037,
      skus: {
        S: "APQ-6112037S6A1",
        M: "APQ-6112037S7A1",
        L: "APQ-6112037S8A1",
        XL: "APQ-6112037S1A1",
        XXL: "APQ-6112037S2A1",
      },
    },
    "True Royal": {
      apliiqProductId: 6113361,
      skus: {
        S: "APQ-6113361S6A1",
        M: "APQ-6113361S7A1",
        L: "APQ-6113361S8A1",
        XL: "APQ-6113361S1A1",
        XXL: "APQ-6113361S2A1",
      },
    },
  },
  // GOOOL Athletics Circular Center Crewneck (AS Colour 5150 Made Crew).
  // The catalog color string is "Gray Heather"; the supplier's only
  // heather gray on this blank is "Athletic Heather" (color id 2873),
  // confirmed by the owner on 2026-09-21. The site copy keeps the
  // descriptive name, the supplier variant is the authority.
  "80000000-0000-4000-8000-000000000005": {
    "Gray Heather": {
      apliiqProductId: 6112046,
      skus: {
        S: "APQ-6112046S6A1",
        M: "APQ-6112046S7A1",
        L: "APQ-6112046S8A1",
        XL: "APQ-6112046S1A1",
        XXL: "APQ-6112046S2A1",
      },
    },
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
