export interface CheckoutQuote {
  code: string;
  discountCents: number;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  context: string;
}

/** Identity includes variants/customization, even when their price is equal. */
export function quoteContext(items: unknown, email: string): string {
  return JSON.stringify([items, email.trim().toLowerCase()]);
}

/** Discard late responses after edits, removal, a newer request or unmount. */
export function createQuoteRequests() {
  let version = 0;
  return {
    begin() { return ++version; },
    invalidate() { version++; },
    current(request: number) { return request === version; },
  };
}
