# Browser QA

Use bounded rendered review for substantial visual work.

## Pass A: batched critique

Render representative desktop and mobile states together.

Inspect:

- first viewport
- primary task flow
- navigation
- selection
- hover/focus
- detail/inspector/dialog
- long labels
- dense data
- empty/loading/error where relevant
- narrow layout
- reduced motion
- 200% zoom/text
- console/runtime errors

Collect material findings before editing.

## Fix batch

Repair related findings together.

Examples:

- fix the spacing/density system rather than isolated margins
- fix selected/hover/focus as one state family
- fix mobile information priority rather than one overflow
- fix token semantics rather than individual colors
- fix an interaction concept rather than swapping one slide animation for another

## Pass B: confirmation

Re-render the same representative states.

Confirm:

- material findings resolved
- no regression created
- layout remains coherent
- keyboard/focus still work
- mobile remains intentional
- repeated interactions still feel efficient

Stop when remaining issues are minor.

## Representative viewport set

Choose widths based on the product.

For a broad responsive web app, a useful default inspection set may include wide desktop, common desktop, tablet/intermediate, and 320–430px narrow/mobile states.

Do not capture every width merely to create evidence. Inspect where the composition or interaction actually changes.

## Operate, do not only look

Where applicable:

- click
- hover
- type
- filter
- sort
- select
- compare
- open/close
- follow a relationship
- back/forward
- resize
- scroll
- keyboard navigate
- trigger retry/error recovery
- use export/download

A screenshot cannot prove behavior.

## Record one interaction sequence

For a primary workflow, record the actual sequence of states, not only endpoint screenshots.

Example structure:

initial
→ user expresses interest
→ selection acknowledged
→ related context responds
→ detail or comparison changes
→ user follows another object
→ Back/close restores context

For each step note:

- what changed
- what stayed anchored
- what moved/reflowed/revealed
- what the next likely action became
- whether the same generic effect was reused
- whether the transition improved understanding

This is the main evidence for interaction quality.

## Repeat a core task from live state

When a surface is meant for repeated work or browsing, start a second pass from the selected item, filtered results, or ongoing activity left by the first pass.

Follow the next likely comparison, inspection, related destination, or mode switch on desktop and touch.

Record:

- starting selection/filter/mode
- next-action location
- intervening layers or routes
- scroll movement needed to continue
- Back/close behavior
- restored selection/filter/sort
- restored scroll position
- focus destination
- ongoing state such as playback
- reload behavior for state expected to survive

Also test one nested path where relevant, such as detail → related detail → Back → Back.

Read `task-continuity.md` for the continuity model.

## Presentation-rhythm review

At real scale inspect:

- first-viewport information value
- empty/dead regions
- whether density is bought with microtype
- whether body/reading text remains comfortable
- repeated typographic roles
- spacing cadence
- desktop versus mobile information priority

If most visible working copy is around 12px or smaller, investigate rather than assuming dense UI requires it.

Read `presentation-rhythm.md`.

## Interaction causality review

For any meaningful motion or transformation, trigger at least one unrelated state change that should **not** replay it.

Examples:

- saving a note should not redraw an unchanged route
- toggling Saved should not replay a timeline transition if time context did not change
- opening unrelated detail should not re-run a relationship trace that already settled

If motion replays because a broad render function rebuilt the element rather than because the represented state changed, fix the state/animation ownership.

For spatial or time-based domain objects that users repeatedly edit, test whether at least one direct-manipulation path is appropriate.

If every edit is routed through buttons/selects/forms, confirm that this is deliberate rather than implementation convenience. Keep precise control alternatives and keyboard/touch access.

## Behavioral silhouette review

Describe only the mechanics of the product, ignoring visual styling.

Compare with unrelated recent work when available.

If several products share essentially the same hover, selection, detail, route, and mobile interaction mechanics, return to interaction-concept exploration.

Read `experience-dynamics.md`.

## Cross-product visual-world review

When unrelated recent work is available, compare the current product's material sentence against it.

Describe only:

- surface/material metaphor
- color temperature and contrast
- typography voice
- borders/rules/elevation
- imagery/texture strategy
- accent logic

If essentially the same visual-world description fits three unrelated products, return to Visual Direction before polishing.

Do not fix this by swapping accent hue while preserving the same paper/dark/neon/glass/material system.

## Structural and silhouette review

For open-direction substantial work, inspect one visually simplified representation before final polish.

Possible methods:

- grayscale screenshot
- temporary removal of shadows/radii/background fills
- zoomed-out screenshot
- quick wireframe capture

Ask whether the domain still shapes the page when styling is stripped away.

If unrelated work has the same hero/right-rail/card geometry, go back to Structural Direction.

## Care/detail review

Inspect at 100% scale, not only full-page fit.

Check:

- font rendering and wrapping
- icon alignment
- control geometry
- selected/hover/focus behavior
- image crops
- dividers
- empty/loading/error states
- content density
- touch targets
- context preservation when opening detail
- whether utility surfaces share the same craft level

A screenshot that looks fine at 25% zoom can still feel careless in real use.

## Honesty

If no rendered browser is available:

- inspect source and available snapshots
- do not claim visual/browser verification
- state the limitation

If performance was observed but not measured, say observed.
