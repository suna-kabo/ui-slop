# Fieldnote comparative audit for UI Slop v1.8

## Scope

This audit compares two fresh generations from the same research-intelligence brief.

Benchmark condition mapping supplied by the user:

- **Fieldnote** → UI Slop v1.7
- **Fieldnote Atlas** → Impeccable comparator

Important artifact note: the Fieldnote Atlas QA notes incorrectly self-identify the UI/design skill as UI Slop v1.7. The benchmark operator confirmed that this generation was the Impeccable condition. Treat that metadata as an artifact-generation error, not as reliable condition evidence.

The audit uses:

- rendered desktop/mobile/detail/comparison screenshots
- exact HTML/CSS/JS source
- browser-derived first-viewport typography measurements
- implemented interaction/state behavior
- current UI Slop v1.7 source

## High-level verdict

UI Slop v1.7 is competitive on:

- domain-specific structure
- shared state
- relationship visibility
- task continuity
- dense working-surface ambition

The comparator is stronger on:

- typographic hierarchy
- readable density
- information grouping
- mobile re-composition
- motion variety and temporal hierarchy
- overall presentation craft

The most important finding is not "add more animation".

It is:

> UI Slop v1.7 partially teaches agents a small safe animation vocabulary and then asks the final QA gate to detect the convergence that the earlier guidance helped create.

## Quantitative first-viewport evidence

Desktop at 1440×900, measured from rendered visible text nodes:

| Measure | UI Slop Fieldnote | Comparator Fieldnote Atlas |
| --- | ---: | ---: |
| Visible text characters | 1,399 | 2,010 |
| Characters at 12px or smaller | 73.3% | 44.6% |
| Characters at 15px or larger | 22.1% | 50.3% |
| Visible interactive elements | 48 | 29 |

Interpretation:

- UI Slop shows fewer total visible characters while making a much larger share of them microtype.
- UI Slop also exposes substantially more interactive elements in the same viewport.
- The comparator therefore achieves greater readable information capacity with fewer simultaneously active controls.

This is strong evidence that UI Slop's density is being purchased partly through smaller typography and control proliferation rather than information compression/grouping alone.

Mobile metrics are less decisive. Both generations still use significant small text, so v1.8 should not encode "copy the comparator's mobile sizes" as a rule.

## Typography audit

### UI Slop Fieldnote

Families:

- Lato for body/control
- PT Sans Narrow for compact headings/section labels
- PT Mono for IDs/dates

The main failure is not the families themselves.

PT Sans Narrow + uppercase + tracking is reused across many semantically different roles:

- theme label
- ledger headers
- detail section headings
- evidence type
- peer table headings
- relationship labels
- note label
- saved-group headings

This creates **typographic semantic collapse**.

The old badge problem reappears without the box:

> unrelated secondary meanings → condensed uppercase microtype

### Comparator Fieldnote Atlas

Families:

- Gillius ADF for UI/control
- Berenis ADF Pro for reading/evidence
- Cousine for identifiers/dates

The stronger result comes from clearer role separation and more readable evidence/prose treatment, not simply from using more unusual fonts.

The comparator still uses 10–12px metadata in places, so its exact scale is not a universal template.

### Reusable lesson

Use fewer typographic roles, but make each role carry a clear job.

Do not solve density by multiplying microtype styles or shrinking secondary information until it becomes texture.

## Density audit

### UI Slop strengths

- strong first-screen working density
- compact ledger comparison
- high information-per-scroll ambition
- inline selected-company research keeps context close

### UI Slop weaknesses

- too many simultaneous row-level controls and relationship buttons
- important and truly secondary content compete at similar tiny sizes
- detail density is maintained partly by shrinking labels/metadata
- three-column detail risks compression rather than hierarchy

### Comparator strengths

- clearer split between universe/index and dossier/reading surface
- more information appears at comfortable reading sizes
- stronger grouping reduces the need for repeated chrome
- mobile switches dossier sections rather than stacking the entire desktop detail

### Comparator weaknesses

- some regions remain visually quiet enough to risk unused capacity
- small metadata is still common
- the split-view model is not inherently superior for other products

### Reusable lesson

Density should be solved in this order when appropriate:

1. remove repetition
2. share context
3. group/alignment
4. choose a better representation
5. defer genuinely secondary detail
6. tune spacing
7. only then reduce type size

## Interaction-mechanics audit

### UI Slop Fieldnote mechanics

Implemented mechanisms include:

- theme scrub indicator moves/changes width
- company hover changes row background
- selected company receives a left accent stripe and background shift
- selected research detail enters with opacity + clip-path + small horizontal translate
- Saved workspace enters with opacity + clip-path + small vertical translate
- mobile detail uses opacity + clip-path + 14px translate
- selected row may smooth-scroll into view
- provenance uses native dialog behavior

The interaction structure is functional, but much of the perceived dynamics come from the same small effect family.

### Comparator mechanics

Implemented mechanisms include:

- theme current-state mark scales into place
- route-level dossier distinguishes forward and Back direction
- evidence body expands through grid-row interpolation
- comparison bars resolve through scale
- universe remains visible beside dossier on desktop
- mobile transforms dossier into local section modes

This is more varied and better tied to different state types, though it is still not a radically interactive instrument.

### Core difference

UI Slop mostly asks:

> What animation should accompany this state change?

The better comparator behavior more often asks:

> What kind of state change is this, and what representation should change with it?

Neither output fully reaches the desired ceiling of a deeply reactive, domain-specific interface.

## Direct poisoning found in UI Slop v1.7

The v1.7 motion reference contains all of these together:

- "Define a small vocabulary for the product"
- fixed timing bands for hover, selection, detail, and page continuity
- fixed small travel examples
- a press-scale range
- "Prefer transform and opacity"

The generated Fieldnote then defines:

- 140ms / 210ms / 280ms timing tokens
- research detail using opacity + 10px translate + clip-path
- Saved using opacity + 8px translate + clip-path
- mobile detail using opacity + 14px translate + clip-path

This is too close to the source guidance to dismiss as independent model habit.

The instruction is priming the implementation.

## Structural contradiction in v1.7

The final AI Fingerprint Gate already warns against:

- every transition using the same timing/easing
- every state change using the same fade/slide

But earlier motion guidance supplies a compact universal recipe.

The sequence is effectively:

1. prime a safe effect vocabulary
2. generate with that vocabulary
3. ask final QA to detect overuse

The prevention needs to move upstream.

## Missing interaction-design stage

UI Slop requires multiple structural concepts before styling.

It does **not** require materially different interaction concepts before motion implementation.

That asymmetry matters.

The agent explores layout, then reaches interaction with no comparable exploration phase, so implementation habits fill the gap.

v1.8 should require interaction-concept exploration for substantial open-direction interactive work.

## Other poisoning / convergence risks

### Authored Experience

v1.7 repeatedly mentions hover reveals, expansion, contextual transitions, and signature animation examples.

The intent is good, but concrete examples can become defaults for an LLM.

v1.8 should describe product-specific behavior first and effects second.

### Typography

The role list is broad enough to encourage many treatments, while small-size testing and dense-tool language can be interpreted as permission for widespread 11–12px UI.

v1.8 should emphasize role economy and warn against microtype-majority viewports.

### Information density

"Long-session tools can support higher density" is true, but insufficiently constrained.

Without an information-compression order, the model may tighten padding and type rather than improve grouping/representation.

## What v1.8 should change

### Remove/de-bias

- universal timing bands from general motion guidance
- generic travel-distance defaults
- press-scale defaults
- "prefer transform and opacity" as a design instruction
- "small motion vocabulary" wording that encourages effect reuse
- excessive concrete hover/expand examples in authored-experience guidance

### Add upstream

- interaction concepts before effects
- domain verbs and object manipulation
- reactive depth
- surface transformation
- directness/action locality
- motion topology
- temporal hierarchy
- behavioral silhouette comparison across unrelated products
- interaction-sequence browser QA

### Add presentation discipline

- typography role economy
- typographic semantic-collapse detection
- information budget per viewport
- information-compression order
- microtype-majority warning
- density by region rather than one global density

## What not to copy from Impeccable

Do not copy:

- its specific type pairing
- the two-page research spread
- its timing/easing values
- its specific route transitions
- its density parameterization
- its aesthetic

The reusable lesson is **process order**:

- diagnose hierarchy/density
- define the spatial or motion thesis
- choose mechanisms by meaning
- verify with rendered evidence

## v1.8 release decision

Evidence supports a new release because the issue appears in both:

- multiple earlier UI Slop generations
- the current v1.7 source itself
- the fresh Fieldnote generation
- the comparator gap in typography/density/motion craft

The appropriate v1.8 direction is:

- **Experience Dynamics** for interaction behavior
- **Presentation Rhythm** for typography + density
- a de-biased Motion reference downstream of interaction design

Task Continuity should remain substantially unchanged because the current samples validate it.
