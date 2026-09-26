# -*- coding: utf-8 -*-
"""Assemble CORE-CAPSULE-LAUNCH-2026-09-25/ at the repo root: one folder per
launch product with COPIES of everything a person needs to find quickly
(print files, site images, renders, handoffs, production notes), plus a
README index with every Apliiq design id, per-size SKU and price, and a
MANIFEST.json with sha256 of every copied file and its canonical source.

Canonical files stay where they are (designs/…, public/products/…); this
folder is a curated view and can be regenerated at any time:

  python scripts/assemble-core-capsule.py

Large renders are copied but git-ignored inside this folder (they are
committed in their canonical homes), so the repo does not double in size.
"""
import io, os, re, json, shutil, hashlib, glob

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(REPO)
DEST = 'CORE-CAPSULE-LAUNCH-2026-09-25'
PKG = 'designs/apliiq-upload-packages-2026-09-21-v2/packages'
TEE = 'designs/24_casual-tee-3010-2026-09-23'
HOOD = 'designs/25_core-hoodie-remake-2026-09-24'
CAPS = 'designs/23_cap-embroidery-2026-09-22'
V6 = 'designs/31_matchday-tee-v6-all-colours-2026-09-25'

products_src = io.open('src/lib/products.ts', encoding='utf-8').read()
recon = json.load(open('designs/11_fulfillment/apliiq-reconciliation.json', encoding='utf-8'))


def product_block(slug):
    i = products_src.index('slug: "%s",' % slug)
    start = products_src.rfind('\n  {\n', 0, i) + 1
    end = products_src.index('\n  },\n', i)
    return products_src[start:end]


def product_images(slug):
    return sorted(set(re.findall(r'src: "/products/([^"]+)"', product_block(slug))))


def product_price(slug):
    m = re.search(r'priceCents: (\d+)', product_block(slug))
    return int(m.group(1)) / 100


def product_name(slug):
    return re.search(r'name: "([^"]+)"', product_block(slug)).group(1)


def recon_rows():
    out = []

    def walk(o):
        if isinstance(o, dict):
            if 'saved_design_id' in o:
                out.append(o)
            else:
                for v in o.values():
                    walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(recon)
    return [r for r in out if r.get('catalog_is_active')]


ROWS = recon_rows()

# ── what goes where ───────────────────────────────────────────────────
# (folder, slug, [ (dest_subdir, [source paths or globs]) ... ], note)
PLAN = [
    ('01_performance-badge-tee', 'goool-performance-tee', [
        ('artwork', [f'{PKG}/01-goool-performance-tee-black/artwork/*']),
        ('package-docs/black', [f'{PKG}/01-goool-performance-tee-black/*.md', f'{PKG}/01-goool-performance-tee-black/*.json', f'{PKG}/01-goool-performance-tee-black/*.html']),
        ('package-docs/white', [f'{PKG}/02-goool-performance-tee-white/*.md', f'{PKG}/02-goool-performance-tee-white/*.json', f'{PKG}/02-goool-performance-tee-white/*.html']),
        ('package-docs/true-royal', [f'{PKG}/03-goool-performance-tee-true-royal/*.md', f'{PKG}/03-goool-performance-tee-true-royal/*.json', f'{PKG}/03-goool-performance-tee-true-royal/*.html']),
        ('label', [f'{PKG}/01-goool-performance-tee-black/label/README.md', f'{PKG}/01-goool-performance-tee-black/label/artwork/*']),
    ], 'Sport-Tek ST720. One front badge file for all three colours.'),
    ('02_modern-sport-performance-tee', 'goool-athletics-modern-sport-performance-tee', [
        ('artwork', [f'{PKG}/14-goool-athletics-modern-sport-performance-tee-black/artwork/*']),
        ('artwork/v6-2026-09-25/front', [f'{V6}/exports/front/*']),
        ('artwork/v6-2026-09-25/back', [f'{V6}/exports/back/*']),
        ('artwork/v6-2026-09-25', [f'{V6}/MEASUREMENTS.json', f'{V6}/HANDOFF-AS-RECEIVED.md', f'{V6}/README.md']),
        ('package-docs', [f'{PKG}/14-goool-athletics-modern-sport-performance-tee-black/*.md', f'{PKG}/14-goool-athletics-modern-sport-performance-tee-black/*.json', f'{PKG}/14-goool-athletics-modern-sport-performance-tee-black/*.html']),
    ], 'Sport-Tek ST720, sold as GOOOL Matchday Tee. Black, True Royal and White share the files: front GA-01-F v3 11 x 3.72 in, back GA-01-B v6 5.00 x 1.812 in (the 3.25 in back failed the 2 mm check; v5 superseded). White uses ink versions; its Apliiq design is not created yet, so it is comingSoon on the site.'),
    ('03_core-hoodie-red', 'goool-heavyweight-hoodie', [
        ('print-files', [f'{TEE}/print-files/4a-black-front.png', f'{TEE}/print-files/4a-natural-front.png', f'{TEE}/print-files/4a-athletic-heather-front.png', f'{TEE}/print-files/4a-back-yoke.png']),
        ('handoff', [f'{HOOD}/*.md', f'{HOOD}/*.png', f'{HOOD}/FILES.json']),
        ('renders', [f'{HOOD}/site-imagery/*red-band*', f'{HOOD}/site-imagery/README.md', f'{HOOD}/site-imagery/FILES.json']),
    ], 'Independent IND4000. Front lockup 11.10 x 4.59 in at the top of the front area; red band 12.00 x 2.00 in on the bottom edge of the back area.'),
    ('04_core-hoodie-club-blue', 'goool-heavyweight-hoodie-blue', [
        ('print-files', [f'{TEE}/print-files/4b-black-front.png', f'{TEE}/print-files/4b-natural-front.png', f'{TEE}/print-files/4b-athletic-heather-front.png', f'{TEE}/print-files/4b-back-yoke-blue.png']),
        ('handoff', [f'{HOOD}/*.md', f'{HOOD}/*.png', f'{HOOD}/FILES.json']),
        ('renders', [f'{HOOD}/site-imagery/*blue-band*', f'{HOOD}/site-imagery/README.md', f'{HOOD}/site-imagery/FILES.json']),
    ], 'Independent IND4000. Same placements as the red set; Club Blue lockup and band (True Royal lockup on Grey Heather).'),
    ('05_casual-wordmark-tee-red', 'goool-heavyweight-casual-tee', [
        ('print-files', [f'{TEE}/print-files/4a-black-front.png', f'{TEE}/print-files/4a-natural-front.png', f'{TEE}/print-files/4a-back-yoke.png']),
        ('handoff', [f'{TEE}/*.md', f'{TEE}/FILES.json']),
        ('renders', [f'{TEE}/site-imagery/*-red-*', f'{TEE}/site-imagery/README.md', f'{TEE}/site-imagery/FILES.json']),
    ], 'Bella+Canvas 3010. Front lockup 11.10 x 4.59 in (top 3.00 in below the collar seam by production note); red band 12.00 x 2.00 in on the back yoke.'),
    ('06_casual-wordmark-tee-club-blue', 'goool-heavyweight-casual-tee-blue', [
        ('print-files', [f'{TEE}/print-files/4b-black-front.png', f'{TEE}/print-files/4b-natural-front.png', f'{TEE}/print-files/4b-back-yoke-blue.png']),
        ('handoff', [f'{TEE}/*.md', f'{TEE}/FILES.json']),
        ('renders', [f'{TEE}/site-imagery/*-blue-*', f'{TEE}/site-imagery/README.md', f'{TEE}/site-imagery/FILES.json']),
    ], 'Bella+Canvas 3010. Same placements as the red set; Club Blue lockup and band.'),
    ('07_touchline-cap', 'goool-touchline-cap', [
        ('artwork', [f'{PKG}/08-goool-touchline-cap-black-natural/artwork/*']),
        ('package-docs', [f'{PKG}/08-goool-touchline-cap-black-natural/*.md', f'{PKG}/08-goool-touchline-cap-black-natural/*.json', f'{PKG}/08-goool-touchline-cap-black-natural/*.html']),
    ], 'OTTO 31-069, front embroidery.'),
    ('08_athletics-badge-cap', 'goool-athletics-badge-cap', [
        ('embroidery', [f'{CAPS}/artwork/*', f'{CAPS}/*.md']),
        ('concepts', [f'{CAPS}/concepts/FINAL-cap-badge-ink.png', f'{CAPS}/concepts/FINAL-two-caps.png']),
    ], 'OTTO 31-069, badge embroidery 2.00 in (Apliiq caps the badge at 2 in on this hat).'),
    ('09_athletics-stacked-cap', 'goool-athletics-stacked-cap', [
        ('embroidery', [f'{CAPS}/artwork/*', f'{CAPS}/*.md']),
        ('concepts', [f'{CAPS}/concepts/FINAL-cap-lockup-ink.png', f'{CAPS}/concepts/FINAL-two-caps.png']),
    ], 'OTTO 31-069, stacked lockup embroidery.'),
]

DECISIONS = [
    'designs/00_asset-library/CORE-CAPSULE-LAUNCH-DECISION.md',
    'designs/00_asset-library/CORE-HOODIE-REMAKE-DECISION.md',
    'designs/00_asset-library/CASUAL-TEE-3010-DECISION.md',
    'designs/18_launch_operations/PRICING-25-PERCENT.md',
    'designs/11_fulfillment/apliiq-reconciliation.json',
    'designs/11_fulfillment/apliiq-product-mapping.md',
    'LAUNCH-TASK-LIST.md',
]

manifest = []


def sha(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest().upper()


def copy(src, dest_dir):
    os.makedirs(dest_dir, exist_ok=True)
    dst = os.path.join(dest_dir, os.path.basename(src))
    shutil.copyfile(src, dst)
    manifest.append({'file': dst.replace('\\', '/'), 'source': src.replace('\\', '/'), 'bytes': os.path.getsize(src), 'sha256': sha(src)})


if os.path.isdir(DEST):
    shutil.rmtree(DEST)
os.makedirs(DEST)

sections = []
for folder, slug, parts, note in PLAN:
    base = os.path.join(DEST, folder)
    for sub, patterns in parts:
        for pat in patterns:
            for src in sorted(glob.glob(pat)):
                if os.path.isfile(src):
                    copy(src, os.path.join(base, sub))
    for img in product_images(slug):
        copy(os.path.join('public/products', img), os.path.join(base, 'site-images'))
    name = product_name(slug)
    rows = [r for r in ROWS if r['product'] == name]
    lines = [f'## {folder}: {name}', '', note, '', f'Price on the site: **${product_price(slug):.2f}**. Site copies in `{folder}/site-images/` (served from `public/products/`).', '',
             '| Colour | Apliiq design | Per-size SKUs |', '|---|---|---|']
    for r in sorted(rows, key=lambda r: r['saved_design_id']):
        skus = ', '.join(f'{k} {v}' for k, v in (r.get('per_size_skus') or {}).items())
        lines.append(f"| {r['color']} | {r['saved_design_id']} | {skus} |")
    sections.append('\n'.join(lines))

for src in DECISIONS:
    if os.path.isfile(src):
        copy(src, os.path.join(DEST, '_decisions-and-pricing'))

readme = f'''# Core Capsule · launch folder (Friday 2026-09-25)

Everything that goes live in the first collection, one folder per product,
copied here so it is easy to find. **The canonical files stay in their
homes** (`designs/…` for print files and handoffs, `public/products/` for
site images); if you edit something, edit it there and re-run
`python scripts/assemble-core-capsule.py` to refresh this folder.
`MANIFEST.json` lists every file here with its source and sha256.

Nine rows, all open for sale. Apliiq design ids and per-size SKUs below
are what checkout and fulfilment use (`src/lib/fulfillment.ts`).

{(chr(10)+chr(10)).join(sections)}

## _decisions-and-pricing

The owner decisions behind this capsule (Core Capsule launch, hoodie
remake, 3010 casual tee), the 25% price model, the Apliiq reconciliation
registry, the product mapping notes and the launch task list.

## Retired from the site on 2026-09-24 (not in this folder)

GOOOL Athletics Varsity Tee, Circular Badge Tee and Circular Center
Crewneck, and the original wordmark-only Core Hoodie. Their Apliiq designs
stay saved; their files stay in `designs/`.

## Launch checklist (24 Sep 2026)

1. Netlify credits, then `rm -rf .next && npx netlify deploy --prod --build`.
2. Supabase migrations 0034 and 0035 in the SQL editor (audit trail).
3. Bone · Red hoodie renders from the owner: supplied and shipped 2026-09-25.
4. Owner's call on the preview gate.
'''
io.open(os.path.join(DEST, 'README.md'), 'w', encoding='utf-8', newline='').write(readme)
json.dump(manifest, open(os.path.join(DEST, 'MANIFEST.json'), 'w', encoding='utf-8'), indent=1)
print(f'{DEST}: {len(manifest)} files copied into {len(PLAN)} product folders + decisions')
