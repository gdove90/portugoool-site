/** Format integer cents as USD, e.g. 4500 → "$45". Keeps cents only when non-zero. */
export function formatPrice(cents: number): string {
  const dollars = cents / 100;
  return dollars % 1 === 0
    ? `$${dollars}`
    : `$${dollars.toFixed(2)}`;
}
