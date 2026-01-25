# State

This directory stores runtime state for wm-guard. The `data.json` file tracks per-directory sleep/debounce counters and configuration so the plugin can skip repeated WM.md injections while still validating. This file is updated automatically at runtime; avoid editing it manually unless you are debugging behavior. It is typically ignored in git to prevent noisy diffs.
