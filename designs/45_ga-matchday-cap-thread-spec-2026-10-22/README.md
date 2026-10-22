# GA Matchday Cap: embroidery thread specification (owner, 2026-10-22)

Applies to the GA Matchday Cap (catalog id `80000000-0000-4000-8000-000000000009`,
slug `goal-athletics-monogram-cap`, OTTO 31-069 natural-crown cap) and to
every one of its saved designs on Apliiq. It does not cover the Stacked
Stadium Cap (`…0010`), which the owner has not specified.

## The rule, as given

The GA monogram must be embroidered using thread that matches the cap's
bill (visor) colour.

- Royal/Natural: royal blue embroidery matching the royal blue bill.
- Black/Natural: black embroidery matching the black bill.
- Red/Natural: red embroidery matching the red bill.
- Forest Green/Natural (Apliiq's colour word is "Dark Green/Natural"):
  match the approved two-tone green GA artwork, with the primary dark green
  thread matching the forest green bill.

Preserve the exact GA monogram artwork, proportions and placement. Where
customizable, the bill's topstitching should also match the bill colour. Do
not substitute contrasting embroidery colours without approval. Confirm
thread colours against the physical cap colourway before production.

## Saved designs this applies to

Design ids and SKUs from `src/lib/fulfillment.ts` (read from Apliiq on
2026-10-14). The GA front embroidery is 2.25 x 2.03 in on every design.
The artwork of record is the file linked on each design page; the owner
uploaded it straight to Apliiq, so there is no copy in this repository. The
site renders (`public/products/goal-monogram-cap-<colour>.webp`, Apliiq's
own mockups) show the thread colours the designs were saved with, and they
already match this rule: black GA, red GA, royal GA and the two-tone green
GA (dark green G, lighter green A) on the Dark Green cap.

| Apliiq design | Colourway on site | Bill | GA thread | SKU |
|---|---|---|---|---|
| 6205981 | Black/Natural | black | black | APQ-6205981S34A1 |
| 6205977 | Red/Natural | red | red | APQ-6205977S34A1 |
| 6205982 | Royal/Natural | royal blue | royal blue | APQ-6205982S34A1 |
| 6205989 | Dark Green/Natural (owner: Forest Green/Natural) | forest green | two-tone green art: primary dark green matching the bill, secondary lighter green as drawn | APQ-6205989S34A1 |

## Production note to add on each design (ready to paste)

On the design page (`https://www.apliiq.com/product/<id>/<slug>`), the front
placement card's "..." menu, **add note**. One note per design:

**6205981 GA Matchday Cap, Black/Natural**

> Embroidery thread: BLACK, matching the black bill. Stitch the GA monogram
> exactly as the linked artwork: same proportions and placement. Do not
> substitute a contrasting thread without GOAL Athletics approval. If the
> bill topstitching colour is selectable, match it to the bill (black).
> Confirm the thread colour against the physical Black/Natural cap before
> production.

**6205977 GA Matchday Cap, Red/Natural**

> Embroidery thread: RED, matching the red bill. Stitch the GA monogram
> exactly as the linked artwork: same proportions and placement. Do not
> substitute a contrasting thread without GOAL Athletics approval. If the
> bill topstitching colour is selectable, match it to the bill (red).
> Confirm the thread colour against the physical Red/Natural cap before
> production.

**6205982 GA Matchday Cap, Royal/Natural**

> Embroidery thread: ROYAL BLUE, matching the royal blue bill. Stitch the GA
> monogram exactly as the linked artwork: same proportions and placement. Do
> not substitute a contrasting thread without GOAL Athletics approval. If
> the bill topstitching colour is selectable, match it to the bill (royal
> blue). Confirm the thread colour against the physical Royal/Natural cap
> before production.

**6205989 GA Matchday Cap, Dark Green/Natural**

> Embroidery thread: the approved two-tone green GA exactly as the linked
> artwork. Primary thread DARK (FOREST) GREEN, matching the forest green
> bill; secondary lighter green as drawn. Same proportions and placement as
> the artwork. Do not substitute a contrasting thread without GOAL Athletics
> approval. If the bill topstitching colour is selectable, match it to the
> bill (forest green). Confirm both thread colours against the physical
> Dark Green/Natural cap before production.

## Status

- **Not yet on Apliiq.** Adding a note needs the owner's signed-in Chrome
  (`.claude/skills/apliiq-asset-to-website/SKILL.md`, section 3). The
  2026-10-22 cloud session that wrote this record had no browser access.
  When the notes are added, record each design's activity-log line
  ("new note added") below.
- The rule is referenced from `src/lib/fulfillment.ts` (cap mapping
  comment) and `src/lib/products.ts` (hats block comment).
- Nothing changes on the site: the caps stay visible and not for sale, and
  the renders already show bill-matched thread.

## Still to confirm

- Thread colours against the physical caps (the rule requires it; no
  physical sample exists).
- Whether Apliiq exposes bill topstitching colour on the OTTO 31-069. The
  2026-09-22 blank check (`designs/23_cap-embroidery-2026-09-22/`) recorded
  no such option; if it is not selectable, the topstitching line in the
  note is informational.
- Apliiq's thread-colour pick for each design: the picker resolves from the
  artwork's own colours (see designs/23 README), so the linked artwork's
  colours are what the digitiser receives. Check the design page's colour
  readout against the table above.

| Design | Activity log line | Date |
|---|---|---|
| 6205981 | | |
| 6205977 | | |
| 6205982 | | |
| 6205989 | | |
