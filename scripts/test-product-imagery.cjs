// Current active imagery plus retained historical on-body branch coverage.
// All fixtures are local; archived products never re-enter the public catalog.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { createSourceLoader, root } = require('./fixtures/test-source-loader.cjs');
const { APPROVED_BASELINE } = require('./fixtures/approved-catalog-state.cjs');
const { assertActiveGalleries, assertActiveGalleryHttp } = require('./fixtures/assert-active-galleries.cjs');
const load = createSourceLoader();
const catalog = load('src/lib/products.ts');
const manifest = load('src/v84/mens-on-body-v2.json');
const plain = value => JSON.parse(JSON.stringify(value));
// Explicit test dependencies isolate the v2 fallback from later v3/v4 overrides.
const legacyLoad = createSourceLoader({ overrides: {
  'src/v84/mens-studio-v3.json': [], 'src/v84/mens-studio-v4.json': [], 'src/v84/studio-backgrounds-v5.json': [],
} });
const legacyGallery = legacyLoad('src/v84/product-gallery-images.ts').productGalleryImages;
async function main() {
  const active = assertActiveGalleries(load);
  console.log(`PASS current active gallery snapshot: ${active.products} products, ${active.colors} colors, ${active.views} ordered views, ${active.assets} exact asset hashes.`);
  assert.equal(manifest.length, 8);
  assert.equal(new Set(manifest.map(e => e.productId)).size, 8);
  for (const entry of manifest) {
    const archived = catalog.products.find(p => p.id === entry.productId && p.slug === entry.slug);
    assert.ok(archived && !archived.isActive, 'v2 fixture is historical, not a public product');
    assert.equal(catalog.getProductById(entry.productId), undefined);
    const historicalBefore = JSON.stringify(archived);
    const fixture = { ...archived, images: archived.images.slice(0, 2), colorVariants: archived.colorVariants?.map(v => ({ ...v, images: v.images.slice(0, 2) })) };
    const intended = entry.color === 'Natural / Black' ? 'Black/Natural' : entry.color;
    let assigned = 0;
    for (let index = 0; index < (fixture.colorVariants?.length || 1); index++) {
      const variant = fixture.colorVariants?.[index], original = variant?.images || fixture.images;
      const actual = legacyGallery(fixture, index), color = variant?.name || fixture.color;
      if (color !== intended) {
        assert.deepEqual(plain(actual), plain(original), 'unassigned colors keep their own supplier images');
        assert.ok(actual.every(image => !image.src.includes('/editorial/men-v2/')));
        continue;
      }
      assigned++;
      assert.deepEqual(plain(actual.slice(0, 2)), plain(original));
      assert.equal(actual.length, 3);
      assert.equal(actual[2].src, '/products/editorial/men-v2/' + path.basename(entry.webp));
      assert.equal(actual[2].alt, entry.alt);
      const repeated = plain(fixture);
      if (variant) repeated.colorVariants[index].images = plain(actual); else repeated.images = plain(actual);
      assert.deepEqual(plain(legacyGallery(repeated, index)), plain(actual), 'v2 on-body insertion is idempotent');
      const prior = plain(fixture);
      const oldImages = [...plain(original), { src: '/products/old-on-body.webp', alt: 'Previous on-body fit' }];
      if (variant) prior.colorVariants[index].images = oldImages; else prior.images = oldImages;
      assert.deepEqual(plain(legacyGallery(prior, index)), plain(actual), 'previous on-body role is replaced');
      assert.deepEqual(plain(legacyGallery({ ...fixture, slug: 'wrong-product' }, index)), plain(original), 'identity includes id and slug');
    }
    assert.equal(assigned, 1);
    assert.equal(JSON.stringify(archived), historicalBefore, 'historical catalog record cannot be mutated');
    const asset = path.join(root, 'public/products/editorial/men-v2', path.basename(entry.webp));
    const meta = await sharp(asset).metadata();
    assert.equal(meta.width, 1254); assert.equal(meta.height, 1254); assert.equal(meta.format, 'webp');
    await sharp(asset).raw().toBuffer();
    if (process.env.PHOTO_SOURCE_DIR) {
      const master = fs.readFileSync(path.join(process.env.PHOTO_SOURCE_DIR, entry.png));
      assert.equal(createHash('sha256').update(master).digest('hex'), entry.sha256);
      assert.ok(fs.readFileSync(asset).equals(fs.readFileSync(path.join(process.env.PHOTO_SOURCE_DIR, entry.webp))));
    }
    console.log(`PASS historical v2 ${entry.slug}: retirement, identity/color isolation, front/back, idempotency, replacement and decode.`);
  }
  const touchline = catalog.products.find(product => product.slug === 'goool-touchline-cap');
  assert.ok(touchline && !touchline.isActive, 'Touchline remains a retired historical record');
  assert.equal(catalog.getProductBySlug(touchline.slug), undefined, 'Touchline public lookup remains unavailable');
  const touchlineImages = load('src/v84/product-gallery-images.ts').productGalleryImages(touchline, 0);
  assert.deepEqual(plain(touchlineImages), [
    { src: '/products/editorial/studio-v5/goool-touchline-cap-black-natural-front-v5.webp', alt: 'GOOOL Touchline Cap in black and natural, front view' },
    { src: '/products/editorial/studio-v5/goool-touchline-cap-black-natural-back-v5.webp', alt: 'GOOOL Touchline Cap in black and natural, back view' },
  ], 'Touchline keeps its approved front/back fallback without inheriting model/on-body gallery views');
  console.log('PASS archived Touchline fallback: exact approved two-view front/back data, no attached model gallery, public route stays retired.');
  for (const file of ['src/lib/products.ts', 'src/lib/types.ts', 'src/lib/cart.tsx', 'src/v84/Catalog.tsx', 'src/lib/product-image.ts', 'src/v84/product-gallery-images.ts']) {
    assert.equal(fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n'), execFileSync('git', ['show', APPROVED_BASELINE + ':' + file], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n'), 'approved production source preserved: ' + file);
  }
  console.log('PASS fixed approved catalog, cart, image helpers and covers remain unchanged. No image or production source written.');
  if (process.env.PHOTO_BASE_URL) await assertActiveGalleryHttp(load, process.env.PHOTO_BASE_URL);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
