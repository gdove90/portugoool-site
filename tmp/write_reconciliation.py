import json

rows = []

def row(product, color, slug, blank, design, skus, status, note=""):
    rows.append(dict(product=product, color=color, slug=slug, blank=blank,
        saved_design_id=design, per_size_skus=skus, status=status, note=note,
        verified="2026-09-22 live account" if design else None))

def sizes(pid):
    return {s: "APQ-%dS%sA1" % (pid, c) for s, c in
            [("XS", "5"), ("S", "6"), ("M", "7"), ("L", "8"), ("XL", "1"), ("XXL", "2"), ("XXXL", "21")]}

row("GOOOL Performance Badge Tee", "Black", "goool-performance-tee", "Sport-Tek ST720 (Sustainable Athletic Tee, Ethiopia)", 6098962, sizes(6098962), "VERIFIED")
row("GOOOL Performance Badge Tee", "White", "goool-performance-tee", "Sport-Tek ST720", 6099046, sizes(6099046), "VERIFIED")
row("GOOOL Performance Badge Tee", "True Royal", "goool-performance-tee", "Sport-Tek ST720", 6099129, sizes(6099129), "VERIFIED", "garmentColor true royal 2e48b6 confirmed")
row("GOOOL Core Hoodie", "Black", "goool-heavyweight-hoodie", "Independent IND4000 (China)", 6098974, sizes(6098974), "VERIFIED", "4XL S61 also available")
row("GOOOL Core Hoodie", "Bone", "goool-heavyweight-hoodie", "Independent IND4000", 6099064, sizes(6099064), "VERIFIED", "garmentColor Bone ebe3e0 confirmed")
row("GOOOL Casual Wordmark Tee", "Washed Black", "goool-heavyweight-casual-tee", "Bella+Canvas 4810GD (Nicaragua)", 6098963, sizes(6098963), "VERIFIED")
row("GOOOL Casual Wordmark Tee", "Washed Grey", "goool-heavyweight-casual-tee", "Bella+Canvas 4810GD", 6099060, sizes(6099060), "VERIFIED")
row("GOOOL Touchline Cap", "Black/Natural", "goool-touchline-cap", "OTTO 31-069 (Myanmar)", 6098980, {"OS": "APQ-6098980S34A1"}, "VERIFIED")
row("GOOOL Athletics Minimal Club Tee", "Natural", "goool-athletics-minimal-club-tee", "Bella+Canvas 3010 Heavyweight Tee (Nicaragua)", 6112002, sizes(6112002), "CREATED-NEEDS-COLOR-FIX", "Front 3.5in wearer-left and 12in back placed exactly; saved with black AND Natural colorways - black must be removed so Natural is the single color")
row("GOOOL Athletics Modern Sport Tee", "Black", "goool-athletics-modern-sport-tee", "BC 3010 black (verified available)", None, None, "PENDING-CREATE", "GA-01 masters cleaned, upload-ready")
row("GOOOL Athletics Varsity Tee", "Washed Black", "goool-athletics-varsity-tee", "BC 4810GD Washed Black (verified via 6098963)", None, None, "PENDING-CREATE")
row("GOOOL Athletics Circular Badge Tee", "Ivory", "goool-athletics-circular-badge-tee", "Comfort Colors C1717 Ivory (verified available)", None, None, "PENDING-CREATE", "master GA-CIRCLE-08 900px ready")
row("GOOOL Athletics Circular Center Crewneck", "Gray Heather", "goool-athletics-circular-center-crewneck", "AS Colour 5150 Made Crew - NO gray heather; offers black, Natural, Ink Blue, ATHLETIC HEATHER", None, None, "OWNER-DECISION", "Athletic Heather is the only heather gray; awaiting owner confirmation")
row("GOOOL Athletics Modern Sport Performance Tee", "Black", "goool-athletics-modern-sport-performance-tee", "Sport-Tek ST720 black (verified via 6098962)", None, None, "PENDING-CREATE", "set-in sleeve construction per manufacturer; renders showing raglan are wrong")

out = dict(generated="2026-09-22",
    workflow="authenticated Chrome session via claude-in-chrome; old customizer; file_upload to hidden inputs; synthetic MouseEvent drags on .svgWrap; /merchandise/detail for SKUs",
    totals=dict(colorways=len(rows), verified=8, created=1, pending=4, owner_decision=1),
    rows=rows)
open(r"designs\11_fulfillment\apliiq-reconciliation.json", "w", encoding="utf-8").write(json.dumps(out, indent=2))
print("written", len(rows), "rows")
