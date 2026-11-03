"""Isolated text/checkout regressions; no production repository is accessed."""
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = Path("docs/agents/goal-product-integration/contract-manifest.json")


class ValidationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.copy = self.base / "copy"
        manifest = json.loads((ROOT / MANIFEST).read_text(encoding="utf-8"))
        names = set(manifest["sha256"]) | set(manifest["sha256_fragments"]) | {MANIFEST.as_posix()}
        for name in names:
            target = self.copy / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / name, target)
        self.notice = manifest["sha256_fragments"]["CLAUDE.md"]

    def validate(self, success=True, root=None):
        root = root or self.copy
        result = subprocess.run([sys.executable, str(root / "scripts/goal_agent_validate.py")],
                                cwd=root, capture_output=True, text=True)
        if success:
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertIn("PASS:", result.stdout)
        else:
            self.assertNotEqual(result.returncode, 0, "Unexpectedly accepted changed instructions")
        return result

    def convert_to_crlf(self):
        for path in self.copy.rglob("*"):
            if path.is_file():
                path.write_bytes(path.read_bytes().replace(b"\r\n", b"\n").replace(b"\n", b"\r\n"))

    def test_lf_checkout_passes(self):
        self.validate()

    def test_crlf_checkout_passes(self):
        self.convert_to_crlf()
        self.validate()

    def test_mixed_workflow_line_endings_pass(self):
        path = self.copy / ".claude/skills/goal-product-integration/SKILL.md"
        path.write_bytes(path.read_bytes().replace(b"\r\n", b"\n").replace(b"\n", b"\r\n"))
        self.validate()

    def test_real_instruction_edit_still_fails_on_crlf(self):
        self.convert_to_crlf()
        path = self.copy / ".agents/skills/goal-product-integration/SKILL.md"
        path.write_bytes(path.read_bytes() + b"\r\nUnapproved extra instruction.\r\n")
        self.assertIn("Contract drift", self.validate(success=False).stderr)

    def test_unrelated_claude_notes_do_not_change_contract(self):
        path = self.copy / "CLAUDE.md"
        path.write_bytes(path.read_bytes() + b"\nAdditional unrelated project notes.\n")
        self.validate()

    def test_notice_edit_is_rejected(self):
        path = self.copy / "CLAUDE.md"
        value = path.read_bytes()
        changed = value.replace(b"GOAL Athletics is the current", b"Other Brand is the current", 1)
        self.assertNotEqual(value, changed)
        path.write_bytes(changed)
        self.assertIn("Contract notice drift", self.validate(success=False).stderr)

    def test_missing_duplicate_or_reversed_markers_are_rejected(self):
        path = self.copy / "CLAUDE.md"
        original = path.read_text(encoding="utf-8")
        begin, end = self.notice["begin"], self.notice["end"]
        candidates = [original.replace(begin, "", 1), original + "\n" + begin,
                      original.replace(begin, "TEMP_MARKER", 1).replace(end, begin, 1).replace("TEMP_MARKER", end, 1)]
        for value in candidates:
            with self.subTest(value=value[-80:]):
                path.write_text(value, encoding="utf-8")
                self.validate(success=False)

    def test_real_git_autocrlf_checkout_passes(self):
        def git(*args, cwd=None):
            subprocess.run(["git", *args], cwd=cwd, capture_output=True, check=True)
        git("init", "--quiet", str(self.copy))
        for name, value in (("user.name", "Fixture"), ("user.email", "fixture@example.invalid"),
                            ("core.autocrlf", "false"), ("core.safecrlf", "false")):
            git("config", name, value, cwd=self.copy)
        git("add", "--all", cwd=self.copy)
        git("commit", "--quiet", "-m", "Local validator fixture", cwd=self.copy)
        clone = self.base / "crlf"
        git("-c", "core.autocrlf=true", "clone", "--quiet", "--no-hardlinks", str(self.copy), str(clone))
        self.assertIn(b"\r\n", (clone / "AGENTS.md").read_bytes())
        self.validate(root=clone)


if __name__ == "__main__":
    unittest.main()
