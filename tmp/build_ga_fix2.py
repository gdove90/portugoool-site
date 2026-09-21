"""Rebuild GA-03 (correct measured ratios) and GA-02 (better crops,
healed red outline, back = arch + ATHLETICS)."""
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

REPO = r"C:\Users\gdove\OneDrive\Desktop\GOOOL"
TMP = REPO + r"\tmp"
OUT = REPO + r"\designs\16_goool_athletics\print_masters"
Image.MAX_IMAGE_PIXELS = None

RED = (0xC5, 0x2D, 0x32, 255)
IVORY = (0xE8, 0xDF, 0xCA, 255)
DKRED = (0x8E, 0x34, 0x38, 255)
BLACK = (0x17, 0x17, 0x17, 255)
GOTHIC_B = r"C:\Windows\Fonts\gothicb.ttf"

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
    print(f"{name}: {img.width}x{img.height}px  visible {img.width/300:.2f}x{img.height/300:.2f} in")

# ═══ GA-03 rebuilt with correct ratios ═══════════════════════
R3 = dict(ath_w=0.9682, ath_h=0.0607, ath_gap=0.0520, rule_w=0.9682, rule_h=0.0145, rule_gap=0.0578)

def ga03_lockup(width, with_rule):
    g = spaced_text("GOOOL", GOTHIC_B, 500, BLACK, 0.02)
    g = fit_width(g, width)
    ath = spaced_text("ATHLETICS", GOTHIC_B, max(8, round(R3["ath_h"] * width)) * 4, BLACK, 0.9)
    ath = fit_width(ath, round(R3["ath_w"] * width))
    gap = round(R3["ath_gap"] * width)
    extra = (round(R3["rule_gap"] * width) + max(4, round(R3["rule_h"] * width))) if with_rule else 0
    c = Image.new("RGBA", (width, g.height + gap + ath.height + extra), (0, 0, 0, 0))
    c.alpha_composite(g, (0, 0))
    c.alpha_composite(ath, ((width - ath.width) // 2, g.height + gap))
    if with_rule:
        dd = ImageDraw.Draw(c)
        rw = round(R3["rule_w"] * width); rh = max(4, round(R3["rule_h"] * width))
        ry = g.height + gap + ath.height + round(R3["rule_gap"] * width)
        dd.rectangle([(width - rw) // 2, ry, (width - rw) // 2 + rw - 1, ry + rh - 1], fill=RED)
    return c

save_master(ga03_lockup(3600, True), "GA-03-B_3600px", 3600)
save_master(ga03_lockup(1050, False), "GA-03-F_1050px", 1050)

# ═══ GA-02 traces, round 2 ═══════════════════════════════════
def trace_layer(mask_small, scale, sigma=3.5):
    m = mask_small.astype(np.float32)
    big = cv2.resize(m, (round(m.shape[1] * scale), round(m.shape[0] * scale)), interpolation=cv2.INTER_CUBIC)
    big = cv2.GaussianBlur(big, (0, 0), sigma)
    big = (big > 0.5).astype(np.float32)
    big = cv2.GaussianBlur(big, (0, 0), sigma * 0.7)
    big = (big > 0.5).astype(np.float32)
    big = cv2.GaussianBlur(big, (0, 0), 1.2)
    return np.clip(big, 0, 1)

def classify(arr):
    r, g, b = arr[..., 0].astype(int), arr[..., 1].astype(int), arr[..., 2].astype(int)
    ivory = (r > 150) & (g > 135) & (b > 105) & (r >= b)
    red = (r > 60) & (r < 200) & (r > g + 20) & (r > b + 25) & (~ivory)
    return ivory, red

def clean(mask, min_px):
    lab, n = ndimage.label(mask)
    keep = np.zeros_like(mask)
    for i in range(1, n + 1):
        c = lab == i
        if c.sum() >= min_px: keep |= c
    return keep

def drop_border(mask):
    lab, n = ndimage.label(mask)
    ids = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]])))
    ids.discard(0)
    return mask & ~np.isin(lab, list(ids))

def build_ga02(src_path, crop, target_w, name, keep_red):
    im = np.array(Image.open(src_path).convert("RGB").crop(crop)).astype(int)
    ivory, red = classify(im)
    ivory = clean(drop_border(ivory), 10)
    red = clean(red, 6)
    # heal the thin red contour so tracing keeps it continuous
    red_h = cv2.morphologyEx(red.astype(np.uint8), cv2.MORPH_CLOSE,
                             cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))).astype(bool)
    both = ivory | (red_h if keep_red else False)
    ysb, xsb = np.where(both if keep_red else ivory)
    x0, x1, y0, y1 = xsb.min(), xsb.max(), ysb.min(), ysb.max()
    pad = 3
    sl = np.s_[max(0, y0 - pad):y1 + pad, max(0, x0 - pad):x1 + pad]
    scale = target_w / (x1 - x0 + 1)
    iv_big = trace_layer(ivory[sl], scale)
    out = np.zeros((*iv_big.shape, 4), np.float32)
    if keep_red:
        rd_big = trace_layer(red_h[sl], scale, sigma=3.0)
        out[..., 0] = DKRED[0] * rd_big; out[..., 1] = DKRED[1] * rd_big
        out[..., 2] = DKRED[2] * rd_big; out[..., 3] = rd_big * 255
    ivm = iv_big[..., None]
    out[..., :3] = out[..., :3] * (1 - ivm) + np.array(IVORY[:3], np.float32) * ivm
    out[..., 3] = np.maximum(out[..., 3], iv_big * 255)
    img = Image.fromarray(out.clip(0, 255).astype(np.uint8))
    aa = np.array(img)
    xs3 = np.where((aa[..., 3] > 10).any(axis=0))[0]
    ys3 = np.where((aa[..., 3] > 10).any(axis=1))[0]
    img = img.crop((xs3.min(), ys3.min(), xs3.max() + 1, ys3.max() + 1))
    img = fit_width(img, target_w)
    save_master(img, name, target_w)

# front: wider crop so the G is never clipped
build_ga02(TMP + r"\ga02_front_full.png", (110, 210, 700, 580), 3300, "GA-02-F_3300px", True)
# back: arch + ATHLETICS (ivory only)
build_ga02(TMP + r"\ga02_back_full.png", (290, 180, 470, 290), 975, "GA-02-B_975px", False)
print("done")
