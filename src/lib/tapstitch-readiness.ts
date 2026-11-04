import { submissionEnvironmentAllowed } from "./apliiq";
import { emailEnabled } from "./email";
import { getSupabaseAdmin } from "./supabase";

// Read-only checkout guard: a paid manual order needs the production
// execution context, owner notification transport and durable task ledger.
// No credentials, flag values, customer rows or provider calls are exposed.
export async function tapstitchFulfillmentReady(): Promise<boolean> {
  if (!submissionEnvironmentAllowed(true).allowed || !emailEnabled()) return false;
  const db = getSupabaseAdmin();
  if (!db) return false;
  try {
    const zero = "00000000-0000-0000-0000-000000000000";
    const [queue, orders, items, catalog] = await Promise.all([
      db.from("email_deliveries").select("key,kind,message,livemode,order_id,status")
        .eq("key", "readiness/nonexistent-tapstitch-task").limit(1),
      db.from("orders").select("id,submission_status,fulfillment_status").eq("id", zero).limit(1),
      db.from("order_items").select("id,order_id,apliiq_product_id,apliiq_sku").eq("order_id", zero).limit(1),
      // Existing rows prove the deployed catalog admits the Tapstitch
      // supplier and pants category introduced by migration 0045.
      db.from("products").select("id,supplier_type,product_category").in("id", [
        "80000000-0000-4000-8000-000000000023",
        "80000000-0000-4000-8000-000000000024",
      ]).limit(2),
    ]);
    return ![queue, orders, items, catalog].some(r => r.error)
      && Boolean(catalog.data?.some(p => p.supplier_type === "tapstitch"))
      && Boolean(catalog.data?.some(p => p.product_category === "pants"));
  } catch {
    return false;
  }
}
