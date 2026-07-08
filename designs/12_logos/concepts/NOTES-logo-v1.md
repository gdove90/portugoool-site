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
