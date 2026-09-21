"""Reconstruct the six GOOOL ATHLETICS print masters.

Method (packet 07: reconstruct, never upscale the mockup):
- GA-01: brand wordmark letterforms reused from the approved master
  (GOOOL_SAMPLE_02, letters only), solid red rule, ATHLETICS set in
  Bahnschrift with wide tracking. All proportions MEASURED from the
  mockup print, then composed clean at 300 PPI.
- GA-03: Century Gothic Bold lockup (matches the mockup's geometric
  round-O letterforms), proportions measured from the mockup.
- GA-02: two-layer trace (ivory fill + dark red contour) of the flat
  mockup art, upscaled as masks with smoothing — a reconstruction of
  the shapes, not a photo upscale. Dark gaps = garment knockout.
Palette (packet 08): white #FFFFFF, core red #C52D32, warm ivory
#E8DFCA, varsity dark red #8E3438, black #171717.
"""
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

REPO = r"C:\Users\gdove\OneDrive\Desktop\GOOOL"
TMP = REPO + r"\tmp"
OUT = REPO + r"\designs\16_goool_athletics\print_masters"
import os
os.makedirs(OUT, exist_ok=True)
Image.MAX_IMAGE_PIXELS = None

WHITE = (255, 255, 255, 255)
RED = (0xC5, 0x2D, 0x32, 255)
IVORY = (0xE8, 0xDF, 0xCA, 255)
DKRED = (0x8E, 0x34, 0x38, 255)
BLACK = (0x17, 0x17, 0x17, 255)

# ── shared: brand wordmark letters (no underline) ────────────
wm = Image.open(REPO + r"\designs\GOOOL_POD_SAMPLE_PACKET\02_Hoodie_Artwork\GOOOL_SAMPLE_02_IND4000_WORDMARK_FRONT_6.75IN.png").convert("RGBA")
a = np.array(wm)
rows = (a[..., 3] > 8).any(axis=1)
# find the gap between letters and underline: scan row occupancy
occ = (a[..., 3] > 8).sum(axis=1)
ys = np.where(rows)[0]
# gap = longest run of empty rows inside the occupied span
gaps, run, start = [], 0, None
for y in range(ys.min(), ys.max() + 1):
    if occ[y] == 0:
        if start is None: start = y
        run += 1
    else:
        if start is not None: gaps.append((run, start, y - 1))
        run, start = 0, None
gaps.sort(reverse=True)
letters_bottom = gaps[0][1] - 1  # last letter row before the big gap
letters = wm.crop((0, ys.min(), wm.width, letters_bottom + 1))
la = np.array(letters)
xs = np.where((la[..., 3] > 8).any(axis=0))[0]
letters = letters.crop((xs.min(), 0, xs.max() + 1, letters.height))
print("wordmark letters:", letters.size)

def recolor(img, rgba):
    arr = np.array(img).copy()
    m = arr[..., 3] > 0
    arr[..., 0][m], arr[..., 1][m], arr[..., 2][m] = rgba[0], rgba[1], rgba[2]
    return Image.fromarray(arr)

def spaced_text(text, font_path, px_height, color, tracking_ratio):
    px_height = int(min(px_height, 1600))
    """Render text with tracking = tracking_ratio * glyph height."""
    # binary-search font size to hit px_height for cap 'A'
    size = px_height
    for _ in range(8):
        font = ImageFont.truetype(font_path, size)
        bbox = font.getbbox("A")
        h = bbox[3] - bbox[1]
        size = max(4, int(round(size * px_height / max(h, 1))))
    font = ImageFont.truetype(font_path, size)
    track = int(round(tracking_ratio * px_height))
    widths, boxes = [], []
    for ch in text:
        b = font.getbbox(ch)
        boxes.append(b)
        widths.append(b[2] - b[0])
    total = sum(widths) + track * (len(text) - 1)
    img = Image.new("RGBA", (total + 8, px_height + 8), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    x = 4
    for ch, b, w in zip(text, boxes, widths):
        d.text((x - b[0], 4 - b[1]), ch, font=font, fill=color)
        x += w + track
    arr = np.array(img)
    ysx = np.where((arr[..., 3] > 0).any(axis=1))[0]
    xsx = np.where((arr[..., 3] > 0).any(axis=0))[0]
    return img.crop((xsx.min(), ysx.min(), xsx.max() + 1, ysx.max() + 1))

def measure(mock_path, crop, classify):
    """Measure component boxes from a mockup crop. classify(arr)->mask dict."""
    im = Image.open(mock_path).convert("RGB").crop(crop)
    arr = np.array(im).astype(int)
    out = {}
    for name, mask in classify(arr).items():
        ysm, xsm = np.where(mask)
        out[name] = (xsm.min(), ysm.min(), xsm.max(), ysm.max()) if len(xsm) else None
    return out, arr.shape

def fit_width(img, w):
    return img.resize((w, max(1, round(img.height * w / img.width))), Image.LANCZOS)

def save_master(img, name, target_w):
    assert img.width == target_w, (name, img.width)
    img.save(f"{OUT}\\{name}.png")
    a2 = np.array(img)
    ysm = np.where((a2[..., 3] > 0).any(axis=1))[0]
    print(f"{name}: {img.width}x{img.height}px  visible {img.width/300:.2f}x{(ysm.max()-ysm.min()+1)/300:.2f} in")

# ═══ GA-01 FRONT ═════════════════════════════════════════════
def cls01(arr):
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    white = (r > 205) & (g > 205) & (b > 205)
    red = (r > 110) & (r > g + 60) & (r > b + 60)
    return {"white": white, "red": red}

m01, shp = measure(TMP + r"\ga01_front_full.png", (150, 250, 640, 560), cls01)
# rows: GOOOL (top white), red rule, ATHLETICS (bottom white)
wx0, wy0, wx1, wy1 = m01["white"]
rx0, ry0, rx1, ry1 = m01["red"]
# split white into GOOOL vs ATHLETICS at the rule's y
im01 = np.array(Image.open(TMP + r"\ga01_front_full.png").convert("RGB").crop((150, 250, 640, 560))).astype(int)
wm_mask = cls01(im01)["white"]
top = wm_mask[: ry0, :]; bot = wm_mask[ry1 + 1:, :]
tys, txs = np.where(top); bys, bxs = np.where(bot)
G = (txs.min(), tys.min(), txs.max(), tys.max())
A = (bxs.min(), bys.min() + ry1 + 1, bxs.max(), bys.max() + ry1 + 1)
Gw = G[2] - G[0] + 1
ratios01 = dict(
    rule_w=(rx1 - rx0 + 1) / Gw, rule_h=(ry1 - ry0 + 1) / Gw,
    rule_gap=(ry0 - G[3]) / Gw,          # gap letters→rule
    ath_w=(A[2] - A[0] + 1) / Gw, ath_h=(A[3] - A[1] + 1) / Gw,
    ath_gap=(A[1] - ry1) / Gw,
)
print("GA-01-F ratios:", {k: round(v, 4) for k, v in ratios01.items()})

W = 3300
g_img = recolor(fit_width(letters, W), WHITE)
rule_w = round(ratios01["rule_w"] * W); rule_h = max(8, round(ratios01["rule_h"] * W))
ath_h = max(8, round(ratios01["ath_h"] * W))
ath = spaced_text("ATHLETICS", r"C:\Windows\Fonts\bahnschrift.ttf", ath_h * 4, WHITE, 1.05)
ath = fit_width(ath, round(ratios01["ath_w"] * W))
gap1 = round(ratios01["rule_gap"] * W); gap2 = round(ratios01["ath_gap"] * W)
H = g_img.height + gap1 + rule_h + gap2 + ath.height
canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
canvas.alpha_composite(g_img, (0, 0))
d = ImageDraw.Draw(canvas)
rx = (W - rule_w) // 2
d.rectangle([rx, g_img.height + gap1, rx + rule_w - 1, g_img.height + gap1 + rule_h - 1], fill=RED)
canvas.alpha_composite(ath, ((W - ath.width) // 2, g_img.height + gap1 + rule_h + gap2))
save_master(canvas, "GA-01-F_3300px", 3300)

# ═══ GA-01 BACK (white only, GOOOL + ATHLETICS) ═════════════
m01b, _ = measure(TMP + r"\ga01_back_full.png", (250, 160, 500, 300), cls01)
im01b = np.array(Image.open(TMP + r"\ga01_back_full.png").convert("RGB").crop((250, 160, 500, 300))).astype(int)
wmb = cls01(im01b)["white"]
# split by largest horizontal gap
occb = wmb.sum(axis=1); ysb = np.where(occb > 0)[0]
gapsb, run, start = [], 0, None
for y in range(ysb.min(), ysb.max() + 1):
    if occb[y] == 0:
        if start is None: start = y
        run += 1
    else:
        if start is not None: gapsb.append((run, start, y - 1)); run, start = 0, None
gapsb.sort(reverse=True)
splity = gapsb[0][1]
topm = wmb[:splity]; botm = wmb[splity:]
tys, txs = np.where(topm); bys, bxs = np.where(botm)
Gb = (txs.min(), tys.min(), txs.max(), tys.max())
Ab = (bxs.min(), bys.min() + splity, bxs.max(), bys.max() + splity)
Gbw = Gb[2] - Gb[0] + 1
r01b = dict(ath_w=(Ab[2]-Ab[0]+1)/Gbw, ath_h=(Ab[3]-Ab[1]+1)/Gbw, gap=(Ab[1]-Gb[3])/Gbw)
print("GA-01-B ratios:", {k: round(v, 4) for k, v in r01b.items()})
Wb = 975
gb = recolor(fit_width(letters, Wb), WHITE)
athb = spaced_text("ATHLETICS", r"C:\Windows\Fonts\bahnschrift.ttf", max(8, round(r01b["ath_h"]*Wb))*4, WHITE, 1.05)
athb = fit_width(athb, round(r01b["ath_w"]*Wb))
gapb = round(r01b["gap"]*Wb)
cb = Image.new("RGBA", (Wb, gb.height+gapb+athb.height), (0,0,0,0))
cb.alpha_composite(gb, (0,0)); cb.alpha_composite(athb, ((Wb-athb.width)//2, gb.height+gapb))
save_master(cb, "GA-01-B_975px", 975)

# ═══ GA-03 (Century Gothic Bold lockup) ═════════════════════
def cls03(arr):
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    dark = (r < 100) & (g < 100) & (b < 100)
    red = (r > 110) & (r > g + 60) & (r > b + 60)
    return {"dark": dark, "red": red}

# back (large) drives the lockup proportions
im3 = np.array(Image.open(TMP + r"\ga03_back_full.png").convert("RGB").crop((150, 200, 660, 500))).astype(int)
masks3 = cls03(im3)
d3 = masks3["dark"]; red3 = masks3["red"]
rys, rxs = np.where(red3)
rulebox = (rxs.min(), rys.min(), rxs.max(), rys.max())
dtop = d3[: rulebox[1], :]
occ3 = dtop.sum(axis=1); ys3 = np.where(occ3 > 0)[0]
gaps3, run, start = [], 0, None
for y in range(ys3.min(), ys3.max() + 1):
    if occ3[y] == 0:
        if start is None: start = y
        run += 1
    else:
        if start is not None: gaps3.append((run, start, y - 1)); run, start = 0, None
gaps3.sort(reverse=True)
sp3 = gaps3[0][1]
g3m = dtop[:sp3]; a3m = dtop[sp3:]
tys, txs = np.where(g3m); bys, bxs = np.where(a3m)
G3 = (txs.min(), tys.min(), txs.max(), tys.max())
A3 = (bxs.min(), bys.min() + sp3, bxs.max(), bys.max() + sp3)
G3w = G3[2] - G3[0] + 1
r03 = dict(
    g_h=(G3[3]-G3[1]+1)/G3w,
    ath_w=(A3[2]-A3[0]+1)/G3w, ath_h=(A3[3]-A3[1]+1)/G3w, ath_gap=(A3[1]-G3[3])/G3w,
    rule_w=(rulebox[2]-rulebox[0]+1)/G3w, rule_h=max(1,(rulebox[3]-rulebox[1]+1))/G3w,
    rule_gap=(rulebox[1]-A3[3])/G3w,
)
print("GA-03 ratios:", {k: round(v, 4) for k, v in r03.items()})

GOTHIC_B = r"C:\Windows\Fonts\gothicb.ttf"
def ga03_lockup(width, with_rule):
    # GOOOL tight tracking in Century Gothic Bold
    g = spaced_text("GOOOL", GOTHIC_B, 400, BLACK, 0.02)
    g = fit_width(g, width)
    ath = spaced_text("ATHLETICS", GOTHIC_B, max(8, round(r03["ath_h"]*width))*4, BLACK, 0.9)
    ath = fit_width(ath, round(r03["ath_w"]*width))
    gap = round(r03["ath_gap"]*width)
    h = g.height + gap + ath.height
    extra = 0
    if with_rule:
        extra = round(r03["rule_gap"]*width) + max(6, round(r03["rule_h"]*width))
    c = Image.new("RGBA", (width, h + extra), (0,0,0,0))
    c.alpha_composite(g, (0,0))
    c.alpha_composite(ath, ((width-ath.width)//2, g.height+gap))
    if with_rule:
        dd = ImageDraw.Draw(c)
        rw = round(r03["rule_w"]*width); rh = max(6, round(r03["rule_h"]*width))
        ry = g.height + gap + ath.height + round(r03["rule_gap"]*width)
        rx = (width - rw)//2
        dd.rectangle([rx, ry, rx+rw-1, ry+rh-1], fill=RED)
    return c

save_master(ga03_lockup(3600, True), "GA-03-B_3600px", 3600)
save_master(ga03_lockup(1050, False), "GA-03-F_1050px", 1050)
print("GA-01 and GA-03 masters done")
