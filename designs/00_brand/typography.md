# Typography

Big, condensed, loud display type over a quiet system body. The launch build
uses system stacks for speed; a hosted display font is the first planned
upgrade (candidates below).

## Display Font
- **Current (production):** `"Arial Narrow", "Helvetica Neue Condensed", Impact, system-ui, sans-serif`
- **Upgrade candidates:** Anton, Oswald, Archivo Black (pick one, document here, then implement)
- Usage: wordmark, H1/H2, drop labels, jersey numbers. Always uppercase,
  tight tracking (`-0.03em`).

## Heading Font
- Same as display. One display voice — no second decorative font.

## Body Font
- System stack: `system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- Usage: descriptions, FAQ, legal, form labels.

## Button Font
- Body stack at `font-semibold`. Sentence case ("Shop the Drop"), never all-caps buttons.

## Scale
| Role | Mobile | Desktop |
|---|---|---|
| Hero H1 | 3.75rem (`text-6xl`) | 8rem (`text-9xl`) |
| Section H2 | 1.875rem (`text-3xl`) | 2.25rem (`text-4xl`) |
| Product name (card) | 0.875rem semibold | same |
| Body | 1rem | 1rem–1.125rem |
| Caption / trust copy | 0.75rem | 0.75rem |

## Responsive Rules
- Mobile-first: set the mobile size, scale up with `sm:` / `lg:` prefixes.
- Hero type may bleed large but must never force horizontal scroll.
- Line length for body copy: max ~65ch (`max-w-md` / `max-w-lg` in practice).
- Uppercase display type gets `tracking-tightest`; spaced-out uppercase
  (`tracking-widest`) is reserved for tiny eyebrow labels.
