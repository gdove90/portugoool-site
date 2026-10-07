// Original print-file numerals, never a font approximation. See docs/v84/NUMBER_ARTWORK.md.
const dimensions = { 0: [1680, 2250], 1: [1103, 2250], 2: [1680, 2250], 3: [1695, 2250], 4: [1494, 2249], 5: [1710, 2250], 6: [1695, 2250], 7: [1262, 2249], 8: [1680, 2250], 9: [1695, 2250] };
const glyphs = new Map();
function load(number) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Number artwork could not be loaded.'));
    image.src = `/v84/numbers/goool-number-${String(number).padStart(2, '0')}-white.png`;
  });
}
async function glyph(digit) {
  const image = await load(digit === '0' ? 10 : Number(digit));
  const canvas = document.createElement('canvas');
  canvas.height = 512;
  canvas.width = Math.round(dimensions[digit][0] / dimensions[digit][1] * canvas.height);
  const context = canvas.getContext('2d');
  if (digit !== '0') { context.drawImage(image, 0, 0, canvas.width, canvas.height); return canvas; }
  // The original 10 contains the exact original 1 at x=0. Remove that mask,
  // then crop the remaining 0; no outlines are reconstructed or redrawn.
  const one = await load(1);
  const scale = canvas.height / 2250;
  const pair = document.createElement('canvas'), mask = document.createElement('canvas');
  pair.width = mask.width = Math.ceil(2528 * scale);
  pair.height = mask.height = canvas.height;
  const pairContext = pair.getContext('2d'), maskContext = mask.getContext('2d');
  pairContext.drawImage(image, 0, 0, 2528 * scale, canvas.height);
  maskContext.drawImage(one, 0, 0, 1103 * scale, canvas.height);
  const pixels = pairContext.getImageData(0, 0, pair.width, pair.height);
  const silhouette = maskContext.getImageData(0, 0, mask.width, mask.height);
  for (let i = 3; i < pixels.data.length; i += 4) if (silhouette.data[i]) pixels.data[i] = 0;
  pairContext.putImageData(pixels, 0, 0);
  context.drawImage(pair, 848 * scale, 0, 1680 * scale, canvas.height, 0, 0, canvas.width, canvas.height);
  return canvas;
}
export function originalNumberMarkup(value) {
  if (!/^[1-9]\d?$/.test(String(value))) return '';
  return `<span class="kit-number-art" role="img" aria-label="${value}">${String(value).split('').map(digit => {
    const [w, h] = dimensions[digit];
    return `<canvas class="kit-number-digit" data-kit-digit="${digit}" aria-hidden="true" width="${Math.round(w / h * 512)}" height="512" style="width:${w / h}em;height:1em"></canvas>`;
  }).join('')}</span>`;
}
export function drawOriginalNumbers(root) {
  root.querySelectorAll('[data-kit-digit]').forEach(canvas => {
    const digit = canvas.dataset.kitDigit;
    if (canvas.dataset.drawn || !dimensions[digit]) return;
    canvas.dataset.drawn = 'loading';
    if (!glyphs.has(digit)) glyphs.set(digit, glyph(digit).catch(error => { glyphs.delete(digit); throw error; }));
    glyphs.get(digit).then(image => {
      if (!canvas.isConnected) return;
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.dataset.drawn = 'true';
    }).catch(() => { delete canvas.dataset.drawn; canvas.setAttribute('aria-label', 'Number artwork unavailable'); canvas.removeAttribute('aria-hidden'); });
  });
}
