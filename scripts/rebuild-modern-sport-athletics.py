# -*- coding: utf-8 -*-
"""Rebuild the GA-01 (Modern Sport Performance Tee) print artwork so every
lettering stroke clears Apliiq's 2 mm DTF minimum at final size.

What stays: the GOOOL wordmark and the red underline are taken pixel for
pixel from the original upload master (the front 3300 px file is the
highest-resolution source of the wordmark and is used for both faces; the
back face of the original was the same wordmark at 975 px).

What changes: ATHLETICS. The original glyphs are ~0.7 mm strokes on the
back and ~1.5 mm on the front. Each glyph is taken from the front master,
scaled to a new cap height, and thickened by an even morphological
expansion (a round "stroke" of equal width on every edge, which for a
monoline glyph is the same as re-stroking its centreline heavier). The
letters are then re-spaced so the word keeps its original block width.

Outputs are PNG, RGB + binary alpha (every printed pixel 100% opaque).

Usage: python scripts/rebuild-modern-sport-athletics.py
"""
import json, hashlib, os
import numpy as np
from PIL import Image
from scipy import ndimage
from skimage.morphology import skeletonize, disk

SRC_F = 'designs/16_goool_athletics/print_masters/upload/GA-01-F_3300px_CLEAN.png'
OUT = 'designs/26_modern-sport-print-rebuild-2026-09-25'
os.makedirs(f'{OUT}/exports', exist_ok=True)
os.makedirs(f'{OUT}/proofs', exist_ok=True)

WHITE = (255, 255, 255)


def load(path):
    im = Image.open(path).convert('RGBA')
    a = np.asarray(im)
    return a[:, :, :3].copy(), (a[:, :, 3] >= 128)


def components(mask):
    lab, n = ndimage.label(mask)
    out = []
    for i, sl in enumerate(ndimage.find_objects(lab)):
        out.append(dict(id=i + 1, y0=sl[0].start, y1=sl[0].stop,
                        x0=sl[1].start, x1=sl[1].stop, m=(lab == i + 1)))
    return out


def stroke_stats(mask):
    """Stroke thickness (px) along the skeleton: min / median / max."""
    dt = ndimage.distance_transform_edt(mask)
    sk = skeletonize(mask)
    t = 2 * dt[sk]
    return float(t.min()), float(np.median(t)), float(t.max())


def gap_stats(mask, region):
    """Smallest open (unprinted) gap inside region, px: counters, apertures, letter gaps."""
    bg = (~mask) & region
    dt = ndimage.distance_transform_edt(bg)
    sk = skeletonize(bg)
    lab, n = ndimage.label(bg)
    border = np.zeros_like(bg)
    border[0, :] = border[-1, :] = border[:, 0] = border[:, -1] = True
    outer = np.unique(lab[border & bg])
    inner = sk & ~np.isin(lab, outer)
    g = 2 * dt[inner]
    return float(g.min()) if g.size else float('nan')


# ---------------------------------------------------------------- sources
rgb_f, m_f = load(SRC_F)
Hf, Wf = m_f.shape
comps = sorted(components(m_f), key=lambda c: (c['y0'] > 900, c['x0']))
goool_f = [c for c in comps if c['y1'] <= 700]
bar = [c for c in comps if 700 < c['y0'] < 900][0]
glyphs = [c for c in comps if c['y0'] >= 900]
assert len(glyphs) == 9, len(glyphs)
letters = list('ATHLETICS')
RED = tuple(int(v) for v in np.median(rgb_f[bar['m']], axis=0))
print('underline colour', RED)

wm = np.zeros_like(m_f)
for c in goool_f:
    wm |= c['m']
WY1 = 640  # bottom of the wordmark in the front master

UP = 4  # working supersample for the glyph edits


def glyph_hi(c):
    g = c['m'][c['y0']:c['y1'], c['x0']:c['x1']].astype(np.uint8) * 255
    im = Image.fromarray(g).resize((g.shape[1] * UP, g.shape[0] * UP), Image.LANCZOS)
    return np.asarray(im) >= 128


CAP0 = 158   # original ATHLETICS cap height in the front master, px
S0 = 22.0    # original stroke, px (measured on the T/L/I stems)


PINHOLE_PX2 = 1


def build_athletics(cap_px, stroke_px, block_w_px):
    scale = cap_px / CAP0
    s_old = S0 * scale
    r_add = (stroke_px - s_old) / 2.0
    assert r_add > 0, (stroke_px, s_old)
    pieces = []
    for c, L in zip(glyphs, letters):
        g = glyph_hi(c)
        th, tw = int(round(g.shape[0] * scale)), int(round(g.shape[1] * scale))
        gi = np.asarray(Image.fromarray(g.astype(np.uint8) * 255).resize((tw, th), Image.LANCZOS)) >= 128
        pad = int(np.ceil(r_add * UP)) + 2
        gi = np.pad(gi, pad)
        gd = ndimage.binary_dilation(gi, structure=disk(int(round(r_add * UP))))
        oh, ow = gd.shape[0] // UP, gd.shape[1] // UP
        go = np.asarray(Image.fromarray(gd.astype(np.uint8) * 255).resize((ow, oh), Image.LANCZOS)) >= 128
        ys, xs = np.where(go)
        go = go[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        # fill pinholes smaller than 0.5 mm^2 left where a crossbar meets a leg
        holes = ndimage.binary_fill_holes(go) & ~go
        hl, hn = ndimage.label(holes)
        for i, sl in enumerate(ndimage.find_objects(hl)):
            hm = hl[sl] == i + 1
            if hm.sum() < PINHOLE_PX2:
                go[sl] |= hm
        pieces.append((L, go))
    widths = [p[1].shape[1] for p in pieces]
    gap = (block_w_px - sum(widths)) / 8.0
    assert gap > 0, gap
    hmax = max(p[1].shape[0] for p in pieces)
    canvas = np.zeros((hmax, int(round(block_w_px)) + 2), bool)
    x = 0.0
    boxes = []
    for L, go in pieces:
        xi = int(round(x))
        h, w = go.shape
        canvas[hmax - h:hmax, xi:xi + w] |= go
        boxes.append(dict(letter=L, x0=xi, x1=xi + w, w=w, h=h))
        x += w + gap
    return canvas, boxes, gap


def compose(wm_scale, ath_cap_px, ath_stroke_px, ath_block_frac, gap_wm_ath_px, with_bar):
    W = int(round(3300 * wm_scale))
    wm_o = np.asarray(Image.fromarray(wm.astype(np.uint8) * 255).resize((W, int(round(Hf * wm_scale))), Image.LANCZOS)) >= 128
    ys = np.where(wm_o.any(axis=1))[0]
    wm_o = wm_o[ys.min():ys.max() + 1]
    ath, boxes, gap = build_athletics(ath_cap_px, ath_stroke_px, W * ath_block_frac)
    ath_gap = int(round(gap_wm_ath_px))
    H = wm_o.shape[0]
    if with_bar:
        bar_h = int(round((bar['y1'] - bar['y0']) * wm_scale))
        bar_gap = int(round((bar['y0'] - WY1) * wm_scale))
        H += bar_gap + bar_h
    H += ath_gap + ath.shape[0]
    rgb = np.zeros((H, W, 3), np.uint8)
    alpha = np.zeros((H, W), bool)
    cy = 0
    alpha[cy:cy + wm_o.shape[0], :] |= wm_o
    rgb[cy:cy + wm_o.shape[0]][wm_o] = WHITE
    cy += wm_o.shape[0]
    if with_bar:
        cy += bar_gap
        alpha[cy:cy + bar_h, :] = True
        rgb[cy:cy + bar_h, :] = RED
        cy += bar_h
    cy += ath_gap
    ax = (W - ath.shape[1]) // 2
    alpha[cy:cy + ath.shape[0], ax:ax + ath.shape[1]] |= ath
    rgb[cy:cy + ath.shape[0], ax:ax + ath.shape[1]][ath] = WHITE
    ath_region = np.zeros_like(alpha)
    ath_region[cy:cy + ath.shape[0], ax:ax + ath.shape[1]] = True
    ath_full = np.zeros_like(alpha)
    ath_full[cy:cy + ath.shape[0], ax:ax + ath.shape[1]] = ath
    return rgb, alpha, dict(ath_y0=cy, ath_x0=ax, boxes=boxes, gap=gap, ath_mask=ath_full, ath_region=ath_region)


def save_png(path, rgb, alpha):
    a = np.dstack([rgb, (alpha * 255).astype(np.uint8)])
    Image.fromarray(a, 'RGBA').save(path, 'PNG', optimize=True)
    return hashlib.sha256(open(path, 'rb').read()).hexdigest()


def report(name, alpha, info, mm_per_px):
    ath = info['ath_mask']
    smin, smed, smax = stroke_stats(ath)
    per = []
    for b in info['boxes']:
        sub = np.zeros_like(ath)
        x0, x1 = b['x0'] + info['ath_x0'], b['x1'] + info['ath_x0']
        sub[:, x0:x1] = ath[:, x0:x1]
        a, bmed, c = stroke_stats(sub)
        per.append(dict(letter=b['letter'], stroke_min_mm=round(a * mm_per_px, 2),
                        stroke_median_mm=round(bmed * mm_per_px, 2),
                        w_mm=round(b['w'] * mm_per_px, 2), h_mm=round(b['h'] * mm_per_px, 2)))
    gmin = gap_stats(ath, info['ath_region'])
    wm_min = stroke_stats(alpha & ~info['ath_region'])[0]
    cols = np.where(ath.any(axis=0))[0]
    return dict(name=name, mm_per_px=mm_per_px,
                athletics_stroke_min_mm=round(smin * mm_per_px, 2),
                athletics_stroke_median_mm=round(smed * mm_per_px, 2),
                athletics_cap_mm=round(max(b['h'] for b in info['boxes']) * mm_per_px, 2),
                athletics_block_w_mm=round((cols.max() - cols.min() + 1) * mm_per_px, 2),
                letter_gap_mm=round(info['gap'] * mm_per_px, 2),
                smallest_open_gap_mm=round(gmin * mm_per_px, 2),
                wordmark_min_feature_mm=round(wm_min * mm_per_px, 2),
                artwork_px=[int(alpha.shape[1]), int(alpha.shape[0])],
                artwork_mm=[round(alpha.shape[1] * mm_per_px, 2), round(alpha.shape[0] * mm_per_px, 2)],
                letters=per)


results = {}
# ------------------------------------------------ FRONT: 3300 px master (9 in -> 366.7 ppi, 11 in -> 300 ppi)
# Targets are set for the SMALLER 9 in option so both candidate widths comply.
mmpp9 = 9 * 25.4 / 3300
mmpp11 = 11 * 25.4 / 3300
front_cap = CAP0                # cap height unchanged: 10.9 mm at 9 in
front_stroke = 2.6 / mmpp9      # 2.6 mm at 9 in (3.2 mm at 11 in)
PINHOLE_PX2 = int(0.5 / (mmpp9 * mmpp9))
rgb, alpha, info = compose(1.0, front_cap, front_stroke, 2415 / 3300, gap_wm_ath_px=960 - 863, with_bar=True)
sha = save_png(f'{OUT}/exports/GA-01-F_v3_3300px.png', rgb, alpha)
results['front_9in'] = report('front at 9 in (366.7 ppi)', alpha, info, mmpp9)
results['front_11in'] = report('front at 11 in (300 ppi)', alpha, info, mmpp11)
results['front_file'] = dict(path=f'{OUT}/exports/GA-01-F_v3_3300px.png',
                             px=[int(alpha.shape[1]), int(alpha.shape[0])], sha256=sha)
np.save(f'{OUT}/proofs/_front_alpha.npy', alpha)

# ------------------------------------------------ BACK: 3.25 in; master at 600 ppi (1950 px) plus a 300 ppi export
PPI_B = 600
Wb = int(round(3.25 * PPI_B))
mmppb = 25.4 / PPI_B
back_cap = 7.0 / mmppb
back_stroke = 2.3 / mmppb
PINHOLE_PX2 = int(0.5 / (mmppb * mmppb))
rgb, alpha, info = compose(Wb / 3300, back_cap, back_stroke, 0.90, gap_wm_ath_px=5.0 / mmppb, with_bar=False)
sha = save_png(f'{OUT}/exports/GA-01-B_v3_1950px_600ppi.png', rgb, alpha)
results['back_3.25in'] = report('back at 3.25 in (600 ppi master)', alpha, info, mmppb)
results['back_file'] = dict(path=f'{OUT}/exports/GA-01-B_v3_1950px_600ppi.png',
                            px=[int(alpha.shape[1]), int(alpha.shape[0])], sha256=sha)
np.save(f'{OUT}/proofs/_back_alpha.npy', alpha)

im = Image.open(f'{OUT}/exports/GA-01-B_v3_1950px_600ppi.png').convert('RGBA')
a = np.asarray(im.resize((975, int(round(im.height / 2))), Image.LANCZOS))
al = a[:, :, 3] >= 128
rgb2 = a[:, :, :3].copy()
rgb2[~al] = 0
rgb2[al] = WHITE
sha = save_png(f'{OUT}/exports/GA-01-B_v3_975px_300ppi.png', rgb2, al)
lower = np.zeros_like(al)
lower[int(al.shape[0] * 0.65):] = al[int(al.shape[0] * 0.65):]
results['back_file_300'] = dict(path=f'{OUT}/exports/GA-01-B_v3_975px_300ppi.png', px=[975, int(al.shape[0])], sha256=sha,
                                athletics_stroke_min_mm=round(stroke_stats(lower)[0] * 25.4 / 300, 2))

json.dump(results, open(f'{OUT}/MEASUREMENTS.json', 'w'), indent=1)
for k in ['front_9in', 'front_11in', 'back_3.25in']:
    r = results[k]
    print(f"\n== {r['name']}: artwork {r['artwork_mm']} mm; ATHLETICS stroke min {r['athletics_stroke_min_mm']} / median {r['athletics_stroke_median_mm']} mm, cap {r['athletics_cap_mm']} mm, block {r['athletics_block_w_mm']} mm, letter gap {r['letter_gap_mm']} mm, smallest open gap {r['smallest_open_gap_mm']} mm, wordmark min feature {r['wordmark_min_feature_mm']} mm")
    print('   ', ' '.join(f"{l['letter']}:{l['stroke_min_mm']}/{l['w_mm']}x{l['h_mm']}" for l in r['letters']))
print('\n300 ppi back export ATHLETICS stroke min:', results['back_file_300']['athletics_stroke_min_mm'], 'mm')
print('files:', results['front_file']['path'], results['back_file']['path'], results['back_file_300']['path'])
