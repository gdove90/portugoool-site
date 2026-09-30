# Ad avatars

Reference models for GOOOL Athletics ads and social imagery. Claude Design
and Higgsfield both point at these files, so the paths and names below are
the contract. Owner decision 2026-09-29.

## Layout

```
brand-assets/avatars/
  jeff/    jeff_front.png  jeff_back.png  jeff_left.png  jeff_right.png
  greg/    greg_front.png  greg_back.png  greg_left.png  greg_right.png
  alex/    alex_front.png  alex_back.png  alex_left.png  alex_right.png  alex_movement.mp4
  andrew/  andrew_front.png andrew_back.png andrew_left.png andrew_right.png
  AVATARS.md
```

One folder per avatar, lowercase first name. Four views per avatar, PNG,
named `<name>_<view>.png` with view in `front`, `back`, `left`, `right`.
Left and right are the model's own left and right side. An optional
`<name>_movement.mp4` holds a short motion reference for video tools.
Add a new avatar by adding a folder with the same files and a row to the
roster.

## Roster

| Avatar | Status | Added | Source files |
|---|---|---|---|
| jeff | in use, low-res placeholders (see note) | 2026-09-29 | Desktop: `Model Jeff Front.webp`, `Model Jeff Back.webp`, `Model jeff left and right profile.webp` |
| greg | in use, low-res placeholders (see note) | 2026-09-29 | Desktop: `Model Greg Front Back.webp`, `Model Greg Left Right Profile.webp` |
| alex | in use, low-res placeholders (see note) | 2026-09-29 | Downloads: `image (1).jpg` (front), `generated_video.mp4` (movement); Desktop: `model alex back and side profile.webp` (3-panel: back, side, side), `Model Alex right side profile.webp` |
| andrew | in use, low-res placeholders (see note) | 2026-09-29 | Desktop: `Model andrew front.webp`, `Model Andrew Back and left side.webp` (3-panel: back, side, side), `Model Andrew right side.webp` |

**Resolution note (all four).** Apart from `alex_front.png` (1152 x 1728),
the saved stills are 256 x 256 px, several of them composites: Jeff's and
Andrew's fronts crop at the neck, Greg's views crop at the chin, every
side-by-side pair was split here into 128 x 256 px files and the Alex and
Andrew three-panel images into 85 x 256 px slices. `alex_left.png` and
`andrew_left.png` are the middle panels of those composites; confirm they
show the left side. That is thumbnail size. Re-export the originals at full resolution (2000 px on the
long side or better, head included) and overwrite the four files with the
same names; nothing else has to change.

## Rules of use

- Avatars are for ads, social and atmosphere imagery only. Product
  listing photos on goool.shop always show the real garment and never an
  avatar render (see CLAUDE.md, Image Standards).
- Each avatar is a fixed identity: same face, build and skin tone across
  every generation, so the campaign reads as one cast. Regenerate from
  these four views, never from a one-off prompt.
- No recognisable real-person likeness unless a signed model release is
  on file in this folder next to the images.
- Garments on the avatar must be the GOOOL pieces as sold: correct
  colourway, correct print placement, no crests, no federation or
  competition marks, no supplier branding.
- Copy on any ad that uses an avatar follows the launch rules: "Wear the
  Feeling", no prices, no "football".
