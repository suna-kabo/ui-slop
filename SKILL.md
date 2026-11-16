---
name: ui-slop
description: Anti-slop UI design and engineering system for designing, rebuilding, refining, or auditing production interfaces. Preserves the product contract while giving broad presentation freedom, with opinionated layout, spacing, rounded/humanist typography, restrained color, motion, accessibility, performance, capability discovery, and mandatory browser self-review. Use for web apps, dashboards, research tools, SaaS products, internal tools, responsive frontends, and substantial UI work.
---

# UI Slop

Use this skill when the user asks to design, redesign, rebuild, implement, refine, or audit a product UI.

The goal is not to produce a fashionable screenshot. The goal is to create a product interface that is clear, purposeful, distinctive, performant, accessible, and pleasant to use for long periods.

## 0. Choose the operating mode

Match the process to the user's scope before changing anything.

Use one of these modes:

- **Audit:** inspect and critique only. Do not modify files, code, design, or deployment.
- **Refinement:** preserve the approved design direction and architecture. Fix material hierarchy, spacing, density, typography, interaction, accessibility, responsiveness, or polish issues without restarting the design.
- **Ground-up rebuild:** preserve the product contract but treat the presentation layer as redesignable. Rebuild information architecture, component structure, design system, and presentation from first principles when the user grants that authority.

Do not turn a refinement request into a redesign.

Do not turn an audit into implementation.

Do not preserve the old presentation during a ground-up rebuild merely because changing it creates a larger diff.

Scale validation effort to the task, but substantial UI work still requires real rendered review.

## 1. Establish the product contract first

Before changing presentation, identify what is actually protected.

Extract the product contract from the existing implementation, specifications, tests, routes, data models, documentation, and user instructions.

The protected contract may include:

- domain semantics
- calculations and business rules
- data integrity
- user workflows
- required actions
- saved state
- exports/imports
- routes and browser history
- permissions and authentication behavior
- loading, empty, error, offline, and recovery behavior
- keyboard behavior
- accessibility requirements
- responsive behavior that is functionally important
- external integration boundaries

Do not change domain logic merely because the UI is difficult to explain.

Simplify the presentation instead.

If the task is an audit-only task, do not modify the product.

## 2. Treat presentation as disposable when the task allows it

For a ground-up redesign, the existing presentation layer is not protected merely because it exists.

You may remove, replace, relocate, merge, or redesign:

- navigation
- sidebars
- top bars
- tabs
- cards
- tables and table columns
- filters
- search
- sorting controls
- inspectors
- dialogs
- status bars
- helper text
- badges and pills
- breadcrumbs
- page titles
- empty states
- mobile navigation
- responsive structure
- CSS architecture
- frontend component hierarchy
- motion
- visual tokens
- icons
- font choices

If something is unnecessary, delete it.

If several controls can become one simpler interaction, combine them.

If a feature should be contextual instead of permanently visible, move it into the relevant workflow.

Do not preserve technical debt merely to reduce diff size.

For a true ground-up rebuild, do not start by restyling the old stylesheet.

Treat the existing frontend primarily as a behavioral reference unless the user explicitly protects its presentation.

Use this sequence:

1. inspect existing functionality and user flows
2. document the protected product contract
3. identify reusable data/API boundaries
4. establish a new information architecture
5. establish a new component architecture
6. establish the design system and tokens
7. build a fresh shell
8. migrate required behavior into it
9. validate behavioral parity
10. remove obsolete presentation code

When practical, build the new shell separately before replacing the old presentation.

For a substantial ground-up rebuild, read the design-system, layout/spacing, typography, and motion references before committing to the new presentation language.

A large frontend diff is acceptable when the task genuinely calls for a new interface.

If the final screenshots still look structurally like the old UI with different colors, spacing, or radius values, the ground-up redesign has failed.

## 3. Find the core user questions

Reduce the product to the smallest set of questions or jobs the interface must answer.

Examples:

- What is happening?
- What changed?
- What needs attention?
- What should I do next?
- What object am I inspecting?
- What evidence supports this state?

The primary workflow must dominate the visual hierarchy.

Secondary utilities must remain accessible without competing with the primary workflow.

Do not make every feature equally prominent.

## 4. Reject AI-slop patterns

Do not default to generic dashboard conventions simply because they are easy to generate.

Avoid by default:

- sidebars used only because "apps have sidebars"
- card grids for every type of information
- rounded rectangles around every object
- giant marketing-style headings inside working software
- gradient hero panels
- a subtitle under every heading
- pill overload
- meaningless icons
- badges everywhere
- glassmorphism used as a general surface system
- generic KPI cards
- decorative charts that do not improve decisions
- helper text filling empty space
- identical section layouts repeated mechanically
- generic SaaS/admin hierarchy
- large empty hero regions in data-heavy products
- fake sophistication through glow, blur, and gradients

Every structural element must earn its space.

If the result looks like a generic AI-generated dashboard, redesign it.

## 5. No defensive writing

Visible product copy must earn its space.

Do not expose unnecessary:

- implementation explanations
- developer reasoning
- technical diagnostics
- internal architecture terms
- methodology narration that users do not need at that moment
- defensive disclaimers
- obvious instructions
- filler subtitles
- prose added because a section looks empty
- copy explaining a confusing interaction instead of fixing the interaction

Solve confusion first through:

- naming
- hierarchy
- grouping
- visual relationships
- affordance
- interaction
- progressive disclosure

Use explanatory text only when it materially helps the user make a decision or complete a task.

## 6. Visual direction hierarchy

User-provided brand, art direction, and product context override the default aesthetic below.

If no clear art direction exists, use this opinionated fallback:

- calm
- modern
- mature
- restrained
- medium density
- slightly Japanese in discipline: precision, alignment, negative space, and quiet surfaces rather than cultural decoration
- visually humble
- highly polished in interaction
- distinctive through proportion, typography, alignment, spacing, and motion rather than decoration

Default visual character:

- neutral charcoal / near-black / gray / off-white foundation
- approximately 85–90% neutral surfaces and text
- approximately 10–15% semantic or interaction color
- soft off-white primary text on dark foundations
- muted secondary text
- restrained cool interaction accent
- muted green positive
- muted coral negative
- restrained amber warning
- modest radii
- ruled separation where a card is unnecessary
- minimal decorative chrome

Do not introduce cultural motifs merely because the fallback mentions Japanese restraint.

Static screenshots should look controlled and humble.

The interface should reveal more personality while being used than while sitting still.

Do not confuse restraint with emptiness or under-design.

## 7. Typography default

When no brand type system is specified, prefer a rounded or humanist UI typeface with some personality.

Desired characteristics:

- slightly soft or rounded forms
- friendly but mature
- highly readable at small sizes
- comfortable in dense product interfaces
- clear numerals
- strong distinction between weights
- not corporate-industrial by default
- not childish
- not exaggeratedly condensed
- not editorial-serif unless the product specifically benefits from that direction

Do not choose a font by reputation alone.

Audition multiple suitable typefaces in the actual rendered interface before settling on one when the environment permits it.

Useful reference directions include:

- Torus-like rounded UI typography
- modern humanist grotesks
- restrained variable sans families
- softer product-oriented system fonts

If using an external font:

- verify the license
- self-host when appropriate
- prefer WOFF2
- minimize font files and weights
- use variable fonts where they genuinely reduce cost
- preload only what materially helps
- avoid layout shift
- define sensible fallbacks

Use tabular numerals for tables, financial data, measurements, timers, or any interface where column alignment matters.

Typography must remain readable at 200% text scaling.

## 8. Color default

User brand direction overrides this section.

When no palette is specified, prefer a neutral foundation with restrained semantic color.

A useful default ratio is approximately:

- 85 to 90 percent neutral surfaces and text
- 10 to 15 percent semantic or interaction accents

Use color primarily for:

- state
- hierarchy
- focus
- selection
- positive/negative meaning
- warning or error meaning

Avoid by default:

- neon palettes
- constant glow
- giant accent-color surfaces
- gradient-heavy backgrounds
- decorative color without meaning
- too many competing brand hues

Dark and light themes are both acceptable. Choose based on the product and context rather than habit.

For long-session research or operational software, neutral charcoal or soft off-white foundations are often effective starting points.

## 9. Density and spacing

Default to medium density unless the product clearly needs another mode.

The UI should not feel cramped.

The UI should not feel like a marketing landing page.

At common desktop widths, meaningful content should use the available space instead of floating inside unnecessarily narrow columns.

Avoid solving empty space by adding decorative content.

Improve composition first.

Use a consistent spacing rhythm, but do not let token systems force awkward layouts.

Related data should sit close together. Unrelated workflows need stronger separation.

## 10. Build one coherent design system

Do not design each page independently.

Before detailed polish, establish a shared UI grammar for:

- canvas and raised surfaces
- text hierarchy
- semantic colors
- spacing rhythm
- content widths
- borders and dividers
- radii
- control heights
- table/list rhythm
- hover, pressed, selected, disabled, loading, and focus states
- inspector/dialog behavior
- navigation behavior
- motion timing and easing
- responsive breakpoints
- mobile transformation rules

Prefer a small number of deliberate tokens over many local exceptions.

Consistency does not mean every section should look identical. Reuse the same grammar while allowing each workflow to have the composition it needs.

The design system should make unrelated screens feel like the same product without forcing them into the same card template.

Read `references/design-system.md` when establishing a new UI language or when an existing frontend feels visually fragmented.

## 11. Tables, lists, and data surfaces

Use tables when the user genuinely benefits from aligned comparison across columns.

Do not use a table simply because the data is structured.

Do not turn every record into a card.

For dense research or operational products:

- align numerics
- make row interactivity obvious
- keep important identity fields visually stable
- separate state from direction when they are different concepts
- prioritize scan speed
- keep sorting/filtering understandable
- avoid horizontal scrolling when a better responsive representation exists

On mobile, redesign the information representation intentionally instead of stacking desktop columns blindly.

## 12. Motion and interaction

High-quality motion is encouraged when it improves continuity, hierarchy, cause and effect, or spatial understanding.

Fancy interaction is acceptable.

Fancy decoration is optional.

Good uses include:

- active indicator gliding between tabs or destinations
- subtle row movement or contrast on hover
- compact press feedback
- inspector or detail surfaces opening from a contextual direction
- filter state transitions
- selection morphing
- lightweight page transitions
- data movement transitions after a refresh when they improve comprehension

Default timing guidance:

- small feedback: roughly 120 to 180 ms
- ordinary navigation or state transition: roughly 150 to 220 ms
- longer only when the spatial transition genuinely benefits from it

Prefer compositor-friendly animation:

- transform
- opacity

Be cautious with:

- large animated blur
- repeated backdrop-filter animation
- animated large shadows
- width/height animation that causes layout work
- unnecessary continuous animation
- JavaScript animation loops

Avoid layout thrashing.

Do not animate large tables merely for spectacle.

Respect `prefers-reduced-motion`.

Interaction polish must not make the product feel slower.

## 13. Navigation

Choose navigation from the product's information architecture, not from convention.

Do not automatically choose a sidebar, top navigation, or bottom navigation.

Fewer core destinations often benefit from lighter navigation.

Secondary destinations should remain available without receiving equal emphasis.

On mobile, navigation may use a different structure from desktop.

Back/Forward behavior, deep links, focus restoration, and route continuity should remain coherent.

## 14. Inspectors, dialogs, and drilldowns

Use contextual detail surfaces when they let users inspect an object without losing list context.

Avoid nested cards inside inspectors.

Prioritize:

1. identity
2. current state
3. evidence
4. relevant metrics
5. related objects or actions

Do not fill empty inspector space with explanatory prose.

If a section has no meaningful content, usually do not render it.

Restore focus to the originating control when the detail surface closes.

## 15. Capability discovery and tool freedom

Before substantial design work, inspect the actual capabilities available in the environment.

Look for relevant:

- frontend implementation skills
- product design skills
- UI/UX review skills
- interaction or motion skills
- browser automation
- accessibility tooling
- performance tooling
- visual comparison tooling
- image generation when visual exploration is genuinely useful
- design or prototyping plugins
- repository and deployment tools

When the environment permits it, you may discover, enable, or install additional relevant skills/plugins rather than limiting yourself to the initially visible toolset.

Do not install or connect tools merely to increase tool count.

Use each capability for a clear purpose.

Before installing, connecting, or executing a third-party capability:

- inspect what it does and why it is needed
- prefer the minimum permissions/capabilities required
- do not expose secrets, private files, credentials, or unrelated user data
- do not run untrusted setup scripts blindly
- keep external network access scoped to the task

Do not claim a skill/plugin was used unless it was actually invoked.

Read its instructions before relying on it.

If installation, authentication, or connection requires explicit user approval, follow the platform's approval flow. Do not bypass it.

If a useful external capability is unavailable, use the strongest available alternative and continue unless the missing capability makes the task impossible.

## 16. Mandatory browser self-review

Do not finish substantial UI work after only coding and automated tests.

Use this loop:

1. understand the product
2. identify protected behavior
3. establish the design direction
4. implement
5. run the actual product
6. open it in a real browser
7. interact with it
8. inspect visually
9. identify problems
10. revise
11. repeat

Operate the product as a user would.

Where applicable:

- click controls
- hover interactive rows
- use filters and sorting
- search
- scroll long lists
- open and close detail surfaces
- use Back and Forward
- use keyboard navigation
- use Saved/favorites/bookmarks
- test export/download actions
- test loading, empty, error, disconnected, and recovery states
- resize the viewport
- inspect content with unusually long labels
- inspect reduced-motion mode
- inspect 200% text scaling

Do not infer visual quality from test counts.

Screenshots must be visually inspected, not merely captured.

If a real browser or equivalent rendered environment is unavailable, do not claim browser validation. Use the strongest available rendering/inspection method and report that limitation clearly.

## 17. Viewport acceptance

For a substantial responsive web product, inspect representative widths such as:

- 1920
- 1440
- 1280
- 768
- 430
- 390
- 360
- 320 px

Adjust the set when the product has different target devices.

Do not only check for overflow.

Judge composition, hierarchy, density, touch usability, text wrapping, and scan speed at each width.

Mobile does not need to structurally resemble desktop.

## 18. Accessibility

Use native semantics wherever possible.

Verify at minimum:

- keyboard reachability
- visible focus
- focus restoration
- meaningful accessible names
- dialog containment where appropriate
- no color-only communication of critical meaning
- contrast
- 200% text and reflow
- reduced motion
- forced-colors/high-contrast behavior when relevant
- touch-target usability on mobile

Accessibility fixes should integrate with the design rather than look bolted on.

## 19. Performance

Visual polish cannot come at the cost of interaction quality.

Inspect at minimum:

- initial rendering
- page transitions
- detail/inspector transitions
- scrolling large lists or tables
- filtering and sorting
- resizing
- mobile interaction
- reduced-motion mode

Remove motion or effects that materially harm responsiveness.

Avoid adding heavy libraries when native CSS or small existing utilities are sufficient.

## 20. Tests and existing presentation assertions

Do not weaken genuine product-contract tests to make a redesign pass.

However, presentation-specific tests may be updated when they freeze obsolete UI structure, copy, selectors, or placement that the redesign intentionally changed.

When updating such a test:

- preserve the behavior being tested
- use accessible and durable selectors where possible
- test the current interaction instead of restoring obsolete UI solely for the test

If documentation describes a removed interaction, update the current documentation too.

Historical/archive documentation should remain historical rather than being rewritten to pretend it was always current.

## 21. Autonomous design authority

When the user grants broad redesign authority, make design decisions yourself.

Do not ask the user to enumerate every problem in the current UI.

Do not preserve an element merely because nobody explicitly approved its removal.

Do not ask permission to remove obviously redundant presentation if the task already grants redesign authority.

Ask only when a decision changes the protected product contract, introduces a consequential new requirement, or requires user authentication/approval that the platform cannot provide autonomously.

## 22. Self-criticism

Review the result from multiple perspectives:

- first-time user
- frequent user
- product designer
- frontend engineer
- accessibility reviewer
- performance reviewer

Ask:

- Is the core workflow obvious?
- What deserves attention first?
- Is any element visually louder than its importance?
- Is anything present merely because dashboards usually contain it?
- Does any text exist because the design failed to communicate by itself?
- Does anything feel generic or AI-generated?
- Does the interface feel under-designed because restraint became emptiness?
- Does it feel over-designed because polish became decoration?
- Are interactions satisfying without delaying the user?
- Would this interface remain comfortable after hours of use?

Reject your own work when evidence shows the design direction is wrong.

Do not defend a weak design because implementation was expensive.

## 23. Completion criteria

A substantial UI redesign is not complete merely because tests pass.

It is complete when:

- the core workflow is immediately understandable
- secondary utilities no longer dominate
- the information hierarchy matches user priorities
- unnecessary UI and copy have been removed
- typography is deliberate and readable
- color is restrained and meaningful
- desktop and mobile both feel intentional
- important interactions are discoverable
- motion feels polished but fast
- accessibility checks pass
- performance remains strong
- browser review caused real refinements
- remaining visual/interaction issues are minor rather than structural
- the result does not look like a generic AI-generated dashboard
- if a ground-up rebuild was requested, the old presentation is no longer visibly the structural basis of the new one

## 24. Final report

Keep the final implementation report concise.

Report only what helps the user validate the result, such as:

- final design direction
- major structural changes
- major obsolete UI removed
- skills/plugins actually used
- browser/viewport coverage
- accessibility result
- performance result
- tests
- screenshots or review artifacts
- genuine unresolved limitations

Do not add defensive implementation narration.

## Supporting references

Read `references/origin-principles.md` when you need the compact rationale behind the skill.

Read `references/visual-defaults.md` when the user has not supplied a strong art direction.

Read `references/design-system.md` when establishing a new visual language or repairing a fragmented one.

Read `references/layout-spacing-system.md` when establishing or repairing composition, responsive structure, density, or spacing.

Read `references/typography-system.md` when selecting or changing product typography.

Read `references/motion-system.md` for substantial interaction, transition, inspector, navigation, or data-change animation work.

Read `references/review-checklist.md` before final acceptance of a substantial UI build or redesign.
