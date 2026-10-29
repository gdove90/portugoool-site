import { MIGRATION_PREVIEW } from "../migration-preview";

/** Every live operation must pass both the compiled preview guard and runtime context. */
export function trackingEnabled() {
  // Netlify omits CONTEXT from its production function runtime (see apliiq.ts).
  // Next inlines MIGRATION_PREVIEW for every branch/preview build; the separate
  // scheduler also uses the existing immutable production build-context guard.
  return !MIGRATION_PREVIEW && (!process.env.CONTEXT || process.env.CONTEXT === "production") &&
    process.env.CARRIER_TRACKING_ENABLED === "true";
}

export function trackingConfig() {
  if (!trackingEnabled()) return null;
  const key = process.env.EASYPOST_API_KEY;
  const webhookSecret = process.env.EASYPOST_WEBHOOK_SECRET;
  const opsSecret = process.env.CARRIER_TRACKING_OPS_KEY;
  // Production only; a copied test key must never register production shipments.
  if (!key || !webhookSecret || !opsSecret || opsSecret.length < 32) return null;
  return { key, webhookSecret, opsSecret, mode: "production" as const };
}
