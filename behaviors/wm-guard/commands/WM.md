<directory-commentary>
  <file path="wm-init.md">
    Command template that creates a new WM.md for a directory. It lists current items, writes a directory-commentary block, and ensures each entry is at least 50 words. This is used when reads are blocked due to missing WM.md. Keep it consistent with validation rules and update it if the schema or policy changes.
  </file>
  <file path="wm-sync.md">
    Command template that reconciles WM.md with the live directory listing. It adds missing entries, removes stale ones, and expands commentary that is too short. This is the main repair loop for WM-STATUS warnings. Keep it aligned with plugin validation and the 50-word requirement.
  </file>
  <file path="wm-check.md">
    Command template for a read-only validation pass. It compares WM.md to the live directory contents and reports missing or extra entries without editing. Use it for audits or verification steps in the plan. Update it if validation logic changes or new warning types are added.
  </file>
  <file path="wm-mv.md">
    Command template for moving files or directories while keeping WM.md in sync. It performs the move, then runs wm-sync on the source and destination directories. This ensures commentary paths remain accurate after structural changes. Keep it aligned with the plugin move guard and avoid adding unrelated steps.
  </file>
  <file path="wm-rm.md">
    Command template for deleting files or directories safely. It removes the target and then runs wm-sync on the parent directory to remove stale commentary. This keeps WM.md accurate after removals. Maintain caution in this command and keep it synchronized with the rm guard logic.
  </file>
  <file path="wm-setup.md">
    Command template that aligns project instructions with WM policy. It checks AGENTS.md, opencode.json instruction paths, and ensures WM.md exists. Use it during onboarding or migration. Keep it consistent with the wm-setup skill and update it when policy expectations change.
  </file>
</directory-commentary>
