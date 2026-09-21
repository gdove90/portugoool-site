from pathlib import Path
from datetime import datetime,timezone
import json,hashlib,shutil,sys,re,zipfile,subprocess

WORK=Path(__file__).resolve().parent
PLAN=json.loads((WORK/'install-plan.json').read_text(encoding='utf8'))
ROOT=Path(PLAN['root']).resolve()
STAGE=Path(PLAN['staging']).resolve()
LIB='designs/00_asset-library'
ARCH='designs/_archive/artwork-audit-2026-09-21'
V2='designs/apliiq-upload-packages-2026-09-21-v2'
def sha(data):return hashlib.sha256(data).hexdigest()
def checked(rel):
 p=(ROOT/rel).resolve()
 if not p.is_relative_to(ROOT) or p==ROOT:raise RuntimeError('Unsafe target: '+rel)
 if p.relative_to(ROOT).parts[0] in ['.git','.claude','node_modules','public','src','supabase']:raise RuntimeError('Unexpected mutation scope: '+rel)
 return p
def projected(rel):
 p=STAGE/rel
 if p.is_file():return p
 for move in PLAN['moves']:
  new=move['destination']
  if rel.startswith(new+'/'):return ROOT/move['source']/rel[len(new)+1:]
 for row in PLAN['changes']:
  if row.get('backup')==rel:return ROOT/row['path']
 return ROOT/rel
def check(ok,msg):
 global count
 count+=1
 if not ok:errors.append(msg)

count=0;errors=[]
for move in PLAN['moves']:
 old=checked(move['source']);new=checked(move['destination'])
 check(old.is_dir() and not new.exists(),'Move source/destination unexpected: '+move['source'])
 if old.is_dir():
  current={p.relative_to(old).as_posix():sha(p.read_bytes()) for p in old.rglob('*') if p.is_file()}
  check(current==move['files'],'Moved folder changed since audit: '+move['source'])
  check(all(p.resolve().is_relative_to(ROOT) for p in old.rglob('*')),'Linked content escapes GOOOL: '+move['source'])
for row in PLAN['changes']:
 p=checked(row['path']);stage=STAGE/row['path']
 check(stage.is_file() and sha(stage.read_bytes())==row['after_sha256'],'Staged file changed: '+row['path'])
 check((sha(p.read_bytes()) if p.is_file() else None)==row['before_sha256'],'Concurrent edit: '+row['path'])
 if row['backup']:check(not checked(row['backup']).exists(),'Backup already exists: '+row['backup'])
inventory=json.loads((STAGE/LIB/'INVENTORY-BEFORE.json').read_text(encoding='utf8'))['files']
for row in inventory:
 p=ROOT/row['path'];check(p.is_file() and sha(p.read_bytes())==row['sha256'],'Original artwork changed since inventory: '+row['path'])
sources=json.loads((STAGE/V2/'SOURCE-FILES.json').read_text(encoding='utf8'))
for rel,row in sources['files'].items():
 p=projected(rel);check(p.is_file() and sha(p.read_bytes())==row['sha256'],'Current source freshness differs: '+rel)
registry=json.loads((STAGE/LIB/'UNIQUE-ASSETS.json').read_text(encoding='utf8'))['assets']
check(len(registry)==len({r['sha256'] for r in registry}),'Duplicate canonical hash records')
for row in registry:
 for rel in [row['canonical_file']]+[a['path'] for a in row['aliases']]:
  p=projected(rel);check(p.is_file() and sha(p.read_bytes())==row['sha256'],'Registry target mismatch: '+rel)
for file,key in [('MASTER-ARTWORK-INDEX.json','families'),('ALL-PRODUCTS.json','products')]:
 rows=json.loads((STAGE/LIB/file).read_text(encoding='utf8'))[key]
 for r in rows:
  for item in r.get('selected_files',[])+r.get('reference_files',[])+r.get('artwork_files',[]):
   p=projected(item['path']);check(p.is_file() and sha(p.read_bytes())==item['sha256'],'Curated asset mismatch: '+item['path'])
products=json.loads((STAGE/LIB/'ALL-PRODUCTS.json').read_text(encoding='utf8'))['products']
check(len(products)==64 and sum(p['catalog_active'] for p in products)==10,'Product coverage mismatch')
check(len({p['product_id'] for p in products})==64,'Duplicate product record')
for path in (STAGE/LIB).glob('*.md'):
 for href in re.findall(r'\]\(([^)]+)\)',path.read_text(encoding='utf8')):
  if href.startswith(('https:','http:','#')):continue
  target=((ROOT/path.relative_to(STAGE)).parent/href).resolve()
  if target.is_relative_to(ROOT):check(projected(target.relative_to(ROOT).as_posix()).exists(),'Broken library link '+href)
for entry in json.loads((STAGE/V2/'CATALOG-INDEX.json').read_text(encoding='utf8'))['packages']:
 base=V2+'/'+Path(entry['spec']).parent.as_posix()
 sums=json.loads((STAGE/base/'SHA256SUMS.json').read_text(encoding='utf8'))
 for rel,h in sums.items():check(sha(projected(base+'/'+rel).read_bytes())==h,'Package integrity: '+base+'/'+rel)
 zpath=STAGE/V2/'archives'/(entry['package_id']+'.zip')
 with zipfile.ZipFile(zpath) as z:
  check(z.testzip() is None,'Invalid ZIP '+zpath.name)
  check(set(z.namelist())==set(sums)|{'SHA256SUMS.json'},'ZIP file list '+zpath.name)
  for rel in z.namelist():check(sha(z.read(rel))==sha(projected(base+'/'+rel).read_bytes()),'ZIP bytes '+zpath.name+'/'+rel)
for rel,h in json.loads((STAGE/V2/'PACKAGE-FILES.json').read_text(encoding='utf8')).items():check(sha(projected(V2+'/'+rel).read_bytes())==h,'Root package hash: '+rel)
print(json.dumps({'phase':'preflight','checks':count,'status':'FAIL' if errors else 'PASS','errors':errors[:30]},indent=2))
if errors:sys.exit(1)
if '--apply' not in sys.argv:sys.exit(0)

# All sources and absolute destinations have been checked before recursive moves.
for move in PLAN['moves']:
 old=checked(move['source']);new=checked(move['destination']);new.parent.mkdir(parents=True,exist_ok=True)
 shutil.move(str(old),str(new))
for row in PLAN['changes']:
 target=checked(row['path'])
 if row['backup']:
  backup=checked(row['backup']);backup.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(target,backup)
 target.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(STAGE/row['path'],target)

preserved=[];errors=[];count=0
for row in inventory:
 rel=row['path'];target=ROOT/rel
 for move in PLAN['moves']:
  if rel.startswith(move['source']+'/'):target=ROOT/move['destination']/rel[len(move['source'])+1:]
 changed=next((c for c in PLAN['changes'] if c['path']==rel and c.get('backup')),None)
 if changed:target=ROOT/changed['backup']
 check(target.is_file() and sha(target.read_bytes())==row['sha256'],'Original not preserved: '+rel)
 preserved.append({'original_path':rel,'preserved_path':target.relative_to(ROOT).as_posix(),'sha256':row['sha256']})
for row in PLAN['changes']:check(sha((ROOT/row['path']).read_bytes())==row['after_sha256'],'Installed file mismatch: '+row['path'])
check(all(sha((ROOT/r['path']).read_bytes())==r['sha256'] for r in inventory if r['path'].startswith('public/')),'Public artwork changed')
res=subprocess.run([sys.executable,str(ROOT/V2/'verify-packages.py')],capture_output=True,text=True)
try:package_result=json.loads(res.stdout)
except Exception:package_result={'raw_output':res.stdout,'stderr':res.stderr}
check(res.returncode==0,'Existing package verifier failed: '+str(package_result))
result={'status':'FAIL' if errors else 'PASS','at_utc':datetime.now(timezone.utc).isoformat(),'post_install_checks':count,'original_files_preserved':len(preserved),'original_unique_hashes_preserved':len({r['sha256'] for r in preserved}),'catalog_products':64,'active_products':10,'inactive_products':54,'design_families':21,'public_artwork_unchanged':not any('Public' in e for e in errors),'package_verifier':package_result,'errors':errors,'scope':'Local byte preservation, source selection references, package/ZIP integrity and catalog coverage. Not visual identity certification for every historical concept, supplier account verification or manufacturing approval.'}
for rel,data in [(LIB+'/VERIFICATION-RESULT.json',result),(LIB+'/PRESERVED-FILES.json',preserved),(ARCH+'/INSTALL-LOG.json',PLAN),(V2+'/VERIFICATION-RESULT.json',package_result)]:
 p=checked(rel);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(data,indent=2)+'\n',encoding='utf8')
for filename in ['inventory.py','build_audit.py','install_audit.py']:
 p=checked(LIB+'/audit-provenance/'+filename);p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(WORK/filename,p)
print(json.dumps(result,indent=2))
sys.exit(1 if errors else 0)
