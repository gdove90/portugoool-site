import { getSupabaseAdmin } from "../supabase";
import { safeCarrierUrl, type TrackingPackage, type TrackingEvent } from "./presentation";
import type { TrackingSnapshot, VerifiedTrackingWebhook } from "./easypost";

export function trackingDatabase() {
  // A different connector/project must never become a fallback commerce database.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://oexibflpshttgzmdvhpr.supabase.co") return null;
  return getSupabaseAdmin();
}
export type TrackingDatabase = NonNullable<ReturnType<typeof trackingDatabase>>;
export function checked<T>(result: { data: T; error: unknown }): T {
  if (result.error) throw new Error("Tracking persistence unavailable.");
  return result.data;
}
export interface ClaimedPackage {
  id: string; order_id: string; carrier: string; tracking_number: string;
  environment: "production"; tracker_id: string | null; lease_token: string;
  registration_started_at: string | null; attempts: number;
}
export async function readPackages(db: TrackingDatabase, orderId: string): Promise<TrackingPackage[]> {
  const rows = checked(await db.from("carrier_tracking_packages")
    .select("id,carrier,tracking_number,snapshot,last_synced_at")
    .eq("order_id", orderId).eq("environment", "production").order("created_at").limit(50));
  const packages: TrackingPackage[] = [];
  for (const row of rows || []) {
    const savedEvents = checked(await db.from("carrier_tracking_events").select("event")
      .eq("package_id", row.id).order("provider_updated_at", { ascending: false }).limit(1000));
    const snapshot = row.snapshot as TrackingSnapshot | null;
    const lastSyncedAt = row.last_synced_at as string | null;
    // Snapshot is already sanitized at ingestion; project again to an explicit public shape.
    const events = new Map<string, TrackingEvent>();
    for (const entry of savedEvents || []) { const event = entry.event as TrackingEvent; events.set(event.id, event); }
    // The current provider history is always included, even when older saved history is bounded.
    for (const event of snapshot?.events || []) events.set(event.id, event);
    packages.push({
      id: String(row.id), carrier: String(row.carrier), trackingNumber: String(row.tracking_number),
      carrierUrl: safeCarrierUrl(String(row.carrier), String(row.tracking_number)),
      status: snapshot?.status || "unknown", detail: snapshot?.detail || null,
      events: [...events.values()].map((event): TrackingEvent => ({
        id: event.id, status: event.status, detail: event.detail, message: event.message,
        occurredAt: event.occurredAt, location: event.location,
      })),
      estimatedDelivery: snapshot?.estimatedDelivery || null, updatedAt: snapshot?.updatedAt || null,
      lastSyncedAt, stale: !lastSyncedAt || Date.now() - Date.parse(lastSyncedAt) > 86400000,
    });
  }
  return packages;
}
export async function persistWebhook(db: TrackingDatabase, event: VerifiedTrackingWebhook) {
  return checked(await db.rpc("carrier_tracking_receive", {
    p_event_id: event.eventId, p_environment: event.mode, p_snapshot: event.snapshot,
  }));
}
export async function finishPackage(db: TrackingDatabase, pkg: ClaimedPackage, snapshot: TrackingSnapshot) {
  return checked(await db.rpc("carrier_tracking_finish", {
    p_id: pkg.id, p_lease: pkg.lease_token, p_snapshot: snapshot,
  }));
}
