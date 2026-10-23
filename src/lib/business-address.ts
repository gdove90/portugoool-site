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
export const LEGAL_NAME = "The Goal Brand Group LLC";
