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
  assert(html.includes('This agreement is between GOOOL Athletics LLC'));
  const presentation = html.replace(/<section>[\s\S]*?<\/section>/g, '').replace(/GOOOL Athletics LLC/gi, 'registered seller');
  assert(!/goool/i.test(text(parse5.parse(presentation))), name);
  console.log('PASS document headings/navigation and registered party: ' + name);
}
console.log('Presentation audit does not certify legacy raster product artwork or new manufacturing approval.');
