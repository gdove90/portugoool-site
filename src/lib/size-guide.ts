import { getProducts, products } from "./products";
import { sizeChartFor, type SizeRow } from "./size-charts";
import { audienceAssignments, catalogOrder, type Audience } from "@/v84/catalog-data";

// Saved category hashes remain aliases. New links identify individual
// products, including styles that share a garment chart.
export const GUIDE = [
  { id: "performance", garment: "tee", productIds: ["80000000-0000-4000-8000-000000000011", "80000000-0000-4000-8000-000000000012"] },
  { id: "hoodies", garment: "hoodie", productIds: ["80000000-0000-4000-8000-000000000014", "80000000-0000-4000-8000-000000000015"] },
  { id: "shorts", garment: "pair of shorts", productIds: ["80000000-0000-4000-8000-000000000013"] },
  { id: "jackets", garment: "jacket", productIds: ["80000000-0000-4000-8000-000000000016"] },
  { id: "quarter-zip", garment: "quarter zip", productIds: ["80000000-0000-4000-8000-000000000023"] },
  { id: "joggers", garment: "pair of joggers", productIds: ["80000000-0000-4000-8000-000000000024"] },
  { id: "sweatpants", garment: "pair of sweatpants", productIds: ["90000000-0000-4000-8000-000000000001"] },
  { id: "caps", garment: "cap", productIds: ["80000000-0000-4000-8000-000000000009", "80000000-0000-4000-8000-000000000010"] },
  { id: "women-tees", garment: "tee", productIds: ["80000000-0000-4000-8000-000000000017"] },
  { id: "women-training-tee", garment: "tee", productIds: ["80000000-0000-4000-8000-000000000021"] },
  { id: "women-sports-bras", garment: "bra", productIds: ["80000000-0000-4000-8000-000000000025"] },
  { id: "women-hoodies", garment: "hoodie", productIds: ["80000000-0000-4000-8000-000000000020"] },
  { id: "pants", garment: "pair of pants", productIds: ["80000000-0000-4000-8000-000000000019"] },
  { id: "women-shorts", garment: "pair of shorts", productIds: ["80000000-0000-4000-8000-000000000022"] },
  { id: "layers", garment: "quarter zip", productIds: ["80000000-0000-4000-8000-000000000018"] },
] as const;

export function guideTabFor(productId: string) {
  return GUIDE.find(guide => (guide.productIds as readonly string[]).includes(productId)) ?? null;
}

export function sizeGuideHref(productId: string) {
  const product = products.find(item => item.id === productId);
  return product && guideTabFor(productId) ? `/size-guide#${product.slug}` : "/size-guide";
}

export type GuideAudience = Audience;

export function guideAudienceFor(productId: string): GuideAudience {
  const audiences = audienceAssignments[productId];
  return audiences?.includes("women") && !audiences.includes("men") ? "women" : "men";
}

export function guideProducts(audience?: GuideAudience) {
  const visible = getProducts().filter(product => guideTabFor(product.id));
  return audience ? catalogOrder(visible.filter(product => audienceAssignments[product.id]?.includes(audience))) : visible;
}

export function productForGuideHash(hash: string) {
  const direct = products.find(product => product.isActive && product.slug === hash && guideTabFor(product.id));
  if (direct) return direct;
  const alias = GUIDE.find(guide => guide.id === hash);
  return alias ? products.find(product => product.isActive && (alias.productIds as readonly string[]).includes(product.id)) : undefined;
}

export type GuideValue = number | readonly [number, number] | null;
export interface GuideColumn { key: string; label: string; method: string }
export interface ProductSizeGuide {
  productId: string;
  title: string;
  fit: string;
  blank: string;
  instructions: string;
  columns: GuideColumn[];
  rows: { size: string; values: GuideValue[] }[];
  note?: string;
  toleranceIn?: number;
  headwear: boolean;
}

export function sizeGuideFor(productId: string): ProductSizeGuide | null {
  const product = products.find(item => item.id === productId);
  const guide = guideTabFor(productId);
  if (!product || !guide) return null;
  const common = { productId, title: product.name, fit: product.fit };
  if (guide.garment === "cap") {
    return {
      ...common, blank: "Structured cotton-blend twill cap", headwear: true,
      instructions: "Wrap a tape around your head where the cap sits, above your eyebrows and ears. Keep the tape level and adjust the snapback for a comfortable fit.",
      columns: [{ key: "head", label: "Head circumference", method: "approximate adult fit range" }],
      rows: [{ size: "One size", values: [[20.5, 24]] }],
    };
  }
  const chart = sizeChartFor(productId);
  const instructions = `Lay a similar ${guide.garment} you like flat without stretching it. Compare the garment measurements below, rather than your body measurements.`;
  if (!chart) {
    return { ...common, blank: "Fit advice", headwear: false, instructions, columns: [], rows: [], note: "Contact support for help choosing your size." };
  }
  const waist = chart.measure === "waist";
  const length = chart.lengthMeasure ?? (waist ? "inseam" : "length");
  const columns: GuideColumn[] = [{ key: "width", label: waist ? "Waist, flat" : chart.measure === "bust" ? "Bust, flat" : "Chest, flat", method: waist ? "across relaxed waistband" : "across below armholes" }];
  const values: ((row: SizeRow) => GuideValue)[] = [row => row.chestIn];
  if (chart.rows.some(row => row.hipIn != null)) {
    columns.push({ key: "hip", label: "Hip, flat", method: "across widest point" });
    values.push(row => row.hipIn ?? null);
  }
  columns.push({ key: "length", label: length === "inseam" ? "Inseam" : length === "outseam" ? "Full length" : "Length", method: length === "inseam" ? "crotch seam to hem" : length === "outseam" ? "waistband to hem" : "shoulder to hem" });
  values.push(row => row.lengthIn);
  if (chart.rows.some(row => row.inseamIn != null)) {
    columns.push({ key: "inseam", label: "Inseam", method: "crotch seam to hem" });
    values.push(row => row.inseamIn ?? null);
  }
  if (chart.rows.some(row => row.sleeveIn != null)) {
    columns.push({ key: "sleeve", label: "Sleeve", method: `${chart.sleeveFrom ?? "centre back"} to cuff` });
    values.push(row => row.sleeveIn);
  }
  return {
    ...common, blank: chart.blank, headwear: false, instructions, columns,
    rows: product.sizes.flatMap(size => {
      const row = chart.rows.find(item => item.size === size);
      return row ? [{ size, values: values.map(value => value(row)) }] : [];
    }),
    note: guide.id === "shorts" ? chart.note : undefined,
    toleranceIn: chart.toleranceIn,
  };
}

export type MeasurementUnit = "in" | "cm";
export function formatMeasurement(value: GuideValue, unit: MeasurementUnit): string {
  if (value === null) return "—";
  const format = (number: number) => (unit === "cm" ? number * 2.54 : number).toFixed(unit === "cm" ? 1 : 2).replace(/\.?0+$/, "");
  return typeof value === "number" ? format(value) : value.map(format).join("–");
}
