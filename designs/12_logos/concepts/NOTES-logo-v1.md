# Logo v1 — review notes (2026-07-08)

Source: ChatGPT concept, `logo-v1_brand-sheet.png`. Strong direction —
the P+spark monogram and red-OOO wordmark are keepable. **Not yet
production-ready.** Fix list before any vectorization or use:

## Must fix (legal)
1. **Star rationale.** The sheet says the star is "inspired by the star
   above the Portugal crest." The 4-point spark shape itself is generic
   and fine — but the *stated meaning* ties us to FPF symbolism. Official
   story going forward: the spark is **the moment of the goal** — the
   flash when it hits the net. Never reference the crest, anywhere.
2. **Application mockups on the sheet** (jersey/cap/hoodie row) contain
   swoosh-like marks drawn by the AI — that row is decoration only,
   never a production reference.

## Must fix (brand consistency)
3. **Spelling.** Sheet renders PORTUG**OOOOO**L (5 O's). Canonical is
   **PORTUGOOOL** (OOO — three O's), matching the site, domain, and
   logo-guidelines.md. Redraw with three.
4. **Palette drift.** Sheet uses `#111111` black and `#F5F2EA` cream.
   Canonical tokens: ink `#0A0A0A`, smoke `#F4F4F2` (colors.md). Green
   name is "Nation Green," not "Portugal Green."
5. **Body font.** Sheet proposes Inter for body; production uses the
   system stack (typography.md). Not adopting Inter without a
   typography.md decision first.

## Keep
- P + spark monogram construction (works at favicon size)
- Red OOO treatment inside the wordmark
- Variant system: primary / monochrome / reverse / icon-only / wordmark-only
- Anton for headline type (matches production)

## Next steps
- [ ] Iterate in ChatGPT with the fixes above, or approve v1 direction
- [ ] Vector redraw as clean SVG (monogram + wordmark) → `../svg/`
- [ ] Produce light/dark/gold variants per ../README.md
- [ ] Then: site header, favicon, OG image rollout


---

# Logo v2 — APPROVED DIRECTION + vectorized (2026-07-08)

- `logo-v2_final-sheet.png` — approved ChatGPT sheet: correct PORTUGOOOL
  spelling (three O's), exact brand hexes, no crest/star references,
  slash-cut OOO monogram. Official mark meaning: **the slash is the
  moment the ball crosses the line.**
- `logo-v2_vector-proof.png` — render proof of the production SVGs.
- **Production masters live in `../svg/`** (outlined paths, no font
  dependency; wordmark + monogram built from Anton glyphs, skewX −8°):
  wordmark primary/only/reverse×2/gold · monogram red/ink/paper/gold.
- Remaining rollout: site header, favicon, OG image, embroidery digitize
  check for the cap.


---

# GOOOL draft bank (2026-07-08) — future reference, not current direction

Filed as raw material to call upon later:

- `goool-drafts_wordmark-styles.png` — 5 alternate wordmark treatments:
  slash-cut heavy italic · thin condensed red · gold rounded ·
  interlocking-O geometric (the most interesting alternate — Audi-ring
  energy, could become a pattern/sock knit) · crown mark (caution: crowns
  drift toward Real Madrid associations; use judiciously if ever).
- `goool-drafts_apparel-applications.png` (.SHOP) and
  `goool-drafts_apparel-applications-dotcom.png` (.COM) — full application
  boards: embroidery patch styles (the raised red OOO puff patch is
  excellent), tonal black-on-black garment marks, sponsor-placement map
  (front/chest/sleeve/back-neck/lower-back/sock), 5 colorway lockups
  (navy + dark green are new — not in colors.md; formalize before use).

Caveats:
1. **Domain suffix:** sheets show ".COM" and ".SHOP" — we own goool.shop
   only. Any produced asset uses .SHOP or no suffix. Suffix-free marks
   preferred on garments (domain ≠ logo on premium apparel).
2. The striped jersey mocks include AI-drawn crests and a le-coq-like
   sponsor mark — those rows are layout reference only, never print.
3. Current approved system remains the v2 slashed-OOO + GOOOL wordmark
   (../svg/). These drafts don't supersede it.


---

# Echo Mark adopted as favicon (2026-07-08)

- Source: GOOOL brand handoff (`../handoff_goool-brand/`), "Concept 01 ·
  The Echo" — dot + three expanding arcs (red/red/gold), the scream
  radiating from the moment.
- **Role split (updated 2026-07-08, owner call: "I like the echo on
  shirts too"):** the Echo is a **full brand mark** — digital identity
  (favicon/app/avatar) AND apparel. On garments: left-chest badge
  (embroidery, the Polo-pony play), sleeve hit, or large back print.
  The slashed-OOO remains the typographic monogram; the two never appear
  side by side on the same garment panel.
- Masters: `../svg/monogram-echo.svg` (transparent) and
  `monogram-echo-tile.svg` (ink tile). Live: `src/app/icon.svg` +
  `apple-icon.png` — verified legible at 16px on light and dark chrome.


---

# Logo v3 — GOL mark (2026-07-08, owner: "we will use for designs")

`logo-v3_gol-brand-sheet.png` — gold condensed GOL wordmark, slash cut
through the O (same blade gesture as the OOO monogram), tagline
"THE LANGUAGE OF THE GAME", minimal marks (solo slash · G · slashed O ·
L), badge/garment/sponsor-placement examples, 9 colorways.

## Role in the mark system (pending vectorization)
GOL = the **garment wordmark for house/global designs** — short, embroiders
clean at small sizes, reads in every language. Joins:
- Echo — digital identity + apparel badge
- Slashed-OOO — typographic monogram
- GOOOL wordmark — site/lockups
- Collection portmanteaus (PORTUGOOOL / ENGOOOLAND) — per-collection

## To resolve before production use
1. **Tagline conflict:** sheet introduces "The Language of the Game" —
   voice.md currently sanctions exactly two brand lines. Adopt as third,
   swap for one, or treat as GOL-mark-only lockup line? Owner call.
2. **New colorway variants** (blue, bright red, green-on-black) not in
   palette — formalize any that get used.
3. **Trademark note:** "GOL" collides with GOL Linhas Aéreas (airline)
   and GolTV (media) — different classes than apparel, but include GOL in
   the USPTO Class 25 clearance alongside GOOOL before printing it on
   garments for sale.
4. The track-jacket application mock has generic twin sleeve stripes —
   fine, but keep actual production away from three-stripe territory.
5. Vector redraw needed (same pipeline as v2) before any production file.
