---
name: supabase-sql-editor
description: Apply GOOOL Supabase migrations (or run any SQL) through the dashboard SQL editor in the owner's logged-in Chrome. Use whenever a migration in supabase/migrations/ needs applying or a query needs running against project oexibflpshttgzmdvhpr.
---

# Supabase SQL editor (GOOOL project `oexibflpshttgzmdvhpr`)

There are no Supabase credentials on this machine, the org-scoped Supabase
MCP connector cannot see this project (isolation, by design), and the
Netlify CLI masks the service-role key. The working route is the dashboard
SQL editor in the owner's Chrome, where they are already signed in. Do
not ask the owner to paste SQL; run it.

## Steps

1. Load the Chrome tools in one call:
   `ToolSearch select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__browser_batch,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__find,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__get_page_text`
2. `tabs_context_mcp {createIfEmpty:true}`, then `navigate` the tab to
   `https://supabase.com/dashboard/project/oexibflpshttgzmdvhpr/sql/new`.
   Wait about 5 s. If the project shows "Paused" (free tier pauses after a
   week idle), click Resume and wait for it to come back before anything else.
3. Put the SQL into the editor with `javascript_tool`. The editor is Monaco;
   `window.monaco.editor.getModels()[0].setValue(sql)` replaces the content
   reliably. Typing 10 KB with the keyboard is slow and error-prone. Escape
   the SQL as a JavaScript string (build it with `json.dumps` in Python if
   it is long). Comments in the SQL can be trimmed; the file in
   `supabase/migrations/` keeps the full note.
4. Run: `find "Run button"` then `left_click` its ref (or the Run button at
   the top right of the editor). Wait 5 to 6 s.
5. Read the outcome with `get_page_text`. The results grid shows only the
   LAST statement's result, so end every script with a `select` that
   proves the change (row names, `count(*)`, `information_schema` checks).
   An error shows in the results pane instead of rows; read it, fix the
   SQL, rerun.
6. Report what ran, what the verification returned, and note it in the
   migration's header or the launch log. Migrations here are written
   idempotent (`insert ... on conflict`, `create ... if not exists`,
   `create or replace`), so rerunning a bundle is safe.

## Conventions

- Bundle several pending migrations into one run, in number order, with a
  `-- ===== NNNN_name.sql =====` banner before each, and one verification
  `select` at the end.
- Never run GOOOL SQL against any other project or through the org-scoped
  MCP connector; that connector belongs to a different business.
- Service-role-only tables: `enable row level security` with no policies.
- After applying, the site does not change on its own: catalog reads come
  from `src/lib/products.ts`. The database matters for orders, emails and
  ops views.

## Applied through this route

- 2026-09-21: earlier migrations (see SESSION-EVIDENCE-2026-09-21.md).
- 2026-09-25: 0034, 0035, 0036, 0037 in one bundle; verified six product
  rows renamed and `discount_codes` + `discount_repeat_flags` present.
