# Interaction States

Every important interactive component should implement the states the real product can reach.

## State matrix

Check applicable states:

| State | Question |
| --- | --- |
| Default | Is the action/object legible before interaction? |
| Hover | Does pointer affordance become clearer without jumping? |
| Pressed | Is feedback immediate? |
| Focus-visible | Can keyboard users locate focus? |
| Selected/current | Is persistent state obvious? |
| Disabled | Is non-availability clear and still understandable? |
| Loading | Does the layout remain stable and progress understandable? |
| Empty | Is absence clear and is there a useful next action? |
| Error | Is the problem and recovery clear? |
| Success | Is completion confirmed without blocking the next task? |

Do not invent states that cannot happen.

## Feedback speed

Common interactions should respond immediately.

Visual transitions may continue briefly after input, but the user should not wait for animation before the state becomes clear.

## Selection

Selection should be stable across:

- re-render
- filtering
- sorting
- back/forward where applicable
- detail opening/closing

If selecting a row opens detail, preserve context so the user knows what the detail belongs to.

## Disabled versus hidden

Hide an action when it is irrelevant.
Disable it when seeing the action and understanding its current unavailability is useful.

If disabled reason matters, make it discoverable without a paragraph of defensive copy.

## Loading

Prefer layout-preserving loading.

Do not show decorative skeletons for data that resolves instantly.

Do not animate hundreds of skeleton rows when a simple progress state is clearer.

## Error and recovery

Errors should state:

- what failed
- what remains safe
- what the user can do next

Do not apologize generically.

## Empty

Differentiate:

- genuinely no data yet
- no search/filter results
- unavailable due to permissions
- failed load

They are not the same empty state.

## State stress test

After changing one state, revisit the others.

A selected-state fix often breaks hover or focus.
A loading treatment often shifts layout.
A dark-theme fix can break disabled contrast.

Test states as a system.
