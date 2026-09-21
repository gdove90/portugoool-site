from pathlib import Path
import json, hashlib, zipfile, shutil
ROOT=Path(__file__).resolve().parent.parent/'apliiq-upload-packages-2026-09-21'
build=Path(__file__).resolve().parent
(ROOT/'build-provenance').mkdir(exist_ok=True)
for name in ['build_packages.py','export-catalog.cjs','finalize_packages.py']:
    shutil.copy2(build/name,ROOT/'build-provenance'/name)
(ROOT/'archives').mkdir(exist_ok=True)
for base in sorted((ROOT/'packages').iterdir()):
    with zipfile.ZipFile(ROOT/'archives'/(base.name+'.zip'),'w',zipfile.ZIP_DEFLATED) as z:
        for p in sorted(base.rglob('*')):
            if p.is_file(): z.write(p,p.relative_to(base).as_posix())
hashes={p.relative_to(ROOT).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(ROOT.rglob('*')) if p.is_file() and p.name not in ['PACKAGE-FILES.json','VERIFICATION-RESULT.json']}
(ROOT/'PACKAGE-FILES.json').write_text(json.dumps(hashes,indent=2)+'\n',encoding='utf-8')
print(json.dumps({'archives':len(list((ROOT/'archives').glob('*.zip'))),'hashed_files':len(hashes),'total_bytes':sum(p.stat().st_size for p in ROOT.rglob('*') if p.is_file())}))
