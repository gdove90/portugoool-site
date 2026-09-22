import crypto from "crypto";

// ─────────────────────────────────────────────────────────────
// Apliiq API client (server-only).
//
// Auth (per help.apliiq.com "Authentication"):
//   Authorization: x-apliiq-auth RTS:SIG:APPID:STATE
//   SIG = base64(HMACSHA256(APPID + RTS + STATE + base64(body), SECRET))
//
// Endpoints (per help.apliiq.com "Create Order" / "Orders"):
//   POST {base}/v1/Order   → 200 processed · 202 received-not-processed · 401
//   GET  {base}/v1/Order   → list orders (reconciliation after timeouts)
//
// Inbound fulfillment callback (per "Fulfillment URL"):
//   x-apliiq-hmac = base64(HMACSHA256(base64(payload), SECRET))
//
// Env (server-only, never client-bundled):
//   APLIIQ_APP_ID, APLIIQ_SHARED_SECRET     credentials
//   APLIIQ_SUBMIT_ENABLED=true              hard gate for real submissions
//   APLIIQ_API_BASE                         override for local simulation only
//
// Apliiq has NO sandbox. Real submissions stay disabled until the owner
// flips APLIIQ_SUBMIT_ENABLED in the production context.
// ─────────────────────────────────────────────────────────────

const DEFAULT_BASE = "https://api.apliiq.com";

export interface ApliiqLineItem {
  id: number;
  name: string;
  quantity: number;
  price: number; // dollars, what the customer paid per unit
  sku: string; // APQ-…S#A# from src/lib/fulfillment.ts
}

export interface ApliiqShippingAddress {
  first_name: string;
  last_name: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
  province: string;
  province_code?: string;
  country: string;
  country_code: string;
  phone?: string;
}

export interface ApliiqOrderPayload {
  id: number;
  number: number;
  name: string;
  order_number: string;
  line_items: ApliiqLineItem[];
  shipping_address: ApliiqShippingAddress;
  shipping_lines?: { code: "standard" | "upgraded" | "rush" }[];
}

export type ApliiqSubmitResult =
  | { outcome: "accepted"; apliiqOrderId: string }
  | { outcome: "received_pending"; apliiqOrderId: string | null; message: string }
  | { outcome: "rejected"; status: number; message: string }
  | { outcome: "unknown"; message: string }; // timeout / network — reconcile before retry

function credentials() {
  const appId = process.env.APLIIQ_APP_ID;
  const secret = process.env.APLIIQ_SHARED_SECRET;
  if (!appId || !secret) return null;
  return { appId, secret };
}

export function apliiqConfigured(): boolean {
  return credentials() !== null;
}

export function apliiqSubmitEnabled(): boolean {
  return process.env.APLIIQ_SUBMIT_ENABLED === "true" && apliiqConfigured();
}

/**
 * A destination only counts as a simulator when it is a loopback URL.
 * Setting APLIIQ_API_BASE to anything else — including, explicitly,
 * https://api.apliiq.com — gets the full real-destination treatment.
 */
const SIMULATOR_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

export function isSimulatedDestination(): boolean {
  const base = process.env.APLIIQ_API_BASE;
  if (!base) return false;
  try {
    return SIMULATOR_HOSTS.has(new URL(base).hostname.toLowerCase());
  } catch {
    return false; // unparseable base: treat as real → strictest checks
  }
}

/**
 * Environment isolation for REAL submissions — never a matter of
 * remembering which env vars are set where. Any non-loopback
 * destination (the default api.apliiq.com, an explicit override to it,
 * or anything unrecognizable) additionally requires ALL of:
 *   · a LIVE-mode payment (test events can never order garments)
 *   · Netlify production context (previews/branch deploys are refused;
 *     locally CONTEXT is unset, so local runs are refused too)
 * Only loopback simulators are exempt, and apliiqFetch refuses
 * redirects, so a simulator can never bounce a request to the real API.
 */
export function submissionEnvironmentAllowed(livemode: boolean): {
  allowed: boolean;
  reason?: string;
} {
  if (isSimulatedDestination()) return { allowed: true };
  if (!livemode) {
    return { allowed: false, reason: "Stripe TEST-mode payment; real Apliiq submission refused." };
  }
  if (process.env.CONTEXT !== "production") {
    return {
      allowed: false,
      reason: `Deploy context '${process.env.CONTEXT ?? "local"}' is not production; real Apliiq submission refused.`,
    };
  }
  return { allowed: true };
}

function authHeader(body: string): string {
  const { appId, secret } = credentials()!;
  const rts = Math.floor(Date.now() / 1000).toString();
  const state = crypto.randomUUID();
  const b64body = body ? Buffer.from(body, "utf8").toString("base64") : "";
  const sig = crypto
    .createHmac("sha256", secret)
    .update(appId + rts + state + b64body)
    .digest("base64");
  return `x-apliiq-auth ${rts}:${sig}:${appId}:${state}`;
}

async function apliiqFetch(
  path: string,
  init: { method: string; body?: string },
  // 6s, not 20s. This fetch is awaited INSIDE the Stripe webhook
  // handler, which runs as a Netlify synchronous function with a 10s
  // default budget. At 20s the platform killed the handler before the
  // client timeout could fire, so the CAS lock stayed in `submitting`
  // with no result written and no 200 returned to Stripe - an orphaned
  // order plus a retry storm. 6s leaves headroom for signature
  // verification, the order write and the response. An abort here is
  // classified "unknown", which parks the order in needs_reconcile for
  // the reconcile path rather than guessing.
  timeoutMs = Number(process.env.APLIIQ_TIMEOUT_MS ?? 6000)
): Promise<Response> {
  const base = process.env.APLIIQ_API_BASE ?? DEFAULT_BASE;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(`${base}${path}`, {
      method: init.method,
      headers: {
        Authorization: authHeader(init.body ?? ""),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: init.body,
      signal: controller.signal,
      // A redirect could move an authenticated order request to another
      // host (e.g. a "simulator" bouncing to the real API). Refuse them.
      redirect: "error",
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Submit one order. Never call twice for the same order without first
 * reconciling an "unknown" outcome via findOrderByNumber.
 */
export async function submitOrder(
  payload: ApliiqOrderPayload
): Promise<ApliiqSubmitResult> {
  const body = JSON.stringify(payload);
  let res: Response;
  try {
    res = await apliiqFetch("/v1/Order", { method: "POST", body });
  } catch (err) {
    return {
      outcome: "unknown",
      message: `No response from Apliiq (${err instanceof Error ? err.name : "error"}); reconcile before any retry.`,
    };
  }

  const text = await res.text().catch(() => "");
  if (res.status === 200) {
    let id: string | null = null;
    try {
      id = String(JSON.parse(text).id ?? "");
    } catch {
      /* body not JSON */
    }
    if (id) return { outcome: "accepted", apliiqOrderId: id };
    return { outcome: "received_pending", apliiqOrderId: null, message: text.slice(0, 500) };
  }
  if (res.status === 202) {
    // Received but not processed — pending, NOT fulfilled.
    let id: string | null = null;
    try {
      id = String(JSON.parse(text).id ?? "") || null;
    } catch {
      /* ignore */
    }
    return { outcome: "received_pending", apliiqOrderId: id, message: text.slice(0, 500) };
  }
  if (res.status >= 500) {
    // Server error: Apliiq may or may not have recorded it.
    return { outcome: "unknown", message: `HTTP ${res.status}: ${text.slice(0, 500)}` };
  }
  return { outcome: "rejected", status: res.status, message: text.slice(0, 500) };
}

/**
 * Reconciliation: list Apliiq orders around the order's OWN dates and
 * look for our order_number. Used after an "unknown" submit outcome so
 * a timeout can never turn into a blind duplicate order.
 *
 * Deliberately conservative — "not found" (which authorizes a retry)
 * is only returned when every listing in the window came back as a
 * well-formed, comparable, plausibly complete order list:
 *   · non-array / unexpected shapes           → null (unresolved)
 *   · rows lacking any comparable number field → null (unresolved)
 *   · suspiciously large pages (possible pagination truncation)
 *     without a hit                            → null (unresolved)
 * The response contract beyond "GET /v1/Order?month&year returns the
 * period's orders" is undocumented; anything surprising stays
 * unresolved and keeps the order parked in needs_reconcile.
 */
const LIST_TRUNCATION_GUARD = 200;

function extractOrderArray(body: unknown): unknown[] | null {
  if (Array.isArray(body)) return body;
  if (body && typeof body === "object") {
    for (const key of ["orders", "Orders", "data", "items", "results"]) {
      const v = (body as Record<string, unknown>)[key];
      if (Array.isArray(v)) return v;
    }
  }
  return null;
}

function rowMatches(row: unknown, orderNumber: string): boolean | null {
  if (!row || typeof row !== "object") return null; // not comparable
  const r = row as Record<string, unknown>;
  const candidates = [r.order_number, r.orderNumber, r.OrderNumber, r.name, r.Name];
  const comparable = candidates.filter((c) => c != null);
  if (comparable.length === 0) return null; // nothing to compare against
  return comparable.some((c) => String(c) === orderNumber);
}

export async function findOrderByNumber(
  orderNumber: string,
  referenceDates: Date[] = []
): Promise<{ found: boolean; apliiqOrderId?: string } | null> {
  // Search every month touched by the order's lifecycle (creation,
  // payment, submission attempt) plus the current month.
  const monthKeys = new Map<string, { month: number; year: number }>();
  for (const d of [...referenceDates, new Date()]) {
    if (Number.isNaN(d.getTime())) continue;
    // include the month itself and the following one (a submission just
    // before midnight on the 31st can land in Apliiq dated either side)
    for (const shift of [0, 1]) {
      const m = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + shift, 1));
      const key = `${m.getUTCFullYear()}-${m.getUTCMonth() + 1}`;
      monthKeys.set(key, { month: m.getUTCMonth() + 1, year: m.getUTCFullYear() });
    }
  }
  const windows = [...monthKeys.values()].slice(0, 6);

  let sawIncomparableRows = false;
  let sawPossiblyTruncatedList = false;

  for (const w of windows) {
    let res: Response;
    try {
      res = await apliiqFetch(`/v1/Order?month=${w.month}&year=${w.year}`, { method: "GET" });
    } catch {
      return null; // reconciliation itself failed — stay in needs_reconcile
    }
    if (!res.ok) return null;
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      return null;
    }
    const orders = extractOrderArray(body);
    if (orders === null) return null; // unexpected shape — never authorize retry

    for (const row of orders) {
      const match = rowMatches(row, orderNumber);
      if (match === null) {
        sawIncomparableRows = true;
        continue;
      }
      if (match) {
        const id = (row as { id?: unknown; Id?: unknown }).id ?? (row as { Id?: unknown }).Id;
        return { found: true, apliiqOrderId: id != null ? String(id) : undefined };
      }
    }
    if (orders.length >= LIST_TRUNCATION_GUARD) sawPossiblyTruncatedList = true;
  }

  // No hit anywhere. Only certify absence when every row was comparable
  // and no listing looked truncated.
  if (sawIncomparableRows || sawPossiblyTruncatedList) return null;
  return { found: false };
}

/**
 * Verify Apliiq's fulfillment callback signature:
 * x-apliiq-hmac = base64(HMACSHA256(base64(rawBody), SECRET)).
 * Constant-time comparison; returns false when credentials are absent.
 */
export function verifyFulfillmentSignature(rawBody: string, header: string | null): boolean {
  const creds = credentials();
  if (!creds || !header) return false;
  const expected = crypto
    .createHmac("sha256", creds.secret)
    .update(Buffer.from(rawBody, "utf8").toString("base64"))
    .digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(header.trim());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
