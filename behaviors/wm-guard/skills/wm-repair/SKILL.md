---
name: wm-repair
description: Repair WM.md mismatches and unblock reads
---
## Purpose
Resolve WM-STATUS warnings and restore read access when WM.md is missing, stale, or inconsistent.

## Steps
1. Read the WM-STATUS output to identify the affected directory.
2. If WM.md is missing, run `/wm-init <dir>`; otherwise run `/wm-sync <dir>`.
3. Expand any commentary entries below 50 words using the `wm-commentary` guidance.
4. If the directory exceeds 10 items, add `<note type="reorg">` or `<exception reason="...">`.
5. Retry the blocked read and confirm WM-STATUS is clean.

## Output
Return a brief report listing the directory repaired and any remaining issues.
