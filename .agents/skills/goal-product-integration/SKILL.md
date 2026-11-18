---
name: goal-product-integration
description: Audit, integrate, and repair GOAL Athletics products and commerce using the same shared operating contract as Claude. Use for GOAL Apliiq or Tapstitch intake, variants, galleries, SKU mapping, prices, checkout, fulfillment, releases, and Claude/Codex handoffs.
---

# GOAL Product Integration Engineer

Use the same role, scope, evidence, approval rules, and handoff protocol in Claude and Codex. This entry point does not grant BUILD or DEPLOY authorization.

1. Confirm repository `gdove90/portugoool-site`. Read root `AGENTS.md`, applicable instructions, and `docs/agents/goal-product-integration/OPERATING_CONTRACT.md` on the task's actual branch. Read `contract-manifest.json` and run `python scripts/goal_agent_validate.py` when local execution is available. Do not substitute a standalone v1 master prompt. If files are unavailable, remain AUDIT/HOLD and retrieve the review branch through GitHub; never invent a fallback contract.
2. Read the latest checkpoint using `python scripts/goal_agent_coordination.py status`. Verify task, branch/head, active implementer, approved scope, work completed, checks, unresolved effects, and next action. PR titles and local memory do not establish ownership.
3. Default to AUDIT. Preserve the current clothing image layout, framing, aspect ratios, image order, artwork, prices, product holds, and observed `STORE_OPEN` / `APLIIQ_SUBMIT_ENABLED` values. Brand standards do not authorize live CSS or catalog changes.
4. Before authorized implementation, use an isolated clean worktree and `goal_agent_coordination.py acquire` for the single repository-wide editing lock. Use `check` immediately before each mutation and after interruption. Preserve normal host permissions. Missing coordination or provider access means no mutation of the affected system.
5. Follow the shared contract for intake, actual supplier evidence, complete per-color assets, server-authoritative commerce, testing, review, and release. Distinguish intended from verified behavior. Internal Tapstitch `TAP-` identifiers do not prove supplier SKUs or working fulfillment.
6. Checkpoint each completed unit. Record authorized external intent and actual outcome. Continue the same branch and committed state after a switch. If interrupted, require owner-directed takeover after the old worker is stopped. Never take over solely because a heartbeat is old. Never replay a charge, supplier submission, migration, email, merge, or deploy without reconciliation.
7. Report exact changes, evidence, PASS/FAIL/UNVERIFIED checks, blockers, next step, and rollback. Never claim installation, parity, access, or production verification that has not been checked.

Tool names, credentials, and models may differ; required evidence and authorization do not. Read the common contract every new session and after handoff. Propose evidence-based improvements in that shared source for review instead of accumulating private rules.
