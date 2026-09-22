import crypto from "crypto";
import fs from "fs";
import path from "path";
import { getSupabaseAdmin } from "./supabase";

// ─────────────────────────────────────────────────────────────
// Order persistence used by the Stripe webhook and Apliiq callback.
//
// Production: Supabase (orders / order_items / order_shipments /
// stripe_events per migration 0026) via the service-role client.
//
// Test: when ORDERS_TEST_STORE points at a directory (local dev only,
// never set in Netlify), a JSON-file store implements the same
// contract so the full pipeline — idempotency included — can be
// exercised without live credentials. Same interface, same semantics:
// recordEvent() is an atomic first-writer-wins keyed on the Stripe
// event id, and createOrder() is idempotent on stripe_session_id.
// ─────────────────────────────────────────────────────────────

export interface OrderItemRow {
  product_id: string;
  size: string;
  color: string;
  quantity: number;
  custom_name: string | null;
  custom_number: string | null;
  unit_price_cents: number;
  apliiq_product_id: number | null;
  apliiq_sku: string | null;
}

export interface OrderRow {
  id?: string;
  stripe_session_id: string;
  stripe_payment_intent: string | null;
  customer_email: string | null;
  status: "pending" | "paid" | "cancelled" | "refunded";
  fulfillment_status: string;
  submission_status:
    | "not_submitted"
    | "pending_submission"
    | "submitting"
    | "submitted"
    | "accepted"
    | "failed"
    | "needs_reconcile";
  total_cents: number;
  amount_subtotal_cents: number | null;
  amount_shipping_cents: number | null;
  amount_tax_cents: number | null;
  currency: string;
  shipping_name: string | null;
  shipping_address: Record<string, unknown> | null;
  apliiq_order_id: string | null;
  submission_last_error: string | null;
  paid_at: string | null;
  /** Payment mode persisted from the Stripe event; gates real submission. */
  livemode: boolean;
  /** Identity + start time of the submission attempt holding the lock. */
  submission_attempt_id: string | null;
  submission_started_at: string | null;
}

export interface ShipmentRow {
  order_id: string;
  status: string;
  tracking_company: string | null;
  tracking_numbers: string[];
  tracking_urls: string[];
  line_items: unknown[];
}

export interface OrdersStore {
  /** True when this Stripe event id was already fully processed. */
  hasEvent(eventId: string): Promise<boolean>;
  /** Returns false when the event id was already recorded (duplicate). */
  recordEvent(eventId: string, eventType: string): Promise<boolean>;
  /** Idempotent on stripe_session_id; returns the order id and whether it was created now. */
  createOrder(order: OrderRow, items: OrderItemRow[]): Promise<{ orderId: string; created: boolean }>;
  getOrderBySession(sessionId: string): Promise<(OrderRow & { id: string }) | null>;
  getOrderByApliiqId(apliiqOrderId: string): Promise<(OrderRow & { id: string }) | null>;
  getOrderById(orderId: string): Promise<(OrderRow & { id: string }) | null>;
  listOrdersByEmail(email: string): Promise<(OrderRow & { id: string })[]>;
  listShipments(orderId: string): Promise<ShipmentRow[]>;
  /** The persisted purchase snapshot — fulfillment reads THIS, not the catalog. */
  listOrderItems(orderId: string): Promise<OrderItemRow[]>;
  /**
   * Compare-and-set on submission_status: succeeds only when the current
   * value matches `from`. This is the lock preventing concurrent double
   * submission to Apliiq.
   */
  transitionSubmission(
    orderId: string,
    from: OrderRow["submission_status"],
    to: OrderRow["submission_status"],
    fields?: Partial<
      Pick<
        OrderRow,
        "apliiq_order_id" | "submission_last_error" | "submission_attempt_id" | "submission_started_at"
      >
    >,
    /** When set, the update applies only if the stored attempt id matches. */
    guardAttemptId?: string
  ): Promise<boolean>;
  setOrderStatus(orderId: string, status: OrderRow["status"]): Promise<void>;
  addShipment(shipment: ShipmentRow): Promise<void>;
  setFulfillmentStatus(orderId: string, status: string): Promise<void>;
}

// ── Supabase implementation ──────────────────────────────────

class SupabaseStore implements OrdersStore {
  constructor(private db: NonNullable<ReturnType<typeof getSupabaseAdmin>>) {}

  async hasEvent(eventId: string): Promise<boolean> {
    const { data, error } = await this.db
      .from("stripe_events")
      .select("id")
      .eq("id", eventId)
      .maybeSingle();
    if (error) throw new Error(`stripe_events select failed: ${error.message}`);
    return data != null;
  }

  async recordEvent(eventId: string, eventType: string): Promise<boolean> {
    const { error } = await this.db
      .from("stripe_events")
      .insert({ id: eventId, type: eventType });
    if (!error) return true;
    if (error.code === "23505") return false; // unique violation → duplicate
    throw new Error(`stripe_events insert failed: ${error.message}`);
  }

  async createOrder(order: OrderRow, items: OrderItemRow[]) {
    const { data, error } = await this.db
      .from("orders")
      .insert(order)
      .select("id")
      .single();
    if (!error && data) {
      await this.insertItems(data.id as string, items);
      return { orderId: data.id as string, created: true };
    }
    if (error && error.code === "23505") {
      const existing = await this.getOrderBySession(order.stripe_session_id);
      if (existing) {
        // Repair path. The orders insert and the order_items insert are
        // two statements, not one transaction, so a failure between them
        // (2026-09-21: an order_items FK violation on a product missing
        // from the products table) committed the order and lost the line
        // items. Without this, every Stripe retry took the 23505 branch,
        // returned created:false, and the order stayed itemless forever -
        // which fulfillment then refuses as "no persisted line items".
        // Retrying is the mechanism that is supposed to heal a partial
        // write, so make it actually heal: if the order has no items,
        // insert them now.
        const existingItems = await this.listOrderItems(existing.id);
        if (existingItems.length === 0 && items.length > 0) {
          await this.insertItems(existing.id, items);
        }
        return { orderId: existing.id, created: false };
      }
    }
    throw new Error(`orders insert failed: ${error?.message}`);
  }

  /**
   * Insert an order's line items. Throws on failure so the webhook
   * returns 500 and Stripe retries into the repair path above.
   * Residual race: two deliveries of the same session arriving close
   * enough together could both observe zero items and double-insert.
   * Stripe retries with backoff rather than concurrently, and the
   * quantities come from the same immutable metadata snapshot, so this
   * stays a reconcile-and-correct case rather than a silent overcharge -
   * no money moves off order_items.
   */
  private async insertItems(orderId: string, items: OrderItemRow[]) {
    const rows = items.map((it) => ({ ...it, order_id: orderId }));
    const { error } = await this.db.from("order_items").insert(rows);
    if (error) throw new Error(`order_items insert failed: ${error.message}`);
  }

  private async getOne(column: string, value: string) {
    const { data, error } = await this.db
      .from("orders")
      .select("*")
      .eq(column, value)
      .maybeSingle();
    if (error) throw new Error(`orders select failed: ${error.message}`);
    return (data as (OrderRow & { id: string }) | null) ?? null;
  }
  getOrderBySession(sessionId: string) {
    return this.getOne("stripe_session_id", sessionId);
  }
  getOrderByApliiqId(apliiqOrderId: string) {
    return this.getOne("apliiq_order_id", apliiqOrderId);
  }
  getOrderById(orderId: string) {
    return this.getOne("id", orderId);
  }

  async listOrdersByEmail(email: string) {
    const { data, error } = await this.db
      .from("orders")
      .select("*")
      .ilike("customer_email", email)
      .limit(50);
    if (error) throw new Error(`orders select failed: ${error.message}`);
    return (data ?? []) as (OrderRow & { id: string })[];
  }

  async listShipments(orderId: string) {
    const { data, error } = await this.db
      .from("order_shipments")
      .select("*")
      .eq("order_id", orderId);
    if (error) throw new Error(`shipments select failed: ${error.message}`);
    return (data ?? []) as ShipmentRow[];
  }

  async listOrderItems(orderId: string) {
    const { data, error } = await this.db
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);
    if (error) throw new Error(`order_items select failed: ${error.message}`);
    return (data ?? []) as OrderItemRow[];
  }

  async transitionSubmission(
    orderId: string,
    from: OrderRow["submission_status"],
    to: OrderRow["submission_status"],
    fields: Partial<
      Pick<
        OrderRow,
        "apliiq_order_id" | "submission_last_error" | "submission_attempt_id" | "submission_started_at"
      >
    > = {},
    guardAttemptId?: string
  ) {
    let q = this.db
      .from("orders")
      .update({ submission_status: to, ...fields })
      .eq("id", orderId)
      .eq("submission_status", from);
    if (guardAttemptId !== undefined) q = q.eq("submission_attempt_id", guardAttemptId);
    const { data, error } = await q.select("id");
    if (error) throw new Error(`submission transition failed: ${error.message}`);
    return (data?.length ?? 0) > 0;
  }

  async setOrderStatus(orderId: string, status: OrderRow["status"]) {
    const { error } = await this.db.from("orders").update({ status }).eq("id", orderId);
    if (error) throw new Error(`order status update failed: ${error.message}`);
  }

  async addShipment(shipment: ShipmentRow) {
    const { error } = await this.db.from("order_shipments").insert(shipment);
    if (error) throw new Error(`shipment insert failed: ${error.message}`);
  }

  async setFulfillmentStatus(orderId: string, status: string) {
    const { error } = await this.db
      .from("orders")
      .update({ fulfillment_status: status })
      .eq("id", orderId);
    if (error) throw new Error(`fulfillment status update failed: ${error.message}`);
  }
}

// ── File implementation (local tests only) ───────────────────

interface FileState {
  events: Record<string, string>;
  orders: Record<string, OrderRow & { id: string }>;
  items: Record<string, OrderItemRow[]>;
  shipments: ShipmentRow[];
}

class FileStore implements OrdersStore {
  constructor(private dir: string) {
    fs.mkdirSync(dir, { recursive: true });
  }
  private file() {
    return path.join(this.dir, "orders-store.json");
  }
  private load(): FileState {
    try {
      return JSON.parse(fs.readFileSync(this.file(), "utf8"));
    } catch {
      return { events: {}, orders: {}, items: {}, shipments: [] };
    }
  }
  private save(s: FileState) {
    // Atomic replace so concurrent readers never see a torn file.
    const tmp = this.file() + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(s, null, 2));
    fs.renameSync(tmp, this.file());
  }
  // Cross-process mutex via exclusive lockfile creation (O_EXCL).
  private withLock<T>(fn: () => T): T {
    const lock = path.join(this.dir, ".lock");
    const start = Date.now();
    for (;;) {
      try {
        const fd = fs.openSync(lock, "wx");
        try {
          return fn();
        } finally {
          fs.closeSync(fd);
          fs.unlinkSync(lock);
        }
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
        if (Date.now() - start > 5000) throw new Error("file store lock timeout");
        const buf = new SharedArrayBuffer(4);
        Atomics.wait(new Int32Array(buf), 0, 0, 10); // ~10ms sleep
      }
    }
  }

  async hasEvent(eventId: string) {
    return Boolean(this.load().events[eventId]);
  }
  async recordEvent(eventId: string, eventType: string) {
    return this.withLock(() => {
      const s = this.load();
      if (s.events[eventId]) return false;
      s.events[eventId] = eventType;
      this.save(s);
      return true;
    });
  }
  async createOrder(order: OrderRow, items: OrderItemRow[]) {
    return this.withLock(() => {
      const s = this.load();
      const existing = Object.values(s.orders).find(
        (o) => o.stripe_session_id === order.stripe_session_id
      );
      if (existing) return { orderId: existing.id, created: false };
      // UUID ids to match production (order references derive from them).
      const id = crypto.randomUUID();
      s.orders[id] = { ...order, id };
      s.items[id] = items;
      this.save(s);
      return { orderId: id, created: true };
    });
  }
  async getOrderBySession(sessionId: string) {
    const s = this.load();
    return Object.values(s.orders).find((o) => o.stripe_session_id === sessionId) ?? null;
  }
  async getOrderByApliiqId(apliiqOrderId: string) {
    const s = this.load();
    return Object.values(s.orders).find((o) => o.apliiq_order_id === apliiqOrderId) ?? null;
  }
  async getOrderById(orderId: string) {
    const s = this.load();
    return s.orders[orderId] ?? null;
  }
  async listOrdersByEmail(email: string) {
    const s = this.load();
    return Object.values(s.orders).filter(
      (o) => (o.customer_email ?? "").toLowerCase() === email.toLowerCase()
    );
  }
  async listShipments(orderId: string) {
    return this.load().shipments.filter((sh) => sh.order_id === orderId);
  }
  async listOrderItems(orderId: string) {
    return this.load().items[orderId] ?? [];
  }
  async transitionSubmission(
    orderId: string,
    from: OrderRow["submission_status"],
    to: OrderRow["submission_status"],
    fields: Partial<
      Pick<
        OrderRow,
        "apliiq_order_id" | "submission_last_error" | "submission_attempt_id" | "submission_started_at"
      >
    > = {},
    guardAttemptId?: string
  ) {
    return this.withLock(() => {
      const s = this.load();
      const o = s.orders[orderId];
      if (!o || o.submission_status !== from) return false;
      if (guardAttemptId !== undefined && o.submission_attempt_id !== guardAttemptId) return false;
      Object.assign(o, { submission_status: to }, fields);
      this.save(s);
      return true;
    });
  }
  async setOrderStatus(orderId: string, status: OrderRow["status"]) {
    this.withLock(() => {
      const s = this.load();
      if (s.orders[orderId]) s.orders[orderId].status = status;
      this.save(s);
    });
  }
  async addShipment(shipment: ShipmentRow) {
    this.withLock(() => {
      const s = this.load();
      s.shipments.push(shipment);
      this.save(s);
    });
  }
  async setFulfillmentStatus(orderId: string, status: string) {
    this.withLock(() => {
      const s = this.load();
      if (s.orders[orderId]) s.orders[orderId].fulfillment_status = status;
      this.save(s);
    });
  }
}

/** Returns the configured store, or null when neither backend is available. */
export function getOrdersStore(): OrdersStore | null {
  const testDir = process.env.ORDERS_TEST_STORE;
  if (testDir) return new FileStore(testDir);
  const db = getSupabaseAdmin();
  if (db) return new SupabaseStore(db);
  return null;
}
