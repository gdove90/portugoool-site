// Shared domain types for GOOOL.
// These mirror the Supabase `products` schema so the mock data in
// `products.ts` can be swapped for a real DB fetch with no shape changes.

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "3XL" | "OS";

export const SHIRT_SIZES: Size[] = ["S", "M", "L", "XL", "XXL"];

/** Jerseys only — the jersey blank offers XS; the tee blanks do not. */
export const JERSEY_SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
/** AS Colour 5082 oversized blank — runs S through 3XL. */
export const OVERSIZED_TEE_SIZES: Size[] = ["S", "M", "L", "XL", "XXL", "3XL"];
export const ONE_SIZE: Size[] = ["OS"];
export const ALL_SIZES: Size[] = [...SHIRT_SIZES, "OS"];

export type ProductCategory = "jersey" | "casual" | "tshirt" | "accessory" | "hat";

/** Future fulfillment routing — no integration yet, just clean structure. */
export type SupplierType =
  | "printful"
  | "printify"
  | "apliiq"
  | "gelato"
  | "local"
  | "unassigned";

export interface ProductImage {
  src: string;
  alt: string;
}

/** One selectable colorway of a variant-based product (single product page,
 *  multiple colors). The garment fulfilled is tied to the supplier's own
 *  color name — the hex is presentation only. */
export interface ColorVariant {
  /** Customer-facing color name, e.g. "Faded Cream". */
  name: string;
  /** Supplier source color, e.g. Printful "Faded Bone". */
  supplierColor: string;
  /** Website swatch hex — presentation only, never sent to the supplier. */
  hex: string;
  /** SKU fragment, e.g. "CREAM" → GOOOL-OVAL-TEE-CREAM-M. */
  skuFragment: string;
  /** Gallery for this colorway (front first — used as the card image). */
  images: ProductImage[];
}

/** Structured size guide sourced from the supplier's size chart. */
export interface SizeGuide {
  unit: "in";
  measurements: { label: string; values: Partial<Record<Size, number>> }[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  compareAtPriceCents?: number | null;
  color: string;
  /** Hex used for the colour swatch dot in the UI. */
  colorHex: string;
  fabric: string;
  fit: string;
  careInstructions: string;
  images: ProductImage[];
  sizes: Size[];
  category: ProductCategory;
  supplierType: SupplierType;
  isActive: boolean;
  // ── Limited drop ────────────────────────────────────────────
  isLimitedDrop: boolean;
  /** e.g. "I", "II" — displayed as "Drop Version I". */
  dropVersion?: string | null;
  /** Total units in the drop (e.g. 500). null = not a counted drop. */
  dropLimit?: number | null;
  /** Units sold so far — remaining = dropLimit - dropSoldCount. */
  dropSoldCount: number;
  // ── Customization upsell ────────────────────────────────────
  customNameAvailable: boolean;
  customNumberAvailable: boolean;
  /** Add-on price when a name/number is requested (jerseys: $15). */
  customizationPriceCents: number;
  // ── Color variants (single page, multiple colorways) ────────
  /** When present, the page shows a color selector; `color`/`colorHex`/
   *  `images` mirror the first variant as the default presentation. */
  colorVariants?: ColorVariant[];
  /** Fit notice shown beside the size selector. */
  fitNote?: string;
  /** Supplier size chart rendered as an accessible table. */
  sizeGuide?: SizeGuide;
  /** Print-on-demand disclosure shown near the trust copy. */
  disclosure?: string;
}

/** Units left in a counted drop, or null when the product isn't counted. */
export function remainingUnits(p: Product): number | null {
  if (p.dropLimit == null) return null;
  return Math.max(0, p.dropLimit - p.dropSoldCount);
}

export function isSoldOut(p: Product): boolean {
  return remainingUnits(p) === 0;
}

/** A single line the customer is buying. */
export interface CartItem {
  key: string; // unique per product + size + customisation combo
  productId: string;
  slug: string;
  name: string;
  color: string;
  image: string;
  size: Size;
  quantity: number;
  unitPriceCents: number;
  customName?: string;
  customNumber?: string;
}
