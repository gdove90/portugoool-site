// Explicit approved presentation exceptions for the locked business-file comparisons.
module.exports = function emailBrandingBaseline(file, content) {
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
  return content;
};
