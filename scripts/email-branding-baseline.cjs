// Explicit approved presentation exceptions for the locked business-file comparisons.
module.exports = function emailBrandingBaseline(file, content) {
  if (file === 'src/lib/signups.ts') return content.replace('https://goool.shop/unsubscribe/', 'https://goalathletics.shop/unsubscribe/');
  if (file === 'src/lib/email.ts') return 'import { EMAIL_FROM, SUPPORT_EMAIL } from "./email-identity";\n' + content.replace('Goool Athletics <hello@goool.shop>', 'GOAL Athletics <hello@goalathletics.shop>').replace('reply_to: msg.replyTo ?? "hello@goool.shop"', 'reply_to: SUPPORT_EMAIL').replace('return "GOAL Athletics <hello@goalathletics.shop>";', 'return EMAIL_FROM;');
  if (file === 'src/lib/email-delivery.ts') return content.replaceAll('hello@goool.shop', 'support@goalathletics.shop').replace('export async function deliverEmail(key: string): Promise<string> {', 'export async function deliverEmail(key: string): Promise<string> {\n  // Preserve any existing follow-up rows, but never claim or send them.\n  if (/^welcome\\/(live|test)\\/[23]\\//.test(key)) return "promotional_followups_disabled";');
  if (file === 'src/lib/welcome.ts') return content.slice(0, content.indexOf('export async function runWelcomePass(')) + '// Retain the callable interface for existing workers; promotional follow-ups are retired.\nexport async function runWelcomePass(_livemode: boolean, _now: number = Date.now()): Promise<Record<string, number>> {\n  return { promotional_followups_disabled: 1 };\n}\n';
  if (!file.startsWith('src/lib/emails/')) return content;
  const name = file.split('/').pop();
  if (name === 'footer.ts') {
    content = content.replace('export const SITE_URL = "https://goool.shop";', 'export const SITE_URL = "https://goalathletics.shop";')
      .replace('`${SITE_URL}/brand/goool-athletics-lockup-white.png`','`${SITE_URL}/brand/goal-athletics-email-wordmark-white.png`')
      .replaceAll('GOOOL Support Team','GOAL Athletics Support Team').replaceAll('alt="GOOOL Athletics"','alt="GOAL Athletics"')
      .replace('`${SUPPORT_EMAIL} · goool.shop · ${INSTAGRAM_HANDLE}`','`${SUPPORT_EMAIL} · goalathletics.shop`')
      .replaceAll('>goool.shop</a>','>goalathletics.shop</a>').replace('>${INSTAGRAM_HANDLE}</a>','>Instagram</a>');
  } else if (name === 'welcome-2.ts') {
    content = content.replace('Three colors: Charcoal, Grey, Navy. GA on the chest, GOOOL ATHLETICS on the back.', 'Three colors: Charcoal, Grey, Navy.')
      .split('\n').filter(line=>!line.includes('<img src="${input.imageUrl}"')).join('\n');
  } else if (['order-confirmation.ts','order-delay-notice.ts','shipment-notification.ts'].includes(name)) {
    content = content.replaceAll('https://goool.shop','https://goalathletics.shop')
      .replaceAll('/brand/goool-athletics-lockup-white.png','/brand/goal-athletics-email-wordmark-white.png')
      .replaceAll('"GOOOL ATHLETICS",','"GOAL ATHLETICS",').replaceAll('alt="GOOOL Athletics"','alt="GOAL Athletics"')
      .replace('Thank you for choosing GOOOL Athletics.','Thank you for choosing GOAL Athletics.')
      .replace('Your GOOOL order ${ref}','Your GOAL Athletics order ${ref}')
      .replaceAll('"GOOOL Athletics",','"GOAL Athletics",').replaceAll('>GOOOL Athletics</div>','>GOAL Athletics</div>')
      .replaceAll('at goool.shop/track-order','at goalathletics.shop/track-order').replaceAll('>goool.shop</a>','>goalathletics.shop</a>')
      .replaceAll('GOOOL ATHLETICS LLC · goool.shop','GOOOL ATHLETICS LLC · goalathletics.shop');
  }
  if (['footer.ts','order-confirmation.ts','order-delay-notice.ts','shipment-notification.ts'].includes(name))
    content = content.replaceAll('width="218" height="82"','width="218" height="68"').replaceAll('width="120" height="45"','width="120" height="38"');
  if (name === 'welcome-1.ts') content = content.split('\n').filter(line => !['Tees $38.', '`Shop the drop:', 'buttonHtml("Shop the drop",'].some(v => line.includes(v))).join('\n');
  if (['footer.ts','order-confirmation.ts','order-delay-notice.ts','shipment-notification.ts'].includes(name)) content = content
    .replace('<body bgcolor="#090909" style="margin:0;padding:0;background-color:#090909;color:#FFFFFF;">','<body bgcolor="#FFFFFF" style="margin:0;padding:24px 16px;background-color:#FFFFFF;color:#FFFFFF;">')
    .replace('border="0" bgcolor="#090909" style="background-color:#090909;">','border="0" bgcolor="#FFFFFF" style="background-color:#FFFFFF;">')
    .replace('<body bgcolor="${INK}" style="margin:0;padding:0;background-color:${INK};color:${PAPER};">','<body bgcolor="#FFFFFF" style="margin:0;padding:24px 16px;background-color:#FFFFFF;color:${PAPER};">')
    .replace('border="0" bgcolor="${INK}" style="background-color:${INK};">','border="0" bgcolor="#FFFFFF" style="background-color:#FFFFFF;">')
    .replace('<body style="margin:0;background:#090909;color:#fff;font-family:Arial,Helvetica,sans-serif">','<body style="margin:0;padding:24px 16px;background:#fff;color:#fff;font-family:Arial,Helvetica,sans-serif">')
    .replace('cellpadding="0" style="background:#090909"><tr>','cellpadding="0" style="background:#fff"><tr>')
    .replace('style="max-width:600px"','style="max-width:600px;background:#090909"');
  content = content.replaceAll('hello@goool.shop', 'support@goalathletics.shop');
  if (name === 'fulfillment-alert.ts') content = content.replaceAll('email the customer from support@goalathletics.shop.', 'send from hello@goalathletics.shop with replies to support@goalathletics.shop.');
  if (name === 'footer.ts') content = 'import { SITE_URL, SUPPORT_EMAIL, LOCKUP_URL } from "../email-identity";\nexport { SITE_URL, SUPPORT_EMAIL, LOCKUP_URL };\n' + content
    .replace('export const SITE_URL = "https://goalathletics.shop";\n','').replace('export const SUPPORT_EMAIL = "support@goalathletics.shop";\n','').replace('export const LOCKUP_URL = `${SITE_URL}/brand/goal-athletics-email-wordmark-white.png`;\n','').replaceAll('height="68"','height="60"').replaceAll('height="38"','height="33"');
  if (['order-confirmation.ts','order-delay-notice.ts','shipment-notification.ts'].includes(name)) content = 'import { LOCKUP_URL } from "../email-identity";\n' + content.replaceAll('${esc(site)}/brand/goal-athletics-email-wordmark-white.png','${LOCKUP_URL}').replaceAll('https://goalathletics.shop/brand/goal-athletics-email-wordmark-white.png','${LOCKUP_URL}').replaceAll('height="68"','height="60"');
  if (name === 'order-delay-notice.ts') content = content.replaceAll('>goool.shop/track-order</a>','>goalathletics.shop/track-order</a>').replaceAll('reply to this email and we will refund you in full.','contact support@goalathletics.shop and we will refund you in full.');
  return content;
};
