# wm-guard (behavior organ)

wm-guard is a standalone OpenCode behavior organ that enforces the WM.md memory layer. It intercepts tool calls, validates WM.md chains, and injects the relevant commentary into read outputs. It is designed to be self-improving with a dedicated steward subagent.

## Event layer
- `tool.execute.before`: validate WM.md chains on reads; block rm/mv without wrapper commands; capture diagnostic contexts; enforce read-only external exceptions.
- `tool.execute.after`: prepend WM.md chain + WM-STATUS on reads; emit WM-STATUS only for list/glob/grep/ls; record telemetry.
- `command.execute.before`: allow rm/mv only when invoked via `/wm-mv` or `/wm-rm`.
- `event` hooks: file edits, permission changes, and idle reminders.
- `experimental.session.compacting`: inject WM policy reminder into compacted context.

## Cells (files)
- `plugin/wm-guard.js`: enforcement brain + event layer.
- `plugin/state/`: local state and telemetry for the sensory layer.
- `commands/`: repair and ops templates (`/wm-init`, `/wm-sync`, `/wm-check`, `/wm-mv`, `/wm-rm`, `/wm-setup`).
- `skills/`: commentary, setup, repair, audit, policy.
- `agents/memory_management/wm-steward/`: repair and audit subagent.
- `templates/`: project bootstrap templates.
- `examples/`: examples of high-signal WM commentary.

## Self-improvement loop
- The steward agent proposes and applies incremental fixes.
- Plan and README are updated with every behavior change.
- Drift checks are performed using the `wm-audit` skill.

## Evolution
- v1.1 (implemented): directory-level sleep/debounce in `plugin/state/data.json`. First read includes WM.md chain; subsequent reads in the same directory can skip chain injection while validation still runs.
- v1.2 (implemented): external allowlist and read-only roots for prototype access, plus telemetry capture.
- v1.3 (planned): configurable sleep thresholds and telemetry review workflows.
