const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const parse5 = require('parse5');
const source = fs.readFileSync('src/v84/reference-experience.js', 'utf8');
const compiled = ts.transpileModule(source, {compilerOptions:{allowJs:true, module:ts.ModuleKind.CommonJS}}).outputText;
const context = {exports:{}, AbortController, require: id => id.includes('number-art') ? {originalNumberMarkup:()=>'', drawOriginalNumbers:()=>{}} : {sendIntake:()=>{throw Error('No submission allowed');}}};
vm.runInNewContext(compiled, context);
const experience = context.exports.referenceExperience();
function text(node) {
  if (['script', 'style'].includes(node.tagName)) return '';
  return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join(' ');
}
const LLC = 'The Goal Brand Group LLC';
const PARTY = 'This agreement is between ' + LLC + ', the company behind GOAL Athletics (the Company)';
const validator = fs.readFileSync('src/lib/intake/validation.mjs', 'utf8');
for (const route of ['home','men','women','about','references','story','kit','match']) {
  const html = experience.markup(route);
  const visible = text(parse5.parse(html));
  // Owner decision 2026-10-28: no legacy GOOOL spelling anywhere in rendered copy, legal party lines included.
  assert(!/goool/i.test(visible), route + ': remaining legacy branding ' + visible.match(/.{0,50}goool.{0,70}/gi));
  console.log('PASS visible presentation copy: ' + route);
}
const VERSIONS = { 'participation-agreement.html': 'SYG-2026-10-28-live-2', 'story-participation-agreement.html': 'WYG-2026-10-28-live-4' };
for (const name of Object.keys(VERSIONS)) {
  const html = fs.readFileSync('public/'+name,'utf8');
  // The operator named in every active agreement is the legal entity, never a bare brand or legacy name.
  assert(html.includes(PARTY), name + ' names the operator');
  assert(!/GOOOL|an independent athletic apparel brand based in Rhode Island \(the Company\)/.test(html), name + ' carries no superseded party line');
  for (const content of [html, require('../src/lib/intake/agreements.json')[name], validator, source]) {
    assert(content.includes(VERSIONS[name]), name + ': public agreement, snapshot, validator and controller share ' + VERSIONS[name]);
  }
  if (name === 'story-participation-agreement.html') assert.match(html, /href="\/whats-your-goal"/, 'story agreement links back to the canonical route');
  assert.doesNotMatch(html, /href="\/whats-your-goool"/);
  assert(!/goool/i.test(text(parse5.parse(html))), name);
  console.log('PASS agreement party, version and navigation: ' + name);
}
assert(validator.includes("version:'KIT-2026-10-28-2'") && validator.includes('I agree that ' + LLC + ' may store and review this request'), 'Kit Wear consent names the operator');
assert(!/GOOOL Athletics LLC/.test(validator + source), 'no legacy operator name in validator or controller');
assert(!/goool/i.test(fs.readFileSync('src/app/terms/page.tsx', 'utf8')), 'Terms page carries no legacy spelling');
console.log('PASS Kit Wear consent, validator, controller and Terms name only the operator and the brand');
for (const name of ['src/v84/admin-markup.json', 'src/v84/admin-controller.js']) {
  // Admin brand cleanup (2026-10-28): no legacy GOOOL display text in the owner inbox or its labels.
  const admin = fs.readFileSync(name, 'utf8');
  assert(!/goool/i.test(admin), name + ': legacy admin text ' + admin.match(/.{0,40}goool.{0,40}/gi));
  console.log('PASS admin presentation text: ' + name);
}
console.log('Presentation audit does not certify legacy raster product artwork or new manufacturing approval.');
