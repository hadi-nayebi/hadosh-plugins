<directory-commentary>
  <file path="README.md">
    Behavior-specific README for wm-guard. It describes the event layer, command and skill cells, and how the organ evolves over time. Update this file whenever the enforcement logic or organ structure changes so readers understand the current behavior. This is the canonical narrative for the organ, so keep it aligned with the plan and plugin.
  </file>
  <subdir path="plugin/">
    The core enforcement brain for wm-guard. This directory houses the plugin entry point that intercepts tool calls, validates WM.md chains, and injects commentary into reads. Any change here affects runtime enforcement, so update related commands, skills, and documentation whenever you change this code.
  </subdir>
  <subdir path="commands/">
    Procedural memory for wm-guard. These command templates describe repeatable repair and maintenance flows such as wm-init and wm-sync. Keep them aligned with plugin behavior and the WM policy so repairs are consistent and predictable. If you add a new enforcement rule, update or add a command to address it.
  </subdir>
  <subdir path="skills/">
    Interpretive memory for wm-guard. Skills guide the agent on how to write commentary, perform audits, or set up policy references. Keep the skills aligned with policy and commands so the organ has a coherent self-repair and growth loop. Use this directory to evolve the quality of WM.md guidance.
  </subdir>
  <subdir path="agents/">
    The organ maintenance agents. This directory includes the WM steward subagent that repairs drift, updates commentary, and proposes improvements. Any changes to agent permissions or responsibilities should be reflected here and in the policy. Keep agent definitions consistent with the organ model and command set.
  </subdir>
  <subdir path="templates/">
    Bootstrap templates for projects adopting the WM guard organ. These files include a base AGENTS.md and opencode.json configuration with the correct instruction paths. Update templates when the policy or permission model changes so new projects start in a correct state.
  </subdir>
  <subdir path="examples/">
    Example commentary and sample WM.md files. These are teaching artifacts used to show high-signal directory commentary patterns. Update them as the organ evolves and as you discover better commentary structures. They should remain concise but informative for onboarding.
  </subdir>
  <subdir path="state/">
    Reserved space for organ state. In future releases this will store small state files like a sleep or debounce ledger. Keep this directory empty in v1.0 and document any new state you introduce so behavior remains transparent and debuggable.
  </subdir>
</directory-commentary>
