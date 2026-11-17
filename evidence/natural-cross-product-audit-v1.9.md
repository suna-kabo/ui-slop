# Natural cross-product recurrence audit for UI Slop v1.9

## Scope

This audit consolidates the fresh UI Slop v1.8 generations across four materially different domains:

1. **Research / intelligence** — Traceframe
2. **Travel / itinerary planning** — Atlas for Mira & Jun
3. **Creative sequencing / editor** — Splicebook
4. **Operations / control** — RelayGrid

The first research run used an adversarial interaction brief. Travel, Creative, and Operations used Natural briefs that described product requirements without teaching interaction-design theory.

Comparator evidence was used where valid, but the Operations comparator is **not** a valid Impeccable run: its QA notes state that Impeccable was unavailable and no alternative UI/design skill was loaded. Operations is therefore used for UI Slop recurrence evidence, not a skill-vs-skill score.

## Main conclusion

UI Slop v1.8 materially solved the original small interaction-vocabulary problem.

Across the four domains, the interaction topologies are not the same:

- Research: relationship field → investigation anchor → evidence → compare bridge
- Travel: map + itinerary → route/day planning → lower place/detail workspace → mobile Plan/Map/Places modes
- Creative: timeline arrangement → clip workbench → loop/playback → version comparison
- Operations: pressure/network field → hub work surface → mission trace/intervention → Dispatch ledger

This is strong evidence against the hypothesis that v1.8 still applies one tiny fade/slide/hover vocabulary to every product.

The strongest remaining systemic problem is **second-order visual convergence**.

The layouts differ, but all four recent UI Slop outputs independently converge on a similar material world:

- warm off-white / paper-like surfaces
- dark ink
- thin rules
- restrained earthy/signal accents
- archival/editorial/instrument character
- limited elevation

This is no longer a one-off taste choice. It appears in 4 / 4 unrelated domains.

## Hard visual-material evidence

### Research / Traceframe

```css
--paper:   #f4f1ea;
--paper-2: #ebe6dc;
--paper-3: #ded7ca;
--ink:     #15211f;
```

### Travel / Atlas

```css
--paper:        #f4ecdd;
--paper-strong: #eadfcd;
--paper-soft:   #faf6ee;
--ink:          #1f2d2b;
```

### Creative / Splicebook

```css
--paper:      #f3efe5;
--paper-deep: #e7e0d0;
--ink:        #1c1c1b;
```

### Operations / RelayGrid

```css
--paper:      #e9e6dc;
--paper-2:    #f5f2ea;
--ink:        #1d2425;
--signal:     #c7482d;
--warn:       #9a650f;
--good:       #267052;
```

Even the live logistics control surface returns to warm paper + dark ink + thin rules + orange/green operational signals.

## Interaction recurrence result

Research, Travel, Creative, and Operations use materially different mechanics.

**Verdict:** no systemic interaction-vocabulary recurrence remains in the current evidence.

## Presentation Rhythm result

The v1.8 typography/density changes are supported by the fresh outputs.

Examples from rendered measurements:

- Travel desktop UI Slop: 52.0% of visible text chars at ≤12px, versus 67.0% in the comparator
- Creative desktop UI Slop: 18.8% ≤12px, versus 73.0% in the comparator
- Creative 390px UI Slop: 28.7% ≤12px, versus 97.5% in the comparator
- Operations desktop UI Slop: 36.1% ≤12px and 27.5% ≥15px
- Operations 390px UI Slop: 20.5% ≤12px and 38.4% ≥15px

**Verdict:** Presentation Rhythm should remain substantially unchanged.

## Task Continuity result

Across the evaluated products, UI Slop consistently preserves meaningful context through selection, detail, Back/return and persistence.

**Verdict:** Task Continuity should remain unchanged.

## Secondary-label / layout-explanation recurrence

This appeared strongly in two UI Slop outputs.

Research used labels such as LOCAL SNAPSHOT, ACTIVE CASE, UNIVERSE, and RELATIONSHIP FIELD.

Travel used VEYRA · 4 DAYS, CITY FIELD, ACTIVE DAY, and PLACE INDEX.

Creative did not strongly repeat the pattern. Operations uses mostly normal functional headings.

This is not a 4 / 4 systemic fingerprint, but it is a repeated quality issue and matches a user-observed failure: secondary labels/helper copy can explain what the layout already communicates, adding visual noise and vertical rhythm.

The final cleanup should strengthen copy/layout restraint without imposing a new style.

## Direct-manipulation finding

Creative / Splicebook relied more on nudge/select/numeric controls than direct drag manipulation, while the comparator used live drag of clips and loop handles.

This matters because time-positioned clips naturally afford direct manipulation.

However, the issue does not generalize to Operations, where select/button intervention is appropriate for consequential reassignment and priority actions.

The skill already contains direct-manipulation guidance in Experience Dynamics.

The final cleanup should therefore add a QA check, not a universal direct-manipulation mandate.

## Motion-causality finding

Travel / Atlas uses a domain-specific route-draw animation, but the route can be recreated after unrelated state changes and replay meaningful-looking motion even when the route did not actually change.

This is an implementation-level causality problem, not evidence for adding another animation vocabulary.

The final cleanup should add a QA test: trigger unrelated state changes and verify meaningful motion does not replay unless the represented state actually changed.

## Operations natural result

RelayGrid naturally chose:

- an attention-first index
- schematic live network
- pressure/dependency states
- route-level hub and mission surfaces
- mission origin/current/next trace
- Flow and Dispatch modes
- mobile network list transformation

This is a strong domain-specific interaction topology and does not resemble Research, Travel or Creative behavior.

Rendered first-viewport measurement from the exact bundled source:

### 1440 × 900

- visible text chars: 1,058
- ≤12px: 36.1%
- ≥15px: 27.5%
- visible interactive elements: 27

### 390 × 844

- visible text chars: 438
- ≤12px: 20.5%
- ≥15px: 38.4%
- visible interactive elements: 19

## Final v1.9 decision

A final cleanup release is justified, but it should be narrow.

### Change

1. Detect **second-order visual convergence** across unrelated products, not only repeated layout silhouettes.
2. Require a material-world comparison during visual-direction lock when recent unrelated outputs are available.
3. Add a layout-explanation copy test for redundant secondary labels/helper descriptions.
4. Add QA for direct-manipulation opportunity on spatial/time-based editable objects.
5. Add QA for meaningful motion replaying after unrelated state changes.

### Do not change

- Task Continuity
- Presentation Rhythm core model
- Experience Dynamics core model
- Motion implementation philosophy
- Semantic Diversity
- Reactive Surfaces

### Do not import

Do not import Charles UX Animation recipes into the core skill at this stage.

Its higher-level verification ideas remain useful for a later specialist experiment, but fixed recipes could reintroduce the kind of cross-product motion vocabulary UI Slop just removed.

## Finish line

v1.9 is the final planned 1.x cleanup release.

After one fresh validation generation, freeze the 1.x line unless a future repeated cross-domain failure materially affects product quality.
