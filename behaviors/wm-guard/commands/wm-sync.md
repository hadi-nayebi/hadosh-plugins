---
description: Sync WM.md with directory contents
agent: build
---
Sync `WM.md` in directory `$ARGUMENTS` (default: current directory).

Steps:
1. Use `list` if available; otherwise use `glob` or `bash ls` to capture the live directory contents.
2. Read `WM.md`.
3. Add missing `<file>`/`<subdir>` entries (exclude `WM.md`).
4. Remove entries for files/subdirs that no longer exist.
5. Expand any entry under 50 words to 50+ words.
6. If the directory exceeds 10 items, add `<note type="reorg">` or `<exception reason="...">`.
7. Save `WM.md`, then retry the blocked read.
