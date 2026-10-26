/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { Anton } from "next/font/google";
import { buildProofs, HEADER_LOCKUP } from "@/lib/tempo-proofs";

// The design sets its headings in Anton. The storefront shell maps the
// `font-display` class to Inter, so the face is loaded here and applied
// inline, where the shell's rule cannot override it.
const anton = Anton({ weight: "400", subsets: ["latin"], display: "swap" });
const display: CSSProperties = { fontFamily: anton.style.fontFamily, fontWeight: 400 };

// ─────────────────────────────────────────────────────────────
// TEMPO placement proofs: the Claude Design sheet "TEMPO Collection.dc.html"
// (26 Oct 2026) rendered from src/lib/tempo-proofs.ts. Layout, type and
// colour follow the design's own inline styles (Anton display, #E51226
// accent, 1 in grid) rather than the storefront tokens, because this is
// a proof document, not a shop page. Owner-only; see
// src/app/references/tempo/page.tsx.
//
// Artwork <img>s are plain elements on purpose: each is positioned by
// percentage inside an SVG's box and scaled by the PNG's padding, which
// next/image's fixed-size contract cannot express.
// ─────────────────────────────────────────────────────────────

const PAD = "clamp(20px, 4vw, 56px)";
const muted = "rgba(10,10,10,0.72)";
const faint = "rgba(10,10,10,0.6)";
const rule = "1px solid rgba(10,10,10,0.12)";

function Band({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return <div style={{ padding: `48px ${PAD}`, borderTop: rule, display: "flex", flexDirection: "column", gap: 20, ...style }}>{children}</div>;
}
function Title({ children }: { children: React.ReactNode }) {
  return <div style={{ ...display, fontSize: 40, lineHeight: 1 }}>{children}</div>;
}

export default function TempoProofs({ showGrid = true, showDims = true }: { showGrid?: boolean; showDims?: boolean }) {
  const v = buildProofs({ showGrid, showDims });
  return (
    <div style={{ color: "#0A0A0A", background: "#FFFFFF", minHeight: "100vh" }}>
      <div style={{ background: "#0A0A0A", padding: `28px ${PAD}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <img src={HEADER_LOCKUP} alt="GOAL Athletics" style={{ height: 48, width: "auto", display: "block" }} />
        <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 15 }}>TEMPO women&apos;s collection · placement proofs · 26 Oct 2026</div>
      </div>

      <div style={{ padding: `48px ${PAD} 24px`, display: "flex", flexDirection: "column", gap: 12 }}>
        <h1 style={{ ...display, fontSize: "clamp(40px, 6vw, 76px)", lineHeight: 0.95, margin: 0, fontWeight: 400 }}>TEMPO · 7 PRODUCTS · 21 COLOURWAYS</h1>
        <p style={{ fontSize: 19, lineHeight: 1.5, color: muted, maxWidth: 900, margin: 0, textWrap: "pretty" }}>
          Women&apos;s training range in the GOAL Athletics V1.3 identity. One front decoration per garment. Backs and sleeves are plain, except the Training Pants back wordmark. Garments are drawn as flat placement proofs at the smallest size, 1 square = 1 in, with the real V1.3 artwork at production size. They are not product photos: the website images need supplier blank photos.
        </p>
      </div>

      <div style={{ padding: `8px ${PAD} 40px`, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 16 }}>
        {[
          ["RULE APPLIED", "Logo sizes follow our minimums: GA 3.00 in wide, lockup 6.00 in or more. Brief widths of 1.50 to 2.25 in were raised to 3.00 in."],
          ["SIZE RUN", "Smallest supplier size up to 2XL. Every print fits the smallest size. The Quarter Zip stops at XL, so it has no 2XL."],
          ["MEASURED AT FINAL SIZE", "GA at 3.00 in: 1.75 mm stroke at the pointed G/A tips, 3.33 mm gap. Lockup at 7.00 in clears 6.00 in. Each supplier's own minimum still needs checking."],
        ].map(([k, t]) => (
          <div key={k} style={{ background: "#0A0A0A", color: "#FFFFFF", padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: "#E51226" }}>{k}</div>
            <div style={{ fontSize: 17, lineHeight: 1.45 }}>{t}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: `24px ${PAD}`, display: "flex", flexDirection: "column", gap: 20 }}>
        <Title>21 COLOURWAYS</Title>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
          {v.swatches.map((s) => (
            <div key={s.product + s.colour} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.12)", background: s.hex }}>
                <img src={s.art} alt={s.ink} style={{ width: s.artPct, height: "auto", display: "block" }} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em" }}>{s.product}</div>
              <div style={{ fontSize: 15, lineHeight: 1.3 }}>{s.colour}</div>
              <div style={{ fontSize: 13, color: faint }}>{s.ink}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 14, color: faint, maxWidth: 900, lineHeight: 1.5 }}>Garment swatches are display approximations, not supplier colour standards. Leggings values are our print design values. Purple (Training Tee) and Light Purple (Quarter Zip) are separate supplier shades.</div>
      </div>

      {v.products.map((p) => (
        <section key={p.order} id={`tempo-${p.order}`} aria-label={p.label} style={{ padding: `48px ${PAD}`, borderTop: rule, display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <span style={{ ...display, fontSize: 22, color: "#E51226" }}>{p.order}</span>
              <h2 style={{ ...display, fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.05, margin: 0, fontWeight: 400 }}>{p.name}</h2>
            </div>
            <span style={{ fontSize: 17, color: "rgba(10,10,10,0.7)" }}>{p.blank}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 12 }}>
            {p.views.map((view) => (
              <div key={view.title} style={{ background: "#E6E6E3", padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ position: "relative" }}>
                  <svg viewBox={p.vb} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label={`${p.name}, ${view.title.toLowerCase()}`}>
                    {v.showGrid && <path d={p.grid} stroke="rgba(10,10,10,0.08)" strokeWidth={0.04} fill="none" />}
                    {view.paths.map((g, i) => (
                      <path key={i} d={g.d} fill={g.fill} stroke={g.stroke} strokeWidth={g.sw} strokeDasharray={g.dash} strokeLinecap="round" />
                    ))}
                  </svg>
                  {view.hasArt && view.artStyle && (
                    <img src={view.art} alt={view.ink} style={{ position: "absolute", left: view.artStyle.left, top: view.artStyle.top, width: view.artStyle.width, height: "auto", display: "block", pointerEvents: "none" }} />
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 14 }}>
                  <span style={{ fontWeight: 700, letterSpacing: "0.08em" }}>{view.title}</span>
                  <span style={{ color: "rgba(10,10,10,0.65)", textAlign: "right" }}>{view.ink}</span>
                </div>
              </div>
            ))}
          </div>
          <dl style={{ display: "grid", gridTemplateColumns: "minmax(90px, 140px) minmax(0, 1fr)", gap: "8px 20px", fontSize: 16, lineHeight: 1.45, maxWidth: 1100, margin: 0 }}>
            {p.spec.map((r) => (
              <div key={r.k} style={{ display: "contents" }}>
                <dt style={{ fontWeight: 700 }}>{r.k}</dt>
                <dd style={{ margin: 0, textWrap: "pretty", wordBreak: r.k === "Files" ? "break-all" : undefined }}>{r.v}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <Band>
        <Title>ASSET REGISTER</Title>
        <div style={{ overflowX: "auto" }}>
          <div role="table" style={{ display: "grid", gridTemplateColumns: "minmax(260px, 2.2fr) minmax(110px, 1fr) minmax(110px, 1fr) minmax(200px, 1.6fr)", minWidth: 720, fontSize: 15, lineHeight: 1.4 }}>
            {["File", "Mark", "Colour", "Format · size"].map((h) => (
              <div key={h} role="columnheader" style={{ fontWeight: 700, padding: "8px 10px", borderBottom: "2px solid #0A0A0A" }}>{h}</div>
            ))}
            {v.assets.map((a) => (
              <div key={a.file} role="row" style={{ display: "contents" }}>
                <div role="cell" style={{ padding: "8px 10px", borderBottom: rule, wordBreak: "break-all" }}>{a.file}</div>
                <div role="cell" style={{ padding: "8px 10px", borderBottom: rule }}>{a.mark}</div>
                <div role="cell" style={{ padding: "8px 10px", borderBottom: rule }}>{a.colour}</div>
                <div role="cell" style={{ padding: "8px 10px", borderBottom: rule }}>{a.fmt}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 15, color: "rgba(10,10,10,0.7)", maxWidth: 900, lineHeight: 1.5, textWrap: "pretty" }}>Source: uploads/GOAL_ATHLETICS_V1.3_APPROVED_PALETTES_NO_ORANGE/01_PRODUCTION_ARTWORK. Originals are unchanged. The pack notes the paths are a vector reconstruction from a low-resolution reference, and RGB values are approximate, not Pantone. Embroidery files are not included.</div>
      </Band>

      <Band>
        <Title>SUPPLIER CHECK · 26 OCT 2026</Title>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 12 }}>
          {v.checks.map((c) => (
            <div key={c.name} style={{ background: "#F3F3F1", padding: 18, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: c.color }}>{c.status}</span>
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.45, color: "rgba(10,10,10,0.75)", textWrap: "pretty" }}>{c.note}</div>
            </div>
          ))}
        </div>
      </Band>

      <Band style={{ paddingBottom: 72, gap: 16 }}>
        <Title>OPEN ITEMS</Title>
        <ol style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 1000, margin: 0, padding: 0, listStyle: "none" }}>
          {v.open.map((o) => (
            <li key={o.n} style={{ display: "grid", gridTemplateColumns: "28px minmax(0, 1fr)", gap: 8, fontSize: 16, lineHeight: 1.45 }}>
              <span style={{ ...display, color: "#E51226" }}>{o.n}</span>
              <span style={{ textWrap: "pretty" }}>{o.t}</span>
            </li>
          ))}
        </ol>
      </Band>
    </div>
  );
}
