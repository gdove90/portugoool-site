import { trackingConfig } from "@/lib/carrier-tracking/config";
import { verifyWebhook } from "@/lib/carrier-tracking/easypost";
import { boundedBody, trackingResponse, TrackingRequestError } from "@/lib/carrier-tracking/http";
import { persistWebhook, trackingDatabase } from "@/lib/carrier-tracking/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const config = trackingConfig(), db = trackingDatabase();
  if (!config || !db) return trackingResponse({ error: "Tracking is disabled." }, 503);
  let event;
  try { event = verifyWebhook(await boundedBody(request, 524288), request.headers, config.webhookSecret); }
  catch (error) { return trackingResponse({ error: "Invalid tracking event." }, error instanceof TrackingRequestError ? error.status : 401); }
  if (event.mode !== config.mode) return trackingResponse({ error: "Wrong tracking environment." }, 400);
  try {
    // SQL commits inbox + snapshot atomically. Unknown mappings remain pending for reconciliation.
    await persistWebhook(db, event);
    return trackingResponse({ received: true });
  } catch {
    console.error("carrier_tracking webhook_persistence_failed");
    return trackingResponse({ error: "Please retry." }, 503);
  }
}
