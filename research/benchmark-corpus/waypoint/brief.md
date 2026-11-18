# Waypoint

Build an itinerary planning surface for a traveler assembling a day from places with spatial, opening-hour, reservation, and transit constraints.

## Primary job

The traveler compares candidate stops, adds one to a timed route, notices a conflict, replaces the stop, and returns from place detail without losing the working itinerary.

## Protected product contract

- R1: Route order, travel time, visit duration, and timing conflicts are legible as relationships, not disconnected cards.
- R2: Replacing a stop preserves the rest of the itinerary and clearly shows what changed.
- R3: Place detail can be opened and returned from without losing the selected day, map/list context, or scroll position.
- R4: Saved alternatives remain available after the primary itinerary changes.
- R5: Closed windows, uncertain duration, missing price, and long place names remain understandable.
- R6: Keyboard interaction supports selecting, adding/replacing, inspecting detail, and returning.
- R7: Narrow layouts prioritize the active itinerary and conflict resolution instead of merely shrinking the desktop composition.

Do not hard-code a travel-app visual style. Derive representation from the planning relationships in the fixture.
