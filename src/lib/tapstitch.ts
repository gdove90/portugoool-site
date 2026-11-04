import type { Size } from "./types";

// Verified against the owner's saved Halo designs, November 3, 2026.
// A design ID differs from its product-page ID. TAP references are site
// routing identifiers, not a claim of an automated supplier ordering API.
export const HALO_TAPSTITCH_DESIGNS = {
  Black: { designId: "1567484017748627456", productPageId: "1567486704926019584", supplierColor: "Black" },
  "Haze Blue": { designId: "1567487271354122240", productPageId: "1567487271568105472", supplierColor: "Haze Blue" },
  Oat: { designId: "1567489152965033984", productPageId: "1567489153183207424", supplierColor: "Apricot" },
  "Flower Gray": { designId: "1567491247352987648", productPageId: "1567491247541817344", supplierColor: "Flower Gray" },
} as const;

export function parseTapstitchSku(sku: unknown): { designId: string; size: Size } | null {
  if (typeof sku !== "string") return null;
  const match = /^TAP-(\d{19})-(XS|S|M|L|XL|XXL|OS)$/.exec(sku);
  return match ? { designId: match[1], size: match[2] as Size } : null;
}

export function tapstitchOrderReference(sku: unknown): string | null {
  const parsed = parseTapstitchSku(sku);
  if (!parsed) return null;
  const saved = Object.values(HALO_TAPSTITCH_DESIGNS).find(d => d.designId === parsed.designId);
  const size = parsed.size === "XXL" ? "2XL" : parsed.size;
  return `Saved design ${parsed.designId}; supplier size ${size}` + (saved
    ? `; supplier color ${saved.supplierColor}; https://www.tapstitch.com/account/products-pool/product/${saved.productPageId}`
    : "; find this exact ID in the Tapstitch Designs list");
}
