# Module Map

Load the smallest useful set. The router owns task classification and product contract. References own specialist reasoning.

| Need | Primary owner | Optional support |
| --- | --- | --- |
| Product truth / protected behavior | SKILL.md | task-continuity.md |
| Open structure / IA | structural-direction.md | information-design.md, real-content-first.md |
| New or replaced visual world | visual-direction.md | typography-system.md, color-system.md, art-direction-media.md, asset-strategy.md |
| Density / typography / simultaneous visibility | presentation-rhythm.md | typography-system.md, information-design.md |
| Domain relationship model | information-relationships.md | reactive-surfaces.md |
| Connected reactive implementation | reactive-surfaces.md | information-relationships.md |
| Open interaction model | experience-dynamics.md | interaction-hierarchy.md, interaction-contracts.md |
| Consequential interaction contract | interaction-contracts.md | task-continuity.md, interaction-states.md |
| Return / persistence / repeated actions | task-continuity.md | interaction-contracts.md |
| Motion implementation | motion-interaction.md | experience-dynamics.md |
| Semantic variety | semantic-diversity.md | design-system.md |
| Responsive transformation | layout-responsive.md | task-continuity.md |
| Accessibility | accessibility-baseline.md | evidence-gate.md |
| Performance | performance-baseline.md | evidence-gate.md |
| Browser evidence | browser-qa.md | evidence-harness.md, evidence-schema.md, evidence-gate.md |
| Independent review | review-protocol.md | evidence-gate.md, taste-gate.md |
| Cross-product recurrence | ai-fingerprint-gate.md | visual-direction.md, experience-dynamics.md |
| Final qualitative judgment | taste-gate.md | coherence-floor.md |

## Ownership boundaries

- `information-relationships.md` describes the domain graph and important relationships. `reactive-surfaces.md` describes how connected UI state responds.
- `experience-dynamics.md` chooses the interaction model and behavioral qualities. `motion-interaction.md` implements motion after that decision.
- `interaction-hierarchy.md` owns layered UI semantics such as transient layers versus route-level detail.
- `task-continuity.md` owns state lifetime, return, and repeated-task context. `interaction-contracts.md` owns one consequential interaction's trigger, pending state, interruption, completion, failure, and acceptance evidence.
- `browser-qa.md` owns the rendered test procedure. `evidence-gate.md` owns classification and completion severity.
- `visual-direction.md` owns an open visual world. `authored-experience.md` and `visual-commitment.md` are optional deeper annexes, not default runtime requirements.
- `craft-floor.md` and `coherence-floor.md` are optional final craft references. They do not replace Evidence Gate or Browser QA.

Historical evidence and release reports are never automatic runtime context.
