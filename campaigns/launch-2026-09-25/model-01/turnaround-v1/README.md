# GOOOL Model 01 — 360° reference pack v1

Original fictional adult male character. Created with the built-in image generation tool, using the existing portrait and full-body image as the identity and body masters. These originals are preserved byte for byte.

## Contents

- `full-body/`: eight separate full-length PNGs covering front, both front three-quarter views, both side profiles, both rear three-quarter views and straight back.
- `portraits/`: the original frontal portrait and two detailed side portraits.
- `360-viewer.html`: open in a browser to rotate through the eight reference frames, compare all angles and inspect facial references. Extract the ZIP first and keep the folders beside the viewer.
- `HIGGSFIELD-IDENTITY-PROMPT.txt`: reusable identity instructions and a turntable video prompt.
- `manifest.json`: each file's view, dimensions and SHA-256 hash.
- `generation-prompts.json`: exact generation and correction prompts.

## Angle convention

The sequence is front (000), front toward image left (045), nose pointing image left (090), rear toward image left (135), straight back (180), rear toward image right (225), nose pointing image right (270), front toward image right (315). Left/right in filenames describes image direction, not anatomical handedness. Degrees identify approximate viewpoints; these are generated photographs, not calibrated camera measurements.

## Use for campaign production

1. Keep `portraits/000-front-portrait.png` as the primary identity reference throughout the campaign.
2. Add the closest corresponding full-body or side-portrait reference for the shot being made, where reference inputs are available. Supply individual PNGs, rather than a screenshot of the viewer.
3. Supply the approved GOOOL product images separately for wardrobe and print placement. The plain reference outfit is an identity base.
4. Reuse the identity prompt and evaluate every output against the original portrait. Check face shape, eyes, nose, jaw, ears, haircut, skin tone, stubble, proportions and garment artwork. Regenerate drifting shots from the original references instead of using a drifting output as a new master.

The set supplies visual coverage around the character; it is not a rigged 3D model or a guarantee of identical identity in every generated video frame. Previously unseen sides and rear details are newly inferred and established by this reference set. All files remain local campaign assets; they have not been uploaded to Higgsfield or deployed to the store.
