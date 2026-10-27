import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export type Audience = "men" | "women";
// Owner assignment is deliberately separate from fulfillment and product identity.
export const audienceAssignments: Record<string, Audience[]> = {
  "80000000-0000-4000-8000-000000000011": ["men"],
  "80000000-0000-4000-8000-000000000012": ["men"],
  "70000000-0000-4000-8000-000000000001": ["men"],
  "70000000-0000-4000-8000-000000000002": ["men"],
  "70000000-0000-4000-8000-000000000006": ["men"],
  "70000000-0000-4000-8000-000000000003": ["men"],
  "70000000-0000-4000-8000-000000000005": ["men"],
  "70000000-0000-4000-8000-000000000004": ["men"],
  "80000000-0000-4000-8000-000000000006": ["men"],
  "80000000-0000-4000-8000-000000000007": ["men"],
  "80000000-0000-4000-8000-000000000008": ["men"],
  "80000000-0000-4000-8000-000000000009": ["men"],
  "80000000-0000-4000-8000-000000000010": ["men"],
  "80000000-0000-4000-8000-000000000013": ["men"],
  // Heritage and Lockup Hoodies: listed here now so they appear on /men and
  // /shop the moment products.ts activates them (forAudience reads active
  // products only).
  "80000000-0000-4000-8000-000000000014": ["men"],
  "80000000-0000-4000-8000-000000000015": ["men"],
  // Core Everyday Raincoat (Apliiq designs 6240401/6240414/6240424), owner
  // instruction 2026-10-26: men's section.
  "80000000-0000-4000-8000-000000000016": ["men"],
  // Core Quarter Zip (Tapstitch, three colours), owner instruction 2026-10-26.
  "80000000-0000-4000-8000-000000000023": ["men"],
  // Core Jogger (Apliiq PST871, two colours), owner instruction 2026-10-27.
  "80000000-0000-4000-8000-000000000024": ["men"],
  // TEMPO (women), built on Apliiq and Tapstitch 2026-10-26.
  "80000000-0000-4000-8000-000000000017": ["women"],
  "80000000-0000-4000-8000-000000000018": ["women"],
  "80000000-0000-4000-8000-000000000019": ["women"],
  "80000000-0000-4000-8000-000000000020": ["women"],
  "80000000-0000-4000-8000-000000000021": ["women"],
  "80000000-0000-4000-8000-000000000022": ["women"],
};
// The GOOOL pieces that filled this grid were retired on 2026-10-15, so the
// home page features the GOAL Athletics pieces on sale.
export const featuredProductIds: string[] = [
  "80000000-0000-4000-8000-000000000011",
  "80000000-0000-4000-8000-000000000012",
  "80000000-0000-4000-8000-000000000013",
];
export function featuredProducts() {
  const products = getProducts();
  return featuredProductIds.flatMap(id => products.filter(product => product.id === id));
}
export function productType(product: Product) {
  return product.category === "hoodie" ? "hoodies" : product.category === "shorts" ? "shorts" : product.category === "jacket" ? "jackets" : product.category === "pants" ? "pants" : product.category === "pullover" ? "layers" : ["hat", "accessory"].includes(product.category) ? "hats" : "tees";
}
/** The collection a product belongs to, for tags and eyebrows: women's pieces are TEMPO, everything else CORE. */
export function collectionLabel(product: Product): "TEMPO" | "CORE" {
  return audienceAssignments[product.id]?.includes("women") ? "TEMPO" : "CORE";
}
// Catalog order (owner, 2026-10-27): what you wear in the warmth first,
// the coldest layers last. Caps, tees, shorts, joggers, quarter zip, then
// hoodies and the jacket. Women's TEMPO pieces follow the same idea.
// Products not listed keep their products.ts order after the ranked ones.
const CATALOG_RANK: readonly string[] = [
  "80000000-0000-4000-8000-000000000009", // GA Matchday Cap
  "80000000-0000-4000-8000-000000000010", // Stacked Stadium Cap
  "80000000-0000-4000-8000-000000000011", // Warm-Up Tee
  "80000000-0000-4000-8000-000000000012", // Match Day Tee
  "80000000-0000-4000-8000-000000000017", // TEMPO Core Training Tee
  "80000000-0000-4000-8000-000000000021", // TEMPO Training Tee
  "80000000-0000-4000-8000-000000000013", // Core Shorts
  "80000000-0000-4000-8000-000000000022", // TEMPO Training Shorts
  "80000000-0000-4000-8000-000000000024", // Core Jogger
  "80000000-0000-4000-8000-000000000019", // TEMPO Training Pants
  "80000000-0000-4000-8000-000000000023", // Core Quarter Zip
  "80000000-0000-4000-8000-000000000018", // TEMPO Quarter Zip
  "80000000-0000-4000-8000-000000000014", // Heritage Hoodie
  "80000000-0000-4000-8000-000000000015", // Core Hoodie
  "80000000-0000-4000-8000-000000000020", // TEMPO Warmup Hoodie
  "80000000-0000-4000-8000-000000000016", // Core Everyday Raincoat
];
export function catalogOrder(list: Product[]): Product[] {
  const rank = (p: Product) => { const i = CATALOG_RANK.indexOf(p.id); return i === -1 ? CATALOG_RANK.length : i; };
  return list.map((p, index) => ({ p, index })).sort((a, b) => rank(a.p) - rank(b.p) || a.index - b.index).map(x => x.p);
}
export function forAudience(audience: Audience) {
  // The women's grid renders only on /women, which the owner gate guards
  // while TEMPO is coming soon, so it may read the gated rows.
  return catalogOrder(getProducts({ includeTempo: audience === "women" }).filter(p => audienceAssignments[p.id]?.includes(audience)));
}
function brightness(hex: string) {
  const rgb = hex.replace("#", "").match(/.{2}/g)?.map(v => parseInt(v, 16)) || [0, 0, 0];
  return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
}
export function orderedVariants(product: Product) {
  return (product.colorVariants || []).map((variant, index) => ({ variant, index })).sort((a, b) =>
    Number(b.variant.name.toLowerCase() === "black") - Number(a.variant.name.toLowerCase() === "black") || brightness(a.variant.hex) - brightness(b.variant.hex) || a.index - b.index);
}
export function defaultVariant(product: Product) {
  const ordered = orderedVariants(product);
  return ordered.find(v => !v.variant.comingSoon) || ordered[0];
}
