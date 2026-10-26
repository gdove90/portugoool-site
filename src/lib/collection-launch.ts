// The public sees the Tempo coming-soon page on /women while this is true;
// the original /women editorial and collection grid stay intact behind it
// and the signed-in owner sees them (verifiedOwner, same gate as /admin).
// Opened on 2026-10-26 after the TEMPO pieces were built, then closed again
// the same day (owner: the line is not finished on the site; it is gated to
// the owner only until they say otherwise). Set to false and deploy when
// the owner opens it.
export const TEMPO_COLLECTION_COMING_SOON = true;

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
  "80000000-0000-4000-8000-000000000022",
]);

/** True for a TEMPO product while the collection is gated. */
export function tempoHidden(productId: string): boolean {
  return TEMPO_COLLECTION_COMING_SOON && TEMPO_PRODUCT_IDS.has(productId);
}
