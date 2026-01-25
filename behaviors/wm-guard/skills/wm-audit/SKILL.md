---
name: wm-audit
description: Audit WM enforcement layers for drift and gaps
---
## Purpose
Audit the WM system to ensure plugin behavior, commands, skills, and policies stay aligned.

## Steps
1. Review `AGENTS.md`, `.opencode/skills/wm-policy/wm-policy.md`, and the WM plan for consistency.
2. Scan `.opencode/plugins/wm-guard.js` for mismatches with documented triggers and rules.
3. Verify command templates cover init, sync, move, remove, check, and setup flows.
4. Confirm skill coverage for commentary, setup, repair, and audit tasks.
5. Summarize any drift and propose concrete fixes.

## Output
Return a checklist of findings with actionable remediation steps. If a fix requires non-WM.md edits, provide a patch for the main agent.
