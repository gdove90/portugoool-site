// Read-only inventory. Does not infer a registered entity or rewrite agreements.
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process'), crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const output = path.resolve(process.argv[2] || path.join(root, 'tmp/legal-inventory'));
// Search Git objects as well as the sparse checkout so historical documents
// omitted from this working tree are still inventoried.
const files = cp.execFileSync('git', ['grep', '-I', '-l', '-i', '-E', 'goal[[:space:]]+brand[[:space:]]+group|goool[[:space:]]+(athletics|apparel)', 'HEAD', '--'], { cwd: root, encoding: 'utf8', maxBuffer:16*1024*1024 }).trim().split('\n').map(file => file.replace(/^HEAD:/, '')).filter(Boolean);
const matches = [], agreements = [];
const pattern = /\b(?:(?:The\s+)?Goal\s+Brand\s+Group|GOOOL\s+(?:Athletics|Apparel))\s*,?\s*L\.?L\.?C\.?/gi;
for (const file of files) {
  if (!/\.(?:tsx?|jsx?|mjs|cjs|json|md|txt|html|sql|toml|ya?ml|csv|xml|svg)$/i.test(file)) continue;
  const text = fs.existsSync(path.join(root,file)) ? fs.readFileSync(path.join(root, file), 'utf8') : cp.execFileSync('git',['show',`HEAD:${file}`],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024});
  text.split(/\r?\n/).forEach((line, index) => {
    for (const hit of line.matchAll(pattern)) matches.push({ file, line: index + 1, column: hit.index + 1, name: hit[0], context: line, surface: /agreement|intake-privacy|intake\/validation|reference-experience/.test(file) ? 'agreement / consent or template (review exact context)' : /src\/lib\/emails|unsubscribe/.test(file) ? 'email / unsubscribe' : /src\/lib\/seo/.test(file) ? 'organization metadata' : file.startsWith('src/') ? 'application' : 'documentation / historical / asset' });
  });
  if (/agreements\.json$/.test(file)) {
    const data = JSON.parse(text);
    function walk(value, pointer = '') {
      if (typeof value === 'string') { if (/LLC|consent|agreement|version/i.test(value + pointer)) agreements.push({ file, pointer, text: value }); }
      else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) walk(child, pointer + '/' + key.replace(/~/g, '~0').replace(/\//g, '~1'));
    }
    walk(data);
    agreements.push({ file, sha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex') });
  }
}
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'legal-name-inventory.json'), JSON.stringify({ generated: new Date().toISOString(), baseline: cp.execFileSync('git', ['rev-parse', 'origin/main'], {cwd:root,encoding:'utf8'}).trim(), names: [...new Set(matches.map(m=>m.name))].sort(), matches, agreements }, null, 2));
const grouped = Object.groupBy(matches, m => m.file);
const lines = ['# Legal-name inventory — verification required', '', 'This is an inventory of claims in tracked source, not evidence of legal registration. No entity substitution is authorized by these matches. Executed agreement versions must remain unchanged. `support@goalathletics.shop` is retained.', '', 'Exact complete source lines, columns, agreement JSON pointers, full text and the agreement-file hash are in `legal-name-inventory.json`.', '', '| File | Lines | Names | Surface |', '| --- | --- | --- | --- |'];
for (const [file, rows] of Object.entries(grouped)) lines.push(`| ${file} | ${[...new Set(rows.map(r=>r.line))].join(', ')} | ${[...new Set(rows.map(r=>r.name))].join('; ')} | ${[...new Set(rows.map(r=>r.surface))].join('; ')} |`);
lines.push('', '## Required evidence', '', 'Obtain the current state registration and any effective amendment/DBA documentation identifying the seller. Confirm the effective date and entity responsible for historical orders. Then approve prospective disclosure and consent updates with new version identifiers; preserve all executed text and acceptance records.', '', 'The Google Workspace display name “Goool Apparel LLC” seen in prior account work is not registration evidence. It is listed separately from source matches and has not been used to rewrite the site.');
fs.writeFileSync(path.join(output, 'legal-name-inventory.md'), lines.join('\n') + '\n');
console.log(JSON.stringify({ files: Object.keys(grouped).length, occurrences: matches.length, names: [...new Set(matches.map(m=>m.name))].sort(), output }));
