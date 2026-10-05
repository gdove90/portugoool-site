import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export type Audience = "men" | "women";
// Owner assignment is deliberately separate from fulfillment and product identity.
export const audienceAssignments: Record<string, Audience[]> = {};
export const featuredProductIds: string[] = [];
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
