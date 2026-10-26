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
  supplier?: "apliiq";
  /** Apliiq saved-product id (the design that gets printed). */
  apliiqProductId: number;
  /** Exact per-size fulfillment SKUs from Apliiq's records. */
  skus: Partial<Record<Size, string>>;
}

/**
 * A Tapstitch saved design (2026-10-26). Tapstitch has no order API wired
 * into this site yet, so the per-size "SKUs" are our own stable line ids,
 * TAP-<designId>-<SIZE>; fulfillment-submit.ts keeps these lines away from
 * Apliiq and alerts the owner to place them on tapstitch.com by hand.
 */
interface TapstitchVariant {
  supplier: "tapstitch";
  /** Tapstitch design id (the "ID:" shown on the Designs list). */
  tapstitchDesignId: string;
  skus: Partial<Record<Size, string>>;
}

type SupplierVariant = ApliiqVariant | TapstitchVariant;

const tapstitch = (designId: string, sizes: Size[]): TapstitchVariant => ({
  supplier: "tapstitch",
  tapstitchDesignId: designId,
  skus: Object.fromEntries(sizes.map((s) => [s, `TAP-${designId}-${s}`])) as Partial<Record<Size, string>>,
});

/** productId (catalog UUID) → color name → supplier variant. */
const MAPPING: Record<string, Record<string, SupplierVariant>> = {
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
  // Three saved designs built fresh on 2026-09-25 in Apliiq's customizer
  // (designs/31_matchday-tee-v6-all-colours-2026-09-25): front GA-01-F v3
  // 11.00 x 3.72 in, top 3.00 in below the front collar seam; back GA-01-B
  // v6 5.00 x 1.812 in, top 2.00 in below the back collar seam; transfer
  // print, hi-res production files linked, no branding service. White uses
  // the ink versions of the same two files. Ids and SKUs read off each
  // design's page the same day. The earlier designs 6112037 (Black) and
  // 6113361 (True Royal), which carried the failed 3.25 in back, were
  // renamed "delete" on Apliiq and are no longer mapped.
  "80000000-0000-4000-8000-000000000006": {
    Black: {
      apliiqProductId: 6136475,
      skus: {
        S: "APQ-6136475S6A1",
        M: "APQ-6136475S7A1",
        L: "APQ-6136475S8A1",
        XL: "APQ-6136475S1A1",
        XXL: "APQ-6136475S2A1",
      },
    },
    "True Royal": {
      apliiqProductId: 6136494,
      skus: {
        S: "APQ-6136494S6A1",
        M: "APQ-6136494S7A1",
        L: "APQ-6136494S8A1",
        XL: "APQ-6136494S1A1",
        XXL: "APQ-6136494S2A1",
      },
    },
    White: {
      apliiqProductId: 6136511,
      skus: {
        S: "APQ-6136511S6A1",
        M: "APQ-6136511S7A1",
        L: "APQ-6136511S8A1",
        XL: "APQ-6136511S1A1",
        XXL: "APQ-6136511S2A1",
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
  // == GOAL Athletics hats (owner upload 2026-10-14) ==
  // OTTO 31-069 Natural caps. Saved-design ids and SKUs read from each
  // Apliiq product page on 2026-10-14. The catalog keeps both products at
  // availableForSale false, so this mapping does not open purchasing.
  // GA Matchday Cap (GA monogram, embroidery 2.25 x 2.03in)
  "80000000-0000-4000-8000-000000000009": {
    "Black/Natural": { apliiqProductId: 6205981, skus: { OS: "APQ-6205981S34A1" } },
    "Red/Natural": { apliiqProductId: 6205977, skus: { OS: "APQ-6205977S34A1" } },
    "Royal/Natural": { apliiqProductId: 6205982, skus: { OS: "APQ-6205982S34A1" } },
    "Dark Green/Natural": { apliiqProductId: 6205989, skus: { OS: "APQ-6205989S34A1" } },
  },
  // Stacked Stadium Cap (GOAL / bar / ATHLETICS, embroidery 4 x 1.51in)
  "80000000-0000-4000-8000-000000000010": {
    "Black/Natural": { apliiqProductId: 6205992, skus: { OS: "APQ-6205992S34A1" } },
    "Red/Natural": { apliiqProductId: 6205994, skus: { OS: "APQ-6205994S34A1" } },
    "Royal/Natural": { apliiqProductId: 6205995, skus: { OS: "APQ-6205995S34A1" } },
    "Dark Green/Natural": { apliiqProductId: 6206101, skus: { OS: "APQ-6206101S34A1" } },
  },
  // == end GOAL Athletics hats ==
  // == GOAL Athletics ST720 GA tees (owner handoff 2026-10-14) ==
  // Saved-design ids read from the Apliiq saved designs list on 2026-10-14.
  // Both products are hidden with no price, so this mapping opens nothing.
  // GA Minimal Tee (GA 3.00in centred on the chest + stacked back 6.00in). Black and True Red moved 2026-10-14 to the centred designs 6206620/6206681 (were left-chest 6206215/6206277); True Royal and White already print centred.
  "80000000-0000-4000-8000-000000000011": {
    "Black": { apliiqProductId: 6206620, skus: { S: "APQ-6206620S6A1", M: "APQ-6206620S7A1", L: "APQ-6206620S8A1", XL: "APQ-6206620S1A1", XXL: "APQ-6206620S2A1" } },
    "True Royal": { apliiqProductId: 6206254, skus: { S: "APQ-6206254S6A1", M: "APQ-6206254S7A1", L: "APQ-6206254S8A1", XL: "APQ-6206254S1A1", XXL: "APQ-6206254S2A1" } },
    "White · Black-Red": { apliiqProductId: 6206255, skus: { S: "APQ-6206255S6A1", M: "APQ-6206255S7A1", L: "APQ-6206255S8A1", XL: "APQ-6206255S1A1", XXL: "APQ-6206255S2A1" } },
    "White · Royal": { apliiqProductId: 6206257, skus: { S: "APQ-6206257S6A1", M: "APQ-6206257S7A1", L: "APQ-6206257S8A1", XL: "APQ-6206257S1A1", XXL: "APQ-6206257S2A1" } },
    "Silver": { apliiqProductId: 6206263, skus: { S: "APQ-6206263S6A1", M: "APQ-6206263S7A1", L: "APQ-6206263S8A1", XL: "APQ-6206263S1A1", XXL: "APQ-6206263S2A1" } },
    "True Red": { apliiqProductId: 6206681, skus: { S: "APQ-6206681S6A1", M: "APQ-6206681S7A1", L: "APQ-6206681S8A1", XL: "APQ-6206681S1A1", XXL: "APQ-6206681S2A1" } },
  },
  // GA Big Tee (lockup 10.00in across the chest)
  "80000000-0000-4000-8000-000000000012": {
    "Black": { apliiqProductId: 6206229, skus: { S: "APQ-6206229S6A1", M: "APQ-6206229S7A1", L: "APQ-6206229S8A1", XL: "APQ-6206229S1A1", XXL: "APQ-6206229S2A1" } },
    "True Royal": { apliiqProductId: 6206234, skus: { S: "APQ-6206234S6A1", M: "APQ-6206234S7A1", L: "APQ-6206234S8A1", XL: "APQ-6206234S1A1", XXL: "APQ-6206234S2A1" } },
    "White · Black-Red": { apliiqProductId: 6206236, skus: { S: "APQ-6206236S6A1", M: "APQ-6206236S7A1", L: "APQ-6206236S8A1", XL: "APQ-6206236S1A1", XXL: "APQ-6206236S2A1" } },
    "White · Royal": { apliiqProductId: 6206239, skus: { S: "APQ-6206239S6A1", M: "APQ-6206239S7A1", L: "APQ-6206239S8A1", XL: "APQ-6206239S1A1", XXL: "APQ-6206239S2A1" } },
    "Silver": { apliiqProductId: 6206241, skus: { S: "APQ-6206241S6A1", M: "APQ-6206241S7A1", L: "APQ-6206241S8A1", XL: "APQ-6206241S1A1", XXL: "APQ-6206241S2A1" } },
    "True Red": { apliiqProductId: 6206251, skus: { S: "APQ-6206251S6A1", M: "APQ-6206251S7A1", L: "APQ-6206251S8A1", XL: "APQ-6206251S1A1", XXL: "APQ-6206251S2A1" } },
  },
  // == end GOAL Athletics ST720 GA tees ==
  // == GOAL Athletics GA Minimal Shorts (owner proof 2026-10-14) ==
  // GA 3.00 x 2.70 in, Front Bottom Left (wearer's left leg), transfer print,
  // with the placement note on each design. Ids and SKUs read off each design
  // page 2026-10-14. Apliiq sizes by waist; owner mapping S=30, M=32, L=34,
  // XL=36, XXL=38 (waist 40, S76A1, is not sold). On sale at $32 since
  // 2026-10-14.
  "80000000-0000-4000-8000-000000000013": {
    "Black": { apliiqProductId: 6208695, skus: { S: "APQ-6208695S71A1", M: "APQ-6208695S72A1", L: "APQ-6208695S73A1", XL: "APQ-6208695S74A1", XXL: "APQ-6208695S75A1" } },
    "Ink Blue": { apliiqProductId: 6208705, skus: { S: "APQ-6208705S71A1", M: "APQ-6208705S72A1", L: "APQ-6208705S73A1", XL: "APQ-6208705S74A1", XXL: "APQ-6208705S75A1" } },
    "Shadow": { apliiqProductId: 6208713, skus: { S: "APQ-6208713S71A1", M: "APQ-6208713S72A1", L: "APQ-6208713S73A1", XL: "APQ-6208713S74A1", XXL: "APQ-6208713S75A1" } },
  },
  // == end GOAL Athletics GA Minimal Shorts ==
  // == GOAL Athletics Heritage Hoodie (Independent IND4000) ==
  // Ids and SKUs read off each design's own page on 2026-10-22. Two
  // transfers per design: GA monogram 4.00 x 3.61 in centred on centre front,
  // top of art 3.00 in below the hood seam; GA monogram 2.00 x 1.80 in on the
  // outer left sleeve, upright, bottom of art 3.00 in above the cuff seam
  // ("do not scale" note on each placement). White/red files on Black,
  // black/red on Grey Heather and Bone, cream on Navy. Private label sb-6
  // inside the neck. An older Grey Heather design, 6206395 (chest 3.50 in,
  // sleeve 3.00 in), is superseded and not mapped.
  // Record: designs/58_heritage-hoodie-ind4000-2026-10-22/.
  "80000000-0000-4000-8000-000000000014": {
    "Black": { apliiqProductId: 6210750, skus: { S: "APQ-6210750S6A1", M: "APQ-6210750S7A1", L: "APQ-6210750S8A1", XL: "APQ-6210750S1A1", XXL: "APQ-6210750S2A1" } },
    "Grey Heather": { apliiqProductId: 6210742, skus: { S: "APQ-6210742S6A1", M: "APQ-6210742S7A1", L: "APQ-6210742S8A1", XL: "APQ-6210742S1A1", XXL: "APQ-6210742S2A1" } },
    "Bone": { apliiqProductId: 6210734, skus: { S: "APQ-6210734S6A1", M: "APQ-6210734S7A1", L: "APQ-6210734S8A1", XL: "APQ-6210734S1A1", XXL: "APQ-6210734S2A1" } },
    "Navy": { apliiqProductId: 6210732, skus: { S: "APQ-6210732S6A1", M: "APQ-6210732S7A1", L: "APQ-6210732S8A1", XL: "APQ-6210732S1A1", XXL: "APQ-6210732S2A1" } },
  },
  // == end GOAL Athletics Heritage Hoodie ==
  // == GOAL Athletics Lockup Hoodie (Independent IND4000) ==
  // Ids and SKUs read off each design's own page on 2026-10-22. One transfer
  // per design: the GA + GOAL ATHLETICS lockup, 10.00 x 2.67 in, centred on
  // centre front, top of art 3.00 in below the hood seam ("do not scale"
  // note on each placement); white/red file on Black, black/red on Grey
  // Heather and Bone, cream on Navy. Private label sb-6 inside the neck. No
  // back print. Record: designs/59_lockup-hoodie-ind4000-2026-10-22/.
  "80000000-0000-4000-8000-000000000015": {
    "Black": { apliiqProductId: 6206733, skus: { S: "APQ-6206733S6A1", M: "APQ-6206733S7A1", L: "APQ-6206733S8A1", XL: "APQ-6206733S1A1", XXL: "APQ-6206733S2A1" } },
    "Grey Heather": { apliiqProductId: 6206746, skus: { S: "APQ-6206746S6A1", M: "APQ-6206746S7A1", L: "APQ-6206746S8A1", XL: "APQ-6206746S1A1", XXL: "APQ-6206746S2A1" } },
    "Bone": { apliiqProductId: 6206741, skus: { S: "APQ-6206741S6A1", M: "APQ-6206741S7A1", L: "APQ-6206741S8A1", XL: "APQ-6206741S1A1", XXL: "APQ-6206741S2A1" } },
    "Navy": { apliiqProductId: 6206737, skus: { S: "APQ-6206737S6A1", M: "APQ-6206737S7A1", L: "APQ-6206737S8A1", XL: "APQ-6206737S1A1", XXL: "APQ-6206737S2A1" } },
  },
  // == end GOAL Athletics Lockup Hoodie ==
  // == GOAL Athletics Core Everyday Raincoat (Port Authority J333) ==
  // Ids and SKUs read off each design's own page on 2026-10-26. Two
  // transfers per design, front only, back blank: the GA monogram 3.00 x
  // 2.70 in on the wearer's left chest and the GOAL ATHLETICS wordmark 3.50 x
  // 1.07 in on the wearer's right chest, aligned to the monogram's centre
  // ("preserve proportions, no recoloring, stroke or mirroring; shell-safe
  // transfer" note on each placement). White/red files on Black, cream on
  // True Navy, solid black on Dark Grey Heather. Private label sb-6-161561
  // inside the neck. Apliiq offers XS to 4XL (S5A1 XS, S21A1 3XL, S61A1
  // 4XL); the site sells S to XXL. Record:
  // designs/61_core-everyday-raincoat-j333-2026-10-26/.
  "80000000-0000-4000-8000-000000000016": {
    "Black": { apliiqProductId: 6240401, skus: { S: "APQ-6240401S6A1", M: "APQ-6240401S7A1", L: "APQ-6240401S8A1", XL: "APQ-6240401S1A1", XXL: "APQ-6240401S2A1" } },
    "True Navy": { apliiqProductId: 6240414, skus: { S: "APQ-6240414S6A1", M: "APQ-6240414S7A1", L: "APQ-6240414S8A1", XL: "APQ-6240414S1A1", XXL: "APQ-6240414S2A1" } },
    "Dark Grey Heather": { apliiqProductId: 6240424, skus: { S: "APQ-6240424S6A1", M: "APQ-6240424S7A1", L: "APQ-6240424S8A1", XL: "APQ-6240424S1A1", XXL: "APQ-6240424S2A1" } },
  },
  // == end GOAL Athletics Core Everyday Raincoat ==
  // == TEMPO (women) · Apliiq designs built 2026-10-26 ==
  // Ids and SKUs read off each design's own page. Rebuilt later the same
  // day at the owner's smallest sizes: one GA monogram 2.00 x 1.80 in per
  // garment, front only; the Training Pants add the 4.00 x 1.22 in GOAL
  // ATHLETICS wordmark on the back of the wearer's right leg at hip height
  // (GA on the front of the wearer's left thigh). The first designs
  // (6240566/70/71 tee, 6240580/81/82 hoodie, 6240609/610/611 pants) are
  // renamed "delete" or gone and never mapped again. Apliiq offers XS to
  // 4XL / 3XL; the site sells S to XXL. Record:
  // designs/62_tempo-collection-proofs-2026-10-26/.
  // TEMPO Core Training Tee (Sport-Tek LST350), GA 2.00 x 1.80 in
  "80000000-0000-4000-8000-000000000017": {
    "Black": { apliiqProductId: 6241853, skus: { S: "APQ-6241853S6A1", M: "APQ-6241853S7A1", L: "APQ-6241853S8A1", XL: "APQ-6241853S1A1", XXL: "APQ-6241853S2A1" } },
    "White": { apliiqProductId: 6241860, skus: { S: "APQ-6241860S6A1", M: "APQ-6241860S7A1", L: "APQ-6241860S8A1", XL: "APQ-6241860S1A1", XXL: "APQ-6241860S2A1" } },
    "Iron Grey": { apliiqProductId: 6241864, skus: { S: "APQ-6241864S6A1", M: "APQ-6241864S7A1", L: "APQ-6241864S8A1", XL: "APQ-6241864S1A1", XXL: "APQ-6241864S2A1" } },
  },
  // TEMPO Training Pants (Sport-Tek LPST800): GA 2.00 x 1.80 in, front
  // left hip box; wordmark 4.00 x 1.22 in, back right hip box (owner fix
  // 2026-10-26: the second build had both marks on the back).
  "80000000-0000-4000-8000-000000000019": {
    "Deep Red/White": { apliiqProductId: 6241817, skus: { S: "APQ-6241817S6A1", M: "APQ-6241817S7A1", L: "APQ-6241817S8A1", XL: "APQ-6241817S1A1", XXL: "APQ-6241817S2A1" } },
    "True Navy/White": { apliiqProductId: 6241833, skus: { S: "APQ-6241833S6A1", M: "APQ-6241833S7A1", L: "APQ-6241833S8A1", XL: "APQ-6241833S1A1", XXL: "APQ-6241833S2A1" } },
    "Black/White": { apliiqProductId: 6241843, skus: { S: "APQ-6241843S6A1", M: "APQ-6241843S7A1", L: "APQ-6241843S8A1", XL: "APQ-6241843S1A1", XXL: "APQ-6241843S2A1" } },
  },
  // TEMPO Training Shorts (Sport-Tek LST485), GA 2.00 x 1.80 in, left leg
  "80000000-0000-4000-8000-000000000022": {
    "Black": { apliiqProductId: 6240613, skus: { S: "APQ-6240613S6A1", M: "APQ-6240613S7A1", L: "APQ-6240613S8A1", XL: "APQ-6240613S1A1", XXL: "APQ-6240613S2A1" } },
    "Iron Grey": { apliiqProductId: 6240615, skus: { S: "APQ-6240615S6A1", M: "APQ-6240615S7A1", L: "APQ-6240615S8A1", XL: "APQ-6240615S1A1", XXL: "APQ-6240615S2A1" } },
    "True Navy": { apliiqProductId: 6240616, skus: { S: "APQ-6240616S6A1", M: "APQ-6240616S7A1", L: "APQ-6240616S8A1", XL: "APQ-6240616S1A1", XXL: "APQ-6240616S2A1" } },
  },
  // TEMPO Warmup Hoodie (Bella+Canvas 7519), GA 2.00 x 1.80 in centred
  "80000000-0000-4000-8000-000000000020": {
    "Black": { apliiqProductId: 6241875, skus: { S: "APQ-6241875S6A1", M: "APQ-6241875S7A1", L: "APQ-6241875S8A1", XL: "APQ-6241875S1A1", XXL: "APQ-6241875S2A1" } },
    "Vintage White": { apliiqProductId: 6241879, skus: { S: "APQ-6241879S6A1", M: "APQ-6241879S7A1", L: "APQ-6241879S8A1", XL: "APQ-6241879S1A1", XXL: "APQ-6241879S2A1" } },
    "Navy": { apliiqProductId: 6241888, skus: { S: "APQ-6241888S6A1", M: "APQ-6241888S7A1", L: "APQ-6241888S8A1", XL: "APQ-6241888S1A1", XXL: "APQ-6241888S2A1" } },
  },
  // == TEMPO (women) · Tapstitch designs built 2026-10-26 ==
  // Design ids from the Tapstitch Designs list. Quarter Zip WT0092 (S to XL,
  // the supplier's whole run), Training Tee WT0216 (S to 2XL). Lines are
  // placed on tapstitch.com by the owner until an order integration exists.
  "80000000-0000-4000-8000-000000000018": {
    "Black": tapstitch("1564321596708188160", ["S", "M", "L", "XL"]),
    "White": tapstitch("1564322937081917440", ["S", "M", "L", "XL"]),
    "Light Purple": tapstitch("1564323621013516288", ["S", "M", "L", "XL"]),
  },
  "80000000-0000-4000-8000-000000000021": {
    "White": tapstitch("1564324134866087936", ["S", "M", "L", "XL", "XXL"]),
    "Red": tapstitch("1564325002000687104", ["S", "M", "L", "XL", "XXL"]),
    "Purple": tapstitch("1564325488367988736", ["S", "M", "L", "XL", "XXL"]),
  },
  // GOAL Athletics Core Quarter Zip (Tapstitch MT0063, men): lockup 4.00 x
  // 1.07 in, wearer's left chest crest position. Tapstitch runs S to 4XL;
  // the site sells S to XXL.
  "80000000-0000-4000-8000-000000000023": {
    "Black": tapstitch("1564299910617194496", ["S", "M", "L", "XL", "XXL"]),
    "White": tapstitch("1564523403115982848", ["S", "M", "L", "XL", "XXL"]),
    "Dark Gray": tapstitch("1564524205054324736", ["S", "M", "L", "XL", "XXL"]),
  },
  // == end TEMPO ==
};

export type ResolvedFulfillment =
  | { supplier: "apliiq"; apliiqProductId: number; sku: string }
  | { supplier: "tapstitch"; tapstitchDesignId: string; sku: string };

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
  if (variant.supplier === "tapstitch") {
    return { supplier: "tapstitch", tapstitchDesignId: variant.tapstitchDesignId, sku };
  }
  return { supplier: "apliiq", apliiqProductId: variant.apliiqProductId, sku };
}
