import json, hashlib
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage
from skimage.morphology import skeletonize

root = Path(__file__).resolve().parent
exports = Path(r'C:\Users\gdove\OneDrive\Desktop\GOOOL\designs\26_modern-sport-print-rebuild-2026-09-25\exports')
records=[]
for name,width_in,saved_height in [('GA-01-F_v3_3300px.png',11,3.73),('GA-01-B_v3_1950px_600ppi.png',3.25,1.11)]:
    a=np.array(Image.open(exports/name).convert('RGBA'))
    m=a[:,:,3]>127
    ys=np.flatnonzero(m.any(axis=1))
    cuts=np.flatnonzero(np.diff(ys)>1)
    bands=np.split(ys,cuts+1)
    band=bands[-1]
    ath=m[band[0]:band[-1]+1,:]
    lab,n=ndimage.label(ath)
    comps=[]
    mmpp=width_in*25.4/a.shape[1]
    for idx,obj in enumerate(ndimage.find_objects(lab),1):
        if obj is None:continue
        cm=lab[obj]==idx
        if cm.sum()<20:continue
        cm=np.pad(cm,2)
        widths=2*ndimage.distance_transform_edt(cm)[skeletonize(cm)]*mmpp
        comps.append({'x':obj[1].start,'min_mm':round(float(widths.min()),4),'median_mm':round(float(np.median(widths)),4)})
    comps.sort(key=lambda c:c['x'])
    for c,l in zip(comps,'ATHLETICS'):c['letter']=l
    true_height=width_in*a.shape[0]/a.shape[1]
    min_width=min(c['min_mm'] for c in comps)
    records.append({'file':name,'sha256':hashlib.sha256((exports/name).read_bytes()).hexdigest(),'pixels':[a.shape[1],a.shape[0]],'alpha_values':np.unique(a[:,:,3]).tolist(),'recorded_print_width_in':width_in,'native_aspect_height_in':round(true_height,6),'effective_ppi':a.shape[1]/width_in,'letter_count':len(comps),'athletics_min_skeleton_thickness_mm':min_width,'athletics_cap_height_mm':round(ath.shape[0]*mmpp,4),'letters':comps,'recorded_old_placement_height_in':saved_height,'if_forced_to_old_height_conservative_thickness_lower_bound_mm':round(min_width*min(1,saved_height/true_height),4)})
result={'date':'2026-09-25','scope':'Read-only audit of existing v3 production PNG masters, not a supplier proof or physical sample. Distance-transform thickness on medial skeleton of each ATHLETICS glyph. Finite raster measurement, not exact vector stroke metrology. Pointed GOOOL wordmark terminals are outside these ATHLETICS measurements and remain a production-proof concern.','source':'https://help.apliiq.com/portal/en/kb/articles/how-to-prepare-artwork-for-transfer-printing','official_guideline':'All font parts at least 2 mm thick; 300 dpi at actual print size; opaque printed pixels; sharp points and fine details can fail.','records':records}
(root/'print-audit.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
