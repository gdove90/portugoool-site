import { Product } from "./types";
import { getProductBySlug } from "./products";

// The First Capsule's four collections. Assign a product to a
// collection by adding its slug here; the shop page renders whatever
// these lists resolve to, so no markup changes are needed for new
// products.
export interface ShopCollection {
  key: string;
  /** Creative collection name, displayed large. */
  name: string;
  /** Plain category subtitle under the name. */
  subtitle: string;
  /** Short label for the filter control. */
  filterLabel: string;
  slugs: string[];
}

export const SHOP_COLLECTIONS: ShopCollection[] = [
  {
    key: "casual-tees",
    name: "Off the Pitch",
    subtitle: "Casual Tees",
    filterLabel: "Casual Tees",
    slugs: [
      "goool-heavyweight-casual-tee",
      "goool-athletics-modern-sport-tee",
      "goool-athletics-varsity-tee",
      "goool-athletics-minimal-club-tee",
      "goool-athletics-circular-badge-tee",
    ],
  },
  {
    key: "hoodies-layers",
    name: "Warm-Up Club",
    subtitle: "Hoodies & Layers",
    filterLabel: "Hoodies & Layers",
    slugs: ["goool-heavyweight-hoodie", "goool-athletics-circular-center-crewneck"],
  },
  {
    key: "performance",
    name: "Match Ready",
    subtitle: "Athletic Performance",
    filterLabel: "Performance",
    slugs: ["goool-performance-tee"],
  },
  {
    key: "headwear",
    name: "Touchline Essentials",
    subtitle: "Headwear",
    filterLabel: "Headwear",
    slugs: ["goool-touchline-cap"],
  },
];

export interface ResolvedCollection extends Omit<ShopCollection, "slugs"> {
  products: Product[];
}

export function resolveCollections(): ResolvedCollection[] {
  return SHOP_COLLECTIONS.map(({ slugs, ...rest }) => ({
    ...rest,
    products: slugs
      .map((slug) => getProductBySlug(slug))
      .filter((p): p is Product => p != null && p.isActive),
  })).filter((c) => c.products.length > 0);
}
