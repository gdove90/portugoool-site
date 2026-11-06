// Owner, 2026-11-06: keep the complete women's TEMPO collection behind the
// existing Coming Soon gate until every piece is ready for public launch.
// Preserve the existing product records and owner-only preview flow.
export const TEMPO_COLLECTION_COMING_SOON = true;

export const TEMPO_PUBLIC_PRODUCT_IDS: ReadonlySet<string> = new Set([
  "80000000-0000-4000-8000-000000000017",
  "80000000-0000-4000-8000-000000000021",
  "80000000-0000-4000-8000-000000000025",
  "80000000-0000-4000-8000-000000000022",
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
]);

/** True for a TEMPO product while the collection is gated. */
export function tempoHidden(productId: string): boolean {
  return TEMPO_PRODUCT_IDS.has(productId) && (TEMPO_COLLECTION_COMING_SOON || !TEMPO_PUBLIC_PRODUCT_IDS.has(productId));
}
