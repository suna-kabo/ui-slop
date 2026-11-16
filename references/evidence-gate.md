# Evidence Gate

Run this before the Taste Gate.

Objective failures block completion even when the design looks good.

## Blockers

Treat these as material failures when applicable:

- broken core action
- route/history regression
- lost data or incorrect domain output
- inaccessible core control
- missing accessible name
- invisible keyboard focus
- modal focus lost or not restored
- critical content/action clipped at a supported viewport
- missing required loading/error/recovery state
- critical meaning carried only by color
- required contrast failure
- severe scroll/render/input lag introduced by the design
- responsive representation that makes a required task impossible
- mobile input behavior that prevents normal use

## Evidence versus preference

These are not objective failures by themselves:

- you prefer a smaller radius
- you prefer a different font
- you prefer denser spacing
- you dislike the brand color
- you would have used a sidebar

Raise them in the Taste Gate only when they undermine the thesis, workflow, or product specificity.

## Verification matrix

For substantial web work, record what was actually checked:

| Area | Evidence |
| --- | --- |
| Core flows | operated / automated / not verified |
| Keyboard | operated / not verified |
| Focus | inspected / not verified |
| Contrast | measured / not verified |
| 200% zoom | inspected / not verified |
| Narrow width | inspected / not verified |
| Reduced motion | inspected / not verified |
| Loading/error/empty | inspected / not applicable / not verified |
| Performance | measured / observed / not verified |
| Browser console | clean / findings / not checked |

Never upgrade "observed" to "measured."

## Severity

Use a simple scale:

- **Blocker**: core task, access, correctness, or supported viewport fails
- **Major**: serious usability or consistency issue with a workaround
- **Minor**: polish or isolated friction

Fix Blockers before completion.
Major findings should normally be fixed in the same substantial UI task.
Minor findings should not trigger endless polishing.
