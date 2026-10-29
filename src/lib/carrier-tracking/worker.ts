import { randomUUID } from "node:crypto";
import { trackingConfig } from "./config";
import { createTracker, retrieveTracker, findTracker, validateTrackerWindow, TrackingProviderError } from "./easypost";
import { checked, finishPackage, type ClaimedPackage, type TrackingDatabase } from "./storage";

/** Bounded independent ingestion; never imports supplier, payment or email mutation APIs. */
export async function runTrackingWorker(db: TrackingDatabase, config: NonNullable<ReturnType<typeof trackingConfig>>) {
  const discovered = checked(await db.rpc("carrier_tracking_discover", { p_limit: 100, p_lookback_days: 30 }));
  checked(await db.rpc("carrier_tracking_reconcile_inbox"));
  const lease = randomUUID();
  const packages = checked(await db.rpc("carrier_tracking_claim", { p_lease: lease, p_limit: 2 })) as ClaimedPackage[];
  const counts = { discovered: Number(discovered), processed: 0, retry: 0, review: 0 };
  for (const pkg of packages || []) {
    try {
      if (!pkg.registration_not_before || !/T.*(?:Z|[+-]\d{2}:?\d{2})$/.test(pkg.registration_not_before) ||
        !Number.isFinite(Date.parse(pkg.registration_not_before))) throw new TrackingProviderError("configuration");
      let snapshot;
      if (pkg.tracker_id) snapshot = await retrieveTracker({ key: config.key, trackerId: pkg.tracker_id, mode: config.mode, timeoutMs: 6000 });
      else if (pkg.registration_started_at) {
        // A request may have succeeded before a timeout/crash. Never blindly POST it again.
        snapshot = await findTracker({ key: config.key, trackingNumber: pkg.tracking_number, carrier: pkg.carrier,
          mode: config.mode, createdAfter: new Date(Date.parse(pkg.registration_started_at) - 60000).toISOString(),
          createdBefore: new Date().toISOString(), timeoutMs: 6000 });
        if (!snapshot) throw new Error("Ambiguous registration requires reconciliation.");
      } else {
        checked(await db.rpc("carrier_tracking_start", { p_id: pkg.id, p_lease: pkg.lease_token }));
        snapshot = await createTracker({ key: config.key, trackingNumber: pkg.tracking_number, carrier: pkg.carrier, mode: config.mode, timeoutMs: 6000 });
      }
      if (!snapshot || snapshot.mode !== pkg.environment || snapshot.trackingNumber.replace(/\s/g, "").toUpperCase() !== pkg.tracking_number || snapshot.carrier.toUpperCase() !== pkg.carrier.toUpperCase())
        throw new Error("Tracker identity mismatch.");
      validateTrackerWindow(snapshot, pkg.registration_not_before);
      await finishPackage(db, pkg, snapshot); counts.processed++;
    } catch (error) {
      const terminal = error instanceof TrackingProviderError && !error.retryable && !error.ambiguousCreate;
      const state = terminal || pkg.attempts >= 6 ? "review" : "retry";
      checked(await db.rpc("carrier_tracking_fail", { p_id: pkg.id, p_lease: pkg.lease_token,
        p_review: state === "review", p_code: terminal ? "provider_rejected" : "registration_or_sync_unavailable" }));
      counts[state]++;
      console.error(`carrier_tracking ${state}`);
    }
  }
  const health = checked(await db.rpc("carrier_tracking_health"));
  // Counts only: connect the existing Netlify log alerting surface, with no customer messages.
  console.info("carrier_tracking health", JSON.stringify(health));
  return { ...counts, health };
}
