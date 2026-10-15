// Compress only the existing editorial desktop images. Never process product assets.
// Original pixels, files and mobile derivatives remain available for comparison.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const imageMap = path.join(root, 'src/v84/desktop-images.json');
const originals = Object.keys(JSON.parse(fs.readFileSync(imageMap, 'utf8')));
const destination = path.join(root, 'public/site-media');
fs.mkdirSync(destination, { recursive: true });
(async () => {
  const mapping = {}, evidence = [];
  for (const source of originals) {
    const name = path.basename(source, '.png');
    const original = path.join(root, 'public/v84/optimized', name + '.webp');
    const before = await sharp(original).metadata();
    const buffer = await sharp(original).webp({ quality: 90, effort: 6 }).toBuffer();
    const after = await sharp(buffer).metadata();
    if (before.width !== after.width || before.height !== after.height) throw Error('Unexpected dimension change: ' + source);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 12);
    const filename = `${name}.${hash}.webp`;
    fs.writeFileSync(path.join(destination, filename), buffer);
    mapping[source] = '/site-media/' + filename;
    evidence.push({ source, derivative: mapping[source], width: after.width, height: after.height, originalBytes: fs.statSync(original).size, optimizedBytes: buffer.length });
  }
  fs.writeFileSync(imageMap, JSON.stringify(mapping, null, 2) + '\n');
  console.log(JSON.stringify({ quality: 90, resized: false, productAssetsChanged: false, images: evidence }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
