#!/usr/bin/env python3
"""Validate shared contract integrity and equivalent engine adapters."""
import hashlib
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / "docs/agents/goal-product-integration"


def main():
    manifest = json.loads((BASE / "contract-manifest.json").read_text(encoding="utf-8"))
    assert manifest["contract_version"] == "2.0", "Unknown contract version"
    assert manifest["repository"] == "gdove90/portugoool-site", "Wrong repository"
    for name, expected in manifest["sha256"].items():
        path = (ROOT / name).resolve()
        assert ROOT in path.parents, "Path escapes repository"
        assert hashlib.sha256(path.read_bytes()).hexdigest() == expected, "Contract drift: " + name
    first = (ROOT / ".agents/skills/goal-product-integration/SKILL.md").read_bytes()
    second = (ROOT / ".claude/skills/goal-product-integration/SKILL.md").read_bytes()
    assert first == second, "Engine workflow skills diverge"
    entry = (BASE / "entrypoint.md").read_text(encoding="utf-8").strip()
    claude = (ROOT / ".claude/agents/goal-product-integration-engineer.md").read_text(encoding="utf-8")
    assert claude.split("---", 2)[2].strip() == entry, "Claude adapter diverges"
    assert "permissionMode: default" in claude, "Claude normal permission mode changed"
    codex = (ROOT / ".codex/agents/goal_product_integration.toml").read_text(encoding="utf-8")
    body = re.search(r"developer_instructions\s*=\s*'''(.*?)'''", codex, re.S)
    assert body and body.group(1).strip() == entry, "Codex adapter diverges"
    try:
        import tomllib
    except ImportError:
        pass
    else:
        assert tomllib.loads(codex)["developer_instructions"].strip() == entry
    for name in ("handoff.json", "product-readiness-manifest.json"):
        assert json.loads((BASE / "templates" / name).read_text(encoding="utf-8"))["contract_version"] == "2.0"
    print("PASS: contract hashes, exact adapter instructions, workflow parity, paths, TOML where available, and templates")


if __name__ == "__main__":
    main()
