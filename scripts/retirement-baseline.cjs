const assert = require('node:assert/strict');
const ID = '70000000-0000-4000-8000-000000000001';
function retireCoreBadgeBaseline(source) {
  const start = source.indexOf(`id: "${ID}"`);
  assert(start >= 0, 'Retired product missing from baseline');
  const end = source.indexOf('\n  {\n    id:', start);
  assert(end > start, 'Cannot isolate retired product');
  const block = source.slice(start, end);
  const flags = '    isActive: true,\n    availableForSale: true,';
  assert.equal(block.split(flags).length, 2, 'Retirement must change only the exact two flags');
  return source.slice(0, start) + block.replace(flags, '    isActive: false,\n    availableForSale: false,') + source.slice(end);
}
module.exports = { ID, retireCoreBadgeBaseline };
