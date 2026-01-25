<directory-commentary>
  <subdir path="wm-commentary/">
    The commentary skill and examples. This subdir teaches how to write 50+ word WM.md entries with real context and actionable reminders. It also includes example patterns and anti-patterns to help maintain quality. Update it when you refine how commentary should be structured or when you discover better guidance.
  </subdir>
  <subdir path="wm-setup/">
    The setup skill for aligning AGENTS.md and opencode.json with the WM policy. It guides initial project setup and migration checks. Keep it synchronized with the policy and command templates so onboarding remains accurate. Update it whenever instruction paths or permission expectations change.
  </subdir>
  <subdir path="wm-repair/">
    The repair skill that defines the WM-STATUS fix loop. It explains when to run wm-init versus wm-sync and how to expand commentary. This skill ensures the organ can recover from drift quickly. Keep it aligned with plugin validation rules and the minimum word requirement.
  </subdir>
  <subdir path="wm-audit/">
    The audit skill that checks alignment across policy, plugin, commands, and skills. It outputs a remediation checklist for drift. Use it before releases or after major changes to the enforcement logic. Update it when new hooks, behaviors, or command flows are introduced.
  </subdir>
  <subdir path="wm-policy/">
    The runtime WM policy document. It is loaded as instructions and must match the enforcement behavior. If you update the plugin rules or command flows, update this policy immediately. This subdir anchors the organ's behavioral contract and keeps documentation authoritative.
  </subdir>
</directory-commentary>
