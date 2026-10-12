/** Customer references use the current brand; supplier order IDs remain stable. */
export function orderReference(orderId: string): string {
  return `GOAL-${orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

/** Previously emailed references still identify the same order after the rename. */
export function normalizeOrderReference(reference: string): string {
  return reference.trim().toUpperCase().replace(/^GOOOL-/, "GOAL-");
}
