from pathlib import Path
import json, hashlib, shutil, re, zipfile, datetime
from PIL import Image
from pypdf import PdfReader

ROOT = Path('C:/Users/gdove/OneDrive/Desktop/GOOOL')
HERE = Path(__file__).resolve().parent
OUT = HERE.parent / 'apliiq-upload-packages-2026-09-21'
DEST = ROOT / 'designs' / OUT.name
OUT.mkdir(exist_ok=True)
CAT = json.loads((HERE/'catalog.json').read_text(encoding='utf-8'))
REC_PATH = ROOT/'designs/11_fulfillment/apliiq-reconciliation.json'
REC = json.loads(REC_PATH.read_text(encoding='utf-8-sig'))
CORE = 'designs/GOOOL_POD_SAMPLE_PACKET/'
ATH = 'designs/16_goool_athletics/'
LABEL = 'designs/goool-athletics-brand-label/'
STAMP = datetime.datetime.now(datetime.timezone.utc).isoformat()
SOURCE_RECORDS = {}

def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p, value):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(value, indent=2, ensure_ascii=False)+'\n' if not isinstance(value,str) else value, encoding='utf-8')
def copy(src, target):
    p = ROOT/src
    target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(p,target)
    assert sha(p)==sha(target)
    SOURCE_RECORDS[src]={'sha256':sha(p),'bytes':p.stat().st_size}
    return {'source_project_path':src,'sha256':sha(target),'bytes':target.stat().st_size}
def slug(x): return re.sub('[^a-z0-9]+','-',x.lower()).strip('-')

OWNER = '''# Current owner decisions — 2026-09-21

The desktop project is C:/Users/gdove/OneDrive/Desktop/GOOOL.

The owner's newest color instruction is: "use whatever colors apliiq offers for the garment that closest to the mockup". Select the closest available Apliiq color for the SAME garment, compare the actual supplier swatch with the concept, and record the exact supplier name and variant ID. This supersedes older requests to ask the owner about Gray Heather versus Athletic Heather. AS Colour 5150 Athletic Heather is the current candidate; verify its swatch. This is not permission to substitute another blank or silently recolor the artwork. If no reasonable color match exists, present the actual options.

Use the selected black GOOOL ATHLETICS brand tag on every supported design: exact navigation lettering, THREE Os, three separate white/red/white underline segments, white ATHLETICS beneath. Nominal finished size 1 x 1 inch, subject to the service's sewing margins and legible proof. Tag concept is approved visually; flat production art and service are not yet verified. Earlier shield-tag artwork is superseded. The shield remains archived for possible future designs.

The Modern Sport design must also exist as a separate performance tee, distinct from its cotton tee. Candidate blank ST720 has set-in sleeves; raglan concept imagery does not define the blank. Existing badge performance designs must not be overwritten.

Touchline cap has front wordmark embroidery only. Old right-side SOUND OF VICTORY decoration is removed. No new exterior decorations are authorized by the request to add an interior brand label.

Prepare and verify supplier designs. Do not place paid garment/label orders, enable checkout, or activate fulfillment as part of this handoff. Existing sample approval requirements remain. Preserve garment-specific care, size, fiber and origin information; do not copy one blank's origin/composition onto another.
'''
CONFLICTS = '''# Source conflicts and required resolutions

1. Supplier IDs/SKUs in the reconciliation JSON are Claude's recorded account observations, not independently rechecked by this package build. That JSON says 2026-09-22, later than this build's 2026-09-21 UTC date. Record a fresh verification timestamp and account evidence; do not treat the date as proof. The older audit Markdown and fulfillment source may omit newer designs.
2. Minimal Club saved design 6112002 reportedly includes both Black and Natural. Remove the unintended Black variant and then recheck every Natural size SKU; do not import the reported SKUs as executable mappings before that check.
3. Crewneck color owner decision is resolved: choose the closest available color on AS Colour 5150. Athletic Heather is the candidate reported by the supplier notes; compare the actual swatch. Keep the website's old Gray Heather name distinct until catalog reconciliation.
4. The new tag supersedes old shield label instructions in the core PDF. A black-and-white-only label service cannot reproduce the red segment. Obtain matching flat artwork, color-capable service, finished dimensions, safe/sewing margins, per-blank placement and supplier proof. No label supply ID is yet established.
5. The core PDF's cap side slogan is superseded. The cap's front embroidery reference is not a stitch file; supplier digitization and sew-out approval remain required.
6. Circular files have transparent margins. The 900px tee file has only 671px visible width; the 750px crew file has only 560px visible width. At 3in/2.5in visible width these provide about 224ppi, not 300ppi. Their width and height differ slightly. Resolve production artwork, diameter interpretation and measured collar/center offsets before upload. Preserve the existing files as reference; do not upsample to claim added detail.
7. Cotton Modern Sport packet targets 11in front. The separate performance concept proposes 9in front and 3.25in back, with no confirmed collar offsets. Do not silently inherit cotton dimensions or use those proposals as approved settings.
8. New athletics blank selections come from supplier reconciliation, while the original athletics PDF describes proposed cotton construction more generally. Verify exact model, fabric, fit, color and printable area against the chosen garment. Never infer blank identity from a model render.
9. Cleaned GA-01 files are newer selected candidates; compare against the original packet for lettering, red underline, spacing and knockout transparency. GA-02 reconstructed/distressed edges and tiny text need proof inspection. All sample dimensions are targets, not a claim of final manufacturing approval.
10. The photographed-looking website images are concept renders. Preserve garment construction, logo, color, framing and scale consistency when updating imagery after supplier verification. Do not upload mockup pictures as print art.
'''
LABEL_NOTES = '''# Required label for this garment — production preparation pending

Use the owner's navigation-wordmark GOOOL ATHLETICS tag described in OWNER-DECISIONS.md. The files in reference-only are visual/source references, NOT upload-ready flat label art. Never upload the scene mockup as a label image.

Required before application: exact flat master with three Os and white/red/white segmented line; production dimensions and sewing/safe margins; readable ATHLETICS at actual size; compatible color-capable service; supplier supply/design ID; garment-specific attachment position; applicable care/fiber/size/origin information retained; supplier proof. A cap requires a specifically supported interior location/service. Record unsupported combinations rather than mark them attached.

Check the label is attached to this individual saved design and its relevant color/size variants after saving. Reopen the design and capture evidence. Do not order label inventory or garments in this handoff.
'''
COMMON_BLOCKS = [
 'Brand label flat master, color-capable supplier service, supply ID, per-blank compatibility and proof remain unverified.',
 'Fresh account verification required for exact blank, color, offered sizes, decoration placement and saved design IDs/SKUs.',
 'Supplier production proof/sample approval and existing release checks remain required; package readiness does not authorize manufacturing or sales.'
]

def art(source, face, width, top=None, horizontal='body centerline', status='sample_specification_target', folder='artwork', anchor='top of visible artwork below bottom collar seam'):
    return dict(source=source,face=face,visible_width_in=width,vertical_offset_in=top,horizontal_position=horizontal,
                vertical_anchor=anchor,dimension_status=status,folder=folder)

def config(p, color):
    s=p['slug']; blocks=[]; notes=[]; method='DTF / transfer; supplier process confirmation required'
    if s=='goool-performance-tee':
        f={'Black':CORE+'01_Performance_Tee_Artwork/GOOOL_SAMPLE_01_ST720_BADGE_FRONT_5IN.png',
           'White':CORE+'07_Alternate_Colorway_Artwork/GOOOL_ALT_01_ST720_BADGE_NAVY_BURGUNDY_FRONT_5IN.png',
           'True Royal':CORE+'07_Alternate_Colorway_Artwork/GOOOL_ALT_03_ST720_BADGE_CREAM_BURGUNDY_FRONT_5IN.png'}[color]
        a=[art(f,'front',5,2.25)]; model='Sport-Tek ST720'; notes=['Target crest height 6.40in. Set-in sleeve performance tee. Polyester: supplier must confirm low-cure/bleed-control process; no invented press settings.']
    elif s=='goool-heavyweight-hoodie':
        f=CORE+('02_Hoodie_Artwork/GOOOL_SAMPLE_02_IND4000_WORDMARK_FRONT_6.75IN.png' if color=='Black' else '07_Alternate_Colorway_Artwork/GOOOL_ALT_02_WORDMARK_NAVY_BURGUNDY_FRONT_6.75IN.png')
        a=[art(f,'front',6.75,4,anchor='top of visible artwork below hood/neck seam')];model='Independent Trading Co. IND4000';notes=['Target height 2.34in (raster proportional height 2.3433in). Maintain at least 1.5in clearance above pocket. Verify fiber composition for this color.']
    elif s=='goool-heavyweight-casual-tee':
        f=CORE+('03_Casual_Tee_Artwork/GOOOL_SAMPLE_03_4810GD_WORDMARK_FRONT_6.75IN.png' if color=='Washed Black' else '07_Alternate_Colorway_Artwork/GOOOL_ALT_02_WORDMARK_NAVY_BURGUNDY_FRONT_6.75IN.png')
        a=[art(f,'front',6.75,3.25)];model='Bella+Canvas 4810GD';notes=['Target height 2.34in (raster proportional height 2.3433in). Garment-dyed cotton; supplier must verify process.']
    elif s=='goool-touchline-cap':
        a=[art(CORE+'04_Cap_Embroidery_Artwork/GOOOL_SAMPLE_04_OTTO31069_WORDMARK_FRONT_EMBROIDERY_REFERENCE.png','front',3.75,.5,'front panel centerline',folder='reference-only/embroidery',anchor='BOTTOM of visible embroidery ABOVE visor seam')]
        model='OTTO 31-069';method='Flat embroidery, front only; no puff'
        blocks+=['Supplier digitization and sew-out proof required; provided PNG/PDF are embroidery references, not machine stitch files.']
        notes=['Target height 1.30in. Black and cranberry thread; original packet specifies nearest stock PMS 201 C to brand red #C61322, subject to thread proof. No side slogan or rear artwork.']
    elif s in ['goool-athletics-modern-sport-tee','goool-athletics-modern-sport-performance-tee']:
        perf=s.endswith('performance-tee'); model='Sport-Tek ST720' if perf else 'Bella+Canvas 3010'
        a=[art(ATH+'print_masters/upload/GA-01-F_3300px_CLEAN.png','front',9 if perf else 11,None if perf else 3),
           art(ATH+'print_masters/upload/GA-01-B_975px_CLEAN.png','back',3.25,None if perf else 2)]
        notes=['Front white GOOOL / red underline / white ATHLETICS; back white only. Digital palette reference red #C52D32, white #FFFFFF. Compare cleaned art to original design.']
        if perf:
            blocks+=['Performance front 9in and back 3.25in are concept proposals; final dimensions and both collar offsets must be resolved before upload.']
            for x in a: x['dimension_status']='proposal_not_approved'; x['folder']='reference-only/proposed-artwork'
            notes+=['Separate Modern Sport performance design; do not overwrite badge design 6098962. ST720 set-in sleeves; reject raglan mockup as construction evidence. Supplier must confirm polyester transfer compatibility.']
    elif s=='goool-athletics-varsity-tee':
        model='Bella+Canvas 4810GD';a=[art(ATH+'print_masters/GA-02-F_3300px.png','front',11,3),art(ATH+'print_masters/GA-02-B_975px.png','back',3.25,2)]
        notes=['Front ivory/dark red, back ivory only. Packet digital targets ivory #E8DFCA, dark red #8E3438. Inspect distress, tiny text, edges and whether dark areas are printed or knockout.']
        blocks+=['Confirm reconstructed/distressed artwork and negative-space treatment in production proof.']
    elif s=='goool-athletics-minimal-club-tee':
        model='Bella+Canvas 3010';a=[art(ATH+'print_masters/GA-03-F_1050px.png','front',3.5,3,'artwork CENTER 3.5in wearer-left of body centerline (viewer right)'),art(ATH+'print_masters/GA-03-B_3600px.png','back',12,2.75)]
        notes=['Front black only, no red. Back black/red; digital targets black #171717 and red #C52D32.']
        blocks+=['Saved design 6112002 reportedly also includes Black. Remove unintended Black and reverify every Natural size SKU before importing mappings.']
    elif s in ['goool-athletics-circular-badge-tee','goool-athletics-circular-center-crewneck']:
        tee=s.endswith('badge-tee'); model='Comfort Colors C1717' if tee else 'AS Colour 5150 Made Crew'
        f=ATH+'print_masters/upload/'+('GA-CIRCLE-08_BADGE_NAVY_900px.png' if tee else 'GA-CIRCLE-09_CREW_FOREST_750px.png')
        a=[art(f,'front',3 if tee else 2.5,None,'wearer-left chest; measured offset pending' if tee else 'centerline, upper sternum; measured collar offset pending',status='diameter_target_not_final_placement',folder='reference-only/artwork-needs-resolution')]
        blocks+=['Circular artwork has only about 224 effective ppi at target visible width; provide adequate faithful production master or obtain explicit supplier acceptance of actual resolution.', 'Resolve diameter versus non-square visible bounds and measured collar/horizontal offsets before upload.']
        notes=['Lettering forms circle: no enclosing ring, disk, shield or extra wording. Navy on Ivory.' if tee else 'Forest-green lettering on closest supplier heather gray. Athletic Heather is now owner-authorized as the same-blank candidate, subject to swatch verification.']
    else: raise ValueError(s)
    return model,a,method,notes,blocks

index=[]
for p in CAT:
    for v in p.get('colorVariants') or [{'name':p['color'],'images':p.get('images',[])}]:
        color=v['name']; rows=[r for r in REC['rows'] if r['slug']==p['slug'] and r['color']==color]; assert len(rows)==1,(p['slug'],color)
        row=rows[0]; model, artworks, method, notes, blocks=config(p,color)
        package_id=f'{len(index)+1:02d}-{p["slug"]}-{slug(color)}'; base=OUT/'packages'/package_id
        base.mkdir(parents=True,exist_ok=True)
        write(base/'OWNER-DECISIONS.md',OWNER);write(base/'SOURCE-CONFLICTS.md',CONFLICTS);write(base/'label/README.md',LABEL_NOTES)
        for name in ['approved-tag-concept.png','source-navigation-wordmark-white.png','README.md']:
            copy(LABEL+name,base/'label/reference-only'/name)
        core=p['slug'] in ['goool-performance-tee','goool-heavyweight-hoodie','goool-heavyweight-casual-tee','goool-touchline-cap']
        pdfsource=CORE+'GOOOL_POD_SAMPLE_SPECIFICATIONS.pdf' if core else ATH+'GOOOL_ATHLETICS_POD_Packet_v1.pdf'
        copy(pdfsource,base/'reference-only/legacy-specifications.pdf')
        reader=PdfReader(ROOT/pdfsource)
        write(base/'reference-only/legacy-specifications-text.txt','REFERENCE ONLY: see OWNER-DECISIONS.md and SOURCE-CONFLICTS.md for overrides.\n\n'+'\n\n'.join(f'PAGE {i+1}\n{page.extract_text()}' for i,page in enumerate(reader.pages)))
        if 'circular' in p['slug']:
            for name in ['PRODUCTION_NOTES.md','LAUNCH_SELECTION.md']:
                copy(ATH+'circular_logo/'+name,base/'reference-only'/name)
            copy(ATH+'logos/GOOOL_ATHLETICS_CIRCULAR_WORDMARK_1254px.png',base/'reference-only/original-logo-reference.png')
        if p['slug']=='goool-touchline-cap':
            copy(CORE+'04_Cap_Embroidery_Artwork/GOOOL_SAMPLE_04_OTTO31069_WORDMARK_FRONT_EMBROIDERY_REFERENCE.pdf',base/'reference-only/embroidery/front-reference.pdf')
        refs=[]
        for n,im in enumerate((v.get('images') or p.get('images') or [])[:2],1):
            source='public'+im['src']
            if (ROOT/source).is_file():
                rel='reference-only/mockups/'+str(n)+'-'+Path(source).name
                refs.append(dict(path=rel,usage='concept_only_never_upload_as_artwork',**copy(source,base/rel)))
        artrecords=[]
        for x in artworks:
            rel=x['folder']+'/'+Path(x['source']).name
            rec=copy(x['source'],base/rel)
            with Image.open(base/rel) as im:
                rgba=im.convert('RGBA'); bounds=rgba.getchannel('A').getbbox(); assert bounds
                w,h=im.size; vw=bounds[2]-bounds[0]; vh=bounds[3]-bounds[1]
            rec.update({k:v for k,v in x.items() if k not in ['source','folder']})
            rec.update(path=rel,pixels=[w,h],alpha_bbox_px=list(bounds),visible_pixels=[vw,vh],
                       effective_ppi_at_target_visible_width=round(vw/x['visible_width_in'],6),
                       proportional_visible_height_in=round(x['visible_width_in']*vh/vw,6),
                       canvas_width_in_for_target_visible_width=round(x['visible_width_in']*w/vw,6),
                       visible_top_inset_in_at_target=round(bounds[1]*x['visible_width_in']/vw,6),
                       raster_modified_by_package_builder=False,
                       usage='draft_upload_candidate_requires_proof' if x['folder']=='artwork' else 'reference_only_do_not_upload_until_blockers_resolved')
            artrecords.append(rec)
        expected_skus={size:(row.get('per_size_skus') or {}).get(size) for size in p['sizes']}
        supplier_color='Athletic Heather' if 'circular-center' in p['slug'] else v.get('supplierColor',color)
        spec={'schema_version':'1.0','package_id':package_id,'built_at_utc':STAMP,
              'product':{'id':p['id'],'slug':p['slug'],'name':p['name'],'website_color':color,'website_sizes':p['sizes'],'url':'https://goool.shop/shop/'+p['slug']},
              'garment':{'brand_model':model,'supplier_color_candidate':supplier_color,'color_policy':'closest available supplier color on same blank, visually checked against mockup; record exact name and variant ID','swatch_verified_in_this_build':False,'source_reported_blank':row['blank']},
              'supplier_record':{'source':'reference-only/supplier-record.json','source_reported_status':row['status'],'source_reported_design_id':row['saved_design_id'],'reported_skus_for_website_sizes':expected_skus,'independently_verified_in_this_build':False,'executable_fulfillment_mapping':False},
              'decoration':{'method':method,'artwork':artrecords,'back':'specified back artwork only' if len(artrecords)>1 else 'blank','sleeves':'blank','cap_side_and_rear':'blank' if 'cap' in p['slug'] else 'not applicable','notes':notes,
                            'tolerances':{'status':'packet_sample_targets_subject_to_supplier_confirmation','horizontal_vertical_in':.25,'scale_percent':2 if core else 3,'rotation_degrees':None if core else 2,'additional':'Core target centering within 0.125in; max 0.25in. Athletics maintain minimum 1in seam clearance where applicable. Verify smallest offered size; do not silently auto-scale.'}},
              'label':{'required':True,'placement':'supported interior cap location TBD' if 'cap' in p['slug'] else 'inside neck, supplier-compatible attachment TBD','nominal_finished_size_in':[1,1],'flat_upload_master':None,'supplier_service':None,'supplier_supply_id':None,'applied_and_verified':False,'readme':'label/README.md'},
              'mockup_references':refs,'unresolved_requirements':blocks+COMMON_BLOCKS,
              'release':{'package_files_verified':True,'all_manufacturing_specs_final':False,'ready_for_unattended_upload':False,'supplier_design_verified_by_this_build':False,'production_or_sales_enabled':False}}
        write(base/'spec.json',spec);write(base/'reference-only/supplier-record.json',row)
        plan={'package_id':package_id,'automation_contract':'Agent-readable instructions; this is NOT an Apliiq-native ZIP/API import schema. No automatic submission.',
              'steps':['Read SPEC.md, spec.json, OWNER-DECISIONS.md, SOURCE-CONFLICTS.md and label/README.md. Verify SHA256SUMS.json before selecting any artwork.',
                       'Check exact blank and available color/size variants in authenticated Apliiq. Select closest available same-blank color; record swatch evidence. Do not swap models.',
                       'Reopen recorded design ID where supplied. Resolve all relevant blockers before changing that design. Do not infer IDs/SKUs from a numbering pattern.',
                       'Use only specified face-specific art paths. Preserve bytes/aspect ratio and visible print width. Account for alpha margins; anchor collar distances to visible artwork, not canvas.',
                       'Confirm front/back/sleeve/cap blank areas and inspect proof at actual size. Resolve null placement fields using supplier templates and dimensioned proof, never guessed drag coordinates.',
                       'Prepare matching flat label master and supported color-capable service; verify per-blank interior placement, legibility, margins and preserved garment information. No paid supply order.',
                       'Save only authorized draft design changes, reopen, and check correct single color, sizes, art, placement and label attachment. Capture evidence.',
                       'Fill verification-record.json with actual supplier design/variant IDs and per-size SKUs, proof paths/URLs, measured positions and fresh timestamps. Keep unresolved fields null.',
                       'Reconcile catalog/fulfillment references only with verified IDs and correct supplier color names; keep Coming Soon and fulfillment gates. No sample purchase or production release.']}
        write(base/'import-plan.json',plan)
        verify={'package_id':package_id,'status':'NOT_YET_ACCOUNT_VERIFIED','verified_at_utc':None,'verified_by':None,'exact_blank':None,'exact_supplier_color':None,'supplier_color_variant_id':None,'swatch_evidence':None,'saved_design_id':None,'per_size_skus':{s:None for s in p['sizes']},'actual_art_sha256_by_face':{},'actual_visible_dimensions_and_offsets_by_face':{},'artwork_proof':None,'label_flat_master_sha256':None,'label_service_and_supply_id':None,'label_attachment_evidence':None,'unsupported_options':[],'all_blockers_resolved':False,'sample_approval_evidence':None}
        write(base/'verification-record.json',verify)
        lines=[f'# {p["name"]} — {color}', '',f'Package `{package_id}`. Product UUID `{p["id"]}`.', '',f'Blank: **{model}**. Supplier color candidate: **{supplier_color}**. Website sizes: {", ".join(p["sizes"])}.', '',f'Source-reported saved design: {row["saved_design_id"] or "not created"}; status: {row["status"]}. Recheck in Apliiq. These are source records, not verification performed by this build.', '', '## Artwork and placement', '',f'Method: {method}. All dimensions are inches and refer to visible artwork. Keep aspect ratio.', '']
        for a in artrecords:
            lines += [f'- **{a["face"]}**: `{a["path"]}`; target visible width **{a["visible_width_in"]}in**, proportional visible height {a["proportional_visible_height_in"]}in; {a["dimension_status"]}.',f'  Position: {a["horizontal_position"]}; {a["vertical_offset_in"] if a["vertical_offset_in"] is not None else "UNRESOLVED"}in — {a["vertical_anchor"]}.',f'  Canvas {a["pixels"]}px; visible bounds {a["alpha_bbox_px"]}; effective resolution {a["effective_ppi_at_target_visible_width"]}ppi. Canvas width equivalent: {a["canvas_width_in_for_target_visible_width"]}in; visible top inset {a["visible_top_inset_in_at_target"]}in. Usage: {a["usage"]}.']
        lines += ['',f'Back: {spec["decoration"]["back"]}. Sleeves blank. '+('Cap sides/rear blank.' if 'cap' in p['slug'] else ''),'']+[f'- {n}' for n in notes]
        lines += ['', '## Required label', '', 'Read label/README.md. Every design requires the selected navigation-wordmark GOOOL ATHLETICS label. The supplied concept is not flat upload art. Label master/service/supply ID/attachment proof remain pending.', '', '## Unresolved requirements', '']+[f'- {b}' for b in spec['unresolved_requirements']]
        lines += ['', '## Execution', '', 'Follow import-plan.json. Record fresh account evidence in verification-record.json. Do not mistake source VERIFIED status for completion of this newer label/artwork handoff. Draft setup can proceed only where its inputs are established; reference-only files cannot be treated as production upload masters. Legacy PDFs contain superseded directions: current OWNER-DECISIONS.md controls. See spec.json for full measurements, hashes and exact source paths.', '']
        write(base/'SPEC.md','\n'.join(lines))
        hashes={q.relative_to(base).as_posix():sha(q) for q in sorted(base.rglob('*')) if q.is_file() and q.name!='SHA256SUMS.json'}
        write(base/'SHA256SUMS.json',hashes)
        index.append({'package_id':package_id,'product_id':p['id'],'slug':p['slug'],'website_color':color,'supplier_color_candidate':supplier_color,'blank':model,'spec':'packages/'+package_id+'/spec.json','readme':'packages/'+package_id+'/SPEC.md','source_reported_design_id':row['saved_design_id'],'source_reported_status':row['status'],'label_ready':False,'unattended_upload_ready':False})

assert len(CAT)==10 and len(index)==14
write(OUT/'CATALOG-INDEX.json',{'built_at_utc':STAMP,'product_count':len(CAT),'colorway_package_count':len(index),'packages':index})
write(OUT/'OWNER-DECISIONS.md',OWNER);write(OUT/'SOURCE-CONFLICTS.md',CONFLICTS)
for source in ['src/lib/products.ts','src/lib/types.ts','src/lib/fulfillment.ts','designs/11_fulfillment/apliiq-reconciliation.json','designs/11_fulfillment/APLIIQ-CATALOG-AUDIT.md','designs/11_fulfillment/apliiq-product-mapping.md']:
    copy(source,OUT/'source-snapshot'/source)
copy(ATH+'circular_logo/PRODUCTION_NOTES.md',OUT/'source-snapshot/circular-PRODUCTION_NOTES.md')
shutil.copy2(HERE/'catalog.json',OUT/'source-snapshot/active-catalog.json')
write(OUT/'SOURCE-FILES.json',{'source_project_root':str(ROOT),'built_at_utc':STAMP,'files':SOURCE_RECORDS})
prompt=f'''Work in C:\\Users\\gdove\\OneDrive\\Desktop\\GOOOL. Use the Apliiq/browser workflow you previously used, if available; read its skill instructions first.

Start with designs/{OUT.name}/START-HERE.md and CLAUDE-IMPORT-PROMPT.md. The package covers all 10 active products and 14 colorways, including the separate Modern Sport Performance Tee. Use CATALOG-INDEX.json and each self-contained package's SPEC.md, spec.json, import-plan.json, OWNER-DECISIONS.md and label/README.md. Check file hashes and source freshness with verify-packages.py before using files. These JSON documents are an agent-readable manifest, not a native Apliiq bulk-upload API.

The owner authorizes the closest Apliiq color on the SAME garment to the mockup. Compare actual swatches and record exact supplier names and IDs. Use Athletic Heather as the AS Colour 5150 candidate; do not ask again about that naming substitution. Do not substitute blank models.

Verify the exact supplier blank, color, offered sizes, front/back artwork and measured placement for each product. Use existing saved IDs only after reopening them. Fix Minimal Club 6112002's unintended Black variant and verify the Natural size SKUs. Create the five missing designs as their inputs become established. Keep Modern Sport cotton and performance separate and do not overwrite the badge performance design. For performance, resolve the proposed 9in front/3.25in back sizes and missing collar offsets before upload. Circular files contain transparent margins and only about 224ppi of visible detail at target width; resolve print master/diameter/placement before upload. Do not upload reference-only art or mockup scenes as production masters.

Apply the selected GOOOL ATHLETICS interior tag to every compatible design after preparing and proofing the exact flat artwork and verifying a color-capable service: white navigation lettering, THREE Os, white/red/white three-section line, ATHLETICS below, black background. Nominal 1in square subject to supplier margins. Record exact service/supply ID and attachment evidence for every design, including cap compatibility. No shield tag and no cap side slogan. Do not place label or garment orders.

Complete all established draft setup and verification work. Use supplier templates and a dimensioned proof to resolve missing manufacturing inputs; do not guess or certify a placeholder. Ask the owner only for material unresolved decisions after preparing concrete options, not for colors already authorized. Capture fresh account timestamps and evidence, exact art hashes, dimensions, label attachment and per-size SKUs in each verification-record.json. Source records dated 2026-09-22 were not independently verified by the package builder.

Reconcile website supplier names/IDs only against verified designs; preserve product UUIDs, slugs, unknown prices, Coming Soon and fulfillment gates. Finish with a 14-row reconciliation table showing completed draft designs, label status, evidence, unresolved requirements and exact next action. No paid orders, sample purchase, checkout enablement or production release. Do not claim 100 percent accuracy until the actual saved designs and production proofs have been checked.
'''
write(OUT/'CLAUDE-IMPORT-PROMPT.md',prompt)
table='\n'.join(f'| [{r["package_id"].split("-",1)[0]}]({r["readme"]}) | {r["slug"].removeprefix("goool-")} | {r["website_color"]} → {r["supplier_color_candidate"]} | {r["blank"]} | {r["source_reported_design_id"] or "Pending"} |' for r in index)
write(OUT/'START-HERE.md',f'''# GOOOL Apliiq garment upload packages

Built {STAMP}. Canonical folder: {DEST}.

**10 active products / 14 colorways / 14 self-contained packages.** Original asset bytes are preserved, each package has SHA-256 checksums, and catalog coverage was checked against the local active product source. This is a reference and draft-setup handoff for Claude, not a native Apliiq ZIP importer or a claim of manufacturing approval.

Read [OWNER-DECISIONS.md](OWNER-DECISIONS.md), [SOURCE-CONFLICTS.md](SOURCE-CONFLICTS.md), then [CLAUDE-IMPORT-PROMPT.md](CLAUDE-IMPORT-PROMPT.md). Each package includes SPEC.md, spec.json, original face-specific artwork or explicit reference-only candidates, legacy PDF/text, label concept/source, supplier record, import-plan.json, verification-record.json, and checksums. ZIP copies are in archives/. Missing production inputs are null and called out explicitly.

## Catalog coverage

| Package | Product | Website → supplier color candidate | Blank | Recorded design ID |
|---|---|---|---|---|
{table}

## Readiness

Eight core colorways have source-reported verified supplier designs; Minimal Club has a saved design needing a color fix; five designs have no recorded ID. None is verified by this build to carry the newly selected label. Label flat art/service/proof, circular artwork resolution and placement, and performance measurements remain open. The source reconciliation's future date is flagged, not accepted as independent proof.

The owner has authorized choosing the closest available supplier color for the same garment. Athletic Heather is the AS Colour 5150 candidate. Exact swatches and IDs still need checking.

## Integrity check

Run `python verify-packages.py` from this folder (Python standard library only). It validates packaged bytes, archive contents, catalog coverage, and source freshness when the GOOOL source folder is available. It does not sign off supplier specifications. After Claude fills verification records, their baseline hashes will change intentionally: review and issue a new package revision rather than silently treating a modified package as the original. Do not regenerate hashes merely to hide unexplained changes.

Each archive is independently usable and contains current owner decisions and references. Files under reference-only/ and label/reference-only/ are not flat production upload masters. Do not upload the ZIP itself to an artwork control. Choose the specific face file identified by the manifest only after its prerequisites are resolved.
''')
print(json.dumps({'output':str(OUT),'products':len(CAT),'packages':len(index),'source_files':len(SOURCE_RECORDS)},indent=2))
