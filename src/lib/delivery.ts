import { resolveApliiqSku } from "./fulfillment";
import type { Product, Size } from "./types";

// Supplier mapping is the route authority. Public supplier averages are not
// verified estimates for our decorated designs, label stock or chosen service.
// Evidence and exact missing dependencies: docs/growth/bf2026-review.md.
export const DELIVERY_OVERVIEW = "Delivery depends on the item and destination. Production happens before shipping, and transit starts after dispatch. Check the item's Shipping & Returns details before ordering. Delivery dates are estimates, not guarantees.";
export const IMPORT_DUTY_COPY = "For deliveries outside the US, your country may charge import duty or VAT on arrival. These charges are set by your customs authority and paid by the recipient.";
export const DELIVERY_UNCONFIRMED = "We cannot confirm a production or transit estimate for this item yet. Contact support before ordering if you need it by a particular date.";

export function deliveryForVariant(productId: string, color: string, size: Size) {
  const mapping = resolveApliiqSku(productId, color, size);
  return {
    supplier: mapping?.supplier ?? "unverified",
    // Apliiq's US factories are documented. Tapstitch offers both US and
    // international routes; a saved design alone establishes neither origin.
    origin: mapping?.supplier === "apliiq" ? "Ships from the United States." : "Dispatch location for this item is not yet confirmed.",
    timing: DELIVERY_UNCONFIRMED,
  };
}

export function productDelivery(product: Product, color = product.color) {
  return deliveryForVariant(product.id, color, product.sizes[0]);
}

export function cartDelivery(items: { productId: string; color: string; size: Size }[]): string {
  const origins = new Set(items.map(item => deliveryForVariant(item.productId, item.color, item.size).origin));
  return `${[...origins].join(" ")} ${DELIVERY_UNCONFIRMED}`;
}
