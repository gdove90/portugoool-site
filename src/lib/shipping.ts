import { formatPrice } from "./format";

// The shipping rule, in one place (owner decision 2026-09-29).
//
// One flat rate per order and free shipping at the threshold. The Stripe
// checkout session is built from these numbers server-side (the only
// place money is decided) and the cart page reads the same two constants
// so what it shows is what Stripe charges. There is deliberately no
// per-item rate, no country table and no pre-created Stripe shipping
// rate object: the previous fixed $9.50 rate (STRIPE_SHIPPING_RATE_ID)
// is no longer used.
export const SHIPPING_FLAT_CENTS = 695;
export const FREE_SHIPPING_THRESHOLD_CENTS = 7000;

export const SHIPPING_PRICE_COPY = `${formatPrice(SHIPPING_FLAT_CENTS)} per order. Free shipping from ${formatPrice(FREE_SHIPPING_THRESHOLD_CENTS)} after discounts.`;

/** Shipping charged for the merchandise subtotal AFTER discounts. */
export function shippingCentsFor(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;
}
