# GOOOL · "MADE FOR THE MOMENT" · 15-second master production prompt

**Position:** Acting as creative director, sports cinematographer, and AI
production lead for GOOOL. This document is the complete, execute-ready
master prompt for the second campaign film. Nothing in it is optional or
left to interpretation. Filed 2026-09-26 by owner instruction.

**What this ad is:** 15 to 18 seconds. No story setup, no bedroom, no
transformation. This is the *moment itself* — the held breath before the
strike, the strike, the eruption, the stillness after. "Wear the Feeling"
(folder 26) tells you what the shirt does. This cut makes you feel it in
your chest in fifteen seconds. It runs on the mark-locked GOOOL tagline:
**MADE FOR THE MOMENT.**

**This film is a 1 of 1.** Everything is created new for it: new talent,
new frames, new ending signature. Nothing is reused from folder 26 except
the brand's own fixed assets (wordmark lockup, garment references, Anton)
and the paid-for production lessons. It must still read unmistakably as
GOOOL — through the garments, the grade, and the tagline — not through
recycled footage or a recycled cast.

---

## 1 · Spec sheet

| Item | Value |
|---|---|
| Duration | 15.0 s target · 18.0 s hard max including cards |
| Format | 1080 × 1920 vertical 9:16 master · 4:5 feed crop derived in edit |
| Generator | Higgsfield · seedance_2_0 · 720p std for takes · 1080p re-render of chosen takes only |
| Clip length | 4 s generations (trim in edit) |
| Takes | 2 per clip minimum · 3 for Clip 3 and Clip 4 (the strike and the eruption decide the ad) |
| Start frames | Generated in ChatGPT (free), uploaded to Higgsfield media assets, used as image reference per clip |
| Frame rate | 24 fps look · export 30 fps H.264 High 4.1, yuv420p, AAC 48 kHz, moov faststart |
| Talent | Synthetic only, created NEW for this film (see §3 and prompt A1). No real-person likeness, no reuse of prior campaign talent. |
| Text in frame | NONE inside generated clips. All typography composited in the editor from brand assets. |

Estimated credits (from folder 26 measured costs): 5 clips × 2.5 avg takes
× 12.5 (720p fast unavailable on seedance_2_0 — use std at 45 only if fast
tier is missing; budget worst case) ≈ **150 to 560 credits** depending on
tier available. Start frames cost 0 (ChatGPT).

---

## 2 · Non-negotiables (write these into every generation)

Lessons already paid for in the folder-26 run. Violating any of these means
the take is rejected on sight.

1. **Ball:** "plain all-white football, no pattern, no stars, no printed
   panels." The model defaults to a Champions League star ball. Reject any
   take with a patterned ball.
2. **Kits and world:** "plain unbranded kits, no numbers, no club crests,
   blank sideline boards, no sponsor text anywhere." Reject any take with
   a number, stripe-brand mark, or readable board.
3. **No third-party marks. No player, club, or federation likeness.** GOOOL
   is independent. Nothing Nike/Adidas-shaped on boots or garments.
4. **Wordmark fidelity:** GOOOL has exactly three O's: G-O-O-O-L. The
   generator never draws the wordmark or any text. Chest print comes only
   from the attached product reference images; if a take mangles the print,
   reject it.
5. **Never describe removing or pulling clothing over a head** — it trips
   Higgsfield's content filter. Wardrobe is already on in every start frame.
6. **No on-screen AI text.** Cards, tagline, and logo are composited in the
   editor from `designs/_LIBRARY/2-logo-designs/lockups/goool-athletics-lockup-white.png`
   and Anton (`designs/26_launch-video-ad-2026-09-25/output/cards/Anton-Regular.ttf`).
7. **Copy standard:** middle dots for separators, never dashes. End cards
   use exactly the copy in §6, spelled exactly.
8. **Collection name is THE CORE CAPSULE.** Never "Core Collection".
9. **goool.shop** appears on the final logo card only. Never on a garment,
   never in a generated frame.

**Universal negative prompt (append to every Higgsfield generation):**
> Avoid: patterned or star-marked football, club kits, kit numbers, sponsor
> boards, readable text or logos anywhere, third-party sportswear marks on
> boots or clothing, extra limbs, warped hands or faces, distorted chest
> print, misspelled lettering, cartoonish motion, rubber-limb running,
> teleporting ball, cheap slow motion, oversaturated colors, lens
> watermarks, low-detail crowd faces in foreground, comedic acting.

---

## 3 · Wardrobe and identity references (upload these to Higgsfield assets)

**The actor — created new for this film (owner generates in ChatGPT,
prompt A1 below, before any start frame):** the identity images from A1
become the face lock for every clip. File as
`references/mftm-actor-full.png` and `references/mftm-actor-head.png` in
this folder, upload both to Higgsfield media assets, and pass the head
crop as a reference on every generation. Do not use the folder-26 actor.

**A1 · New actor identity (run this first, twice: one full-body, one
head-and-shoulders crop of the same person):**
> Photorealistic studio portrait of a fictional athlete who does not
> resemble any real person: a man in his early twenties, deep brown skin,
> close-cropped fade haircut, clean-shaven with a strong jaw, dark brown
> eyes, lean explosive winger's build with defined shoulders, about six
> feet tall, a small scar through his right eyebrow. Neutral grey studio
> background, soft even lighting, relaxed neutral expression, facing
> camera. He wears a plain black athletic base layer with no logos.
> Vertical 9:16, cinematic 35mm look, no text, no watermark.

**Hero garment (on the actor, every pitch clip):**
Performance Badge Tee · Black — the capsule's match tee.
- Front: `public/products/GOOOL_STD_PERFORMANCE_BLACK_FRONT.webp`
- Back: `public/products/GOOOL_STD_PERFORMANCE_BLACK_BACK.webp`
- High-res render already in Higgsfield store: `65a7a2c0-ef14-4a89-85da-074d16ab14fd`
Worn with plain black athletic shorts, plain black boots (no marks), black
crew socks. The chest print must match the reference exactly.

**Supporter garment (Clip 2 only):**
Core Hoodie · Black · Red band — `public/products/GOOOL_STD_HOODIE_BLACK_RED_FRONT.webp`
plus Touchline Cap — `public/products/GOOOL_STD_TOUCHLINE_CAP_FRONT.webp`.
A second synthetic character (see start frame S2). This is how the capsule
range reads in the ad without a product montage.

---

## 4 · Phase 1 — Start frames in ChatGPT (owner executes, free)

Run A1 first to create the new actor, then generate six vertical stills.
For every prompt: attach the A1 actor images AND the garment reference
image(s) named above, and end the prompt with this fidelity block,
verbatim:

> Reproduce the attached garment exactly: same silhouette, same chest
> print artwork at the same size and placement, same colors. Do not
> redesign, restyle, or re-letter anything. The print may be partially
> visible or angled naturally, but where visible it must match the
> reference. Photorealistic, cinematic 35mm look, vertical 9:16 portrait
> orientation, no text overlays, no watermark.

File each result as `start-frames/S<N>-<slug>.png` in this folder, then
upload all six to Higgsfield media assets.

**S1 · The hush (start frame for Clip 1)**
> Night match under tall stadium floodlights. The attached man, wearing the
> attached black GOOOL performance tee, plain black shorts and black boots,
> stands over a plain all-white football placed on the grass at the edge of
> a penalty area, eleven yards from goal. He is seen in a tight
> medium-close shot from the front, chest up, head slightly bowed, eyes
> lifted toward goal, jaw set, a light sheen of sweat, breath visible in
> the cool night air. Behind him a packed stand is rendered as soft
> out-of-focus bokeh of thousands of small lights and indistinct figures;
> blank dark sideline boards; no readable text anywhere. Shallow depth of
> field, 85mm telephoto compression, floodlight halation on his shoulders,
> teal-slate shadows with warm skin tones, fine 35mm film grain.

**S2 · The supporter (start frame for Clip 2)**
> Same night match world. A woman in her mid twenties with dark curly hair,
> medium-brown skin and gold hoop earrings stands pressed against a plain
> metal pitch-side barrier in the front row of a packed stand, gripping the
> rail with both hands. She wears the attached black hoodie with the red
> chest band artwork exactly as shown, and the attached black cap. Her eyes
> are locked on something off-frame left, lips parted mid-breath,
> anticipation on her face. Around her, out-of-focus supporters lean
> forward. Floodlight backlight rims her cap and shoulders; cold night air;
> breath faintly visible. Shot at 50mm, waist-up, shallow depth of field,
> teal-slate grade with warm skin, fine film grain.

**S3 · The strike (start frame for Clip 3)**
> Same man, same black GOOOL tee, mid run-up two strides from the plain
> all-white ball, seen full-body from a low side angle, camera at grass
> height. His plant foot is landing beside the ball, striking leg loading
> back, arms wide for balance, face locked in total focus. Grass blades in
> sharp foreground, goal and goalkeeper as soft shapes far background
> right, keeper in plain grey, blank boards. Motion tension but no motion
> blur. 35mm lens, low angle, floodlit night, teal-slate grade, film grain.

**S4 · The eruption (start frame for Clip 4)**
> Same man, same black GOOOL tee, the instant after scoring: sprinting
> toward the corner flag, mouth open in a roar, arms beginning to spread
> wide, chest square to camera so the chest print reads clearly. Behind
> him the goal net still shivers and the blurred crowd rises to its feet.
> Camera front-on at chest height, 35mm, slight upward angle making him
> monumental, floodlight flare top of frame, teal-slate grade, warm skin,
> film grain.

**S5 · The stillness (start frame for Clip 5)**
> Same man, same black GOOOL tee, standing still at night in the centre of
> the pitch after the celebration, chest heaving, eyes closed, head tilted
> slightly back, steam rising off his shoulders in the floodlight. Tight
> chest-up frame, the GOOOL chest print centered and clearly readable,
> crowd a silent wall of bokeh behind. 85mm, shallow focus, halation,
> teal-slate shadows, warm highlights on his face, heavy 35mm grain. Calm,
> almost sacred mood.

**S6 · Insert detail (safety coverage, optional but recommended)**
> Extreme close-up of the same black GOOOL tee on the man's chest, fabric
> rising and falling with heavy breathing, sweat-dark at the collar,
> floodlight raking across the knit texture and the chest print, night
> bokeh behind. Macro 100mm look, razor-thin focus on the print, film
> grain.

---

## 5 · Phase 2 — Higgsfield clip generations

Model seedance_2_0 · 9:16 · 4 s each · image reference = the matching start
frame + the new A1 actor head crop (uploaded per §3) · append the §2
negative prompt to all.

**CLIP 1 · THE HUSH (use 2.8 s)**
> Continue from the reference frame. The man stands over the plain
> all-white ball under stadium floodlights at night. Almost nothing moves:
> he exhales once, breath fogging in the cold air, chest rising slowly,
> eyes narrowing toward goal. The out-of-focus crowd sways microscopically;
> a flag drifts in slow motion far behind. Camera pushes in very slowly
> toward his face, handheld-smooth, a few millimetres per second.
> Atmosphere of total held tension, the second before everything. Plain
> unbranded kit, blank boards, no readable text. Photorealistic, cinematic,
> premium sports-commercial lighting, 24 fps feel.

**CLIP 2 · THE SUPPORTER (use 2.4 s)**
> Continue from the reference frame. The woman at the barrier in the black
> GOOOL hoodie and cap grips the rail tighter, rises onto her toes, breath
> catching; around her the crowd leans forward as one. Her eyes track
> something moving off-frame left. Camera drifts laterally a few
> centimetres with a slow push, shallow focus locked on her face.
> Floodlight rim light, night air, no readable text anywhere, blank
> barrier. Quiet electric anticipation, photorealistic, cinematic.

**CLIP 3 · THE STRIKE (use 3.0 s) — 3 takes minimum**
> Continue from the reference frame. Low grass-level side angle: the man
> completes the final stride and strikes the plain all-white ball cleanly
> with his right instep. Real football technique: plant foot beside the
> ball, hips rotating, laces through the ball, follow-through carrying the
> leg high. The ball leaves frame right at speed with slight grass spray.
> Time dilates 20 percent at contact then snaps back. Camera stays low and
> whip-pans a few degrees following the ball out of frame. Goalkeeper in
> plain grey begins diving far background. One continuous motion, no cuts,
> physically believable, no rubber limbs, plain kits, blank boards.
> Explosive, cinematic, photorealistic.

*Fallback Clip 3B (if ball contact keeps failing):*
> Low grass-level angle: the plain all-white ball is already in flight,
> rising and bending toward the top corner of the goal, floodlights
> flaring across the lens. The man's follow-through completes in the left
> of frame, body unwinding. The camera tracks the ball's flight in a
> smooth fast pan. The goalkeeper in plain grey dives at full stretch and
> misses. End the clip the frame before the ball reaches the net.

**CLIP 4 · THE ERUPTION (use 3.2 s) — 3 takes minimum**
> Continue from the reference frame. The net snaps taut and ripples once
> behind him as the man wheels away in celebration, sprinting toward
> camera and slightly past it, arms flung fully wide, roaring, eyes
> blazing, the black GOOOL tee reading square to lens. The crowd behind
> explodes upward in a wave, arms up, camera shakes once with the roar
> then stabilises, tracking backward ahead of him. Floodlight flares
> streak the lens. Pure euphoria, premium sports commercial energy,
> photorealistic human motion, plain kit, no readable text.

**CLIP 5 · THE STILLNESS (use 2.6 s)**
> Continue from the reference frame. Everything slows: the man stands
> alone in the centre circle, eyes closed, head tilting back, chest
> heaving, steam rising off his shoulders into the floodlight beam. The
> crowd is a softly glittering wall of bokeh, their roar visually implied
> but the image serene. Camera pushes in very slowly on his chest and
> face; the chest print holds center frame, perfectly legible. A single
> slow blink as he opens his eyes, lands back in his body, and the
> faintest smile starts. Sacred, still, monumental. Photorealistic.

**Take selection rules:** reject on any §2 violation; prefer takes where
the chest print survives motion; for Clip 4 the print legibility at the
midpoint frame is the deciding criterion. Re-render only the chosen five
takes at 1080p.

---

## 6 · Phase 3 — Edit, sound, cards

**Timeline (16.6 s master):**

| In | Out | Content |
|---|---|---|
| 0.0 | 2.8 | Clip 1 hush |
| 2.8 | 5.2 | Clip 2 supporter |
| 5.2 | 8.2 | Clip 3 strike (contact lands ~7.4) |
| 8.2 | 11.4 | Clip 4 net + eruption |
| 11.4 | 14.0 | Clip 5 stillness |
| 14.0 | 15.4 | Card A |
| 15.4 | 16.6 | Card B · logo · lights out · black |

Cut Clip 2 → Clip 3 on her breath catch. Cut Clip 3 → Clip 4 exactly on
the net impact frame. Optional: 8 frames of S6 chest insert between Clips
4 and 5 if the pacing wants one more beat.

**Sound design (the ad is the sound):**
- 0.0–5.2 · muffled distant crowd, low heartbeat at ~60 bpm accelerating,
  one visible-breath exhale foley, stadium air tone
- 5.2–7.3 · heartbeat doubles, crowd swell rises
- 7.3–7.5 · **total silence for 0.2 s at boot contact** (the signature)
- 7.5 · ball-strike thump, net snap
- 7.5–11.4 · crowd explosion + commentator, male, authentic Latin football
  delivery, spontaneous and euphoric, sustained: **"GOOOOOOOL!"** peaking
  as the net snaps and decaying under Clip 5. No player or club names.
- 11.4–14.0 · roar washes down to a warm low rumble + slow single
  heartbeat; his one breath audible
- 14.0–16.6 · rumble fades under cards; then the film's own signature:
  three deep stadium floodlight-bank shut-off clunks in rhythm, each one
  dimming the logo card a step, the last landing on true black and total
  silence. Lights out. No static, no glitch: this ending belongs to this
  film only.
- No licensed music anywhere. The crowd and the call are the score.

**Cards (composited in editor · Anton typeface · white on pure black ·
Instagram-safe zone rows 250–1580):**
- Card A, 1.4 s, one line, centered:
  **MADE FOR THE MOMENT.**
- Card B, 1.2 s total: small top line **THE CORE CAPSULE · NOW LIVE**,
  then the lockup `goool-athletics-lockup-white.png` centered, small
  **goool.shop** beneath the lockup. Hold, then the lights-out ending:
  the card dims in three stepped drops synced to the floodlight clunks
  (100% · 55% · 20% · black), a barely-visible cool vignette closing in
  with each step, ending on true black. Built in the editor with simple
  opacity keyframes: no generative text, no glitch presets.
- Spelling checks: GOOOL (three O's) · THE CORE CAPSULE · middle dots only.
- "MADE FOR THE MOMENT." is the mark-locked GOOOL line and is used here as
  the campaign line. "The Sound of Victory." stays the site tagline; in
  this film the GOOOOOOOL call *is* the sound of victory — do not also
  print it.

**Exports:** 1080×1920 master (Reels/Stories/ads) and 1080×1350 feed crop
(centre-weight Clips 1/2/5 and cards; top-weight Clips 3/4 so heads and
ball stay in frame). Both H.264 High 4.1, yuv420p, 30 fps, AAC 48 kHz,
faststart, under 25 MB.

---

## 7 · QC gate before posting

- [ ] Plain white ball in every frame · no star/CL pattern
- [ ] Zero readable text, numbers, crests, or third-party marks in any clip
- [ ] Chest print matches `GOOOL_STD_PERFORMANCE_BLACK_FRONT.webp` wherever legible
- [ ] Hoodie band + cap match their reference images in Clip 2
- [ ] Same actor face in Clips 1, 3, 4, 5
- [ ] Silence beat lands exactly on boot contact; GOOOOOOOL peaks on net
- [ ] Cards: exact copy from §6, Anton, safe zones, three O's
- [ ] Lights-out ending: three stepped dims synced to the clunks, ends on true black
- [ ] New actor only: the folder-26 actor appears in zero frames
- [ ] 15.0–18.0 s total · both exports pass ffprobe spec
- [ ] Owner sign-off on the cut before it posts (freeze applies to the site, not to filing this work)

**File takes to:** `designs/33_made-for-the-moment-ad-2026-09-26/output/<clip>/`
same layout as folder 26.
