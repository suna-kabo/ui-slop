# Extension Protocol

UI Slop must remain useful when it is the only UI skill available.

Other skills are optional specialists.

## Conflict order

Prefer:

1. explicit user instruction
2. protected product/domain behavior
3. project/framework constraints
4. narrower specialist guidance inside its specialty
5. UI Slop design/taste guidance
6. UI Slop fallback suggestions

A specialist wins only inside its scope.

Examples:

- framework skill owns implementation conventions
- accessibility skill owns deeper accessibility rules
- motion skill owns advanced animation craft
- design-source skill owns fidelity to an approved Figma/reference
- product/domain skill owns semantics

None of them automatically owns the whole visual direction.

## Role assignment

When several capabilities are available, give each a narrow job.

| Capability | Role |
| --- | --- |
| UI Slop | product hierarchy, visual direction, integration, gates |
| frontend/framework | implementation conventions and engineering quality |
| critique | independent visual challenge |
| motion | advanced animation craft |
| accessibility | deeper semantics, keyboard, AT validation |
| browser automation | operate and inspect rendered product |
| performance | measurement and bottleneck analysis |
| design-source/Figma | fidelity to approved design |

## Avoid aesthetic collisions

Do not combine each skill's favorite:

- palette
- radius
- font
- card style
- navigation
- motion style

into one interface.

Resolve conflicts through the product thesis and evidence.

The final product should not reveal which skill designed which component.

## Specialist handoff

Ask specialists narrow questions where possible.

Better:

> Review the current hierarchy and name the three highest-impact composition problems.

Worse:

> Redesign the whole app.

Better:

> Check this motion grammar for continuity and performance.

Worse:

> Add cool animations.

## Standalone quality

Do not block because Impeccable, frontend-design, better-* skills, or another preferred capability is unavailable.

UI Slop contains a baseline for:

- visual direction
- color
- typography
- layout
- states
- motion
- responsive structure
- accessibility
- browser QA
- evidence review
- taste review

## Do not suppress user-selected extensions

When the user explicitly chooses another skill, honor it.

Use UI Slop to integrate the result, not to override the specialist for being different.
