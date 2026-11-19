# Shaping

Use this before substantial new UI or a replacement experience.

Shaping decides what deserves to be built before layout, styling, or component selection consumes the work.

## Experience Brief

Keep it short enough to remain active during implementation.

### User and context

State:

- primary user
- situation and frequency
- platform and input modes
- environmental constraints
- expertise, urgency, trust, and consequence

Do not define the user only by demographics or a generic persona.

### Outcome

Describe the meaningful result, not the screen.

Include the second or third action when the product is used repeatedly. A surface that makes the first click easy but causes reconstruction afterward is not shaped correctly.

### Irreducible core

Ask:

- What is the smallest experience that creates the value?
- What can be removed, reused, automated, deferred, or handled by a familiar platform pattern?
- Does this need to be a new page, a mode, an inline action, a route, or no UI at all?

Do not turn every requirement into a visible feature.

### Protected truth

Record only material constraints:

- domain semantics and data correctness
- required workflow and state lifetime
- routes, history, deep links, Back/close, and focus return
- permissions, auth, persistence, reload, and recovery
- integrations, exports, offline behavior, or performance limits
- accessibility and platform obligations
- incumbent visual authority that is explicitly approved

### Non-goals

Name what the solution should not become.

Useful non-goals prevent category drift, unnecessary features, design performance, and a scope that cannot be executed with care.

### Quality risk

Name one or two likely ways a superficially competent solution would still fail.

Examples:

- an archive becomes a generic card grid
- a workflow saves state but loses visible context
- motion is present but interaction remains inert
- a premium visual direction depends on placeholder-quality assets
- mobile technically reflows but the primary object disappears

## Problem versus requested UI

Separate:

- what the user asked to see
- what the user is trying to accomplish
- what the organization needs
- what the platform already provides
- what is technically feasible

The requested UI is evidence, not the problem definition.

## Existing-product shaping

For refinement or redesign:

1. trace the current end-to-end flow
2. identify what users have learned and rely on
3. distinguish product truth from historical implementation
4. locate accumulated layers, workarounds, and detached actions
5. preserve muscle memory where it protects speed or confidence
6. remove or relocate elements whose original reason no longer holds

## Scope test

Before proceeding, answer:

- Can one person understand the Experience Brief in under a minute?
- Is the primary outcome singular enough to dominate the interface?
- Is the scope small enough to execute at the expected quality?
- Is there a clear reason to build rather than reuse?
- Is there enough evidence to choose a solution?

If not, shape further. Do not compensate with a broader design system.
