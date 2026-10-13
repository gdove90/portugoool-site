/* Zero-dependency, fail-closed GOAL Athletics vector integrity tests.
   Runs from repository root via `node scripts/test-goal-brand-assets.cjs`.
   Statically enforces construction invariants; visual approval remains separately required. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = process.env.GOAL_VECTOR_QA_ROOT || path.resolve(__dirname, '..');
const DOC = path.join(ROOT, 'brand-assets/goal-athletics-approved-v12');
const STAGED = path.join(DOC, 'CORRECTED_QA_PROOFS');
const COORDS = [
  'M0.0 7.4188775033037935 6.679987308122475 0.0H10.203954122191776L3.523966814069302 7.4188775033037935H0.0Z',
  'M6.3060458778082245 7.4188775033037935 12.9860331859307 0.0H16.51L9.830012691877526 7.4188775033037935H6.3060458778082245Z',
];
const FILES = [
  'goal-athletics-horizontal-with-divider-tagline-WHITE-CORRECTED-PROOF.svg',
  'goal-athletics-horizontal-with-divider-tagline-INK-CORRECTED-PROOF.svg',
  'goal-athletics-horizontal-with-divider-WHITE-CORRECTED-PROOF.svg',
  'goal-athletics-horizontal-with-divider-INK-CORRECTED-PROOF.svg',
  'goal-athletics-halo-02-full-copy-WHITE-CORRECTED-PROOF.svg',
  'goal-athletics-halo-02-full-copy-INK-CORRECTED-PROOF.svg',
];
function group(xml,id) {
  const re = new RegExp(`<g\\b[^>]*\\bid="${id}"[^>]*>([\\s\\S]*?)<\\/g>`);
  const m = xml.match(re);
  assert.ok(m, `Missing group ${id}`);
  return m[1];
}
function check(f) {
  const xml = fs.readFileSync(path.join(STAGED,f),'utf8');
  assert.match(xml, /^<svg\s/,`${f}: invalid root`);
  assert.match(xml,/data-release-status="VECTOR-CONSTRUCTION-PROOF-REVIEW-REQUIRED"/,`${f}: missing hold flag`);
  assert.doesNotMatch(xml,/<(?:image|text)\b|\bhref\s*=/,`${f}: contains unoutlined text or external bitmap`);
  const core=group(xml,'canonical-v12-strike');
  const p=[...core.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(p,COORDS,`${f}: V1.2 strike path geometry has changed`);
  assert.match(xml,/<g\b[^>]*\bid="canonical-v12-strike"[^>]*\btransform="translate\([^)]+\) scale\([\d.]+\)"/,`${f}: non-uniform canonical strike transform`);
  if(f.includes('horizontal')) {
    const match=xml.match(/<rect\b[^>]*id="MANDATORY_VERTICAL_DIVIDER"[^>]*>/g)||[];
    assert.equal(match.length,1,`${f}: mandatory divider missing or repeated`);
    assert.match(match[0],/height="167"/,`${f}: divider height changed`);
    assert.match(match[0],/width="2\.8"/,`${f}: divider width changed`);
    assert.ok(group(xml,'approved-wordmark-proof').includes('fill-rule="evenodd"'),`${f}: wordmark is absent`);
    if(f.includes('-tagline-')) assert.ok(group(xml,'wear-the-feeling-outlined').includes('data-letter='),`${f}: tagline missing`);
  } else {
    const ARC=group(xml,'symmetrical-halo-side-arcs');
    assert.equal((ARC.match(/<path\b/g)||[]).length,2,`${f}: halo must have two symmetrical side arcs`);
    for(const [id,title] of [['BADGE_TOP_TEXT_OUTLINED','GOALATHLETICS'],['BADGE_BOTTOM_TEXT_OUTLINED','PERFORMANCELIVESHERE']]){
      const chars=[...group(xml,id).matchAll(/<path\s+data-letter="([A-Z])"/g)].map(x=>x[1]).join('');
      assert.equal(chars,title,`${f}: full lettering missing in ${id}`);
    }
  }
  console.log('PASS',f);
}
assert.equal(FILES.length,6);
for(const f of FILES)check(f);
for(const old of ['goal-athletics-horizontal-lockup-proof.svg','goal-athletics-halo-02-proof.svg']){
  assert.ok(!fs.existsSync(path.join(DOC,old)),`RECALL FAILURE: invalid active SVG still present: ${old}`);
}
console.log('PASS: Six corrected SVG constructions and quarantine of recalled prior exports.');
console.log('NOTE: Structural validity does not establish exact source glyph fidelity, trademark status or vendor manufacture approval.');