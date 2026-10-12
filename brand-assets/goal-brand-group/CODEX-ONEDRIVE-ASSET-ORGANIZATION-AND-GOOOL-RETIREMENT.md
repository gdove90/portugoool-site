# CODEX MASTER PROMPT — IMPLEMENT GOAL BRAND GROUP'S ORGANIZED ONEDRIVE LIBRARY

**Execute the work, do not merely recommend steps.**  
**Priority:** Safe local file organization + removal of outdated `GOOOL`-spelled logos from active use.  
**Target:** Existing Windows OneDrive directory displayed in File Explorer as `OneDrive > GOOOL ATHLETICS LOGOS`.  
**Source package:** `GOAL_OneDrive_Organized_Assets_v3_Codex_2026-10-12.zip`, or the included numbered folders if already extracted.  
**Scope:** LOCAL/ONEDRIVE BRAND ASSETS ONLY. No website deploys, code updates, DNS changes, Stripe edits, account modifications, supplier submissions, or legal filings.

## Your role

You are a senior Brand Operations Director, production-graphics asset librarian, and Windows/OneDrive filesystem engineer working for **GOAL Brand Group**. Your assignment is to create a durable, searchable, manufacturer-aware master brand-asset library for **GOAL Athletics** and **The Goal Collective**. Work within the user's *actual* Windows OneDrive synced directory, not a guessed path.

The user has now explicitly authorized removing from the **active library** any logo artwork that actually spells **GOOOL** (three O's). `GOAL` is the new active spelling. Handle old files safely: inventory, back up, and quarantine/archive old GOOOL logo assets rather than destroying sole original copies. Do not confuse the authentic V1.2 strike mark (which may have an old GOOOL filename) with obsolete lettering.

## FIRST: Locate the right directory and inputs

1. Discover the full filesystem location of the OneDrive folder named `GOOOL ATHLETICS LOGOS`. It may be under a personal or business OneDrive path; use File Explorer/PowerShell and OneDrive environment settings. Do NOT invent `C:\Users\...` values.
2. Confirm the directory contains the logo folders shown in the user's screenshot and is the folder backed by OneDrive (inspect sync attributes/state).
3. If more than one matching folder exists, stop and ask the user which one is canonical. Do not touch either until confirmed.
4. Locate the accompanying v3 ZIP in Downloads, the target directory, or as a Codex attachment. If missing, tell the user exactly which package to place in the folder. Do not generate substitute logos or continue with unverified assumptions.
5. Inspect ZIP filenames, its source manifest, file sizes and contents. Check for Zip Slip paths, collisions, corrupted files, symlinks, and duplicate nested parent folders; reject unsafe entries.
6. Take a before-state recursive inventory listing relative paths, byte sizes, modified times, extension, SHA-256, and whether the artwork is a logo/reference/production file. Store under `00 - START HERE/EXECUTION LOGS/<timestamp>/before.csv`. Store any file manifests on the local OneDrive folder and a safe external backup destination.

## THE LOCKED APPROVED IDENTITY — DO NOT REDESIGN

**GOAL Athletics (performance technical apparel, uniforms, equipment):**
- The exact original V1.2 two-parallel-slashes strike is the authoritative geometry, even if the original master is in an older file named `GOOOL...`. Retain/rename a *copy* in active GOAL Athletics.
- Official `GOAL ATHLETICS` wordmark: custom-looking futuristic, italic/angular GOAL; no crossbar in A; spaced `ATHLETICS` below. The source font family is **NOT** established. Never label a substitute computer font “official.”
- Mandatory horizontal arrangement: **authentic V1.2 strike + vertical divider + exact approved GOAL ATHLETICS wordmark**. Divider must be present in print and website references.
- Halo #1: open-circle halo with the original strike.
- Halo #2: circular “GOAL ATHLETICS” / “PERFORMANCE LIVES HERE” badge with original strike.
- `WEAR THE FEELING.` is brand language. Do not merge it into a logo unless specifically defined for that export.
- Clean traced screenshot vector files are *PROOF ONLY*, not designer-certified manufacturer source masters. Preserve provenance labels in filenames, docs, and inventories.

**The Goal Collective (lifestyle / yoga / athleisure for men and women):**
- Women's lettering #1 is the **interlocking `TGC`** from the user's circled design; connected G and C symbolize unity.
- Women's lettering #2 is the lighter/thinner `TGC` secondary version.
- Men's lettering uses the heavier technical/futuristic TGC direction.
- The **Motion Thread** symbol is the women's official standalone logo direction from the approved board. The Collective Halo remains an available complementary/shared identity treatment; do not replace Motion Thread silently.
- Do not confuse the women's TGC lettering with the separate standalone symbol. Keep reference artwork, proofs, and vectors separately.
- Do not claim screenshot-derived concepts are production vector masters until a graphic designer has recreated and approved them.

**GOAL Brand Group LLC** is the planned legal entity. Its registration and trademark clearances are not established by this file-reorganization task.

## REQUIRED ORGANIZED FOLDER TREE

Inside the existing OneDrive root, ensure (idempotently) these folders and their suitable children exist:

    00 - START HERE/
        CODEX_MASTER_PROMPT - IMPLEMENT AND CLEAN GOAL ONEDRIVE ASSETS.md
        README - GOAL BRAND ASSETS.txt
        HOW TO INSTALL IN ONEDRIVE.txt
        MANIFEST-SHA256.json
        EXECUTION LOGS/<timestamp>/
    01 - GOAL ATHLETICS/
        01 - OFFICIAL WORDMARK/
        02 - V1.2 STRIKE MARK/
        03 - HORIZONTAL LOCKUP - KEEP DIVIDER/
        04 - HALO BADGES/Badge 01 - Open Circle/
        04 - HALO BADGES/Badge 02 - Performance Lives Here/
        05 - MANUFACTURER ARTWORK - CHECK PLACEMENT/
        06 - SOURCE REFERENCES/
    02 - THE GOAL COLLECTIVE/
        01 - OFFICIAL WOMENS SYMBOL - MOTION THREAD/
        02 - MENS LETTERING/
        03 - WOMENS LETTERING/01 - PRIMARY - INTERLOCKING TGC/
        03 - WOMENS LETTERING/02 - SECONDARY - THIN TGC/
        04 - SHARED HALO AND COMBINATIONS/
        05 - SOURCE BOARDS/
    03 - ARCHIVE - ORIGINALS RETAINED/
        Files From Original OneDrive Root/
        Original GOOOL V1.2 Source Masters/
        DEPRECATED GOOOL LETTERING - NO NEW USE/<timestamp>/
    04 - BRAND GUIDELINES & APPROVALS/
    05 - WEBSITE & DIGITAL/

Keep the existing OneDrive root directory name for now so synced links and old paths do not break. Propose renaming it later to `GOAL BRAND GROUP - BRAND ASSETS` after dependency review, but do not rename the root during this task.

## EXECUTION SEQUENCE — NO DESTRUCTIVE SHORTCUTS

### Phase A — Backup and stage

1. Confirm OneDrive is synced and has adequate space; never work from an incomplete cloud placeholder without fetching its contents.
2. Build a **timestamped original-state backup**, ideally outside the target tree to avoid a recursive copy, plus an SHA-256 manifest. If no separate backup location exists, create an immutable archive under the root with enough metadata to restore precisely. Verify backup hashes before any archival move. Never edit a file in place.
3. Inspect supplied v3 ZIP and copy numbered assets to the correct target directories. Existing destination files must **not** be overwritten: compare SHA-256; skip byte-identical; put differing collisions into a timestamped conflict folder and report them.
4. Verify the extracted file count/manifest and restore tests on sample assets. Do not run blind bulk rename scripts.

### Phase B — Identify and remove active GOOOL-spelled logos

**Explicit owner decision:** All logo artwork **visibly spelling `GOOOL`** (three consecutive O's) is retired. Remove it from the active brand library so nobody accidentally supplies it to APLIIQ, Printful, Printify or YCL.

Classify candidates by both **filename** and **actual visual content**:
- Match case-insensitive filename/path segments `GOOOL`, old GOOOL locks, logos and artwork containing the word. **Filename alone is not sufficient**: an old-named source can be the authentic text-free strike or an important reference.
- Inspect PDFs, SVG text/paths (including outlined artwork), preview thumbnails, layered masters and nested archive contents where supported. Use reliable image/visual inspection; do not pretend to recognize lettering in uninspected opaque assets.
- Exclude non-logo material such as prior invoices, legal documents, photographs, order evidence, README notes, source-history records, and supplier references solely because a legacy name appears in their text.
- Preserve the exact V1.2 strike geometry in active GOAL Athletics. If a file contains BOTH authentic strike AND old `GOOOL` wordmark, retain its original in legacy archive and use an approved strike-only file in active.
- Treat old print graphics used by open orders or active supplier URLs as **DEPENDENCY HOLD**. Do not break remote art URLs, storefront imports, external machine-design references, outstanding orders or contracts.
- For each **verified GOOOL-spelled logo** that is not under hold: after backup hash verification, move its existing OneDrive working copy from active/root folders to `03 - ARCHIVE - ORIGINALS RETAINED/DEPRECATED GOOOL LETTERING - NO NEW USE/<timestamp>/...`, preserving relative path where useful. Record old path, new archive path, hash, reason, and action in a CSV audit. Preserve restore capability.
- Do **NOT** permanently delete sole originals or purge the Windows Recycle Bin. Removing from active circulation is approved; permanent destruction is a different irreversible action.
- For any candidate with uncertain visual contents or external dependencies, **leave it untouched**, flag it in the exception report, and ask for a focused decision.

Ensure no active manufacturer-export, sticker, badge, web-logo, or current collection directory inadvertently contains GOOOL lettering. Historical archival GOOOL wordmarks may remain in the clearly marked archive only, inaccessible to normal new-design workflows.

### Phase C — Manufacturer files and naming QA

- Map each approved asset to `source reference`, `actual master`, `proof trace`, `print PNG`, `embroidery input`, or `legacy obsolete`; don't elevate proof traces.
- Keep transparency, correct ink/white colorways, aspect ratio, and the vertical divider when applicable.
- Do not invent universal supplier dimensions. For APLIIQ/Printful/Printify/YCL check the exact selected product and decoration location spec, 300 DPI at desired dimensions, min stroke requirements, color limits, bleed/cut contour if stickers, and minimum embroidery detail height.
- An SVG/PNG is not a machine-ready DST/PES embroidery stitch file. Flag undigitized embroidery art appropriately.
- Produce `04 - BRAND GUIDELINES & APPROVALS/ACTIVE_ASSET_INDEX.csv` with asset ID, brand, version, status, output file, dimensions, colorway, vendor suitability, checksum and citation/origin.
- Preserve all currently approved concept boards and source-reference screenshots separately from manufacturer outputs.

### Phase D — Verify and report

1. Print final tree, current file count and manifests, backup location, actions taken, active approved files, archived old logos, and unresolved conflicts/holds.
2. Compare hashes of source files/archived copies; verify unrelated files are unchanged; check OneDrive sync completion.
3. Spot-check SVGs and PNGs visually; verify approved Strike V1.2 unchanged, women's TGC hierarchy, men's lettering, and the GOAL Athletics horizontal divider.
4. Produce a plain-English `GOAL_ASSET_REORGANIZATION_REPORT.md` and machine-readable `GOAL_ASSET_REORGANIZATION_AUDIT.csv`, with counts and any unresolved manufacturer-production caveats.
5. Ensure rerunning the process doesn't create duplicates or overwrite anything (idempotency).
6. Link the final folder in the handoff. Report exact paths *from the user's machine*, not hypothetical ones.
7. **Do not** modify GitHub, Netlify, GoDaddy, Google Workspace, Stripe, email providers, or live domains. This task is completed by the local/OneDrive folder organization, not by deploying the website.

## STOP / ESCALATION RULES

Pause and request confirmation if: (a) canonical OneDrive folder is ambiguous; (b) backup verification fails; (c) permission/sync/access errors occur; (d) target collisions differ in content and can't be handled without overwrite; (e) a GOOOL logo is currently referenced by a live site, outstanding order, supplier or public artwork URL; (f) visually uncertain designs would be destroyed; (g) a third-party license or legal item is implicated.

**No destructive recursion, wildcard file deletion, `Remove-Item -Recurse`, or silent rewriting of original assets.**

## ACCEPTANCE CRITERIA

- The correct user's OneDrive root contains organized assets under numbered folders.
- The specific approved GOAL Athletics and Collective variants have correct labels and provenance.
- All **verified obsolete GOOOL-spelled logos** are removed from **active use**, with recoverable archive and audited path changes, except documented dependency holds.
- No current checkout, supplier, order or website references are broken.
- Every processed file is accounted for by SHA-256 and source/destination audit.
- User receives complete local paths, before/after counts, archived count, skipped/hold count, and a concise written report.
- No website or account changes were made.

Start execution by finding and verifying the exact OneDrive root, then state the planned actions and proceed. Do not stop after writing a plan. Preserve work safely at each step.