# -*- coding: utf-8 -*-
"""Put the corrected GA-01 v3 artwork onto the existing Modern Sport
Performance Tee concept renders, in place of the old print.

The four site images are AI concept renders (see LATEST-ASSETS.json in
designs/19_colorway-and-back-print-review). Their framing, garment and
background are kept. Only the printed mark changes:

  1. detect the old print (white + red pixels on the dark garment),
  2. paint it out with the surrounding fabric (inpainting),
  3. place the v3 artwork at the same scale and position as the old print
     (matched on the GOOOL wordmark's width and top-left), with a mild
     fabric-shading pass so it sits in the render rather than on it.

Outputs: public/products/GOOOL_MODERN_PERFORMANCE_*_V3.png
"""
import os, json, hashlib
import numpy as np
import cv2
from PIL import Image
from scipy import ndimage

ART = 'designs/26_modern-sport-print-rebuild-2026-09-25/exports'
FRONT_ART = f'{ART}/GA-01-F_v3_3300px.png'
BACK_ART = f'{ART}/GA-01-B_v3_1950px_600ppi.png'
SRC = 'designs/_archive/modern-sport-performance-imagery-v2-2026-09-21'  # the V2 renders, archived 2026-09-25
JOBS = [
    (f'{SRC}/GOOOL_MODERN_PERFORMANCE_FRONT_V2.png', 'public/products/GOOOL_MODERN_PERFORMANCE_FRONT_V3.png', FRONT_ART),
    (f'{SRC}/GOOOL_MODERN_PERFORMANCE_BACK_DETAIL_V2.png', 'public/products/GOOOL_MODERN_PERFORMANCE_BACK_DETAIL_V3.png', BACK_ART),
    (f'{SRC}/GOOOL_MODERN_PERFORMANCE_ROYAL_FRONT.png', 'public/products/GOOOL_MODERN_PERFORMANCE_ROYAL_FRONT_V3.png', FRONT_ART),
    (f'{SRC}/GOOOL_MODERN_PERFORMANCE_ROYAL_BACK_DETAIL.png', 'public/products/GOOOL_MODERN_PERFORMANCE_ROYAL_BACK_DETAIL_V3.png', BACK_ART),
]


def print_mask(img):
    """White or red print pixels on the garment. The studio background is
    near-white too, so restrict to pixels whose surroundings are dark."""
    rgb = img.astype(np.int32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    white = (r > 150) & (g > 150) & (b > 150)
    red = (r > 120) & (g < 90) & (b < 90) & (r - g > 60)
    cand = white | red
    # garment = dark area; take a big blurred darkness map and keep candidates inside it
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    # garment interior: dark pixels, eroded well away from the silhouette so
    # the light studio background and the collar edge never count as print
    dark = ndimage.binary_erosion(gray < 110, iterations=18)
    dark = ndimage.binary_fill_holes(dark)
    m = cand & dark
    m = ndimage.binary_opening(m, iterations=1)
    lab, n = ndimage.label(m)
    if n == 0:
        raise SystemExit('no print found')
    sizes = ndimage.sum(m, lab, range(1, n + 1))
    keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 30])
    return keep


def wordmark_box(mask):
    """Bounding box of the GOOOL wordmark within the print mask: the widest
    band of rows in the upper part of the print."""
    ys, xs = np.where(mask)
    y0, y1 = ys.min(), ys.max()
    rows = mask.any(axis=1)
    # the wordmark is the first block of rows from the top
    blocks = []
    start = None
    for y in range(y0, y1 + 2):
        on = rows[y] if y <= y1 else False
        if on and start is None:
            start = y
        if not on and start is not None:
            blocks.append((start, y)); start = None
    wy0, wy1 = blocks[0]
    sub = mask[wy0:wy1]
    xs = np.where(sub.any(axis=0))[0]
    return wy0, wy1, xs.min(), xs.max() + 1


def art_wordmark_box(alpha):
    rows = alpha.any(axis=1)
    y = 0
    while not rows[y]:
        y += 1
    y0 = y
    while rows[y]:
        y += 1
    sub = alpha[y0:y]
    xs = np.where(sub.any(axis=0))[0]
    return y0, y, xs.min(), xs.max() + 1


def run(src, dst, art_path):
    img = np.asarray(Image.open(src).convert('RGB')).copy()
    m = print_mask(img)
    wy0, wy1, wx0, wx1 = wordmark_box(m)
    art = np.asarray(Image.open(art_path).convert('RGBA'))
    a_alpha = art[..., 3] >= 128
    ay0, ay1, ax0, ax1 = art_wordmark_box(a_alpha)
    scale = (wx1 - wx0) / (ax1 - ax0)
    # paint the old print out
    inpaint_mask = ndimage.binary_dilation(m, iterations=4).astype(np.uint8) * 255
    bg = cv2.inpaint(img, inpaint_mask, 7, cv2.INPAINT_TELEA)
    # scaled artwork
    new_w = int(round(art.shape[1] * scale)); new_h = int(round(art.shape[0] * scale))
    art_s = np.asarray(Image.fromarray(art).resize((new_w, new_h), Image.LANCZOS)).astype(np.float32)
    px = int(round(wx0 - ax0 * scale)); py = int(round(wy0 - ay0 * scale))
    # shading: fabric brightness relative to its local median under the old print
    gray = cv2.cvtColor(bg, cv2.COLOR_RGB2GRAY).astype(np.float32)
    ref = np.median(gray[wy0:wy1 + 40, wx0:wx1]) if m.any() else gray.mean()
    shade = np.clip(cv2.GaussianBlur(gray, (0, 0), 3) / max(ref, 1.0), 0.80, 1.06)
    out = bg.astype(np.float32)
    H, W = out.shape[:2]
    x0, y0 = max(px, 0), max(py, 0); x1, y1 = min(px + new_w, W), min(py + new_h, H)
    sub = art_s[y0 - py:y1 - py, x0 - px:x1 - px]
    al = sub[..., 3:4] / 255.0
    col = sub[..., :3] * shade[y0:y1, x0:x1, None]
    out[y0:y1, x0:x1] = out[y0:y1, x0:x1] * (1 - al) + col * al
    out = np.clip(out, 0, 255).astype(np.uint8)
    Image.fromarray(out).save(dst, 'PNG', optimize=True)
    return dict(src=src, dst=dst, art=art_path, old_wordmark_box_px=[int(wx0), int(wy0), int(wx1), int(wy1)], scale=round(float(scale), 5),
                placed_at=[px, py], size=[new_w, new_h], sha256=hashlib.sha256(open(dst, 'rb').read()).hexdigest())


if __name__ == '__main__':
    log = [run(*j) for j in JOBS]
    json.dump(log, open('designs/26_modern-sport-print-rebuild-2026-09-25/SITE-IMAGERY-V3.json', 'w'), indent=1)
    for l in log:
        print(l['dst'], 'wordmark box', l['old_wordmark_box_px'], 'scale', l['scale'])
