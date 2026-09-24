// ─────────────────────────────────────────────────────────────
// Garment measurements, per blank.
//
// These are the ACTUAL blanks Apliiq prints and ships (the mapping in
// fulfillment.ts decides which), so a customer reading this grid is
// reading the garment that arrives.
//
// EVERY CHEST FIGURE IS A HALF CHEST: the garment laid flat, measured
// pit to pit. Not the circumference. That distinction is the single
// most damaging thing to get wrong here - reading it as circumference
// halves the apparent size and sends someone up two sizes - so the UI
// states it explicitly and offers the doubled figure alongside.
//
// Sourced from each manufacturer's published spec on 2026-09-22 and
// then verified against a second, independent source. Where a
// manufacturer publishes no sleeve length, it is null rather than
// estimated: an invented number here becomes a return.
// ─────────────────────────────────────────────────────────────

export interface SizeRow {
  size: string;
  /** Half chest: laid flat, pit to pit, in inches. */
  chestIn: number;
  /** High point shoulder to hem, in inches. */
  lengthIn: number;
  /** Centre back or shoulder to cuff, in inches. Null when unpublished. */
  sleeveIn: number | null;
}

export interface SizeChart {
  blank: string;
  /** Manufacturer spec URL the numbers came from. */
  source: string;
  /** Anything a customer needs to know to size correctly on this blank. */
  note?: string;
  rows: SizeRow[];
}

export const SIZE_CHARTS: Record<string, SizeChart> = {
  bc3010: {
    blank: "Bella+Canvas 3010 · heavyweight, boxy, drop shoulder",
    source: "https://www.bellacanvas.com/spec/3010_specs.pdf",
    // The published grade really is irregular: 1in per size up to M,
    // then 2in per size above it. Worth saying, because someone between
    // M and L has a genuinely larger gap to choose across than usual.
    note: "Cut boxy with a drop shoulder, so the shoulder seam sits down the arm by design. The jump from M to L is 2in of chest where S to M is only 1in, so if you are between those two, size on the chest measurement rather than your usual letter.",
    rows: [
      { size: "S", chestIn: 20.125, lengthIn: 27.5, sleeveIn: null },
      { size: "M", chestIn: 21.125, lengthIn: 28, sleeveIn: null },
      { size: "L", chestIn: 23.125, lengthIn: 29, sleeveIn: null },
      { size: "XL", chestIn: 25.125, lengthIn: 30.25, sleeveIn: null },
      { size: "XXL", chestIn: 27.125, lengthIn: 31.75, sleeveIn: null },
    ],
  },
  bc4810: {
    blank: "Bella+Canvas 4810GD · heavyweight garment dyed",
    source: "https://www.bellacanvas.com/",
    note: "Garment dyed after making up, so a small amount of shrinkage and colour variation between pieces is normal and intended.",
    rows: [
      { size: "S", chestIn: 19.75, lengthIn: 27.75, sleeveIn: null },
      { size: "M", chestIn: 20.75, lengthIn: 28.75, sleeveIn: null },
      { size: "L", chestIn: 22.75, lengthIn: 29.75, sleeveIn: null },
      { size: "XL", chestIn: 24.75, lengthIn: 30.75, sleeveIn: null },
      { size: "XXL", chestIn: 26.75, lengthIn: 31.75, sleeveIn: null },
    ],
  },
  st720: {
    blank: "Sport-Tek ST720 · recycled polyester performance",
    source: "https://www.sanmar.com/",
    note: "Athletic cut, closer through the body than the cotton tees. True to size.",
    rows: [
      { size: "S", chestIn: 20, lengthIn: 28, sleeveIn: 18 },
      { size: "M", chestIn: 21.5, lengthIn: 29, sleeveIn: 18.75 },
      { size: "L", chestIn: 23, lengthIn: 30, sleeveIn: 19.5 },
      { size: "XL", chestIn: 24.5, lengthIn: 31, sleeveIn: 20.25 },
      { size: "XXL", chestIn: 26, lengthIn: 32, sleeveIn: 21 },
    ],
  },
  ind4000: {
    blank: "Independent Trading Co. IND4000 · heavyweight fleece",
    source: "https://www.independenttradingco.com/",
    note: "Generous through the body. Sleeve is measured from centre back to cuff.",
    rows: [
      { size: "S", chestIn: 21, lengthIn: 28.5, sleeveIn: 35.5 },
      { size: "M", chestIn: 23, lengthIn: 29.5, sleeveIn: 36.5 },
      { size: "L", chestIn: 24.5, lengthIn: 30.5, sleeveIn: 37.5 },
      { size: "XL", chestIn: 26.5, lengthIn: 31.5, sleeveIn: 38.5 },
      { size: "XXL", chestIn: 27.5, lengthIn: 32.5, sleeveIn: 39.5 },
    ],
  },
  cc1717: {
    blank: "Comfort Colors C1717 · garment dyed heavyweight",
    source: "https://www.comfortcolors.com/",
    note: "Garment dyed, so expect slight colour variation piece to piece. Runs a little shorter in the body than the Bella+Canvas tees at the same letter.",
    rows: [
      { size: "S", chestIn: 18.25, lengthIn: 26.625, sleeveIn: null },
      { size: "M", chestIn: 20.25, lengthIn: 28, sleeveIn: null },
      { size: "L", chestIn: 22, lengthIn: 29.375, sleeveIn: null },
      { size: "XL", chestIn: 24, lengthIn: 30.75, sleeveIn: null },
      { size: "XXL", chestIn: 26, lengthIn: 31.625, sleeveIn: null },
    ],
  },
  as5150: {
    blank: "AS Colour 5150 Made Crew · 14.7 oz heavyweight cotton French terry",
    source: "https://www.ascolour.com/",
    note: "Sits closer through the body than a typical fleece crew, and the chest grade is narrow between L and XL, so go by the measurement.",
    rows: [
      { size: "S", chestIn: 23, lengthIn: 27.25, sleeveIn: null },
      { size: "M", chestIn: 24.5, lengthIn: 28, sleeveIn: null },
      { size: "L", chestIn: 25.5, lengthIn: 29, sleeveIn: null },
      { size: "XL", chestIn: 26.5, lengthIn: 30, sleeveIn: null },
      { size: "XXL", chestIn: 27.75, lengthIn: 31, sleeveIn: null },
    ],
  },
};

/**
 * Catalog product id → the blank it is printed on.
 * Mirrors src/lib/fulfillment.ts, which decides what is actually made.
 * A product missing here simply shows no grid, which is correct for the
 * cap: it is one adjustable size and a chest/length table would be
 * meaningless.
 */
const PRODUCT_BLANK: Record<string, keyof typeof SIZE_CHARTS> = {
  "70000000-0000-4000-8000-000000000001": "st720", // Performance Badge Tee
  "70000000-0000-4000-8000-000000000002": "ind4000", // Core Hoodie
  "70000000-0000-4000-8000-000000000003": "bc3010", // Casual Wordmark Tee · Red (3010 from 2026-09-23; was 4810GD)
  "70000000-0000-4000-8000-000000000005": "bc3010", // Casual Wordmark Tee · Club Blue (own product from 2026-09-24)
  "80000000-0000-4000-8000-000000000001": "bc3010", // Modern Sport Tee (archived)
  "80000000-0000-4000-8000-000000000002": "bc4810", // Athletics Varsity Tee
  "80000000-0000-4000-8000-000000000003": "bc3010", // Minimal Club Tee
  "80000000-0000-4000-8000-000000000004": "cc1717", // Circular Badge Tee
  "80000000-0000-4000-8000-000000000005": "as5150", // Circular Center Crewneck
  "80000000-0000-4000-8000-000000000006": "st720", // Modern Sport Performance Tee
};

export function sizeChartFor(productId: string): SizeChart | null {
  const key = PRODUCT_BLANK[productId];
  return key ? SIZE_CHARTS[key] : null;
}

/** Inches to a readable fraction, since apparel charts are read that way. */
export function inches(v: number): string {
  const whole = Math.floor(v);
  const frac = v - whole;
  const eighths = Math.round(frac * 8);
  if (eighths === 0) return `${whole}`;
  if (eighths === 8) return `${whole + 1}`;
  const map: Record<number, string> = {
    1: "⅛", 2: "¼", 3: "⅜", 4: "½", 5: "⅝", 6: "¾", 7: "⅞",
  };
  return `${whole}${map[eighths]}`;
}
