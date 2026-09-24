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

// Display order, top to bottom on the homepage and on /shop. Changed
// 2026-09-23 to lead with headwear and finish on casual tees. The
// collections themselves are untouched: same keys, names, subtitles,
// filter labels and slugs, moved verbatim. CategoryBar and the shop
// filter both map over this array, so the pills reorder with it and the
// alternating section background re-stripes itself.
export const SHOP_COLLECTIONS: ShopCollection[] = [
  {
    key: "headwear",
    name: "Touchline Essentials",
    subtitle: "Headwear",
    filterLabel: "Headwear",
    slugs: ["goool-touchline-cap", "goool-athletics-badge-cap", "goool-athletics-stacked-cap"],
  },
  {
    key: "performance",
    name: "Match Ready",
    subtitle: "Athletic Performance",
    filterLabel: "Performance",
    slugs: ["goool-performance-tee", "goool-athletics-modern-sport-performance-tee"],
  },
  {
    key: "hoodies-layers",
    name: "Warm-Up Club",
    subtitle: "Hoodies & Layers",
    filterLabel: "Hoodies & Layers",
    slugs: ["goool-heavyweight-hoodie", "goool-athletics-circular-center-crewneck"],
  },
  {
    key: "casual-tees",
    name: "Off the Pitch",
    subtitle: "Casual Tees",
    filterLabel: "Casual Tees",
    slugs: [
      // Rebuilt on the Bella+Canvas 3010 and back on sale 2026-09-24
      // (black; natural to follow). It was pulled from this list on
      // 2026-09-23 when the 4810GD version was retired, and re-activating
      // the product did not put it back: resolveCollections only ever
      // shows what is listed here AND isActive.
      "goool-heavyweight-casual-tee",
      // Second row: the Club Blue print set, its own product since 2026-09-24.
      "goool-heavyweight-casual-tee-blue",
      "goool-athletics-varsity-tee",
      "goool-athletics-circular-badge-tee",
    ],
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
