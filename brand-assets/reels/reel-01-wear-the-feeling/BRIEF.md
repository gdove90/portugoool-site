# Reel 01, "Wear the Feeling", remake brief

Reference: `reference.mp4` (Grok output saved 2026-09-30, 6.0 s, 464 x 688,
24 fps, generated ambient audio, no speech). Frame-by-frame view in
`contact-sheet.png`. The structure is right. Four things are wrong: the
garments are not products we sell, the small marks are invented, two of
the three text lines are unapproved copy, and the end card advertises a
code that does not exist. This brief fixes all four so the remake can run
as a real reel.

## What the reference does, shot by shot

| Time | What is on screen | Keep or change |
|---|---|---|
| 0.0 to 1.5 s | Black dad cap with a "GA" monogram on a concrete ledge; painted GOOOL lockup on the wall behind; skyline, water and a soccer pitch beyond; overlay WEAR THE FEELING | Keep the frame, the wall mural and the overlay. Change the cap. |
| 1.5 to 2.5 s | Camera drifts right past the wall to a white tee on a ghost mannequin with a "GA" left chest; a black hoodie edges in from the right; overlay WEAR THE FEELING | Keep the move and the mannequin. Change the tee and its mark. |
| 2.5 to 4.5 s | Back of a white tee, full GOOOL ATHLETICS lockup centred, slow push-in; overlay VERSATILE BY DESIGN | Keep the push-in. Change the garment and the copy. |
| 4.5 to 6.0 s | Back of a black hoodie, white lockup, hood up; overlay ATHLEISURE EVOLVED, then a bottom line 20% OFF FIRST ORDER - CODE: GOOOL20 | Keep the hoodie beat. Change the print side, the copy and the offer line. |

## The remake, with real products

| Shot | Real product | Reference image to attach | Grok prompt |
|---|---|---|---|
| 1 | GOOOL Athletics Stacked Cap: natural cream crown, black visor, GOOOL over a red rule with ATHLETICS beneath embroidered in black on the front (matches the wall) | `GOOOL_STD_ATHLETICS_CAP_FRONT.webp` | The exact cap from the attached image, natural cream twill crown, black curved visor, black top button and eyelets, resting on a weathered concrete ledge, its embroidered front mark reading as a small clean stacked shape; behind it a painted wall mural of the attached lockup, worn and chipped; beyond the wall a soccer pitch with white goals, water and a grey city skyline under overcast light; static frame, 9:16 |
| 2 | GOOOL Matchday Tee, White (GOOOL with a red underline and spaced ATHLETICS across the chest) | `GOOOL_MODERN_PERFORMANCE_WHITE_FRONT_V3.png` | Continue the same scene: slow lateral drift to the right past the mural to a white performance tee on a ghost mannequin, the attached tee as the exact garment, chest print reading as the attached lockup in black with a red underline, a black hoodie entering frame right; same pitch and skyline; 9:16 |
| 3 | GOOOL Terrace Tee, Natural (full lockup in black across the chest, the rule carrying a short red segment; the red is the club band on the back). The lockup lives on the FRONT of our tees, never the back, so this beat turns to the front. | `GOOOL_STD_CASUAL_3010_NATURAL_RED_FRONT.webp` | Slow push-in on the chest of a natural heavyweight cotton tee worn by a man seen from the shoulders down, the attached tee as the exact garment, chest print reading as the attached lockup in black with the short red segment in its rule, pitch railing soft in the background; 9:16 |
| 4 | GOOOL Core Hoodie, Black (Red) shown from the FRONT, lockup across the chest, hood up. If you want the back beat instead, the back of our hoodie carries a red club band low, not the lockup. | `GOOOL_STD_HOODIE_BLACK_RED_FRONT.webp` | Slow push-in on a black heavyweight fleece hoodie, hood up, worn by a man from the shoulders down, the attached hoodie as the exact garment, chest print reading as the attached lockup in white with the red bar, overcast light, pitch soft behind; 9:16 |

Suffix for every shot: `cinematic, shallow depth of field, editorial athleisure, overcast soft light, no text, no logos other than the attached, no watermark, 9:16 vertical`.

If a face appears in any shot, it is one of the four avatars from
`brand-assets/avatars/PROMPTS.md`, card pasted verbatim, front view
attached. The reference shows no face; keep it that way and the avatars
are not needed.

## Text overlays

| Reference line | Verdict | Use instead |
|---|---|---|
| WEAR THE FEELING | Approved launch line | Keep, shots 1 and 2 |
| VERSATILE BY DESIGN | Not approved copy | Drop, or repeat WEAR THE FEELING |
| ATHLEISURE EVOLVED | Not approved; "evolved" is the kind of hype word the brief bans | Drop |
| 20% OFF FIRST ORDER - CODE: GOOOL20 | There is no shared code. Codes are issued one per sign-up, GOOOL20-XXXX, 14 days, single use | **20% off your first order. Sign up at goool.shop** |

Add the overlays in Claude Design or the editor, not in Grok. Grok text
is unreliable and the mark work below happens in the same pass anyway.
No prices anywhere on screen.

## Marks: overlay the real ones

Grok will approximate the lockup. Before posting, replace every rendered
mark with the vector art in Claude Design:

- Wall mural, hoodie chest: `goool-athletics-lockup-white.png` (white, red bar)
- Tee chest, natural or white garment: `goool-athletics-lockup-ink.png` (black, red bar)
- Stacked Cap front: `HAT-LOCKUP-ATHLETICS-INK.png` is the embroidery art

Copies of all three are in this folder. No GA monogram, no crest, no ball,
no other logo anywhere in frame.

## Format

- 1080 x 1920, 9:16. The reference is 2:3; regenerate at 9:16 rather than
  cropping, or the ledge and the mural get cut.
- 6 to 8 s, 24 or 30 fps, four shots, cuts at roughly 1.5 s, 2.5 s, 4.5 s.
- Audio: replace the generated ambience with licensed music or a clean
  stadium bed in the editor. Keep it off the Grok render.

## Files to hand Grok, in this order

1. `reference.mp4` (motion and framing reference)
2. `GOOOL_STD_ATHLETICS_CAP_FRONT.webp`
3. `GOOOL_MODERN_PERFORMANCE_WHITE_FRONT_V3.png`
4. `GOOOL_STD_CASUAL_3010_NATURAL_RED_FRONT.webp`
5. `GOOOL_STD_HOODIE_BLACK_RED_FRONT.webp`
6. `goool-athletics-lockup-white.png` and `goool-athletics-lockup-ink.png` (as the mark reference in each prompt)

Then the overlays and the mark swap in Claude Design, then export.
