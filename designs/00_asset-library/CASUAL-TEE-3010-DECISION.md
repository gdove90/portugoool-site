# Casual Wordmark Tee — rebuilt on Bella+Canvas 3010

Owner decision, 23 September 2026. Recorded before any supplier or code
work, as the handoff requires.

## What changed

The Casual Wordmark Tee (`goool-heavyweight-casual-tee`, product id
`70000000-0000-4000-8000-000000000003`) was taken off the site on
2026-09-23 after the owner deleted its saved Apliiq designs. It comes
back on a different blank, with different colours and a different print:

| | Before (superseded) | Now |
|---|---|---|
| Blank | Bella+Canvas 4810GD, garment-dyed | **Bella+Canvas 3010 Heavyweight Tee** |
| Colours | Washed Black, Washed Grey | **Natural, Black, Athletic Heather** |
| Front | wordmark only, 6.75 in wide | **full GOOOL Athletics lockup, 11.10 × 4.59 in** |
| Back | blank | **2l yoke band, 12.00 × 2.00 in** |
| Method | DTF | DTF, front and back |

This supersedes [CASUAL-TEE-PLACEMENT-REVISION.md](CASUAL-TEE-PLACEMENT-REVISION.md)
(the 4810GD blank, the washed colours and the 6.75 in wordmark print) in
full. The 3.00 in collar-to-artwork anchor survives: it is the same
anchor the Modern Sport tee uses, and the 3010 front sits at it too.

## Authority

- Handoff and print files: [designs/24_casual-tee-3010-2026-09-23/](../24_casual-tee-3010-2026-09-23/CLAUDE-CASUAL-TEE-3010-HANDOFF.md)
  (owner download `goool (6).zip`, checksums in `FILES.json`).
- Visual spec: `Casual Tee 3010 Production Spec.dc.html` in the owner's
  Claude design project.

## Placements (every colour)

- **Front:** `4a-<colour>-front.png`, 3330 × 1377 px = 11.10 × 4.59 in at
  300 dpi. Centred on the body centreline; top of visible artwork 3.00 in
  below the bottom of the centre-front collar seam.
- **Back:** `4a-back-yoke.png`, 3600 × 600 px = 12.00 × 2.00 in. Centred
  on centre back; top of band 1.50 in below the back collar seam.
- Colours: Natural and Athletic Heather carry Ink #0A0A0A lettering with
  a Red #C52D32 centre dash; Black carries White #F7F5F0 with the same
  red dash. The back band is red with white lettering on all three.
- Print check (handoff, measured at 300 dpi): smallest front stroke 4.2 mm,
  smallest back stroke 2.4 mm, both above Apliiq's 2 mm DTF minimum.
  Neither file may be scaled down.

## Still required, and whose it is

- **Sewn label:** the owner-approved tag, as on every other package. Any
  substitute needs a mockup and owner approval first. Label purchase is
  the owner's.
- **Price:** the 3010 costs differently from the 4810GD. Re-run
  [PRICING-25-PERCENT.md](../18_launch_operations/PRICING-25-PERCENT.md)
  with the 3010 quote and get owner approval before the displayed price
  changes.
- **Sample:** one physical sample before launch. Owner's purchase.
- Old 4810GD designs 6098963 and 6099060: archive, don't delete.

## Blank as listed by Apliiq (read 2026-09-23)

"bella canvas heavyweight tee (3010)". Features, verbatim: 6 oz heavyweight
fabric · Airlume combed cotton · Relaxed modern fit · Drop shoulder design ·
Double-needle neck stitching · Side seamed construction · Pre-shrunk for
consistency · Tear away label. Colours offered on Apliiq: black, Natural,
Athletic Heather (exactly the three chosen). Dropship list price
$16.99 per item (VIP $13.59); the per-item quote with both transfers is
read from the saved design's dropship dialog, not from this page.

Size chart (body length / chest laid flat, inches): XS 26¼/18¾ · S 27¼/19¾
· M 27¾/20¾ · L 28¾/22¾ · XL 29¾/24¾ · 2XL 30¼/26¾ · 3XL 31¼/28¾.
Black stock at read time: XS 18094 · S 18543 · M 24574 · L 58701 ·
XL 22900 · 2XL 12642 · 3XL 12590.

Note on the size chart: the site already carried a 3010 chart sourced from
Bella+Canvas's own spec PDF (S 20⅛ × 27½ … 2XL 27⅛ × 31¾), used by the
archived Modern Sport cotton tee and the retired Minimal Club. Apliiq's
page shows slightly smaller figures (S 19¾ × 27¼ … 2XL 26¾ × 30¼). The
site keeps the manufacturer's chart; the Casual Wordmark Tee points at it.

Stock, all colours, Apliiq table "last updated 22 days ago" (read 2026-09-23),
XS/S/M/L/XL/2XL/3XL: natural 5034/7260/14269/14846/8716/863/819 ·
**athletic heather: na in every size** (no figure reported; the colour is
still offered in the customizer). Treat Athletic Heather stock as
unverified until Apliiq confirms or a sample order is accepted.

## Supplier constraint found while building (2026-09-23)

Apliiq's v5 customizer has no numeric size or position fields for the
3010: artwork is sized and placed by dragging, the readout rounds to
0.1 in, and the artwork cannot be dragged above the top edge of the
template's printable zone. On the 3010 front template that zone top sits
about 4.4 in below the collar seam (measured from the canvas at 20.4
px/in), so the 3.00 in anchor cannot be represented in the preview.

How this is handled, on Apliiq's own guidance rather than a workaround:
Apliiq's help centre states that standard t-shirt placement is
"approximately 3" from the seam of the neck to the top of the artwork"
and that production notes are the way to specify placement and size
("Notes are a great way to specify the size you want your artwork to
be"; producers honour requests such as "2" from the neck"). Each saved
artwork therefore carries a production note with the exact size and the
3.00 in / 1.50 in anchors. The preview position is Apliiq's default, not
the instruction. Sources:
https://help.apliiq.com/portal/en/kb/articles/tips-for-adding-notes-to-custom-t-shirt-designs
https://help.apliiq.com/portal/en/kb/articles/how-to-nail-standard-artwork-placements-for-your-clothing-line

Consequence for the owner: the customizer mockups will show the print
lower than it will be produced. The physical sample is the check.

## Price re-run (PRICING-25-PERCENT model, 2026-09-23) — owner approval pending

Model constants reproduced exactly against the old 4810GD inputs (floor
38.614 = documented 38.614), so the formula below is the authorised one.

Inputs for the 3010: the customizer's "starting at" read $16.99 with the
front transfer and $24.48 with front + back (second transfer +$7.49). The
XXL surcharge is carried over from the 4810GD ($1.50) until the saved
design's dropship dialog is read; that dialog is also the confirmation of
the $24.48 base.

  (24.48 + 1.50 XXL + 3 label + 1 fulfilment + 0.30) / (1 − .029 − .05 − .25)
  = 45.13  →  modelled floor **$46**

The current displayed price is **$48**, above the floor: modelled
worst-size contribution ≈ 29%. So the price does not need to rise. Whether
it stays at $48 or drops to $46 is the owner's call; nothing on the site
changes until they say.

## Saved Apliiq design — Black (read from the design record 2026-09-24)

- **Apliiq product id 6120860**, product "Heavyweight Tee" (Bella+Canvas
  3010), colour **black**. Built by the owner in the v5 customizer;
  renamed "GOOOL Casual Wordmark Tee · Black" and given the brand
  description by Claude on 2026-09-24.
- Front: `goool-athletics-lockup-white` (the library lockup, white with
  the red dash), transfer print, **11 in × 4.16 in** as saved.
- Back: `4a-back-yoke.png`, transfer print, **12.25 in × 2.05 in** as
  saved.
- Owner decision 2026-09-24: these saved sizes are accepted as close
  enough to the spec (11.10 × 4.59 and 12.00 × 2.00). No rebuild.
- Per-size SKUs (from the record): XS `APQ-6120860S5A1` (not sold),
  S `S6A1`, M `S7A1`, L `S8A1`, XL `S1A1`, XXL `S2A1`, XXXL `S21A1` (not
  sold). Wired into `src/lib/fulfillment.ts` for S–XXL.
- Dropship quote, read from the design's bulk dropship dialog:
  **$24.48 per unit, XXL +$2.00, XXXL +$4.00.**

Price re-run with the confirmed inputs:

  (24.48 + 2.00 XXL + 3 label + 1 fulfilment + 0.30) / (1 − .029 − .05 − .25)
  = 45.87  →  modelled floor **$46**. Current display $48 stays above it
  (worst-size contribution ≈ 28.0%). Owner approval of the displayed
  price still pending.

**Price decided 2026-09-24: $48** (owner considered $42, then kept $48). Above the $46 model floor; modelled worst-size contribution ≈ 27%. Set in products.ts.
