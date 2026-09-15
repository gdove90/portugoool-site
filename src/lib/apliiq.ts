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
  timeoutMs = Number(process.env.APLIIQ_TIMEOUT_MS ?? 20000)
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
 * Reconciliation: list this month's (and if needed last month's) orders
 * and look for our order_number. Used after an "unknown" submit outcome
 * so a timeout can never turn into a blind duplicate order.
 */
export async function findOrderByNumber(
  orderNumber: string
): Promise<{ found: boolean; apliiqOrderId?: string } | null> {
  const now = new Date();
  const windows = [
    { month: now.getUTCMonth() + 1, year: now.getUTCFullYear() },
    ...(now.getUTCDate() <= 3
      ? [
          {
            month: ((now.getUTCMonth() + 11) % 12) + 1,
            year: now.getUTCMonth() === 0 ? now.getUTCFullYear() - 1 : now.getUTCFullYear(),
          },
        ]
      : []),
  ];
  for (const w of windows) {
    let res: Response;
    try {
      res = await apliiqFetch(`/v1/Order?month=${w.month}&year=${w.year}`, { method: "GET" });
    } catch {
      return null; // reconciliation itself failed — stay in needs_reconcile
    }
    if (!res.ok) return null;
    let orders: unknown;
    try {
      orders = await res.json();
    } catch {
      return null;
    }
    if (Array.isArray(orders)) {
      const hit = orders.find(
        (o) =>
          o &&
          typeof o === "object" &&
          ("order_number" in o
            ? String((o as { order_number: unknown }).order_number) === orderNumber
            : false)
      );
      if (hit) {
        const id = (hit as { id?: unknown }).id;
        return { found: true, apliiqOrderId: id != null ? String(id) : undefined };
      }
    }
  }
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
