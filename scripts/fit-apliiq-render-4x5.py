# -*- coding: utf-8 -*-
"""Fit an Apliiq saved-design render (the 944 x 1440 product image Apliiq
generates for a saved design, white studio background) into the site's
4:5 product frame at 1137 x 1421, the size every casual-tee image uses.

Differences from fit-product-image-4x5.py (made for square ChatGPT
renders): the garment here is tall (a hoodie), so the frame is sized from
the garment HEIGHT (garment 0.80 of the frame height, 0.10 above, 0.10
below) and only falls back to width when a wide garment would overflow;
the pure-white background is flood-filled from the corners to the
catalogue's studio tone so the tiles sit level with the tee renders; the
sides are padded with that tone when the frame is wider than the source.

Usage:
  python scripts/fit-apliiq-render-4x5.py IN.png OUT.webp [--garment-height 0.80]
        [--top 0.10] [--bg F4F4F2] [--out-w 1137] [--quality 90] [--report]
"""
import argparse, sys
import numpy as np
from PIL import Image, ImageDraw

ap = argparse.ArgumentParser()
ap.add_argument('src')
ap.add_argument('dst')
ap.add_argument('--garment-height', type=float, default=0.80)
ap.add_argument('--top', type=float, default=0.10)
ap.add_argument('--max-garment-width', type=float, default=0.90)
ap.add_argument('--bg', default='F4F4F2', help='studio tone hex that replaces the white background')
ap.add_argument('--out-w', type=int, default=1137)
ap.add_argument('--quality', type=int, default=90)
ap.add_argument('--report', action='store_true')
a = ap.parse_args()

bg = tuple(int(a.bg[i:i + 2], 16) for i in (0, 2, 4))
im = Image.open(a.src).convert('RGBA')
# flatten any transparency onto white first (Apliiq renders are opaque white, but be safe)
flat = Image.new('RGB', im.size, (255, 255, 255))
flat.paste(im, mask=im.split()[3])
im = flat
W, H = im.size

# --- garment bbox: anything that is not (near) white
px = np.asarray(im).astype(int)
mask = (255 - px).sum(axis=2) > 24
mask[:2, :] = mask[-2:, :] = False
mask[:, :2] = mask[:, -2:] = False
ys, xs = np.where(mask)
if len(xs) == 0:
    sys.exit('no garment found')
gx0, gy0, gx1, gy1 = xs.min(), ys.min(), xs.max(), ys.max()
gw, gh = gx1 - gx0 + 1, gy1 - gy0 + 1

# --- replace the white background with the studio tone (connected region from each corner)
for corner in [(0, 0), (W - 1, 0), (0, H - 1), (W - 1, H - 1)]:
    ImageDraw.floodfill(im, corner, bg, thresh=12)

# --- frame from garment height, checked against width
frame_h = gh / a.garment_height
frame_w = frame_h * 4 / 5
if gw > a.max_garment_width * frame_w:
    frame_w = gw / a.max_garment_width
    frame_h = frame_w * 5 / 4
frame_w, frame_h = int(round(frame_w)), int(round(frame_h))
# place: garment top at a.top of the frame, centred horizontally
cx = (gx0 + gx1) / 2
x0 = int(round(cx - frame_w / 2))
y0 = int(round(gy0 - a.top * frame_h))
canvas = Image.new('RGB', (frame_w, frame_h), bg)
canvas.paste(im, (-x0, -y0))
# any region outside the source stays bg (the source's own margins are the same tone after the flood fill)

out_h = int(round(a.out_w * 5 / 4))
out = canvas.resize((a.out_w, out_h), Image.LANCZOS)
out.save(a.dst, 'WEBP', quality=a.quality, method=6)

if a.report:
    print(f"{a.src} -> {a.dst}")
    print(f"  source {W}x{H}, garment bbox ({gx0},{gy0},{gx1},{gy1}) = {gw}x{gh}")
    print(f"  frame {frame_w}x{frame_h} at x0={x0} y0={y0}; output {a.out_w}x{out_h}")
    print(f"  garment height {gh/frame_h:.3f} of frame, width {gw/frame_w:.3f}, top margin {(gy0-y0)/frame_h:.3f}, bottom margin {(frame_h-(gy1-y0+1))/frame_h:.3f}")
