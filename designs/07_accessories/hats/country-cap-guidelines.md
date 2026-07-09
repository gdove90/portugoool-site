# Country Cap Design System

One system for every country-branded GOOOL cap. Only the country name,
accent colors, and side crest change — nothing else. If a cap needs
something this document doesn't allow, the document changes first.

Generator (single source of truth for all art):
`scratchpad logogen/gen-country-caps.js` — regenerates every country
cap's embroidery files from the constants below. Never hand-place art.

Blank: **Yupoong 6245CM dad hat** — brushed cotton twill, structured
low-profile crown, curved brim, adjustable strap with metal buckle.
Placements: `embroidery_front_large` (1650×600), `embroidery_left`
(600×300), `embroidery_back` (600×300).

---

## Front lockup (embroidery_front_large, 1650×600)

Structure — always two lines, both centered:
1. **GOOOL** — extended wordmark (traced master
   `designs/12_logos/svg/goool-extended-wordmark-*.svg`), never redrawn
2. **COUNTRY NAME** — Anton, tracked

| Rule | Value |
|---|---|
| GOOOL width | **1050px** of the 1650 area (~64%) |
| Lockup top | **y = 175** of 600 (~29% down — sits low on the crown, ~1.0–1.2" below the top button, never floating at the button) |
| Gap GOOOL → name | **40px** |
| Country name size | **120px** Anton, tracking 0.5em, max width 820px (auto-shrinks for long names) |
| Bottom clearance | lockup bottom ≈ y 465 — never crowds the brim seam |

Hierarchy: GOOOL bold and dominant; country name refined and clearly
secondary, but legible from across a room.

## Side crest (embroidery_left, 600×300)

- Flag-inspired **heater shield** only — never an official federation
  crest, never protected sports marks. National flags are public domain
  (owner call, 2026-07-09); federation crests are not.
- Shield master path at **0.85 scale** (170×208), optically centered in
  the side area. Same size and position on every country cap.
- The crest is a premium accent, not the main event.
- Outline color: pick the country's anchor dark (England navy, Argentina
  gold) so the shield holds on any cap color.

## Back (embroidery_back, 600×300)

- **GOOOL** wordmark, **380px wide**, centered above the opening.
- Thread: the cap's primary contrast color (navy on white caps, white on
  dark caps). Same size on every cap, no exceptions.

## Color adaptation

- Cap body: one solid base color per SKU (multi-panel only if a product
  is deliberately designed that way).
- Thread palette: 2–3 colors max per cap, from the country's flag plus
  brand tokens. Front GOOOL takes the strongest contrast; country name
  takes the accent.
- Every pairing must hold contrast at 6ft — if the accent disappears on
  the cap color (e.g. red on red), fall back to white.

Current colorways:

| Cap | Body | GOOOL | Name | Shield |
|---|---|---|---|---|
| England White | White | Navy #0A1F3C | Red #C1121F | white/red cross, navy edge |
| England Navy | Navy | White | Red #C1121F | same |
| England Red | Cranberry | White | White | same |
| Argentina White | White | Navy #0A1F3C | Sky #75AADB | celeste bands, gold sun+edge |
| Argentina Sky | Light Blue | White | White | same |
| Italy Navy | Navy | White | Green #008C45 | tricolore vertical, gold edge |
| Italy White | White | Navy #0A1F3C | Green #008C45 | same |
| Netherlands Navy | Navy | White | Orange #F36C21 | r/w/b horizontal, gold edge |
| Germany Black | Black | White | Red #DD0000 | black/red/gold horizontal, gold edge |
| Germany White | White | Ink #0A0A0A | Red #DD0000 | same |
| Belgium Red | Cranberry | Gold #C9A227 | Black #0A0A0A | black/yellow/red vertical, gold edge |
| Belgium Black | Black | Gold #C9A227 | Red #EF3340 | same |
| Norway Navy | Navy | White | Red #BA0C2F | Nordic cross, white edge |
| Norway Red | Cranberry | White | White | same |
| Spain Black | Black | Gold #C9A227 | Red #AA151B | red/yellow/red horizontal (wide center), gold edge |
| Spain Red | Cranberry | Gold #C9A227 | Gold #C9A227 | same |
| France Navy | Navy | White | Red #ED2939 | b/w/r vertical, gold edge |
| France White | White | Navy #0A1F3C | Red #ED2939 | same |

Known gap: **Netherlands Orange** — the 6245CM blank has no orange;
colorway ships when an orange structured blank is sourced.

## Adding a new country

1. Add a `front()` call per colorway + one `shield<Country>()` to the
   generator — constants stay untouched.
2. Shield = flag language simplified to ≤4 solid colors, no gradients,
   no strokes under 1.5mm at production scale.
3. Mockups: front + left-front angles, filed under
   `designs/07_accessories/hats/mockups/<country>/`.
4. Product copy pattern: body color, thread colors, "The
   [flag element] on the side, GOOOL on the back."
5. $35, `category: accessory`, supplier Printful (product 206).

## Legal (hard rules)

National flag imagery: allowed. Official federation crests (FA Three
Lions, AFA laurels), FIFA/UEFA marks, player references: never.
