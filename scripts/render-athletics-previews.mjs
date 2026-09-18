// ─────────────────────────────────────────────────────────────
// GOOOL Athletics: web preview renderer.
//
// Builds the product-page imagery for the three Athletics tees from the
// committed print masters in designs/16_goool_athletics/print_masters/.
// Nothing here is AI-generated: each front/back preview is a flat garment
// illustration (SVG silhouette in the packet's garment color) with the
// real reconstructed artwork composited at the packet's proposed print
// width and collar offset (packet sections 03-06, 1 in = 40 px on a
// size-L body). The concept boards are cropped to remove their layout
// heading and published as clearly captioned concept renders.
//
// Run:  npm i --no-save sharp && node scripts/render-athletics-previews.mjs
// sharp is deliberately NOT a project dependency (build stays lean).
// ─────────────────────────────────────────────────────────────

import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MASTERS = path.join(ROOT, "designs/16_goool_athletics/print_masters");
const CONCEPTS = path.join(ROOT, "designs/16_goool_athletics");
const OUT = path.join(ROOT, "public/products");

const SIZE = 1600; // square canvas, matches the First Capsule mockups
const PX_PER_IN = 40; // size-L body: 23 in chest width → 920 px
const CX = SIZE / 2;
const BG = "#F4F4F2"; // tailwind `smoke`

// Front rib-collar seam (packet origin: bottom seam of the rib collar at
// center front/back) and the same for the back view.
const FRONT_SEAM_Y = 300;
const BACK_SEAM_Y = 245;

const DESIGNS = [
  {
    id: "01_MODERN_SPORT",
    garment: { fill: "#151515", collar: "#222222", highlight: "#1E1E1E" },
    front: { file: "GA-01-F_3300px.png", widthIn: 11, dropIn: 3, offsetIn: 0 },
    back: { file: "GA-01-B_975px.png", widthIn: 3.25, dropIn: 2, offsetIn: 0 },
  },
  {
    id: "02_VARSITY",
    garment: { fill: "#2F2F31", collar: "#3A3A3C", highlight: "#38383A" },
    front: { file: "GA-02-F_3300px.png", widthIn: 11, dropIn: 3, offsetIn: 0 },
    back: { file: "GA-02-B_975px.png", widthIn: 3.25, dropIn: 2, offsetIn: 0 },
  },
  {
    id: "03_MINIMAL_CLUB",
    garment: { fill: "#E9E2D2", collar: "#DFD7C5", highlight: "#EEE8DA" },
    // Wearer's left chest = viewer's right: +3.5 in from the centerline.
    front: { file: "GA-03-F_1050px.png", widthIn: 3.5, dropIn: 3, offsetIn: 3.5 },
    back: { file: "GA-03-B_3600px.png", widthIn: 12, dropIn: 2.75, offsetIn: 0 },
  },
];

/** Relaxed drop-shoulder crewneck, flat lay, mirrored about CX. */
function teeSvg({ fill, collar, highlight }, view) {
  const r = (x, y) => `${CX + x},${y}`;
  const l = (x, y) => `${CX - x},${y}`;
  // Body + sleeves outline (right half points, mirrored for the left).
  const body = [
    `M ${l(150, 205)}`,
    `L ${l(470, 255)}`, // shoulder point
    `L ${l(745, 345)}`, // sleeve end, top
    `L ${l(700, 585)}`, // sleeve end, bottom
    `L ${l(462, 525)}`, // armpit
    `L ${l(470, 1395)}`, // hem corner
    `Q ${l(0, 1408)} ${r(470, 1395)}`,
    `L ${r(462, 525)}`,
    `L ${r(700, 585)}`,
    `L ${r(745, 345)}`,
    `L ${r(470, 255)}`,
    `L ${r(150, 205)}`,
  ].join(" ");
  // Neck opening: front sits lower than back.
  const dip = view === "front" ? 270 : 215;
  const seam = view === "front" ? FRONT_SEAM_Y : BACK_SEAM_Y;
  const neckOuter = `M ${l(150, 205)} Q ${l(0, dip + 10)} ${r(150, 205)}`;
  const ribBand = `M ${l(150, 205)} Q ${l(0, dip + 10)} ${r(150, 205)} L ${r(128, 232)} Q ${r(0, seam + 10)} ${l(128, 232)} Z`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <linearGradient id="fab" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${highlight}"/>
      <stop offset="0.35" stop-color="${fill}"/>
      <stop offset="1" stop-color="${fill}"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="125%">
      <feGaussianBlur stdDeviation="22"/>
    </filter>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="${BG}"/>
  <path d="${body}" fill="#000" opacity="0.14" filter="url(#shadow)" transform="translate(0,26)"/>
  <path d="${body}" fill="url(#fab)"/>
  <path d="${neckOuter}" fill="${BG}"/>
  <path d="${ribBand}" fill="${collar}"/>
  <path d="${ribBand}" fill="none" stroke="#000" stroke-opacity="0.12" stroke-width="2"/>
  <path d="M ${l(462, 525)} L ${l(470, 1395)} M ${r(462, 525)} L ${r(470, 1395)}" stroke="#000" stroke-opacity="0.10" stroke-width="2"/>
</svg>`;
}

async function renderView(design, view) {
  const spec = design[view];
  const seam = view === "front" ? FRONT_SEAM_Y : BACK_SEAM_Y;
  const width = Math.round(spec.widthIn * PX_PER_IN);
  const art = await sharp(path.join(MASTERS, spec.file))
    .resize({ width, kernel: "lanczos3" })
    .png()
    .toBuffer({ resolveWithObject: true });
  const left = Math.round(CX + spec.offsetIn * PX_PER_IN - art.info.width / 2);
  const top = Math.round(seam + spec.dropIn * PX_PER_IN);
  const out = path.join(OUT, `GOOOL_ATHLETICS_${design.id}_${view.toUpperCase()}.webp`);
  const composed = await sharp(Buffer.from(teeSvg(design.garment, view)))
    .composite([{ input: art.data, left, top }])
    .png()
    .toBuffer();
  // Breathing room: pad the flat lay, then return to the square canvas.
  await sharp(composed)
    .extend({ top: 90, bottom: 90, left: 90, right: 90, background: BG })
    .resize(SIZE, SIZE, { kernel: "lanczos3" })
    .webp({ quality: 92 })
    .toFile(out);
  return out;
}

async function renderConcept(design) {
  const src = path.join(CONCEPTS, `GOOOL_ATHLETICS_${design.id}.png`);
  const out = path.join(OUT, `GOOOL_ATHLETICS_${design.id}_CONCEPT.webp`);
  // Drop the "0N / NAME" layout heading (top ~128 px of the 1536x1024 board).
  await sharp(src)
    .extract({ left: 0, top: 128, width: 1536, height: 896 })
    .webp({ quality: 88 })
    .toFile(out);
  return out;
}

for (const design of DESIGNS) {
  for (const view of ["front", "back"]) console.log(await renderView(design, view));
  console.log(await renderConcept(design));
}
