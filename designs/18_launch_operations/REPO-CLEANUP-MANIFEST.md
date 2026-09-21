# Repo cleanup manifest — commit ecc9c4c

**Nothing here has been executed.** No history has been rewritten and none
will be without explicit owner approval.

## What happened

I ran `git add -A` and committed 1,367 files in one commit, then pushed.
`.git` grew to ~705 MB. Nothing is broken (site 200, deploys ready), but
clones and CI now carry the weight. Intended: ~123 files. Unintended:
~1,244.

## Exact categories in ecc9c4c

| Category | Files | Size | Proposed action |
|---|---:|---:|---|
| `tmp/` + `output/` — disposable scratch | 49 | 15.8 MB | **untrack + ignore** |
| `*.zip` archives — rebuildable, triple-stored | 44 | **249.4 MB** | **untrack + ignore** |
| `designs/_archive/**` non-zip — audit trail | 625 | 197.5 MB | keep |
| `designs/**` non-zip — canonical packages + docs | 521 | 109.1 MB | keep |
| `public/products/**` — active catalog images | 119 | 4.5 MB | keep (intended) |
| `src/**` + `tsconfig.json` | 4 | 0.1 MB | keep (intended) |
| other | 5 | ~0 MB | review |
| **total** | **1367** | **576.3 MB** | |

Untracking only the first two categories removes **265 MB of 576 MB**
without losing a single canonical asset. The zips are the single biggest
win: the same package archives are stored three times over (v2
`archives/`, `_archive/pre-audit-v2-zips/`, `_archive/apliiq-upload-packages-v1/archives/`)
and every one can be rebuilt from the package folders that stay tracked.

## Proposed ignore rules — targeted, NOT a blanket designs/ ignore

```gitignore
# disposable scratch
/tmp/
/output/

# package archives: rebuildable from the package folders, which stay tracked
designs/**/archives/*.zip
designs/_archive/**/pre-audit-v2-zips/*.zip
```

`designs/` itself stays tracked. The asset library, the launch operations
folder, the brand-label folder, every package's `artwork/`, `spec.json`,
`SPEC.md` and proofs, and the `_archive` audit trail all remain in git.

## Two ways to proceed — owner picks

**Option 1 — forward only (no approval needed beyond a yes).**
`git rm -r --cached` the two categories, add the ignore rules, commit.
- Files stay on disk untouched.
- Future working trees stop carrying 265 MB.
- **History keeps the objects**, so a fresh `git clone` still transfers
  them. `.git` does not shrink.

**Option 2 — history rewrite (needs explicit approval, destructive).**
Rewrite the branch to drop those blobs, then force-push `main`.
- Actually shrinks the repo for new clones.
- Rewrites shared history; anyone else with a clone must re-clone.
- GitHub keeps unreachable objects server-side for a while regardless.
- I will not run this, or draft an approval for it, unless the owner
  states it plainly and unprompted.

Recommendation: Option 1 now, because it is safe and captures the
practical benefit. Option 2 only if repo size becomes a real problem, and
only on the owner's own initiative.

## Root cause, so it does not recur

`git add -A` in a repo with large untracked asset trees. `tmp/` and
`output/` were never in `.gitignore`, so scratch files were eligible.
Fix: always stage explicit paths, and land the ignore rules above.
