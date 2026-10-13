// Static checks for GOAL Athletics customer-email rebrand.
// Intentionally no network calls, live orders, email sends, or configuration changes.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const read = (p) => fs.readFileSync(path.join(__dirname, "..", p), "utf8");
const identity = read("src/lib/email-identity.ts");
assert.match(identity, /hello@goalathletics\.shop/);
assert.match(identity, /support@goalathletics\.shop/);
assert.match(identity, /https:\/\/goalathletics\.shop/);
assert.match(identity, /goal-athletics-email-lockup-white\.png/);
const email = read("src/lib/email.ts");
assert.match(email, /from: emailFrom\(\)/);
assert.match(email, /reply_to: SUPPORT_EMAIL/);
assert.doesNotMatch(email, /reply_to:.*hello@/);
const templates = [
  "src/lib/emails/footer.ts",
  "src/lib/emails/order-confirmation.ts",
  "src/lib/emails/shipment-notification.ts",
  "src/lib/emails/order-delay-notice.ts",
];
for (const file of templates) {
  const source = read(file);
  assert.match(source, /email-identity/, `${file} must use the shared identity`);
  assert.doesNotMatch(source, /goool-athletics-lockup-white\.png/, `${file} must use the new logo`);
  assert.doesNotMatch(source, /mailto:hello@goool\.shop/, `${file} must not route support to the retired address`);
}
assert.match(read("src/app/contact/page.tsx"), /support@goalathletics\.shop/);
assert.doesNotMatch(read("src/app/contact/page.tsx"), /mailto:hello@/);
assert.match(read("src/lib/emails/order-confirmation.ts"), /GOOOL-\$\{orderId/, "Historic references are immutable");
assert.match(read("src/lib/business-address.ts"), /PO Box 19/);
assert.match(read("src/lib/business-address.ts"), /Saunderstown, RI 02874/);
assert.match(read("src/lib/signups.ts"), /https:\/\/goalathletics\.shop\/unsubscribe/);
const png = fs.readFileSync(path.join(__dirname, "..", "public/brand/goal-athletics-email-lockup-white.png"));
assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
assert.equal(png.readUInt32BE(16), 2254);
assert.equal(png.readUInt32BE(20), 544);
const {execFileSync}=require('node:child_process');
const forbidden=['goalathletics','com'].join('.');
let matches='';try {matches=execFileSync('git',['grep','--cached','-n','-i','-I','--fixed-strings',forbidden,'--','.'],{encoding:'utf8'});}catch(e){if(e.status!==1)throw e;}
assert.equal(matches,'','Unowned domain must never appear in the active tracked tree');
console.log("GOAL email rebrand: static identity, routing, immutable refs, mailing address and PNG verified.");
