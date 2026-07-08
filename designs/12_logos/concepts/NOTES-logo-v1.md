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
