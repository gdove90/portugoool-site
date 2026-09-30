// Shared shell and footer for the welcome sequence (owner decision
// 2026-09-29). The footer mirrors the hello@goool.shop Gmail signature,
// same lockup, same order, same tagline, then the two lines the law
// requires on marketing mail: a physical mailing address and an
// unsubscribe link. Black background, white type, one accent colour.
//
// MAILING_STREET was taken from the business address on the owner's own
// Mailchimp account record (242 Earle Dr, North Kingstown, RI 02852) on
// 2026-09-29; the owner confirms it before deploy. The suite asserts it
// is not a placeholder.

export const MAILING_STREET = "242 Earle Dr";
export const MAILING_CITY_LINE = "North Kingstown, RI 02852";
export const BRAND_RED = "#C1121F";
export const SITE_URL = "https://goool.shop";
export const SUPPORT_EMAIL = "hello@goool.shop";
export const INSTAGRAM_HANDLE = "@gooolathletics";
export const LOCKUP_URL = `${SITE_URL}/brand/goool-athletics-lockup-white.png`;

const FONT = "Helvetica,Arial,sans-serif";

export function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function mailingAddressLine(): string {
  return `${MAILING_STREET}, ${MAILING_CITY_LINE}`;
}

/** Plain-text footer, one entry per line. */
export function footerText(unsubscribeUrl: string): string[] {
  return [
    "GOOOL Support Team",
    "GOOOL Athletics LLC",
    `${SUPPORT_EMAIL} · goool.shop · ${INSTAGRAM_HANDLE}`,
    "WEAR THE FEELING.",
    "",
    mailingAddressLine(),
    `Unsubscribe: ${unsubscribeUrl}`,
  ];
}

export function footerHtml(unsubscribeUrl: string): string {
  const small = `font:400 13px/1.6 ${FONT};color:#D6D6D6;`;
  return `<tr><td class="pad" style="padding:8px 28px 32px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="border-top:1px solid #393939;padding-top:22px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td valign="top" style="padding-right:16px;">
            <a href="${SITE_URL}" target="_blank" style="text-decoration:none;">
              <img src="${LOCKUP_URL}" width="120" height="45" alt="GOOOL Athletics" border="0" style="display:block;width:120px;height:auto;border:0;color:#FFFFFF;font:700 16px/1.3 ${FONT};">
            </a>
          </td>
          <td valign="top">
            <div style="font:700 15px/1.45 ${FONT};color:#FFFFFF;">GOOOL Support Team</div>
            <div style="${small}">GOOOL Athletics LLC</div>
            <div style="margin-top:6px;${small}">
              <a href="mailto:${SUPPORT_EMAIL}" style="color:#FFFFFF;text-decoration:underline;">${SUPPORT_EMAIL}</a>
              &nbsp;·&nbsp;<a href="${SITE_URL}" target="_blank" style="color:#FFFFFF;text-decoration:underline;">goool.shop</a>
              &nbsp;·&nbsp;<a href="https://instagram.com/gooolathletics" target="_blank" style="color:#FFFFFF;text-decoration:underline;">${INSTAGRAM_HANDLE}</a>
            </div>
            <div style="margin-top:8px;font:700 12px/1.5 ${FONT};letter-spacing:1.5px;color:#FFFFFF;">WEAR THE FEELING.</div>
          </td>
        </tr>
      </table>
      <div style="margin-top:18px;${small}">${escapeHtml(mailingAddressLine())}</div>
      <div style="margin-top:6px;${small}"><a href="${unsubscribeUrl}" target="_blank" style="color:#FFFFFF;text-decoration:underline;">Unsubscribe</a></div>
    </td></tr>
  </table>
</td></tr>`;
}

export function buttonHtml(label: string, href: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
  <tr><td align="center" bgcolor="${BRAND_RED}" style="background-color:${BRAND_RED};border-radius:999px;">
    <a href="${href}" target="_blank" style="display:block;padding:17px 20px;font:700 16px/1.3 ${FONT};color:#FFFFFF;background-color:${BRAND_RED};text-decoration:none;border-radius:999px;">${escapeHtml(label)}</a>
  </td></tr>
</table>`;
}

export function paragraphHtml(text: string, opts: { strong?: boolean } = {}): string {
  const weight = opts.strong ? 700 : 400;
  const color = opts.strong ? "#FFFFFF" : "#E6E6E6";
  return `<p style="margin:0 0 18px;font:${weight} 16px/1.6 ${FONT};color:${color};">${text}</p>`;
}

export function codeBlockHtml(code: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 22px;border:1px solid #393939;">
  <tr><td align="center" style="padding:18px 12px;font:700 26px/1.3 'Courier New',monospace;letter-spacing:1px;color:#FFFFFF;">${escapeHtml(code)}</td></tr>
</table>`;
}

export interface ShellInput {
  title: string;
  preheader: string;
  bodyHtml: string;
  unsubscribeUrl: string;
}

/** Full HTML document: lockup, red rule, body, signature footer. */
export function emailShell(input: ShellInput): string {
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${escapeHtml(input.title)}</title>
<style>
  :root { color-scheme:dark; supported-color-schemes:dark; }
  a[x-apple-data-detectors] { color:inherit!important; text-decoration:none!important; }
  @media only screen and (max-width:380px) { .pad { padding-left:20px!important; padding-right:20px!important; } }
</style>
</head>
<body bgcolor="#090909" style="margin:0;padding:0;background-color:#090909;color:#FFFFFF;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(input.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#090909" style="background-color:#090909;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#090909" style="max-width:520px;background-color:#090909;color:#FFFFFF;">
      <tr><td align="center" class="pad" style="padding:32px 28px 20px;">
        <a href="${SITE_URL}" target="_blank" style="color:#FFFFFF;text-decoration:none;">
          <img src="${LOCKUP_URL}" width="218" height="82" alt="GOOOL Athletics" border="0" style="display:block;width:218px;max-width:100%;height:auto;border:0;color:#FFFFFF;font:700 24px/1.3 ${FONT};">
        </a>
      </td></tr>
      <tr><td class="pad" style="padding:0 28px;"><div style="height:3px;width:56px;background-color:${BRAND_RED};"></div></td></tr>
      <tr><td class="pad" style="padding:26px 28px 8px;">
${input.bodyHtml}
      </td></tr>
${footerHtml(input.unsubscribeUrl)}
    </table>
  </td></tr>
</table>
</body></html>`;
}
