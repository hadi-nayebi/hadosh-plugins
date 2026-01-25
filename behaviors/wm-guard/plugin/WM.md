<directory-commentary>
  <file path="wm-guard.js">
    The enforcement plugin for the WM guard organ. It validates WM.md chains, blocks reads when commentary is missing or stale, injects WM.md into read outputs, and emits WM-STATUS warnings for diagnostic tools. It also guards rm and mv operations, records telemetry entries, and skips WM.md injection for allowlisted external roots. Changes here should be coordinated with the plan, command templates, and skills.
  </file>
  <subdir path="state/">
    Local state for the wm-guard plugin. This folder holds `data.json`, which stores sleep/debounce counters, external allowlists, read-only roots, and telemetry entries that summarize tool triggers and outputs. Keeping state beside the plugin keeps the sensory layer and its memory tightly coupled and easier to audit. Update this entry whenever the state schema or data location changes.
  </subdir>
</directory-commentary>
