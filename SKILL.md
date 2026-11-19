---
name: ui-slop
description: Standalone UI design and engineering operating model for shaping, proving, building, and reviewing production interfaces. Use for new UI, redesigns, refinements, or audits when the result must be product-specific, behaviorally responsive, visually authored, technically sound, and free of obvious quality cliffs.
---

# UI Slop

UI Slop is a product-design operating model with an evidence loop.

It is not a house aesthetic, component library, style catalog, palette generator, motion recipe, or promise that more polish will rescue a weak concept.

The finish condition is:

> **The product contract is protected, the core experience is proven, and no material part of the primary experience feels obviously wrong.**

“Nothing feels obviously wrong” does not mean personal perfection or endless polishing. It means no unresolved issue in the first useful viewport or primary flow materially damages trust, comprehension, control, continuity, visual quality, platform fit, or the intended feeling.

## Working depth

Choose the smallest mode that fits:

- **Audit**: inspect and report. Do not redesign by implication.
- **Refinement**: preserve approved product behavior and visual authority; reshape only the responsible layer.
- **Rebuild / new surface**: shape the problem, establish product principles, prove the core experience, then build.
- **System work**: improve shared foundations without forcing every product into one visual or behavioral grammar.

For a narrow fix, compress the sequence. For substantial new or replacement work, all five stages below are mandatory.

Use `references/module-map.md` to load only supporting references. The five-stage core is not optional.

# Stage 1 — Shape the outcome

Do not begin with a page type, component inventory, visual trend, or feature list.

Write a short **Experience Brief** that states:

1. **User and context** — who is here, on what platform/input, under what conditions.
2. **Outcome** — what meaningful result the person reaches, including the second or third action when relevant.
3. **Irreducible core** — the smallest experience that creates the value.
4. **Protected truth** — data, domain semantics, routes, permissions, persistence, accessibility, recovery, integrations, and platform constraints that must remain correct.
5. **Non-goals** — what this work should deliberately not become.
6. **Quality risk** — the one or two ways a superficially competent solution would still fail.

Distinguish user need from requested UI. Ask whether the product should do less, use an existing convention, or remove a layer rather than redesign it.

For redesigns, incumbent DOM, cards, navigation, copy, and visual styling are evidence, not automatic authority.

Read `references/shaping.md`.

# Stage 2 — Set product principles and calibration

Create **three to five product-specific decision principles** before choosing a detailed direction.

A useful principle contains:

- a short name
- the tension it resolves
- the decision rule
- one implication
- one thing it rejects

Example:

> **Object before archive chrome** — When object identity and institutional metadata compete, the object wins until metadata changes interpretation or action.

Do not write universal advice such as “be clean,” “use whitespace,” or “make it modern.”

Then establish a small **quality calibration set**:

- relevant platform conventions
- two to four best-in-class references for the same quality problem
- incumbent strengths worth preserving
- known category defaults and obvious anti-defaults

References set a bar; they are not templates to copy or average together.

Decide where familiarity is valuable and where one concentrated signature experience can earn custom work. Do not attempt originality in every control.

Read `references/product-principles.md` and `references/reference-calibration.md`.

# Stage 3 — Prove the core experience

Before building the complete surface, prove a vertical slice with real or representative content.

The proof must include, when applicable:

- the primary object or task
- the primary visual material at near-final fidelity
- the highest-risk interaction
- entry, action, result, and return
- a wide and narrow representation
- pointer, touch, and keyboard implications
- loading or transition behavior if it affects the concept
- one second action that reveals whether continuity survives

Explore materially different models only where the solution is genuinely open. Do not create several fully polished sites.

A concept passes only when:

- the product principles are visible in the experience
- the main content or object shapes the composition
- the interaction feels immediate and understandable
- the visual material is good enough to carry the direction
- mobile is a deliberate representation
- a skilled reviewer cannot identify a concept-level flaw that polishing would merely decorate

If the proof fails at the level of structure, interaction model, visual material, or platform fit, reshape or discard it. Do not complete the site and hope a final pass will save it.

Read `references/concept-proof.md`.

# Stage 4 — Build foundation plus signature

Use familiar, native, accessible foundations for ordinary behavior. Concentrate custom design and engineering where the product earns it.

Build from:

- real content and real states
- semantic HTML and platform conventions
- a coherent type, spacing, color, image, and motion system
- direct controls near the objects they affect
- explicit state ownership and return behavior
- responsive behavior derived from content and input failure
- performance budgets appropriate to the platform
- one to three domain-derived signature behaviors when the product benefits

A signature behavior starts from a relationship, object, or ritual, not from an effect. It may be almost static. It must improve understanding, control, memory, discovery, or feeling.

Interaction is not complete when a state variable changes. For primary actions define:

- prompt response
- what remains anchored
- what changes locally and globally
- interruption or reversal where relevant
- boundary and failure behavior
- focus and scroll behavior
- touch and keyboard equivalents
- next-action locality
- repeated-use cost

Motion may express this logic. It is not the logic.

Read relevant specialist references such as `references/structural-direction.md`, `references/visual-direction.md`, `references/experience-dynamics.md`, `references/task-continuity.md`, `references/layout-responsive.md`, `references/accessibility-baseline.md`, `references/performance-baseline.md`, and `references/art-direction-media.md`.

# Stage 5 — Review problem, solution, and implementation

Do not collapse every critique into a polish pass.

Run three distinct reviews:

## Problem review

- Are we solving the right user need and end-to-end outcome?
- Is the scope smaller or different than the requested UI?
- Is the irreducible core still visible?
- Should anything be removed rather than redesigned?

## Solution review

- Does the structure express the product principles?
- Is the content or domain object the main design material?
- Is the signature experience worth its complexity?
- Does interaction preserve agency, causality, and orientation?
- Is the concept strong on wide and narrow screens?
- Does the chosen visual material reach the quality implied by the direction?
- Would another concept be materially better?

## Implementation review

- Is the built result faithful to the approved solution?
- Are typography, copy, assets, controls, motion, responsive behavior, and platform details executed with care?
- Are there dropped frames, delayed feedback, layout shifts, dead zones, weak affordances, awkward wrapping, accidental empty space, generic utility surfaces, or quality cliffs?
- Do keyboard, touch, pointer, Back, reload, persistence, loading, empty, error, and recovery states behave correctly where applicable?

Use rendered evidence for substantial work. Operate the interface; do not review only screenshots or source. Read `references/evidence-gate.md` before qualitative readiness and `references/craft-floor.md` while proving and implementing the selected direction.

Read `references/review-stages.md`, `references/browser-qa.md`, and `references/quality-bar.md`.

# The quality bar

A substantial result is not ready merely because it is valid, accessible, responsive, product-specific, or aesthetically defensible.

It is ready when both are true:

1. **Evidence Gate passes** — required behavior and independently verifiable standards are supported by executed evidence.
2. **Quality Gate is ready** — no unresolved material quality issue remains in the first useful viewport, primary flow, core responsive states, or signature experience.

A material quality issue is one a skilled reviewer can point to and explain as harmful to attention, hierarchy, editing, affordance, continuity, interaction response, visual material, typography, responsive behavior, performance, platform fit, or the intended feeling.

Use these vetoes:

- **Attention veto**: unearned labels, chrome, copy, or decoration compete with the primary experience.
- **Concept veto**: the product idea is only visible in styling, not structure or behavior.
- **Material veto**: imagery, illustration, type, iconography, or data representation is below the fidelity the composition demands.
- **Behavior veto**: a primary action feels delayed, detached, generic, discontinuous, or inert.
- **Platform veto**: mobile, touch, keyboard, browser, or device behavior feels like an afterthought.
- **Weakest-link veto**: one visible region is materially below the quality of the rest.
- **First-impression veto**: in a brief, uncoached inspection, a reviewer immediately finds an awkward, unnecessary, cheap, confusing, or obviously unfinished element.

A veto requires a concrete observation and product reason. It is not permission to enforce personal taste.

Minor imperfections may remain when they are understood and do not materially lower trust or experience quality. Unknown evidence is blocked, not passed.

# Editing rules

Before adding another element, ask what job it performs.

Secondary labels, descriptions, eyebrow text, kickers, overlines, section numbers, figure labels, category labels, and helper copy are not default layers. Each visible instance must perform a unique job that is not already performed by the title, layout, imagery, control state, conventional semantics, or surrounding context.

Run a supporting-copy subtraction pass on the first useful viewport and primary detail state:

1. temporarily remove secondary labels and descriptions
2. restore only those whose absence creates ambiguity, hides state, weakens a decision, removes necessary provenance, increases error risk, or makes an action meaningfully harder to discover
3. reject descriptor stacks such as section number + eyebrow + type + mode + title when fewer roles communicate the same meaning

Do not ban necessary labels. Navigation, live status, units, scope, risk, category disambiguation, and essential provenance may justify them. Decorative authenticity does not.

Remove or reduce:

- layout-explanation labels
- duplicated metadata
- filler subtitles
- curatorial or marketing prose that repeats the composition
- decorative badges and section numbering
- tiny uppercase or monospace eyebrow text used mainly to simulate editorial, archival, premium, or technical character
- repeated secondary descriptions that paraphrase a heading or image
- controls detached from their targets
- generic cards, modals, drawers, and right rails chosen by habit
- hover lift, image zoom, fade-up, and transition presets used to simulate vitality
- empty space that does not create focus, rhythm, or anticipation

Simplicity is exactly enough, not the fewest elements.

# Interaction vitality

For every primary surface ask:

- What changes when the user approaches, focuses, presses, selects, drags, or returns?
- Does response begin at the point of action?
- Is the object itself a better control than separate chrome?
- Does the state change preserve spatial and conceptual continuity?
- Does the rest of the interface react only where it reduces understanding cost?
- Can the user interrupt, reverse, or continue naturally where appropriate?
- Does the experience reveal more character through use?
- Would the behavior still make sense without animation?
- Is any animation explaining cause, relationship, hierarchy, or topology?

An interface can contain motion and still feel dead. It can be nearly static and still feel responsive.

# Evidence and honesty

For substantial work, capture representative wide, compact, and narrow states plus the primary interaction sequence.

Operate applicable:

- hover/focus/press
- selection and deselection
- direct manipulation
- open, close, Back, and forward
- save, filter, compare, and reorder
- loading, empty, error, retry, and success
- reload and persistence
- pointer, touch-sized viewport, and keyboard
- normal and reduced motion

Separate:

- **hard failure** — specified contract or independently verifiable standard failed
- **quality veto** — material qualitative issue blocks readiness
- **advisory** — observed risk requiring product judgment
- **evidence only** — neutral inventory
- **blocked** — required evidence unavailable

Do not claim a browser, device, performance, or quality review that was not executed.

# Specialists

UI Slop must remain useful by itself.

Use specialists narrowly for framework implementation, platform guidance, accessibility, performance, motion engineering, assets, 3D, browser automation, or image work.

Priority:

1. explicit user instruction
2. protected product truth
3. approved Experience Brief and product principles
4. platform/framework constraints
5. narrower specialist guidance inside its specialty
6. UI Slop fallback guidance

Do not merge specialists’ house aesthetics.

# Finish report

Report only what helps validate the result:

- Experience Brief and product principles
- selected concept and rejected material alternative, when relevant
- signature behavior
- major structural or behavioral decisions
- evidence operated
- problem / solution / implementation review status
- unresolved hard failures, quality vetoes, advisories, or blocked checks
- genuine limitations

Do not write a victory narrative before independent review.
