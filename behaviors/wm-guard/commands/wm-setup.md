---
description: Ensure AGENTS.md and local instructions match WM policy
agent: build
---
Align WM policy setup for `$ARGUMENTS` (default: repository root).

Steps:
1. Read `AGENTS.md` and confirm the WM policy section includes the repair loop, compartment model, and "no commit debt" rule.
2. If missing, update AGENTS.md to match `.opencode/skills/wm-policy/wm-policy.md`.
3. Read `opencode.json` and verify `instructions` includes `.opencode/skills/wm-policy/wm-policy.md`.
4. Ensure `WM.md` exists in the target directory and includes entries for all items (exclude WM.md itself).
5. Summarize what changed and re-run the blocked read if needed.
