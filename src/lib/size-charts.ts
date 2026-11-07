// ─────────────────────────────────────────────────────────────
// Garment measurements, per blank.
//
// These match the blanks in fulfillment.ts. Chest/bust and waist are
// flat garment widths. Published body-size references are stored
// separately in bodyRows. Women's charts were reviewed on 2026-11-07;
// other measurements and methods were verified on 2026-11-04. Provenance is
// recorded separately in development documentation. Reference URLs must
// never be included in this browser-facing module.
// ─────────────────────────────────────────────────────────────

export interface SizeRow {
  size: string;
  /** Half chest: laid flat, pit to pit, in inches. */
  chestIn: number;
  /** Garment length in inches; use the chart's lengthMeasure and lengthMethod. */
  lengthIn: number;
  /** Centre back or shoulder to cuff, in inches. Null when unpublished. */
  sleeveIn: number | null;
  hipIn?: number;
  inseamIn?: number;
  underbustIn?: number;
  shoulderIn?: number;
}

export interface BodySizeRow {
  size: string;
  usSize: string;
  bustIn?: readonly [number, number];
  waistIn?: readonly [number, number];
  hipIn?: readonly [number, number];
}

export interface SizeChart {
  blank: string;
  /** chestIn stores the flat chest, bust or waist width for this chart. */
  measure?: "chest" | "waist" | "bust";
  lengthMeasure?: "length" | "inseam" | "outseam";
  sleeveFrom?: "centre back" | "shoulder seam";
  widthMethod?: string;
  lengthMethod?: string;
  sleeveMethod?: string;
  bodyRows?: BodySizeRow[];
  /** Maximum published measurement variation, in inches. */
  toleranceIn?: number;
  /** Anything a customer needs to know to size correctly on this blank. */
  note?: string;
  rows: SizeRow[];
}

export const SIZE_CHARTS: Record<string, SizeChart> = {
  bc3010: {
    blank: "Heavyweight cotton tee · boxy, drop shoulder",
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
    blank: "Heavyweight garment-dyed cotton tee",
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
    blank: "Recycled polyester performance tee",
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
    blank: "Heavyweight fleece hoodie",
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
    blank: "Garment-dyed heavyweight cotton tee",
    note: "Garment dyed, so expect slight colour variation piece to piece. Runs a little shorter in the body than our other cotton tees at the same letter.",
    rows: [
      { size: "S", chestIn: 18.25, lengthIn: 26.625, sleeveIn: null },
      { size: "M", chestIn: 20.25, lengthIn: 28, sleeveIn: null },
      { size: "L", chestIn: 22, lengthIn: 29.375, sleeveIn: null },
      { size: "XL", chestIn: 24, lengthIn: 30.75, sleeveIn: null },
      { size: "XXL", chestIn: 26, lengthIn: 31.625, sleeveIn: null },
    ],
  },
  as5150: {
    blank: "14.7 oz heavyweight cotton French terry crew",
    note: "Sits closer through the body than a typical fleece crew, and the chest grade is narrow between L and XL, so go by the measurement.",
    rows: [
      { size: "S", chestIn: 23, lengthIn: 27.25, sleeveIn: null },
      { size: "M", chestIn: 24.5, lengthIn: 28, sleeveIn: null },
      { size: "L", chestIn: 25.5, lengthIn: 29, sleeveIn: null },
      { size: "XL", chestIn: 26.5, lengthIn: 30, sleeveIn: null },
      { size: "XXL", chestIn: 27.75, lengthIn: 31, sleeveIn: null },
    ],
  },
  j333: {
    blank: "Waterproof shell jacket · mesh lined",
    note: "Cut with room for a hoodie underneath. Chest is measured one inch below the armhole, laid flat; sleeve is a raglan measure from the centre back neck to the cuff.",
    rows: [
      { size: "S", chestIn: 22, lengthIn: 28.5, sleeveIn: 35.5 },
      { size: "M", chestIn: 23.5, lengthIn: 29.5, sleeveIn: 36.25 },
      { size: "L", chestIn: 25, lengthIn: 30.5, sleeveIn: 37 },
      { size: "XL", chestIn: 26.5, lengthIn: 31.5, sleeveIn: 37.75 },
      { size: "XXL", chestIn: 28, lengthIn: 32.5, sleeveIn: 38.5 },
    ],
  },
  lst350: {
    blank: "Women's performance tee · polyester interlock",
    measure: "bust",
    widthMethod: "one inch below armholes",
    lengthMethod: "high shoulder point to back hem",
    sleeveMethod: "center back neck to sleeve hem",
    bodyRows: [
      { size: "S", usSize: "4/6", bustIn: [35, 36] },
      { size: "M", usSize: "8/10", bustIn: [37, 38] },
      { size: "L", usSize: "12/14", bustIn: [39, 41] },
      { size: "XL", usSize: "16/18", bustIn: [42, 44] },
      { size: "XXL", usSize: "20/22", bustIn: [45, 47] },
    ],
    note: "A women's cut, shaped through the body. Bust is measured one inch below the armhole, laid flat.",
    rows: [
      { size: "S", chestIn: 19, lengthIn: 25.5, sleeveIn: 14.5 },
      { size: "M", chestIn: 20, lengthIn: 26, sleeveIn: 15 },
      { size: "L", chestIn: 21.5, lengthIn: 27, sleeveIn: 15.75 },
      { size: "XL", chestIn: 23, lengthIn: 28, sleeveIn: 16.5 },
      { size: "XXL", chestIn: 24.5, lengthIn: 29, sleeveIn: 17.25 },
    ],
  },
  // Women's supplier charts rechecked individually on 2026-11-07.
  wt0092: {
    blank: "Women's fitted quarter zip · stretch knit",
    measure: "bust",
    sleeveFrom: "shoulder seam",
    widthMethod: "across just below armholes",
    lengthMethod: "shoulder at collar to hem",
    sleeveMethod: "shoulder seam to cuff",
    toleranceIn: 3 / 2.54,
    rows: [
      { size: "S", chestIn: 16.93, lengthIn: 23.23, shoulderIn: 14.88, sleeveIn: 23.07 },
      { size: "M", chestIn: 17.72, lengthIn: 24.02, shoulderIn: 15.51, sleeveIn: 23.54 },
      { size: "L", chestIn: 18.50, lengthIn: 24.80, shoulderIn: 16.14, sleeveIn: 24.02 },
      { size: "XL", chestIn: 19.29, lengthIn: 25.59, shoulderIn: 16.77, sleeveIn: 24.49 },
    ],
  },
  wt0093: {
    blank: "Women's cropped racerback · stretch knit",
    measure: "bust",
    widthMethod: "across just below armholes",
    lengthMethod: "high shoulder point to hem",
    toleranceIn: 3 / 2.54,
    rows: [
      { size: "S", chestIn: 12.99, underbustIn: 12.20, lengthIn: 12.17, sleeveIn: null },
      { size: "M", chestIn: 13.78, underbustIn: 12.99, lengthIn: 12.48, sleeveIn: null },
      { size: "L", chestIn: 14.57, underbustIn: 13.78, lengthIn: 12.80, sleeveIn: null },
      { size: "XL", chestIn: 15.35, underbustIn: 14.57, lengthIn: 13.11, sleeveIn: null },
    ],
  },
  // Supplier WB0025 flat garment chart, inspected 2026-11-06.
  wb0025: {
    blank: "Women's high-rise ankle-length leggings · nylon stretch knit",
    measure: "waist",
    lengthMeasure: "outseam",
    widthMethod: "across narrowest waist, relaxed",
    lengthMethod: "waistband to hem",
    toleranceIn: 3 / 2.54,
    rows: [
      { size: "S", chestIn: 9.45, hipIn: 12.99, lengthIn: 32.28, sleeveIn: null },
      { size: "M", chestIn: 10.24, hipIn: 13.78, lengthIn: 33.07, sleeveIn: null },
      { size: "L", chestIn: 11.02, hipIn: 14.57, lengthIn: 33.86, sleeveIn: null },
      { size: "XL", chestIn: 11.81, hipIn: 15.35, lengthIn: 34.65, sleeveIn: null },
    ],
  },
  wt0216: {
    blank: "Women's lightweight polyester crew · 130 gsm",
    measure: "bust",
    sleeveFrom: "shoulder seam",
    widthMethod: "across just below armholes",
    lengthMethod: "shoulder at collar to hem",
    sleeveMethod: "shoulder seam to sleeve hem",
    toleranceIn: 3 / 2.54,
    rows: [
      { size: "S", chestIn: 16.93, lengthIn: 23.03, shoulderIn: 13.70, sleeveIn: 5.51 },
      { size: "M", chestIn: 17.72, lengthIn: 23.62, shoulderIn: 14.17, sleeveIn: 5.91 },
      { size: "L", chestIn: 18.50, lengthIn: 24.21, shoulderIn: 14.65, sleeveIn: 6.30 },
      { size: "XL", chestIn: 19.29, lengthIn: 24.80, shoulderIn: 15.12, sleeveIn: 6.69 },
    ],
  },
  bc7519: {
    blank: "Women's classic fleece hoodie",
    measure: "bust",
    widthMethod: "across below armholes",
    lengthMethod: "high shoulder point to hem",
    note: "Classic women's fit with a mid-length body. Compare flat bust width and body length with a similar hoodie.",
    rows: [
      { size: "S", chestIn: 20, lengthIn: 22.75, sleeveIn: null },
      { size: "M", chestIn: 20.75, lengthIn: 23.375, sleeveIn: null },
      { size: "L", chestIn: 21.75, lengthIn: 24, sleeveIn: null },
      { size: "XL", chestIn: 22.75, lengthIn: 24.625, sleeveIn: null },
      { size: "XXL", chestIn: 23.75, lengthIn: 25.25, sleeveIn: null },
    ],
  },
  lpst800: {
    blank: "Women's travel pant · recycled polyester",
    measure: "waist",
    lengthMeasure: "inseam",
    note: "Waist and hip widths are measured flat with the garment relaxed. Inseam runs from crotch seam to hem. Use the drawcord to adjust the waist.",
    bodyRows: [
      { size: "S", usSize: "4/6", waistIn: [27, 28], hipIn: [37, 38] },
      { size: "M", usSize: "8/10", waistIn: [29, 30], hipIn: [39, 40] },
      { size: "L", usSize: "12/14", waistIn: [31, 33], hipIn: [41, 43] },
      { size: "XL", usSize: "16/18", waistIn: [34, 36], hipIn: [44, 46] },
      { size: "XXL", usSize: "20/22", waistIn: [37, 39], hipIn: [47, 49] },
    ],
    rows: [
      { size: "S", chestIn: 15, hipIn: 20, lengthIn: 28.5, sleeveIn: null },
      { size: "M", chestIn: 16, hipIn: 21, lengthIn: 29, sleeveIn: null },
      { size: "L", chestIn: 17.5, hipIn: 22.5, lengthIn: 29.5, sleeveIn: null },
      { size: "XL", chestIn: 19, hipIn: 24, lengthIn: 30, sleeveIn: null },
      { size: "XXL", chestIn: 20.5, hipIn: 25.5, lengthIn: 30.5, sleeveIn: null },
    ],
  },
  lst485: {
    blank: "Women's stretch training shorts · built-in liner",
    measure: "waist",
    lengthMeasure: "inseam",
    bodyRows: [
      { size: "S", usSize: "4/6", waistIn: [27, 28], hipIn: [37, 38] },
      { size: "M", usSize: "8/10", waistIn: [29, 30], hipIn: [39, 40] },
      { size: "L", usSize: "12/14", waistIn: [31, 33], hipIn: [41, 43] },
      { size: "XL", usSize: "16/18", waistIn: [34, 36], hipIn: [44, 46] },
      { size: "XXL", usSize: "20/22", waistIn: [37, 39], hipIn: [47, 49] },
    ],
    rows: [
      { size: "S", chestIn: 13.5, hipIn: 20.125, lengthIn: 3.5, sleeveIn: null },
      { size: "M", chestIn: 14.5, hipIn: 21.125, lengthIn: 3.5, sleeveIn: null },
      { size: "L", chestIn: 16, hipIn: 22.625, lengthIn: 3.75, sleeveIn: null },
      { size: "XL", chestIn: 17.5, hipIn: 24.125, lengthIn: 3.75, sleeveIn: null },
      { size: "XXL", chestIn: 19, hipIn: 25.625, lengthIn: 4.25, sleeveIn: null },
    ],
  },
  as5620: {
    blank: "Lightweight stretch training shorts",
    measure: "waist",
    lengthMeasure: "outseam",
    toleranceIn: 1,
    note: "Our S, M, L, XL and XXL correspond to waist sizes 30, 32, 34, 36 and 38. The waist widths below are measured with the elastic relaxed.",
    rows: [
      { size: "S", chestIn: 14.25, lengthIn: 17.75, inseamIn: 6.5, sleeveIn: null },
      { size: "M", chestIn: 15.25, lengthIn: 18, inseamIn: 6.5, sleeveIn: null },
      { size: "L", chestIn: 16.25, lengthIn: 18.5, inseamIn: 6.5, sleeveIn: null },
      { size: "XL", chestIn: 17.25, lengthIn: 19, inseamIn: 6.5, sleeveIn: null },
      { size: "XXL", chestIn: 18.25, lengthIn: 19.25, inseamIn: 6.5, sleeveIn: null },
    ],
  },
  pst871: {
    blank: "Stretch performance jogger",
    measure: "waist",
    lengthMeasure: "inseam",
    rows: [
      { size: "S", chestIn: 13.5, lengthIn: 29, sleeveIn: null },
      { size: "M", chestIn: 15, lengthIn: 29.5, sleeveIn: null },
      { size: "L", chestIn: 16.5, lengthIn: 30, sleeveIn: null },
      { size: "XL", chestIn: 18, lengthIn: 30.5, sleeveIn: null },
      { size: "XXL", chestIn: 19.5, lengthIn: 31, sleeveIn: null },
    ],
  },
  mt0063: {
    blank: "Lightweight performance quarter zip",
    sleeveFrom: "shoulder seam",
    toleranceIn: 3 / 2.54,
    rows: [
      { size: "S", chestIn: 18.11, lengthIn: 25.20, sleeveIn: 23.54 },
      { size: "M", chestIn: 18.90, lengthIn: 25.98, sleeveIn: 24.02 },
      { size: "L", chestIn: 19.68, lengthIn: 26.77, sleeveIn: 24.49 },
      { size: "XL", chestIn: 20.47, lengthIn: 27.56, sleeveIn: 24.96 },
      { size: "XXL", chestIn: 21.26, lengthIn: 28.35, sleeveIn: 25.43 },
    ],
  },
  ub0050: {
    blank: "Heavyweight cotton-blend sweatpant",
    measure: "waist",
    lengthMeasure: "outseam",
    toleranceIn: 3 / 2.54,
    rows: [
      { size: "S", chestIn: 12.99, hipIn: 22.05, lengthIn: 40.94, sleeveIn: null },
      { size: "M", chestIn: 13.78, hipIn: 22.83, lengthIn: 41.73, sleeveIn: null },
      { size: "L", chestIn: 14.57, hipIn: 23.62, lengthIn: 42.52, sleeveIn: null },
      { size: "XL", chestIn: 15.35, hipIn: 24.41, lengthIn: 43.31, sleeveIn: null },
      { size: "XXL", chestIn: 16.14, hipIn: 25.20, lengthIn: 44.09, sleeveIn: null },
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
  "90000000-0000-4000-8000-000000000001": "ub0050", // The Core Sweatpant
  "80000000-0000-4000-8000-000000000013": "as5620", // Core Shorts
  "80000000-0000-4000-8000-000000000023": "mt0063", // Core Quarter Zip
  "80000000-0000-4000-8000-000000000024": "pst871", // Core Jogger
  "80000000-0000-4000-8000-000000000025": "wt0093", // TEMPO Training Bra
  "80000000-0000-4000-8000-000000000026": "wb0025", // TEMPO Training Leggings
  "70000000-0000-4000-8000-000000000001": "st720", // Core Badge Tee
  "70000000-0000-4000-8000-000000000002": "ind4000", // Core Hoodie · Red
  "70000000-0000-4000-8000-000000000006": "ind4000", // Core Hoodie · Club Blue (own product from 2026-09-24)
  "70000000-0000-4000-8000-000000000003": "bc3010", // Terrace Tee · Red (3010 from 2026-09-23; was 4810GD)
  "70000000-0000-4000-8000-000000000005": "bc3010", // Terrace Tee · Club Blue (own product from 2026-09-24)
  "80000000-0000-4000-8000-000000000001": "bc3010", // Modern Sport Tee (archived)
  "80000000-0000-4000-8000-000000000002": "bc4810", // Athletics Varsity Tee
  "80000000-0000-4000-8000-000000000003": "bc3010", // Minimal Club Tee
  "80000000-0000-4000-8000-000000000004": "cc1717", // Circular Badge Tee
  "80000000-0000-4000-8000-000000000005": "as5150", // Circular Center Crewneck
  "80000000-0000-4000-8000-000000000006": "st720", // Matchday Tee
  "80000000-0000-4000-8000-000000000011": "st720", // GOAL Athletics Warm-Up Tee (mapped 2026-10-26)
  "80000000-0000-4000-8000-000000000012": "st720", // GOAL Athletics Match Day Tee (mapped 2026-10-26)
  "80000000-0000-4000-8000-000000000014": "ind4000", // GOAL Athletics Heritage Hoodie (hidden until renders and ids land)
  "80000000-0000-4000-8000-000000000015": "ind4000", // GOAL Athletics Lockup Hoodie (hidden until renders and ids land)
  "80000000-0000-4000-8000-000000000016": "j333", // GOAL Athletics Core Everyday Raincoat (2026-10-26)
  "80000000-0000-4000-8000-000000000017": "lst350", // TEMPO Core Training Tee (2026-10-26)
  "80000000-0000-4000-8000-000000000018": "wt0092", // TEMPO Quarter Zip
  "80000000-0000-4000-8000-000000000019": "lpst800", // TEMPO Training Pants (2026-10-26)
  "80000000-0000-4000-8000-000000000021": "wt0216", // TEMPO Training Tee
  "80000000-0000-4000-8000-000000000020": "bc7519", // TEMPO Warmup Hoodie (2026-10-26)
  "80000000-0000-4000-8000-000000000022": "lst485", // TEMPO Training Shorts
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
