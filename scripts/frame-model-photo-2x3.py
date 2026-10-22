# -*- coding: utf-8 -*-
"""Bring a model photo to the site's 2:3 model-photo frame.

Owner standard 2026-10-20: every model photo on every product shows the same
studio background width, so each one fills one 2:3 frame edge to edge
(designs/00_asset-library/MODEL-PHOTO-FRAME-STANDARD.md). Photos arrive in
mixed shapes, so this script extends the photo's OWN backdrop to 2:3 at its
native scale. The original pixels are never resampled or retouched; they sit
in the middle of the new canvas.

How the backdrop is extended: a photo narrower than 2:3 gains columns on both
sides, a wider one gains rows above and below. Each new row (column) starts
from the backdrop colour at the outermost line of that row (column): a straight
fit through its outermost 12 pixels, model pixels (saturated or dark) skipped,
smoothed along the edge so the grain of a single pixel never streaks. The
backdrop's gradient across those 12 lines (one value for the whole edge, the
median of the per-line fits, so fit noise cannot streak either) is carried
outward and eases to flat over 24 lines, so a sloped studio backdrop meets its
extension without a step and a long extension cannot drift; fresh noise at the
backdrop's measured grain is added. A 1-3
line crop seam at the edges being extended (the sides of a narrow photo, the
top and bottom of a wide one) is dropped first.
--crop instead trims a close-up (a print detail) to 2:3: a wider photo loses
columns, a narrower one loses rows. --anchor says which end to keep (start =
top or left, end = bottom or right; default centre), so a narrow close-up can
keep its waistband and give up leg below the hem. A landscape close-up (a
head-and-shoulders shot) would come out tiny from --crop alone, so
--crop-width N trims only its empty sides to N px and then extends the
backdrop to 2:3; --extend-anchor end puts the photo at the bottom of the new
canvas so the extension sits above the head, not through the shoulders. A photo whose model is cut
by its own edge (arms cropped) cannot be extended this way: ask the owner for
a wider original. Never outpaint on Higgsfield or any paid tool without the
owner's permission.

Usage:
  python scripts/frame-model-photo-2x3.py IN OUT.webp [--crop | --crop-width N] [--anchor start|center|end] [--extend-anchor start|center|end] [--quality 92]
"""
import argparse
import numpy as np
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('src')
ap.add_argument('dst')
ap.add_argument('--crop', action='store_true', help='crop a close-up to 2:3 instead of extending (columns off a wider photo, rows off a narrower one)')
ap.add_argument('--anchor', choices=['start', 'center', 'end'], default='center', help='with --crop or --crop-width: keep the top/left (start), middle (center) or bottom/right (end)')
ap.add_argument('--crop-width', type=int, help='a wide photo: trim the sides to this many px first (about --anchor), then extend the backdrop above and below to 2:3')
ap.add_argument('--extend-anchor', choices=['start', 'center', 'end'], default='center', help='when extending: the photo sits at the top/left (start), middle (center) or bottom/right (end) of the new canvas')
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
    """band: (n, BAND, 3) pixels along one edge, axis 1 running inward from
    the outermost line. Returns, per position along the edge, the backdrop
    colour at the outermost line; one gradient per line for the whole edge
    (the median of straight fits through the band, backdrop pixels only, so
    column noise cannot streak); and the grain."""
    lum = band.mean(-1)
    sat = band.max(-1) - band.min(-1)
    backdrop = (sat <= 30) & (lum >= 95)
    x = np.arange(BAND, dtype=np.float64)
    wts = backdrop.astype(np.float64)
    cnt = wts.sum(1)
    with np.errstate(invalid='ignore', divide='ignore'):
        mx = (wts * x).sum(1) / cnt
        my = (wts[..., None] * band).sum(1) / cnt[:, None]
        dx = x[None, :] - mx[:, None]
        var = (wts * dx * dx).sum(1)
        slopes = (wts[..., None] * dx[..., None] * (band - my[:, None, :])).sum(1) / var[:, None]
    ok = (cnt >= 3) & (var > 0)
    slope = np.nanmedian(slopes[ok], 0) if ok.any() else np.zeros(3)
    # The join uses each position's own fitted value at the outermost line
    # (so a backdrop whose slope varies along the edge still meets its
    # extension exactly); only the outward ramp uses the shared slope.
    with np.errstate(invalid='ignore'):
        local = my - slopes * mx[:, None]
        shared = my - slope[None, :] * mx[:, None]
        # A fitted end value is noisier than a band mean, so smooth it over a
        # wider run along the edge; a studio backdrop only varies slowly there.
        edge = smooth(np.where(ok[:, None], local, shared), sigma=16.0)
    fitted = edge[:, None, :] + slope[None, None, :] * x[None, :, None]
    resid = (band - fitted)[backdrop]
    grain = float(np.clip(resid.std() if resid.size else 1.0, 0.5, 4.0))
    return edge, slope, grain


TAU = 24.0  # lines over which the continued gradient flattens out


def fill(edge, slope, grain, length, adjacent):
    """New pixels: (n, length, 3). The backdrop gradient carries on outward
    from the edge and eases to flat over TAU lines, so the join has no step
    and a long extension cannot drift. `adjacent` says which end of the
    block touches the photo ('end' for a block placed before it, 'start'
    for one placed after)."""
    d = np.arange(length, 0, -1) if adjacent == 'end' else np.arange(1, length + 1)
    ramp = TAU * (1 - np.exp(-d / TAU))
    block = edge[:, None, :] - slope[None, None, :] * ramp[None, :, None]
    return block + rng.normal(0, grain, block.shape)


def crop_seam(cols):
    """How many outer lines (0-4) are a crop artifact: a bright or dark seam that
    differs from the backdrop just inside it. cols: (k, n, 3), outermost first.
    A whole line is averaged, so 1.5 levels is well above noise; hand crops
    have carried a bright line over a dark one, each a couple of levels off."""
    k = 0
    while k < 4 and abs(cols[k].mean() - cols[k + 2:k + 7].mean()) > 1.5:
        k += 1
    return k


def crop_offset(excess, anchor=None):
    return {'start': 0, 'center': excess // 2, 'end': excess}[anchor or args.anchor]


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
elif w / h > target:
    # A wider photo is extended above and below, so its top and bottom
    # edges are the ones that must continue the real backdrop.
    tt = crop_seam(a[:10])
    bt = crop_seam(a[::-1][:10])
    a = a[tt:h - bt]
    h, w, _ = a.shape
    if args.crop_width and args.crop_width < w:
        # A landscape close-up: keep the subject at native scale by trimming
        # only the empty sides, then extend the backdrop to 2:3.
        x0 = crop_offset(w - args.crop_width)
        a = a[:, x0:x0 + args.crop_width]
        h, w, _ = a.shape

if abs(w / h - target) < 0.002:
    out = a
elif args.crop and w / h < target:
    new_h = round(w / target)
    y0 = crop_offset(h - new_h)
    out = a[y0:y0 + new_h]
elif w / h < target:
    new_w = round(h * target)
    left = crop_offset(new_w - w, args.extend_anchor)
    right = new_w - w - left
    parts = []
    if left:
        lc, ls, lg = edge_profile(a[:, :BAND])
        parts.append(fill(lc, ls, lg, left, 'end'))
    parts.append(a)
    if right:
        rc, rs, rg = edge_profile(a[:, w - BAND:][:, ::-1])
        parts.append(fill(rc, rs, rg, right, 'start'))
    out = np.concatenate(parts, 1)
elif args.crop:
    new_w = round(h * target)
    x0 = crop_offset(w - new_w)
    out = a[:, x0:x0 + new_w]
else:
    new_h = round(w * 1.5)
    top = crop_offset(new_h - h, args.extend_anchor)
    bottom = new_h - h - top
    parts = []
    if top:
        tc, ts, tg = edge_profile(a[:BAND].transpose(1, 0, 2))
        parts.append(fill(tc, ts, tg, top, 'end').transpose(1, 0, 2))
    parts.append(a)
    if bottom:
        bc, bs, bg = edge_profile(a[h - BAND:][::-1].transpose(1, 0, 2))
        parts.append(fill(bc, bs, bg, bottom, 'start').transpose(1, 0, 2))
    out = np.concatenate(parts, 0)

img = Image.fromarray(out.round().clip(0, 255).astype(np.uint8))
img.save(args.dst, 'WEBP', quality=args.quality, method=6)
print(f'{w}x{h} -> {img.width}x{img.height} {args.dst}')
