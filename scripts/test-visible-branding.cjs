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
for (const route of ['home','men','women','about','references','story','kit','match']) {
  const html = experience.markup(route);
  const visible = text(parse5.parse(html)).replace(/GOOOL Athletics LLC/gi, 'registered seller').replace(/What’s Your GOOOL\?/g, 'historical licensed series');
  assert(!/goool/i.test(visible), route + ': remaining nonlegal branding ' + visible.match(/.{0,50}goool.{0,70}/gi));
  console.log('PASS visible presentation copy: ' + route);
}
for (const name of ['participation-agreement.html', 'story-participation-agreement.html']) {
  const html = fs.readFileSync('public/'+name,'utf8');
  if (name === 'participation-agreement.html') {
    // Preserve the separate existing Match Highlights agreement; no legal cleanup here.
    assert(html.includes('This agreement is between GOOOL Athletics LLC'));
  } else {
    // State A on reviewed main6b4 uses the new v3 brand-only story agreement.
    // This checks current consent/version consistency, not legal sufficiency.
    assert(html.includes('This agreement is between GOAL Athletics, an independent athletic apparel brand based in Rhode Island'));
    assert(!html.includes('This agreement is between GOOOL Athletics LLC'));
    for (const content of [html, require('../src/lib/intake/agreements.json')[name], fs.readFileSync('src/lib/intake/validation.mjs','utf8'), source]) {
      assert(content.includes('WYG-2026-10-28-live-3'), 'public agreement, snapshot, validator and controller retain approved v3');
    }
    assert.match(html, /href="\/whats-your-goal"/);
    assert.doesNotMatch(html, /href="\/whats-your-goool"/);
  }
  const presentation = html.replace(/<section>[\s\S]*?<\/section>/g, '').replace(/GOOOL Athletics LLC/gi, 'registered seller');
  assert(!/goool/i.test(text(parse5.parse(presentation))), name);
  console.log('PASS document headings/navigation and registered party: ' + name);
}
for (const name of ['src/v84/admin-markup.json', 'src/v84/admin-controller.js']) {
  // Admin brand cleanup (2026-10-28): no legacy GOOOL display text in the owner inbox or its labels.
  const admin = fs.readFileSync(name, 'utf8');
  assert(!/goool/i.test(admin), name + ': legacy admin text ' + admin.match(/.{0,40}goool.{0,40}/gi));
  console.log('PASS admin presentation text: ' + name);
}
console.log('Presentation audit does not certify legacy raster product artwork or new manufacturing approval.');
