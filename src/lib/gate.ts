// The password gate's cookie, shared by middleware (edge runtime) and
// /api/preview (Node runtime). crypto.subtle exists in both, which is why
// this uses it rather than node:crypto.
//
// WHY THE COOKIE IS NOT "goool_preview" (2026-09-23). The curtain that
// stood here before this gate set goool_preview = PREVIEW_KEY for anyone
// who tapped Enter: it validated nothing. The first version of this gate
// checked for that same cookie and value, so every visitor who had ever
// clicked through the old splash, within its 30-day lifetime, walked
// straight past the new password and could reach checkout. Measured on the
// live site with that cookie: /, /shop, /cart and product pages all 200.
//
// Two changes close it:
//   1. A new cookie name. Nothing ever issued under the old name counts.
//   2. The value is a SHA-256 of a versioned string, not the password
//      itself, so the cookie no longer carries the password in plain text
//      on every request, and a leaked cookie does not reveal it.
//
// GATE_VERSION doubles as a kill switch. Bump it and redeploy, and every
// cookie ever issued stops working at once: everyone, the owner included,
// is back at the gate and has to enter the password again.
export const GATE_COOKIE = "goool_gate";
export const LEGACY_COOKIE = "goool_preview";
const GATE_VERSION = "v2";

export async function gateToken(secret: string): Promise<string> {
  // Lower-cased to match the case-insensitive password check, so the token
  // does not depend on which capitalisation was typed.
  const data = new TextEncoder().encode(
    `goool-gate-${GATE_VERSION}:${secret.trim().toLowerCase()}`
  );
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
