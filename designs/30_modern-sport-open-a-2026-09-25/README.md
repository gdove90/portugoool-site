# Modern Sport open-A back revision — 2026-09-25

Owner requested a visible triangular opening in the back ATHLETICS A and allowed slightly larger lettering for a cleaner fit. This revision changes both Black and True Royal back-detail renders. Front images are unchanged.

ATHLETICS is rebuilt as clean rounded vector glyphs with consistent spacing, following the existing lettering proportions. Cap height increases from 8.3397 mm to 10.795 mm (+29.44%). The word is 80.01 mm wide beneath the unchanged 82.55 mm GOOOL mark. The A has one enclosed triangular counter, approximately 1.736 mm wide × 1.905 mm tall at its bounding box. Its largest inscribed opening is about 1.136 mm across. The triangle naturally narrows toward its apex; these are not minimum negative-gap measurements.

## Artwork and supplier status

Prepared back replacement: `exports/GA-01-B_v5_OPEN-A_1950px_600ppi.png`.

- 1950 × 741 px, RGB plus binary alpha (0 / 255 only), 600 ppi metadata.
- Final size **3.25 × 1.235 inches** / **82.55 × 31.369 mm**. Lock aspect ratio.
- Nominal vector strokes: A 2.5 mm, most letters 2.8 mm, I 3.0 mm.
- Independent raster medial-skeleton minimum: **2.1981 mm**, on A. Other letters measured 2.4245–3.0220 mm at this size.
- The A has exactly one enclosed counter. See `print-audit.json` and `master-spec.json`.
- The GOOOL wordmark bitmap is retained from the existing v3 master. Its pointed cut terminals remain a supplier-proof concern; the quoted minimum covers ATHLETICS only.

Official reference: https://help.apliiq.com/portal/en/kb/articles/how-to-prepare-artwork-for-transfer-printing — font strokes at least 2 mm, sufficient resolution at final size and opaque printed pixels. Raster measurements are artwork checks, not a physical print guarantee.

**This new master has not been uploaded to Apliiq.** The prior authenticated upload record is for v3, whose A was filled. A signed-in operator must apply v5 to the back of saved designs 6112037 (Black) and 6113361 (True Royal) and verify the final dimensions/proof. Do not compress v5 to the old 1.11-inch placement height; that can erase its stroke margin. Do not treat updating the website as updating fulfillment artwork. Supplier IDs, SKUs and front production art are unchanged.

## Website changes

Both back PNG filenames retain `_V3` for existing catalog references. Their URL cache revision is `modern-open-a-20260925-v5`; the front images keep their v4 revision. All pixels outside a 282 × 66 px repair region around ATHLETICS remain exactly unchanged, including the GOOOL logo, garment, crop and flat sRGB #F2F2F2 background.

ImageGen created the localized fabric repair plates; deterministic compositing then applied the exact new lettering master. Prompts and original generated-image paths are in `plates.json`. The native A and other glyph SVGs, master build script, audit script, before/after proof, originals and final renders are retained here. `GA-01-B_v5-layout.svg` includes embedded raster artwork; the individual glyph SVGs are vector sources.

Final website images and source package are mirrored into the launch folder. Its `artwork/pending-v5/` folder is explicitly marked as awaiting Apliiq upload. The public storefront gate remains removed.

## Live result

Production deploy 6ab657e46cce8061fd574772 completed successfully. Six public URLs returned HTTP 200 without cookies, both back image downloads matched the approved SHA-256 hashes, and both WebP optimizer responses preserved RGB 242,242,242 in sampled background regions. See verified-production.json. The public gate remains removed. The replacement print master still awaits Apliiq upload; deployment did not change the supplier account.
