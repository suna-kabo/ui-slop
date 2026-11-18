# Cutroom

Build a sequence-editing workspace for a short documentary editor arranging story beats and alternate takes.

## Primary job

The editor opens a beat, auditions an alternate take, reorders the beat, undoes the move, leaves a transition note, and returns to the sequence with orientation intact.

## Protected product contract

- R1: Sequence order and beat duration are visible as editable structure, not a list of unrelated media cards.
- R2: Alternate takes remain associated with the correct beat and can be auditioned without silently replacing the active take.
- R3: Reorder has clear before/after state and undo restores the prior sequence.
- R4: A transition note persists on the correct boundary after reload.
- R5: Missing transcripts, very long transcript excerpts, and mixed media types do not collapse hierarchy.
- R6: Keyboard users can traverse beats, inspect alternates, reorder through an accessible mechanism, undo, and save notes.
- R7: Narrow layouts preserve sequence context and the current edit target.

Motion may clarify reordering or continuity, but fixed motion recipes are not part of the requirement.
