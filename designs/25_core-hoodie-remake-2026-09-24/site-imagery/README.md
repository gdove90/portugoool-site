# Core Hoodie (IND4000) · website imagery

Site images for the two hoodie rows, made 2026-09-24 from Apliiq's own
saved-design renders: after each of the six designs was saved, Apliiq
generated a front and a back product image of the design on the real
IND4000 blank in that colour (`blob.apliiq.com/sitestorage/products/<design>_<view>.jpg`,
944 x 1440, white background). Those originals are kept here unchanged
(`apliiq-render-*.png`); the site copies are fitted to the catalogue's 4:5
frame with `scripts/fit-apliiq-render-4x5.py` (garment 0.80 of the frame
height, top margin 0.10, background flood-filled to the studio tone
#F4F4F2, output 1137 x 1421 like the tee images). Checksums in
`FILES.json`. Product pages keep the "Concept render. Not a photograph of
a manufactured sample." caption because these are supplier renders, not
photographs of a produced hoodie.

| site file | design |
|---|---|
| GOOOL_STD_HOODIE_BLACK_RED_* | 6121031 · Black · Red Band |
| GOOOL_STD_HOODIE_BONE_RED_* | 6120990 · Bone · Red Band |
| GOOOL_STD_HOODIE_GREYHEATHER_RED_* | 6121043 · Grey Heather · Red Band |
| GOOOL_STD_HOODIE_BLACK_BLUE_* | 6121042 · Black · Blue Band |
| GOOOL_STD_HOODIE_BONE_BLUE_* | 6121021 · Bone · Blue Band |
| GOOOL_STD_HOODIE_GREYHEATHER_BLUE_* | 6121044 · Grey Heather · Blue Band |

Owner renders (ChatGPT, downloaded 2026-09-24 04:29 to 04:54) replaced the
Apliiq renders as the site copies for five of the six designs the same
night: Bone · Blue, Black · Red, Black · Blue, Grey Heather · Blue and Grey
Heather · Red (`owner-render-*.png` here, fitted with
`scripts/fit-product-image-4x5.py --threshold 60 --garment-height 0.80
--top 0.10`, so every hoodie sits at 0.80 of the frame height). The owner
supplied the Bone · Red pair on 2026-09-25 01:47 (already 1122 x 1402,
drawstrings visible; fitted at `--threshold 90` because the vignette on
that render otherwise read as garment), so all six site copies are now
owner renders. The Apliiq renders stay here as the supplier originals. The
owner re-supplied the Grey Heather · Red pair on 2026-09-25 02:03 at 1122 x
1402 (drawstrings visible), replacing the 1200 px square renders of the
night before, whose site copies had been only 841 x 1051 / 851 x 1064;
the squares are in `designs/_archive/hoodie-grey-heather-red-owner-renders-2026-09-24/`.
Fitted at `--threshold 90` like the Bone · Red pair.

The previous wordmark-only site images are in
`designs/_archive/hoodie-wordmark-imagery-2026-09-24/`.
