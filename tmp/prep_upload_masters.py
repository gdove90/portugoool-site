"""Prepare upload-ready production masters:
1. GA-01 front/back: faithful edge cleanup (mask smooth + re-threshold
   per channel color, same trace technique as the GA-02 masters).
2. Circular badge (navy, 900px = 3.00 in @300ppi) and circular
   crewneck (forest green, 750px = 2.50 in) from the approved
   1254px wordmark; lettering colors sampled from the owner's
   approved concept mockups.
Outputs to designs/16_goool_athletics/print_masters/upload/.
"""
import numpy as np
import cv2
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
SRC = r"designs\16_goool_athletics\print_masters"
OUT = SRC + r"\upload"
import os
os.makedirs(OUT, exist_ok=True)

def trace(mask, sigma=3.0):
    m = mask.astype(np.float32)
    big = cv2.GaussianBlur(m, (0, 0), sigma)
    big = (big > 0.5).astype(np.float32)
    big = cv2.GaussianBlur(big, (0, 0), sigma * 0.7)
    big = (big > 0.5).astype(np.float32)
    return np.clip(cv2.GaussianBlur(big, (0, 0), 1.0), 0, 1)

def clean_master(name, colors):
    """colors: list of (match_fn, rgba_out) layers, bottom to top."""
    im = np.array(Image.open(fr"{SRC}\{name}.png").convert("RGBA"))
    a = im[..., 3] / 255.0
    r, g, b = im[..., 0].astype(int), im[..., 1].astype(int), im[..., 2].astype(int)
    out = np.zeros(im.shape, np.float32)
    for match, rgba in colors:
        mask = trace((match(r, g, b) & (a > 0.4)).astype(np.float32))
        for c in range(3):
            out[..., c] = out[..., c] * (1 - mask) + rgba[c] * mask
        out[..., 3] = np.maximum(out[..., 3], mask * 255)
    img = Image.fromarray(out.clip(0, 255).astype(np.uint8))
    img.save(fr"{OUT}\{name}_CLEAN.png")
    print(name, "cleaned", img.size)

white = (lambda r, g, b: (r > 180) & (g > 180) & (b > 180))
red = (lambda r, g, b: (r > 120) & (r > g + 50) & (r > b + 50))
clean_master("GA-01-F_3300px", [(red, (0xC5, 0x2D, 0x32)), (white, (255, 255, 255))])
clean_master("GA-01-B_975px", [(white, (255, 255, 255))])

# circular masters from the approved wordmark
wm = Image.open(r"designs\16_goool_athletics\logos\GOOOL_ATHLETICS_CIRCULAR_WORDMARK_1254px.png").convert("RGBA")
# sample lettering colors from the approved concept mockups
badge_src = np.array(Image.open(r"designs\16_goool_athletics\circular_logo\individual_mockups\08_tee_ivory_navy_left-chest-badge.png").convert("RGB"))
crew_src = np.array(Image.open(r"designs\16_goool_athletics\circular_logo\individual_mockups\09_crewneck_gray-heather_forest-green_small-center.png").convert("RGB"))

def darkest_in(arr, x0, y0, x1, y1):
    crop = arr[y0:y1, x0:x1].reshape(-1, 3).astype(int)
    lum = crop.sum(axis=1)
    dark = crop[lum < np.percentile(lum, 1)]
    return tuple(int(v) for v in dark.mean(axis=0))

navy = darkest_in(badge_src, 660, 380, 860, 540)
forest = darkest_in(crew_src, 540, 330, 720, 470)
print("sampled navy:", navy, "forest:", forest)

def recolor_resize(rgba, width, path):
    arr = np.array(wm).copy()
    m = arr[..., 3] > 0
    for c in range(3):
        arr[..., c][m] = rgba[c]
    img = Image.fromarray(arr)
    img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    img.save(path)
    print(path, img.size, f"{width/300:.2f} in wide @300ppi")

recolor_resize(navy, 900, fr"{OUT}\GA-CIRCLE-08_BADGE_NAVY_900px.png")
recolor_resize(forest, 750, fr"{OUT}\GA-CIRCLE-09_CREW_FOREST_750px.png")
