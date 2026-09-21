from pathlib import Path
import json,hashlib,zipfile,shutil
R=Path(__file__).resolve().parent.parent/'apliiq-upload-packages-2026-09-21-v2'
P=Path('C:/Users/gdove/OneDrive/Desktop/GOOOL')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p,x):p.write_text(json.dumps(x,indent=2)+'\n',encoding='utf-8')
sources=json.loads((R/'SOURCE-FILES.json').read_text(encoding='utf-8'))
for rel in ['public/brand/goool-wordmark-white.png','designs/17_launch_imagery/performance-concepts/CONCEPT-NOTES.md','designs/16_goool_athletics/circular_logo/LAUNCH_SELECTION.md']:
    src=P/rel;sources['files'][rel]={'sha256':sha(src),'bytes':src.stat().st_size}
write(R/'SOURCE-FILES.json',sources)
write(R/'VISUAL-QA.json',{'checked':['one-inch flat label raster','navy circular print export','circular tee browser placement proof','Modern Sport performance front/back browser placement proof'],'findings':'Three-O spelling, segmented label underline and front/back placements visually inspected. Fixed PNG density export dimensions and improved diagram dimension contrast. Source-derived outlines retain source limitations; supplier production proof and physical sample not completed.','supplier_account_verified':False})
shutil.copy2(Path(__file__),R/'build-provenance/finalize_v2.py')
(R/'archives').mkdir(exist_ok=True)
for b in (R/'packages').iterdir():
    hashes={p.relative_to(b).as_posix():sha(p) for p in sorted(b.rglob('*')) if p.is_file() and p.name!='SHA256SUMS.json'}
    write(b/'SHA256SUMS.json',hashes)
    with zipfile.ZipFile(R/'archives'/(b.name+'.zip'),'w',zipfile.ZIP_DEFLATED) as z:
        for p in sorted(b.rglob('*')):
            if p.is_file():z.write(p,p.relative_to(b).as_posix())
hashes={p.relative_to(R).as_posix():sha(p) for p in sorted(R.rglob('*')) if p.is_file() and p.name not in ['PACKAGE-FILES.json','VERIFICATION-RESULT.json']}
write(R/'PACKAGE-FILES.json',hashes)
print(json.dumps({'archives':len(list((R/'archives').glob('*.zip'))),'files':len(hashes),'bytes':sum(p.stat().st_size for p in R.rglob('*') if p.is_file())}))
