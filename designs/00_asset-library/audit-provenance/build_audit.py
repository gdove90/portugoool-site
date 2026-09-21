from pathlib import Path
from collections import defaultdict,Counter
from datetime import datetime,timezone
import json,hashlib,shutil,zipfile,re,os
from PIL import Image

ROOT=Path('C:/Users/gdove/OneDrive/Desktop/GOOOL')
WORK=Path(__file__).resolve().parent
STAGE=WORK/'staged'
LIB='designs/00_asset-library'
V2='designs/apliiq-upload-packages-2026-09-21-v2'
ARCH='designs/_archive/artwork-audit-2026-09-21'
NOW=datetime.now(timezone.utc).isoformat()
MOVES={
 'designs/apliiq-upload-packages-2026-09-21':ARCH+'/apliiq-upload-packages-v1',
 'designs/launch-image-package-2026-09-21':ARCH+'/launch-image-package-original',
}
def sha(data):return hashlib.sha256(data).hexdigest()
def read(rel):return (ROOT/rel).read_text(encoding='utf-8-sig')
def jread(rel):return json.loads(read(rel))
def write(rel,data):
 if isinstance(data,str) and rel.endswith('.md'):
  for a,b in {'all64catalog':'all 64 catalog','All64 catalog':'All 64 catalog','all14':'all 14','All14':'All 14','Current14':'Current 14','current14':'current 14','currentv2':'current v2','10active':'10 active','14colorways':'14 colorways','10products':'10 products','64catalog':'64 catalog','54inactive':'54 inactive','original1254':'original 1254','target9in':'target 9in','saved11in':'saved 11in','crew6112046':'crew 6112046','crewneck6112046':'crewneck 6112046','design6112046':'design 6112046','dated2026':'dated 2026','ASColour5150':'AS Colour 5150','AS Colour5150':'AS Colour 5150'}.items():data=data.replace(a,b)
 p=STAGE/rel;p.parent.mkdir(parents=True,exist_ok=True)
 p.write_bytes(data if isinstance(data,bytes) else data.encode('utf8'))
def jsave(rel,data):write(rel,json.dumps(data,indent=2,ensure_ascii=False)+'\n')
def dest(rel):
 if rel.startswith(V2+'/archives/') and rel.endswith('.zip'):return ARCH+'/pre-audit-v2-zips/'+Path(rel).name
 for old,new in MOVES.items():
  if rel==old or rel.startswith(old+'/'):return new+rel[len(old):]
 return rel
def final_bytes(rel):
 p=STAGE/rel
 return p.read_bytes() if p.is_file() else (ROOT/rel).read_bytes()
def paths(pattern):return sorted(p.relative_to(ROOT).as_posix() for p in ROOT.glob(pattern) if p.is_file())

inventory=json.loads((WORK/'inventory.json').read_text())['files']
original_paths={r['path'] for r in inventory}
# Include visual QA derivatives outside designs, extensionless PNG, and editable design documents.
extras=paths('tmp/**/*.png')+paths('tmp/**/*.pdf')+paths('designs/**/*.dc.html')
extras+=['designs/GOOOL_POD_SAMPLE_PACKET/second colorway first capsule']
for rel in extras:
 if rel in original_paths:continue
 p=ROOT/rel;data=p.read_bytes();r={'path':rel,'sha256':sha(data),'bytes':len(data),'extension':p.suffix.lower()}
 if data.startswith(b'\x89PNG'):
  with Image.open(p) as im:
   r.update(pixels=list(im.size),mode=im.mode)
   if 'A' in im.getbands():r['alpha_bbox']=im.getchannel('A').getbbox();r['solid_bbox']=im.getchannel('A').point(lambda a:255 if a>=128 else 0).getbbox()
  if not p.suffix:r['detected_type']='PNG with missing file extension; concept reference'
 inventory.append(r)
by_path={r['path']:r for r in inventory}
groups=defaultdict(list)
for r in inventory:groups[r['sha256']].append(r)

def role(rel):
 s=rel.lower()
 if s.endswith('.zip'):return 'delivery_archive_not_master'
 if '/apliiq-upload-packages-' in s and '/production-assets/' not in s:return 'delivery_copy_or_snapshot'
 if '/production-assets/' in s and '/apliiq-' in s:return 'source_derived_proof_candidate'
 if s.startswith('tmp/'):return 'qa_render_not_master'
 if '/project/' in s or '/design_handoff_' in s:return 'historical_editable_handoff' if s.endswith('.dc.html') else 'historical_handoff_mirror'
 if '/templates/' in s:return 'supplier_template_not_brand_art'
 if '/reference' in s or '/15_reference/' in s:return 'reference_only'
 if s.startswith('public/products/') or any(v in s for v in ['/mockup','/model_shots/','/model-mockups/','/17_launch_imagery/','/launch-image-package','/individual_mockups/']):return 'mockup_or_gallery_reference'
 if 'approved-tag-concept' in s or 'tag-concept' in s:return 'tag_concept_reference'
 if '/print_masters/' in s or '/production/' in s or '/finals/' in s or '/public/print/' in '/'+s or '_artwork/' in s:return 'print_or_embroidery_artwork_candidate'
 if '/12_logos/' in s or '/logos/' in s or s.startswith('public/brand/'):return 'logo_source_or_variant'
 if s.endswith('.pdf'):return 'historical_specification_reference'
 return 'design_or_reference_asset'
def score(r):
 s=r['path'];n=0
 if s.startswith('designs/12_logos/svg/'):n-=70
 if '/finals/' in s:n-=60
 if '/print_masters/' in s:n-=50
 if '/GOOOL_POD_SAMPLE_PACKET/' in s:n-=45
 if '/production/' in s:n-=35
 if '/apliiq-upload-packages-' in s:n+=100
 if '/project/' in s or '/design_handoff_' in s:n+=90
 if '/launch-image-package-' in s:n+=75
 if s.startswith('output/') or s.startswith('tmp/'):n+=70
 if s.startswith('public/products/'):n+=50
 if s.startswith('public/print/'):n+=25
 if s.startswith('public/brand/'):n-=80
 if s.startswith('designs/17_launch_imagery/'):n-=20
 return n,len(s),s
registry=[]
for h,rows in sorted(groups.items()):
 chosen=min(rows,key=score)
 quality='Highest pixel count is not proof of original detail. Use family instructions and preserve palette, geometry and placement.'
 if chosen.get('pixel_run_trace'):quality='Raster-derived pixel-run trace, not a recovered smooth vector; no new source detail.'
 elif chosen['extension']=='.svg':quality='SVG container; check embedded raster, live text and provenance. Extension alone does not establish native-vector quality.'
 registry.append({'asset_id':'sha256:'+h,'sha256':h,'canonical_file':dest(chosen['path']),'role':role(chosen['path']),'metadata':{k:v for k,v in chosen.items() if k!='path'},'quality_note':quality,'aliases':[{'path':dest(r['path']),'role':role(r['path'])} for r in rows if r is not chosen]})

def records(items):
 result=[]
 for p in sorted(set(items)):
  if p not in by_path:
   if not (ROOT/p).is_file():raise RuntimeError('Missing curated source '+p)
   data=(ROOT/p).read_bytes();r={'sha256':sha(data),'bytes':len(data)}
  else:r=by_path[p]
  result.append({'path':dest(p),'sha256':r['sha256'],'pixels':r.get('pixels'),'role':role(p)})
 return result

families=[]
def family(fid,title,sources,notes,status='existing_artwork_supplier_proof_required',references=()):
 families.append({'id':fid,'title':title,'status':status,'selected_files':records(sources),'reference_files':records(references),'instructions':notes,'manufacturing_approved_by_this_audit':False})

family('navigation','Current navigation GOOOL', ['public/brand/goool-wordmark-white.png'],
 ['Exact current navigation lettering with three Os and three separate white/red/white underline segments. Do not replace with Anton legacy wordmarks or GOL artwork.', '720x250 raster authority for this specific navigation geometry. A larger crest shoulder wordmark is a related variant, not automatically pixel-identical.'])
family('label','GOOOL Athletics standard brand label',paths(V2+'/production-assets/GOOOL-ATHLETICS-LABEL*.svg')+paths(V2+'/production-assets/GOOOL-ATHLETICS-LABEL*.png'),
 ['Approved-tag-concept.png remains the owner-approved visual concept. The flat SVG/PNG is a later composition candidate, not an exact reproduction or a recovered original vector.', 'Flat composition traces navigation PNG at alpha>=128 and uses ATHLETICS from the GA-03-F lower band. Spacing and edges need comparison against the approved concept.', 'Black background, white current navigation GOOOL, three white/red/white segments, white spaced ATHLETICS underneath. Nominal 1x1in; 2in file is an alternative for review, not an approved size change.', 'Confirm actual-size lettering, red detail, attachment and per-blank compatibility. Historical shield/satin-label directions are superseded. Cap interior branding requires a compatible method.'], 'derived_layout_candidate_not_manufacturing_approved', ['designs/goool-athletics-brand-label/approved-tag-concept.png','public/brand/goool-wordmark-white.png'])
family('core-capsule','First Capsule original product-specific artwork',
 [p for p in paths('designs/GOOOL_POD_SAMPLE_PACKET/*_Artwork/*') if (p.endswith('.png') or p.endswith('.pdf')) and 'PRIVATE_LABEL' not in p and 'SOUND_OF_VICTORY' not in p],
 ['Keep exact original product upload geometry/palette. Hoodie and casual white/red wordmark files are byte-identical: one shared design with two intentional package filenames.', 'ST720 crest front 5in; hoodie/4810GD front wordmark 6.75in; OTTO31-069 front flat embroidery 3.75in. Preserve the placement targets in the current v2 spec. Garment backs blank; cap sides/rear blank.', 'The 2026-09-12 front-only PDF supersedes cap-slogan directions in both older sample PDFs. Even the front-only PDF has an obsolete shield neck-label instruction; use current Athletics label direction.', 'Large crest-v2 files remain available in their own family. They do not silently replace palette-specific sample uploads.'],references=['output/pdf/GOOOL_SAMPLE_PACKET_FRONT_ONLY_2026-09-12/GOOOL_POD_SAMPLE_SPECIFICATIONS_FRONT_ONLY.pdf'])
for fid,title,prefix in [('modern','Modern Sport cotton and performance','GA-01'),('varsity','Athletics Varsity','GA-02'),('minimal','Athletics Minimal Club','GA-03')]:
 selected=paths('designs/16_goool_athletics/print_masters/'+prefix+'*.png')
 if fid=='modern':selected=paths('designs/16_goool_athletics/print_masters/upload/'+prefix+'*CLEAN.png')
 notes=['Keep front and back as separate placements and preserve original colors and aspect ratios. Full raster print artwork; do not replace with crops from model imagery.']
 if fid=='modern':notes+=['CLEAN files are selected delivery candidates; the first GA-01 originals remain archived as source alternatives, not deleted. Same 3300x1118 / 975x333 pixel sizes, no resolution gain claimed.','BC3010 cotton and ST720 performance are separate products. Cotton front target 11in. Performance v2 target is 9in but saved-design notes report 11in: unresolved production-scale discrepancy; compare a dimensioned proof before accepting either as approved.']
 family(fid,title,selected,notes,references=paths('designs/16_goool_athletics/print_masters/'+prefix+'*.png'))
family('circular','Athletics circular wordmark — all 12 concepts', ['designs/16_goool_athletics/logos/GOOOL_ATHLETICS_CIRCULAR_WORDMARK_1254px.png'],
 ['1254x1254 original raster is the shape source. The occupied alpha>=128 area is 924x934px. Retain original proportions; do not force a square silhouette.', 'New navy/forest SVGs are threshold-128 pixel-run traces and recolors. Their 600ppi PNGs add sampling, not source detail: 308 source samples/in at 3in wide; 369.6 at 2.5in.', 'The old 900/750px colored files include padding. A 3in canvas on the 900px file gives only about 2.24in visible art. New tight exports are proof candidates, not approved replacements based on file age.', 'Concept08 left-chest Ivory tee and concept09 centered gray crew are active. Other ten circular concepts are retained unlaunched. Width/placement/supplier proof is still required.'], references=paths(V2+'/production-assets/GA-CIRCLE*')+paths('designs/16_goool_athletics/print_masters/upload/GA-CIRCLE*.png')+paths('designs/16_goool_athletics/circular_logo/individual_mockups/*'))
family('crest-v2','GOOOL football crest v2 and future shield badge', paths('designs/12_logos/badge/goool-crest-v2/GOOOL_Crest_*Transparent.png')+paths('designs/12_logos/badge/goool-crest-v2/GOOOL_Crest_OneColor*.png'),
 ['3566x4500 transparent variants are the largest located rasters in this family. Original-detail provenance is unverified; rough extraction edges remain. Do not certify them as native 4500px detail or assume size alone improves an existing upload.', 'Approved white-background PNG governs the historical visual. Working_Vector_Trace.svg is an automated working trace and does not replace it.', 'The saved 300x300 future shield is a small monochrome variant/reference, not the highest-resolution full-color master. Preserve this future design; never use it as the current standard label.'],references=paths('designs/12_logos/badge/goool-crest-v2/*')+paths('designs/goool-badge-future-designs/*.png'))
family('gol-trophy','GOL trophy crest', paths('designs/12_logos/badge/gol-trophy-v1/*4500*.png'),
 ['GOL is a distinct three-letter design; do not correct it to GOOOL. Preserve approved, flat, one-color, and working-trace roles.', 'Large rasters and traced SVGs are not evidence of recovered native vector detail. Compare vendor tracing against the original approved transparent reference.'],references=paths('designs/12_logos/badge/gol-trophy-v1/*'))
family('legacy-vectors','Legacy wordmarks, monograms and crest v1',paths('designs/12_logos/svg/*.svg')+paths('designs/12_logos/badge/goool-crest-v1/*crest*.png'),
 ['PORTUGOOOL, tall Anton GOOOL, extended GOOOL, GOL, echo monograms and crest-v1 are distinct design families. Do not merge based on similar names.', 'Native path assets are preferable for their own geometry; trace/raster/text flags are recorded in UNIQUE-ASSETS.json. Check live fonts before manufacturing.', 'GOL gold #B18844 and country-cap gold #C9A227 are intentional family-specific palettes. Do not globally recolor them to the current navigation palette.'],references=paths('designs/12_logos/badge/*.*'))
family('jerseys','Portugal and England jerseys — 7 products',paths('designs/05_jerseys/finals/*.png'),
 ['Select all 21 finals: front/back/sleeves for each of seven jerseys. Keep full-bleed panel dimensions, do not trim as isolated chest logos.', 'Drop01 finals backs fix a serif-font fallback in the old handoff. Finals override handoff_echo-apparel backs; public/print copies are runtime aliases.', 'Historical Printful templates are not automatically suitable for an Apliiq blank. Re-map cut/sew panels only after the actual supplier template is verified.'])
family('legacy-tees','Portugal, England and GOL tees — 15 products',paths('designs/06_tshirts/finals/*.png'),
 ['Select final front/back pairs where supplied; Portugal six tees have front files only. Preserve canvas placement and intended empty areas.', 'GOL G1–G5 and England ET1–ET4 use their own graphics and palettes. No generic navigation-logo substitution. Public/print duplicates remain for website dependencies.'])
family('crest-tees','Crest Statement tees — 3 product specs', paths('designs/06_tshirts/handoff_crest_v2/production/*'),
 ['SKU-1c CREAM, 1d FADEDBLACK, 1e FADEDNAVY are the three actual spec files, all CC75 center-front 7.5in. Older prose mentioning six SKUs and other placements is not a catalog instruction.', 'Use the named SKU spec for front/back/hem URL placement; do not apply this garment’s back marks to core ST720 or 4810GD.', 'Separate isolated art from Printful full-area templates. Transparent-canvas dimensions are not visible artwork dimensions.'],references=paths('designs/06_tshirts/handoff_crest_v2/specs/*.md'))
family('oval','GOOOL Oval tee',paths('designs/06_tshirts/oval-tee/production/*'),
 ['Preserve isolated front/back artwork separately from printarea-front/back templates. They have different canvas placements and are not interchangeable duplicate files.', 'Use correct cream/charcoal contrast for the specific garment. Supplier placement proof is required.'])
family('ga-ua','GA shield embroidery — Under Armour concept',paths('designs/06_tshirts/athletics-tee/source/*')+paths('designs/06_tshirts/athletics-tee/production/*'),
 ['UA1383264 embroidery is separate from A4N3142 printed concept tees. Spec requests one-color 2.5x2.75in left-chest embroidery.', 'Retain large shield raster source and small upload exports. The spec requests SVG/PDF/EPS masters, but a matching native vector trio has not been located; do not claim this requirement is complete.', 'Supplier digitization and monogram/negative-space proof required.'],references=['designs/06_tshirts/athletics-tee/specs/GA-BADGE-EMBROIDERY-UA-SPEC.md'])
family('a4-concepts','A4 athletic tee concepts — navy wordmark and black shield',paths('designs/06_tshirts/athletics-tee/reference/*'),
 ['Concepts refer to A4N3142, distinct from current Sport-Tek ST720 and Under Armour embroidery. Isolated final front/back files and exact placement specs are not fully located.', 'Do not manufacture from model/mockup crops or substitute UA embroidery artwork for a full printed A4 concept.'], 'concept_only_missing_complete_print_package',references=['designs/06_tshirts/athletics-tee/README.md'])
family('heavy-core','Heavy Core hoodies — 2 programs, 6 unlaunched looks',paths('designs/07_hoodies/heavy-core/production/*.png'),
 ['Lane Seven LS17001 is a separate unlaunched blank, not current IND4000. Preserve GA embroidery and Oval front/back programs.', 'H04 black Oval mockup is NONCONFORMING: back G is pictured on hood. Tech pack requires upper back BODY, 2.75in below hood seam. Do not execute hood placement.', 'Tech pack and asset_manifest govern historical artwork sizes. Current supplier availability, mapping, pricing and physical samples remain unverified.'],references=paths('designs/07_hoodies/heavy-core/specs/*.pdf')+paths('designs/07_hoodies/heavy-core/mockups/*.png'))
family('country-caps','Country caps — historical embroidery designs',paths('public/print/drop02/cap-*.png'),
 ['Front, country side-shield and back files are separate placements. Country caps retain their own side marks; the Touchline no-side-slogan decision does not delete these designs.', 'country-cap-guidelines.md refers to scratchpad logogen/gen-country-caps.js, which is absent from GOOOL. Existing PNG exports and extended-wordmark SVGs are retained; regeneration is not currently reproducible from that missing script.', 'The catalog includes Netherlands White while guidelines only list Navy and discuss an unavailable Orange proposal. Use actual catalog-specific files; verify supplier swatch rather than inventing an Orange SKU.', 'Embroidery PNGs are artwork references, not production digitization files. Confirm each colorway and back-art contrast; do not infer variant IDs.'],references=['designs/07_accessories/hats/country-cap-guidelines.md'])
family('gol-caps','GOL and GOOOL caps with legacy side slogans',paths('public/print/gol/cap-*.png'),
 ['Separate GOL/GOOOL and gold/ink front designs. Side slogans are retained as distinct historical variants; do not add them to current Touchline cap.', 'Per-product side-slogan/blank mapping requires its specific historical spec; the existence of a side file does not authorize it on every cap.'])
family('accessory-concepts','Scarf, original cap, stickers and terrace flag', [p for p in paths('public/products/*.svg') if any(t in p for t in ['scarf','goool-cap.svg','sticker','flag'])],
 ['Catalog/mockup concept assets retained. Complete supplier-ready artwork, manufacturing templates and per-variant specs have not been located; do not claim ready for Apliiq.'], 'concept_only_missing_complete_print_package')
family('launch-imagery','Current gallery concept selections',paths('designs/17_launch_imagery/*.png')+paths('designs/17_launch_imagery/**/*.png'),
 ['asset-manifest.json selects the intended gallery revisions. Earlier v1/v2 alternates are reference history, not competing print masters.', 'Current catalog is 10 products/14 colorways; the older gallery manifest was authored for 9/13 and is not the product roster.', 'Generated images are concept references. Verify garment silhouette, print position and colors against supplier proofs/physical samples. Never extract manufacturing artwork from them.'], 'concept_gallery_not_print_artwork',references=['designs/17_launch_imagery/asset-manifest.json'])

products=json.loads((WORK/'all-products.json').read_text())
jersey_prefix=['jersey-01-casa-red','jersey-02-marfim-white','jersey-03-noite-black','jersey-04-emerald-green','jersey-E1-home-white','jersey-E2-away-red','jersey-E3-navy']
tee_prefix=['brush-script-tee','goool-tee','vamos-tee','lisbon-to-the-world-tee','match-day-tee','we-dont-whisper-goals-tee','tee-ET1-echo-hero','tee-ET2-london','tee-ET3-moment','tee-ET4-roar','tee-G1-clean-sheet','tee-G2-gold-standard','tee-G3-concrete','tee-G4-concrete-white','tee-G5-concrete-black']
active_family={'goool-performance-tee':'core-capsule','goool-heavyweight-hoodie':'core-capsule','goool-heavyweight-casual-tee':'core-capsule','goool-touchline-cap':'core-capsule','goool-athletics-modern-sport-tee':'modern','goool-athletics-modern-sport-performance-tee':'modern','goool-athletics-varsity-tee':'varsity','goool-athletics-minimal-club-tee':'minimal','goool-athletics-circular-badge-tee':'circular','goool-athletics-circular-center-crewneck':'circular'}
vindex=jread(V2+'/CATALOG-INDEX.json')
reconciliation=jread('designs/11_fulfillment/apliiq-reconciliation.json')
for e in vindex['packages']:
 row=next(x for x in reconciliation['rows'] if x['slug']==e['slug'] and x['color']==e['website_color'])
 e['source_reported_design_id']=row['saved_design_id'];e['source_reported_status']=row['status']
prows=[]
for i,p in enumerate(products):
 slug=p['slug']; candidates=[]; issues=[]
 if p['isActive']:
  fid=active_family[slug]
  pkgs=[e for e in vindex['packages'] if e['slug']==slug]
  for e in pkgs:
   sp=jread(V2+'/'+e['spec'])
   candidates+=[V2+'/'+str(Path(e['spec']).parent).replace('\\','/')+'/'+a['path'] for a in sp['decoration']['artwork']]
 elif i<7:fid='jerseys';candidates=paths('designs/05_jerseys/finals/'+jersey_prefix[i]+'*.png')
 elif i<22:fid='legacy-tees';candidates=paths('designs/06_tshirts/finals/'+tee_prefix[i-7]+'*.png')
 elif slug.startswith('crest-statement'):fid='crest-tees'
 elif slug=='goool-oval-tee':fid='oval'
 elif slug in ['supporters-scarf','goool-cap','sticker-pack','terrace-flag']:fid='accessory-concepts';issues=['Complete manufacturing artwork and supplier package not located.']
 elif slug in ['gol-cap-black','gol-cap-white','goool-cap-black','goool-cap-white']:
  fid='gol-caps';mark='gol' if slug.startswith('gol-') else 'goool';color='gold' if slug.endswith('black') else 'ink';candidates=paths('public/print/gol/cap-'+mark+'-'+color+'.png');issues=['Exact side-slogan pairing requires historical product spec; do not choose by filename similarity.']
 else:
  fid='country-caps'
  codes={'england':'eng','argentina':'arg','italy':'ita','netherlands':'ned','germany':'ger','belgium':'bel','norway':'nor','spain':'esp','france':'fra'}
  if slug=='goool-england-cap':candidates=['public/print/drop02/cap-goool-england-front.png'];issues=['Original England cap is distinct from later three-color country system; verify exact side/back spec.']
  else:
   country=next(k for k in codes if k in slug);code=codes[country];color=slug.rsplit('-',1)[-1]
   candidates=['public/print/drop02/cap-'+code+'-front-'+color+'.png','public/print/drop02/cap-'+code+'-side-shield.png'];issues=['Back-art selection and exact supplier color/placement require individual proof.']
 if not candidates and fid not in ['accessory-concepts','a4-concepts']:candidates=[r['path'] for f in families if f['id']==fid for r in f['selected_files']]
 f=next(f for f in families if f['id']==fid)
 prows.append({'product_id':p['id'],'slug':slug,'name':p['name'],'catalog_active':p['isActive'],'family':fid,'artwork_files':records(candidates),'package_specs':[V2+'/'+e['spec'] for e in vindex['packages'] if e['slug']==slug], 'status':f['status'],'open_items':issues,'manufacturing_approved_by_this_audit':False})

conflicts=[
 {'id':'C01','state':'resolved_instruction','issue':'Older sample PDFs authorize Touchline right-side slogan.','resolution':'Current Touchline front-only; both sides and rear blank. Preserve old files as history.'},
 {'id':'C02','state':'resolved_instruction','issue':'Old shield/satin private label competes with approved Athletics concept.','resolution':'Current brand tag is navigation GOOOL plus 3-segment line and ATHLETICS on black. Shield badge retained only as future design; flat tag is a later proof candidate.'},
 {'id':'C03','state':'resolved_provenance','issue':'New circular SVG/600ppi PNG could be mistaken for a higher-quality original.','resolution':'Original 1254px raster remains shape authority; newer outputs are threshold-128 derivatives with 308/369.6 effective source samples per inch.'},
 {'id':'C04','state':'supplier_proof_required','issue':'Circular 3in old padded canvas does not equal 3in visible artwork.','resolution':'Use current visible-width target and preserved aspect ratio; compare new tight derivative to original before approval. Saved design needs dimensional review.'},
 {'id':'C05','state':'supplier_proof_required','issue':'Modern Sport performance package target9in conflicts with source-reported saved11in.','resolution':'Keep discrepancy explicit. Obtain matching dimensioned proof against intended mockup; neither width is certified as owner-approved by this audit.'},
 {'id':'C06','state':'resolved_owner_policy_supplier_swatch_pending','issue':'Gray Heather vs supplier Athletic Heather for AS Colour5150.','resolution':'Use closest offered supplier color on same blank. Athletic Heather candidate; record exact supplier swatch/name/variant. No blank substitution.'},
 {'id':'C07','state':'resolved_scope','issue':'Old9products/13colorways and sixCrestSKU prose.','resolution':'Current catalog10/14; all64products indexed. Crest Statement has3 actual SKU specs. Historical gallery counts do not govern roster.'},
 {'id':'C08','state':'resolved_source_selection','issue':'Drop01 original handoff back has font-fallback defect.','resolution':'Select designs/05_jerseys/finals backs which document Anton repair; keep fullbleed panels and originals.'},
 {'id':'C09','state':'resolved_reference_classification','issue':'H04 HeavyCore mockup shows backG on hood.','resolution':'Mockup is nonconforming. Historical techpack requires upper back body, not hood.'},
 {'id':'C10','state':'resolved_scope','issue':'Different GOL/GOOOL/PORTUGOOOL, color palettes and blanks might be merged.','resolution':'Separate families retained; native artwork chosen only within exact design family. Countrycap side marks are not affected by Touchline decision.'},
 {'id':'C11','state':'missing_source','issue':'Countrycap generator and GA requested nativeSVG/PDF/EPS master trio absent.','resolution':'Retain existing best-known exports; do not claim reproducible/native-vector package complete.'},
 {'id':'C12','state':'missing_package','issue':'Accessory/A4 concepts lack complete isolated production artwork/specs.','resolution':'Keep concept-only status in product/family inventory; no invented finished artwork or supplier mapping.'},
 {'id':'C13','state':'supplier_proof_required','issue':'Large crest rasters/working traces and flat label not independently verified as source-quality manufacturing masters.','resolution':'Preserve approved visual references and source variants; actual-size edge, spacing, palette and manufacturing proof required.'},
]

report=f'''# GOOOL artwork audit — 2026-09-21

Audited {len(inventory)} artwork, archive, QA and editable design files: {len(groups)} unique byte sequences and {sum(len(v)>1 for v in groups.values())} groups with identical copies. The initial binary-art inventory was 1,410 files; this expanded audit also includes temporary QA images/PDFs, editable .dc.html sources and an extensionless PNG. All 64 catalog products are mapped: 10 active and 54 inactive. Uncatalogued Heavy Core, A4, circular and logo concepts are retained by family.

No artwork was redrawn, resampled, recolored or deleted during this audit. Exact duplicate copies are identified by SHA-256. Similar-looking but different palettes, aspect ratios, crops or canvas placements are not treated as duplicates. Product-site copies and self-contained supplier packages are intentional copies.

## What changed

- One unique-file registry and family-aware source index now distinguish originals, working traces, upload candidates, templates and mockups.
- Superseded v1 upload handoff and the earlier launch-image package moved into a clearly marked archive. Redirects remain at their old entry points.
- Every current v2 garment package and ZIP includes this audit's provenance and instruction corrections. Artwork bytes remain unchanged. Pre-audit v2 ZIPs are retained as historical exports.
- Current entry points identify the label, cap, counts, source-quality and unlaunched-design exceptions. Older prose/PDFs remain available as historical evidence.

## Source quality findings

The newer circular SVGs are raster-derived pixel-run traces, not native vector originals. The 600ppi exports contain no added source detail. The source occupies 924x934px at alpha>=128, corresponding to 308 samples/in at 3in width and 369.6 at 2.5in width.

The flat label is a newly assembled candidate using navigation geometry and the ATHLETICS lettering from GA-03-F. It is not an exact recovery of the approved tag concept. Nominal 1in lettering is very small; compare layout and actual-size supplier proof before approving it. Keep both original visual approval and derivative provenance.

The 3566x4500 crest rasters are the largest found variants; their original-detail provenance is not established. Automated working SVG traces and a 300px archived badge do not supersede the approved crest reference. Existing native path logos remain useful for their own distinct families, not as lookalike substitutions.

## Current unresolved items

Modern Sport performance target9in vs saved11in; circular visible scale; flat-tag layout/manufacturing proof; crest edge/source provenance; missing GA native-vector trio and countrycap generator; incomplete A4/accessory production packages. These are explicitly recorded in CONFLICT-REGISTER.json. This audit resolves file authority and known instruction conflicts; it does not claim these manufacturing questions are settled.

Archive retention is deliberate. No unique original is discarded to reduce the file count, and no customer-production approval is inferred from a filename such as FINAL, MASTER or CLEAN.
'''
write(LIB+'/AUDIT-REPORT.md',report)
jsave(LIB+'/UNIQUE-ASSETS.json',{'schema':'1.0','audited_at_utc':NOW,'project_root':str(ROOT),'selection_scope':'One canonical location per byte-identical group, not a claim that every asset is approved production art. Family instructions govern use.','assets':registry})
jsave(LIB+'/MASTER-ARTWORK-INDEX.json',{'schema':'1.0','audited_at_utc':NOW,'families':families})
jsave(LIB+'/ALL-PRODUCTS.json',{'catalog_source':'src/lib/products.ts','catalog_sha256':sha((ROOT/'src/lib/products.ts').read_bytes()),'active_count':10,'inactive_count':54,'products':prows})
jsave(LIB+'/CONFLICT-REGISTER.json',conflicts)
jsave(LIB+'/INVENTORY-BEFORE.json',{'root':str(ROOT),'files':inventory})
jsave(LIB+'/DUPLICATE-GROUPS.json',[{'sha256':h,'bytes_each':v[0]['bytes'],'canonical_file':dest(min(v,key=score)['path']),'paths':[dest(r['path']) for r in v]} for h,v in groups.items() if len(v)>1])
write(LIB+'/START-HERE.md',f'''# GOOOL artwork — start here

This is the current file-authority index for all launched and unlaunched designs. Files remain in their original design folders; this index selects and explains them without making another copy of every image.

1. [Human-readable artwork families](ARTWORK-FAMILIES.md): best-known source and upload candidate for each design family, with quality limits.
2. [All64 catalog products](ALL-PRODUCTS.md): 10 active /54 inactive; source files, package links and missing work.
3. [Current14 Apliiq packages](../apliiq-upload-packages-2026-09-21-v2/START-HERE.md): each package/ZIP carries the audit addendum.
4. [Audit findings](AUDIT-REPORT.md) and [conflict register](CONFLICT-REGISTER.json).
5. [Unique-file registry](UNIQUE-ASSETS.json), [duplicate groups](DUPLICATE-GROUPS.json) and [machine-readable master index](MASTER-ARTWORK-INDEX.json).
6. [Claude handoff](CLAUDE-ARTWORK-HANDOFF.md).

Choose within the exact design family. Original visual approval, source geometry and proofed production artwork are different roles. Newer/larger files and SVG extensions do not automatically mean better source quality. Keep the first originals and use the original source geometry/palette unless a documented approved correction exists.

The superseded handoffs live in [the archive](../_archive/artwork-audit-2026-09-21/README.md). Do not upload historical ZIPs. Older general brand rules do not override the current navigation-based Athletics label or family-specific GOL/Portugal/England artwork. Do not crop a mockup to make a production master.
''')
def link(rel):return '../../'+rel
lines=['# Artwork families','', 'Each selection is family-specific. “Selected” means best-known source/candidate located, not automatic production approval.','']
for f in families:
 lines+=['## '+f['title'],'','Status: `'+f['status']+'`.','']+['- '+s for s in f['instructions']]+['']
 for r in f['selected_files']:
  px=(' — '+'×'.join(map(str,r['pixels']))+'px') if r['pixels'] else ''
  lines+=['- ['+Path(r['path']).name+']('+link(r['path'])+')'+px]
 if not f['selected_files']:lines+=['- No complete isolated production file was located; consult references in the JSON index.']
 lines+=['']
write(LIB+'/ARTWORK-FAMILIES.md','\n'.join(lines)+'\n')
lines=['# All catalog products','', '64 records: 10 active, 54 inactive. Other unlaunched concepts are in ARTWORK-FAMILIES.md. Active means catalog membership, not approved for manufacture.','']
for p in prows:
 lines+=['## '+p['name'],'',f"`{p['slug']}` · {'Active' if p['catalog_active'] else 'Inactive / retained'} · family `{p['family']}`",'']
 for q in p['package_specs']:lines+=['- [Current colorway specification]('+link(q)+')']
 for q in p['artwork_files']:lines+=['- ['+Path(q['path']).name+']('+link(q['path'])+')']
 lines+=['- '+s for s in p['open_items']]+['']
write(LIB+'/ALL-PRODUCTS.md','\n'.join(lines)+'\n')

addendum='''# Artwork authority addendum — 2026-09-21

Read this before interpreting older reference PDFs or filenames. This addendum corrects provenance and instruction scope; it does not change approved artwork bytes.

- Keep the original print source. A newer SVG or 600ppi PNG is not automatically a higher-quality master. Circular SVGs are alpha>=128 pixel-run traces of the original1254px raster. Their effective source resolution is308ppi at3in width or369.6ppi at2.5in; exports do not add detail.
- The flat Athletics label is a later composition candidate, not the exact original approved tag. Its navigation geometry comes from the720x250 PNG and ATHLETICS from GA-03-F. Compare spacing, edges and actual-size legibility against approved-tag-concept.png. Black label, current white GOOOL/three white-red-white segments/white ATHLETICS is the current direction. Old shield/satin-label instructions are superseded. 2in is an alternative for review, not an approved change from nominal1in.
- Touchline cap: FRONT ONLY flat embroidery; both sides/rear blank. Old sample PDFs and slogan files are historical. Country-cap collections have separate side/back designs and are not covered by this removal.
- Current roster10products/14colorways. Closest Apliiq color on the same blank is authorized; record exact offered color and swatch. ASColour5150 Athletic Heather is a candidate, not a verified swatch in this audit.
- Modern Sport cotton BC3010 and performance ST720 remain separate products. Performance spec proposes9in front while saved-design notes report11in: unresolved scale discrepancy. Do not describe either as owner-approved until the dimensioned supplier proof is reconciled with the intended mockup.
- Circular older padded upload canvas causes undersized visible art. Compare original to tight derivative at the intended visible width and original proportions. New supplier proof remains required.
- All mockups and placement schematics are concept/target references, not manufactured sample photographs. Physical sample approval and existing release checks remain outstanding.

Full source and unlaunched-design registry: C:/Users/gdove/OneDrive/Desktop/GOOOL/designs/00_asset-library/START-HERE.md. Self-contained packages retain intentional artwork copies; duplicate hashes are not competing masters.
'''
write(LIB+'/CLAUDE-ARTWORK-HANDOFF.md','''# Claude — artwork and Apliiq handoff

Work in C:/Users/gdove/OneDrive/Desktop/GOOOL. Start with designs/00_asset-library/START-HERE.md, MASTER-ARTWORK-INDEX.json, ALL-PRODUCTS.json and CONFLICT-REGISTER.json. This registry covers every catalog product plus retained unlaunched concepts. Use the current v2 colorway packages and their ARTWORK-AUDIT.md; historical exports in designs/_archive are not upload instructions.

For each design, preserve the family’s original geometry, spelling, palette and front/back placement. Use the curated original or current upload candidate for that exact design. Read its status: do not substitute a mockup, generated photo, enlarged low-resolution raster, working trace, or a different similarly named logo. Compare source and derivative at intended physical size. A 600ppi export does not restore missing source detail.

Keep the current Athletics tag direction across supported garments. The flat file is a composition candidate and needs comparison with the original approved tag concept plus supplier proof. Record the service, actual size, supply ID and placement for each supported garment. Preserve the former shield badge for future design work.

Use the same garment blank and the closest offered Apliiq color to the mockup, recording the exact color and variant. Reconcile the Modern Sport performance9in/11in discrepancy and circular visible-width issue before approving saved designs. Do not infer IDs/SKUs or claim account verification from local records. Follow the existing sample/release requirements. Missing sources and incomplete unlaunched packages remain explicit tasks; do not manufacture from concept art or mark them complete without the actual files and proof.

The user requested accurate files and organization. This audit did not submit supplier orders, activate fulfillment or approve manufactured samples.
''')

# Changes to existing entry points are backed up by the installer.
headers={
 'CLAUDE.md':'Current artwork authority for all active and unlaunched designs: [designs/00_asset-library/START-HERE.md](designs/00_asset-library/START-HERE.md). Read its family-specific source selections and conflict register before the historical brand rules below. Current v2 packages include ARTWORK-AUDIT.md; original and derived files have different roles.',
 'designs/README.md':'Current asset authority: [00_asset-library/START-HERE.md](00_asset-library/START-HERE.md). It covers all64catalog products plus unlaunched concepts and supersedes the blanket claim below that every artwork decision follows the old PORTUGOOOL guide.',
 'designs/12_logos/README.md':'Use [the family-aware artwork index](../00_asset-library/ARTWORK-FAMILIES.md). Legacy PORTUGOOOL, GOL, tall GOOOL, extended GOOOL, navigation GOOOL and crest variants are distinct. Working raster traces do not automatically supersede approved originals.',
 'designs/16_goool_athletics/README.md':'Current roster and source selections: [artwork library](../00_asset-library/START-HERE.md). The current site catalog has10active products/14colorways overall. Preserve GA originals; CLEAN variants and circular derivatives retain their own provenance. Older development/mapping statements below are historical.',
 'designs/17_launch_imagery/README.md':'Current product roster is10active products/14colorways. The gallery manifest below was authored for9/13 and still selects its own image revisions; it is not the current catalog. [Artwork library](../00_asset-library/START-HERE.md) governs source choice. Modern Sport ST720 performance is now a separate catalog product; supplier proof remains pending.',
 'designs/goool-athletics-brand-label/README.md':'The owner-approved concept remains the visual reference. Current flat SVG/PNG files in the v2 package are a later source-derived composition candidate, not an exact copy or a recovered native vector. See [the label family](../00_asset-library/ARTWORK-FAMILIES.md) and require actual-size visual/manufacturing proof.',
 'designs/GOOOL_POD_SAMPLE_PACKET/README.md':'Historical packet: old cap-side slogan and shield/satin-label instructions are superseded. Current Touchline is front-only; current tag uses navigation GOOOL / three-segment underline / ATHLETICS on black. [Current artwork library](../00_asset-library/START-HERE.md) governs use; original source files are retained.',
 'designs/06_tshirts/handoff_crest_v2/README.md':'Scope correction: the three actual SKU specs are1cCREAM,1dFADEDBLACK and1eFADEDNAVY, allCC75. Earlier prose mentioning sixSKUs or other placements is historical. Keep source art and platform-placement templates separate. See [current family index](../../00_asset-library/ARTWORK-FAMILIES.md).',
 'designs/goool-badge-future-designs/README.md':'Preserved for future designs. The300px shield is a small monochrome reference, not the highest-resolution crest master or current neck label. See [crest-v2 family](../00_asset-library/ARTWORK-FAMILIES.md) for larger source variants and provenance limits.',
}
for rel,notice in headers.items():
 old=read(rel) if (ROOT/rel).is_file() else '# '+Path(rel).parent.name+'\n'
 write(rel,'> **Artwork audit — 2026-09-21:** '+notice+'\n\n'+old)
write('ARTWORK-START-HERE.md','# GOOOL artwork files\n\nStart with [the master artwork library](designs/00_asset-library/START-HERE.md). It identifies sources, upload derivatives and references for all64catalog products and unlaunched design families.\n\n[Current Apliiq packages](designs/apliiq-upload-packages-2026-09-21-v2/START-HERE.md) · [Claude handoff](designs/00_asset-library/CLAUDE-ARTWORK-HANDOFF.md) · [Audit findings](designs/00_asset-library/AUDIT-REPORT.md).\n')
write('APLIIQ-UPLOAD-START-HERE.md','# GOOOL — current artwork and upload packages\n\nRead [the artwork authority index](designs/00_asset-library/START-HERE.md), then use [the current14 v2 colorway packages](designs/apliiq-upload-packages-2026-09-21-v2/START-HERE.md). Each package and ZIP includes ARTWORK-AUDIT.md.\n\nOriginal artwork is preserved. Circular vectors and flat tag files are source-derived proof candidates, not automatically higher-quality or approved originals. The index includes all64catalog products and unlaunched families, with missing work explicitly recorded.\n\n[Claude handoff](designs/00_asset-library/CLAUDE-ARTWORK-HANDOFF.md) · [Source/placement conflicts](designs/00_asset-library/CONFLICT-REGISTER.json). Older exports remain in designs/_archive and do not govern new imports.\n')
for old,new in MOVES.items():
 for name in ['START-HERE.md','README.md']:
  write(old+'/'+name,'# Historical handoff moved\n\nThis handoff is superseded. Use [the artwork library](../00_asset-library/START-HERE.md) and [currentv2 packages](../apliiq-upload-packages-2026-09-21-v2/START-HERE.md).\n\nOriginal files are preserved at `'+new+'` relative to GOOOL.\n')
write(ARCH+'/README.md','# Historical artwork exports — do not upload\n\nThis archive preserves superseded v1 garment packages, the older launch-image handoff, pre-audit v2 ZIPs and every overwritten document. Originals are preserved for rollback and provenance.\n\nUse [the current artwork library](../../00_asset-library/START-HERE.md). Existing source designs and public runtime assets stay in place. Byte-identical copies in packages are intentional self-contained deliveries. No unique artwork is discarded.\n')

notice=read(V2+'/SAVED-DESIGN-UPDATES.md')
notice=notice.replace("Claude's reconciliation now reports 13 saved colorway designs, with only the AS Colour 5150 crewneck lacking a recorded ID. These are source-reported account results, not independently rechecked by this package builder. The reported dates still say 2026-09-22.","The reconciliation refreshed during this audit reports all14 saved colorway designs, dated2026-09-21. These are source-reported account results, not independently rechecked by this audit. Do not create duplicate designs.")
notice=notice.replace('Crewneck: closest same-blank color is already authorized. Use AS Colour 5150 Athletic Heather as the swatch candidate and prepare its design. Do not wait on the superseded Gray Heather naming question.','Crewneck: saved design6112046, AS Colour5150 Athletic Heather (supplier color2873), is now source-reported created and verified. The report records the new forest PNG at2.5x2.53in, centered front, blank back, with S-2XL SKUs. Do not recreate it. The owner color policy is satisfied in the source report; physical sample approval and label application remain separate.')
write(V2+'/SAVED-DESIGN-UPDATES.md',notice)
jsave(V2+'/CATALOG-INDEX.json',vindex)
for rel in ['src/lib/products.ts','src/lib/fulfillment.ts','designs/11_fulfillment/apliiq-reconciliation.json','designs/11_fulfillment/APLIIQ-CATALOG-AUDIT.md']:
 write(V2+'/source-snapshot/'+rel,(ROOT/rel).read_bytes())
write(V2+'/ARTWORK-AUDIT.md',addendum+'\nLatest source report now lists all14 saved designs, including crew6112046 in Athletic Heather. See SAVED-DESIGN-UPDATES.md; no account action was performed by this audit.\n')
write(V2+'/START-HERE.md','> **Current source authority:** Read [the artwork library](../00_asset-library/START-HERE.md) and [ARTWORK-AUDIT.md](ARTWORK-AUDIT.md). V2 is the current delivery package, not a claim that its newer derivatives supersede original visual approval. All14ZIPs include the audit corrections.\n\n'+read(V2+'/START-HERE.md').replace('Current canonical path:','Current delivery path:').replace('Use v2 for the current art and placement targets.','Use v2 with ARTWORK-AUDIT.md for current delivery candidates and placement targets.'))
prompt=read(V2+'/CLAUDE-IMPORT-PROMPT.md').replace('higher-detail circular masters','circular upload derivatives from the original source').replace('and create only the crewneck if it still has no saved design','and reopen the now-reported crewneck6112046; all14 saved IDs exist in the latest source report')
write(V2+'/CLAUDE-IMPORT-PROMPT.md','Read ARTWORK-AUDIT.md and ../00_asset-library/START-HERE.md before executing this handoff. Original sources, draft derivatives and approved mockup concepts are explicitly separated there.\n\n'+prompt)
for name in ['START-HERE.md','REVISION-2.md']:
 text=final_bytes(V2+'/'+name).decode('utf8').replace('13 saved colorways and one missing crewneck','14 saved colorways including crew6112046').replace('higher-detail circular masters','source-derived circular upload candidates')
 write(V2+'/'+name,text)
for entry in vindex['packages']:
 base=V2+'/'+Path(entry['spec']).parent.as_posix()
 sp=jread(V2+'/'+entry['spec'])
 row=next(x for x in reconciliation['rows'] if x['slug']==entry['slug'] and x['color']==entry['website_color'])
 sp['supplier_record'].update(source_reported_status=row['status'],source_reported_design_id=row['saved_design_id'],reported_skus_for_website_sizes={size:(row.get('per_size_skus') or {}).get(size) for size in sp['product']['website_sizes']},source_reported_note=row['note'])
 sp['garment']['source_reported_blank']=row['blank']
 if row.get('supplier_color'):sp['garment']['source_reported_supplier_color']=row['supplier_color']
 jsave(base+'/reference-only/supplier-record.json',row)
 write(base+'/SAVED-DESIGN-UPDATES.md',notice)
 write(base+'/REVISION-2.md',final_bytes(V2+'/REVISION-2.md'))
 sp['artwork_audit']={'date':'2026-09-21','read_first':'ARTWORK-AUDIT.md','source_library':'designs/00_asset-library/START-HERE.md','artwork_bytes_changed':False,'label_layout_status':'later_composition_candidate_compare_to_original_approved_concept','newer_files_automatically_supersede_originals':False,'supplier_manufacturing_approval_granted':False}
 if 'circular' in entry['slug']:sp['artwork_audit']['circular_source_status']='Original1254px raster is shape authority. SVG pixel-run traces and600ppi PNGs are proof derivatives; no added detail.'
 if entry['slug']=='goool-athletics-modern-sport-performance-tee':sp['artwork_audit']['open_scale_conflict']='9in proposed target vs11in source-reported saved design; dimensioned proof reconciliation required.'
 sp['label']['layout_approval_status']='derived_composition_candidate_not_exact_original_concept'
 jsave(base+'/spec.json',sp)
 write(base+'/ARTWORK-AUDIT.md',addendum)
 md=re.sub(r'Recorded design ID: .*?\. Reopen',f'Recorded design ID: {row["saved_design_id"]}. Reopen',read(base+'/SPEC.md'))
 write(base+'/SPEC.md','> **Read [ARTWORK-AUDIT.md](ARTWORK-AUDIT.md) first.** It qualifies original/derivative authority and supersedes obsolete reference instructions. Artwork bytes are unchanged.\n\n'+md)
 write(base+'/label/README.md','> **Layout status:** This flat file is a later composition candidate. Compare it to the owner-approved tag concept at actual size; it is not an exact recovered original vector. See [ARTWORK-AUDIT.md](../ARTWORK-AUDIT.md).\n\n'+read(base+'/label/README.md'))
 all_rel={p.relative_to(ROOT).as_posix() for p in (ROOT/base).rglob('*') if p.is_file()}|{p.relative_to(STAGE).as_posix() for p in (STAGE/base).rglob('*') if p.is_file()}
 checks={p[len(base)+1:]:sha(final_bytes(p)) for p in sorted(all_rel) if not p.endswith('/SHA256SUMS.json')}
 jsave(base+'/SHA256SUMS.json',checks)
 zp=STAGE/V2/'archives'/(entry['package_id']+'.zip');zp.parent.mkdir(parents=True,exist_ok=True)
 with zipfile.ZipFile(zp,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for rel in sorted(set(checks)|{'SHA256SUMS.json'}):z.writestr(rel,final_bytes(base+'/'+rel))
sources=jread(V2+'/SOURCE-FILES.json')
source_changes=[]
for rel,row in sources['files'].items():
 h=sha(final_bytes(rel))
 if h!=row['sha256']:
  source_changes.append({'path':rel,'before_sha256':row['sha256'],'after_sha256':h,'reason':'Audit notice only' if (STAGE/rel).is_file() else 'Newer external source incorporated into delivery snapshot; audit did not modify this source'})
  row['sha256']=h
  if 'bytes' in row:row['bytes']=len(final_bytes(rel))
sources['audit_source_document_changes']=source_changes
jsave(V2+'/SOURCE-FILES.json',sources)
jsave(V2+'/ARTWORK-AUDIT-CHANGES.json',{'at_utc':NOW,'source_document_changes':source_changes,'artwork_changed':False,'packages_updated':14,'previous_zip_location':ARCH+'/pre-audit-v2-zips','scope':'Provenance and instruction addendum; original and derivative graphics preserved byte-for-byte.'})
root_rel={p.relative_to(ROOT/V2).as_posix() for p in (ROOT/V2).rglob('*') if p.is_file()}|{p.relative_to(STAGE/V2).as_posix() for p in (STAGE/V2).rglob('*') if p.is_file()}
jsave(V2+'/PACKAGE-FILES.json',{rel:sha(final_bytes(V2+'/'+rel)) for rel in sorted(root_rel) if rel not in ['PACKAGE-FILES.json','VERIFICATION-RESULT.json']})

# Preflight complete planned mutations, require byte-for-byte original match before installation.
move_rows=[]
for old,new in MOVES.items():
 move_rows.append({'source':old,'destination':new,'files':{p.relative_to(ROOT/old).as_posix():sha(p.read_bytes()) for p in (ROOT/old).rglob('*') if p.is_file()}})
changes=[]
for p in sorted(STAGE.rglob('*')):
 if not p.is_file():continue
 rel=p.relative_to(STAGE).as_posix();old=ROOT/rel
 before=sha(old.read_bytes()) if old.is_file() else None
 moved=any(rel==x or rel.startswith(x+'/') for x in MOVES)
 backup=None
 if before and not moved:
  backup=(ARCH+'/pre-audit-v2-zips/'+Path(rel).name) if rel.startswith(V2+'/archives/') else (ARCH+'/documents-before/'+rel)
 changes.append({'path':rel,'before_sha256':before,'after_sha256':sha(p.read_bytes()),'backup':backup,'under_moved_folder':moved})
plan={'root':str(ROOT),'staging':str(STAGE),'at_utc':NOW,'moves':move_rows,'changes':changes}
(WORK/'install-plan.json').write_text(json.dumps(plan,indent=2),encoding='utf8')
print(json.dumps({'staged_files':len(changes),'families':len(families),'products':len(prows),'inventory_files':len(inventory),'unique_hashes':len(groups),'duplicate_groups':sum(len(v)>1 for v in groups.values()),'moves':len(move_rows),'source_documents_amended':source_changes},indent=2))
