from pathlib import Path
import json,hashlib,shutil,re,datetime
R=Path(__file__).resolve().parent.parent/'apliiq-upload-packages-2026-09-21-v2';P=Path('C:/Users/gdove/OneDrive/Desktop/GOOOL')
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def write(p,x):p.write_text(x if isinstance(x,str) else json.dumps(x,indent=2)+'\n',encoding='utf-8')
rec=read(P/'designs/11_fulfillment/apliiq-reconciliation.json');idx=read(R/'CATALOG-INDEX.json');srcs=read(R/'SOURCE-FILES.json')
for rel in ['src/lib/fulfillment.ts','designs/11_fulfillment/apliiq-reconciliation.json','designs/11_fulfillment/APLIIQ-CATALOG-AUDIT.md']:
    p=P/rel;shutil.copy2(p,R/'source-snapshot'/rel);srcs['files'][rel]={'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size}
srcs['source_refresh_at_utc']=datetime.datetime.now(datetime.timezone.utc).isoformat();write(R/'SOURCE-FILES.json',srcs)
notice='''# Saved-design update discovered during final verification

Claude's reconciliation now reports 13 saved colorway designs, with only the AS Colour 5150 crewneck lacking a recorded ID. These are source-reported account results, not independently rechecked by this package builder. The reported dates still say 2026-09-22.

- Modern Sport cotton: 6112026; Varsity: 6112032; Minimal Club Natural: 6112018. Minimal Club's earlier extra-color problem is reported resolved. Do not use 6112002 or create a duplicate.
- Circular Badge Ivory: 6112033. Existing record says front 3x3in using the older padded 900px art. A 3in canvas yields only about 2.24in of visible lettering (alpha>=1 bounds), so reopen and inspect the actual file. Use v2's tightly bounded PNG and explicit 3in visible width; proportional height 3.0324675in. This is an artwork/size correction with a fresh placement proof, not a claim that the earlier design already matches.
- Modern Sport performance: 6112037. Existing record says front 11x3.73in. The earlier performance concept proposed 9in; v2 develops that as the authored visible-width target, with 3in front collar offset and 3.25in rear width/2in rear collar offset. Reconcile the saved 11in design to the v2 dimensioned proof before approval. Do not call the 9in target a measurement from the mockup or an owner-approved physical sample.
- Crewneck: closest same-blank color is already authorized. Use AS Colour 5150 Athletic Heather as the swatch candidate and prepare its design. Do not wait on the superseded Gray Heather naming question.

Every saved design still needs the new label service/attachment and v2 proof review. Verify old placement calibration against actual collar measurements; the reported print-box convention is not a physical sample measurement. Record exact size-specific IDs from the account; source-reported IDs remain non-executable in this package until verified.
'''
write(R/'SAVED-DESIGN-UPDATES.md',notice)
for e in idx['packages']:
    b=R/Path(e['spec']).parent;s=read(b/'spec.json');row=next(x for x in rec['rows'] if x['slug']==e['slug'] and x['color']==e['website_color'])
    write(b/'reference-only/supplier-record.json',row);write(b/'SAVED-DESIGN-UPDATES.md',notice)
    s['supplier_record']['source_reported_status']=row['status'];s['supplier_record']['source_reported_design_id']=row['saved_design_id'];s['supplier_record']['reported_skus_for_website_sizes']={size:(row.get('per_size_skus') or {}).get(size) for size in s['product']['website_sizes']};s['supplier_record']['source_reported_note']=row['note']
    s['unresolved_requirements']=[x for x in s['unresolved_requirements'] if '6112002' not in x]
    if e['slug']=='goool-athletics-circular-badge-tee':s['unresolved_requirements']+=['Reopen 6112033: recorded 3x3in older padded artwork can undersize the visible badge. Replace with tightly bounded v2 print file at 3in visible width / 3.0324675in height and verify placement.']
    if e['slug']=='goool-athletics-modern-sport-performance-tee':s['unresolved_requirements']+=['Reopen 6112037: source reports 11in front. Reconcile to the v2 authored 9in concept target and record measured proof before approval.']
    write(b/'spec.json',s)
    e['source_reported_design_id']=row['saved_design_id'];e['source_reported_status']=row['status']
    md=(b/'SPEC.md').read_text(encoding='utf-8');md=re.sub(r'Recorded design ID: .*?\. Reopen',f'Recorded design ID: {row["saved_design_id"] or "not created"}. Reopen',md)
    md='\n'.join(line for line in md.splitlines() if '6112002' not in line)+'\n\nRead [SAVED-DESIGN-UPDATES.md](SAVED-DESIGN-UPDATES.md): newer supplier IDs were incorporated during final verification. The performance 11in versus 9in target and circular canvas-versus-visible-size differences require correction/proof.\n'
    write(b/'SPEC.md',md)
write(R/'CATALOG-INDEX.json',idx)
prompt=(R/'CLAUDE-IMPORT-PROMPT.md').read_text(encoding='utf-8')
prompt=prompt.replace('correct Minimal Club 6112002\'s unintended Black variant and verify its Natural SKUs, and create the five missing saved designs after checking their inputs.','use the newly reported IDs in SAVED-DESIGN-UPDATES.md (including resolved Minimal Club Natural 6112018), and create only the crewneck if it still has no saved design. Reopen circular tee 6112033 to correct its padded-artwork sizing and performance tee 6112037 to reconcile the saved 11in front with the v2 authored 9in target. Do not create duplicate designs.')
prompt=prompt.replace('then each package\'s SPEC.md','read SAVED-DESIGN-UPDATES.md for the refreshed IDs and required saved-design corrections, then each package\'s SPEC.md')
write(R/'CLAUDE-IMPORT-PROMPT.md',prompt)
for file in ['START-HERE.md','REVISION-2.md']:
    text=(R/file).read_text(encoding='utf-8');text+='\n\nLatest source refresh: [SAVED-DESIGN-UPDATES.md](SAVED-DESIGN-UPDATES.md) records 13 saved colorways and one missing crewneck, plus the performance-width and circular-canvas corrections required before approval.\n';write(R/file,text)
for b in (R/'packages').iterdir():
    for file in ['REVISION-2.md']:
        shutil.copy2(R/file,b/file)
shutil.copy2(Path(__file__),R/'build-provenance/refresh_v2_sources.py')
print(json.dumps({'saved_designs':sum(x['source_reported_design_id'] is not None for x in idx['packages']),'not_yet_recorded':sum(x['source_reported_design_id'] is None for x in idx['packages'])}))
