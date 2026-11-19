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

Run the ten-second pass in `quality-bar.md` on the first useful desktop and mobile viewports before reading the implementation rationale.

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

Test at least one second or third action. When response is in doubt, retarget, repeat, or reverse before settlement. Compare what appears at activation, while work or motion is in progress, and on completion. Use a recording, frame sample, or trace when two endpoint screenshots cannot show the difference. Record the next action the interface makes possible.

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

Run the mandatory supporting-copy subtraction pass in `quality-bar.md` in the rendered states. Record the observations in the implementation review.

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
