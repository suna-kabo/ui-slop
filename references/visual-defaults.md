# Visual Defaults

These are opinionated fallback defaults derived from the UI system this skill was built around.

User-provided brand direction, an established design system, and product-specific constraints take precedence.

## Character

Aim for:

- simple
- calm
- modern
- mature
- personal rather than corporate
- medium density
- visually humble
- highly polished in interaction
- distinctive without being loud

A useful interpretation of "Japanese restraint" is:

- precision
- alignment
- negative space
- quiet surfaces
- disciplined hierarchy
- small intentional details

It does **not** imply Japanese cultural decoration, anime, calligraphy, sakura, traditional motifs, or game artwork.

Static screenshots should look restrained.

Using the product should feel more sophisticated than looking at a screenshot of it.

## Typography

Preferred fallback direction:

- rounded or humanist UI sans
- slightly soft forms
- friendly but mature
- readable at 12–16px body/control sizes
- clear at high density
- comfortable for long sessions
- good numeral shapes
- variable font support when useful

Useful qualities to audition:

- open counters
- generous x-height
- clear distinction between 1, I, l, 0, O
- strong medium/semibold weights
- good tabular figures

Reference directions may include:

- Torus-like rounded UI typography
- modern humanist grotesks
- softer product-oriented UI fonts
- restrained variable sans families

Do not lock a product to one named font without rendering alternatives first.

## Color

When no brand palette exists, use a neutral charcoal foundation.

A useful ratio:

- 85–90% neutral charcoal / near-black / gray / off-white
- 10–15% semantic or interaction accents

Suggested character:

- near-black charcoal canvas
- subtly differentiated dark surfaces
- soft off-white primary text
- muted gray secondary text
- one restrained cool interaction accent
- muted green positive
- muted coral negative
- restrained amber warning

Light mode is allowed when the product context calls for it. Preserve the same restraint and semantic discipline.

Avoid:

- neon palettes
- constant glow
- gradient-heavy surfaces
- giant accent panels
- decorative color
- glassmorphism as a default system

Color should communicate state, focus, selection, hierarchy, or meaning.

## Shape

Prefer:

- modest radii
- straight rules when separation is enough
- no pill shape unless the control/state genuinely benefits from it
- no nested rounded card stacks by default
- no ornamental border systems

## Motion

The static interface should remain humble.

Motion can carry more personality than the screenshot.

Default character:

- fast
- responsive
- small travel
- no bounce by default
- continuity over spectacle

Useful ranges:

- hover / press: 100–160ms
- selection / tab indicator: 120–180ms
- filter / small state: 140–200ms
- inspector / sheet: 160–220ms
- lightweight page continuity: 160–240ms

Prefer `transform` and `opacity`.

## Density

Medium density means:

- enough content to scan without constant scrolling
- enough breathing room to avoid visual fatigue
- no huge empty hero regions in working software
- no cramped wall of controls
- no repeated card padding consuming most of the viewport

At 1440px, a working product should normally expose meaningful information without wasting most of the screen on presentation.

## Visual hierarchy

Use hierarchy in this order:

1. current task, state, or decision
2. primary evidence/content
3. actions required to continue
4. supporting context
5. diagnostics and implementation detail

Diagnostics should rarely occupy primary visual space.

## Anti-slop default

Do not default to:

- sidebar because dashboards usually have one
- cards for every section
- rounded rectangles around everything
- huge headings
- gradient hero panels
- subtitle under every heading
- pill overload
- meaningless icons
- badges everywhere
- decorative charts
- filler helper text
- generic SaaS/admin hierarchy

Every structural decision must earn its space.
