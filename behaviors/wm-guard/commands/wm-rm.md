---
description: Remove a file/dir and sync WM.md
agent: build
---
Remove `$1` and sync WM.md.

Steps:
1. Use `bash` to run `rm -rf "$1"` (only if safe and intended).
2. Run `/wm-sync` on the parent directory.
