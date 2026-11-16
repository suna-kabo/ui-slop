# Changelog

## 1.7.0

Evidence-driven continuity release.

Two independent sample sets showed that UI Slop v1.6 successfully improved semantic diversity, reactive shared state, and information relationships, but could still interrupt repeated work after the first successful action.

Added `references/task-continuity.md` covering:

- explicit state lifetimes
- action locality
- return contracts
- browse topology
- relationship actionability
- mode transitions
- responsive continuity
- history/URL semantics
- second- and third-action QA

Updated `references/information-relationships.md` to connect frequently revisited relationships with task continuity.

Expanded `references/browser-qa.md` so repeated-task testing records:

- next-action location
- route/layer depth
- scroll movement
- Back/close behavior
- restored filters/selection/sort
- focus
- ongoing state
- reload behavior
- nested detail return

Updated SKILL.md with only a small continuity hook and acceptance checks. Detailed guidance remains in references.

Evidence:

- `evidence/v1.6.1-candidate-probe.md`
- `evidence/cross-sample-findings-v1.7.md`

## 1.6.1 candidate

- `references/information-relationships.md` asked where a frequently revisited relationship belongs when the user already has a selection or active filter.
- `references/browser-qa.md` added a second-pass test from live state.
- This was a valid but incomplete diagnosis. v1.7 generalizes the finding into Task Continuity.

## 1.6.0

- Added Semantic Diversity guidance.
- Defined semantic-to-component collapse as a generated-UI failure mode.
- Added Reactive Surfaces guidance.
- Added Information Relationship Map guidance.
- Added shared-state and linked-view planning.
- Added responsive interaction requirements.
- Expanded AI Fingerprint Gate, Browser QA, and Taste Gate for semantic repetition and isolated-widget behavior.
