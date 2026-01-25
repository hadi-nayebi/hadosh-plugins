---
description: Move a file/dir and sync WM.md
agent: build
---
Move `$1` to `$2` and sync WM.md.

Steps:
1. Use `bash` to run `mv "$1" "$2"`.
2. Run `/wm-sync` on the source directory.
3. Run `/wm-sync` on the destination directory.
