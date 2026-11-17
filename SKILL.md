---
name: ui-slop
description: Standalone, composable UI design and engineering workflow for building, rebuilding, refining, or auditing production interfaces without generic AI composition, typography, component, or dashboard defaults. Protects product behavior while enforcing product-specific structure, art direction, semantic diversity, reactive information relationships, task continuity, accessibility, responsive behavior, browser QA, evidence, and taste review.
---

# UI Slop

Use this skill to design, rebuild, refine, implement, or audit a production interface.

The goal is not merely clean UI. The goal is a product that feels **specific, authored, cared for, technically sound, and worth using**.

UI Slop must work by itself. Other UI/design/frontend/motion/accessibility skills are optional specialists.

## 0. Route the task

Choose the smallest mode that matches the request:

- **Audit**: inspect/report only.
- **Refinement**: preserve approved structure and visual world; fix material issues.
- **Rebuild**: preserve product behavior while allowing presentation, information architecture, components, interaction model, and design system to change from first principles.

Classify the surface:

- **Workflow**: repeated tasks, speed, clarity, context.
- **Reading**: comprehension, hierarchy, annotation.
- **Persuasion**: narrative, proof, decision, action.
- **Immersion**: content/artifact leads; chrome recedes.
- **Browse / Collect**: discovery, comparison, saving, returning, fandom, shopping, media.

One product can contain several modes.

## 1. Protect the product contract

Before redesigning, identify what must remain correct:

- domain semantics and data correctness
- required workflows and actions
- auth, permissions, saved state
- imports/exports
- routes, history, deep links
- loading, empty, error, retry, offline behavior
- keyboard and accessibility requirements
- external integration boundaries
- functionally important responsive behavior

Do not weaken domain logic because presentation is difficult.

For a rebuild, existing DOM/CSS/cards/navigation/layout are behavioral references only unless explicitly protected.

## 2. Identify user jobs, domain objects, relationships, and intended feeling

Reduce the interface to the smallest useful questions:

- What is happening?
- What changed?
- What needs attention?
- What should I do next?
- What am I comparing or inspecting?
- What should I explore next?

List the objects users actually think about and the important relationships between them.

Examples:

- orders / stages / exceptions
- evidence / rankings / notes
- places / routes / time
- songs / takes / waveforms
- collections / characters / releases / products

Choose the intended feeling: calm, curious, playful, intimate, precise, collectible, expressive, premium, or another product-grounded direction.

The primary job gets the strongest hierarchy. Domain relationships should shape the interface rather than becoming isolated widgets.

For Browse / Collect and Immersion, usability alone is not enough. The product should reward exploration.

If identity or visual content matters, decide early whether the finished surface needs real/generated imagery, illustration, texture, or sourced fonts. Prototype placeholders must not silently become final art direction.

Read when relevant:

- `references/authored-experience.md`
- `references/asset-strategy.md`
- `references/information-relationships.md`

## 3. Establish a design thesis

For substantial work define:

- surface mode
- primary job
- intended feeling
- structural idea
- presentation rhythm: what is visible together and how type carries hierarchy
- type character
- interaction model: how domain objects respond and relate, not merely which effects are used
- one signature idea if useful
- one generic structural or behavioral pattern deliberately avoided

Weak: `clean modern dashboard`.

Strong theses explain how the actual domain and workflow shape the surface.

A thesis must be specific enough to reject plausible alternatives.

## 4. Explore structure before styling

When the shell is open, do not start with color or font.

Use domain objects to outline at least **three materially different spatial concepts** when practical. They must differ in geometry, not merely cards or colors.

Possible models include route/timeline, indexed ledger, object shelf, comparison canvas, stage flow, spatial map, contextual list/detail, catalog spread, or relationship field.

Judge them in low-style form first.

For Workflow surfaces, treat landing-page grammar as suspicious unless task-critical: giant slogan hero, eyebrow + headline + subtitle, empty intro region, detached top-right controls, marketing CTA hierarchy.

Controls belong near what they control. Detail does not automatically belong in a right-side rounded card.

Run the silhouette test:

> If color, copy, imagery, and branding disappear, does the geometry still feel specific to the product?

If unrelated products produce the same silhouette, reject the shell.

Read:

- `references/structural-direction.md`
- `references/information-design.md`

## 5. Establish visual commitment and art direction

If a protected visual system exists, use it. Otherwise ground direction in subject, audience, culture, materials, tempo, content, and usage.

When major axes are open, compare materially different visual/type directions rather than accepting the first safe model default.

If unrelated recent outputs already share a strong material world, at least one candidate must differ materially in surface metaphor, typography voice, contrast/color structure, and rule/elevation language. Do not repeatedly use the same anti-default visual world just because it avoids generic SaaS.

Choose the page-scale commitment level:

- **Quiet instrument**
- **Anchored world**
- **Full world**

The level follows the task, not a universal UI Slop aesthetic.

Suspicious defaults include recurring charcoal + green/purple, gray + blue SaaS, near-black + neon, cream + terracotta + serif, broadsheet rules, soft-rounded admin UI, and giant bold sans + tiny uppercase eyebrow. They are allowed only when product-grounded.

Typography must feel selected, not inherited. For identity-heavy or browse-heavy work, audition a direction with visible character when practical.

Read:

- `references/visual-direction.md`
- `references/visual-commitment.md`
- `references/typography-system.md`
- `references/color-system.md`
- `references/art-direction-media.md`
- `references/asset-strategy.md`

## 6. Build one coherent system without semantic sameness

Define only what the product needs: surfaces, text hierarchy, color roles, spacing, dividers/elevation, shape roles, control sizes, focus, interaction states, motion grammar, responsive transformations, and media rules.

Consistency means shared grammar, not repeated templates.

Do not force different meanings into the same badge, pill, tiny uppercase label, chip, or metadata treatment. Campaign identity, artwork credit, availability, timeline event, category, filter, annotation, and navigation are different semantic roles unless the product proves otherwise.

Meaning can be expressed through typography, position, color, image treatment, shape, motion, progressive disclosure, relationship, or state change instead of another component container.

Read:

- `references/design-system.md`
- `references/semantic-diversity.md`
- `references/color-system.md`
- `references/typography-system.md`

## 7. Design presentation rhythm

Typography, spacing, and density are one information system.

Decide what deserves simultaneous visibility in the important viewport. Compress information through grouping, alignment, shared context, better representation, and progressive disclosure before shrinking type.

Use the fewest typographic roles that make hierarchy unmistakable. Do not let large portions of working UI collapse into tiny uppercase or condensed metadata merely to fit more content.

Density may vary by region. Indexes and comparisons can be compact while reading/evidence surfaces breathe more. Mobile should change information priority rather than preserve desktop density by shrinking everything.

Read:

- `references/presentation-rhythm.md`
- `references/typography-system.md`
- `references/information-design.md`

## 8. Design reactive relationships, not isolated widgets

For products with connected state, decide what should react when users select, focus, filter, play, or change context.

Identify shared state such as selected object, active collection, character, filters, time range, route, playback, shift, or favorites. Map which regions should respond together.

Interaction should expose relationships that static composition cannot express as clearly. Do not add charts, animation, hover effects, or dashboards merely to appear interactive.

Important reactive relationships must work with click/tap, keyboard, narrow layouts, and reduced motion. Hover may preview but cannot be the only path.

Read:

- `references/reactive-surfaces.md`
- `references/information-relationships.md`

## 9. Explore experience dynamics before choosing effects

For substantial interactive work, interaction deserves the same exploration as layout.

When the behavior is open-ended, outline at least two materially different interaction models when practical. They must differ in how the user manipulates or traverses the domain, not merely in animation style.

Start from domain verbs and relationships. Decide:

- what the user acts on directly
- what remains the spatial or conceptual anchor
- what related regions should react
- whether the surface should reflow, re-anchor, compress, expand, traverse, or remain still
- what the next likely action becomes
- what interaction logic survives desktop, touch, keyboard, and reduced motion

Do not jump directly from "detail opens" to "fade + slide".

Consistency should come from cause/effect, spatial logic, and state ownership, not from reusing a tiny effect vocabulary across every component or product.

Read `references/experience-dynamics.md`.

## 10. Design task continuity

A feature is not complete because its first action works.

For repeated work, browsing, nested detail, playback, or saved-state flows, define:

- **state lifetime**: what is transient, view-local, navigation-continuous, session-continuous, or persistent
- **action locality**: where the next likely high-frequency action lives after selection
- **return contract**: what Back/close restores, including route, filters, selection, sort, scroll, focus, and ongoing activity
- **browse topology**: natural paths between meaningful objects beyond search and facets
- **relationship actionability**: whether important relationships can be followed or compared when users need them

Do not let implementation convenience decide mode transitions or persistence.

On mobile, continuity includes preserving the selected context and keeping the next action reachable without unnecessary backtracking.

Test the second and third action, not only the first.

Read `references/task-continuity.md`.

## 11. Implement complete interaction and motion

For each important interactive component, cover applicable default, hover, pressed, focus-visible, selected/current, disabled, loading, empty, error, and success states.

Use native semantics where they solve the interaction well.

For layered detail:

- Escape dismisses the topmost transient layer
- browser/system Back handles route-level detail
- Enter/Space activates the focused trigger
- do not bind Space globally to dismissal
- restore focus to the invoker after transient detail closes

Motion comes **after** the interaction model. It may explain cause/effect, spatial continuity, relationship traversal, hierarchy, or one product-specific authored moment.

Do not establish a universal UI Slop recipe for duration, travel distance, easing, opacity, scale, or slide direction. Relative timing should follow frequency, distance, consequence, and sequence.

Do not use hover lift, image zoom, fade-and-rise, or small translate as personality by default.

Respect `prefers-reduced-motion` while preserving meaningful state feedback and hierarchy.

Read:

- `references/interaction-states.md`
- `references/interaction-hierarchy.md`
- `references/experience-dynamics.md`
- `references/motion-interaction.md`

## 12. Compose responsive behavior, not desktop stacking

Use spacing, alignment, typography, dividers, and surface changes before bounded containers.

Breakpoints come from content/interaction failure, not habitual device numbers.

Mobile may change representation, order, navigation, detail behavior, action placement, and density. It must preserve the primary object and task continuity.

Read `references/layout-responsive.md`.

## 13. Reject AI slop and filler

Reject unjustified cards-around-everything, pill/badge overload, giant headings in task software, filler subtitles, meaningless icons, decorative charts, generic KPI rows, generic main + right rail, top-right search by habit, slogan copy, repeated identical section layouts, and one aesthetic reused across unrelated products.

Anti-slop does **not** mean minimal. Replace removed decoration with stronger structure, proportion, typography, hierarchy, interaction, and subject-specific detail.

Visible copy must help users understand, decide, recover, or act.

Do not add secondary labels or helper descriptions when hierarchy, grouping, navigation, or control labeling already makes the region obvious. Let layout carry explanation where it can.

## 14. Compose with specialist skills narrowly

UI Slop is complete enough to run alone.

Possible specialists include frontend/framework, visual critique, motion, accessibility, browser automation, visual regression, performance, design-source/Figma, and image generation/search.

Conflict order:

1. explicit user instruction
2. protected product/domain contract
3. project/framework constraints
4. narrower specialist guidance inside its specialty
5. UI Slop system/taste guidance
6. UI Slop fallback suggestions

Do not merge several skills' preferred aesthetics.

Read `references/extension-protocol.md`.

## 15. Harden before taste review

Verify applicable realistic long content, empty/loading/error/retry, disabled states, permissions, narrow/large widths, 200% text/zoom, keyboard-only flow, reduced motion, localization/RTL, offline/reconnect, and primary-interaction performance.

Do not invent irrelevant edge cases.

Read:

- `references/accessibility-baseline.md`
- `references/performance-baseline.md`
- `references/craft-floor.md`
- `references/coherence-floor.md`

## 16. Browser QA is mandatory for substantial visual work

Use bounded review.

### Pass A

Render representative desktop/mobile states together, operate primary flows, and inspect first viewport, navigation, selection, detail, realistic content, narrow/mobile, 200% zoom, reduced motion, loading/empty/error, and runtime issues.

Also inspect:

- low-style/grayscale/zoomed-out structure
- silhouette against unrelated recent work
- spatial utilization and dead-space quality
- the three weakest visible regions
- secondary utility coherence
- repeated component treatments carrying unrelated meanings
- whether the visual material world resembles unrelated recent products even when layout differs
- whether labels/helper copy merely explain an already-obvious layout
- the three most important domain relationships
- touch/keyboard equivalents for reactive behavior
- direct-manipulation opportunity for spatial/time-based editable objects when relevant
- whether meaningful motion replays on unrelated state changes
- a recorded interaction sequence, not only endpoint screenshots
- whether interaction mechanics resemble unrelated recent products
- whether density is being purchased with microtype
- the next likely action from a live selected/filtered state
- Back/close/reload behavior for continuity state
- at least one nested detail path when relevant

Collect material findings before editing.

### Fix batch

Repair related findings together. Do not pixel-polish a structurally wrong shell.

### Pass B

Re-render representative states and confirm fixes/regressions. Stop when remaining issues are minor/non-structural.

Screenshots must be visually inspected, not merely captured. If no browser is available, do not claim browser validation.

Read `references/browser-qa.md`.

## 17. AI Fingerprint Gate

Before final acceptance, inspect for clusters of generated patterns, including repeated opening composition, generic KPI/right-rail structures, universal rounded controls, pill overload, habit-driven search placement, decorative data widgets, identical mobile stacking, generic slogan copy, repeated visual-material worlds across unrelated products, semantic-to-component collapse, typographic micro-label collapse, layout-explanation labels/copy, isolated widgets with no linked state, browse-heavy products where every path collapses into search/facets, routine next actions far from the selected object, and repeated behavioral fingerprints such as hover lift/image zoom/fade-slide detail across unrelated products.

No single pattern is automatically wrong. Several without product reasons indicate convergence.

If the gate fails, identify whether the convergence is structural, visual-material, typographic, semantic, or behavioral and return to that design stage. Do not solve structural slop by changing accent color. Do not solve behavioral slop by changing duration/easing while preserving the same interaction model.

Read `references/ai-fingerprint-gate.md`.

## 18. Evidence Gate

Block completion on material failures in core behavior, keyboard/focus, accessible names/roles/states, required contrast, clipping/unreachable actions, required narrow reflow, color-only critical meaning, missing required states, severe performance regression, route/history regression, or broken recovery.

Do not convert personal taste into correctness findings. The bar for "verified" is actual inspection.

Read `references/evidence-gate.md`.

## 19. Taste Gate

After Evidence Gate passes, ask:

- Would this still feel product-specific without the logo?
- Do domain objects shape the silhouette?
- Is composition derived from workflow/content?
- Does typography contribute character?
- Does color come from the product?
- Is the visual material world distinct from unrelated recent outputs for a product-grounded reason?
- Could this shell serve many unrelated products unchanged?
- Does interaction reveal care beyond the screenshot?
- Does the interaction logic come from domain objects and relationships rather than a reusable effect bag?
- Does motion explain topology/cause/hierarchy rather than only visibility?
- Is browsing rewarding where exploration matters?
- Is restraint deliberate rather than under-designed?
- Is mobile genuinely composed?
- Are different semantic roles distinguishable without becoming inconsistent?
- Is typography readable without buying density through microtype?
- Does information density come from grouping and representation rather than compression alone?
- Does the interface respond as one connected system?
- Can the user naturally continue from selection into the next likely action?
- Does Back/close restore expected context?
- Are browse paths richer than search and facets alone?
- Is the weakest visible region still part of the same product world?

A clean but interchangeable interface does not pass.

Read:

- `references/taste-gate.md`
- `references/authored-experience.md`
- `references/coherence-floor.md`

## 20. Preserve behavior tests, not obsolete presentation

Do not weaken product-contract tests.

Presentation tests may change when they freeze obsolete selectors, copy, placement, component structure, or snapshots. Replace them with durable current behavior/accessibility tests.

Update documentation when removed UI makes it inaccurate.

## 21. Finish with evidence

For implementation work, report only what helps validate the result:

- final structural/visual direction
- major changes
- obsolete UI removed
- browser/viewport coverage
- accessibility/performance evidence
- tests
- representative screenshots
- extensions actually used
- genuine unresolved limitations

## Reference loading map

Load only what the task needs:

- shell/structure → `references/structural-direction.md`
- information density/spatial use → `references/information-design.md`
- typography + density rhythm → `references/presentation-rhythm.md`
- visual world → `references/visual-direction.md`
- page-scale commitment → `references/visual-commitment.md`
- identity/browsing/delight → `references/authored-experience.md`
- media/art/product imagery → `references/art-direction-media.md`
- font/asset sourcing → `references/asset-strategy.md`
- design system → `references/design-system.md`
- semantic role diversity → `references/semantic-diversity.md`
- linked/shared state → `references/reactive-surfaces.md`
- interaction model / behavioral dynamics → `references/experience-dynamics.md`
- relationship planning → `references/information-relationships.md`
- repeated-task continuity/browse topology → `references/task-continuity.md`
- color → `references/color-system.md`
- typography → `references/typography-system.md`
- responsive structure → `references/layout-responsive.md`
- states → `references/interaction-states.md`
- layered input/dismissal → `references/interaction-hierarchy.md`
- motion → `references/motion-interaction.md`
- accessibility → `references/accessibility-baseline.md`
- performance → `references/performance-baseline.md`
- craft → `references/craft-floor.md`
- weakest-region coherence → `references/coherence-floor.md`
- browser QA → `references/browser-qa.md`
- generated-pattern check → `references/ai-fingerprint-gate.md`
- objective acceptance → `references/evidence-gate.md`
- subjective acceptance → `references/taste-gate.md`
- multiple skills/plugins → `references/extension-protocol.md`
