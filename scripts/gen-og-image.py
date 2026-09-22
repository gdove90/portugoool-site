"""
Builds the Open Graph / link-preview share card at src/app/opengraph-image.png.

goool.shop shipped with og:title and og:description but NO og:image, so every
share of the link - Instagram DM, Story link sticker, WhatsApp, iMessage -
rendered as a bare text stub. This restores the image.

Nothing here is a new design decision. It composes assets already approved and
already live on the homepage hero, at the 1200x630 spec every platform wants:
  - public/hero-crowd.webp        the approved hero photograph
  - the same 180deg scrim the live hero uses, values copied exactly
  - the Echo mark, drawn from the same geometry as the inline hero SVG
  - public/brand/goool-wordmark-white.png   the approved wordmark
  - "MADE FOR THE MOMENT." in the display face, as on the hero

Re-run after any hero or wordmark change:  python scripts/gen-og-image.py
"""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630            # the spec every platform crops toward
OUT = "src/app/opengraph-image.png"

RED, GOLD, PAPER = (0xC1, 0x12, 0x1F), (0xC9, 0xA2, 0x27), (0xFF, 0xFF, 0xFF)

# ── background: cover-crop the hero, matching object-cover on the live page
hero = Image.open("public/hero-crowd.webp").convert("RGB")
scale = max(W / hero.width, H / hero.height)
hero = hero.resize((round(hero.width * scale), round(hero.height * scale)), Image.LANCZOS)
left, top = (hero.width - W) // 2, (hero.height - H) // 2
card = hero.crop((left, top, left + W, top + H))

# ── scrim: the live hero's gradient, stop for stop
# linear-gradient(180deg, .7 at 0%, .35 at 40%, .35 at 55%, .85 at 100%)
STOPS = [(0.0, 0.70), (0.40, 0.35), (0.55, 0.35), (1.0, 0.85)]
scrim = Image.new("RGBA", (1, H))
sd = ImageDraw.Draw(scrim)
for y in range(H):
    t = y / (H - 1)
    for (p0, a0), (p1, a1) in zip(STOPS, STOPS[1:]):
        if p0 <= t <= p1:
            f = 0 if p1 == p0 else (t - p0) / (p1 - p0)
            a = a0 + (a1 - a0) * f
            break
    sd.point((0, y), fill=(10, 10, 10, round(a * 255)))
card = Image.alpha_composite(card.convert("RGBA"), scrim.resize((W, H)))
d = ImageDraw.Draw(card)

# ── Echo mark. Same geometry as the hero SVG (viewBox 240x220, cx/cy 54/110,
# dot r15, arcs r38/r68 red and r98 gold at stroke 13), clipped to x >= cx so
# only the radiating right half shows - the scream leaving the mouth.
# Centred above the wordmark, as on the live hero.
S = 88 / 240.0                      # render at 88px wide, up from the hero's 72
cx, cy = 600, 142
def arc(r, colour, width):
    rr, ww = r * S, max(1, round(width * S))
    d.arc([cx - rr, cy - rr, cx + rr, cy + rr], start=-90, end=90,
          fill=colour, width=ww)
arc(98, GOLD, 13); arc(68, RED, 13); arc(38, RED, 13)
dot = 15 * S
d.ellipse([cx - dot, cy - dot, cx + dot, cy + dot], fill=PAPER)

# ── wordmark, centred, sized to the card
mark = Image.open("public/brand/goool-wordmark-white.png").convert("RGBA")
mw = 620
mark = mark.resize((mw, round(mark.height * mw / mark.width)), Image.LANCZOS)
card.alpha_composite(mark, ((W - mw) // 2, 240))

# ── tagline, letter-spaced to match the hero's tracking-[0.16em]
def spaced(draw, xy, text, font, fill, tracking):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking

TAG = "MADE FOR THE MOMENT."
font = None
for p in ["C:/Windows/Fonts/arialbd.ttf", "C:/Windows/Fonts/segoeuib.ttf"]:
    if os.path.exists(p):
        font = ImageFont.truetype(p, 30)
        break
if font:
    TRACK = 30 * 0.16
    width = sum(d.textlength(c, font=font) + TRACK for c in TAG) - TRACK
    spaced(d, ((W - width) / 2, 452), TAG, font, PAPER, TRACK)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
card.convert("RGB").save(OUT, "PNG", optimize=True)
print(f"wrote {OUT}  {W}x{H}  {os.path.getsize(OUT) / 1024:.0f} KB")
