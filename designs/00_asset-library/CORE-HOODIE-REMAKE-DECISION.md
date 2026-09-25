# Core Hoodie remake on the IND4000 (owner decision, 24 Sep 2026)

Authority: `designs/25_core-hoodie-remake-2026-09-24/CLAUDE-CORE-HOODIE-HANDOFF.md`
(Claude Design, chief design officer). This record is written before any
Apliiq or code change, as that handoff requires.

## What was decided

- The GOOOL Core Hoodie (`goool-heavyweight-hoodie`, id
  `70000000-0000-4000-8000-000000000002`) is remade on the **same blank**,
  Independent Trading Co IND4000, with the **same print sets as the 3010
  Casual Wordmark Tees**: the full GOOOL Athletics lockup on the chest and
  the club band on the back.
- The band moves from the yoke to the **back hem**, because the hood would
  cover a yoke band. Owner's wish was "just above the ribbed waistband";
  Claude Design measured that as outside Apliiq's 15 × 19 in back area on
  every size, so the band sits on the **bottom edge of the back print
  area** (bottom of band 19.00 in below the back hood seam if the area
  starts at the seam; otherwise the measured distance). Never below the
  area, never scaled.
- **Colours are final: Black, Bone, Grey Heather**, in that order, each in
  a Red Band and a Blue Band version: **six Apliiq designs**. No Smoke.
- **Two shop rows**, mirroring the tees: `GOOOL Core Hoodie · Red` keeps
  the id and slug above; `GOOOL Core Hoodie · Club Blue` is new
  (`…0006`, slug `goool-heavyweight-hoodie-blue`).
- The current wordmark-only designs **6098974** (Black) and **6099064**
  (Bone) come off the website once the six new designs are saved and
  mapped; they are not deleted on Apliiq.
- Price stays **$78** until the owner changes it. Claude Design's re-run
  with the second transfer puts the model floor at $76 (27.06% at $78);
  the real quotes from the saved designs replace the estimate.

## Why

The tees established the lockup + band identity on 24 Sep 2026 and the
owner wants the hoodie to carry the same design; the yoke is unusable on
a hooded garment. Owner instruction, verbatim: "we're using the same
hoodie that we have already but we're going to remove the current ones on
the website and add these three varietals with the two different
colorways for each one … follow the specs given to you by Claude Design".

## Measurements Claude must take before placing art (from the handoff)

1. Front: CF hood seam to top of kangaroo pocket, size S. Must be
   ≥ 9.59 in. If less, stop.
2. Back: CB hood seam to top edge of Apliiq's back print area (d).
3. Grey Heather swatch hex as Apliiq shows it.

Results (taken 2026-09-24 on the v5 customizer's IND4000 templates,
`blob.apliiq.com/sitestorage/base/6399_590_900.png` front and
`4559_590_900.png` back; the customizer maps the front at 24 px/in and the
back at 20 px/in, read from its own inch readouts):

1. Front: CF hood seam ≈ y170, kangaroo-pocket top ≈ y550 on the front
   template, 380 px ≈ **15.8 in**. Pass (minimum 9.59 in). The front
   print area (13.5 × 10 in in the customizer) starts 80 px = **3.33 in**
   below the seam, so the lockup sits at the area's top and the 3.00 in
   figure is carried by the production note.
2. Back: CB hood seam ≈ y150, back area top y310: **d ≈ 8.0 in**. Area
   bottom (y690) ≈ **27.0 in** below the seam and ≈ 2.75 in above the
   waistband rib on this template (template garment reads about size
   L/XL by its 25 in flat chest). Per the handoff the back note now says
   "27.00 in (685.8 mm) below the back hood seam at CB, on the bottom edge
   of the back print area". Flag for Claude Design: on a size S that
   absolute figure would fall inside the rib, so the clause "on the bottom
   edge of the back print area" is the operative instruction for the
   operator.
3. Grey Heather: Apliiq's stored HexColor is **#F4F4F4**; its swatch image
   averages #F0F0F0; the customizer renders the garment near-white. Both
   are far lighter than the #B5B4B2 planning value. No contrast stop is
   triggered (ink and True Royal both clear their minimums on either
   value). Website swatch set to #D9D9D9 as a compromise between Apliiq's
   placeholder and how the blank actually photographs; owner may adjust.

## Saved designs (2026-09-24)

| Design | Apliiq id | Dropship base |
|---|---|---|
| GOOOL Core Hoodie · Bone · Red Band | 6120990 | $44.43 (customizer "starting at") |
| GOOOL Core Hoodie · Bone · Blue Band | 6121021 | $44.43 |
| GOOOL Core Hoodie · Black · Red Band | 6121031 | $44.43 |
| GOOOL Core Hoodie · Black · Blue Band | 6121042 | $44.43 |
| GOOOL Core Hoodie · Grey Heather · Red Band | 6121043 | $44.43 |
| GOOOL Core Hoodie · Grey Heather · Blue Band | 6121044 | $44.43 |

All six: front lockup 266.4 px = 11.10 in wide (customizer readout 11 ×
4.55), top of the front area, centred; back band 240 px = 12.00 × 2.00 in
(readout 12.0 × 2.0), bottom edge on the bottom of the back area, centred;
both production notes attached verbatim from the handoff (front 227
characters, back 238). Built by Claude with the Knockout exact-size method;
the owner sized Bone · Blue Band's band by hand first, then had it set
exactly.

## Log

- 2026-09-24 ~05:00 — owner supplied ChatGPT renders for five designs
  (all but Bone · Red); they replace Apliiq's renders as the site copies.
  Site code, mappings, imagery and pricing committed. **Not deployed:**
  Netlify shows the team on operational credits with production deploys
  paused; the remake ships with the next deploy once credits return.
- 2026-09-25 01:47 — owner supplied the Bone · Red renders (front and
  back, drawstrings now visible). They replace Apliiq's render as the site
  copies; all six hoodie designs now show owner renders. Deployed the same
  morning with the launch build.
- 2026-09-25 02:03 — owner re-supplied the Grey Heather · Red renders at
  full 4:5 size (the first pair were 1200 px squares and sat smaller than
  the rest of the row). Replaced on the site and in site-imagery; the
  squares moved to designs/_archive/.
- 2026-09-24 03:55 — handoff filed at
  `designs/25_core-hoodie-remake-2026-09-24/` (zip `goool (8).zip`,
  seven files, checksums in its FILES.json). This record written.
