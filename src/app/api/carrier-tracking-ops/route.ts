import { trackingEnabled, trackingPreparationConfig } from "@/lib/carrier-tracking/config";
import { boundedBody, secretMatches, trackingResponse, TrackingRequestError } from "@/lib/carrier-tracking/http";
import { trackingDatabase } from "@/lib/carrier-tracking/storage";
import { runTrackingWorker } from "@/lib/carrier-tracking/worker";
import { runTrackingPreflight } from "@/lib/carrier-tracking/preflight";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const config = trackingPreparationConfig();
  if (!config) return trackingResponse({ error: "Tracking is disabled." }, 503);
  if (!secretMatches(request.headers.get("x-tracking-ops-key"), config.opsSecret)) return trackingResponse({ error: "Unauthorized." }, 401);
  try {
    let body: Record<string, unknown> = {};
    if (request.body) {
      const value: unknown = JSON.parse(await boundedBody(request, 2048));
      if (!value || typeof value !== "object" || Array.isArray(value)) throw new TrackingRequestError(400, "Invalid tracking operation.");
      body = value as Record<string, unknown>;
    }
    const enabled = trackingEnabled();
    if (body.action === "preflight") {
      if (enabled) return trackingResponse({ error: "Disable automatic tracking before a preflight." }, 409);
      if (Object.keys(body).some(key => !["action", "shipmentId", "trackingIndex", "allowRegistration"].includes(key)) ||
        typeof body.shipmentId !== "string" || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(body.shipmentId) ||
        typeof body.trackingIndex !== "number" || !Number.isInteger(body.trackingIndex) || body.trackingIndex < 0 || body.trackingIndex > 99 ||
        (body.allowRegistration !== undefined && typeof body.allowRegistration !== "boolean")) throw new TrackingRequestError(400, "Invalid preflight selection.");
      const db = trackingDatabase();
      if (!db) return trackingResponse({ error: "Tracking storage is unavailable." }, 503);
      return trackingResponse(await runTrackingPreflight(db, config, {
        shipmentId: body.shipmentId, trackingIndex: body.trackingIndex, allowRegistration: body.allowRegistration === true,
      }));
    }
    if (!enabled) return trackingResponse({ error: "Tracking is disabled." }, 503);
    if (body.action !== undefined) throw new TrackingRequestError(400, "Invalid tracking operation.");
    const db = trackingDatabase();
    if (!db) return trackingResponse({ error: "Tracking storage is unavailable." }, 503);
    return trackingResponse(await runTrackingWorker(db, config));
  } catch (error) {
    if (error instanceof TrackingRequestError) return trackingResponse({ error: error.message }, error.status);
    if (error instanceof SyntaxError) return trackingResponse({ error: "Invalid tracking operation." }, 400);
    console.error("carrier_tracking operation_unavailable");
    return trackingResponse({ error: "Tracking operation unavailable." }, 503);
  }
}
