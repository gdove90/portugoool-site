# Design Principles

The seven tests every design must pass before it ships.

## 1. Simplicity
One idea per screen. If an element doesn't help someone feel the goal or buy
the shirt, cut it. No unnecessary animations.

## 2. Premium Feel
Premium but not flashy. Generous white space, disciplined palette, real
photography over decoration. Quality reads in the restraint.

## 3. Mobile First
Design at 375px, then scale up. Price, size, customization, and the buy
button stay above the fold on product pages. Thumb-reachable CTAs.

## 4. Large Product Imagery
The product is the hero. 4:5 ratio cards, full-bleed detail views. Images are
replaceable assets (`public/products/`) — never bake text into product shots.

## 5. High Conversion
Every main page has a visible "Shop the Drop" path. Checkout is one handoff,
no account required. Trust copy near every buy button: Secure checkout ·
Made to order · Ships after production · Limited drop.

## 6. Consistency
Tokens over one-offs: colors from [colors.md](colors.md), type from
[typography.md](typography.md), voice from [voice.md](voice.md). A new
pattern must be documented in `designs/13_ui/` before it ships.

## 7. Accessibility
WCAG AA contrast minimum. Real focus states. Labels on every input.
Sold-out and error states never rely on color alone. Alt text describes the
product, not the file.
