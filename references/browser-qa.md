# Browser QA

Use bounded rendered review for substantial visual work.

## Pass A: batched critique

Render representative desktop and mobile states together.

Inspect:

- first viewport
- primary task flow
- main navigation
- selection
- hover
- focus
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

- fix the spacing system rather than four isolated margins
- fix selected/hover/focus as one state family
- fix mobile information priority rather than one overflow
- fix token semantics rather than individual colors

## Pass B: confirmation

Re-render the same representative states.

Confirm:

- material findings resolved
- no regression created
- layout remains coherent
- keyboard/focus still work
- mobile remains intentional

Stop when remaining issues are minor.

Continue only when a material issue appears in confirmation.

## Representative viewport set

Choose widths based on the product.

For a broad responsive web app, a useful default inspection set is:

- 1920
- 1440
- 1280
- 768
- 430
- 390
- 360
- 320

You do not need a screenshot for every width if browser inspection verifies the intermediate behavior.

## Operate, do not only look

Where applicable:

- click
- hover
- type
- filter
- sort
- open/close
- back/forward
- resize
- scroll
- keyboard navigate
- trigger retry/error recovery
- use export/download

A screenshot cannot prove behavior.

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

If a routine next step is discoverable only inside unrelated detail, requires re-entering known criteria, or forces the user away from the selected object and back again, compare a more local contextual path.

Keep deliberate depth when it clarifies the task or manages density.

Read `task-continuity.md` for the continuity model.

## Honesty

If no rendered browser is available:

- inspect source and available snapshots
- do not claim visual/browser verification
- state the limitation

If performance was observed but not measured, say observed.


## Structural and silhouette review

For open-direction substantial work, inspect one visually simplified representation before final polish.

Possible methods:

- grayscale screenshot
- temporary removal of shadows/radii/background fills
- zoomed-out screenshot
- quick wireframe capture

Ask whether the domain still shapes the page when styling is stripped away.

Compare the silhouette to unrelated recent work when available.

If the same hero/right-rail/card geometry keeps returning, go back to Structural Direction.

## Care/detail review

Inspect at 100% scale, not only full-page fit.

Check:

- font rendering
- wrapping
- icon alignment
- control geometry
- selected/hover/focus behavior
- image crops
- dividers
- empty/loading/error states
- content density
- touch targets
- context preservation when opening detail

A screenshot that looks fine at 25% zoom can still feel careless in real use.
