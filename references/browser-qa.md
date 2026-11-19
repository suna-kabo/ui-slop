# Browser QA

Use bounded rendered review for substantial visual work.

The browser is evidence collection and product inspection, not an automatic taste judge.

## Prepare

Use:

- realistic content
- representative long, missing, dense, and similar-looking records
- intended fonts and visual assets
- the real interaction model
- wide, compact, and narrow viewports when applicable
- normal and reduced motion
- intended color schemes and input modes

Do not review a premium concept with placeholders and call the direction verified.

## Pass A — uncoached first impression

Open the first useful viewport without generator explanation.

Record:

- first object or action noticed
- elements competing for attention
- obvious awkwardness, cheapness, genericness, or incompleteness
- dead or accidental space
- weak assets, type, controls, wraps, or alignment
- what appears interactive
- what the next action seems to be
- visible eyebrows, kickers, overlines, section numbers, figure labels, helper descriptions, and other secondary copy
- adjacent descriptor stacks or repeated meanings

Do not defend the design rationale before recording the observation.

## Pass B — operate the primary sequence

Operate, do not only look.

Where applicable:

- hover, focus, press, and touch-sized interaction
- select, deselect, save, filter, compare, reorder, drag, or manipulate
- open detail, continue, close, Back, forward, and return
- type, submit, wait, retry, cancel, undo, or recover
- resize and rotate
- reload and resume
- keyboard navigation
- reduced motion

Test at least one second or third action.

Record for each step:

- user action
- selected object or route before and after
- immediate response
- what changed
- what stayed anchored
- focus target
- scroll anchor
- persistent state
- next likely action
- screenshot or trace evidence
- transition observation

## Pass C — quality inspection

Inspect:

- attention and hierarchy
- copy editing
- composition and crop
- visual material fidelity
- typography
- control locality and affordance
- response chain: input → acknowledgment → transition → state → next action
- spatial and conceptual continuity
- motion causality
- responsive and platform fit
- perceived and measured performance
- weakest visible regions

Run the supporting-copy subtraction test on at least:

- the first useful viewport
- the primary detail or focused state
- one compact or mobile state

Temporarily hide or mentally remove secondary labels and descriptions. Restore only those whose absence creates ambiguity, hides state, weakens a decision, removes necessary provenance, increases error risk, or makes an action meaningfully harder to discover. Record any descriptor stack whose roles can be collapsed.

Use `quality-bar.md`.

## Fix batch

Repair the responsible layer.

Examples:

- reshape the interaction rather than change easing
- remove an explanatory label rather than restyle it
- collapse eyebrow + section number + type + mode when one useful descriptor is enough
- delete a secondary description that paraphrases the heading or image
- improve or replace the primary asset rather than add chrome
- fix state ownership rather than one lost selection
- change mobile priority rather than patch one overflow
- discard a generic modal when object-anchored detail is the real solution

Do not pixel-polish a concept-level failure.

## Regression pass

Rerun affected evidence and a bounded primary path.

Confirm no regression in:

- keyboard/focus
- return behavior
- state persistence
- responsive composition
- motion ownership
- loading or performance
- first useful viewport
- supporting-copy clarity after subtraction

## Behavioral craft

When relevant, test:

- prompt response
- continuous manipulation
- interruption
- reversal or retargeting
- boundary feedback
- repeated-use comfort

Trigger at least one unrelated state change that should not replay a meaningful transition.

## Performance

Observe and measure when possible:

- response to input
- layout shifts
- long tasks
- dropped frames
- font and image stability
- animation frame consistency
- mobile-device behavior

A recorded animation can look smooth while input response is late.

## Honesty

If browser execution, assets, auth, fixtures, device input, or a required state are unavailable, mark the check blocked or not verified.

Do not claim a quality review from source code alone.
