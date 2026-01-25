<directory-commentary>
  <file path="README.md">
    Documents the purpose of the state directory and how it is used by wm-guard. It explains that data.json is a runtime ledger for sleep/debounce behavior and may change during normal use. Keep this file updated when state semantics evolve so users know what is persisted. This entry should stay aligned with the plugin logic and the README guidance.
  </file>
  <file path="data.json">
    Runtime state file created and updated by the wm-guard plugin. It stores per-directory sleep counters, last-read timestamps, and configuration for skip thresholds so the system can reduce repeated WM.md injections. This file is expected to change frequently and is generally ignored by git. Do not edit it manually unless you are debugging or resetting state.
  </file>
</directory-commentary>
