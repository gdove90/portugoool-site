# Setup and switching between Claude and Codex

This v2 setup replaces the standalone v1 master prompts. Both engines read `OPERATING_CONTRACT.md` in this directory; no supplier, catalog, app, database or hosting change is part of installation.

## Installation status and verification

The review PR installs root `AGENTS.md`, a priority notice in `CLAUDE.md`, a Claude project agent, a Codex project agent, identical project workflow skills, templates, and coordination helpers. The old Apliiq skill keeps its mechanics with a governance notice. A draft PR does not activate another machine or merge the setup into main.

After owner review, either use the exact setup branch in an isolated clean checkout, or separately approve merging the setup. Never overwrite a dirty checkout or install a v1 folder on top. Verify from the repository root:

```
python scripts/goal_agent_validate.py
python scripts/test_goal_agent_coordination.py
python scripts/goal_agent_coordination.py status
```

The last command needs existing Git authentication and an origin pointing to `gdove90/portugoool-site`. It creates no remote branch. A missing coordination ref means no lock has been initialized. Only the first authorized acquire creates it. The lock tests use local temporary bare repositories and never touch GitHub or providers. Do not claim a live two-machine test from their success.

In Codex invoke the `goal_product_integration` project agent or the `goal-product-integration` skill. In Claude Code invoke `goal-product-integration-engineer` or `/goal-product-integration` from the actual repository checkout. If the current client does not discover project agents/skills, explicitly read the root instructions, identical workflow and common contract, then report discovery UNVERIFIED. Do not quietly fall back to old package prompts. Different client versions and cloud sessions can load custom instructions differently; verify discovery in each real environment.

## First authorized build

Use a fresh clean worktree for a new task, or the current task branch for continuation. Record owner approval, base/head and the first checkpoint. Example commands use placeholder IDs; substitute the actual approved task, branch and session:

```
python scripts/goal_agent_coordination.py acquire --engine claude --session UNIQUE_SESSION --task TASK_ID --branch TASK_BRANCH --approval OWNER_APPROVAL_REFERENCE
python scripts/goal_agent_coordination.py check --session UNIQUE_SESSION
python scripts/goal_agent_coordination.py checkpoint --session UNIQUE_SESSION --checkpoint PATH_TO_COMPLETED_HANDOFF_JSON
```

Use the same commands with `--engine codex` in Codex. Recheck ownership before each mutation and after an interruption. The single repository lock covers different products too, because they can share checkout and order code. Remote pushes require the user's existing permissions; the setup does not expand access.

## Orderly switch

Stop editing after safe WIP/completed work is committed and pushed to the existing task branch. Set the checkpoint's `worktree_state` to `clean_committed_and_pushed` only when true, record tests and next action, then:

```
python scripts/goal_agent_coordination.py release --session OUTGOING_SESSION --checkpoint PATH_TO_COMPLETED_HANDOFF_JSON
```

In the receiving engine, read `status`, verify the recorded task branch/head and authorization, then `acquire` with its new engine/session ID. Continue from the checkpoint. Do not restart the task or repeat completed external actions.

## Credits exhausted or crash

Pause/stop the old worker. The owner must explicitly direct takeover. The incoming engine reads the preserved state, checks that it knows the correct task/branch/approval and runs:

```
python scripts/goal_agent_coordination.py takeover --engine codex --session NEW_SESSION --task TASK_ID --branch TASK_BRANCH --approval OWNER_TAKEOVER_REFERENCE --owner-authorized --reason OLD_WORKER_STOPPED_AND_OWNER_DIRECTED_TAKEOVER
```

The old token is revoked and the prior checkpoint remains. The helper records the stated authorization; it cannot prove that a person approved or that a remote process stopped. Reconcile unsaved/unpushed changes on the old machine and any pending external operation before continuing. Never take a lock based only on age. If missing work cannot be recovered, report what is missing instead of inventing continuity.

## Current authorization and limits

The setup PR addresses agent parity and coordination only. It does not authorize either reported commerce repair, new product intake, the Tapstitch manual-order SOP, visual changes, provider writes, production SQL, merge or deploy. The Tapstitch paid-routing and concurrent order-line defects remain open findings until separately scoped and tested. Intentional manual routing requires both working code and an approved/tested SOP.

Instruction parity can be checked by hashes and exact shared text. External capabilities and host permission enforcement must be checked independently in each tool. The lock coordinates cooperative clients; it cannot physically block an uncooperative client from editing or using a provider.
