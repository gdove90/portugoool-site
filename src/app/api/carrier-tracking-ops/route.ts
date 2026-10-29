import { trackingConfig } from "@/lib/carrier-tracking/config";
import { secretMatches, trackingResponse } from "@/lib/carrier-tracking/http";
import { trackingDatabase } from "@/lib/carrier-tracking/storage";
import { runTrackingWorker } from "@/lib/carrier-tracking/worker";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const config = trackingConfig();
  if (!config) return trackingResponse({ error: "Tracking is disabled." }, 503);
  if (!secretMatches(request.headers.get("x-tracking-ops-key"), config.opsSecret)) return trackingResponse({ error: "Unauthorized." }, 401);
  const db = trackingDatabase();
  if (!db) return trackingResponse({ error: "Tracking storage is unavailable." }, 503);
  try { return trackingResponse(await runTrackingWorker(db, config)); }
  catch { console.error("carrier_tracking worker_persistence_failed"); return trackingResponse({ error: "Tracking worker unavailable." }, 503); }
}
