# hadosh-plugins

This repository hosts standalone OpenCode behaviors (organs). Each behavior is self-contained with its own event layer, commands, skills, agents, templates, and examples. The first organ is `wm-guard`, which enforces WM.md chains and keeps the working-memory layer consistent across directories.

## What is an organ
- An organ is a behavior package with its own enforcement logic (event layer) and internal cells (files).
- Commands are procedural cells, skills are interpretive cells, agents are maintenance cells.
- Each organ can evolve over time with incremental improvements and drift repair.

## Install (symlink-based)
```bash
cd ~/.config/opencode/hadosh-plugins
./install.sh
```

## Update
```bash
git pull
./install.sh
```

## Uninstall
```bash
./uninstall.sh
```

## Behaviors
- `behaviors/wm-guard/` — WM.md enforcement, read injection, and repair loop.

## Notes
- v1.0 always injects the WM.md chain on reads.
- v1.1 (planned) introduces a per-directory sleep/debounce state to reduce repeated chain injection.
