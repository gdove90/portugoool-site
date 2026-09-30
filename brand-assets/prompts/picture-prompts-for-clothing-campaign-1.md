# Picture prompts for clothing, Campaign 1 (Grok Imagine, "the ledge", 2026-09-30)

One scene, many pictures: a weathered concrete wall with the GOOOL over
red bar over ATHLETICS mural, a concrete ledge with a dark metal rail, a
soccer pitch with two white goals, trees, water, a grey city skyline,
overcast flat light. Everything below was written and run on 2026-09-30.
Results and what went wrong are noted so the next run starts from what
worked. The stills that landed are in `brand-assets/instagram/feed/`.

Rules that apply to every prompt here:

- Attach the product image first, the avatar's front view second. Grok
  weights the first attachment as the subject.
- Paste the avatar's card verbatim from `brand-assets/avatars/PROMPTS.md`
  where it says [paste X's card].
- Grok never draws the lockup exactly. The real vector art goes over every
  render in Claude Design before anything posts.
- No swoosh, no crest, no federation mark, no supplier name, no price, no
  text on the image. "Plain" is in the prompts on purpose; keep it.
- Only the four avatars are faces. A second person whose face shows is a
  regenerate.

## Ball, standard description

Borrowed from the look of a training ball the owner liked, badges removed:

```
a glossy white soccer ball with large black rounded-hexagon panels, each filled with fine concentric black lines, small gold four-point star accents scattered between the panels, no brand marks, no crest, no text
```

Never attach a photo of a branded ball as a reference; the logos come with it.

## Mark, standard description (paste in place of any "mural" line)

Attach `goool-athletics-lockup-ink.png` too and tell Grok to match it.

```
THE MURAL. Painted on the wall, fully inside the frame, three stacked elements centred on each other, matching the attached lockup image exactly.

Line one, the word GOOOL: five heavy black letters, all the same height, all leaning to the right at the same slant, built from rounded rectangles with straight sides and rounded corners, thick strokes, tightly spaced. The G is an open rounded block with its opening on the right side; a short horizontal bar juts inward from the right at mid-height, and its upper-right corner is cut off on a diagonal. The three O's are identical: each is a rounded-rectangle ring, taller than wide, leaning right, and each ring is broken by two narrow diagonal cuts that run at the same slant as the letters. One cut goes through the ring at the upper-left shoulder, the other through the ring at the lower-right shoulder, so each O reads as two hooked halves that do not touch, an upper-right half and a lower-left half. The cuts are narrow, about a fifth of the stroke width, and every O has exactly two, never one, never four. The L is a heavy block L with its top cut on a diagonal and its foot running right, the foot ending on the same diagonal. No other letter has cuts.

Line two, the rule: directly beneath the word, a thin horizontal bar the full width of the word, split into three pieces by two small diagonal gaps at the same slant as the letters: a black piece on the left, a red piece in the middle roughly one quarter of the width, a black piece on the right.

Line three, the word ATHLETICS: nine thin, tall, upright black capital letters, not slanted, widely spaced so the word runs the same width as GOOOL, plain sans-serif with no cuts or notches.

Paint chipped and weathered, every letter complete and legible.
```

For a white print on the hoodie: "white" for every "black" in the letters and the two outer bar pieces, the middle piece still red.

## Picture 1, Stacked Cap on the ledge. LANDED.

Attach `GOOOL_STD_ATHLETICS_CAP_FRONT.webp` (or the .png copy).

```
Photorealistic editorial still. The exact cap from the attached image, natural cream twill crown, black curved visor, black top button and eyelets, GOOOL over a red rule over ATHLETICS embroidered in black on the front, resting on a weathered concrete ledge beside a dark metal rail. Behind it on the left a concrete wall with a chipped painted mural of the same GOOOL over red bar over ATHLETICS mark. Beyond the ledge a green soccer pitch with two white goals, a line of trees, water and a grey city skyline under an overcast sky, soft flat daylight, no shadows. Camera at ledge height, shallow depth of field on the cap. No people, no text, no logos other than the cap and the mural, no watermark, 9:16.
```

## Picture 2, Jeff, Matchday Tee White, at the rail. LANDED.

Attach `GOOOL_MODERN_PERFORMANCE_WHITE_FRONT_V3.png`, `jeff_front.png`.
Grok drew a swoosh on the sneakers; the feed crop ends at the ankle.

```
Photorealistic editorial still. The exact man from the attached avatar image, [paste Jeff's card], wearing the exact white tee from the attached product image with its chest print unchanged, black athletic shorts, white low-top sneakers. He leans back against a dark metal rail on a weathered concrete ledge, relaxed, looking off to the right. Behind him on the left a concrete wall with a chipped painted mural of the GOOOL over red bar over ATHLETICS mark. Beyond the rail a green soccer pitch with two white goals, a line of trees, water and a grey city skyline under an overcast sky, soft flat daylight. Camera at chest height, 85mm look, shallow depth of field. No text, no logos other than the tee and the mural, no watermark, 9:16.
```

## Picture 3, Alex, Terrace Tee Natural, seated. LANDED on the second run.

Attach `GOOOL_STD_CASUAL_3010_NATURAL_RED_FRONT.png`, `alex_front.png`.
First run kept the grey base tee. The "wardrobe first" opening fixed it.
Note the front print on this tee is black with a short red segment in the
rule; the red is the club band on the back.

```
Photorealistic editorial still. Wardrobe first: the man wears a natural cream off-white heavyweight cotton t-shirt, exactly the tee in the attached product image, with its black GOOOL over ATHLETICS lockup printed across the chest. The shirt is cream, not grey. Black athletic shorts, plain white low-top sneakers. He is the exact man from the attached avatar image, [paste Alex's card]. He sits on a weathered concrete ledge, forearms on his knees, a soccer ball at his feet, looking toward the pitch. Behind him on the left a concrete wall with a chipped painted mural of the GOOOL over solid red bar over ATHLETICS mark. Beyond the ledge a green soccer pitch with two white goals, a line of trees, water and a grey city skyline under an overcast sky, soft flat daylight. Camera at eye level, 85mm look, shallow depth of field. No text, no logos other than the tee and the mural, no watermark, 9:16.
```

## Picture 4, Greg, Core Hoodie Black. NOT LANDED YET.

Attach `GOOOL_STD_HOODIE_BLACK_RED_FRONT.webp`, `greg_front.png`.

### Practice volley (ran: he kicked away from the wall, rejected)

```
Photorealistic editorial action still. Wardrobe first: the man wears the exact black fleece hoodie from the attached product image, hood down, its white GOOOL over red bar over ATHLETICS lockup unchanged across the chest, black athletic shorts, plain black soccer cleats with no visible brand marks, white socks. He is the exact man from the attached avatar image, [paste Greg's card]. He is practicing alone on the concrete apron in front of the weathered wall, caught mid-volley: right foot extended, [ball], frozen mid-flight between his boot and the chipped painted GOOOL over red bar over ATHLETICS mural, slight motion blur on the ball only. The concrete ledge and dark metal rail beside him, green soccer pitch with two white goals beyond, a line of trees, water and a grey city skyline under an overcast sky, soft flat daylight. Camera low at knee height, 35mm look, the ball and the wall sharp, the skyline soft. No text, no logos other than the hoodie and the mural, no watermark, 9:16.
```

### A. Against the wall (ran: did not work, rejected)

```
Photorealistic editorial action still. Wardrobe first: the man wears the exact black fleece hoodie from the attached product image, hood down, its white GOOOL over red bar over ATHLETICS lockup unchanged across the chest, black athletic shorts, plain black soccer cleats with no visible brand marks, white socks. He is the exact man from the attached avatar image, [paste Greg's card]. He is practicing alone, facing the weathered concrete wall with its chipped painted GOOOL over red bar over ATHLETICS mural, body turned three-quarter so his chest print is visible to the camera, right leg swinging through a volley, [ball], frozen mid-flight halfway between his boot and the mural, slight motion blur on the ball only. Camera to his left side at hip height, 35mm look, the wall, the ball and the hoodie sharp. Concrete ledge and dark metal rail at the edge of frame, green pitch, water and grey city skyline soft in the distance, overcast flat daylight. No text, no logos other than the hoodie and the mural, no watermark, 9:16.
```

### B. From behind the net, restaged by depth (first version put Greg in the net)

```
Photorealistic editorial action still, shot from directly behind the goal at ground level, looking out through the white goal netting onto a full soccer pitch. Layer the scene by distance from the camera, nearest first.

Nearest, one yard from the lens: the white netting, soft and out of focus, filling the frame edges.

Next, on the goal line between the two white posts, three yards from the lens: a goalkeeper in a plain dark green jersey, black shorts, black gloves, no logos, seen from behind, mid-dive to his right, body horizontal, arms stretched toward the ball.

Next, painted in white on the grass in front of the keeper: the six-yard box, its full rectangle visible.

Next, at the penalty spot, twelve yards from the goal line and facing the camera: the shooter. Wardrobe first: he wears the exact black fleece hoodie from the attached product image, hood down, its white GOOOL over red bar over ATHLETICS lockup unchanged across the chest, black athletic shorts, plain black soccer cleats with no visible brand marks, white socks. He is the exact man from the attached avatar image, [paste Greg's card]. His right leg is in full follow-through, weight forward, eyes on the goal.

Between the shooter and the keeper, in the air above the six-yard box: [ball], frozen mid-flight rising toward the top corner the keeper is diving for, slight motion blur on the ball only.

Beyond the shooter: the eighteen-yard box line and the penalty arc painted white, then the rest of the green pitch to the far goal, a line of trees, water and a grey city skyline under an overcast sky, soft flat daylight.

Camera at knee height, 35mm look, focus on the shooter and the ball, keeper and netting soft. Nobody else on the pitch. No text, no logos other than the hoodie, no watermark, 9:16.
```

### C. Two avatars juggling at the wall

Attach hoodie image, `greg_front.png`, Terrace Tee png, `alex_front.png`.

```
Photorealistic editorial action still of two men keeping a ball up between them in front of a weathered concrete wall with a chipped painted GOOOL over red bar over ATHLETICS mural. Wardrobe first. The man on the left wears the exact black fleece hoodie from the first attached product image, hood down, its white GOOOL over red bar over ATHLETICS lockup unchanged across the chest, black athletic shorts, plain black soccer cleats with no visible brand marks, white socks; he is the exact man from the first attached avatar image, [paste Greg's card]. The man on the right wears the exact natural cream cotton tee from the second attached product image, its black GOOOL over ATHLETICS lockup unchanged across the chest, black athletic shorts, plain black soccer cleats with no visible brand marks, white socks; he is the exact man from the second attached avatar image, [paste Alex's card]. They stand about three yards apart, both angled toward the camera so both chest prints read, the man on the right flicking the ball up with the inside of his foot, the man on the left waiting with his knee raised, [ball], frozen mid-air between them at chest height, slight motion blur on the ball only. Concrete ledge and dark metal rail behind them, green soccer pitch with two white goals beyond, a line of trees, water and a grey city skyline under an overcast sky, soft flat daylight. Camera at waist height, 35mm look, both men and the ball sharp, skyline soft. No text, no logos other than the two garments and the mural, no watermark, 9:16.
```

Swap a pair by swapping a whole wardrobe sentence and its attachments:
Andrew in the Matchday Tee Black (`GOOOL_MODERN_PERFORMANCE_FRONT_V3.png`,
`andrew_front.png`); Jeff in the Matchday Tee White.

### D1. Ball under the arm, under the mural

```
Photorealistic editorial still. Wardrobe first: the man wears the exact black fleece hoodie from the attached product image, hood down, its white GOOOL over red bar over ATHLETICS lockup unchanged across the chest, black athletic shorts, plain black soccer cleats with no visible brand marks, white socks. He is the exact man from the attached avatar image, [paste Greg's card]. He stands square to the camera directly beneath the chipped painted GOOOL over red bar over ATHLETICS mural on the weathered concrete wall, the mural centred above his head, [ball] tucked under his right arm, left hand relaxed at his side, weight on one leg, calm direct look at the lens. Concrete ledge and dark metal rail to one side, green soccer pitch with two white goals beyond, a line of trees, water and a grey city skyline under an overcast sky, soft flat daylight. Camera at chest height, 50mm look, the man and the mural sharp. No text, no logos other than the hoodie and the mural, no watermark, 9:16.
```

### D2. Hands in the pocket, foot on the ball (ran: wall only half built)

```
Photorealistic editorial still. Wardrobe first: the man wears the exact black fleece hoodie from the attached product image, hood down, its white GOOOL over red bar over ATHLETICS lockup unchanged across the chest, black athletic shorts, plain black soccer cleats with no visible brand marks, white socks. He is the exact man from the attached avatar image, [paste Greg's card]. He stands square to the camera directly beneath the chipped painted GOOOL over red bar over ATHLETICS mural on the weathered concrete wall, the mural centred above his head, both hands tucked into the hoodie's kangaroo pocket, shoulders relaxed, right foot resting on top of [ball], calm direct look at the lens. Concrete ledge and dark metal rail to one side, green soccer pitch with two white goals beyond, a line of trees, water and a grey city skyline under an overcast sky, soft flat daylight. Camera at chest height, 50mm look, the man and the mural sharp. No text, no logos other than the hoodie and the mural, no watermark, 9:16.
```

### D3. Palming the ball at the lens

```
Photorealistic editorial still. Wardrobe first: the man wears the exact black fleece hoodie from the attached product image, hood down, its white GOOOL over red bar over ATHLETICS lockup unchanged across the chest, black athletic shorts, plain black soccer cleats with no visible brand marks, white socks. He is the exact man from the attached avatar image, [paste Greg's card]. He stands beneath the chipped painted GOOOL over red bar over ATHLETICS mural on the weathered concrete wall, the mural above and behind his head, and holds [ball] in one open hand pushed straight at the lens, the ball large in the foreground and slightly soft, his face and the chest print sharp behind it, the ball held to one side so the lockup stays fully visible, calm direct look at the camera. Concrete ledge and dark metal rail to one side, green soccer pitch with two white goals beyond, a line of trees, water and a grey city skyline under an overcast sky, soft flat daylight. Camera at chest height, 35mm look, shallow depth of field. No text, no logos other than the hoodie and the mural, no watermark, 9:16.
```

### D2, set built first, every element placed (the full-spec version)

Attach hoodie image, `greg_front.png`, and the cap still
`instagram/feed/2026-09-30_stacked-cap-ledge_source-2x3.jpg` as the
scene reference if Grok takes a third image. Use the mark description
above in place of THE MURAL for the strictest run.

```
Photorealistic editorial still, vertical 9:16 frame. Build the set first, then the man.

THE WALL. A single tall concrete wall fills the left two thirds of the frame from the top edge of the picture all the way down to the ground; its right edge is a clean vertical line about two thirds of the way across the frame. The concrete is weathered: patches of flaking white and grey paint, exposed aggregate, rust streaks, a few hairline cracks. The wall is flat and faces the camera square-on. Nothing is missing from it, no gaps, no scaffolding, no second wall.

THE MURAL. Painted directly on that wall, fully inside the frame with clear concrete margin on every side, occupying the upper third of the wall: three stacked elements, centred on each other. Top: the word GOOOL in heavy black italic block capitals with notched O's, about one metre wide. Middle: a solid red horizontal bar the same width as the word, directly beneath it. Bottom: the word ATHLETICS in thin black spaced capitals, the same width again. The paint is chipped and weathered but every letter is complete and legible. If a scene reference image is attached, match its wall and mural exactly.

THE GROUND. A flat grey concrete apron runs from the base of the wall to the bottom edge of the frame, with a little grass in its cracks.

THE RIGHT THIRD. Past the wall's right edge: a waist-high concrete ledge with a dark metal rail on top, then, falling away below and beyond it, a green soccer pitch with two white goals, a line of trees, a band of water, and a grey city skyline under an overcast sky. Soft flat daylight, no hard shadows.

THE MAN. Wardrobe first: he wears the exact black fleece hoodie from the attached product image, hood down, its white GOOOL over red bar over ATHLETICS lockup unchanged across the chest, black athletic shorts to mid-thigh, plain black soccer cleats with no visible brand marks, white crew socks. He is the exact man from the attached avatar image, [paste Greg's card]. He stands on the concrete apron directly beneath the mural, square to the camera, full body in frame from cleats to hair with a hand's width of concrete above his head before the mural begins, so the mural sits entirely above him and nothing on him covers any letter. Both hands are tucked into the hoodie's kangaroo pocket, shoulders relaxed, weight on his left leg, his right foot resting on top of a soccer ball on the ground in front of him. The ball: glossy white with large black rounded-hexagon panels, each filled with fine concentric black lines, small gold four-point star accents scattered between the panels, no brand marks, no crest, no text. Calm, direct look into the lens, mouth closed.

CAMERA. Straight on at his chest height, 50mm look, no tilt. The man, the ball and the mural sharp; the pitch and skyline slightly soft. No text anywhere, no logos other than the hoodie print and the mural, no watermark.
```

## Where it stood at the end of the day

Grok held the scene and the avatars well for the three static pictures and
lost the plot on action and on the letterforms as the day went on. Best
bet for picture 4: the full-spec D2 with the cap still attached as the
scene reference, then the real lockup over the render in Claude Design.
