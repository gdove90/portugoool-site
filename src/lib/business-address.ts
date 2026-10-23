// Shared mailing address approved by the owner on 2026-10-12.
// Mailing correspondence only; return shipments follow the return policy.
export const MAILING_STREET = "PO Box 19";
export const MAILING_CITY_LINE = "Saunderstown, RI 02874";
export const MAILING_ADDRESS = `${MAILING_STREET}, ${MAILING_CITY_LINE}`;

// The entity named in legal lines (emails, terms, structured data). Brand copy
// says GOAL Athletics; this is only the legal identity.
//
// Verification record (2026-10-23): the live Stripe merchant account is
// registered as an individual under the public name "GOOOL ATHLETICS", with
// no company on file, and the Rhode Island business registry listed no
// active or inactive entity for "GOOOL", "GOAL ATHLETICS" or "Goal Brand
// Group" that day. This value is therefore unverified and unchanged. The Goal
// Brand Group LLC stays where it already appears (site footer, welcome email
// footer) on the owner's instruction of the same day; any change to either
// name is the owner's call.
export const LEGAL_NAME = "GOOOL Athletics LLC";
