# Modern Sport Performance Tee — ATHLETICS print-scale audit

Checked 2026-09-25 against the local production artwork and current Apliiq public guidance. This is an artwork preflight, not a physical sample approval or live-account verification.

## Result

The local back artwork does not meet Apliiq's recommended 2 mm lettering-detail thickness at its documented 3.25-inch width. The local front artwork has stems below 2 mm at both the proposed 9-inch width and the source-reported 11-inch width. Increasing file resolution alone will not correct physical stroke thickness.

## Supplier guidance

https://help.apliiq.com/portal/en/kb/articles/how-to-prepare-artwork-for-transfer-printing

Apliiq recommends 300 dpi at final size, PNG in RGB, opaque printed pixels, and at least 2 mm thickness for font parts and standalone details. It recommends thickening thin lettering with an outline. This is published guidance for DTF/transfer; the local product spec still records the actual process as requiring supplier confirmation.

## Files and measurements

Back: `tiles/designs/16_goool_athletics/print_masters/upload/GA-01-B_975px_CLEAN.png`

- Canvas: 975 x 333 pixels; documented artwork width: 3.25 in / 82.55 mm; effective resolution: 300 ppi.
- SHA256: 07199d54ede15bcf25aac3a2c9ede9212ae25f38cf7ffc456353042ff3c96ae4.
- At image row y=295, the T stem occupies x=178..185 (8 pixels), L x=382..389 (8 pixels), and I x=694..702 (9 pixels), using alpha >=128 as the visible-edge threshold.
- Those straight strokes measure approximately 0.677-0.762 mm at 3.25 inches wide. These are representative stems, not a claim that every contour has been measured or that this is the global minimum.
- A 2 mm straight stroke at this scale requires at least 24 pixels (2.032 mm at 300 ppi).

Front: `tiles/designs/16_goool_athletics/print_masters/upload/GA-01-F_3300px_CLEAN.png`

- Canvas: 3300 x 1118 pixels; visible width is 3300 pixels.
- SHA256: 8bed7c19280100e7d25f610dbd8de9e8463c1e4299a6aa9fa4bf875a45812c7e.
- At y=1020, the T stem occupies x=790..811 (22 pixels), L x=1357..1378 (22 pixels), and I x=2224..2245 (22 pixels), alpha >=128.
- At 9 inches wide: 22 pixels = 1.524 mm; a 2 mm straight stroke requires at least 29 pixels.
- At 11 inches wide: 22 pixels = 1.863 mm; a 2 mm straight stroke requires at least 24 pixels.

Formula: stroke_mm = stroke_pixels / visible_artwork_width_pixels * final_visible_width_inches * 25.4.

## Scale evidence and limitations

Source: `tiles/designs/apliiq-upload-packages-2026-09-21-v2/packages/14-goool-athletics-modern-sport-performance-tee-black/spec.json`.

That record proposes front width 9 inches and back width 3.25 inches, with artwork tops 3 inches below the front collar seam and 2 inches below the rear collar seam. It separately reports saved design 6112037 at an 11-inch front width. The source hashes match the measured local files. Neither the present saved supplier artwork nor its current dimensions were independently verified in this audit. No conclusion about the current live Apliiq order setup follows solely from these local records.

## Correction specification

1. Preserve the small back placement at 3.25 inches and rebuild ATHLETICS with heavier lettering whose narrow functional strokes are at least 2 mm at final print size; inspect A counters, joins, C/S curves and letter spacing. Do not simply enlarge the entire logo: an 8-pixel stem would require approximately 9.60 inches of total artwork width to reach 2 mm.
2. Resolve the front's 9-versus-11-inch physical width and thicken lettering for the selected size. Check any supplier scaling on the smallest garment.
3. Export opaque artwork on transparency at at least 300 ppi at the agreed physical size. Check all fine features, including the GOOOL cuts, rather than treating one passing stem as full-artwork approval.
4. Verify the actual supplier file, placement and dimensions in saved design 6112037 (or its current replacement), and obtain a dimensioned proof/sample on the actual performance fabric before describing the print as confirmed.

No artwork, supplier design, or live website was modified by this audit.
