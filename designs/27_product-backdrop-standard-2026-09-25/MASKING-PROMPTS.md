# Imagegen use

Built-in imagegen was used for silhouette guides, not replacement garment imagery. All final garments were composited from original source pixels. Guides are saved in `mask-guides`, refined alpha masks in `masks`, originals in `originals`.

## Bone front guide prompt

Precise background-extraction edit. Output ONLY an exact aligned grayscale garment alpha matte for this input, at the identical 1078 x 1348 canvas, no rescaling, no recentering, no reinterpretation. Every pixel belonging to the hoodie (including hood, cuffs, all artwork, fabric, drawstrings) must be solid white #FFFFFF; every pixel of exterior background, floor shadow, and the visible gaps between sleeves and torso must be solid black #000000. The entire garment is a single solid white silhouette with no internal artwork or texture. A narrow antialiased boundary is allowed. Trace the original silhouette with pixel precision, preserve exact source placement and proportions. Do not generate a new hoodie. This is a masking aid for compositing ORIGINAL pixels; output no text, checkerboard, lighting or shadow.

## Other five guide prompts (one call per original)

Precise background-extraction edit. Output ONLY an exact aligned grayscale garment alpha matte for the provided input at matching portrait aspect ratio and identical normalized placement. No scaling or recentering. Every pixel belonging to the original hoodie must be pure WHITE #FFFFFF, with all print, texture, seams, shadows ON the garment filled white too. Every pixel of exterior background and floor shadow must be pure BLACK #000000, including the real visible gaps between sleeves and torso. Produce one smooth solid white silhouette of the EXACT hoodie, with a narrow clean antialiased boundary and no internal details, no outlines, no gray areas, no stray white speckles outside silhouette. Trace original hood, sleeves, cuffs, hem and gaps faithfully. The original garment must not be redesigned; this is a mask used to retain original source pixels for a background-only edit.
