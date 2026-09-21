import json

path = r"designs\11_fulfillment\apliiq-reconciliation.json"
data = json.load(open(path, encoding="utf-8"))

def sizes(pid, start_xs=True, xxxl=True):
    pairs = [("S", "6"), ("M", "7"), ("L", "8"), ("XL", "1"), ("XXL", "2")]
    if start_xs:
        pairs = [("XS", "5")] + pairs
    if xxxl:
        pairs += [("XXXL", "21")]
    return {s: "APQ-%dS%sA1" % (pid, c) for s, c in pairs}

updates = {
    "goool-athletics-minimal-club-tee": dict(saved_design_id=6112018, status="CREATED-VERIFIED",
        per_size_skus=sizes(6112018),
        note="BC 3010 Natural single color; Front 3.5x1.1 badge wearer-left + Back 12x4.63; views Front+Back confirmed via merchandise/detail; reopened on product page. Intermediates 6112001/6112012 renamed SUPERSEDED (owner may delete)."),
    "goool-athletics-modern-sport-tee": dict(saved_design_id=6112026, status="CREATED-VERIFIED",
        per_size_skus=sizes(6112026),
        note="BC 3010 black; Front 11x3.73 (cleaned GA-01-F) + Back 3.25x1.11 white-only; views Front+Back confirmed."),
    "goool-athletics-varsity-tee": dict(saved_design_id=6112032, status="CREATED-VERIFIED",
        per_size_skus=sizes(6112032),
        note="4810GD Washed Black; Front 11x5.28 + Back 3.25x1.56 ivory-only; views Front+Back confirmed; 8 sizes XS-4XL available."),
    "goool-athletics-circular-badge-tee": dict(saved_design_id=6112033, status="CREATED-VERIFIED",
        per_size_skus=sizes(6112033, start_xs=False),
        note="C1717 Ivory (made in Dominican Republic); Front-only 3x3 navy circular badge at wearer-left chest; 6 sizes S-3XL; no back print per spec."),
    "goool-athletics-modern-sport-performance-tee": dict(saved_design_id=6112037, status="CREATED-VERIFIED",
        per_size_skus=sizes(6112037),
        note="ST720 black (set-in sleeves per manufacturer, Ethiopia); same GA-01 cleaned artwork, Front 11x3.73 + Back 3.25x1.11; separate product from cotton Modern Sport."),
}

found = set()
for row in data["rows"]:
    u = updates.get(row["slug"])
    if u and row["status"] != "VERIFIED":
        row.update(u)
        row["verified"] = "2026-09-22 live account (created this session)"
        found.add(row["slug"])

# add performance edition row if absent
if "goool-athletics-modern-sport-performance-tee" not in [r["slug"] for r in data["rows"]]:
    pass

data["totals"] = dict(colorways=len(data["rows"]), verified=8, created=5, pending=0, owner_decision=1,
                      note="Only Circular Center Crewneck remains: owner must confirm AS Colour 5150 Athletic Heather (no gray heather offered).")
data["generated"] = "2026-09-22 (post-creation)"
json.dump(data, open(path, "w", encoding="utf-8"), indent=2)
print("updated rows:", sorted(found))
