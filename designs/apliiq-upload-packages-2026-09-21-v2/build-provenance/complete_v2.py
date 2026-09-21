"""Create code-native SVG print assets and dimensioned proof sheets; preserve original raster files."""
from pathlib import Path
from PIL import Image
import json, hashlib, shutil, html, datetime, zipfile

PROJECT=Path('C:/Users/gdove/OneDrive/Desktop/GOOOL')
OLD=PROJECT/'designs/apliiq-upload-packages-2026-09-21'
OUT=Path(__file__).resolve().parent.parent/'apliiq-upload-packages-2026-09-21-v2'
NOW=datetime.datetime.now(datetime.timezone.utc).isoformat()
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p,x):
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(x if isinstance(x,str) else json.dumps(x,indent=2)+'\n',encoding='utf-8')
def copy(a,b):b.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(a,b)

if not OUT.exists():shutil.copytree(OLD,OUT,ignore=shutil.ignore_patterns('archives','PACKAGE-FILES.json','VERIFICATION-RESULT.json'))
MASTER=OUT/'production-assets'
MASTER.mkdir(exist_ok=True)

def trace(source,color='#FFFFFF',crop=None,classifier=None):
    """Outline source pixel runs as SVG geometry. No raster edits or invented detail.
    Alpha coverage >=128 defines the design silhouette. Record source and resulting bounds.
    """
    im=Image.open(source).convert('RGBA'); pix=im.load()
    x0,y0,x1,y1=crop or (0,0,im.width,im.height)
    runs={}; covered=0; lowx=im.width;lowy=im.height;highx=0;highy=0
    for y in range(y0,y1):
        start=None;last=None
        for x in range(x0,x1+1):
            c=None
            if x<x1:
                r,g,b,a=pix[x,y]
                if a>=128:c=classifier(r,g,b) if classifier else color
            if c!=last:
                if last is not None:
                    runs.setdefault(last,[]).append((start,y,x-start))
                    covered+=x-start;lowx=min(lowx,start);lowy=min(lowy,y);highx=max(highx,x);highy=max(highy,y+1)
                start=x if c else None;last=c
    assert covered>0
    paths=''.join(f'<path fill="{c}" d="'+''.join(f'M{x-lowx} {y-lowy}h{w}v1h{-w}z' for x,y,w in rr)+'"/>' for c,rr in runs.items())
    return paths, {'source':str(source.relative_to(PROJECT)), 'source_sha256':sha(source),'source_pixels':list(im.size),'source_crop':crop,'source_alpha_threshold':128,'outline_bbox_px':[lowx,lowy,highx,highy],'outline_width_px':highx-lowx,'outline_height_px':highy-lowy,'covered_source_pixels':covered,'path_run_area_px':sum(w for rr in runs.values() for _,_,w in rr),'vectorization':'Unsmoothed source-pixel run outlines; threshold edges may differ by a pixel. No invented resolution, new lettering or smoothing. Compare proof to source.'}

assets={}
circle=PROJECT/'designs/16_goool_athletics/logos/GOOOL_ATHLETICS_CIRCULAR_WORDMARK_1254px.png'
for key,color,width in [('GA-CIRCLE-08-NAVY', '#0E2B4C',3),('GA-CIRCLE-09-FOREST','#0A371E',2.5)]:
    paths,meta=trace(circle,color);w=meta['outline_width_px'];h=meta['outline_height_px'];height=width*h/w
    name=key+'-PRINT.svg'
    write(MASTER/name,f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}in" height="{height:.9f}in" viewBox="0 0 {w} {h}"><title>{key}: source-derived print artwork</title>{paths}</svg>')
    meta.update(svg=name,visible_width_in=width,visible_height_in=height,color=color,equivalent_source_samples_per_inch=w/width,aspect_ratio_preserved=True,canvas_tightly_fits_artwork=True,artwork_state='prepared_for_supplier_proof_not_manufacturing_approved')
    assets[key]=meta

nav=PROJECT/'public/brand/goool-wordmark-white.png'
navpaths,navmeta=trace(nav,classifier=lambda r,g,b:'#C61322' if r>g*1.3 and r>b*1.3 else '#FFFFFF')
type_source=PROJECT/'designs/16_goool_athletics/print_masters/GA-03-F_1050px.png'
# The supplied Minimal Club master contains ATHLETICS below y=250, with no separate font dependency.
typepaths,typemeta=trace(type_source,'#FFFFFF',crop=[0,250,1050,331])
for inches in [1,2]:
    name=f'GOOOL-ATHLETICS-LABEL-{inches}IN-FLAT.svg'
    # 1in faithful composition; 2in is an enlarged proof alternative, not an approved size change.
    width=750; ns=width/navmeta['outline_width_px']; tw=650;ts=tw/typemeta['outline_width_px']
    top=335; nh=navmeta['outline_height_px']*ns; ty=top+nh+65
    content=f'<rect width="1000" height="1000" fill="#000000"/><g transform="translate(125 {top}) scale({ns})">{navpaths}</g><g transform="translate(175 {ty}) scale({ts})">{typepaths}</g>'
    write(MASTER/name,f'<svg xmlns="http://www.w3.org/2000/svg" width="{inches}in" height="{inches}in" viewBox="0 0 1000 1000"><title>GOOOL ATHLETICS flat label, {inches} inch square</title>{content}</svg>')
    assets[f'LABEL-{inches}IN']={'svg':name,'physical_size_in':[inches,inches],'black_continuous_background':True,'colors':['#000000','#FFFFFF','#C61322'],'navigation_geometry':navmeta,'athletics_geometry':typemeta,'safe_edge_margin_in':inches*.125,'athletics_visible_cap_height_in':typemeta['outline_height_px']*ts/1000*inches,'athletics_cap_height_pt':typemeta['outline_height_px']*ts/1000*inches*72,'service_candidate':'Full-color printed label, subject to inside-neck/per-blank approval. Woven details fail generic small-detail guidance without artist review.','state':'Nominal owner direction, supplier proof required' if inches==1 else 'Larger review alternative only; not selected for automatic application','source_silhouette_note':'Exact source-derived silhouettes at alpha >=128. Retains original extraction imperfections; does not substitute a lookalike font. Supplier proof must check clean edges at actual size.'}
write(MASTER/'ARTWORK-PROVENANCE.json',assets)

RESEARCH=[
 {'url':'https://www.apliiq.com/customize/mens/tshirts/Sustainable-Athletic-Tee','topic':'ST720 construction','finding':'Supplier lists recycled polyester, set-in sleeves and transfer printing. Static print-area table does not expose usable dimensions; verify active customizer.'},
 {'url':'https://www.apliiq.com/customize/mens/sweatshirts/Made-Crew','topic':'AS Colour 5150','finding':'Supplier lists relaxed fit, French terry, drop shoulders and inset sleeves. Exact heather composition and color availability still require variant verification.'},
 {'url':'https://help.apliiq.com/portal/en/kb/articles/how-to-prepare-artwork-for-clothing-tags-and-woven-labels','topic':'Woven label artwork','finding':'Recommends 300dpi, accepts 150dpi and SVG; max 4 square inches, up to five colors, 1mm details, 9-10pt text guidance, 1/8in sewing margin. One-inch tag detail needs review.'},
 {'url':'https://help.apliiq.com/portal/en/kb/articles/how-to-set-up-artwork-for-printed-labels','topic':'Full-color printed label artwork','finding':'PNG recommended; 150dpi minimum, 300dpi recommended; up to 2x2in; continuous background shape; unlimited colors.'},
 {'url':'https://www.apliiq.com/private-label/printed-labels-pressed-on-demand','topic':'Color-capable label service','finding':'Printed labels are DTF supplies stored and pressed on demand. This service exists, but inside-neck and exact blank/placement suitability are not established by this page.'},
 {'url':'https://help.apliiq.com/portal/en/kb/articles/placement-options-for-woven-labels','topic':'Label placement','finding':'Placement guide covers woven and heat-transfer labels across tees, hats and hoodies. Confirm the individual placement in the account; category-level guide is not blanket compatibility.'}
]
write(OUT/'SUPPLIER-RESEARCH.json',{'checked_at_utc':NOW,'scope':'Public official documentation, not account stock or saved-design verification','sources':RESEARCH})
researchmd='# Supplier guidance checked for revision 2\n\n'+ '\n\n'.join(f'[{r["topic"]}]({r["url"]}): {r["finding"]}' for r in RESEARCH)
write(OUT/'SUPPLIER-RESEARCH.md',researchmd)

revision='''# Revision 2 — missing work completed locally

Owner instruction: create the missing garment-specific work so mockups can be executed correctly for customers. This authorizes preparation of the missing artwork and measured design targets. It does not replace physical sample approval.

New: source-derived, tightly bounded circular SVG print files from the original 1254px logo (not the smaller derivatives); flat one-inch label SVG/PNG artwork plus a two-inch comparison alternative; precise new collar/center offsets for the circular pair and Modern Sport performance tee; 14 dimensioned front/back proof sheets; garment-size proof records and sample acceptance records; revised self-contained archives and integrity checks.

Circular interpretation: preserve the original slightly non-square letter arrangement and use the launch selection's visible WIDTH targets of 3in and 2.5in. Do not stretch to a mathematically perfect circle. The resulting height is recorded precisely. Source samples exceed 300 per inch at these widths. The new paths preserve the alpha>=128 source silhouette; they are unsmoothed outlines, not a promise of infinite original detail. Supplier art review is still required.

New authored placement targets: Circular Badge tee front top 3in below the bottom front collar seam, logo center 3.5in to wearer-left of body centerline; Circular Center crew front top 3.5in below bottom front collar seam, centered on body; Modern Sport performance front visible width 9in, top 3in below bottom front collar seam; rear visible width 3.25in, top 2in below bottom rear collar seam. These are deliberate design targets created in this revision, not measured from photographs and not yet supplier-verified. Check each offered size's actual print area and collar shape before saving settings.

Label: the flat artwork now exists. Default remains the one-inch black square with navigation lettering and segmented line. Two-inch artwork is a comparison alternative only. Full-color printed labels are a documented candidate service, but support for inside-neck placement on every blank is unverified. The one-inch concept's tiny details do not meet generic woven-label guidance; never silently weave an illegible reduction. An artist must resolve service/detail/size before application. Printed transfer appearance differs from sewn woven texture in the concept. Keep that difference explicit in proof review. Do not substitute a black-only satin private label.

All original artwork remains preserved. No mockups were represented as actual product photographs. No Apliiq account changes, orders, supply purchases, samples or launch changes were made by this revision.
'''
write(OUT/'REVISION-2.md',revision)
labelread='''# Flat GOOOL ATHLETICS brand-label artwork — revision 2

`artwork/GOOOL-ATHLETICS-LABEL-1IN-FLAT.svg` and its PNG export are newly prepared flat artwork. The two-inch version is a larger comparison option, not an authorized automatic size change. `reference-only/approved-tag-concept.png` remains the visual reference; never upload that scene as the label.

The flat artwork uses the exact navigation source silhouettes, three separate white/red/white underline sections, and source-derived ATHLETICS lettering. All lettering is outlined, so no installed font is required. Background is solid black. Margins are 1/8in for the nominal one-inch size; artwork provenance records geometry and actual small-letter height. The source navigation raster contains extraction artifacts retained by faithful outlining; inspect their physical appearance in the print proof rather than assume a new SVG is automatically pristine.

Apliiq's full-color printed-label service is a candidate for preserving the nominal one-inch layout and red segment. It is a heat-transfer label, not the sewn woven texture shown in the concept. Verify interior placement, heat/process compatibility and comfort for the exact blank. One-inch woven production needs an artist's detail/legibility resolution; a two-inch proof alternative is supplied but must not silently replace the selected size. Keep accurate care, fiber, origin and size information available. Brand artwork alone does not replace those details.

Before application, record chosen service, final dimensions, flat-art hash, supply ID, interior location, supplier proof and compatibility. Then verify the label is attached to this saved design and its relevant variants. Do not buy inventory or mark the label applied from the presence of these files.
'''

index=read(OUT/'CATALOG-INDEX.json')
for e in index['packages']:
    b=OUT/Path(e['spec']).parent;s=read(b/'spec.json');slug=s['product']['slug']
    write(b/'REVISION-2.md',revision);write(b/'SUPPLIER-RESEARCH.md',researchmd)
    write(b/'label/README.md',labelread)
    for key in ['LABEL-1IN','LABEL-2IN']:
        copy(MASTER/assets[key]['svg'],b/'label/artwork'/assets[key]['svg'])
    write(b/'label/artwork/ARTWORK-PROVENANCE.json',{k:assets[k] for k in ['LABEL-1IN','LABEL-2IN']})
    s['schema_version']='2.0';s['revision_built_at_utc']=NOW
    s['label'].update(flat_upload_master='label/artwork/GOOOL-ATHLETICS-LABEL-1IN-FLAT.svg',flat_png_export='label/artwork/GOOOL-ATHLETICS-LABEL-1IN-FLAT.png',flat_artwork_prepared=True,supplier_service_candidate='Apliiq full-color printed label; inside-neck compatibility and material appearance require proof',supplier_service=None,alternate_review_size_in=2)
    s['unresolved_requirements']=[x for x in s['unresolved_requirements'] if not any(t in x for t in ['Brand label flat master','Circular artwork has only','Resolve diameter','Performance front 9in'])]
    s['unresolved_requirements']+=['Label artwork is prepared; select a compatible service, verify small-detail legibility and inside placement, obtain supply ID and production proof before applying. One-inch woven layout is not automatically viable.']
    if 'circular' in slug:
        key='GA-CIRCLE-08-NAVY' if 'badge-tee' in slug else 'GA-CIRCLE-09-FOREST';a=assets[key]; old=s['decoration']['artwork'][0]
        copy(MASTER/a['svg'],b/'artwork'/a['svg'])
        write(b/'artwork/ARTWORK-PROVENANCE.json',a)
        s['decoration']['legacy_reference_artwork']=s['decoration']['artwork']
        s['decoration']['artwork']=[{'face':'front','path':'artwork/'+a['svg'],'png_export_path':'artwork/'+a['svg'].replace('.svg','.png'),'sha256':sha(MASTER/a['svg']),'asset_type':'source-derived_svg_outlines','source_project_path':a['source'],'source_sha256':a['source_sha256'],'visible_width_in':a['visible_width_in'],'proportional_visible_height_in':a['visible_height_in'],'horizontal_offset_wearer_left_in':3.5 if 'badge-tee' in slug else 0,'horizontal_position':'artwork center 3.5in wearer-left of body centerline (viewer right)' if 'badge-tee' in slug else 'body centerline','vertical_offset_in':3 if 'badge-tee' in slug else 3.5,'vertical_anchor':'top of visible artwork below bottom front collar seam','dimension_status':'new_authored_design_target_supplier_proof_required','effective_source_samples_per_inch':a['equivalent_source_samples_per_inch'],'canvas_width_in_for_target_visible_width':a['visible_width_in'],'visible_top_inset_in_at_target':0,'usage':'draft_upload_candidate_supplier_artwork_and_placement_proof_required'}]
        s['unresolved_requirements']+=['Verify newly authored collar/center offsets and original non-square aspect ratio on all offered sizes. SVG outline edge and color proof required.']
    elif slug=='goool-athletics-modern-sport-performance-tee':
        for a in s['decoration']['artwork']:
            original=b/a['path'];new='artwork/'+original.name;copy(original,b/new);a['path']=new
            a['dimension_status']='new_authored_design_target_supplier_proof_required';a['vertical_offset_in']=3 if a['face']=='front' else 2;a['horizontal_offset_wearer_left_in']=0;a['usage']='draft_upload_candidate_supplier_artwork_and_placement_proof_required'
        s['unresolved_requirements']+=['Verify authored 9in front/3.25in rear with 3in/2in collar offsets on ST720 S-2XL, including polyester process and actual print-area approval.']
    for a in s['decoration']['artwork']:
        if 'horizontal_offset_wearer_left_in' not in a:a['horizontal_offset_wearer_left_in']=3.5 if slug=='goool-athletics-minimal-club-tee' and a['face']=='front' else 0
        a['width_mm']=round(a['visible_width_in']*25.4,4);a['height_mm']=round(a['proportional_visible_height_in']*25.4,4);a['vertical_offset_mm']=round(a['vertical_offset_in']*25.4,4) if a['vertical_offset_in'] is not None else None
    s['release'].update(local_artwork_and_placement_package_complete=True,all_manufacturing_specs_final=False,ready_for_unattended_upload=False)
    s['execution_policy']={'reference_mockups':'Visual intent only; supplier blank and dimensions control manufacturing. Update misleading mockup construction before sale.','per_size_scaling':'Use stated width across offered sizes only if verified to fit. If supplier scales any size, capture exact dimensions and review representative proof; no silent scaling.','customer_release_rule':'Do not sell this color/size until correct saved design/variant, front/back art and size, label, material/fit, sample and product imagery are verified.','no_invented_sample_results':True}
    write(b/'spec.json',s)
    rec=read(b/'verification-record.json');rec['per_size_proof']={z:{'actual_blank_measurements':None,'front_print_area_in':None,'back_print_area_in':None,'requested_art_fits':None,'actual_front_art_width_in':None,'actual_back_art_width_in':None,'label_compatible':None,'proof_evidence':None} for z in s['product']['website_sizes']};rec['mockup_matches_actual_blank_and_decoration']=None
    write(b/'verification-record.json',rec)
    sample={'package_id':e['package_id'],'sample_received':False,'sample_size':None,'sample_order_id':None,'blank_brand_model_and_color_match':None,'front_back_spelling_and_geometry_match':None,'measurements_within_spec_tolerances':None,'decoration_process_and_handfeel_acceptable':None,'no_bleed_cracking_peeling_or_seam_obstruction':None,'label_legible_secure_and_comfortable':None,'garment_care_fiber_origin_size_information_correct':None,'after_care_test_photos':[],'shrinkage_and_print_change_observations':None,'final_customer_photography':[],'owner_written_sample_approval':None,'release_approved':False}
    write(b/'SAMPLE-ACCEPTANCE.json',sample)
    # Replace conflicting current instructions while retaining original references for provenance.
    write(b/'SOURCE-CONFLICTS.md','# Current revision\n\nRead REVISION-2.md first. The following are historical findings from v1; circular resolution, missing collar targets and flat label artwork have now been addressed locally. Supplier verification and label service/proof remain open.\n\n'+(b/'SOURCE-CONFLICTS.md').read_text(encoding='utf-8'))
    plan=read(b/'import-plan.json');plan['revision']='2';plan['steps'][0]='Read REVISION-2.md, SPEC.md, spec.json, OWNER-DECISIONS.md and label/README.md; verify SHA256SUMS.json. PNG exports are provided for the new SVG artwork.';plan['steps']=[step.replace('Prepare matching flat label master','Use the prepared flat label artwork and resolve the service/material/size proof').replace('Resolve null placement fields using supplier templates and dimensioned proof, never guessed drag coordinates.','Verify newly authored placement targets using supplier templates and dimensioned proofs; never use guessed drag coordinates.') for step in plan['steps']];write(b/'import-plan.json',plan)
    e.update(revision=2,flat_label_artwork_prepared=True,placement_targets_complete=all(a['vertical_offset_in'] is not None for a in s['decoration']['artwork']),production_approved=False)
    lines=[f'# {s["product"]["name"]} — {s["product"]["website_color"]}', '', '**Revision 2: local artwork and placement package prepared; supplier proof/sample not approved.**', '',f'Blank: {s["garment"]["brand_model"]}. Exact supplier color candidate: {s["garment"]["supplier_color_candidate"]}. Sizes: {", ".join(s["product"]["website_sizes"])}.', '',f'Recorded design ID: {s["supplier_record"]["source_reported_design_id"] or "not created"}. Reopen and verify it; do not assume old records include the new label.', '', 'See [PLACEMENT-PROOF.html](PLACEMENT-PROOF.html) for front/back views and measurements. The diagrams are technical layouts, not verified garment pattern drawings. Physical dimensions govern; silhouettes are illustrative.', '', '## Decoration specification', '', '| Face | Visible width x height (in) | Vertical anchor / offset | Horizontal position | Artwork |','|---|---|---|---|---|']
    for a in s['decoration']['artwork']:lines.append(f'| {a["face"]} | {a["visible_width_in"]:.3f} x {a["proportional_visible_height_in"]:.3f} | {a["vertical_offset_in"]:.3f}: {a["vertical_anchor"]} | {a["horizontal_position"]} | [{Path(a["path"]).name}]({a["path"]}) |')
    lines+=['',f'Method: {s["decoration"]["method"]}. Back: {s["decoration"]["back"]}. Sleeves blank; cap sides/rear blank. Preserve aspect ratio and exact three-O spelling. Dimensions apply to visible artwork. Existing PNG transparent insets are recorded in spec.json; new circular artwork is tightly bounded.', '', '## Label', '', 'Flat one-inch SVG and PNG now supplied in label/artwork/. Read label/README.md for color-capable service, actual small-text size and woven limitations. Two-inch variant is a comparison alternative only. Verify the service, garment-specific interior position and attachment proof.', '', '## Customer release requirements', '']+[f'- {x}' for x in s['unresolved_requirements']]+['','Complete verification-record.json for every offered size and SAMPLE-ACCEPTANCE.json from actual sample evidence. No blank, color or print-process substitution without a recorded decision. Reconcile customer photos with the verified garment before launch. No sales/fulfillment activation or paid orders from this package.','']
    write(b/'SPEC.md','\n'.join(lines))

index.update(revision=2,revision_built_at_utc=NOW);write(OUT/'CATALOG-INDEX.json',index)
write(OUT/'SOURCE-CONFLICTS.md','# Current source conflict resolution\n\nRead REVISION-2.md. It supersedes v1 warnings about missing flat label art, low-resolution circular candidates and null placement targets. Supplier account evidence, label service/material/size, proof and sample acceptance remain unresolved. Historical findings are preserved in the per-package references.\n')
oldprompt=(OUT/'CLAUDE-IMPORT-PROMPT.md').read_text(encoding='utf-8')
write(OUT/'CLAUDE-IMPORT-PROMPT.md',f'''Work in C:\\Users\\gdove\\OneDrive\\Desktop\\GOOOL. Use designs/{OUT.name}/ as the CURRENT package revision. Read START-HERE.md, REVISION-2.md, SUPPLIER-RESEARCH.md and CATALOG-INDEX.json, then each package's SPEC.md, spec.json, PLACEMENT-PROOF.html, label/README.md and import-plan.json. Run verify-packages.py first. The earlier v1 package is preserved for history and is superseded for artwork/placement by v2.

The owner asked us to create missing garment-specific work so customer garments execute the mockups correctly. Missing flat label art, higher-detail circular masters and measured placement targets are now supplied. Use the specific PNG export or original image named by the manifest. Do not upload a reference scene or a ZIP to an artwork field. Review SVG artwork provenance; outlining existing source pixels does not certify manufacturing approval.

Complete all 14 colorways/10 products using the prior Apliiq workflow skill if available. Reopen the eight source-reported core designs, correct Minimal Club 6112002's unintended Black variant and verify its Natural SKUs, and create the five missing saved designs after checking their inputs. Keep Modern Sport cotton and ST720 performance separate. Use the exact same blank and closest actual Apliiq color to the mockup, as already authorized; Athletic Heather is the 5150 candidate. Verify swatches and sizes, never infer IDs/SKUs.

Use v2's dimensioned targets on the supplier templates. Circular tee: 3in visible width, top3in below front collar seam, center3.5in wearer-left. Circular crew: 2.5in visible width, top3.5in below front collar seam, centered. Modern Sport performance: front9in/top3in, rear3.25in/top2in, centered. These newly authored targets need real-blank print-area confirmation on every offered size. Preserve the slightly non-square circular-letter arrangement; do not stretch. Smallest and largest sizes require representative proofs. Record any supplier auto-scaling and actual measurements before accepting it.

Use the new one-inch flat navigation GOOOL ATHLETICS tag artwork: THREE Os, white/red/white segmented line, white ATHLETICS, black square. Confirm label service, material, legibility and interior placement on each blank, including the cap. A full-color printed label is a documented candidate; it is a transfer and does not reproduce a sewn woven texture. A one-inch woven tag's fine details need artist resolution. The supplied two-inch version is only an alternative to review, not an automatic substitution. Preserve garment information. Obtain the label supply ID and attachment proof; do not purchase inventory.

Fill verification-record.json, including per_size_proof, from actual account evidence and fresh timestamps. Verify the saved design after reopening it: blank/model, single intended color, every offered size/SKU, exact art hash, front/back dimensions and offsets, blank areas, label. Source reconciliation dates are not verification by this package builder. Keep cap side slogan removed.

Use SAMPLE-ACCEPTANCE.json to record actual sample results and written owner sample approval. Confirm print spelling, placement, feel, durability under the garment's care instructions, label comfort/legibility, fiber/size/origin details, and faithful customer imagery. Keep Coming Soon/fulfillment gates until all applicable checks pass. Do not invent sample results, buy garments, enable checkout or release production. Update model imagery only to match verified blanks and artwork; generated concepts are not actual sample photos.

Finish with a 14-row status table linking saved design evidence, exact variant SKUs, label evidence, unresolved supplier inputs and next actions. Ask only for concrete unresolved decisions after preparing the available options. Do not ask again for the closest-color permission already given.
''')
write(OUT/'START-HERE.md',f'''# GOOOL garment execution package — revision 2

Current canonical path: C:/Users/gdove/OneDrive/Desktop/GOOOL/designs/{OUT.name}

**14 colorways / 10 active products.** Missing local artwork and measured placement targets are prepared. See [REVISION-2.md](REVISION-2.md) for the exact changes and their limits. Individual self-contained packages and ZIPs include dimensioned front/back proof sheets, artwork, label files, supplier records, per-size verification and physical sample acceptance forms.

- [Visual catalog and garment proofs](CATALOG-PROOFS.html)
- [Claude execution prompt](CLAUDE-IMPORT-PROMPT.md)
- [Catalog manifest](CATALOG-INDEX.json)
- [Supplier research](SUPPLIER-RESEARCH.md)
- [Artwork provenance](production-assets/ARTWORK-PROVENANCE.json)

Run `python verify-packages.py` to check packaged bytes, archive integrity, artwork exports and coverage. Read verification scope: local file checks are not Apliiq account verification or a manufacturing sign-off. The new label service/size/material decision, per-blank supplier proofs and physical sample approval remain required. No customer orders should be released based solely on a mockup or a filled specification.

V1 remains archived unchanged. Use v2 for the current art and placement targets. Original archived files with older instructions do not override the current owner decisions or REVISION-2.md.
''')
write(OUT/'REVISION-CHANGELOG.json',{'revision':2,'built_at_utc':NOW,'previous_package':str(OLD),'owner_request':'Create the missing work for each garment so customers get proper garments matching the mockups.','artwork_created':list(assets),'new_targets':{'circle_tee':[3,3,3.5],'circle_crew':[2.5,3.5,0],'modern_performance_front':[9,3,0],'modern_performance_back':[3.25,2,0]},'coordinate_order':['visible_width_in','top_below_bottom_collar_seam_in','center_wearer_left_in'],'supplier_account_modified':False,'physical_samples_verified':False})
copy(Path(__file__),OUT/'build-provenance/complete_v2.py')
print(json.dumps({'out':str(OUT),'assets':list(assets),'packages':len(index['packages'])}))
