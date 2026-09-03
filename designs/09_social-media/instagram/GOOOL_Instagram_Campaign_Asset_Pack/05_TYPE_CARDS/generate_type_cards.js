const fs = require('fs');
const path = require('path');

const out = __dirname;
const black = '#0A0A0A';
const white = '#FCFBF8';
const muted = '#A7A7AA';
const red = '#C61322';
const font = 'Nimbus Sans Narrow, Arial Narrow, Arial, sans-serif';

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function makeCard(name, width, height, eyebrow, lines, footer, options = {}) {
  const pad = width * 0.09;
  const mainSize = options.mainSize || Math.round(width * 0.105);
  const lineGap = options.lineGap || Math.round(mainSize * 0.92);
  const totalHeight = (lines.length - 1) * lineGap;
  const startY = options.startY || Math.round((height - totalHeight) * 0.47);
  const underlineWidth = options.underlineWidth || Math.round(width * 0.18);
  const body = lines.map((line, i) =>
    `<text x="${pad}" y="${startY + i * lineGap}" fill="${white}" font-family="${font}" font-size="${mainSize}" font-weight="700" letter-spacing="1">${esc(line)}</text>`
  ).join('\n');
  const answerStartY = startY + lines.length * lineGap + Math.round(width * 0.09);
  const answerSize = options.answerSize || Math.round(width * 0.035);
  const answerGap = Math.round(answerSize * 1.3);
  const answer = (options.answer || []).map((line, i) =>
    `<text x="${pad}" y="${answerStartY + i * answerGap}" fill="${muted}" font-family="${font}" font-size="${answerSize}" font-weight="400" letter-spacing="0.5">${esc(line)}</text>`
  ).join('\n');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${black}"/>
  <text x="${pad}" y="${Math.round(height * 0.09)}" fill="${muted}" font-family="${font}" font-size="${Math.round(width * 0.026)}" font-weight="700" letter-spacing="5">${esc(eyebrow.toUpperCase())}</text>
  ${body}
  <rect x="${pad}" y="${startY + lines.length * lineGap - Math.round(lineGap * 0.52)}" width="${underlineWidth}" height="${Math.max(8, Math.round(width * 0.012))}" fill="${red}"/>
  ${answer}
  <text x="${pad}" y="${Math.round(height * 0.92)}" fill="${white}" font-family="${font}" font-size="${Math.round(width * 0.034)}" font-weight="700" letter-spacing="3">${esc(footer.toUpperCase())}</text>
  </svg>`;
  fs.writeFileSync(path.join(out, `${name}.svg`), svg);
}

const cards = [
  ['GOOOL_D01_ANTHEM_COVER', 'THE FIRST CAPSULE', ['THE SECOND', 'IT GOES IN.'], 'GOOOL · MADE FOR THE MOMENT.', {}],
  ['GOOOL_D05_FOUNDER_NOTE', 'A NOTE FROM THE FOUNDER', ['FOUR PIECES.', 'ONE MARK.', 'BUILT SLOW.', 'LAUNCHED LOUD.'], 'GOOOL.SHOP', {}],
  ['GOOOL_D14_THE_LIST', 'THE FIRST CAPSULE', ['SEEN ALL FOUR?', 'THE LIST HEARS', 'THE LAUNCH FIRST.'], 'GOOOL.SHOP', {}],
  ['GOOOL_D22_WHY_A_LIST', 'NO FAKE COUNTDOWN', ['THE DATE.', 'THE FIRST REAL PHOTOS.', 'THE OPEN DOOR.', 'THE LIST HEARS FIRST.'], 'GOOOL.SHOP', { mainSize: 72 }],
  ['GOOOL_D30_DOOR_NOTICE', 'MONTH ONE COMPLETE', ['NEXT:', 'THE DOOR.'], 'GOOOL.SHOP', {}]
];

for (const [name, eyebrow, lines, footer, options] of cards) {
  makeCard(`${name}_45`, 1080, 1350, eyebrow, lines, footer, options);
  makeCard(`${name}_916`, 1080, 1920, eyebrow, lines, footer, { ...options, startY: 760 });
}

const faq = [
  { lines: ['YOU ASKED.', 'STRAIGHT ANSWERS.'], answer: [] },
  { lines: ['WHEN DOES', 'IT LAUNCH?'], answer: ['When the physical samples pass', 'every check. The list hears', 'the date first.'] },
  { lines: ['HOW DO THE', 'FITS RUN?'], answer: ['Performance tee: athletic, true to size.', 'Hoodie: generous. Casual tee: relaxed.', 'Cap: adjustable.'] },
  { lines: ['WHAT SIZES?'], answer: ['S–2XL across all three garments.'] },
  { lines: ['WHAT PRICES?'], answer: ['$48 performance tee · $78 hoodie', '$38 casual tee · $36 cap.'] },
  { lines: ['ARE YOU', 'A CLUB?'], answer: ['No. One mark, every fan.', 'That is the point.'] },
  { lines: ['ONE MARK.', 'EVERY FAN.'], answer: ['GOOOL · Made for the Moment.'] }
];
faq.forEach((card, i) => makeCard(`GOOOL_D24_FAQ_SLIDE_${String(i + 1).padStart(2, '0')}_45`, 1080, 1350, i === 0 ? 'FAQ' : `QUESTION ${i}`, card.lines, i === 6 ? 'GOOOL.SHOP' : 'SWIPE', { answer: card.answer, answerSize: 37 }));

const highlights = [
  ['GOOOL_HIGHLIGHT_FIRST_CHAPTER_11', ['FIRST', 'CHAPTER']],
  ['GOOOL_HIGHLIGHT_THE_CAPSULE_11', ['THE', 'CAPSULE']],
  ['GOOOL_HIGHLIGHT_TERRACE_11', ['TERRACE']]
];
for (const [name, lines] of highlights) {
  makeCard(name, 1080, 1080, 'GOOOL', lines, 'THE SECOND IT GOES IN.', { mainSize: 112, startY: 480, lineGap: 110, underlineWidth: 150 });
}
