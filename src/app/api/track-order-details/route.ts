import { getOrdersStore } from "@/lib/orders-store";
import { orderNumber } from "@/lib/fulfillment-submit";
import { trackingConfig } from "@/lib/carrier-tracking/config";
import { boundedBody, localAbuseCheck, requestBucket, trackingResponse, TrackingRequestError } from "@/lib/carrier-tracking/http";
import { checked, readPackages, trackingDatabase } from "@/lib/carrier-tracking/storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    localAbuseCheck(request);
    let body: unknown;
    try { body = JSON.parse(await boundedBody(request, 2048)); }
    catch (error) { if (error instanceof TrackingRequestError) throw error; throw new TrackingRequestError(400, "Invalid request."); }
    const value = body as { reference?: unknown; email?: unknown } | null;
    if (!value || Array.isArray(value) || typeof value.reference !== "string" || typeof value.email !== "string" ||
      value.reference.length > 64 || value.email.length > 254) throw new TrackingRequestError(400, "Invalid request.");
    const reference = value.reference.trim().toUpperCase(), email = value.email.trim();
    if (!/^GOOOL-[0-9A-F]{8}$/.test(reference) || !/^[^\s@]+@[^\s@]+$/.test(email)) throw new TrackingRequestError(400, "Invalid request.");
    const config = trackingConfig(), db = trackingDatabase();
    if (config && db) {
      const count = checked(await db.rpc("carrier_tracking_rate", { p_key: requestBucket(request, config.opsSecret) }));
      if (Number(count) > 30) throw new TrackingRequestError(429, "Please try again later.");
    }
    // Independently verify both credentials, with precisely the original email comparison.
    const store = getOrdersStore();
    if (!store) throw new TrackingRequestError(503, "Tracking details are unavailable.");
    const orders = await store.listOrdersByEmail(email);
    const order = orders.find((candidate) => orderNumber(candidate.id) === reference);
    if (!order || order.status === "pending") return trackingResponse({ error: "No order matches that reference and email." }, 404);
    if (!config || !db) return trackingResponse({ available: false, packages: [], reason: "Carrier history is not available yet. Use the carrier link for its latest report." });
    // No provider requests, registrations, shipment mutations or notification work on a page visit.
    return trackingResponse({ available: true, packages: await readPackages(db, order.id) });
  } catch (error) {
    if (error instanceof TrackingRequestError) return trackingResponse({ error: error.message }, error.status);
    return trackingResponse({ available: false, packages: [], reason: "Carrier history is temporarily unavailable. Your order lookup is still available." });
  }
}
