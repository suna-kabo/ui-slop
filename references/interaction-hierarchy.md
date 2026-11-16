# Interaction Hierarchy and Dismissal Contract

Use this for drawers, dialogs, inspectors, popovers, expanded objects, route-level detail, media surfaces, and nested transient UI.

The goal is predictable opening/closing behavior without forcing every product into the same component.

## Layer types

### Inline state
Examples: expanded row, inline research detail, selected stage.

- Enter/Space activates the focused trigger.
- Repeated activation may collapse a true toggle.
- Focus remains on or returns to the trigger.

### Popover / menu
- Escape closes the topmost layer.
- Outside click may close when safe.
- Focus returns to the invoker.
- Arrow-key behavior follows the component/native pattern.

### Modal / drawer / quick-view
- Escape closes the topmost transient layer.
- Provide a visible Close control.
- Move focus into the layer when appropriate.
- Restore focus to the object that opened it.
- Backdrop click closes only when accidental dismissal is safe.

Do **not** bind Space globally to close.

Space may scroll, activate a control, toggle a checkbox, or control media.

If the original focused tile is itself a true toggle and retains focus, a second Space on that same trigger may close it symmetrically. Otherwise use Escape.

### Route-level detail
- Browser/system Back returns to the previous surface.
- Escape does not secretly replace navigation unless the route is intentionally presented as a transient overlay.
- Deep links remain valid where required.

### Full-screen / media / immersive mode
- Escape commonly exits the topmost immersive/full-screen layer.
- Space may play/pause when that is a domain convention.
- Do not steal domain keys for generic dismissal.

## Topmost layer wins

When layers nest:

1. dismiss the topmost transient layer
2. keep underlying layers intact
3. restore focus to the invoker inside the remaining layer
4. do not collapse the whole stack with one Escape unless explicitly designed

## Symmetry

Opening and closing should feel related.

Prefer:

- detail originates from the selected object
- focus returns to that object
- closing motion preserves spatial continuity
- repeated activation of a true toggle reverses the state

## Global shortcuts are rare

Reasonable:
- `/` focuses search when common and non-conflicting
- Escape dismisses topmost transient UI
- platform undo/redo
- domain-standard playback/navigation keys

Avoid:
- Space globally closes detail
- arbitrary letter shortcuts while typing
- destructive shortcuts with no safeguard

## Verification

Test:

- pointer open
- keyboard open
- Escape/back
- focus restoration
- nested dismissal
- repeated toggle activation
- mobile/system-back where relevant
- reduced motion
- no trapped/lost focus

Entry and exit paths are one interaction contract.
