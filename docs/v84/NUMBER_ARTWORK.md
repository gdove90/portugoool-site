# Original number artwork

The original white print files were found in the owner's existing repository:
`designs/_LIBRARY/1-PRINT-FILES/club-kit-2a-2l/numbers/white/`.
The associated `HANDOFF-2026-09-23-apliiq-print-files-v2-numbers.md` identifies the production number set.

Files 01 through 10 are copied byte-for-byte into `public/v84/numbers/`. The originals are approximately 2250 pixels high, sufficient for 7.5 inches at 300 pixels per inch. Embedded metadata reports 72 DPI; the pixel dimensions, not that metadata, support this calculation.

`src/v84/number-art.js` uses those bitmap silhouettes at a 512-pixel preview height. It does not use a font. The zero is extracted from original 10 by subtracting the exact original 1 silhouette at x=0, then cropping the remaining zero. The original-resolution alpha mask of that 1 was compared with standalone 01: zero differing opaque alpha pixels. The original zero bounds are x=848..2527 and y=0..2249.

The preview supports the approved range 1..99. These are preview compositions, not new manufacturer-ready print files; final decoration dimensions still require supplier confirmation. The original 01..25 production files remain untouched. Local desktop preview of 90 confirmed that both digits render sharply. Mobile and complete number interaction review remain required.
