<directory-commentary>
  <file path="README.md">
    The primary entry point for the hadosh-plugins repository. It explains the organ model, how behaviors are structured, and how to install and update via symlinks. If you change the install process, behavior layout, or add new organs, update this file so new users are guided correctly. Keep it aligned with install.sh and the behavior README so documentation stays consistent.
  </file>
  <file path="CHANGELOG.md">
    The release log for hadosh-plugins. It records what shipped, which organ versions are available, and the evolution of the WM guard behavior. Update this file whenever you make a release-worthy change, such as a new feature, change in enforcement logic, or a migration adjustment. The changelog keeps the public history coherent and helps users track breaking changes.
  </file>
  <file path="LICENSE">
    The MIT license for the repository. This file defines how the code can be reused and redistributed. Keep it intact and update the year or copyright owner if needed, but avoid modifying license text unless you intentionally change licensing terms. It should stay in sync with the public repo state so downstream users have clear permissions.
  </file>
  <file path="install.sh">
    The install script that symlinks the active organ into the global OpenCode config. It creates the target directories and connects plugin, command, skill, and agent cells. If the repo layout changes or you add a new organ, update this script so installation remains reliable. Keep the steps simple and deterministic to reduce user error.
  </file>
  <file path="uninstall.sh">
    The uninstall script that removes symlinks created by install.sh. It should be conservative and only remove organ symlinks, not user files. If you add new install targets, update this script accordingly. This file is important for clean rollbacks and debugging, so keep it consistent with the install flow.
  </file>
  <file path=".gitignore">
    Git ignore rules for the repository. It prevents transient files like node_modules or state data from being committed. Update this file if new tooling or state files are introduced so the repo stays clean. It should remain simple and predictable, and avoid hiding important files that need to be versioned.
  </file>
  <subdir path="behaviors/">
    This directory contains all behavior organs for hadosh-plugins. Each organ is a self-contained behavior with its own event layer, commands, skills, agents, templates, and examples. When you add a new behavior, it should live here with its own README and WM.md chain. Keep this directory organized so each organ can evolve without cross-contamination.
  </subdir>
  <subdir path="shared/">
    Shared utilities that may be referenced by multiple behaviors. Keep this directory small and stable so organs remain loosely coupled. If you add shared code, document its contract clearly and ensure behavior READMEs reference it. Avoid heavy dependencies here because it can create tight coupling across organs.
  </subdir>
</directory-commentary>
