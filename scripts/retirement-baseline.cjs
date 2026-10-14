const assert = require('node:assert/strict');
const ID = '70000000-0000-4000-8000-000000000001';
// Owner decision 2026-10-14: every cap comes off the site (Touchline,
// Athletics Badge, Athletics Stacked). History and SKUs stay intact.
const CAP_IDS = [
  '70000000-0000-4000-8000-000000000004',
  '80000000-0000-4000-8000-000000000007',
  '80000000-0000-4000-8000-000000000008',
];
function retireProduct(source, id) {
  const start = source.indexOf(`id: "${id}"`);
  assert(start >= 0, `Retired product ${id} missing from baseline`);
  const next = source.indexOf('\n  {\n    id:', start);
  const end = next >= 0 ? next : source.indexOf('\n];', start);
  assert(end > start, `Cannot isolate retired product ${id}`);
  const block = source.slice(start, end);
  const flags = '    isActive: true,\n    availableForSale: true,';
  assert.equal(block.split(flags).length, 2, 'Retirement must change only the exact two flags');
  return source.slice(0, start) + block.replace(flags, '    isActive: false,\n    availableForSale: false,') + source.slice(end);
}
// Owner upload 2026-10-14: the new hats live in one marked block in
// products.ts and one in fulfillment.ts. Preservation tests strip exactly
// that block, so everything outside it must still equal production.
const HAT_START = '  // == GOAL Athletics hats (owner upload 2026-10-14) ==\n';
const HAT_END = '  // == end GOAL Athletics hats ==\n';
function withoutHatAdditions(source) {
  const start = source.indexOf(HAT_START);
  if (start < 0) return source;
  const end = source.indexOf(HAT_END, start);
  assert(end > start, 'Unterminated GOAL Athletics hat block');
  assert.equal(source.indexOf(HAT_START, end), -1, 'Only one hat block per file');
  return source.slice(0, start) + source.slice(end + HAT_END.length);
}
function retireCoreBadgeBaseline(source) {
  return retireProduct(source, ID);
}
function applyRetirements(source) {
  return [ID, ...CAP_IDS].reduce(retireProduct, source);
}
module.exports = { ID, CAP_IDS, retireProduct, retireCoreBadgeBaseline, applyRetirements, withoutHatAdditions };
