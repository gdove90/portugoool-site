// Shared mailing address approved by the owner on 2026-10-12.
// Mailing correspondence only; return shipments follow the return policy.
export const MAILING_STREET = "PO Box 19";
export const MAILING_CITY_LINE = "Saunderstown, RI 02874";
export const MAILING_ADDRESS = `${MAILING_STREET}, ${MAILING_CITY_LINE}`;

// The entity named in legal lines (emails, terms, structured data). Brand copy
// says GOAL Athletics; this is only the legal identity.
//
// FLAGGED FOR CORRECTION (2026-10-23): this name is unverified. The live
// Stripe merchant account is registered as an individual under the public
// name "GOOOL ATHLETICS", with no company on file; the Rhode Island business
// registry lists no entity for "GOOOL", "GOAL ATHLETICS" or "Goal Brand
// Group"; and the owner's records call The Goal Brand Group LLC planned, not
// filed. Set this to the registered name once a filing exists, and never to
// a name that is not on record.
export const LEGAL_NAME = "GOOOL Athletics LLC";
