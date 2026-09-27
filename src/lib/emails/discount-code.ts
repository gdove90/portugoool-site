// Approved discount email design, September 27, 2026.
// Codes stay selectable text; email clients do not support JavaScript copy buttons.
function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function buildDiscountCodeEmail(code: string): { subject: string; html: string; text: string } {
  return {
    subject: "Your GOOOL first-order code",
    text: [
      "GOOOL ATHLETICS", "", "Welcome to GOOOL", "Your first order. 20% off.",
      "Your first-order code is ready. Find your favorites and make them yours.", "",
      "Your code: " + code, "Enter this code at checkout.",
      "Shop the collection: https://goool.shop/shop", "",
      "20% off your first order. Single use. Valid for 30 days from issue.", "",
      "Customer Service", "Questions or need support? Contact us at hello@goool.shop.", "",
      "Wear the Feeling.", "GOOOL ATHLETICS LLC", "https://goool.shop",
    ].join("\n"),
    html: `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>Your GOOOL first-order code</title>
<style>
  :root { color-scheme:dark; supported-color-schemes:dark; }
  a[x-apple-data-detectors] { color:inherit!important; text-decoration:none!important; }
  @media only screen and (max-width:380px) { .receipt-padding { padding-left:22px!important; padding-right:22px!important; } }
</style>
</head>
<body bgcolor="#090909" style="margin:0;padding:0;background-color:#090909;color:#FFFFFF;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your 20% first-order code is ready. Wear the Feeling.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#090909" style="background-color:#090909;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#090909" style="max-width:520px;background-color:#090909;color:#FFFFFF;">
      <tr><td align="center" class="receipt-padding" style="padding:32px 28px 24px;">
        <a href="https://goool.shop" target="_blank" style="color:#FFFFFF;text-decoration:none;">
          <img src="https://goool.shop/brand/goool-athletics-lockup-white.png" width="218" height="82" alt="GOOOL Athletics" border="0" style="display:block;width:218px;max-width:100%;height:auto;border:0;color:#FFFFFF;font:700 24px/1.3 Helvetica,Arial,sans-serif;">
        </a>
      </td></tr>
      <tr><td class="receipt-padding" style="padding:0 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="border-top:1px solid #393939;padding:24px 0 25px;">
 <div style="font:400 11px/1.5 Helvetica,Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#D6D6D6;">Welcome to GOOOL</div>
 <h1 style="margin:12px 0 15px;font:700 32px/1.12 Helvetica,Arial,sans-serif;letter-spacing:-1px;color:#FFFFFF;">Your first order.<br>20% off.</h1>
 <div style="font:400 15px/1.65 Helvetica,Arial,sans-serif;color:#D6D6D6;">Your first-order code is ready.<br>Find your favorites and make them yours.</div>
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:25px;border:1px solid #393939;"><tr><td align="center" style="padding:21px 12px;">
  <div style="font:400 11px/1.5 Helvetica,Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#D6D6D6;">Your code</div>
  <div style="margin-top:10px;font:700 25px/1.3 'Courier New',monospace;letter-spacing:1px;color:#FFFFFF;">${escapeHtml(code)}</div>
 </td></tr></table>
 <div style="margin-top:13px;text-align:center;font:400 13px/1.6 Helvetica,Arial,sans-serif;color:#D6D6D6;">Enter this code at checkout.</div>
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;"><tr><td align="center" bgcolor="#FFFFFF" style="background-color:#FFFFFF;">
  <a href="https://goool.shop/shop" target="_blank" style="display:block;padding:15px 16px;font:700 14px/1.4 Helvetica,Arial,sans-serif;color:#090909;background-color:#FFFFFF;text-decoration:none;">Shop the collection</a>
 </td></tr></table>
 <div style="margin-top:15px;text-align:center;font:400 12px/1.65 Helvetica,Arial,sans-serif;color:#D6D6D6;">20% off your first order. Single use.<br>Valid for 30 days from issue.</div>
</td></tr><tr><td align="center" style="border-top:1px solid #393939;padding:20px 0 18px;">
            <div style="font:700 16px/1.5 Helvetica,Arial,sans-serif;color:#FFFFFF;">Customer Service</div>
            <div style="margin-top:9px;font:400 13px/1.65 Helvetica,Arial,sans-serif;color:#D6D6D6;">Questions or need support?<br>Contact us at</div>
            <a href="mailto:hello@goool.shop" style="display:inline-block;padding:9px 0;font:700 16px/1.65 Helvetica,Arial,sans-serif;color:#FFFFFF;text-decoration:underline;">hello@goool.shop</a>
          </td></tr>
          <tr><td align="center" style="border-top:1px solid #393939;padding:18px 0 24px;">
            <div style="font:700 19px/1.35 Helvetica,Arial,sans-serif;color:#FFFFFF;">Wear the Feeling.</div>
            <div style="margin-top:13px;font:400 11px/1.65 Helvetica,Arial,sans-serif;letter-spacing:.6px;color:#D6D6D6;">GOOOL ATHLETICS LLC · <a href="https://goool.shop" target="_blank" style="color:#FFFFFF;text-decoration:underline;">goool.shop</a></div>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
  };
}
