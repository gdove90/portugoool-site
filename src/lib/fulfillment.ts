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
  // GOOOL Core Badge Tee (Sport-Tek ST720)
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
  // GOOOL Core Hoodie · Red (Independent IND4000), remade 2026-09-24 with
  // the 3010 tee print sets (designs/00_asset-library/CORE-HOODIE-REMAKE-DECISION.md).
  // One saved design per colour; keys are the colorVariants[].name strings
  // checkout resolves by. Dropship quote read from the saved designs the
  // same day: $44.43 per unit with both transfers, XXL +$2.00.
  // The wordmark-only designs 6098974 (Black) and 6099064 (Bone) are no
  // longer mapped; they still exist on Apliiq and are not deleted.
  "70000000-0000-4000-8000-000000000002": {
    Black: {
      apliiqProductId: 6121031,
      skus: {
        S: "APQ-6121031S6A1",
        M: "APQ-6121031S7A1",
        L: "APQ-6121031S8A1",
        XL: "APQ-6121031S1A1",
        XXL: "APQ-6121031S2A1",
      },
    },
    Bone: {
      apliiqProductId: 6120990,
      skus: {
        S: "APQ-6120990S6A1",
        M: "APQ-6120990S7A1",
        L: "APQ-6120990S8A1",
        XL: "APQ-6120990S1A1",
        XXL: "APQ-6120990S2A1",
      },
    },
    "Grey Heather": {
      apliiqProductId: 6121043,
      skus: {
        S: "APQ-6121043S6A1",
        M: "APQ-6121043S7A1",
        L: "APQ-6121043S8A1",
        XL: "APQ-6121043S1A1",
        XXL: "APQ-6121043S2A1",
      },
    },
  },
  // GOOOL Core Hoodie · Club Blue (Independent IND4000), the 4b set, its
  // own product since 2026-09-24.
  "70000000-0000-4000-8000-000000000006": {
    Black: {
      apliiqProductId: 6121042,
      skus: {
        S: "APQ-6121042S6A1",
        M: "APQ-6121042S7A1",
        L: "APQ-6121042S8A1",
        XL: "APQ-6121042S1A1",
        XXL: "APQ-6121042S2A1",
      },
    },
    Bone: {
      apliiqProductId: 6121021,
      skus: {
        S: "APQ-6121021S6A1",
        M: "APQ-6121021S7A1",
        L: "APQ-6121021S8A1",
        XL: "APQ-6121021S1A1",
        XXL: "APQ-6121021S2A1",
      },
    },
    "Grey Heather": {
      apliiqProductId: 6121044,
      skus: {
        S: "APQ-6121044S6A1",
        M: "APQ-6121044S7A1",
        L: "APQ-6121044S8A1",
        XL: "APQ-6121044S1A1",
        XXL: "APQ-6121044S2A1",
      },
    },
  },
  // GOOOL Terrace Tee · Red (4a set), rebuilt on the Bella+Canvas
  // 3010 on 2026-09-24 (designs/00_asset-library/CASUAL-TEE-3010-DECISION.md).
  // One saved design per colour. Keys are the colorVariants[].name strings
  // from products.ts ("Black", "Natural"), because that is the value
  // checkout passes to resolveApliiqSku; the Apliiq swatch name lives in
  // supplierColor and is NOT the key. (Until 2026-09-24 the black entry
  // was keyed "black" and could never resolve.)
  //
  // The 4810GD designs this replaced (6098963, 6099060, then 6113934,
  // 6113938) were deleted on Apliiq by the owner on 2026-09-23; their
  // SKUs are gone with them and are not carried here.
  "70000000-0000-4000-8000-000000000003": {
    Black: {
      apliiqProductId: 6120860,
      skus: {
        S: "APQ-6120860S6A1",
        M: "APQ-6120860S7A1",
        L: "APQ-6120860S8A1",
        XL: "APQ-6120860S1A1",
        XXL: "APQ-6120860S2A1",
      },
    },
    // Natural (4a-N, red band): saved by the owner on 2026-09-24 as design
    // 6120889 (Apliiq name "GOOOL Casual Wordmark Tee"; colour natural,
    // 4a-natural-front at 11 x 4.55, 4a-back-yoke at 12 x 2, transfer).
    Natural: {
      apliiqProductId: 6120889,
      skus: {
        S: "APQ-6120889S6A1",
        M: "APQ-6120889S7A1",
        L: "APQ-6120889S8A1",
        XL: "APQ-6120889S1A1",
        XXL: "APQ-6120889S2A1",
      },
    },
  },
  // GOOOL Terrace Tee · Club Blue (4b set). Its own product since
  // 2026-09-24 (owner decision); before that the Natural blue-band design
  // was the Natural variant of ...0003.
  // Natural was saved by the owner on 2026-09-24 as design 6120887; an
  // identical second save, 6120888, exists on the account renamed
  // "DUPLICATE of 6120887 · do not use" and must never be mapped. Design
  // record read the same day: front 11 x 4.55 in, back 12 x 2 in, both
  // transfer.
  "70000000-0000-4000-8000-000000000005": {
    "Natural": {
      apliiqProductId: 6120887,
      skus: {
        S: "APQ-6120887S6A1",
        M: "APQ-6120887S7A1",
        L: "APQ-6120887S8A1",
        XL: "APQ-6120887S1A1",
        XXL: "APQ-6120887S2A1",
      },
    },
    // Black (4b black) saved 2026-09-24 as design 6120898, "GOOOL Casual
    // Wordmark Tee · Black · Blue Band": front lockup 222 px = 11.10 in
    // (Apliiq's quarter-inch readout shows 11 x 4.55), back band 12 x 2.01,
    // both transfer, production notes carry the 3.00 in / 1.50 in collar
    // offsets. Not yet a variant in products.ts: renders pending.
    Black: {
      apliiqProductId: 6120898,
      skus: {
        S: "APQ-6120898S6A1",
        M: "APQ-6120898S7A1",
        L: "APQ-6120898S8A1",
        XL: "APQ-6120898S1A1",
        XXL: "APQ-6120898S2A1",
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
  // GOOOL Athletics Badge Cap (OTTO 31-069, Black/Natural, front embroidery
  // 2.00 x 2.02in, 14,140 stitches). Apliiq caps the badge at 2in on this
  // hat - it silently resizes anything larger, confirmed in both the legacy
  // and v5 customizers.
  "80000000-0000-4000-8000-000000000007": {
    "Black/Natural": {
      apliiqProductId: 6117349,
      skus: { OS: "APQ-6117349S34A1" },
    },
  },
  // GOOOL Athletics Stacked Cap (OTTO 31-069, Black/Natural, front
  // embroidery 3.75 x 1.70in, 22,313 stitches - over Apliiq's 15,000
  // included, and the overage is already inside the quoted price).
  "80000000-0000-4000-8000-000000000008": {
    "Black/Natural": {
      apliiqProductId: 6117282,
      skus: { OS: "APQ-6117282S34A1" },
    },
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
  // Front print only (12.5in, GA-02-F) - the back mark (GA-02-B) was dropped
  // 2026-09-21 because it could not be placed to match the site's concept
  // art within Back Box 1 (see products.ts). Scaled from 11in to 12.5in
  // 2026-09-21 (owner decision) - 14in was tested and rejected, it crowds
  // the sleeve seams; 12.5in leaves real margin on both sides. Both
  // colorways rebuilt again at 6114178 / 6114196 (were 6113914 / 6113912,
  // 11in - now VOID in Apliiq, no in-place resize exists there).
  "80000000-0000-4000-8000-000000000002": {
    "Washed Black": {
      apliiqProductId: 6114178,
      skus: {
        S: "APQ-6114178S6A1",
        M: "APQ-6114178S7A1",
        L: "APQ-6114178S8A1",
        XL: "APQ-6114178S1A1",
        XXL: "APQ-6114178S2A1",
      },
    },
    "Washed Navy": {
      apliiqProductId: 6114196,
      skus: {
        S: "APQ-6114196S6A1",
        M: "APQ-6114196S7A1",
        L: "APQ-6114196S8A1",
        XL: "APQ-6114196S1A1",
        XXL: "APQ-6114196S2A1",
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
  // GOOOL Matchday Tee (Sport-Tek ST720).
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
