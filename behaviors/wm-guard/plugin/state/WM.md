<directory-commentary>
  <file path="README.md">
    Documents the purpose of the plugin state directory and how it is used by wm-guard. It explains that data.json stores sleep/debounce counters, external exception roots, and telemetry for triggers and outputs. Keep this file updated when state semantics evolve so users understand what is persisted and why. This entry should stay aligned with the plugin logic and the state schema.
  </file>
  <file path="data.json">
    Runtime state file created and updated by the wm-guard plugin. It stores per-directory sleep counters, external allowlist/read-only roots, and telemetry records for triggers and outputs so the behavior can learn patterns over time. This file is expected to change frequently and is generally ignored by git. Do not edit it manually unless you are debugging or resetting state.
  </file>
</directory-commentary>
