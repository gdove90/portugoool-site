# Ad avatars

Reference models for GOOOL Athletics ads and social imagery. Claude Design
and Higgsfield both point at these files, so the paths and names below are
the contract. Owner decision 2026-09-29.

## Layout

```
brand-assets/avatars/
  jeff/    jeff_front.png  jeff_back.png  jeff_left.png  jeff_right.png
  greg/    greg_front.png  greg_back.png  greg_left.png  greg_right.png     (pending)
  alex/    alex_front.png  alex_back.png  alex_left.png  alex_right.png     (pending)
  andrew/  andrew_front.png andrew_back.png andrew_left.png andrew_right.png (pending)
  AVATARS.md
```

One folder per avatar, lowercase first name. Four views per avatar, PNG,
named `<name>_<view>.png` with view in `front`, `back`, `left`, `right`.
Left and right are the model's own left and right side. Add a new avatar
by adding a folder with the same four files and a row to the roster.

## Roster

| Avatar | Status | Added | Source files |
|---|---|---|---|
| jeff | in use, low-res placeholders (see note) | 2026-09-29 | Desktop: `Model Jeff Front.webp`, `Model Jeff Back.webp`, `Model jeff left and right profile.webp` |
| greg | pending | | |
| alex | pending | | |
| andrew | pending | | |

**Jeff resolution note.** The three saved files are 256 x 256 px; the
front view crops at the neck and the left/right views were one
side-by-side composite, split here into two 128 x 256 px files. That is
thumbnail size. Re-export the originals at full resolution (2000 px on the
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
