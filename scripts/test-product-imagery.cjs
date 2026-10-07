const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const sharp = require('sharp');
const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const manifest = require('../src/v84/mens-on-body-v2.json');
function load(file, dependencies = {}) {
  const context = { exports: {}, require: name => {
    assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
    return dependencies[name];
  } };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText, context);
  return context.exports;
}
const types = load('src/lib/types.ts');
const catalog = load('src/lib/products.ts', { './types': types });
const { productGalleryImages } = load('src/v84/product-gallery-images.ts', { './mens-on-body-v2.json': manifest });
const ordering = load('src/v84/catalog-data.ts', { '@/lib/products': catalog });
const plain = value => JSON.parse(JSON.stringify(value));

async function main() {
  assert.equal(manifest.length, 8);
  assert.equal(new Set(manifest.map(entry => entry.productId)).size, 8);
  for (const entry of manifest) {
    const product = catalog.getProductById(entry.productId);
    assert.ok(product);
    assert.equal(product.slug, entry.slug);
    const before = JSON.stringify(product);
    const intendedColor = entry.color === 'Natural / Black' ? 'Black/Natural' : entry.color;
    const indices = product.colorVariants ? product.colorVariants.map((_, index) => index) : [0];
    let assigned = 0;
    for (const index of indices) {
      const variant = product.colorVariants?.[index];
      const original = variant?.images || product.images;
      const images = productGalleryImages(product, index);
      const color = variant?.name || product.color;
      if (color !== intendedColor) {
        assert.equal(images, original, `${entry.slug}: other color changed`);
        assert.ok(!images.some(image => image.src.includes('/editorial/men-v2/')));
        continue;
      }
      assigned++;
      assert.deepEqual(plain(images.slice(0, 2)), plain(original.slice(0, 2)));
      assert.equal(images[2].src, '/products/editorial/men-v2/' + path.basename(entry.webp));
      assert.equal(images[2].alt, entry.alt);
      assert.equal(images.length, original.length + 1);
      assert.equal(new Set(images.map(image => image.src)).size, images.length);
      const repeated = plain(product);
      if (variant) repeated.colorVariants[index].images = plain(images);
      else repeated.images = plain(images);
      assert.deepEqual(plain(productGalleryImages(repeated, index)), plain(images), 'Not idempotent');
      const prior = plain(product);
      const replacement = [...plain(original), { src: '/products/old-on-body.webp', alt: 'Previous on-body fit' }];
      if (variant) prior.colorVariants[index].images = replacement;
      else prior.images = replacement;
      assert.deepEqual(plain(productGalleryImages(prior, index)), plain(images), 'Previous role not replaced');
      assert.equal(productGalleryImages({ ...product, slug: 'wrong-product' }, index), original);
    }
    assert.equal(assigned, 1);
    assert.equal(JSON.stringify(product), before, 'Product or variant data mutated');
    const index = ordering.defaultVariant(product)?.index || 0;
    assert.equal(productGalleryImages(product, index)[2].alt, entry.alt, 'Default not intended color');
    if (product.colorVariants) assert.equal(ordering.defaultVariant(product).variant.name, 'Black');
    const asset = path.join(root, 'public/products/editorial/men-v2', path.basename(entry.webp));
    const meta = await sharp(asset).metadata();
    assert.equal(meta.width, 1254); assert.equal(meta.height, 1254); assert.equal(meta.format, 'webp');
    await sharp(asset).raw().toBuffer();
    if (process.env.PHOTO_SOURCE_DIR) {
      const master = fs.readFileSync(path.join(process.env.PHOTO_SOURCE_DIR, entry.png));
      assert.equal(createHash('sha256').update(master).digest('hex'), entry.sha256);
      assert.ok(fs.readFileSync(asset).equals(fs.readFileSync(path.join(process.env.PHOTO_SOURCE_DIR, entry.webp))));
    }
    console.log(`PASS ${entry.slug}: identity, color isolation, third image, front/back preservation, idempotency, decode`);
  }
  const touchline = catalog.getProductBySlug('goool-touchline-cap');
  assert.equal(productGalleryImages(touchline, 0), touchline.images);
  const unchanged = ['src/lib/products.ts', 'src/lib/types.ts', 'src/lib/cart.tsx', 'src/v84/Catalog.tsx', 'src/lib/product-image.ts'];
  for (const file of unchanged) {
    const baseline = execFileSync('git', ['show', `2fe3e13904db2265fce2440c8206f306d48f259c:${file}`], { cwd: root });
    const working = fs.readFileSync(path.join(root, file));
    assert.equal(working.toString().replace(/\r\n/g, '\n'), baseline.toString().replace(/\r\n/g, '\n'), `${file}: unexpected change`);
  }
  console.log('PASS Touchline exclusion; catalog, commerce identity, cart and collection covers remain unchanged');
  if (process.env.PHOTO_BASE_URL) {
    const { parse } = await import('parse5');
    const base = process.env.PHOTO_BASE_URL;
    const nodes = node => [node, ...(node.childNodes || []).flatMap(nodes)];
    const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
    const hasClass = (node, name) => (attr(node, 'class') || '').split(/\s+/).includes(name);
    const getPage = async pathname => {
      const response = await fetch(new URL(pathname, base), { signal: AbortSignal.timeout(30000) });
      assert.equal(response.status, 200, pathname);
      return nodes(parse(await response.text()));
    };
    const men = await getPage('/men');
    for (const entry of manifest) {
      const product = catalog.getProductById(entry.productId);
      const index = ordering.defaultVariant(product)?.index || 0;
      const images = productGalleryImages(product, index);
      const page = await getPage('/shop/' + entry.slug);
      const thumbs = page.filter(node => hasClass(node, 'thumbnail'));
      assert.equal(thumbs.length, images.length);
      images.forEach((image, i) => {
        assert.equal(attr(thumbs[i], 'aria-label'), `View image ${i + 1}: ${image.alt}`);
        const thumbnail = nodes(thumbs[i]).find(node => node.tagName === 'img');
        assert.equal(new URL(attr(thumbnail, 'src'), base).pathname, image.src);
      });
      const main = page.find(node => hasClass(node, 'gallery-main'));
      assert.equal(attr(nodes(main).find(node => node.tagName === 'img'), 'alt'), images[0].alt);
      const card = men.find(node => hasClass(node, 'product-card') && attr(node, 'href') === '/shop/' + entry.slug);
      assert.ok(card, 'Missing Men card: ' + entry.slug);
      assert.equal(attr(nodes(card).find(node => node.tagName === 'img'), 'alt'), images[0].alt);
      const response = await fetch(new URL(images[2].src, base), { signal: AbortSignal.timeout(30000) });
      assert.equal(response.status, 200);
      assert.match(response.headers.get('content-type'), /image\/webp/);
      const bytes = Buffer.from(await response.arrayBuffer());
      assert.ok(bytes.equals(fs.readFileSync(path.join(root, 'public', images[2].src))), 'Published asset bytes differ');
      await sharp(bytes).raw().toBuffer();
      console.log(`PASS HTTP ${base} ${entry.slug}: thumbnail order/alt, default main, Men link/front cover, exact asset bytes`);
    }
    console.log('HTTP checks do not claim interactive color, cart or responsive browser acceptance.');
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
