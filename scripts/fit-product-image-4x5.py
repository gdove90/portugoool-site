# -*- coding: utf-8 -*-
"""Fit a square product render into the site's 4:5 product frame.

The product gallery (ProductDetail.tsx) and the shop tiles (ProductCard.tsx)
are `aspect-[4/5]` boxes with `object-contain`, and every studio image in
public/products is 1122 x 1402 (4:5). A square render (ChatGPT exports are
1024/1254 square) therefore sits in the box with the box colour showing
above and below it. This script extends the render's OWN background to
4:5 so the image fills the frame, and trims the side margins so the garment
is drawn at the same scale as the rest of the catalogue.

How the background is extended: each new row above (below) the render is a
copy of the average of the outermost 8 rows, per column, lightly blurred
across columns. That reproduces a flat backdrop exactly and continues a
side-to-side vignette without a seam (checked in --report).

Usage:
  python scripts/fit-product-image-4x5.py IN.png OUT.webp [--garment-width 0.90]
        [--top 0.115] [--quality 90] [--report]

Garment framing defaults were measured across the existing 4:5 studio
images on 2026-09-24: garment width 0.87-0.94 of the frame, top margin
0.09-0.14, bottom margin 0.08-0.12.
"""
import argparse, sys
import numpy as np
from PIL import Image, ImageFilter

ap = argparse.ArgumentParser()
ap.add_argument('src')
ap.add_argument('dst')
ap.add_argument('--garment-width', type=float, default=0.90,
                help='garment bounding-box width as a fraction of the frame width')
ap.add_argument('--top', type=float, default=0.115,
                help='space above the garment as a fraction of the frame height')
ap.add_argument('--quality', type=int, default=90)
ap.add_argument('--strip', type=int, default=8, help='rows averaged for the extension colour')
ap.add_argument('--report', action='store_true')
a = ap.parse_args()

im = Image.open(a.src).convert('RGB')
px = np.asarray(im).astype(np.float64)
H, W = px.shape[:2]

# --- background model: per-column colour of the top and bottom strips, blended vertically
top_strip = px[:a.strip].mean(axis=0)          # (W,3)
bot_strip = px[-a.strip:].mean(axis=0)
t = (np.arange(H) / (H - 1))[:, None, None]
bg = (1 - t) * top_strip[None] + t * bot_strip[None]   # (H,W,3) linear top->bottom per column

# --- garment bounding box: pixels that differ from the background model
resid = np.abs(px - bg).sum(axis=2)
mask = resid > 30
# ignore a 2 px frame so encoder halos at the edge do not count as content
mask[:2, :] = mask[-2:, :] = False
mask[:, :2] = mask[:, -2:] = False
ys, xs = np.where(mask)
if len(xs) == 0:
    sys.exit('no garment found')
gx0, gy0, gx1, gy1 = xs.min(), ys.min(), xs.max(), ys.max()
gw, gh = gx1 - gx0 + 1, gy1 - gy0 + 1

# --- target frame
frame_w = int(round(gw / a.garment_width))
frame_w = min(frame_w, W)                 # never upscale the source
frame_h = int(round(frame_w * 5 / 4))
# horizontal crop centred on the garment
cx = (gx0 + gx1) / 2
x0 = int(round(cx - frame_w / 2))
x0 = max(0, min(x0, W - frame_w))
crop = px[:, x0:x0 + frame_w]
# vertical placement: garment top at a.top of the frame
pad_top = int(round(a.top * frame_h - gy0))
pad_bot = frame_h - H - pad_top
if pad_top < 0 or pad_bot < 0:
    # frame shorter than the source: crop rows instead of padding
    y0 = max(0, min(-pad_top, H - frame_h))
    crop = crop[y0:y0 + frame_h]
    pad_top = pad_bot = 0
    out = crop
else:
    def strip_colour(rows):
        s = rows.mean(axis=0)                                   # (frame_w,3)
        s_img = Image.fromarray(np.clip(s[None], 0, 255).astype(np.uint8))
        s_img = s_img.filter(ImageFilter.GaussianBlur(radius=6))  # across columns only
        return np.asarray(s_img).astype(np.float64)[0]
    top_c = strip_colour(crop[:a.strip])
    bot_c = strip_colour(crop[-a.strip:])
    out = np.concatenate([
        np.repeat(top_c[None], pad_top, axis=0),
        crop,
        np.repeat(bot_c[None], pad_bot, axis=0),
    ], axis=0)

out_img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
out_img.save(a.dst, 'WEBP', quality=a.quality, method=6)

if a.report:
    oh, ow = out.shape[:2]
    # seam check: mean abs difference between the last synthetic row and the first real row
    seam_top = float(np.abs(out[pad_top - 1] - out[pad_top]).mean()) if pad_top else 0.0
    seam_bot = float(np.abs(out[pad_top + H - 1] - out[pad_top + H]).mean()) if pad_bot else 0.0
    print(f"{a.src} -> {a.dst}")
    print(f"  source {W}x{H}, garment bbox ({gx0},{gy0},{gx1},{gy1}) = {gw}x{gh}")
    print(f"  frame {ow}x{oh} (ratio {ow/oh:.4f}), crop x0={x0}, pad top={pad_top} bottom={pad_bot}")
    print(f"  garment width {gw/ow:.3f} of frame, top margin {(gy0+pad_top)/oh:.3f}, bottom margin {(oh-1-(gy1+pad_top))/oh:.3f}")
    print(f"  seam delta top={seam_top:.2f} bottom={seam_bot:.2f} (levels; < 1.5 is invisible)")
