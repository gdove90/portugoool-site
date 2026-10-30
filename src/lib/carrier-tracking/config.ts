import { MIGRATION_PREVIEW } from "../migration-preview";

/** Every live operation must pass both the compiled preview guard and runtime context. */
function trackingContextAllowed() {
  // Netlify omits CONTEXT from its production function runtime (see apliiq.ts).
  // Next inlines MIGRATION_PREVIEW for every branch/preview build; the separate
  // scheduler also uses the existing immutable production build-context guard.
  return !MIGRATION_PREVIEW && (!process.env.CONTEXT || process.env.CONTEXT === "production");
}

export function trackingEnabled() {
  return trackingContextAllowed() && process.env.CARRIER_TRACKING_ENABLED === "true";
}

/** Credentials alone permit only authenticated, explicitly selected preflight work. */
export function trackingPreparationConfig() {
  if (!trackingContextAllowed()) return null;
  const key = process.env.EASYPOST_API_KEY;
  const webhookSecret = process.env.EASYPOST_WEBHOOK_SECRET;
  const opsSecret = process.env.CARRIER_TRACKING_OPS_KEY;
  // Production only; a copied test key must never register production shipments.
  if (!key || !webhookSecret || !opsSecret || opsSecret.length < 32) return null;
  return { key, webhookSecret, opsSecret, mode: "production" as const };
}

export function trackingConfig() {
  return trackingEnabled() ? trackingPreparationConfig() : null;
}
