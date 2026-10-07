import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export type Audience = "men" | "women";
// Owner assignment is deliberately separate from fulfillment and product identity.
export const audienceAssignments: Record<string, Audience[]> = {
  "70000000-0000-4000-8000-000000000001": ["men"],
  "70000000-0000-4000-8000-000000000002": ["men"],
  "70000000-0000-4000-8000-000000000006": ["men"],
  "70000000-0000-4000-8000-000000000003": ["men"],
  "70000000-0000-4000-8000-000000000005": ["men"],
  "70000000-0000-4000-8000-000000000004": ["men"],
  "80000000-0000-4000-8000-000000000006": ["men"],
  "80000000-0000-4000-8000-000000000007": ["men"],
  "80000000-0000-4000-8000-000000000008": ["men"],
};
export const featuredProductIds: string[] = [
  "70000000-0000-4000-8000-000000000002",
  "70000000-0000-4000-8000-000000000003",
  "80000000-0000-4000-8000-000000000006",
  "70000000-0000-4000-8000-000000000004",
];
export function featuredProducts() {
  const products = getProducts();
  return featuredProductIds.flatMap(id => products.filter(product => product.id === id));
}
export function productType(product: Product) {
  return product.category === "hoodie" ? "hoodies" : ["hat", "accessory"].includes(product.category) ? "hats" : "tees";
}
export function forAudience(audience: Audience) {
  return getProducts().filter(p => audienceAssignments[p.id]?.includes(audience));
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
