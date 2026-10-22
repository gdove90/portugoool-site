# -*- coding: utf-8 -*-
"""Bring a model photo to the site's 2:3 model-photo frame.

Owner standard 2026-10-20: every model photo on every product shows the same
studio background width, so each one fills one 2:3 frame edge to edge
(designs/00_asset-library/MODEL-PHOTO-FRAME-STANDARD.md). Photos arrive in
mixed shapes, so this script extends the photo's OWN backdrop to 2:3 at its
native scale. The original pixels are never resampled or retouched; they sit
in the middle of the new canvas.

How the backdrop is extended: a photo narrower than 2:3 gains columns on both
sides, a wider one gains rows above and below. Each new row (column) takes the
mean colour of the outermost 12 pixels of that row (column), skipping model
pixels (saturated or dark), smoothed along the edge so the grain of a single
pixel never streaks, plus fresh noise at the backdrop's measured grain.
--crop instead trims a close-up (a print detail) to 2:3: a wider photo loses
columns, a narrower one loses rows. --anchor says which end to keep (start =
top or left, end = bottom or right; default centre), so a narrow close-up can
keep its waistband and give up leg below the hem. A photo whose model is cut
by its own edge (arms cropped) cannot be extended this way: ask the owner for
a wider original. Never outpaint on Higgsfield or any paid tool without the
owner's permission.

Usage:
  python scripts/frame-model-photo-2x3.py IN OUT.webp [--crop [--anchor start|center|end]] [--quality 92]
"""
import argparse
import numpy as np
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('src')
ap.add_argument('dst')
ap.add_argument('--crop', action='store_true', help='crop a close-up to 2:3 instead of extending (columns off a wider photo, rows off a narrower one)')
ap.add_argument('--anchor', choices=['start', 'center', 'end'], default='center', help='with --crop: keep the top/left (start), middle (center) or bottom/right (end)')
ap.add_argument('--quality', type=int, default=92)
args = ap.parse_args()

BAND = 12
rng = np.random.default_rng(0)


def smooth(values, sigma=4.0):
    """Gaussian-smooth an (n, 3) series along n, ignoring NaN rows."""
    n = len(values)
    valid = ~np.isnan(values[:, 0])
    if not valid.any():
        raise SystemExit('no backdrop pixels at the edge; outpaint this photo instead')
    idx = np.arange(n)
    filled = np.stack([np.interp(idx, idx[valid], values[valid, c]) for c in range(3)], 1)
    r = int(sigma * 3)
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2)
    k /= k.sum()
    padded = np.pad(filled, ((r, r), (0, 0)), mode='edge')
    return np.stack([np.convolve(padded[:, c], k, mode='valid') for c in range(3)], 1)


def edge_profile(band):
    """band: (n, BAND, 3) pixels along one edge. Returns smoothed colour per n and grain."""
    lum = band.mean(-1)
    sat = band.max(-1) - band.min(-1)
    backdrop = (sat <= 30) & (lum >= 95)
    sums = (band * backdrop[..., None]).sum(1)
    counts = backdrop.sum(1)[:, None]
    with np.errstate(invalid='ignore', divide='ignore'):
        mean = np.where(counts > 0, sums / counts, np.nan)
    colour = smooth(mean)
    resid = (band - colour[:, None, :])[backdrop]
    grain = float(np.clip(resid.std() if resid.size else 1.0, 0.5, 4.0))
    return colour, grain


def fill(colour, grain, length):
    """New pixels: colour per edge position, repeated `length` deep, plus grain."""
    block = np.repeat(colour[:, None, :], length, 1)
    return block + rng.normal(0, grain, block.shape)


def crop_seam(cols):
    """How many outer lines (0-3) are a crop artifact: a bright or dark seam that
    differs from the backdrop just inside it. cols: (k, n, 3), outermost first."""
    k = 0
    while k < 3 and abs(cols[k].mean() - cols[k + 2:k + 7].mean()) > 3:
        k += 1
    return k


a = np.asarray(Image.open(args.src).convert('RGB')).astype(np.float64)
h, w, _ = a.shape
target = 2 / 3
if w / h < target:
    # Hand-cropped strips can carry a 1-2 px seam at their cut edges; drop it
    # so the extension continues the real backdrop.
    lt = crop_seam(a.transpose(1, 0, 2)[:10])
    rt = crop_seam(a.transpose(1, 0, 2)[::-1][:10])
    a = a[:, lt:w - rt]
    h, w, _ = a.shape

def crop_offset(excess):
    return {'start': 0, 'center': excess // 2, 'end': excess}[args.anchor]


if abs(w / h - target) < 0.002:
    out = a
elif args.crop and w / h < target:
    new_h = round(w / target)
    y0 = crop_offset(h - new_h)
    out = a[y0:y0 + new_h]
elif w / h < target:
    new_w = round(h * target)
    left = (new_w - w) // 2
    right = new_w - w - left
    lc, lg = edge_profile(a[:, :BAND])
    rc, rg = edge_profile(a[:, w - BAND:])
    out = np.concatenate([fill(lc, lg, left), a, fill(rc, rg, right)], 1)
elif args.crop:
    new_w = round(h * target)
    x0 = crop_offset(w - new_w)
    out = a[:, x0:x0 + new_w]
else:
    new_h = round(w * 1.5)
    top = (new_h - h) // 2
    bottom = new_h - h - top
    tc, tg = edge_profile(a[:BAND].transpose(1, 0, 2))
    bc, bg = edge_profile(a[h - BAND:].transpose(1, 0, 2))
    out = np.concatenate([fill(tc, tg, top).transpose(1, 0, 2), a,
                          fill(bc, bg, bottom).transpose(1, 0, 2)], 0)

img = Image.fromarray(out.round().clip(0, 255).astype(np.uint8))
img.save(args.dst, 'WEBP', quality=args.quality, method=6)
print(f'{w}x{h} -> {img.width}x{img.height} {args.dst}')
