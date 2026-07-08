# Colors

The palette is Portugal-inspired but original — deep red, dark green, gold.
These values are live in production (`tailwind.config.ts`); this file is the
canonical reference. Change here first, then in code.

## Primary Colors

| Name | HEX | RGB | Tailwind token |
|---|---|---|---|
| Ink (near-black) | `#0A0A0A` | 10, 10, 10 | `ink` |
| Paper (white) | `#FFFFFF` | 255, 255, 255 | `paper` |
| Match Red | `#C1121F` | 193, 18, 31 | `red` |

## Secondary Colors

| Name | HEX | RGB | Tailwind token |
|---|---|---|---|
| Nation Green | `#0B3D2E` | 11, 61, 46 | `green` |
| Green Light | `#125A43` | 18, 90, 67 | `green-light` |
| Red Dark (hover) | `#8E0D17` | 142, 13, 23 | `red-dark` |
| Smoke (section bg) | `#F4F4F2` | 244, 244, 242 | `smoke` |

## Collection Colors
| Name | HEX | Scope |
|---|---|---|
| England Navy | `#0A1F3C` | The England Collection (Drop 02) garments + swatches only — not a site UI token |

## Accent Colors

| Name | HEX | RGB | Tailwind token |
|---|---|---|---|
| Gold | `#C9A227` | 201, 162, 39 | `gold` |
| Gold Light | `#E4C65B` | 228, 198, 91 | `gold-light` |

## Usage Rules
- **Red** = action. Primary CTAs ("Shop the Drop", "Buy Now") and scarcity
  signals only. Never for body text or large background fields on white.
- **Gold** = premium + drop identity. Badges, drop labels, accents on dark.
  Never gold text on white (fails contrast) — gold lives on ink/green.
- **Green** = depth. Dark section backgrounds, jersey mock, banner sections.
- **Ink on paper** for reading; **paper on ink** for hero/drama sections.
- Smoke separates content sections; never stack two smoke sections.
- Accessibility: all text/background pairs must pass WCAG AA (4.5:1 body,
  3:1 large text). Known-good pairs: ink/paper, paper/ink, paper/green,
  gold/ink, gold/green, paper/red.
