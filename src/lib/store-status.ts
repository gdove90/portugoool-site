// Reopening is a deliberate release action, independent of the team password.
// No credential loss or unset environment variable may reopen the catalog.
export function storeClosed(): boolean {
  return process.env.STORE_OPEN !== "true" || Boolean(process.env.PREVIEW_KEY);
}

export const SERVICE_PATHS = new Set([
  "/contact", "/support", "/faq", "/shipping-returns", "/size-guide",
  "/track-order", "/success", "/privacy", "/terms", "/refunds",
]);
