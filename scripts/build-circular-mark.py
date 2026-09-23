"""Typeset the GOOOL ATHLETICS circular mark - letters alone, no disk."""
from PIL import Image, ImageDraw, ImageFont
import math

def arc_text(img, text, font, cx, cy, radius, start_deg, end_deg, fill, flip=False):
    """Lay text along an arc, each glyph rotated tangent to the circle."""
    d = ImageDraw.Draw(img)
    widths = [d.textlength(c, font=font) for c in text]
    total = sum(widths)
    span = end_deg - start_deg
    pos = 0.0
    for ch, w in zip(text, widths):
        frac = (pos + w / 2) / total
        ang = start_deg + span * frac
        a = math.radians(ang)
        x, y = cx + radius * math.cos(a), cy + radius * math.sin(a)
        # glyph on its own transparent tile, then rotated
        pad = int(font.size * 1.8)
        tile = Image.new("RGBA", (pad, pad), (0, 0, 0, 0))
        td = ImageDraw.Draw(tile)
        td.text((pad / 2, pad / 2), ch, font=font, fill=fill, anchor="mm")
        rot = -(ang + 90) if not flip else -(ang - 90)
        tile = tile.rotate(rot, resample=Image.BICUBIC, center=(pad / 2, pad / 2))
        img.alpha_composite(tile, (int(x - pad / 2), int(y - pad / 2)))
        pos += w

def build(font_path, size=1080, top="GOOOL", bottom="ATHLETICS",
          colour=(0x0A, 0x1F, 0x3C, 255), top_pt=None, bot_pt=None,
          tracking_top=118, tracking_bot=150):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    cx = cy = size / 2
    R = size * 0.335
    top_pt = top_pt or int(size * 0.175)
    bot_pt = bot_pt or int(size * 0.105)
    ft = ImageFont.truetype(font_path, top_pt)
    fb = ImageFont.truetype(font_path, bot_pt)
    # top arc reads left-to-right over the crown
    arc_text(img, top, ft, cx, cy, R, 180 + (180 - tracking_top) / 2,
             180 + (180 + tracking_top) / 2, colour, flip=False)
    # bottom arc reads left-to-right along the base
    arc_text(img, bottom, fb, cx, cy, R * 0.97, (180 + tracking_bot) / 2,
             (180 - tracking_bot) / 2, colour, flip=True)
    return img
