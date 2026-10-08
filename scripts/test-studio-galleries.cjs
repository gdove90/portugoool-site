const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { execFileSync } = require('node:child_process');
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
const manifest = load('src/v84/mens-studio-v4.json');
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
  const expectedLength = entry.hasBackArtwork ? 6 : 5;
  assert.equal(gallery.length, expectedLength, 'correct gallery sequence for ' + entry.slug + ': ' + entry.color);
  assert.equal(gallery[0].src, supplier[0].src, 'catalog cover remains exact');
  const modelStart = entry.hasBackArtwork ? 2 : 1;
  if (entry.hasBackArtwork) assert.equal(gallery[1].src, entry.back?.src || supplier[1].src, 'correct color rear view');
  assert.equal(entry.images.length, 4, 'exactly three model views and one detail');
  for (let view = 0; view < 3; view++) {
    assert.equal(gallery[modelStart + view].src, entry.images[view].src, 'model views remain ordered');
    assert.ok(gallery[modelStart + view].alt.includes(entry.model), 'assigned model is documented');
  }
  assert.equal(gallery.at(-1).src, entry.images[3].src, 'detail is last');
  assert.equal(new Set(gallery.map(image => image.src)).size, expectedLength, 'no repeated thumbnails');
  assert.equal(JSON.stringify(product), snapshot, 'gallery resolution cannot mutate commerce/catalog fields');
  for (const image of gallery) {
    const file = path.join('public', image.src);
    assert.ok(fs.existsSync(file), 'missing local image: ' + file);
    assert.ok(fs.statSync(file).size > 1000, 'empty/truncated image: ' + file);
    if (image.src.includes('men-studio-v4')) {
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
for (const file of ['src/lib/products.ts', 'src/lib/types.ts', 'src/lib/cart.tsx', 'src/v84/Catalog.tsx', 'src/v84/ProductDetail.tsx', 'src/lib/collection-launch.ts']) {
  assert.equal(fs.readFileSync(file, 'utf8'), execFileSync('git', ['show', 'HEAD:' + file], { encoding: 'utf8' }), 'unrelated catalog, commerce or Tempo change: ' + file);
}
const unknownColor = { id: manifest[0].productId, slug: manifest[0].slug, color: 'Unknown', images: fixture.images };
assert.deepEqual(Array.from(productGalleryImages(unknownColor, 0), image => image.src), ['/a', '/b'], 'unlisted colors cannot inherit a different color gallery');
assert.equal(galleryViews, 103, 'blank rear products have five views; decorated rear products have six');
assert.equal(files.size, 54, 'all new studio assets are linked');
console.log('PASS: 8 products, 18 colors, ' + galleryViews + ' studio gallery views, ' + files.size + ' new assets; covers and commerce data preserved.');

if (process.env.PHOTO_BASE_URL) (async () => {
  const { parse } = await import('parse5');
  const { defaultVariant } = load('src/v84/catalog-data.ts');
  const base = process.env.PHOTO_BASE_URL;
  const nodes = node => [node, ...(node.childNodes || []).flatMap(nodes)];
  const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
  const hasClass = (node, name) => (attr(node, 'class') || '').split(/\s+/).includes(name);
  await Promise.all([...new Set(manifest.map(entry => entry.slug))].map(async slug => {
    const product = products.find(product => product.slug === slug);
    const gallery = productGalleryImages(product, defaultVariant(product)?.index || 0);
    const response = await fetch(new URL('/shop/' + slug, base), { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, slug);
    const page = nodes(parse(await response.text()));
    const thumbs = page.filter(node => hasClass(node, 'thumbnail'));
    assert.equal(thumbs.length, gallery.length, slug + ': rendered thumbnail count');
    gallery.forEach((image, index) => {
      assert.equal(attr(thumbs[index], 'aria-label'), `View image ${index + 1}: ${image.alt}`);
      const thumbnail = nodes(thumbs[index]).find(node => node.tagName === 'img');
      assert.equal(new URL(attr(thumbnail, 'src'), base).pathname, image.src);
    });
    const main = page.find(node => hasClass(node, 'gallery-main'));
    assert.equal(attr(nodes(main).find(node => node.tagName === 'img'), 'alt'), gallery[0].alt);
  }));
  await Promise.all(manifest.flatMap(entry => entry.images.slice(0, 3)).map(async image => {
    const response = await fetch(new URL(image.src, base), { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, image.src);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', image.src);
  }));
  console.log('PASS: rendered galleries for all eight product pages and all 54 served model images.');
})().catch(error => { console.error(error); process.exitCode = 1; });
