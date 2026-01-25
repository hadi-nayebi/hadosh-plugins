---
description: Validate WM.md against directory contents
agent: build
---
Validate `WM.md` in `$ARGUMENTS` (default: current directory).

Steps:
1. Use `list` if available; otherwise use `glob` or `bash ls` to capture live directory contents.
2. Read `WM.md`.
3. Report missing entries, extra entries, and any entries under 50 words.
4. If issues exist, recommend `/wm-sync`.
