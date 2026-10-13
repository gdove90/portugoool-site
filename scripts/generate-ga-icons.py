"""Render the repository GA favicon source; preserve its vector path geometry.

Requires CairoSVG and Pillow. Never use this reconstruction as manufacturer approval.
"""
from pathlib import Path
from io import BytesIO
import cairosvg
from PIL import Image, ImageChops

root = Path(__file__).resolve().parents[1]
source = (root / 'src/app/icon.svg').read_bytes()
icons = root / 'public/icons'
icons.mkdir(parents=True, exist_ok=True)
for size in (16, 32, 48, 180, 192, 512):
    data = cairosvg.svg2png(bytestring=source, output_width=size, output_height=size)
    (icons / f'goal-ga-{size}.png').write_bytes(data)
    if size == 512:
        (root / 'src/app/icon.png').write_bytes(data)
    if size == 180:
        (root / 'src/app/apple-icon.png').write_bytes(data)

image = Image.open(BytesIO((root / 'src/app/icon.png').read_bytes())).convert('RGB')
bounds = ImageChops.difference(image, Image.new('RGB', image.size, 'white')).point(lambda p: 255 if p > 127 else 0).getbbox()
assert bounds is not None
center = ((bounds[0] + bounds[2] - 1) / 2, (bounds[1] + bounds[3] - 1) / 2)
assert all(abs(axis - 255.5) <= 1 for axis in center), (bounds, center)
image.save(root / 'src/app/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
print(f'GA icons rendered at six sizes. 512px ink bounds: {bounds}; center: {center}.')
