# Changelog

## 0.3.0 - 2026-01-25
### Added
- External allowlist and read-only roots for prototype access
- Telemetry capture for trigger inputs/outputs in `plugin/state/data.json`

### Changed
- Plugin state moved under `plugin/state` to keep sensor and data colocated
- README and WM policy updated with new behavior guidance

## 0.2.0 - 2026-01-24
### Added
- Sleep/debounce state ledger at `behaviors/wm-guard/state/data.json`
- Per-directory skip logic (first read injects chain, subsequent reads skip chain while still validating)

### Changed
- README notes now describe sleep/debounce behavior
- WM policy clarifies chain skipping while preserving validation
- State docs updated with `data.json` semantics
- WM policy expanded with objective, organ model, warnings, and exception guidance

## 0.1.0 - 2026-01-24
### Added
- Initial public release of wm-guard organ
- Command templates, skills, and steward subagent
- Symlink-based installation flow
