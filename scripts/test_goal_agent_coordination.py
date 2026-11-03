"""Local bare-remote tests; never contacts GitHub or a provider."""
import contextlib
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).with_name("goal_agent_coordination.py").resolve()
spec = importlib.util.spec_from_file_location("coord", SCRIPT)
coord = importlib.util.module_from_spec(spec)
spec.loader.exec_module(coord)


class CoordinationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.remote = self.base / "remote.git"
        self.run_git("init", "--bare", str(self.remote))
        self.a, self.b = self.base / "a", self.base / "b"
        for folder in (self.a, self.b):
            self.run_git("init", str(folder))
            self.run_git("remote", "add", "origin", str(self.remote), cwd=folder)
            self.run_git("config", "goalAgent.allowLocalTestRemote", "true", cwd=folder)
            self.run_git("config", "user.name", "Fixture", cwd=folder)
            self.run_git("config", "user.email", "fixture@example.invalid", cwd=folder)
        self.run_git("checkout", "-b", "test/repair", cwd=self.a)
        (self.a / "fixture.txt").write_text("fixture\n")
        self.run_git("add", "fixture.txt", cwd=self.a)
        self.run_git("commit", "-m", "fixture", cwd=self.a)
        self.run_git("push", "origin", "test/repair", cwd=self.a)
        self.run_git("fetch", "origin", cwd=self.b)
        self.run_git("checkout", "-b", "test/repair", "origin/test/repair", cwd=self.b)
        self.task_head = self.run_git("rev-parse", "HEAD", cwd=self.a)

    def run_git(self, *args, cwd=None):
        return subprocess.run(["git", *args], cwd=cwd, text=True, capture_output=True, check=True).stdout.strip()

    def call(self, folder, *args, success=True):
        result = subprocess.run([os.sys.executable, str(SCRIPT), *args], cwd=folder,
                                text=True, capture_output=True)
        self.assertEqual(result.returncode, 0 if success else 2, result.stderr)
        return json.loads(result.stdout) if success else result.stderr

    def acquire(self, folder, session="a", engine="claude"):
        return self.call(folder, "acquire", "--session", session, "--engine", engine,
                         "--task", "test-task", "--branch", "test/repair", "--approval", "fixture approval")

    def checkpoint(self, folder, **overrides):
        value = {"schema": "goal-agent-handoff-v2", "contract_version": "2.0", "task_id": "test-task",
                 "branch": "test/repair", "head_commit": self.task_head, "approved_scope": ["fixture"],
                 "completed": ["first unit"], "tests": [], "unresolved": [], "external_effects": [],
                 "next_action": "inspect next unit", "worktree_state": "clean_committed_and_pushed"}
        value.update(overrides)
        path = folder / ".git" / "checkpoint.json"
        path.write_text(json.dumps(value))
        return str(path)

    @contextlib.contextmanager
    def cwd(self, folder):
        old = Path.cwd()
        os.chdir(folder)
        try:
            yield
        finally:
            os.chdir(old)

    def test_status_does_not_create_remote_branch(self):
        self.assertIsNone(self.call(self.a, "status")["holder"])
        self.assertEqual(self.run_git("ls-remote", "--heads", str(self.remote), coord.REF), "")

    def test_competing_acquire_blocks_even_for_same_task(self):
        self.acquire(self.a)
        self.call(self.b, "acquire", "--session", "b", "--engine", "codex", "--task", "test-task",
                  "--branch", "test/repair", "--approval", "fixture approval", success=False)
        self.assertEqual(self.call(self.b, "status")["holder"]["session"], "a")

    def test_simultaneous_initial_push_has_one_winner(self):
        with self.cwd(self.a):
            head_a, state_a = coord.read_state()
        with self.cwd(self.b):
            head_b, state_b = coord.read_state()
        state_a["holder"] = {"session": "a"}
        state_b["holder"] = {"session": "b"}
        with self.cwd(self.a):
            coord.publish(head_a, state_a, "fixture a")
        with self.cwd(self.b), self.assertRaises(coord.Hold):
            coord.publish(head_b, state_b, "fixture b")

    def test_stale_update_is_rejected_without_force(self):
        self.acquire(self.a)
        with self.cwd(self.a):
            head_a, state_a = coord.read_state()
        with self.cwd(self.b):
            head_b, state_b = coord.read_state()
        with self.cwd(self.a):
            coord.publish(head_a, state_a, "fixture update")
        with self.cwd(self.b), self.assertRaises(coord.Hold):
            coord.publish(head_b, state_b, "stale fixture")

    def test_wrong_session_cannot_check_or_mutate(self):
        self.acquire(self.a)
        self.call(self.a, "check", "--session", "b", success=False)
        self.call(self.b, "release", "--session", "a", success=False)
        self.assertEqual(self.call(self.a, "check", "--session", "a")["ownership"], "verified")

    def test_release_requires_complete_checkpoint(self):
        self.acquire(self.a)
        self.call(self.a, "release", "--session", "a", success=False)
        p = self.checkpoint(self.a, worktree_state="dirty")
        self.call(self.a, "release", "--session", "a", "--checkpoint", p, success=False)
        self.assertEqual(self.call(self.a, "status")["holder"]["session"], "a")

    def test_checkpoint_must_match_task_and_branch(self):
        self.acquire(self.a)
        p = self.checkpoint(self.a, branch="different/task")
        self.call(self.a, "checkpoint", "--session", "a", "--checkpoint", p, success=False)

    def test_orderly_switch_retains_progress(self):
        self.acquire(self.a)
        p = self.checkpoint(self.a)
        self.call(self.a, "release", "--session", "a", "--checkpoint", p)
        self.acquire(self.b, "b", "codex")
        value = self.call(self.b, "status")
        self.assertEqual(value["checkpoint"]["completed"], ["first unit"])
        self.assertEqual(value["checkpoint"]["head_commit"], self.task_head)
        self.call(self.a, "check", "--session", "a", success=False)

    def test_takeover_requires_owner_direction_and_retains_checkpoint(self):
        self.acquire(self.a)
        p = self.checkpoint(self.a)
        self.call(self.a, "checkpoint", "--session", "a", "--checkpoint", p)
        args = ("takeover", "--session", "b", "--engine", "codex", "--task", "test-task",
                "--branch", "test/repair", "--approval", "owner stopped old run")
        self.call(self.b, *args, success=False)
        self.call(self.b, *args, "--owner-authorized", "--reason", "fixture old run stopped")
        self.call(self.a, "check", "--session", "a", success=False)
        self.assertEqual(self.call(self.b, "status")["checkpoint"]["completed"], ["first unit"])

    def test_unknown_origin_is_rejected(self):
        self.run_git("config", "--unset", "goalAgent.allowLocalTestRemote", cwd=self.a)
        self.call(self.a, "status", success=False)

    def test_check_rejects_wrong_checkout_branch(self):
        self.acquire(self.a)
        self.run_git("checkout", "-b", "wrong/task", cwd=self.a)
        self.call(self.a, "check", "--session", "a", success=False)

    def test_stale_clean_checkpoint_cannot_release_dirty_work(self):
        self.acquire(self.a)
        p = self.checkpoint(self.a)
        self.call(self.a, "checkpoint", "--session", "a", "--checkpoint", p)
        (self.a / "fixture.txt").write_text("unfinished\n")
        self.call(self.a, "release", "--session", "a", success=False)

    def test_acquire_rejects_dirty_or_unpushed_work(self):
        (self.a / "uncommitted.txt").write_text("unfinished\n")
        self.call(self.a, "acquire", "--session", "a", "--engine", "claude", "--task", "test-task",
                  "--branch", "test/repair", "--approval", "fixture approval", success=False)

    def test_takeover_cannot_relabel_task(self):
        self.acquire(self.a)
        self.call(self.b, "takeover", "--session", "b", "--engine", "codex", "--task", "unrelated-task",
                  "--branch", "test/repair", "--approval", "fixture approval", "--owner-authorized",
                  "--reason", "stopped", success=False)


if __name__ == "__main__":
    unittest.main()
