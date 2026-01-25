# WM Commentary Guide

WM.md commentary is appended to reads, so its job is to orient you quickly: what the file does, why it matters, and what to check next. Good commentary reminds you about neighbors, dependencies, and gotchas.

## Strong patterns
- State purpose and scope.
- Mention adjacent files or directories that are commonly edited together.
- Call out risks, invariants, or behavior that might surprise you.
- Add a “next time” reminder (tests to run, files to verify, or side effects).

## Weak patterns
- Generic statements (“this is a config file”).
- No mention of relationships or dependencies.
- Too short to be useful when appended to a read.

## Example (strong)
<file path="install.sh">
Install script that wires the organ into the global OpenCode config via symlinks. When you change the repo layout, update this script and verify the symlinks map to the correct directories. Also keep the README install steps in sync so new users don’t follow stale instructions.
</file>
