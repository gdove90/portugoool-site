const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { parse } = require('parse5');
const sharp = require('sharp');
const snapshot = require('./approved-active-galleries.json');
const { APPROVED_BASELINE, RETIRED_REDIRECT_SLUGS, RETIRED_NOT_FOUND_SLUGS, assertApprovedCatalog } = require('./approved-catalog-state.cjs');
const { root } = require('./test-source-loader.cjs');
const plain = value => JSON.parse(JSON.stringify(value));
function assertActiveGalleries(load) {
  assert.equal(snapshot.baseline, APPROVED_BASELINE);
  assert.equal(snapshot.products.length, 10);
  assert.equal(snapshot.products.reduce((n, p) => n + p.colors.length, 0), 35);
  assert.equal(Object.keys(snapshot.assets).length, 149);
  const catalog = load('src/lib/products.ts'), ordering = load('src/v84/catalog-data.ts');
  const { productGalleryImages } = load('src/v84/product-gallery-images.ts');
  const { catalogImageSrc } = load('src/lib/product-image.ts');
  assertApprovedCatalog(catalog, ordering);
  let views = 0;
  for (const expected of snapshot.products) {
    const product = catalog.getProductById(expected.id);
    assert.equal(product.slug, expected.slug);
    const before = JSON.stringify(product);
    assert.equal(ordering.defaultVariant(product)?.index ?? 0, expected.defaultVariant, 'approved default color');
    assert.equal(product.colorVariants?.length || 1, expected.colors.length, 'approved color count');
    for (const variant of expected.colors) {
      assert.equal(product.colorVariants?.[variant.index]?.name || product.color, variant.color);
      const actual = productGalleryImages(product, variant.index);
      assert.deepEqual(plain(actual), variant.images, `${expected.slug} ${variant.color}: fixed approved path, alt, order and caption metadata`);
      assert.equal(new Set(actual.map(image => image.src)).size, actual.length, 'no repeated thumbnails');
      const source = product.colorVariants?.[variant.index]?.images || product.images;
      assert.equal(new URL(catalogImageSrc(source[0].src), 'https://example.test').pathname, variant.images[0].src, 'catalog cover and default gallery use the same approved product image');
      assert.ok(actual.every(image => !/\/goool[-_]/i.test(image.src)), 'active galleries cannot inherit archived brand imagery');
      views += actual.length;
    }
    assert.equal(JSON.stringify(product), before, 'gallery resolution cannot mutate catalog/commerce');
  }
  for (const [src, hash] of Object.entries(snapshot.assets)) {
    const bytes = fs.readFileSync(path.join(root, 'public', src));
    assert.ok(bytes.length > 1000, 'complete approved asset: ' + src);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), hash, 'approved image bytes: ' + src);
  }
  return { products: 10, colors: 35, views, assets: 149 };
}
async function assertActiveGalleryHttp(load, base) {
  assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname), 'Use an isolated local fixture server.');
  const nodes = node => [node, ...(node.childNodes || []).flatMap(nodes)];
  const attr = (node, key) => node.attrs?.find(a => a.name === key)?.value;
  const hasClass = (node, value) => (attr(node, 'class') || '').split(/\s+/).includes(value);
  const sourcePath = value => { const url = new URL(value, base); return new URL(url.searchParams.get('url') || url.pathname, base).pathname; };
  const menResponse = await fetch(new URL('/men', base), { signal: AbortSignal.timeout(30000) });
  assert.equal(menResponse.status, 200, 'current public Men collection');
  const men = nodes(parse(await menResponse.text()));
  for (const expected of snapshot.products) {
    const response = await fetch(new URL('/shop/' + expected.slug, base), { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200);
    const all = nodes(parse(await response.text()));
    const gallery = expected.colors[expected.defaultVariant].images;
    const main = all.find(node => hasClass(node, 'gallery-main'));
    assert.ok(main, expected.slug + ': default main gallery exists');
    const mainImage = nodes(main).find(node => node.tagName === 'img');
    assert.equal(attr(mainImage, 'alt'), gallery[0].alt, expected.slug + ': default main alt');
    assert.equal(sourcePath(attr(mainImage, 'src')), gallery[0].src, expected.slug + ': default main source');
    const card = men.find(node => hasClass(node, 'product-card') && attr(node, 'href') === '/shop/' + expected.slug);
    assert.ok(card, expected.slug + ': public Men card links to the same product');
    const cardImage = nodes(card).find(node => node.tagName === 'img');
    assert.equal(attr(cardImage, 'alt'), gallery[0].alt, expected.slug + ': collection cover alt');
    assert.equal(sourcePath(attr(cardImage, 'src')), gallery[0].src, expected.slug + ': collection front cover');
    const thumbs = all.filter(node => hasClass(node, 'thumbnail'));
    assert.equal(thumbs.length, gallery.length, 'current public gallery count');
    gallery.forEach((image, i) => {
      assert.equal(attr(thumbs[i], 'aria-label'), `View image ${i + 1}: ${image.alt}`);
      const img = nodes(thumbs[i]).find(n => n.tagName === 'img');
      assert.equal(sourcePath(attr(img, 'src')), image.src);
    });
  }
  // Keep the original published-image contract and expand it to every current
  // approved public gallery asset: MIME type, exact bytes, SHA and real decode.
  const entries = Object.entries(snapshot.assets); let cursor = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (cursor < entries.length) {
      const [src, expectedHash] = entries[cursor++];
      const response = await fetch(new URL(src, base), { signal: AbortSignal.timeout(30000) });
      assert.equal(response.status, 200, src);
      assert.match(response.headers.get('content-type') || '', /^image\/webp(?:;|$)/i, src + ': served media type');
      const bytes = Buffer.from(await response.arrayBuffer());
      assert.ok(bytes.equals(fs.readFileSync(path.join(root, 'public', src))), src + ': exact served bytes');
      assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), expectedHash, src + ': approved served hash');
      assert.equal((await sharp(bytes).metadata()).format, 'webp', src + ': real WebP decode');
      await sharp(bytes).raw().toBuffer();
    }
  }));
  // Fetch must not auto-follow301: doing so hides the approved retirement
  // redirect behind a200 collection page. Each route has a fixed disposition.
  for (const slug of RETIRED_REDIRECT_SLUGS) {
    const response = await fetch(new URL('/shop/' + slug + '?retired_test=1', base), { redirect: 'manual', signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 301, slug + ': approved permanent retirement redirect');
    const destination = new URL(response.headers.get('location'), base);
    assert.ok(['localhost', '127.0.0.1'].includes(destination.hostname), slug + ': local shop destination');
    assert.equal(destination.protocol, new URL(base).protocol);
    assert.equal(destination.port, new URL(base).port);
    assert.equal(destination.pathname, '/shop', slug + ': redirect to shop, never a replacement PDP');
    assert.equal(destination.search, '', slug + ': redirect strips query');
    assert.equal(destination.hash, '');
    await response.body?.cancel();
  }
  for (const slug of RETIRED_NOT_FOUND_SLUGS) {
    const response = await fetch(new URL('/shop/' + slug, base), { redirect: 'manual', signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 404, slug + ': retired page remains unavailable');
    assert.equal(response.headers.get('location'), null, slug + ': no replacement product redirect');
    const html = await response.text(), all = nodes(parse(html));
    assert.ok(html.includes('NEXT_HTTP_ERROR_FALLBACK;404'), slug + ': Next not-found result');
    assert.ok(all.some(node => node.tagName === 'meta' && attr(node, 'name') === 'robots' && /(?:^|[\s,])noindex(?:$|[\s,])/.test(attr(node, 'content') || '')), slug + ': noindex404');
    assert.ok(!all.some(node => ['pdp', 'pdp-info', 'gallery-main', 'add-button'].some(value => hasClass(node, value))), slug + ': no product detail, gallery or purchase control');
    const schemas = all.filter(node => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json');
    assert.ok(schemas.every(node => !/"@type"\s*:\s*(?:"(?:Product|ProductGroup)"|\[[^\]]*"(?:Product|ProductGroup)")/.test(nodes(node).filter(n => n.nodeName === '#text').map(n => n.value).join(''))), slug + ': no Product schema');
    assert.ok(all.filter(node => node.tagName === 'link' && attr(node, 'rel') === 'canonical').every(node => new URL(attr(node, 'href'), base).pathname !== '/shop/' + slug), slug + ': no canonical for retired product');
  }
  console.log('PASS HTTP ten current public galleries: default main, Men card/front cover, ordered thumbnails, 149 served MIME/byte/hash/decode checks; 10 fixed retired 301-to-shop routes and 29 strict 404/noindex/no-PDP/schema routes.');
}
module.exports = { assertActiveGalleries, assertActiveGalleryHttp };
