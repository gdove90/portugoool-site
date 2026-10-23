// Owner decision 2026-10-23: nothing a visitor reads on the site names AI
// or generated imagery (designs/00_asset-library/NO-AI-LANGUAGE-DECISION.md).
// Walks every catalog row, active or not, every gallery the site would
// render for it, and the three studio manifests. No network, database or
// provider calls.
const fs = require('fs'), path = require('path'), assert = require('assert/strict'), ts = require('typescript'), vm = require('vm');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, resolveJsonModule: true, esModuleInterop: true } }).outputText, f);
const root = path.join(__dirname, '..');
const p = require('../src/lib/products.ts');
// product-gallery-images.ts imports with the @/ alias, so load it in a context that resolves it.
const load = file => {
  const source = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, resolveJsonModule: true, esModuleInterop: true } }).outputText;
  const ctx = { exports: {}, require: n => require(n.startsWith('@/') ? path.join(root, 'src', n.slice(2)) : n.startsWith('.') ? path.join(root, path.dirname(file), n) : n) };
  vm.runInNewContext(source, ctx);
  return ctx.exports;
};
const { productGalleryImages } = load('src/v84/product-gallery-images.ts');
const AI = /\bAI\b|AI-generated|AI-edited|artificial intelligence|machine-generated|computer-generated/i;
const offenders = [];
const check = (where, text) => { if (typeof text === 'string' && AI.test(text)) offenders.push(`${where}: ${text}`); };
let images = 0;
for (const product of p.products) {
  for (const field of ['name', 'description', 'fabric', 'fit', 'fitNote', 'careInstructions', 'disclosure']) check(`${product.slug}.${field}`, product[field]);
  const galleries = [[null, product.images], ...(product.colorVariants || []).map((v, i) => [v, productGalleryImages(product, i)])];
  if (!product.colorVariants) galleries.push([null, productGalleryImages(product, 0)]);
  for (const [variant, gallery] of galleries) for (const image of gallery) {
    images++;
    check(`${product.slug}${variant ? ' ' + variant.name : ''} ${image.src} alt`, image.alt);
    check(`${product.slug}${variant ? ' ' + variant.name : ''} ${image.src} caption`, image.caption);
  }
}
let manifestImages = 0;
for (const file of ['src/v84/mens-studio-v3.json', 'src/v84/mens-studio-v4.json', 'src/v84/studio-backgrounds-v5.json', 'src/v84/mens-on-body-v2.json']) {
  const walk = (node, where) => {
    if (Array.isArray(node)) node.forEach((v, i) => walk(v, `${where}[${i}]`));
    else if (node && typeof node === 'object') { if (node.src || node.webp) manifestImages++; for (const [k, v] of Object.entries(node)) walk(v, `${where}.${k}`); }
    else check(where, node);
  };
  walk(JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')), file);
}
assert.deepEqual(offenders, [], 'AI language found in customer-facing text');
console.log(`PASS no AI language: ${p.products.length} catalog rows, ${images} gallery images and ${manifestImages} manifest entries checked. No network/database/provider calls.`);
