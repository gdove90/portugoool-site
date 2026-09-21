from pathlib import Path
from PIL import Image
from collections import Counter,defaultdict
import hashlib,json,xml.etree.ElementTree as ET,zipfile
ROOT=Path('C:/Users/gdove/OneDrive/Desktop/GOOOL');OUT=Path(__file__).resolve().parent
EXT={'.png','.jpg','.jpeg','.webp','.svg','.pdf','.ai','.eps','.psd','.tif','.tiff','.avif','.afdesign','.zip'}
rows=[];errors=[];cache={}
for folder in ['designs','public','output']:
    base=ROOT/folder
    if not base.exists():continue
    for p in sorted(base.rglob('*')):
        if not p.is_file() or p.suffix.lower() not in EXT:continue
        rel=p.relative_to(ROOT).as_posix()
        if any('/'+x+'/' in '/'+rel for x in ['node_modules','.next','.git','.netlify']):continue
        try:
            data=p.read_bytes();h=hashlib.sha256(data).hexdigest();row={'path':rel,'sha256':h,'bytes':len(data),'extension':p.suffix.lower()}
            if h in cache:row.update(cache[h])
            elif p.suffix.lower() in ['.png','.jpg','.jpeg','.webp','.avif','.tif','.tiff']:
                with Image.open(p) as im:
                    info={'pixels':list(im.size),'mode':im.mode,'frames':getattr(im,'n_frames',1)}
                    if 'A' in im.getbands():
                        alpha=im.getchannel('A');info['alpha_bbox']=alpha.getbbox();info['solid_bbox']=alpha.point(lambda a:255 if a>=128 else 0).getbbox()
                    cache[h]=info;row.update(info)
            elif p.suffix.lower()=='.svg':
                root=ET.fromstring(data);info={'svg_viewbox':root.get('viewBox'),'svg_width':root.get('width'),'svg_height':root.get('height'),'has_embedded_raster':b'<image' in data or b'data:image' in data,'has_live_text':b'<text' in data,'path_count':data.count(b'<path'),'pixel_run_trace':data.count(b'v1h')>100}
                row.update(info);cache[h]=info
            elif p.suffix.lower()=='.zip':
                with zipfile.ZipFile(p) as z:row['archive_entries']=len(z.infolist())
            rows.append(row)
        except Exception as e:errors.append({'path':rel,'error':str(e)})
for p in ROOT.glob('*.pdf'):
    data=p.read_bytes();rows.append({'path':p.name,'extension':'.pdf','bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
groups=defaultdict(list)
for r in rows:groups[r['sha256']].append(r['path'])
duplicates=[{'sha256':h,'bytes_each':next(r['bytes'] for r in rows if r['sha256']==h),'paths':v} for h,v in groups.items() if len(v)>1]
(OUT/'inventory.json').write_text(json.dumps({'root':str(ROOT),'files':rows,'errors':errors},indent=2),encoding='utf-8')
(OUT/'duplicates.json').write_text(json.dumps(duplicates,indent=2),encoding='utf-8')
roots=Counter('/'.join(r['path'].split('/')[:2]) for r in rows)
print(json.dumps({'files':len(rows),'unique_hashes':len(groups),'duplicate_groups':len(duplicates),'redundant_bytes':sum(d['bytes_each']*(len(d['paths'])-1) for d in duplicates),'errors':errors,'folders':roots},indent=2))
