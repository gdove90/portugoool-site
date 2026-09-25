from pathlib import Path
import json,hashlib
import numpy as np
from PIL import Image
from scipy import ndimage
from skimage.morphology import skeletonize
root=Path(__file__).resolve().parent
spec=json.loads((root/'master-spec.json').read_text())
a=np.array(Image.open(root/'exports'/spec['file']).convert('RGBA'))
ppmm=600/25.4
letters=[]
for b in spec['boxes']:
    m=a[b['top']:b['top']+b['height'],b['left']:b['left']+b['width'],3]>127
    m=np.pad(m,2)
    dt=ndimage.distance_transform_edt(m)
    widths=2*dt[skeletonize(m)]/ppmm
    rec={'letter':b['letter'],'min_skeleton_stroke_mm':float(widths.min()),'median_stroke_mm':float(np.median(widths))}
    if b['letter']=='A':
        holes=ndimage.binary_fill_holes(m)&~m
        lab,n=ndimage.label(holes)
        rec['enclosed_counter_count']=n
        if n!=1:raise RuntimeError('A must have exactly one enclosed counter')
        ys,xs=np.where(holes)
        rec['counter_width_mm']=(xs.max()-xs.min()+1)/ppmm
        rec['counter_height_mm']=(ys.max()-ys.min()+1)/ppmm
        rec['counter_area_mm2']=int(holes.sum())/(ppmm*ppmm)
        rec['counter_max_inscribed_diameter_mm']=float(2*ndimage.distance_transform_edt(holes).max()/ppmm)
    letters.append(rec)
minimum=min(x['min_skeleton_stroke_mm'] for x in letters)
record={'file':spec['file'],'widthIn':spec['widthIn'],'heightIn':spec['heightIn'],'dpi':600,'alphaValues':np.unique(a[:,:,3]).tolist(),'athleticsMinMeasuredStrokeMm':minimum,'letters':letters,'nativeAspectOnly':True,'apliiqUploaded':False,'method':'Independent raster distance-transform measurements on padded glyph medial skeletons. ATHLETICS uses clean vector centerlines with round joins/caps: A 2.5 mm, most glyphs 2.8 mm, I 3.0 mm. Existing overall lettering proportions guide the new layout. These are nominal artwork checks, not physical proof.','guidelineUrl':'https://help.apliiq.com/portal/en/kb/articles/how-to-prepare-artwork-for-transfer-printing','note':'Keep 3.25 x 1.235 inches. Do not squash to old 1.11-inch height. GOOOL wordmark pointed tips remain unchanged and require supplier proof.'}
(root/'print-audit.json').write_text(json.dumps(record,indent=2))
print(json.dumps(record,indent=2))
if minimum<2:raise RuntimeError('Measured lettering below 2 mm: '+str(minimum))
