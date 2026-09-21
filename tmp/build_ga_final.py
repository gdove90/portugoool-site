"""Final GA masters: GA-01-F rebuilt with corrected measured ratios,
GA-02 front/back traced from the flat mockup art. Ratios are baked
constants (measured from the mockups with component filtering)."""
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage
import os

REPO = r"C:\Users\gdove\OneDrive\Desktop\GOOOL"
TMP = REPO + r"\tmp"
OUT = REPO + r"\designs\16_goool_athletics\print_masters"
Image.MAX_IMAGE_PIXELS = None

WHITE = (255, 255, 255, 255)
RED = (0xC5, 0x2D, 0x32, 255)
IVORY = (0xE8, 0xDF, 0xCA, 255)
DKRED = (0x8E, 0x34, 0x38, 255)

# ── wordmark letters (same extraction as before) ─────────────
wm = Image.open(REPO + r"\designs\GOOOL_POD_SAMPLE_PACKET\02_Hoodie_Artwork\GOOOL_SAMPLE_02_IND4000_WORDMARK_FRONT_6.75IN.png").convert("RGBA")
a = np.array(wm)
occ = (a[..., 3] > 8).sum(axis=1)
ys = np.where(occ > 0)[0]
gaps, run, start = [], 0, None
for y in range(ys.min(), ys.max() + 1):
    if occ[y] == 0:
        if start is None: start = y
        run += 1
    else:
        if start is not None: gaps.append((run, start, y - 1))
        run, start = 0, None
gaps.sort(reverse=True)
letters = wm.crop((0, ys.min(), wm.width, gaps[0][1]))
la = np.array(letters)
xs = np.where((la[..., 3] > 8).any(axis=0))[0]
letters = letters.crop((xs.min(), 0, xs.max() + 1, letters.height))

def recolor(img, rgba):
    arr = np.array(img).copy()
    m = arr[..., 3] > 0
    arr[..., 0][m], arr[..., 1][m], arr[..., 2][m] = rgba[0], rgba[1], rgba[2]
    return Image.fromarray(arr)

def spaced_text(text, font_path, px_height, color, tracking_ratio):
    px_height = int(min(px_height, 1600))
    size = px_height
    for _ in range(8):
        font = ImageFont.truetype(font_path, size)
        bx = font.getbbox("A"); h = bx[3] - bx[1]
        size = max(4, int(round(size * px_height / max(h, 1))))
    font = ImageFont.truetype(font_path, size)
    track = int(round(tracking_ratio * px_height))
    ws, bs = [], []
    for ch in text:
        b2 = font.getbbox(ch); bs.append(b2); ws.append(b2[2] - b2[0])
    total = sum(ws) + track * (len(text) - 1)
    img = Image.new("RGBA", (total + 8, px_height + 8), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    x = 4
    for ch, b2, w2 in zip(text, bs, ws):
        d.text((x - b2[0], 4 - b2[1]), ch, font=font, fill=color)
        x += w2 + track
    arr = np.array(img)
    ys2 = np.where((arr[..., 3] > 0).any(axis=1))[0]
    xs2 = np.where((arr[..., 3] > 0).any(axis=0))[0]
    return img.crop((xs2.min(), ys2.min(), xs2.max() + 1, ys2.max() + 1))

def fit_width(img, w):
    return img.resize((w, max(1, round(img.height * w / img.width))), Image.LANCZOS)

def save_master(img, name, target_w):
    assert img.width == target_w, (name, img.width)
    img.save(f"{OUT}\\{name}.png")
    a2 = np.array(img)
    ysm = np.where((a2[..., 3] > 0).any(axis=1))[0]
    print(f"{name}: {img.width}x{img.height}px  visible {img.width/300:.2f}x{(ysm.max()-ysm.min()+1)/300:.2f} in")

# ═══ GA-01-F rebuilt with corrected ratios ═══════════════════
R = dict(rule_w=1.0, rule_h=0.0412, rule_gap=0.0235, ath_w=0.7324, ath_h=0.0529, ath_gap=0.0294)
W = 3300
g_img = recolor(fit_width(letters, W), WHITE)
rule_h = round(R["rule_h"] * W)
ath = spaced_text("ATHLETICS", r"C:\Windows\Fonts\bahnschrift.ttf", round(R["ath_h"] * W) * 4, WHITE, 1.05)
ath = fit_width(ath, round(R["ath_w"] * W))
gap1 = round(R["rule_gap"] * W); gap2 = round(R["ath_gap"] * W)
canvas = Image.new("RGBA", (W, g_img.height + gap1 + rule_h + gap2 + ath.height), (0, 0, 0, 0))
canvas.alpha_composite(g_img, (0, 0))
ImageDraw.Draw(canvas).rectangle([0, g_img.height + gap1, W - 1, g_img.height + gap1 + rule_h - 1], fill=RED)
canvas.alpha_composite(ath, ((W - ath.width) // 2, g_img.height + gap1 + rule_h + gap2))
save_master(canvas, "GA-01-F_3300px", 3300)

# ═══ GA-02: trace ivory + dark-red layers ════════════════════
def trace_layer(mask_small, scale, smooth_sigma=3.0):
    """Reconstruct a crisp large mask from a small one: cubic upscale of
    the soft mask, gaussian smooth, re-threshold (twice) — tracing, not
    photo upscaling."""
    m = mask_small.astype(np.float32)
    big = cv2.resize(m, (round(m.shape[1] * scale), round(m.shape[0] * scale)), interpolation=cv2.INTER_CUBIC)
    big = cv2.GaussianBlur(big, (0, 0), smooth_sigma)
    big = (big > 0.5).astype(np.float32)
    big = cv2.GaussianBlur(big, (0, 0), smooth_sigma * 0.7)
    big = (big > 0.5).astype(np.float32)
    # final light AA ramp
    big = cv2.GaussianBlur(big, (0, 0), 1.0)
    return np.clip(big, 0, 1)

def classify_ga02(arr):
    r, g, b = arr[..., 0].astype(int), arr[..., 1].astype(int), arr[..., 2].astype(int)
    # ivory: light, warm
    ivory = (r > 150) & (g > 135) & (b > 105) & (r >= b)
    # dark red outline: distinctly red, mid-dark
    red = (r > 70) & (r < 190) & (r > g + 25) & (r > b + 30) & (~ivory)
    return ivory, red

def build_ga02(src_path, crop, target_w, name, keep_red=True):
    im = np.array(Image.open(src_path).convert("RGB").crop(crop)).astype(int)
    ivory, red = classify_ga02(im)
    # keep only substantial components (kill fabric speckle)
    def clean(mask, min_px):
        lab, n = ndimage.label(mask)
        keep = np.zeros_like(mask)
        for i in range(1, n + 1):
            c = lab == i
            if c.sum() >= min_px: keep |= c
        return keep
    # background is light AND touches the crop border; print ivory
    # components are islands inside the dark garment
    lab, n = ndimage.label(ivory)
    border_ids = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
    border_ids.discard(0)
    ivory = ivory & ~np.isin(lab, list(border_ids))
    ivory = clean(ivory, 12)
    red = clean(red, 12)
    both = ivory | red
    ysb, xsb = np.where(both)
    x0, x1, y0, y1 = xsb.min(), xsb.max(), ysb.min(), ysb.max()
    pad = 4
    ivory_c = ivory[max(0,y0-pad):y1+pad, max(0,x0-pad):x1+pad]
    red_c = red[max(0,y0-pad):y1+pad, max(0,x0-pad):x1+pad]
    scale = target_w / (x1 - x0 + 1)
    iv_big = trace_layer(ivory_c, scale)
    canvas_h, canvas_w = iv_big.shape
    out = np.zeros((canvas_h, canvas_w, 4), np.float32)
    if keep_red:
        rd_big = trace_layer(red_c, scale)
        # red renders first, ivory on top (outline sits behind fill edges)
        out[..., 0] += DKRED[0] * rd_big; out[..., 1] += DKRED[1] * rd_big
        out[..., 2] += DKRED[2] * rd_big; out[..., 3] = np.maximum(out[..., 3], rd_big * 255)
    ivm = iv_big[..., None]
    out[..., :3] = out[..., :3] * (1 - ivm) + np.array(IVORY[:3], np.float32) * ivm
    out[..., 3] = np.maximum(out[..., 3], iv_big * 255)
    img = Image.fromarray(out.clip(0, 255).astype(np.uint8))
    # trim to exact visible width
    aa = np.array(img)
    xs3 = np.where((aa[..., 3] > 10).any(axis=0))[0]
    ys3 = np.where((aa[..., 3] > 10).any(axis=1))[0]
    img = img.crop((xs3.min(), ys3.min(), xs3.max() + 1, ys3.max() + 1))
    img = fit_width(img, target_w)
    save_master(img, name, target_w)
    return img

build_ga02(TMP + r"\ga02_front_full.png", (140, 220, 660, 560), 3300, "GA-02-F_3300px", keep_red=True)
build_ga02(TMP + r"\ga02_back_full.png", (270, 130, 500, 300), 975, "GA-02-B_975px", keep_red=False)
print("done")
