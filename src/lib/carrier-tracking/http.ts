import { createHmac, timingSafeEqual } from "node:crypto";

export class TrackingRequestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function trackingResponse(data: unknown, status = 200) {
  return Response.json(data, { status, headers: {
    "Cache-Control": "private, no-store, max-age=0", "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  } });
}
export async function boundedBody(request: Request, max: number) {
  if (!request.body) throw new TrackingRequestError(400, "Invalid request.");
  const reader = request.body.getReader();
  const parts: Uint8Array[] = []; let length = 0;
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; void reader.cancel().catch(() => {}); }, 1500);
  try {
    while (true) {
      const part = await reader.read(); if (part.done) break;
      length += part.value.byteLength;
      if (length > max) { await reader.cancel(); throw new TrackingRequestError(413, "Request too large."); }
      parts.push(part.value);
    }
    if (timedOut) throw new TrackingRequestError(408, "Request timed out.");
  } finally { clearTimeout(timer); reader.releaseLock(); }
  return Buffer.concat(parts).toString("utf8");
}
export function secretMatches(received: string | null, expected: string) {
  if (!received || received.length > 512) return false;
  const a = Buffer.from(received), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Small local shield also works before migrations exist. Active enrichment additionally
// uses the database bucket, shared across instances. Only trust Netlify's own IP header.
const buckets = new Map<string, { count: number; until: number }>();
export function requestBucket(request: Request, secret = "local-shield") {
  const ip = process.env.NETLIFY === "true" ? request.headers.get("x-nf-client-connection-ip") || "unknown" : "local";
  return createHmac("sha256", secret).update(`${ip}:${Math.floor(Date.now() / 600000)}`).digest("hex");
}
export function localAbuseCheck(request: Request) {
  const now = Date.now(), key = requestBucket(request);
  for (const [id, bucket] of buckets) if (bucket.until < now) buckets.delete(id);
  if (!buckets.has(key) && buckets.size >= 5000) throw new TrackingRequestError(429, "Please try again later.");
  const bucket = buckets.get(key) || { count: 0, until: now + 600000 };
  bucket.count++; buckets.set(key, bucket);
  if (bucket.count > 30) throw new TrackingRequestError(429, "Please try again later.");
}
