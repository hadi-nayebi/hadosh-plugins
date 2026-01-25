---
description: Initialize WM.md for a directory
agent: build
---
Initialize WM.md for directory `$ARGUMENTS` (default: current directory).

Steps:
1. Use the `list` tool if available; otherwise use `glob` or `bash ls` to capture current files and subdirectories.
2. Create `WM.md` with a `<directory-commentary>` block.
3. Add a `<file>` or `<subdir>` entry for every item (exclude `WM.md`).
4. Each entry must be 50+ words; if you have no content yet, write a factual placeholder that explains what you expect to learn.
5. If the directory contains more than 10 items, add `<note type="reorg">` or `<exception reason="...">`.
6. Save `WM.md`, then retry the blocked read.
