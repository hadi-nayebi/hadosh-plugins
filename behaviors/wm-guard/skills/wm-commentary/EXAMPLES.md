# WM Commentary Examples

These examples show how to write 50+ word entries that are actually helpful when WM.md is appended to a file read. The goal is to remind the reader about neighboring files, dependencies, and usage context.

## Example 1: Good file entry
<file path="plugin/wm-guard.js">
The core enforcement plugin that intercepts read/list/grep/glob activity and injects the WM chain. It also blocks rm/mv outside wrappers, tracks session allowances, and logs reminders on file edits. When you touch this file, also check the command templates and skills to keep behavior consistent. Any changes here should be mirrored in the plan and behavior README.
</file>

## Example 2: Good subdir entry
<subdir path="commands/">
This directory contains the command templates that drive WM repairs. Each command is a prompt recipe for the agent to use built-in tools consistently, so it is effectively the procedural memory for the organ. When you add or change a command, review the plugin rules and skills to ensure the repair loop remains aligned. Keep this set minimal and well-documented.
</subdir>

## Anti-pattern: Too generic
<file path="README.md">
This is the README.
</file>

## Improved version
<file path="README.md">
The primary entry point for users installing hadosh-plugins. It explains the organ model, the wm-guard behavior, and how to install via symlinks. If the install process or behavior capabilities change, update this file alongside install.sh and the behavior README so new users don't drift into mismatched expectations.
</file>
