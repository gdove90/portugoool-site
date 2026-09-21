# GOOOL Apliiq garment upload packages

Built 2026-09-21T06:52:56.677776+00:00. Canonical folder: C:\Users\gdove\OneDrive\Desktop\GOOOL\designs\apliiq-upload-packages-2026-09-21.

**10 active products / 14 colorways / 14 self-contained packages.** Original asset bytes are preserved, each package has SHA-256 checksums, and catalog coverage was checked against the local active product source. This is a reference and draft-setup handoff for Claude, not a native Apliiq ZIP importer or a claim of manufacturing approval.

Read [OWNER-DECISIONS.md](OWNER-DECISIONS.md), [SOURCE-CONFLICTS.md](SOURCE-CONFLICTS.md), then [CLAUDE-IMPORT-PROMPT.md](CLAUDE-IMPORT-PROMPT.md). Each package includes SPEC.md, spec.json, original face-specific artwork or explicit reference-only candidates, legacy PDF/text, label concept/source, supplier record, import-plan.json, verification-record.json, and checksums. ZIP copies are in archives/. Missing production inputs are null and called out explicitly.

## Catalog coverage

| Package | Product | Website → supplier color candidate | Blank | Recorded design ID |
|---|---|---|---|---|
| [01](packages/01-goool-performance-tee-black/SPEC.md) | performance-tee | Black → Black | Sport-Tek ST720 | 6098962 |
| [02](packages/02-goool-performance-tee-white/SPEC.md) | performance-tee | White → White | Sport-Tek ST720 | 6099046 |
| [03](packages/03-goool-performance-tee-true-royal/SPEC.md) | performance-tee | True Royal → true royal | Sport-Tek ST720 | 6099129 |
| [04](packages/04-goool-heavyweight-hoodie-black/SPEC.md) | heavyweight-hoodie | Black → Black | Independent Trading Co. IND4000 | 6098974 |
| [05](packages/05-goool-heavyweight-hoodie-bone/SPEC.md) | heavyweight-hoodie | Bone → Bone | Independent Trading Co. IND4000 | 6099064 |
| [06](packages/06-goool-heavyweight-casual-tee-washed-black/SPEC.md) | heavyweight-casual-tee | Washed Black → Washed Black | Bella+Canvas 4810GD | 6098963 |
| [07](packages/07-goool-heavyweight-casual-tee-washed-grey/SPEC.md) | heavyweight-casual-tee | Washed Grey → Washed Grey | Bella+Canvas 4810GD | 6099060 |
| [08](packages/08-goool-touchline-cap-black-natural/SPEC.md) | touchline-cap | Black/Natural → Black/Natural | OTTO 31-069 | 6098980 |
| [09](packages/09-goool-athletics-modern-sport-tee-black/SPEC.md) | athletics-modern-sport-tee | Black → Black | Bella+Canvas 3010 | Pending |
| [10](packages/10-goool-athletics-varsity-tee-washed-black/SPEC.md) | athletics-varsity-tee | Washed Black → Washed Black | Bella+Canvas 4810GD | Pending |
| [11](packages/11-goool-athletics-minimal-club-tee-natural/SPEC.md) | athletics-minimal-club-tee | Natural → Natural | Bella+Canvas 3010 | 6112002 |
| [12](packages/12-goool-athletics-circular-badge-tee-ivory/SPEC.md) | athletics-circular-badge-tee | Ivory → Ivory | Comfort Colors C1717 | Pending |
| [13](packages/13-goool-athletics-circular-center-crewneck-gray-heather/SPEC.md) | athletics-circular-center-crewneck | Gray Heather → Athletic Heather | AS Colour 5150 Made Crew | Pending |
| [14](packages/14-goool-athletics-modern-sport-performance-tee-black/SPEC.md) | athletics-modern-sport-performance-tee | Black → Black | Sport-Tek ST720 | Pending |

## Readiness

Eight core colorways have source-reported verified supplier designs; Minimal Club has a saved design needing a color fix; five designs have no recorded ID. None is verified by this build to carry the newly selected label. Label flat art/service/proof, circular artwork resolution and placement, and performance measurements remain open. The source reconciliation's future date is flagged, not accepted as independent proof.

The owner has authorized choosing the closest available supplier color for the same garment. Athletic Heather is the AS Colour 5150 candidate. Exact swatches and IDs still need checking.

## Integrity check

Run `python verify-packages.py` from this folder (Python standard library only). It validates packaged bytes, archive contents, catalog coverage, and source freshness when the GOOOL source folder is available. It does not sign off supplier specifications. After Claude fills verification records, their baseline hashes will change intentionally: review and issue a new package revision rather than silently treating a modified package as the original. Do not regenerate hashes merely to hide unexplained changes.

Each archive is independently usable and contains current owner decisions and references. Files under reference-only/ and label/reference-only/ are not flat production upload masters. Do not upload the ZIP itself to an artwork control. Choose the specific face file identified by the manifest only after its prerequisites are resolved.
