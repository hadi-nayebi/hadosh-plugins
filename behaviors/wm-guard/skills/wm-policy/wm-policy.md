# WM Policy (Runtime)

This document defines the runtime behavior for WM.md enforcement.

## Objective
Maintain a practical WM.md layer across active work areas so future tasks benefit from accumulated context. The layer should cover inside compartments, the brain (`.opencode/`), and side projects, and it can extend to external locations when work there is active and worth the maintenance effort.

## Organ Model
wm-guard is an organ made of components that must stay aligned: plugin (enforcement), commands (repair workflows), skills (interpretive guidance), agents (maintenance), and policy/plan (behavior contract). Changes to one component should be reflected in the others.

## Read Behavior
- Every `read` is intercepted by the `wm-guard` plugin and prepended with the WM.md chain from `./WM.md` to the target directory WM.md.
- The chain may be skipped for subsequent reads in the same directory when sleep/debounce is enabled; validation still runs and reads still block if the WM layer is stale.
- Reads are blocked if:
  - Any WM.md in the chain is missing.
  - `<directory-commentary>` is missing.
  - Any file/subdir entry is missing or under 50 words.
  - Any directory exceeds 10 items without an `<exception>` or `<note type="reorg">`.
  - The target file is not listed in its local WM.md commentary.
- Reading `WM.md` validates that commentary entries match the live directory listing (no extras, no missing).

## Diagnostics (No WM.md Chain)
- `list` (if available), `glob`, `grep`, and `bash ls` do not append WM.md chains.
- They emit WM-STATUS warnings to surface discrepancies.

## Warnings and Blocks
- Warnings apply pressure to maintain the WM layer without halting work.
- Blocks enforce invariants that keep the WM layer useful and consistent.
- As WM.md coverage improves, warnings naturally decline and the system becomes low friction.

## Repair Workflow
- On a blocked read: run `/wm-init <dir>` if WM.md is missing, otherwise `/wm-sync <dir>`, then retry the read.
- After any edit/write: run `/wm-sync <dir>` for the affected directory.
- After `mv`/`rm`: run `/wm-mv` or `/wm-rm` commands, which include WM.md updates.
- For onboarding or drift correction: run `/wm-setup` or invoke `@wm-steward`.

## Agent Permissions
- The `@wm-steward` agent is restricted to editing `**/WM.md` files only (path-based edit permission).
- If non-WM.md edits are needed, it will provide a patch for the main agent.

## Directory Commentary Requirements
- Each `<file>` and `<subdir>` entry must contain 50+ words.
- Do not create entries for `WM.md` itself.
- Use `<exception>` or `<note type="reorg">` when >10 items exist.

## Exceptions and Noise Control
- Use exceptions sparingly for low-value directories that do not warrant WM.md coverage.
- Exceptions must be documented in WM.md and should not become a default escape hatch.
- If a repeated warning is truly noise, add a justified exception rather than ignoring it silently.

## External Allowlist and Read-Only Roots
- External directories may be allowlisted in `plugin/state/data.json` under `config.externalAllowRoots`.
- Allowlisted external roots skip WM.md injection and validation, but still emit WM-STATUS notes to show that a skip occurred.
- Read-only roots listed in `config.readOnlyRoots` block edits and writes to those paths.

## Telemetry
- The plugin records trigger input/output summaries in `plugin/state/data.json` under `telemetry`.
- Telemetry is bounded by `config.telemetryMaxEntries` and can be disabled via `config.telemetryEnabled`.
- Use telemetry to detect noisy warnings and improve behavior rules over time.

## Compartment Model
- Outside: anything outside `./` (blocked unless allowlisted).
- Inside: `./` root and normal subdirectories.
- Brain: `.opencode/`.
- Side projects: `./<project_name>/` subtrees.
