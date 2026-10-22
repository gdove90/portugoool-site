# -*- coding: utf-8 -*-
"""Lift a product shot off a white background onto the site's studio backdrop.

Owner standard 2026-10-22: every garment on the site sits on the same soft grey
studio backdrop. Supplier-style renders arrive on pure white. This script keeps
the garment pixels exactly, keeps the garment's own cast shadow, and swaps only
the white for the backdrop, then frames the result at 2:3
(designs/00_asset-library/MODEL-PHOTO-FRAME-STANDARD.md).

How: a white background means every non-garment pixel is "white darkened by
shadow", so its shadow strength is simply pixel / white. The new pixel is the
backdrop at that point times that strength: the shadow carries over, the white
goes. Garment pixels are copied unchanged, through a 1 px feather so the
anti-aliased edge never shows a light halo.

The garment mask comes from colour: saturated or dark pixels, holes filled
(white lettering inside the print), largest blob kept. A white garment has no
such cue, so pass --mask-from with a dark or coloured shot of the same render
(same pose, same template): its mask is the prior, grown into the white shot's
non-white pixels and clipped a few px outside the prior, so the cast shadow
beyond the hem is not swallowed.

The backdrop is a vertical gradient sampled from the site's own product shots
(194 at the top, 208 at mid height, 223 at the bottom, with their grain). It is
drawn over the whole 2:3 canvas, so the extension above and below the shot is
seamless by construction. --crop-x A:B trims a landscape shot's empty sides
first (columns A to B kept) so the garment does not shrink in the frame.

Usage:
  python scripts/studio-backdrop-product-shot.py IN OUT.webp [--mask-from DARK.webp] [--erode 3]
         [--crop-x A:B] [--quality 92] [--debug-mask MASK.png]
"""
import argparse
import sys
import numpy as np
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('src')
ap.add_argument('dst')
ap.add_argument('--mask-from', help='dark or coloured shot of the same render, whose garment mask is the prior for a white garment')
ap.add_argument('--crop-x', help='keep columns A:B of the source before framing')
ap.add_argument('--quality', type=int, default=92)
ap.add_argument('--debug-mask', help='write the garment mask here as a PNG')
ap.add_argument('--erode', type=int, default=1,
                help='px the garment mask is pulled in before compositing (default 1). Raise to 3 when a '
                     'light garment shows a white rim: its near-white anti-aliased edge then takes the '
                     'shadow treatment instead of being copied')
args = ap.parse_args()

try:
    from scipy import ndimage
except ImportError:
    sys.exit('needs scipy (pip install scipy)')

WHITE = 254.0
PROFILE = [(0.0, 194.0), (0.5, 208.0), (0.9, 221.0), (1.0, 223.0)]  # (fraction of height, grey)
GRAIN = 1.0
rng = np.random.default_rng(0)


def load(path):
    return np.asarray(Image.open(path).convert('RGB')).astype(np.float64)


def colour_mask(a):
    """Garment = saturated or dark pixels, holes filled, largest blob."""
    lum = a.mean(-1)
    sat = a.max(-1) - a.min(-1)
    m = (sat > 40) | (lum < 140)
    m = ndimage.binary_fill_holes(m)
    m = ndimage.binary_opening(m, iterations=2)
    lab, n = ndimage.label(m)
    if n == 0:
        sys.exit('no garment found')
    sizes = ndimage.sum(m, lab, range(1, n + 1))
    m = lab == (1 + int(np.argmax(sizes)))
    return ndimage.binary_fill_holes(m)


def white_garment_mask(a, prior):
    """Grow the prior's core into the shot's non-white pixels, clipped to a
    few px outside the prior, so a white garment keeps its own outline."""
    lum = a.mean(-1)
    seed = ndimage.binary_erosion(prior, iterations=12)
    candidates = lum < 250
    lab, n = ndimage.label(candidates)
    keep = np.unique(lab[seed & candidates])
    grown = np.isin(lab, keep[keep > 0])
    clip = ndimage.binary_dilation(prior, iterations=4)
    m = grown & clip
    m = ndimage.binary_closing(m, iterations=2)
    m = ndimage.binary_fill_holes(m)
    m = ndimage.binary_opening(m, iterations=2)
    lab, n = ndimage.label(m)
    sizes = ndimage.sum(m, lab, range(1, n + 1))
    m = lab == (1 + int(np.argmax(sizes)))
    return ndimage.binary_fill_holes(m)


def backdrop(h, w):
    ys = np.linspace(0, 1, h)
    xs = [p[0] for p in PROFILE]
    vs = [p[1] for p in PROFILE]
    col = np.interp(ys, xs, vs)
    b = np.repeat(col[:, None], w, 1)
    b = b + rng.normal(0, GRAIN, b.shape)
    return np.repeat(b[:, :, None], 3, 2)


a = load(args.src)
if args.crop_x:
    x0, x1 = (int(v) for v in args.crop_x.split(':'))
    a = a[:, x0:x1]
h, w, _ = a.shape

if args.mask_from:
    prior = colour_mask(load(args.mask_from))
    if args.crop_x:
        prior = prior[:, x0:x1]
    if prior.shape != (h, w):
        sys.exit('--mask-from must have the same size as the source')
    mask = white_garment_mask(a, prior)
else:
    mask = colour_mask(a)

if args.debug_mask:
    Image.fromarray((mask * 255).astype(np.uint8)).save(args.debug_mask)

# Feathered alpha: erode (1 px by default) so the anti-aliased edge takes the
# shadow treatment (a dark hairline at worst), never a light halo.
alpha = ndimage.binary_erosion(mask, iterations=args.erode).astype(np.float64)
alpha = ndimage.gaussian_filter(alpha, 1.0)

# 2:3 canvas with the shot centred vertically (wider) or horizontally (narrower).
if w / h > 2 / 3:
    H = int(round(w * 1.5)); W = w
else:
    W = int(round(h * 2 / 3)); H = h
top = (H - h) // 2
left = (W - w) // 2
B = backdrop(H, W)
Bs = B[top:top + h, left:left + w]

strength = np.clip(a / WHITE, 0, 1)
shadowed = Bs * strength
composite = alpha[..., None] * a + (1 - alpha[..., None]) * shadowed

out = B.copy()
out[top:top + h, left:left + w] = composite
img = Image.fromarray(out.round().clip(0, 255).astype(np.uint8))
img.save(args.dst, 'WEBP', quality=args.quality, method=6)
ys, xs = np.where(mask)
print(f'{args.src.split("/")[-1]}: {w}x{h} -> {W}x{H}, garment x {xs.min()}-{xs.max()} y {ys.min()}-{ys.max()} ({100 * mask.mean():.1f}% of the shot)')
