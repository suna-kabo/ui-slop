# Interaction Contracts

Use this for consequential, asynchronous, persistent, nested, destructive, or otherwise ambiguous interactions.

Do not write a contract for every ordinary button.

## Compact contract

Record only what materially affects behavior:

- **Entry state**: what must already be true
- **Trigger**: the user action
- **Immediate response**: what acknowledges the input before completion
- **Pending state**: what remains editable, blocked, or authoritative
- **Completion**: what becomes true on success
- **Interruption**: what Escape, Back, cancel, another gesture, or navigation does
- **Failure / recovery**: what remains safe and what the user can do next
- **Focus / orientation**: where focus and spatial context end up
- **Lifetime**: what survives close, route changes, session, or reload
- **Acceptance evidence**: how the implemented behavior will be verified

## Example shape

```text
Interaction: Reassign mission
Entry: delayed mission selected
Trigger: choose compatible unit and confirm
Immediate: selected destination is visibly pending
Pending: old assignment remains authoritative until success
Success: assignment and dependent route update together
Interrupt: cancel closes chooser only; committed reassignment is not silently undone
Failure: old assignment remains; selection and retry stay local
Focus: returns to mission action region
Lifetime: committed assignment survives reload
Evidence: scenario asserts assignment, Back return, and persisted state
```

The example is a format, not a prescribed interaction.

## Relationship to other modules

- Task Continuity owns longer-lived state and return across several actions.
- Interaction Hierarchy owns whether something is a popover, modal, drawer, route, or immersive mode.
- Experience Dynamics owns the interaction model and behavioral qualities.
- This module owns the contract of one important interaction.
