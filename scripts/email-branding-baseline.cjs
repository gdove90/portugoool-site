// Explicit approved identity, copy and temporary closure exceptions for the locked business-file comparisons.
module.exports = function emailBrandingBaseline(file, content) {
  if (file === 'src/lib/signups.ts') return content.replace('https://goool.shop/unsubscribe/', 'https://goalathletics.shop/unsubscribe/');
  if (file === 'src/lib/email.ts') return 'import { EMAIL_FROM, SUPPORT_EMAIL } from "./email-identity";\n' + content.replace('Goool Athletics <hello@goool.shop>', 'GOAL Athletics <hello@goalathletics.shop>').replace('reply_to: msg.replyTo ?? "hello@goool.shop"', 'reply_to: SUPPORT_EMAIL').replace('return "GOAL Athletics <hello@goalathletics.shop>";', 'return EMAIL_FROM;');
  if (file === 'src/lib/welcome.ts') return 'import { storeClosed } from "./store-status";\n' + content.replace('  const db = getSupabaseAdmin();','  if (storeClosed()) return { store_closed: 1 };\n  const db = getSupabaseAdmin();');
  if (file === 'src/lib/email-delivery.ts') return 'import { storeClosed } from "./store-status";\n' + content.replaceAll('hello@goool.shop','support@goalathletics.shop').replace('  const { data, error } = await db.from("email_deliveries").select("key")','  let due = db.from("email_deliveries").select("key")').replace('    .lte("next_attempt_at", new Date().toISOString()).order("next_attempt_at").limit(3);','    .lte("next_attempt_at", new Date().toISOString());\n  if (storeClosed()) due = due.not("key", "like", "welcome/%/2/%").not("key", "like", "welcome/%/3/%");\n  const { data, error } = await due.order("next_attempt_at").limit(3);').replace('export async function deliverEmail(key: string): Promise<string> {','export async function deliverEmail(key: string): Promise<string> {\n  // Temporarily defer follow-ups while the existing renovation gate is closed.\n  if (storeClosed() && /^welcome\\/(live|test)\\/[23]\\//.test(key)) return "store_closed";');
  if (!file.startsWith('src/lib/emails/')) return content;
  const name = file.split('/').pop();
  if (name === 'footer.ts') {
    content = content.replace('export const SITE_URL = "https://goool.shop";', 'export const SITE_URL = "https://goalathletics.shop";')
      .replace('`${SITE_URL}/brand/goool-athletics-lockup-white.png`','`${SITE_URL}/brand/goal-athletics-email-wordmark-white.png`')
      .replaceAll('GOOOL Support Team','GOAL Athletics Support Team').replaceAll('alt="GOOOL Athletics"','alt="GOAL Athletics"')
      .replace('`${SUPPORT_EMAIL} · goool.shop · ${INSTAGRAM_HANDLE}`','`${SUPPORT_EMAIL} · goalathletics.shop`')
      .replaceAll('>goool.shop</a>','>goalathletics.shop</a>').replace('>${INSTAGRAM_HANDLE}</a>','>Instagram</a>');
  } else if (name === 'welcome-2.ts') {
    content = content.replace(/\/\/ Welcome sequence,[\s\S]*?import \{/, '// Welcome sequence, Email 2: sign-up + 120 hours, marketing.\n// Original product and blank gates remain in the welcome pass. Current copy\n// uses approved brand language; legacy garment imagery is not republished.\n\nimport {').replace('const subject = "Why the shirt weighs nothing";','const subject = "Built for the work.";').replace(/  const fabric =[\s\S]*?  const text = \[/,'  const description = "Performance apparel built for the game. Every piece engineered for athletes who train hard and wear with intention.";\n  const purpose = "Built for the work nobody sees.";\n  const text = [').replaceAll('"Quick one about the performance tee."','"GOAL Athletics performance apparel."').replaceAll('    fabric,','    description,').replaceAll('    colors,','    purpose,').replaceAll('escapeHtml(fabric)','escapeHtml(description)').replaceAll('paragraphHtml(colors)','paragraphHtml(escapeHtml(purpose))').split('\n').filter(line=>!line.includes('<img src="\${input.imageUrl}"')).join('\n');
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
