# Experience Dynamics

Use this when a product contains meaningful interaction beyond simple form submission or static navigation.

The goal is not more animation.

The goal is to design **how the product responds to attention, selection, manipulation, traversal, and return**.

A generic animation attached to a generic component is not interaction design.

## Start from domain verbs

Before choosing effects, name what users actually do to domain objects.

Examples of verbs:

- inspect
- compare
- trace
- follow
- scrub
- pin
- sort
- group
- annotate
- tune
- queue
- arrange
- expand
- traverse
- collect
- revisit

Do not turn this list into a component library.

The useful question is:

> What does this user do to this object, and what should the rest of the system do in response?

## Explore interaction concepts before implementation

For substantial open-direction interactive work, outline at least **two materially different interaction models** before coding when practical.

They must differ in behavior, not only animation style.

For example, a research relationship could be handled as:

- **anchored context**: the selected object stays spatially stable while surrounding evidence reorganizes around it
- **traversal**: following a relationship moves through a visible chain while preserving where the user came from
- **focus transformation**: the selected object gains space while surrounding context compresses without disappearing

These are interaction models, not prescribed solutions.

Choose the one that best supports the task, content, input modes, and product world.

Do not skip this step and jump directly from "detail opens" to "fade + slide".

## Interaction logic creates consistency

Consistency should come from:

- the same object behaving predictably
- cause and result remaining legible
- spatial rules staying coherent
- state ownership staying stable
- similar consequences receiving similar feedback
- return behavior matching entry behavior

Consistency should **not** come from giving every state change the same effect.

A product may have several different motion materials while still feeling coherent if they follow one interaction logic.

## Reactive depth

When the user expresses interest in an object, decide whether other regions should:

- remain still
- re-rank
- filter
- reveal relationships
- compress
- expand
- re-anchor
- update comparison context
- expose a next action
- change representation

Do not make every region react.

The response should make the user's new context easier to understand.

## Surface transformation

Some state changes deserve more than replacing content inside fixed boxes.

When the task changes materially, consider whether the surface itself should transform.

Examples of meaningful transformation include:

- comparison changes the available spatial model
- selection gives the chosen object more room while preserving surrounding context
- a saved/research mode preserves the underlying work rather than rebuilding a new page from zero
- a relationship traversal changes which object anchors the workspace
- mobile changes interaction mode rather than vertically stacking the desktop surface

Do not transform layout merely to look dynamic.

## Direct manipulation and locality

If the domain supports a more direct interaction, do not automatically route everything through:

select → open generic detail → click another generic button.

Ask whether a high-frequency action belongs:

- on the object
- next to the object
- in a persistent contextual control
- through manipulation of the representation itself

Keep keyboard and touch equivalents.

## Motion topology

Motion is one possible expression of interaction logic.

Before selecting a technique, answer:

1. What changed?
2. What caused it?
3. What object remains the anchor?
4. What relationship should the user understand?
5. Is there a direction or hierarchy to the change?
6. What should the eye notice first, second, and last?
7. Would no motion communicate this more clearly?

Only then choose implementation material.

Possible materials include spatial movement, shared-element continuity, reflow, crop/mask, drawing/revealing a relationship, color/material change, focus/depth change, or no animation.

These are capabilities, not defaults.

## Temporal hierarchy

A transition can have hierarchy just as a static screen does.

Do not animate every changed element simultaneously when sequence carries meaning.

Likewise, do not stagger everything merely because stagger looks polished.

Sequence only when it helps explain:

- cause → result
- parent → child
- selection → related context
- before → after
- traversal → destination

The user's task should never wait behind choreography.

## Interaction vocabulary collapse

Treat this as a generated-UI failure mode:

- every hover lifts or enlarges
- every image zooms on hover
- every detail fades/slides in
- every selected object gets an accent stripe
- every route uses the same directional reveal
- every panel transition uses opacity + small translate
- the same interaction mechanics appear across unrelated products

A single use may be correct.

Repeated use without a domain reason indicates the agent is applying an effect vocabulary instead of designing interaction.

## Behavioral silhouette test

Compare the product against unrelated recent work.

Ignore color, typography, copy, and imagery.

Describe only the mechanics:

- what hover does
- what selection does
- how detail appears
- how related objects are followed
- how mode changes work
- what Back restores
- how mobile transforms interaction

If the description could be reused almost unchanged across unrelated products, revisit the interaction concept.

## Verification

Operate the primary workflow and record a short state sequence.

For each meaningful change, ask:

- Did the response express the domain relationship?
- Did it preserve orientation?
- Did it create a useful next action?
- Was the same effect reused merely for convenience?
- Does touch/keyboard retain the interaction logic?
- Does reduced motion preserve the relationship and hierarchy?

The product should feel responsive because its objects and relationships behave meaningfully, not because everything moves.
