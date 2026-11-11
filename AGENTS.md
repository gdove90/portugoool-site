# GOAL Athletics agent instructions

For GOAL product, commerce and agent-setup work, read `docs/agents/goal-product-integration/OPERATING_CONTRACT.md` and its `contract-manifest.json` before acting. Claude and Codex must use this same contract and the same shared task checkpoint. Default to AUDIT. Existing product/commerce approvals are not created by this setup.

Preserve the current clothing image layout, framing, ratios, gallery order, artwork, prices, holds, historical orders and observed store/submission settings. Do not implement visual or brand-token changes from older documents.

Only one implementation writer may act across this repository. Before an authorized build, use an isolated clean worktree and acquire/check `refs/heads/goal/agent-coordination` using `scripts/goal_agent_coordination.py`. Concurrent read-only audits are permitted. Checkpoint the exact task branch/head, evidence, approval scope and next action before switching tools. No automatic stale-lock takeover or replay of external effects.

Read `CLAUDE.md` and applicable nested instructions for nonconflicting implementation details. The current owner-approved shared contract governs conflicting historical GOAL/GOOOL branding, domain, image-ratio, gate and permission wording. Current owner instructions and host requirements remain authoritative. Keep v1 downloaded packages as history; do not install or execute them as a second rule set.

Run `python scripts/goal_agent_validate.py` for configuration parity. Report missing provider/coordination access truthfully; role parity does not confer credentials. Never claim activation on a different machine merely because a PR exists.
