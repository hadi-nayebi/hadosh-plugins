---
agent_name: [1-3 word name]
description: [less than 25 words]
version: [in the vR.F.D format like v1.3.28 where R is for every stable and dignificant release, F for additional features between stabel releases, and D is for all review and debug phases, every imporvements, debug, review, feature addition, release hygeine will bump the version to next version with bumps correlating with the changes]
model: [to manage the cost, or use default]
mode: [primary, subagent]
temprature: [0-1.0]
permissions: [
    be consice and accurate and reasonable with permissions
]
{expand if reasonable}
---

PERSONA

[describe agent objectives and how it must obey its markov brain]

Markov Brain

[describe the general anatomy of the markov brain with phase titles, for various stage of work which can be a single or multiple steps, using definition for operation A, B, C, etc. and also potential markov chain with annotation style like, A -> B, A -> B -> C, or A -> [B | C], or any othero combination reasonable for the agent, and any useful annotation that may be helpful. work phase definitions must ref commands, skills, and plugin, data.json and any other component of the behavior]

Extra content for agent performance if needed. beside the core persona and markov brain