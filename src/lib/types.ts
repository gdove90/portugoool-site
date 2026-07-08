// Shared domain types for PORTUGOOOL.
// These mirror the Supabase `products` schema so the mock data in
// `products.ts` can be swapped for a real DB fetch with no shape changes.

export type Size = "S" | "M" | "L" | "XL" | "XXL" | "3XL";

export const ALL_SIZES: Size[] = ["S", "M", "L", "XL", "XXL", "3XL"];

export interface ProductImage {
  src: string;
  alt: string;
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
  isActive: boolean;
  isLimitedDrop: boolean;
  /** Optional scarcity display, e.g. "Only 40 left in this drop". */
  inventoryDisplayCount?: number | null;
  customNameAvailable: boolean;
  customNumberAvailable: boolean;
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

/** Flat add-on price applied when a name and/or number is requested. */
export const CUSTOMIZATION_PRICE_CENTS = 800; // $8.00
