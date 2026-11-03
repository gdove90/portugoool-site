#!/usr/bin/env python3
"""Cooperative single-writer coordination through one non-force Git branch."""
import argparse
import copy
import hashlib
import json
import os
from pathlib import Path
import re
import secrets
import subprocess
import sys
from datetime import datetime, timezone

REF = "refs/heads/goal/agent-coordination"
SCHEMA = "goal-agent-coordination-v2"


class Hold(RuntimeError):
    pass


def git(*args, data=None, ok=(0,)):
    result = subprocess.run(["git", *args], input=data, text=True,
                            capture_output=True, timeout=60)
    if result.returncode not in ok:
        raise Hold("Git operation failed or coordination changed. Re-read status; do not retry a mutation automatically.")
    return result.stdout.strip()


def now():
    return datetime.now(timezone.utc).isoformat()


def token_hash(token):
    return hashlib.sha256(token.encode()).hexdigest()


def validate_remote():
    url = git("remote", "get-url", "origin")
    allowed = re.fullmatch(r"(?:https://(?:[^/@]+@)?github\.com/|git@github\.com:|ssh://git@github\.com/)gdove90/portugoool-site(?:\.git)?/?", url, re.I)
    local_test = git("config", "--get", "goalAgent.allowLocalTestRemote", ok=(0, 1)) == "true"
    if not allowed and not (local_test and Path(url).is_dir()):
        raise Hold("Origin is not the GOAL repository. No coordination mutation allowed.")


def read_state():
    validate_remote()
    found = git("ls-remote", "--heads", "origin", REF)
    if not found:
        return None, {"schema": SCHEMA, "revision": 0, "holder": None, "checkpoint": None}
    head = found.split()[0]
    if not re.fullmatch(r"[0-9a-f]{40,64}", head):
        raise Hold("Invalid coordinator head.")
    git("fetch", "--quiet", "--no-write-fetch-head", "origin", head)
    try:
        state = json.loads(git("show", head + ":state.json"))
    except (ValueError, TypeError) as exc:
        raise Hold("Unreadable shared state; do not replace it.") from exc
    if state.get("schema") != SCHEMA or not isinstance(state.get("revision"), int):
        raise Hold("Unknown shared-state format; do not replace it.")
    if state.get("holder") is not None and not isinstance(state["holder"], dict):
        raise Hold("Invalid lock holder; do not replace it.")
    return head, state


def public_state(head, state):
    output = copy.deepcopy(state)
    if output.get("holder"):
        output["holder"].pop("token_hash", None)
    return {"coordinator_head": head, **output}


def publish(head, state, action):
    state["revision"] += 1
    state["updated_at"] = now()
    blob = git("hash-object", "-w", "--stdin", data=json.dumps(state, sort_keys=True, indent=2) + "\n")
    tree = git("mktree", data="100644 blob " + blob + "\tstate.json\n")
    parents = ["-p", head] if head else []
    commit = git("-c", "user.name=GOAL Agent Coordination", "-c",
                 "user.email=goal-agent@users.noreply.github.com", "commit-tree", tree,
                 *parents, "-m", "GOAL coordination: " + action + " [skip ci] [skip netlify]")
    # No force and no retry: another writer advancing the branch rejects this push.
    git("push", "--quiet", "origin", commit + ":" + REF)
    return commit


def token_path():
    return Path(git("rev-parse", "--git-path", "goal-agent-lease.json"))


def checkout_state(branch, require_pushed=False):
    if git("branch", "--show-current") != branch:
        raise Hold("Current checkout is not the owned task branch.")
    current = git("rev-parse", "HEAD")
    if require_pushed:
        if git("status", "--porcelain"):
            raise Hold("Working tree is dirty; preserve and reconcile it before transfer.")
        git("check-ref-format", "refs/heads/" + branch)
        remote = git("ls-remote", "--heads", "origin", "refs/heads/" + branch)
        if not remote or remote.split()[0] != current:
            raise Hold("Task HEAD is not the exact pushed remote branch head.")
    return current


def assert_holder(state, args):
    try:
        local = json.loads(token_path().read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        raise Hold("No valid token in this worktree. Stay read-only.") from exc
    holder = state.get("holder") or {}
    if (holder.get("session") != args.session or local.get("session") != args.session
            or not secrets.compare_digest(holder.get("token_hash", ""), token_hash(local.get("token", "")))):
        raise Hold("Ownership is absent or revoked. Stop all mutations.")
    current = checkout_state(holder.get("branch", ""))
    start = holder.get("start_commit")
    if not start:
        raise Hold("Holder has no verified starting commit.")
    git("merge-base", "--is-ancestor", start, current)


def load_checkpoint(filename):
    try:
        value = json.loads(Path(filename).read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        raise Hold("Cannot read checkpoint JSON.") from exc
    required = ("schema", "task_id", "branch", "head_commit", "contract_version", "approved_scope",
                "completed", "tests", "unresolved", "next_action", "worktree_state", "external_effects")
    if not isinstance(value, dict) or any(k not in value for k in required):
        raise Hold("Checkpoint missing required fields; use the shared handoff template.")
    if (value["schema"] != "goal-agent-handoff-v2" or not value["task_id"] or not value["branch"]
            or value["contract_version"] != "2.0" or not value["approved_scope"]
            or not re.fullmatch(r"[0-9a-f]{40,64}", str(value["head_commit"]))):
        raise Hold("Checkpoint identity, head, scope or version is invalid.")
    if any(not isinstance(value[k], list) for k in ("approved_scope", "completed", "tests", "unresolved", "external_effects")):
        raise Hold("Checkpoint evidence fields must be arrays.")
    return value


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("action", choices=("status", "acquire", "check", "checkpoint", "release", "takeover"))
    parser.add_argument("--session")
    parser.add_argument("--engine", choices=("claude", "codex"))
    parser.add_argument("--task")
    parser.add_argument("--branch")
    parser.add_argument("--approval", help="Reference to explicit owner approval, not new approval created by this flag")
    parser.add_argument("--checkpoint", dest="checkpoint_file")
    parser.add_argument("--owner-authorized", action="store_true")
    parser.add_argument("--reason")
    args = parser.parse_args(argv)
    head, state = read_state()
    if args.action == "status":
        print(json.dumps(public_state(head, state), indent=2))
        return
    if not args.session:
        raise Hold("A unique session ID is required.")
    if args.action in ("acquire", "takeover"):
        if not all((args.engine, args.task, args.branch, args.approval)):
            raise Hold("Engine, task, branch and existing approval reference are required.")
        if args.action == "acquire" and state.get("holder"):
            raise Hold("Another session owns the repository. Stay read-only, regardless of age.")
        current = checkout_state(args.branch, require_pushed=True)
        if state.get("checkpoint") and state["checkpoint"].get("task_id") == args.task:
            old = state["checkpoint"]
            if old.get("branch") != args.branch:
                raise Hold("Continuation branch differs from the preserved checkpoint.")
            git("fetch", "--quiet", "--no-write-fetch-head", "origin", old["head_commit"])
            git("merge-base", "--is-ancestor", old["head_commit"], current)
        if args.action == "takeover":
            if not state.get("holder") or not args.owner_authorized or not args.reason:
                raise Hold("Takeover needs an existing holder, owner direction, a stopped old worker and a reason.")
            if state["holder"].get("task") != args.task or state["holder"].get("branch") != args.branch:
                raise Hold("Takeover must continue the existing task and branch.")
            state["last_intervention"] = {"previous_holder": public_state(head, state)["holder"],
                                          "reason": args.reason, "approval": args.approval, "at": now()}
        token = secrets.token_hex(32)
        state["holder"] = {"engine": args.engine, "session": args.session, "task": args.task,
                           "branch": args.branch, "approval": args.approval,
                           "start_commit": current, "token_hash": token_hash(token), "acquired_at": now()}
        new_head = publish(head, state, args.action)
        path = token_path()
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps({"session": args.session, "token": token}), encoding="utf-8")
        if os.name != "nt":
            path.chmod(0o600)
    else:
        assert_holder(state, args)
        if args.action == "check":
            print(json.dumps({"ownership": "verified", "session": args.session, "coordinator_head": head}))
            return
        if args.checkpoint_file:
            checkpoint = load_checkpoint(args.checkpoint_file)
            if checkpoint["task_id"] != state["holder"]["task"] or checkpoint["branch"] != state["holder"]["branch"]:
                raise Hold("Checkpoint does not match the current task and branch.")
            if checkpoint["head_commit"] != git("rev-parse", "HEAD"):
                raise Hold("Checkpoint head differs from the current task HEAD.")
            if checkpoint["worktree_state"] == "clean_committed_and_pushed":
                checkout_state(checkpoint["branch"], require_pushed=True)
            state["checkpoint"] = checkpoint
        if args.action == "checkpoint" and not args.checkpoint_file:
            raise Hold("Checkpoint action requires --checkpoint FILE.")
        if args.action == "release":
            checkpoint = state.get("checkpoint")
            if not checkpoint or checkpoint["task_id"] != state["holder"]["task"] or checkpoint["branch"] != state["holder"]["branch"]:
                raise Hold("Checkpoint this task before release.")
            if checkpoint["worktree_state"] != "clean_committed_and_pushed":
                raise Hold("Resolve or explicitly recover uncommitted/unpushed work before orderly release.")
            if checkout_state(checkpoint["branch"], require_pushed=True) != checkpoint["head_commit"]:
                raise Hold("Checkpoint is stale. Record current HEAD before release.")
            state["last_released_holder"] = public_state(head, state)["holder"]
            state["holder"] = None
        new_head = publish(head, state, args.action)
        if args.action == "release":
            token_path().unlink(missing_ok=True)
    print(json.dumps(public_state(new_head, state), indent=2))


if __name__ == "__main__":
    try:
        main()
    except (Hold, subprocess.TimeoutExpired) as exc:
        print("HOLD: " + str(exc), file=sys.stderr)
        sys.exit(2)
