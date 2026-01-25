# WM Policy (Runtime)

This document defines the runtime behavior for WM.md enforcement.

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

## Compartment Model
- Outside: anything outside `./` (blocked).
- Inside: `./` root and normal subdirectories.
- Brain: `.opencode/`.
- Side projects: `./<project_name>/` subtrees.
