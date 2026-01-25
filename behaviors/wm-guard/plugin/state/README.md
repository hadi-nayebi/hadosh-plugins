# State

This directory stores runtime state for the wm-guard plugin. The `data.json` file holds sleep/debounce counters, external exception lists (allow and read-only roots), and telemetry about trigger inputs/outputs. The file is updated automatically as the plugin processes reads, diagnostics, and blocks. Avoid editing it manually unless you are debugging behavior or resetting state.
