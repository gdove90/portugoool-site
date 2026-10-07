const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const cache = new Map();

function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const exports = {};
  cache.set(file, exports);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, { exports, require: name => {
    const base = name.startsWith('@/') ? path.join(process.cwd(), 'src', name.slice(2)) : path.resolve(path.dirname(file), name);
    return load(base.endsWith('.json') ? base : base + '.ts');
  } }, { filename: file });
  return exports;
}

const { products } = load('src/lib/products.ts');
const { productGalleryImages } = load('src/v84/product-gallery-images.ts');
const manifest = load('src/v84/mens-studio-v3.json');
assert.equal(manifest.length, 18, 'all 18 approved color variants need a gallery');
assert.equal(new Set(manifest.map(entry => entry.slug)).size, 8);
assert.equal(new Set(manifest.map(entry => entry.productId + ':' + entry.color)).size, 18);
let galleryViews = 0;
const files = new Set();
for (const entry of manifest) {
  const product = products.find(product => product.id === entry.productId && product.slug === entry.slug);
  assert.ok(product && product.isActive, entry.slug + ' must be an active real product');
  assert.notEqual(product.slug, 'goool-touchline-cap');
  const index = product.colorVariants?.findIndex(variant => variant.name === entry.color) ?? 0;
  assert.ok(index >= 0, entry.slug + ': ' + entry.color + ' must be an actual color');
  const supplier = product.colorVariants?.[index]?.images || product.images;
  const snapshot = JSON.stringify(product);
  const gallery = productGalleryImages(product, index);
  assert.equal(gallery.length, 5, 'five studio-only views for ' + entry.slug + ': ' + entry.color);
  assert.equal(gallery[0].src, supplier[0].src, 'catalog cover remains exact');
  assert.equal(gallery[1].src, entry.back?.src || supplier[1].src, 'correct color rear view');
  assert.equal(gallery[2].src, entry.images[0].src, 'fit is third');
  assert.equal(gallery[3].src, entry.images[1].src, 'logo is fourth');
  assert.equal(gallery[4].src, entry.images[2].src, 'construction is fifth');
  assert.ok(gallery[2].alt.includes(entry.model), 'the assigned model is documented');
  assert.equal(new Set(gallery.map(image => image.src)).size, 5, 'no repeated thumbnails');
  assert.equal(JSON.stringify(product), snapshot, 'gallery resolution cannot mutate commerce/catalog fields');
  for (const image of gallery) {
    const file = path.join('public', image.src);
    assert.ok(fs.existsSync(file), 'missing local image: ' + file);
    assert.ok(fs.statSync(file).size > 1000, 'empty/truncated image: ' + file);
    if (image.src.includes('men-studio-v3')) {
      files.add(file);
      assert.ok(image.caption.includes('AI-generated'), 'generated views retain disclosure');
      const bytes = fs.readFileSync(file);
      assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    }
  }
  galleryViews += gallery.length;
}
for (const product of products.filter(product => product.isActive && !manifest.some(entry => entry.productId === product.id))) {
  const supplier = product.colorVariants?.[0]?.images || product.images;
  assert.deepEqual(Array.from(productGalleryImages(product, 0), image => image.src), Array.from(supplier, image => image.src));
}
const fixture = { id: 'unknown', slug: manifest[0].slug, color: manifest[0].color, images: [{ src: '/a', alt: 'a' }, { src: '/b', alt: 'b' }] };
assert.deepEqual(Array.from(productGalleryImages(fixture, 0), image => image.src), ['/a', '/b'], 'slug alone cannot attach another product gallery');
assert.equal(files.size, 57, 'all new studio assets are linked');
console.log('PASS: 8 products, 18 colors, ' + galleryViews + ' studio gallery views, ' + files.size + ' new assets; covers and commerce data preserved.');
