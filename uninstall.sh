#!/usr/bin/env bash
set -euo pipefail

CONFIG_DIR="$HOME/.config/opencode"

rm -f "$CONFIG_DIR/plugins/wm-guard.js"
rm -f "$CONFIG_DIR/commands/wm-init.md"
rm -f "$CONFIG_DIR/commands/wm-sync.md"
rm -f "$CONFIG_DIR/commands/wm-check.md"
rm -f "$CONFIG_DIR/commands/wm-mv.md"
rm -f "$CONFIG_DIR/commands/wm-rm.md"
rm -f "$CONFIG_DIR/commands/wm-setup.md"
rm -rf "$CONFIG_DIR/skills/wm-commentary"
rm -rf "$CONFIG_DIR/skills/wm-setup"
rm -rf "$CONFIG_DIR/skills/wm-repair"
rm -rf "$CONFIG_DIR/skills/wm-audit"
rm -rf "$CONFIG_DIR/skills/wm-policy"
rm -rf "$CONFIG_DIR/agents/memory_management/wm-steward"

echo "hadosh-plugins symlinks removed."
