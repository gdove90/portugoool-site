// Owner opened the women's TEMPO collection to the public on 2026-11-07.
// Visibility is separate from purchase readiness: product and colour
// Coming Soon holds (Training Bra, Training Leggings, Quarter Zip Teal)
// still apply at checkout.
export const TEMPO_COLLECTION_COMING_SOON = false;

export const TEMPO_PUBLIC_PRODUCT_IDS: ReadonlySet<string> = new Set([
  "80000000-0000-4000-8000-000000000017",
  "80000000-0000-4000-8000-000000000018",
  "80000000-0000-4000-8000-000000000019",
  "80000000-0000-4000-8000-000000000020",
  "80000000-0000-4000-8000-000000000021",
  "80000000-0000-4000-8000-000000000025",
  "80000000-0000-4000-8000-000000000022",
  "80000000-0000-4000-8000-000000000026",
]);

// The TEMPO catalog rows. While the collection is coming soon they leave
// every public reader of the catalog (shop grid, search, sitemap, product
// pages, size-guide tabs, checkout); only readers that ask for them
// (includeTempo) and the owner's pages see them.
export const TEMPO_PRODUCT_IDS: ReadonlySet<string> = new Set([
  "80000000-0000-4000-8000-000000000017",
  "80000000-0000-4000-8000-000000000018",
  "80000000-0000-4000-8000-000000000019",
  "80000000-0000-4000-8000-000000000020",
  "80000000-0000-4000-8000-000000000021",
  "80000000-0000-4000-8000-000000000025",
  "80000000-0000-4000-8000-000000000022",
  "80000000-0000-4000-8000-000000000026",
]);

/** True for a TEMPO product while the collection is gated. */
export function tempoHidden(productId: string): boolean {
  return TEMPO_PRODUCT_IDS.has(productId) && (TEMPO_COLLECTION_COMING_SOON || !TEMPO_PUBLIC_PRODUCT_IDS.has(productId));
}
