from pathlib import Path
import shutil, hashlib, zipfile
import pymupdf as fitz
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'designs/GOOOL_POD_SAMPLE_PACKET'
OUT=ROOT/'output/pdf/GOOOL_SAMPLE_PACKET_FRONT_ONLY_2026-09-12'
OUT.mkdir(parents=True,exist_ok=True)
TMP=ROOT/'tmp/pdfs'; TMP.mkdir(parents=True,exist_ok=True)
files=sorted(p for p in SRC.rglob('*') if p.is_file() and p.suffix in ('.png','.pdf','.svg') and 'SOUND_OF_VICTORY' not in p.name and 'SPECIFICATIONS' not in p.name)
for p in files:
    dest=OUT/p.relative_to(SRC); dest.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(p,dest)
style=ParagraphStyle('body',fontName='Helvetica',fontSize=10,leading=15,textColor='#202020')
c=canvas.Canvas(str(TMP/'revised-pages.pdf'),pagesize=(612,792))
y=0
def start(title,kicker,num):
    global y
    c.setFillColorRGB(.04,.04,.04); c.rect(0,746,612,46,fill=1,stroke=0)
    c.setFillColorRGB(1,1,1); c.setFont('Helvetica-Bold',10); c.drawString(36,765,'GOOOL / POD SAMPLE SPECIFICATION PACKET')
    c.setFillColorRGB(.3,.3,.3); c.setFont('Helvetica',8); c.drawRightString(576,729,f'REVISION 2026-09-12 / PAGE {num} OF 7')
    c.setFillColorRGB(.78,.07,.13); c.setFont('Helvetica-Bold',10); c.drawString(36,702,kicker)
    c.setFillColorRGB(0,0,0); c.setFont('Helvetica-Bold',23); c.drawString(36,670,title); y=642
def p(text):
    global y
    para=Paragraph(text,style); w,h=para.wrap(540,700)
    assert y-h>60,(y,text)
    para.drawOn(c,36,y-h); y-=h+12
def end():
    c.setFillColorRGB(.3,.3,.3); c.setFont('Helvetica',7)
    c.drawString(36,28,'SAMPLE PRODUCTION ONLY / WRITTEN DIMENSIONS CONTROL / SIZES PENDING')
    c.showPage()
start('Four physical samples only','PRODUCTION SUMMARY',1)
p('<b>Revision:</b> Supersedes the September 1 packet for this sample order. The cap has the approved GOOOL front wordmark only. Both sides and the rear are blank. No slogan embroidery.')
for s in ['01 / Sport-Tek ST720 / Black / front badge DTF / 1 sample / size TBD','02 / Independent IND4000 / Black / front wordmark DTF / 1 sample / size TBD','03 / Bella+Canvas 4810GD / Washed Black / front wordmark DTF / 1 sample / size TBD','04 / OTTO 31-069 / Black/Natural / front wordmark flat embroidery / 1 adjustable sample']:
    p('<b>'+s+'</b>')
p('All three garment backs remain blank. Apply the approved 1 x 1 in black-on-white satin neck label to the garments, subject to confirmed ST720 support. No neck label on the cap.')
p('Use only the named artwork supplied in this revised package. Preserve geometry, colors, negative spaces and the front wordmark underline/red accent. No redraws, substitutions, stretching or portal-generated replacement art.')
p('Center on the physical garment or front-panel axis. Target center deviation: 0.125 in or less; reject beyond +/-0.25 in. Written dimensions control over mockup appearance.')
p('<b>Before ordering:</b> Confirm the three garment sample sizes, exact live blank colors, decoration availability, label support, proofs and total price. Customer fulfillment stays disabled pending physical sample approval.')
end()
start('Approved artwork','ARTWORK CONTROL',2)
p('Production artwork is retained unchanged from the prior packet. Only the cap side-slogan files are excluded from this order package.')
for label,needle,width,height,bg in [('PERFORMANCE TEE BADGE','BADGE_FRONT',105,134,True),('GARMENT WORDMARK','02_IND4000_WORDMARK',230,80,True)]:
    p('<b>'+label+'</b>')
    img=next(a for a in files if needle in a.name)
    c.setFillColorRGB(.08,.08,.08); c.rect(36,y-height-8,270,height+12,fill=1,stroke=0)
    c.drawImage(ImageReader(str(img)),48,y-height,width=width,height=height,mask='auto'); y-=height+25
p('<b>Badge:</b> 5.00 x 6.40 in / 1500 x 1920 px. <b>Garment wordmark:</b> 6.75 x 2.34 in / 2025 x 703 px. Transparent PNG, sRGB, 300 DPI at final physical size.')
p('<b>Colors:</b> print white #FFFFFF; GOOOL red #C61322; dark embroidery thread / label #000000. Cap front maps white source to black thread and retains red.')
p('Preserve internal negative spaces, distressed edge detail, underline gaps and proportions. Apliiq performs machine-specific cap digitization from the supplied front reference; no fabricated DST file is provided.')
end()
start('Front-only coordinating cap','SAMPLE 04',6)
p('<b>Blank:</b> OTTO 31-069 structured seamless five-panel mid-profile cap. Black/Natural. Quantity 1; adjustable one size. 65% polyester / 35% cotton twill; firm buckram front; slightly curved visor; plastic snap.')
p('<b>Decoration:</b> Approved GOOOL wordmark on FRONT ONLY. One flat-embroidery placement; no puff. Both sides and rear must remain completely blank. No slogan or additional lettering.')
img=next(a for a in files if 'FRONT_EMBROIDERY_REFERENCE.png' in a.name)
c.setFillColorRGB(.94,.91,.83); c.rect(36,y-115,540,115,fill=1,stroke=0)
c.drawImage(ImageReader(str(img)),171,y-104,width=270,height=93.6,mask='auto'); y-=135
p('<b>Front files:</b><br/>GOOOL_SAMPLE_04_OTTO31069_WORDMARK_FRONT_EMBROIDERY_REFERENCE.png<br/>GOOOL_SAMPLE_04_OTTO31069_WORDMARK_FRONT_EMBROIDERY_REFERENCE.pdf')
p('<b>Final art:</b> 3.75 in W x 1.30 in H. Center on seamless front-panel axis; bottom artwork edge 0.50 in above visor seam. Reference image above shows artwork, not a placement-scale mockup.')
p('<b>Thread:</b> Black wordmark and underline with red accent nearest #C61322. Preserve approved front geometry. No private neck label on cap.')
p('<b>Tolerance:</b> Target center deviation at most 0.125 in; maximum +/-0.25 in; no visible tilt. Apliiq supplies a front digitized proof before production. Reject puckering, broken letters or red misregistration.')
p('<b>Order note:</b> FRONT ONLY. LEFT SIDE BLANK. RIGHT SIDE BLANK. REAR BLANK. Earlier side-slogan instructions are withdrawn.')
end()
start('Files and sample approval','ORDER MANIFEST',7)
for a in files:
    rel=a.relative_to(SRC)
    p(f'<b>{rel.parent}</b><br/><font size="8">{a.name}</font><br/><font size="8">SHA-256: {hashlib.sha256(a.read_bytes()).hexdigest()[:12]}</font>')
p('<b>Release checks:</b> Owner confirms three garment sizes and live colors. Review garment proofs for scale, placement, blank backs and labels; cap proof must show front only and blank sides/rear. Confirm total price before checkout.')
p('<b>Physical checks:</b> centering, scale, color, sharpness, print feel, embroidery clarity, cap puckering, construction, labels, three-wash shrinkage/durability and ST720 workout comfort. Physical approval required before customer fulfillment.')
end(); c.save()
original=fitz.open(ROOT/'GOOOL_POD_SAMPLE_SPECIFICATIONS.pdf'); revised=fitz.open(TMP/'revised-pages.pdf'); final=fitz.open()
for n in (0,1): final.insert_pdf(revised,from_page=n,to_page=n)
final.insert_pdf(original,from_page=2,to_page=4)
for n in (2,3): final.insert_pdf(revised,from_page=n,to_page=n)
dest=OUT/'GOOOL_POD_SAMPLE_SPECIFICATIONS_FRONT_ONLY.pdf'; final.save(dest)
text='\n'.join(p.get_text() for p in final)
assert 'RIGHT_SIDE' not in text and 'right-side slogan' not in text
for i,page in enumerate(final): page.get_pixmap(matrix=fitz.Matrix(1,1)).save(TMP/f'front-only-{i+1}.png')
(OUT/'README.txt').write_text('CURRENT SAMPLE ORDER PACKET - 2026-09-12\nSupersedes the September 1 packet. Cap: approved front GOOOL wordmark only; both sides and rear blank. Side slogan files intentionally excluded.\nThree garment sample sizes remain TBD. No order has been placed.\nGarment specifications on pages 3-5 are retained unchanged from the original packet.\n',encoding='utf-8')
with zipfile.ZipFile(OUT.with_suffix('.zip'),'w',zipfile.ZIP_DEFLATED) as z:
    for a in OUT.rglob('*'):
        if a.is_file(): z.write(a,a.relative_to(OUT.parent))
print(dest); print(OUT.with_suffix('.zip'))
