# "What's Your GOAL?" public activation. Audit, completion, enablement (2026-10-28)

Mode: audit existing implementation, complete, enable. Branch `claude/whats-your-goal-public` off origin/main 096d090.
**Deployment status: NOT DEPLOYED.** Nothing pushed, nothing applied to the live database.

## 1. Existing implementation discovered
The campaign already exists in full (built 2026-10-04 to 2026-10-07 as the v84 private intake, owner-gated since 2026-10-22):
- Page: `src/app/whats-your-goool/page.tsx` renders `ReferencePage route="story"`; markup and behaviour in `src/v84/reference-experience.js` (`goalCampaign()`, `storyRequestPayload`, `submitStoryRequest`, video picker, review step, received state).
- Upload client: `src/v84/upload-client.js` (tus resumable uploads, 6 MB chunks, retry, session resume).
- API: `src/app/api/intake/[...path]/route.ts` (start, refresh, finish, maintenance) backed by `src/lib/intake/server.ts` and `validation.mjs`.
- Admin: `/admin` (`src/v84/Admin.tsx`, `admin-controller.js`, `admin-markup.json`), API `src/app/api/admin/[...path]/route.ts`, logic `src/lib/intake/admin.ts`, auth `src/lib/intake/auth.ts`, sign-in `/admin/sign-in`.
- Scheduled cleanup: `netlify/functions/intake-maintenance.mts` (hourly).
- Legal: `src/lib/intake/agreements.json` (snapshot stored per submission), `public/story-participation-agreement.html`, `public/intake-privacy.html`.
- Tests: `scripts/test-v84*.cjs`, `scripts/test-seo.cjs`.

## 2. Existing route
`/whats-your-goool`. Until this change it redirected signed-out visitors to `/admin/sign-in`, carried `robots: noindex` and was excluded from robots.txt and the sitemap. The Match Highlights page `/share-your-goals` stays owner-only and unchanged.

## 3. Existing database schema (migration `20261007023050_v84_private_intake.sql`, applied in production)
- `intake_submissions` (id, kind kit|story|video, category, status, state draft|received|deleting, name, email, team, payload jsonb, consent jsonb, notes, created_at, updated_at, submitted_at, upload_token_hash, upload_expires_at).
- `intake_files` (id, submission_id, name, mime, size 1..100 MB, object_key unique, purpose, state pending|ready).
- `intake_rate_limits`. Functions `intake_rate`, `intake_begin`, `intake_finish`, `intake_mark_deleting`, `intake_counts` (service_role only).
- Storage bucket `goool-intake`: private, 100 MB limit, MIME allow-list (png, jpeg, svg, pdf, mp4, quicktime, webm).
- RLS enabled on all three tables; anon and authenticated hold no privileges.

## 4. Existing admin functionality
Supabase Auth sign-in restricted to `INTAKE_OWNER_IDS`; httpOnly strict cookies. Inbox with kind filters (All, Kit, Personal stories, Goals, Highlights, Saves), status filter, search, paging, counts. Detail view: goal card, video preview and download through 60 second signed URLs (`/api/admin/files/:id`), person block, story fields, permission record (version and acceptance time), status select, private notes, delete (scrubs personal fields, removes objects, tombstone retained until cleanup). No automatic email or publishing of any kind.

## 5. Existing fields (story kind)
First name (60), email (254), Instagram handle optional (30, validated), goal (100), why it matters (250), up to three videos MP4/MOV/WebM 100 MB each (first = main, others = support), three required acknowledgments (18 or older; rights; participation agreement `WYG-2026-10-04-live-1`), optional brand-email checkbox stored separately from consent.

## 6. Missing functionality found
- Page not publicly reachable (owner gate, noindex, robots disallow, absent from sitemap).
- No status for "goal achieved", "rejected" or "archived" (existing: new, reviewing, approved, featured, quoted, closed).
- No notification to the owner when a submission lands (admin session reported `notifications: not_configured`).
- No 15 to 60 second guidance in the video help text.
- Not supported by the existing form: optional location, optional image. Not added (see 20).
- Legal text names the old entity and the old campaign spelling (see 19).

## 7. Changes made
- `src/app/whats-your-goool/page.tsx`: owner gate, noindex and force-dynamic removed; page is static and public.
- `src/app/robots.ts`: `/whats-your-goool` removed from disallow. `src/app/sitemap.ts`: route added.
- `supabase/migrations/0053_intake_story_statuses.sql` (NEW, not applied): status check now also admits `achieved`, `rejected`, `archived`.
- `src/lib/intake/admin.ts`, `src/v84/admin-controller.js`, `src/v84/admin-markup.json`: the three statuses in the API allow-list, the review select and the inbox filter.
- `src/lib/intake/notify.ts` (NEW) and `src/lib/intake/server.ts`: after the first successful finish, an internal email to gdove90@goalathletics.shop with kind, first name, goal, file count and the admin link. Never the submitter's email, handle or files. Delivery failure never fails the receipt; repeat finishes do not resend.
- `src/v84/reference-experience.js`: video help note now reads "MP4, MOV or WebM, 15 to 60 seconds works best." No other copy, markup, imagery or styling changed.
- `tsconfig.json`: the local-only `04 Website Design` folder excluded (it broke `tsc` and `next build` on this machine; it does not exist on Netlify).
- Tests: `test-v84.cjs` applies migration 0053 and checks the admitted statuses, stubs the notifier; `test-v84-release.cjs` expects the page to be public (still absent from every nav and the footer); `test-seo.cjs` expects the route in the sitemap and derives the row count from the catalog.

## 8. Final public submission fields
Unchanged from section 5. Location and image remain unsupported.

## 9. Video upload implementation
Browser picks up to three MP4, MOV or WebM files (extension and MIME checked client side, 100 MB each). On submit the server validates the manifest, creates a draft row and per-file signed resumable upload tokens; the browser uploads straight to Supabase Storage with tus (resumable, retried, 24 hour session). Finish re-verifies every object (HEAD size and content type, first 16 KB magic bytes) before the row becomes `received`. Oversize and wrong-type files are rejected both client and server side. Verified locally: bad type, 100 MB + 1 byte, valid MP4 selection, review step with video preview, server error state ("not ready yet. Your story and clips are still here. Please retry.").

## 10. Storage architecture
Private bucket `goool-intake`, object keys `intake/<submission id>/<file id>` (random UUIDs, not guessable). Uploads need a per-submission signed token; reads need an owner session and are 60 second signed URLs issued by the admin API. No public URL ever exists.

## 11. Privacy and security controls (audited, unchanged unless noted)
Same-origin check on every write (`INTAKE_SITE_ORIGINS` includes goalathletics.shop and www); 50 KB JSON body cap; IP rate limit 12 starts per hour (Netlify client IP header only); terms version pinned server side; SVG sanitizer; MIME and size enforced in the bucket as well as in code; service-role key server-only; RLS on every table; owner-only admin with Supabase Auth and httpOnly strict cookies; signed 60 second file URLs with `no-referrer`; delete scrubs personal fields and removes objects; hourly cleanup of expired drafts and tombstones; no CAPTCHA (rate limit and origin check are the spam controls). Public form access does not grant any read access.

## 12. Consent implementation
Each submission stores `consent` with version `WYG-2026-10-04-live-1`, `acceptedAt`, the three acknowledgments, the handle authorised for tagging, the marketing choice, plus `termsSnapshot` (full agreement HTML) and `termsHash`. The page says review happens before any feature, nothing is published automatically, and the agreement grants a non-exclusive licence for the series and organic promotion only (no paid ads, merchandise or resale). The licence is withdrawable by email within 30 days.

## 13. Minor and age handling
Adult-only gate: the "I am 18 or older" box is required, the server rejects `adult !== true`, and the agreement states the submitter must be at least 18. No guardian workflow exists and none was invented. Decision: keep the adult-only gate for launch.

## 14. Admin moderation workflow
Submission arrives as `new` (state `received`). Owner opens `/admin`, filters Personal stories, reviews goal, story, name, email, handle, video, date and permission record, sets a status and private notes. Approval only marks eligibility; publishing anywhere is a separate manual action. Delete removes files and personal data.

## 15. Status workflow
PENDING = `new` then `reviewing`; APPROVED = `approved`; FEATURED = `featured`; GOAL ACHIEVED = `achieved` (new); REJECTED = `rejected` (new); ARCHIVED = `archived` (new); `quoted` and `closed` remain for kit requests and legacy rows. Migration 0053 must be applied before the dashboard offers the new values, otherwise saving them fails with a retry message.

## 16. Instagram-to-website funnel (recommended operating procedure)
Bio link, Reel and Story captions, and DM replies all point to https://goalathletics.shop/whats-your-goool. When someone sends a video by DM, reply with the link and ask them to submit there so GOAL receives the original file, the data, the consent record and a database record. No Instagram API or DM automation exists or was built. Suggested DM reply: "Love it. Submit it here so we have your permission on file and the original quality: goalathletics.shop/whats-your-goool".

## 17. Public route
`/whats-your-goool` (slug kept; see 21 for an alias suggestion).

## 18. Technically ready to go live?
Yes, once two prerequisites are met: (a) apply migration 0053 in the Supabase SQL editor; (b) the legal item in 19 is reviewed. Production env is already complete (`INTAKE_ENABLED=true`, bucket, keys, origins, owner ids, rate and maintenance secrets, RESEND_API_KEY). Live probes today: the route currently redirects to sign-in (expected before deploy); the intake API answers 403 off-origin and 400 on missing consent; the admin API answers 403 unauthenticated; the agreement download is live.

## 19. Legal and consent items for owner review
1. The participation agreement, its stored snapshot and the public copy name "GOOOL Athletics LLC" as the contracting party and call the series "What's Your GOOOL?". The company name decision of 2026-10-15 makes The Goal Brand Group LLC the legal entity. Updating the agreement requires a new version id (for example `WYG-2026-10-28-live-2`) in four places that must stay identical: `STORY_TERMS` in reference-experience.js, `agreements.json`, `public/story-participation-agreement.html`, and the version string in `validation.mjs`. Not changed, because the brief says to preserve existing release language and flag it.
2. `intake-privacy.html` is linked from the agreement by file name only; confirm the page content still matches the live privacy policy.
3. Adult-only gate (13) excludes under-18 athletes; a guardian flow would need legal input.

## 20. Visual or layout improvements proposed, not implemented
- Add an optional "Where are you based?" field (city, state) under the handle field, 100 characters, stored in payload and shown in admin.
- Allow one optional photo (PNG or JPEG) for people without video; the kit kind already validates those types.
- Show a recording prompt above the picker: "Tell us who you are, what your goal is, and why it matters. 15 to 60 seconds, vertical."
- Optional client-side duration read (video metadata) to warn when a clip is over 60 seconds before upload.
- The private admin header still reads "GOOOL ATHLETICS" with the old wordmark (`admin-markup.json`); update it to GOAL Athletics.
All of these change markup or copy on the approved page and wait for a mockup approval.

## 21. Recommended placement
- Homepage: a single line or small card under "THE GOAL MINDSET / A goal is just the beginning." linking to the page ("Share your GOAL ↗"), matching the audit hierarchy (belief, then campaign).
- Navigation: footer under OUR WORLD as "What's Your GOAL?" rather than the main menu, which stays shop-first.
- Social: Instagram bio link and the pinned Reel caption; every campaign Story gets the link sticker.
- URL alias: a 301 from `/whats-your-goal` to `/whats-your-goool` in middleware so captions can use the campaign spelling. Not added (navigation and routing changes wait for your word).

## 22. Validation results
- `tsc --noEmit`: clean (after excluding the local reference folder).
- `next lint`: no errors, three pre-existing `<img>` warnings.
- `next build`: success, 44 static pages, `/whats-your-goool` now static.
- Intake suite (`test-v84.cjs`): all 25 intake checks pass including the new migration check. The suite's first check (Men catalog ordering) and its baseline-hash checks fail on origin/main before this task; they are unrelated to intake and were skipped in the run, not edited.
- `test:v84:admin` 9, `test:v84:upload` 5, `test:v84:maintenance` 6: pass.
- `test-seo.cjs`: the three SEO checks pass including the new sitemap assertion; its catalog count check (expects 7 products, catalog has 10) fails on origin/main already.
- `test-v84-release.cjs` against the local preview: owner-only redirects, public page 200 with canonical, no nav or footer link: pass; it then stops at a pre-existing "seven product routes" assertion.
- Local preview (STORE_OPEN=true, no PREVIEW_KEY): desktop and mobile load; consent required (submit disabled, form invalid until all three boxes); invalid type, oversize and valid video messages; review step with preview; server error state; `/admin` 307 to sign-in; admin and file APIs 403; intake API 403 off-origin, 400 on missing consent, bad type and oversize; finish without token refused.
- Not verified: a real upload to the production bucket and the owner notification email (needs production keys; do one real test submission after deploy and delete it in `/admin`).

## 23. Files changed
Modified: src/app/whats-your-goool/page.tsx, src/app/robots.ts, src/app/sitemap.ts, src/lib/intake/admin.ts, src/lib/intake/server.ts, src/v84/admin-controller.js, src/v84/admin-markup.json, src/v84/reference-experience.js, tsconfig.json, scripts/test-v84.cjs, scripts/test-v84-release.cjs, scripts/test-seo.cjs. New: src/lib/intake/notify.ts, supabase/migrations/0053_intake_story_statuses.sql, this document.

## 24. Git diff summary
15 files, 199 insertions and 22 deletions (161 of the insertions are this document), one commit on `claude/whats-your-goal-public`. Nothing touched products, prices, Stripe, checkout, Apliiq, Tapstitch, other tables, other auth, or any social automation.

## 25. Deployment status
NOT DEPLOYED. To activate: apply migration 0053, merge the branch to main (Netlify auto-deploys), then make one real test submission and delete it.
