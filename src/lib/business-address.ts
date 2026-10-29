// Shared mailing address approved by the owner on 2026-10-12.
// Mailing correspondence only; return shipments follow the return policy.
export const MAILING_STREET = "PO Box 19";
export const MAILING_CITY_LINE = "Saunderstown, RI 02874";
export const MAILING_ADDRESS = `${MAILING_STREET}, ${MAILING_CITY_LINE}`;

// The company named in legal lines (emails, terms, structured data). Brand
// copy says GOAL Athletics; this is the company behind it.
//
// Owner decision, final and locked (2026-10-23): the company name is
// The Goal Brand Group LLC. Do not rename it, shorten it, drop "LLC", or
// propose alternatives. Its Rhode Island registration is a separate
// administrative task the owner is completing; as of 2026-10-23 the registry
// showed no filing yet and the live Stripe merchant account was still an
// individual account under the public name "GOOOL ATHLETICS". Where a legal
// text must distinguish pending registration from completed formation, say
// so; do not change the name because of it.
//
// Owner clarification 2026-10-28 (morning): the company is the approved FUTURE
// parent of GOAL Athletics and was not legally formed yet, so the public site
// footer and the Organization structured data stopped presenting it (they say
// GOAL Athletics).
//
// Owner decision 2026-10-28 (evening): use The Goal Brand Group LLC as the
// legal/operator entity everywhere a legal or operator name is required
// (terms, order emails, unsubscribe, success page, gate, intake agreements:
// story WYG-2026-10-28-live-4, Match Highlights SYG-2026-10-28-live-2, Kit Wear
// KIT-2026-10-28-2). GOAL Athletics stays the customer-facing brand. The
// owner's personal name is never used publicly.
export const LEGAL_NAME = "The Goal Brand Group LLC";
