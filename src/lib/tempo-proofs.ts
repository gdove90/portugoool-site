// ─────────────────────────────────────────────────────────────
// TEMPO women's collection: placement proofs (Claude Design project
// b9b09d57, "TEMPO Collection.dc.html", 26 Oct 2026), ported as data.
//
// Every number here is the design's own: garment silhouettes drawn at the
// smallest supplier size with 1 unit = 1 inch, the V1.3 artwork placed at
// production size, and the spec text as written. The page that renders it
// (src/components/TempoProofs.tsx) is owner-only; nothing here reaches the
// catalog. Prices, supplier ids and product photos are still null in the
// handoff (designs/62_tempo-collection-proofs-2026-10-26/handoff), so no
// TEMPO product exists in products.ts yet.
// ─────────────────────────────────────────────────────────────

export const INK = {
  wr: { p: "04_White_Red", name: "White + red" },
  br: { p: "03_Black_Red", name: "Black + red" },
  cr: { p: "06_Light_Cream", name: "Light cream" },
  sb: { p: "01_Solid_Black", name: "Solid black" },
  sw: { p: "02_Solid_White", name: "Solid white" },
} as const;
export type InkKey = keyof typeof INK;

// pw/ph: the PNG canvas; x0/y0/w/h: the visible artwork's alpha bounds in
// that canvas. The proof sizes the VISIBLE artwork, so the <img> is scaled
// by pw/w and offset by x0/y0 to land the ink where the spec says.
export const MARK = {
  ga: { f: "02_GA_Monogram", pw: 1200, ph: 1085, x0: 16, y0: 16, w: 1164, h: 1049, label: "GA" },
  lk: { f: "01_Combined_Logo", pw: 3000, ph: 821, x0: 12, y0: 12, w: 2973, h: 794, label: "lockup" },
  wm: { f: "03_GOAL_ATHLETICS_Wordmark", pw: 2700, ph: 847, x0: 15, y0: 15, w: 2667, h: 814, label: "wordmark" },
} as const;
export type MarkKey = keyof typeof MARK;

// The V1.3 production PNGs, copied byte for byte from the design project's
// uploads/GOAL_ATHLETICS_V1.3_APPROVED_PALETTES_NO_ORANGE/01_PRODUCTION_ARTWORK.
const ART_ROOT = "/tempo/artwork/";
export const HEADER_LOCKUP = `${ART_ROOT}AutoCap-WhiteRed-Lockup.png`;
export const artFile = (ink: InkKey, m: MarkKey) =>
  `${ART_ROOT}${INK[ink].p}/GOAL_V13_${MARK[m].f}_${INK[ink].p}_300DPI_Transparent.png`;

/** [website colour, garment hex, ink, optional panel hex] */
type Colourway = readonly [string, string, InkKey] | readonly [string, string, InkKey, string];
/** [path d, stroke width] */
type Detail = readonly [string, number];

export interface ProofProduct {
  id: string;
  name: string;
  blank: string;
  /** viewBox width and height in inches */
  vb: readonly [number, number];
  mark: MarkKey;
  /** visible artwork width, inches */
  w: number;
  /** artwork centre x and top y, inches */
  cx: number;
  top: number;
  body: readonly string[];
  panels?: readonly string[];
  face?: string;
  front: readonly Detail[];
  back: readonly Detail[];
  dims: readonly string[];
  backArt?: { mark: MarkKey; w: number; cx: number; top: number; dims: readonly string[] };
  cw: readonly Colourway[];
  sizes: string;
  method: string;
  place: string;
  backPlace?: string;
  brief: string;
}

export const PRODUCTS: readonly ProofProduct[] = [
  { id: "P04", name: "CORE TRAINING TEE", blank: "Apliiq · Sport-Tek LST350 Women's PosiCharge Competitor Tee", vb: [26, 29], mark: "ga", w: 3.0, cx: 17, top: 5.85,
    body: ["M9.5,1.2 Q13,4.5 16.5,1.2 L20.8,2.4 L24.8,8.6 L22.05,10 L22,9.6 L22,27 L4,27 L4,9.6 L3.95,10 L1.2,8.6 L5.2,2.4 Z"],
    front: [["M9.5,1.2 Q13,4.5 16.5,1.2", 0.3], ["M4,26.4 L22,26.4", 0.05]], back: [["M9.5,1.2 Q13,2.2 16.5,1.2", 0.3], ["M4,26.4 L22,26.4", 0.05]],
    dims: ["M13,2.85 L17,2.85 L17,5.85", "M13,2.85 L13,11"],
    cw: [["Black", "#121212", "wr"], ["White", "#F7F7F5", "br"], ["Iron Grey", "#4B4F54", "sb"]],
    sizes: "XS–2XL (manufacturer XS–4XL; Apliiq combinations not yet verified)", method: "DTF transfer (Apliiq)",
    place: "Wearer's left chest. Top edge 3.00 in below the collar seam, measured level with CF. Art centre 4.00 in from CF toward the wearer's left (art edge 2.50 in from CF).",
    brief: "Brief target 2.25 in, raised to the 3.00 in GA minimum." },
  { id: "P02", name: "QUARTER ZIP", blank: "Tapstitch · WT0092-P001-V2 Women's Quarter-Zip Yoga Pullover", vb: [34, 29], mark: "ga", w: 3.0, cx: 21, top: 6.7,
    body: ["M13.5,3 L8.9,4.6 L1.5,26 L4.3,27 L9,13.5 L8.5,27 L25.5,27 L25,13.5 L29.7,27 L32.5,26 L25.1,4.6 L20.5,3 Q17,4.4 13.5,3 Z", "M13.5,3 L13.8,0.9 Q17,0.3 20.2,0.9 L20.5,3 Q17,4.4 13.5,3 Z"],
    front: [["M17,0.6 L17,9.7", 0.16], ["M16.75,0.9 L17.25,0.9 L17.25,1.9 L16.75,1.9 Z", 0.06], ["M8.5,26.3 L25.5,26.3", 0.05]], back: [["M8.5,26.3 L25.5,26.3", 0.05]],
    dims: ["M17,3.7 L21,3.7 L21,6.7"],
    cw: [["Black", "#141414", "wr"], ["White", "#F7F7F5", "br"], ["Light Purple", "#C8B9DE", "sb"]],
    sizes: "S–XL (supplier maximum is XL, so no 2XL)", method: "DTF transfer (Tapstitch)",
    place: "Wearer's left chest. Top edge 3.00 in below the collar seam, measured level with CF. Art centre 4.00 in from the zipper centreline; art edge 2.50 in clear of the zip.",
    brief: "Brief target 2.00 in, raised to the 3.00 in GA minimum." },
  { id: "P06", name: "TRAINING PANTS", blank: "Apliiq · Sport-Tek LPST800 Women's Travel Pants", vb: [22, 42], mark: "ga", w: 3.0, cx: 14.6, top: 10.5,
    body: ["M4.25,0.5 L17.75,0.5 L18.4,9 L17,39.5 L12,39.5 L11,11.5 L10,39.5 L5,39.5 L3.6,9 Z"], panels: ["M17.15,2 L17.85,2 L18.4,9 L17,39.5 L16.3,39.5 L17.7,9 Z", "M4.85,2 L4.15,2 L3.6,9 L5,39.5 L5.7,39.5 L4.3,9 Z"],
    front: [["M4.2,2 L17.8,2", 0.06], ["M10.6,2 L10.3,4.2 M11.4,2 L11.7,4.2", 0.08], ["M15.6,2 L17.75,8.2 M6.4,2 L4.25,8.2", 0.07], ["M16.35,39.3 L16.85,29.5 M5.65,39.3 L5.15,29.5", 0.12]],
    back: [["M4.2,2 L17.8,2", 0.06], ["M16.35,39.3 L16.85,29.5 M5.65,39.3 L5.15,29.5", 0.12]],
    dims: ["M14.6,2 L14.6,10.5"],
    backArt: { mark: "wm", w: 4.5, cx: 14.6, top: 5.0, dims: ["M14.6,2 L14.6,5"] },
    cw: [["Black/Black", "#141414", "wr", "#141414"], ["True Navy/White", "#1E2846", "cr", "#F2F2F0"], ["Deep Red/White", "#8E1B2A", "sw", "#F2F2F0"]],
    sizes: "XS–2XL (manufacturer XS–4XL; Apliiq combinations not yet verified)", method: "DTF transfer (Apliiq)",
    place: "Wearer's left upper thigh. Top edge 8.50 in below the waistband seam, centred on the front leg panel (art centre 3.65 in in from the outseam, at art mid-height). Clear of the slash pocket and colourblock panel.",
    backPlace: "Back of the wearer's right leg (opposite the front GA), at back-pocket height: top edge 3.00 in below the waistband seam, centred on the back leg panel. The pant has no back pocket. 4.50 in is the smallest size that measures ≥ 2 mm stroke and gap. Same ink as the front.",
    brief: "Brief target 1.75 in, raised to the 3.00 in GA minimum. Back wordmark is an owner addition. Black/Black uses a separate Apliiq listing." },
  { id: "P05", name: "TRAINING SHORTS", blank: "Apliiq · Sport-Tek LST485 Ladies Repeat Short (3.5 in inseam)", vb: [26, 15], mark: "ga", w: 3.0, cx: 17.6, top: 9.25,
    body: ["M6.5,0.5 L19.5,0.5 L19.9,3 L21.2,13 L13.9,13.4 L13,9.9 L12.1,13.4 L4.8,13 L6.1,3 Z"],
    front: [["M6.1,3 L19.9,3", 0.06], ["M13.95,12.8 L21.12,12.4 M12.05,12.8 L4.88,12.4", 0.05]], back: [["M6.1,3 L19.9,3", 0.06], ["M13.95,12.8 L21.12,12.4 M12.05,12.8 L4.88,12.4", 0.05]],
    dims: ["M17.6,13.2 L17.6,11.95"],
    cw: [["Black", "#141414", "wr"], ["Iron Grey", "#4B4F54", "sb"], ["True Navy", "#1E2846", "cr"]],
    sizes: "XS–2XL (manufacturer XS–4XL; Apliiq combinations not yet verified)", method: "DTF transfer (Apliiq)",
    place: "Wearer's left front leg. Bottom edge 1.25 in above the leg hem, art centre 3.30 in in from the side seam (at art mid-height). Clear of the waistband and phone pocket.",
    brief: "Brief target 1.75 in, raised to the 3.00 in GA minimum. Tightest fit in the range: confirm on the XS leg panel template." },
  { id: "P01", name: "WARMUP HOODIE", blank: "Apliiq · Bella+Canvas 7519 Women's Classic Hoodie Sweatshirt", vb: [34, 32], mark: "ga", w: 3.25, cx: 17, top: 9.9,
    body: ["M12,5.6 L7.6,7.2 L1.2,26.5 L4.2,27.6 L7.8,16 L7.4,31 L26.6,31 L26.2,16 L29.8,27.6 L32.8,26.5 L26.4,7.2 L22,5.6 Z", "M12,5.6 Q10.5,0.4 17,0.4 Q23.5,0.4 22,5.6 Q17,8.2 12,5.6 Z"],
    face: "M13.6,5.5 Q13,1.7 17,1.7 Q21,1.7 20.4,5.5 Q17,7.1 13.6,5.5 Z",
    front: [["M7.4,29.6 L26.6,29.6", 0.06], ["M1.6,25.3 L4.6,26.4 M32.4,25.3 L29.4,26.4", 0.06]], back: [["M17,0.4 L17,6.9", 0.06], ["M7.4,29.6 L26.6,29.6", 0.06], ["M1.6,25.3 L4.6,26.4 M32.4,25.3 L29.4,26.4", 0.06]],
    dims: ["M17,6.9 L17,9.9"],
    cw: [["Black", "#161616", "wr"], ["Vintage White", "#ECE5D6", "br"], ["Navy", "#222B45", "cr"]],
    sizes: "S–2XL (manufacturer S–2XL; Apliiq combinations not yet verified)", method: "DTF transfer (Apliiq)",
    place: "Centre front. Top edge 3.00 in below the hood seam at CF, centred on CF. No drawcord.",
    brief: "Brief target 3.25 in kept (above the 3.00 in minimum)." },
  { id: "P03", name: "TRAINING TEE", blank: "Tapstitch · WT0216-P001-V2 Women's Regular Fit Crewneck T-Shirt", vb: [26, 28], mark: "lk", w: 7.0, cx: 13, top: 5.8,
    body: ["M9.6,1.2 Q13,4.4 16.4,1.2 L20.6,2.4 L24.6,8.4 L21.8,9.8 L21.75,9.4 L21.75,26.4 L4.25,26.4 L4.25,9.4 L4.2,9.8 L1.4,8.4 L5.4,2.4 Z"],
    front: [["M9.6,1.2 Q13,4.4 16.4,1.2", 0.3], ["M4.25,25.8 L21.75,25.8", 0.05]], back: [["M9.6,1.2 Q13,2.2 16.4,1.2", 0.3], ["M4.25,25.8 L21.75,25.8", 0.05]],
    dims: ["M13,2.8 L13,5.8"],
    cw: [["White", "#F7F7F5", "br"], ["Red", "#C3132B", "sw"], ["Purple", "#6B3F99", "sb"]],
    sizes: "S–2XL (verified on Tapstitch)", method: "DTF transfer (Tapstitch)",
    place: "Centre front. Top edge 3.00 in below the collar seam at CF, centred on CF.",
    brief: "Brief target 7.00 in kept (above the 6.00 in lockup minimum). Fit: title says regular, spec field says slim-fit; unresolved." },
  { id: "P07", name: "TRAINING LEGGINGS", blank: "Printful · #3012 All-Over Print Leggings with Pockets", vb: [20, 40], mark: "ga", w: 3.0, cx: 13, top: 9.0,
    body: ["M4,0.5 L16,0.5 L16.6,10 L15.2,37.5 L11.2,37.5 L10,12.5 L8.8,37.5 L4.8,37.5 L3.4,10 Z"],
    front: [["M3.78,4 L16.22,4", 0.06], ["M15.5,4 L15.35,12.5 L16.45,12.5 M4.5,4 L4.65,12.5 L3.55,12.5", 0.06], ["M10,12.5 L10.6,13.6 L10,15 L9.4,13.6 Z", 0.05]],
    back: [["M3.78,4 L16.22,4", 0.06], ["M15.5,4 L15.35,12.5 L16.45,12.5 M4.5,4 L4.65,12.5 L3.55,12.5", 0.06]],
    dims: ["M13,4 L13,9"],
    cw: [["Custom Black", "#0E0E10", "wr"], ["Custom Charcoal", "#3A3D42", "sb"], ["Custom Navy", "#1B2442", "cr"]],
    sizes: "2XS–2XL (Printful lists 2XS–6XL; not re-verified this session)", method: "All-over print (Printful cut-and-sew)",
    place: "Wearer's left front thigh. Top edge 5.00 in below the waistband seam, art centre 3.00 in from the front centre line. Must sit inside the printable left-leg panel on the 2XS template.",
    brief: "Brief target 1.50 in, raised to the 3.00 in GA minimum. Background colours are our print values (#0E0E10, #3A3D42, #1B2442), not stock fabrics." },
];

// ── Derived view model (the design's renderVals, line for line) ──

export interface ProofPath { d: string; fill: string; stroke: string; sw: number; dash: string }
export interface ArtStyle { left: string; top: string; width: string }
export interface ProofView { title: string; ink: string; art: string; hasArt: boolean; artStyle: ArtStyle | null; paths: ProofPath[] }
export interface ProofProductView {
  order: string; label: string; name: string; blank: string; vb: string; grid: string;
  views: ProofView[]; spec: { k: string; v: string }[];
}
export interface Swatch { product: string; colour: string; hex: string; ink: string; art: string; artPct: string }
export interface AssetRow { file: string; mark: string; colour: string; fmt: string }
export interface Check { name: string; status: string; color: string; note: string }

const light = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255) > 150;
};
const fmt = (n: number) => n.toFixed(2);
const mm = (n: number) => (n * 25.4).toFixed(1);

export function gridPath(w: number, h: number) {
  let d = "";
  for (let x = 1; x < w; x++) d += `M${x},0 L${x},${h} `;
  for (let y = 1; y < h; y++) d += `M0,${y} L${w},${y} `;
  return d;
}

export function buildProofs({ showGrid = true, showDims = true }: { showGrid?: boolean; showDims?: boolean } = {}) {
  const products: ProofProductView[] = PRODUCTS.map((p, i) => {
    const m = MARK[p.mark];
    const h = (p.w * m.h) / m.w;
    const [vw, vh] = p.vb;
    const x0 = p.cx - p.w / 2;
    const styleFor = (mk: MarkKey, w: number, cx: number, top: number): ArtStyle => {
      const M = MARK[mk];
      return {
        left: `${((cx - w / 2 - (w * M.x0) / M.w) / vw) * 100}%`,
        top: `${((top - (w * M.y0) / M.w) / vh) * 100}%`,
        width: `${((w * M.pw) / M.w / vw) * 100}%`,
      };
    };
    const artStyle = styleFor(p.mark, p.w, p.cx, p.top);
    const ba = p.backArt;
    const bh = ba ? (ba.w * MARK.wm.h) / MARK.wm.w : 0;
    const mk = (c: Colourway, side: "front" | "back"): ProofPath[] => {
      const hex = c[1];
      const det = light(hex) ? "rgba(0,0,0,0.28)" : "rgba(255,255,255,0.22)";
      const paths: ProofPath[] = p.body.map((d) => ({ d, fill: hex, stroke: "rgba(0,0,0,0.4)", sw: 0.06, dash: "none" }));
      (p.panels || []).forEach((d) => paths.push({ d, fill: c[3] ?? hex, stroke: "rgba(0,0,0,0.3)", sw: 0.04, dash: "none" }));
      if (side === "front" && p.face) paths.push({ d: p.face, fill: "rgba(0,0,0,0.3)", stroke: "none", sw: 0, dash: "none" });
      p[side].forEach(([d, sw]) => paths.push({ d, fill: "none", stroke: det, sw, dash: "none" }));
      if (side === "back" && ba && showDims) {
        ba.dims.forEach((d) => paths.push({ d, fill: "none", stroke: "#E51226", sw: 0.07, dash: "0.25 0.18" }));
        paths.push({ d: `M${ba.cx - ba.w / 2},${ba.top} h${ba.w} v${bh} h${-ba.w} Z`, fill: "none", stroke: "#E51226", sw: 0.05, dash: "0.2 0.15" });
      }
      if (side === "front" && showDims) {
        p.dims.forEach((d) => paths.push({ d, fill: "none", stroke: "#E51226", sw: 0.07, dash: "0.25 0.18" }));
        paths.push({ d: `M${x0},${p.top} h${p.w} v${h} h${-p.w} Z`, fill: "none", stroke: "#E51226", sw: 0.05, dash: "0.2 0.15" });
      }
      return paths;
    };
    const views: ProofView[] = p.cw.map((c) => ({
      title: c[0].toUpperCase() + " · FRONT", ink: INK[c[2]].name + " " + m.label, art: artFile(c[2], p.mark), hasArt: true, artStyle, paths: mk(c, "front"),
    }));
    if (ba) {
      p.cw.forEach((c) => views.push({
        title: c[0].toUpperCase() + " · BACK", ink: INK[c[2]].name + " wordmark", art: artFile(c[2], ba.mark), hasArt: true,
        artStyle: styleFor(ba.mark, ba.w, ba.cx, ba.top), paths: mk(c, "back"),
      }));
    } else {
      views.push({ title: p.cw[0][0].toUpperCase() + " · BACK", ink: "Undecorated", art: "", hasArt: false, artStyle: null, paths: mk(p.cw[0], "back") });
    }
    const order = String(i + 1).padStart(2, "0");
    return {
      order, label: `${order} ${p.name}`, name: "TEMPO " + p.name, blank: p.blank, vb: `0 0 ${vw} ${vh}`, grid: showGrid ? gridPath(vw, vh) : "", views,
      spec: [
        { k: "Artwork", v: `V1.3 ${m.label === "GA" ? "GA monogram" : "GA + GOAL ATHLETICS horizontal lockup"} · ${fmt(p.w)} × ${fmt(h)} in (${mm(p.w)} × ${mm(h)} mm), visible artwork, tight-cropped` },
        { k: "Placement", v: p.place },
        { k: "Ink by colour", v: p.cw.map((c) => `${c[0]}: ${INK[c[2]].name}`).join(" · ") },
        { k: "Method", v: p.method },
        { k: "Sizes", v: p.sizes + ". Print fits the smallest size." },
        { k: ba ? "Back" : "Back, sleeves", v: ba ? `V1.3 GOAL ATHLETICS wordmark · ${fmt(ba.w)} × ${fmt(bh)} in (${mm(ba.w)} × ${mm(bh)} mm), visible artwork. ${p.backPlace}` : "Undecorated" },
        { k: "Size note", v: p.brief },
        { k: "Files", v: [...new Set(p.cw.flatMap((c) => [artFile(c[2], p.mark), ...(ba ? [artFile(c[2], ba.mark)] : [])].map((f) => f.split("/").pop() as string)))].join(" · ") },
      ],
    };
  });

  const swatches: Swatch[] = [];
  PRODUCTS.forEach((p) => p.cw.forEach((c) => swatches.push({
    product: p.name, colour: c[0], hex: c[1], ink: INK[c[2]].name + " " + MARK[p.mark].label, art: artFile(c[2], p.mark), artPct: p.mark === "lk" ? "72%" : "38%",
  })));

  const assets: AssetRow[] = [];
  (["wr", "br", "cr", "sb", "sw"] as const).forEach((k) => (["ga", "lk", "wm"] as const).forEach((mk) => {
    if (mk === "wm" && !(["wr", "cr", "sw"] as readonly string[]).includes(k)) return;
    const m = MARK[mk];
    assets.push({
      file: `${INK[k].p}/GOAL_V13_${m.f}_${INK[k].p}_300DPI_Transparent.png (+ .svg, .pdf)`,
      mark: mk === "ga" ? "GA monogram" : mk === "lk" ? "Horizontal lockup" : "Wordmark",
      colour: INK[k].name,
      fmt: `PNG ${m.pw}×${m.ph} px @300 ppi (${fmt(m.pw / 300)} in); SVG/PDF vector`,
    });
  }));
  assets.push({ file: "uploads/AutoCap-WhiteRed-Lockup.png", mark: "Header lockup", colour: "White + red", fmt: "PNG, document header only" });

  const G = "#1F7A3A", Y = "#B26B00";
  const checks: Check[] = [
    { name: "P01 · Bella+Canvas 7519 (Apliiq)", status: "NOT VERIFIED", color: Y, note: "Apliiq page blocked from this session. Colours, composition, size combinations and print areas need checking on the live page." },
    { name: "P02 · Tapstitch WT0092", status: "VERIFIED", color: G, note: "Live page: S–XL, 4 colours, 91% polyester / 9% spandex, 165 gsm, mock neck, thumbholes, DTF. Fit field reads \"Bodycon\". Colour names not readable in page text; confirm Black, White, Light Purple. International fulfilment." },
    { name: "P03 · Tapstitch WT0216", status: "VERIFIED", color: G, note: "Live page: S–2XL, 5 colours, 100% polyester, 130 gsm, DTF. Title says regular fit; Fit field says Slim-fit. Colour names to confirm (White, Red, Purple)." },
    { name: "P04 · Sport-Tek LST350 (Apliiq)", status: "NOT VERIFIED", color: Y, note: "Apliiq page blocked from this session. Confirm Black, White, Iron Grey and XS–2XL availability." },
    { name: "P05 · Sport-Tek LST485 (Apliiq)", status: "NOT VERIFIED", color: Y, note: "Apliiq page blocked from this session. Confirm colours, 3.5 in inseam, print area on the leg." },
    { name: "P06 · Sport-Tek LPST800 (Apliiq)", status: "PARTLY", color: Y, note: "Live page: embroidery and DTF offered; 100% recycled polyester, moisture-wicking, drawcord, side slash pockets, tapered leg, extended side zippers, colourblock. Print-size table did not load. Page copy mentions \"branding inside the neck\", likely template text; ask Apliiq." },
    { name: "P07 · Printful #3012", status: "NOT VERIFIED", color: Y, note: "Page text did not load product details. Templates, region material (US 78/22 vs EU recycled blend) and size range need checking." },
  ];

  const open = [
    "Supplier blank photos for each of the 21 colourways (front and back). Website images (63) cannot be made without them.",
    "Apliiq pages for P01, P04, P05 and Printful #3012 need checking by you or with access; colour names and print areas are unconfirmed.",
    "Supplier minimum artwork size per product and placement (Tapstitch DTF, Printful AOP). The 3.00 in GA rises further if a supplier asks for more.",
    "Printful #3012 panel templates, to build the full leggings print files.",
    "Training Tee fit wording (regular vs slim) needs the size chart.",
    "Next phase: outfit pairings, collection and product-page previews, product copy, print files and the Claude Code handoff package.",
  ].map((t, i) => ({ n: String(i + 1), t }));

  return { showGrid, showDims, products, swatches, assets, checks, open };
}
