---
name: wm-setup
description: Ensure AGENTS.md and local instructions enforce WM policy
---
## Purpose
Set up the WM enforcement context for a project by aligning AGENTS.md and instruction references.

## Steps
1. Read the root `AGENTS.md` and confirm it includes the WM policy section, repair loop, compartment model, and the "no commit debt" rule.
2. If missing, add or update the WM policy section so it matches `.opencode/skills/wm-policy/wm-policy.md`.
3. Verify `opencode.json` points to `.opencode/skills/wm-policy/wm-policy.md` in `instructions`.
4. Confirm that the root `WM.md` exists and includes entries for current files/subdirs.
5. Record a short note describing any updates made so the main agent can track changes.

## Permission Boundaries
If you do not have edit permission for non-WM.md files, output a patch or step-by-step instructions for the main agent to apply.

## Output
Return a short summary of what was verified and what was updated.
