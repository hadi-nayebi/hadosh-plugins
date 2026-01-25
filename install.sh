#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_DIR="$HOME/.config/opencode"

mkdir -p "$CONFIG_DIR/plugins" \
  "$CONFIG_DIR/commands" \
  "$CONFIG_DIR/skills" \
  "$CONFIG_DIR/agents"

ln -sf "$ROOT_DIR/behaviors/wm-guard/plugin/wm-guard.js" "$CONFIG_DIR/plugins/wm-guard.js"

for cmd in "$ROOT_DIR/behaviors/wm-guard/commands"/*.md; do
  ln -sf "$cmd" "$CONFIG_DIR/commands/"
done

for skill in "$ROOT_DIR/behaviors/wm-guard/skills"/*; do
  ln -sf "$skill" "$CONFIG_DIR/skills/"
done

for agent in "$ROOT_DIR/behaviors/wm-guard/agents"/*; do
  ln -sf "$agent" "$CONFIG_DIR/agents/"
done

echo "hadosh-plugins installed. Restart OpenCode to load wm-guard."
