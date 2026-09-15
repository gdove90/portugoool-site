import { NextRequest, NextResponse } from "next/server";
import { getOrdersStore } from "@/lib/orders-store";
import { orderNumber } from "@/lib/fulfillment-submit";

// ─────────────────────────────────────────────────────────────
// Real order-status lookup for /track-order. Privacy model: the
// customer must present BOTH the order reference (GOOOL-XXXXXXXX,
// shown on the confirmation page and receipts) AND the email used at
// checkout. References derive from order UUIDs, so they are not
// guessable or sequential, and a reference alone reveals nothing.
// Responses are identical for "no such order" and "email mismatch".
// ─────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

const CUSTOMER_STATUS: Record<string, string> = {
  unfulfilled: "Payment received. Your order is being prepared.",
  submitted: "In production.",
  in_production: "In production.",
  shipped: "Shipped.",
  delivered: "Delivered.",
  cancelled: "Cancelled.",
};

export async function POST(req: NextRequest) {
  let body: { reference?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const reference = (body.reference ?? "").trim().toUpperCase();
  const email = (body.email ?? "").trim();
  if (!/^GOOOL-[0-9A-F]{8}$/.test(reference) || !email.includes("@")) {
    return NextResponse.json(
      { error: "Enter your order reference (GOOOL-XXXXXXXX) and the email you ordered with." },
      { status: 400 }
    );
  }

  const store = getOrdersStore();
  if (!store) {
    return NextResponse.json(
      { error: "Order lookup isn't available right now. Email hello@goool.shop and we'll check for you." },
      { status: 503 }
    );
  }

  try {
    const orders = await store.listOrdersByEmail(email);
    const order = orders.find((o) => orderNumber(o.id) === reference);
    if (!order || order.status === "pending") {
      // Deliberately indistinguishable from a wrong email.
      return NextResponse.json(
        { error: "No order matches that reference and email." },
        { status: 404 }
      );
    }

    const shipments = await store.listShipments(order.id);
    return NextResponse.json({
      reference,
      status:
        order.status === "refunded"
          ? "Refunded."
          : order.status === "cancelled"
            ? "Cancelled."
            : CUSTOMER_STATUS[order.fulfillment_status] ?? "Payment received.",
      shipments: shipments.map((s) => ({
        carrier: s.tracking_company,
        trackingNumbers: s.tracking_numbers,
        trackingUrls: s.tracking_urls,
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Order lookup isn't available right now. Email hello@goool.shop and we'll check for you." },
      { status: 503 }
    );
  }
}
