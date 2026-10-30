import { randomUUID } from "node:crypto";
import { createTracker, findTracker, retrieveTracker, validateTrackerWindow, TrackingProviderError } from "./easypost";
import { checked, finishPackage, type ClaimedPackage, type TrackingDatabase } from "./storage";

export interface PreflightInput { shipmentId: string; trackingIndex: number; allowRegistration?: boolean }
export interface PreflightConfig { key: string; webhookSecret: string; opsSecret: string; mode: "production" }
export interface PreflightResult {
  outcome: "authorization_required" | "verified" | "awaiting_carrier_data" | "retry" | "review";
  registered: boolean;
  registrationAttempted: boolean;
  reused: boolean;
  status?: string;
  eventCount?: number;
  hasEstimate?: boolean;
}

/** Exactly one persisted USPS package. This function never calls global discovery/claim. */
export async function runTrackingPreflight(db: TrackingDatabase, config: PreflightConfig, input: PreflightInput): Promise<PreflightResult> {
  const lease = randomUUID();
  const rows = checked(await db.rpc("carrier_tracking_preflight_claim", {
    p_shipment_id: input.shipmentId, p_tracking_index: input.trackingIndex, p_lease: lease,
  })) as ClaimedPackage[];
  if (!rows || rows.length !== 1) throw new Error("Preflight target unavailable.");
  const pkg = rows[0];
  let registered = false, registrationAttempted = false, reused = false;
  try {
    if (pkg.carrier !== "USPS" || pkg.environment !== "production" || !pkg.registration_not_before ||
      !/T.*(?:Z|[+-]\d{2}:?\d{2})$/.test(pkg.registration_not_before) ||
      !Number.isFinite(Date.parse(pkg.registration_not_before))) throw new TrackingProviderError("configuration");
    let snapshot;
    if (pkg.tracker_id) {
      snapshot = await retrieveTracker({ key: config.key, trackerId: pkg.tracker_id, mode: config.mode, timeoutMs: 6000 });
      reused = true;
    } else {
      const lookupNow = Date.now();
      snapshot = await findTracker({ key: config.key, trackingNumber: pkg.tracking_number, carrier: pkg.carrier,
        mode: config.mode, createdAfter: pkg.registration_started_at
          ? new Date(Date.parse(pkg.registration_started_at) - 60000).toISOString() : new Date(lookupNow - 90 * 86400000).toISOString(),
        createdBefore: new Date(lookupNow).toISOString(), timeoutMs: 6000 });
      if (snapshot) reused = true;
      else if (pkg.registration_started_at) throw new TrackingProviderError("ambiguous", true);
      else if (input.allowRegistration !== true) {
        // No billable attempt was made. Release only our lease and restore the previous counter.
        checked(await db.from("carrier_tracking_packages").update({ lease_token: null, lease_until: null,
          attempts: Math.max(0, pkg.attempts - 1) }).eq("id", pkg.id).eq("lease_token", pkg.lease_token));
        return { outcome: "authorization_required", registered: false, registrationAttempted: false, reused: false };
      } else {
        checked(await db.rpc("carrier_tracking_start", { p_id: pkg.id, p_lease: pkg.lease_token }));
        registrationAttempted = true;
        snapshot = await createTracker({ key: config.key, trackingNumber: pkg.tracking_number, carrier: pkg.carrier,
          mode: config.mode, timeoutMs: 6000 });
        registered = true;
      }
    }
    if (!snapshot || snapshot.mode !== pkg.environment || snapshot.carrier !== pkg.carrier ||
      snapshot.trackingNumber.replace(/\s/g, "").toUpperCase() !== pkg.tracking_number)
      throw new TrackingProviderError("ambiguous");
    validateTrackerWindow(snapshot, pkg.registration_not_before);
    await finishPackage(db, pkg, snapshot);
    const awaiting = snapshot.events.length === 0 && ["unknown", "error"].includes(snapshot.status);
    return { outcome: awaiting ? "awaiting_carrier_data" : "verified", registered, registrationAttempted, reused, status: snapshot.status,
      eventCount: snapshot.events.length, hasEstimate: Boolean(snapshot.estimatedDelivery) };
  } catch (error) {
    const terminal = error instanceof TrackingProviderError && !error.retryable && !error.ambiguousCreate;
    const review = terminal || pkg.attempts >= 6;
    checked(await db.rpc("carrier_tracking_fail", { p_id: pkg.id, p_lease: pkg.lease_token,
      p_review: review, p_code: terminal ? "provider_rejected" : "registration_or_sync_unavailable" }));
    console.error(`carrier_tracking preflight_${review ? "review" : "retry"}`);
    return { outcome: review ? "review" : "retry", registered: false, registrationAttempted, reused };
  }
}
