"""Read-only integrity, coverage and source freshness check. Python standard library."""
from pathlib import Path
import json, hashlib, zipfile, sys

ROOT=Path(__file__).resolve().parent
errors=[]; checks=0; source_available=False
def read(p): return json.loads(p.read_text(encoding='utf-8-sig'))
def digest(data): return hashlib.sha256(data).hexdigest()
def check(ok,message):
    global checks
    checks+=1
    if not ok: errors.append(message)

index=read(ROOT/'CATALOG-INDEX.json')
catalog=read(ROOT/'source-snapshot/active-catalog.json')
expected={(p['slug'],v['name']) for p in catalog for v in (p.get('colorVariants') or [{'name':p['color']}])}
actual={(p['slug'],p['website_color']) for p in index['packages']}
check(expected==actual,'Active catalog colorway coverage differs')
check(len(actual)==len(index['packages'])==14,'Duplicate or missing colorway packages')
check(len({p['slug'] for p in index['packages']})==10,'Product coverage differs')
for entry in index['packages']:
    base=ROOT/Path(entry['spec']).parent
    hashes=read(base/'SHA256SUMS.json')
    names={p.relative_to(base).as_posix() for p in base.rglob('*') if p.is_file() and p.name!='SHA256SUMS.json'}
    check(names==set(hashes),f'Unexpected/missing package files: {base.name}')
    for rel,h in hashes.items():
        path=base/rel
        check(path.is_file() and digest(path.read_bytes())==h,f'Package hash mismatch: {base.name}/{rel}')
    spec=read(base/'spec.json')
    p=next(p for p in catalog if p['slug']==entry['slug'])
    check(spec['product']['id']==p['id'],f'Product ID mismatch: {base.name}')
    check(spec['product']['website_sizes']==p['sizes'],f'Size mismatch: {base.name}')
    check(not spec['release']['ready_for_unattended_upload'],f'Unexpected automatic upload authorization: {base.name}')
    check(not spec['supplier_record']['executable_fulfillment_mapping'],f'Unverified executable mapping: {base.name}')
    for art in spec['decoration']['artwork']:
        check(digest((base/art['path']).read_bytes())==art['sha256'],f'Artwork manifest mismatch: {base.name}')
        vw=art['visible_pixels'][0]
        check(abs(vw/art['visible_width_in']-art['effective_ppi_at_target_visible_width'])<.00001,f'Visible PPI calculation incorrect: {base.name}')
        check(art['raster_modified_by_package_builder'] is False,f'Unexpected raster transformation: {base.name}')
    archive=ROOT/'archives'/(base.name+'.zip')
    check(archive.is_file(),f'Missing archive: {base.name}')
    if archive.is_file():
        with zipfile.ZipFile(archive) as z:
            check(z.testzip() is None,f'Corrupt ZIP: {base.name}')
            packaged={p.relative_to(base).as_posix():digest(p.read_bytes()) for p in base.rglob('*') if p.is_file()}
            check(set(z.namelist())==set(packaged),f'ZIP content list differs: {base.name}')
            for name,h in packaged.items():
                check(digest(z.read(name))==h,f'ZIP content mismatch: {base.name}/{name}')

for rel,h in read(ROOT/'PACKAGE-FILES.json').items():
    p=ROOT/rel
    check(p.is_file() and digest(p.read_bytes())==h,f'Root file changed: {rel}')
sources=read(ROOT/'SOURCE-FILES.json'); source_root=Path(sources['source_project_root'])
if source_root.is_dir():
    source_available=True
    for rel,r in sources['files'].items():
        p=source_root/rel
        check(p.is_file() and digest(p.read_bytes())==r['sha256'],f'Source changed since build: {rel}')
print(json.dumps({'status':'PASS' if not errors else 'FAIL','checks':checks,'products':len(catalog),'packages':len(index['packages']), 'source_freshness_checked':source_available,'errors':errors,'scope':'File integrity and catalog coverage only; no supplier account or manufacturing approval.'},indent=2))
sys.exit(1 if errors else 0)
