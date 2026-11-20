# Kilnroom refinement

[Open the original](before/index.html) or [open the refined copy](after/index.html) in a local browser. Both are runnable static apps from the archived Clay Commons Studio fixture. Use separate browser profiles or fresh contexts when comparing them. The four runnable files in `before/` retain the original bytes. The fixture date is November 20, 2026.

Run the focused replay from the repository root after `npm ci` and `npx playwright install chromium`. Set `UI_SLOP_CHROMIUM_PATH` to use an installed Chromium. Add `--capture` to refresh the screenshots.

```sh
node validation/kilnroom/replay.mjs
```

| State | Desktop before → after | Mobile before → after |
| --- | --- | --- |
| Schedule | [Before](screenshots/before-desktop-schedule.png) · [After](screenshots/after-desktop-schedule.png) | [Before](screenshots/before-mobile-schedule.png) · [After](screenshots/after-mobile-schedule.png) |
| Juniper detail | [Before](screenshots/before-desktop-detail.png) · [After](screenshots/after-desktop-detail.png) | [Before](screenshots/before-mobile-detail.png) · [After](screenshots/after-mobile-detail.png) |
| Allocation feedback | [Before](screenshots/before-desktop-allocated.png) · [After](screenshots/after-desktop-allocated.png) | [Before](screenshots/before-mobile-allocated.png) · [After](screenshots/after-mobile-allocated.png) |

## Decisions and rendered results

The refinement used the project-installed UI Slop **3.1.0** at `.agents/skills/ui-slop/SKILL.md`. Codex app-server discovery also listed the user-scoped **3.0.1**, so the validation loaded the project entrypoint by exact path. This was an operated self-review of a narrow refinement.

- **Shape and calibrate.** Staff need to compare occupied kiln days, firing stage, and capacity. Members need to track their work and get back to it from a load. Keep the timetable and agenda, firing-program colors, fit constraints, and existing stage guards. Use the incumbent live-rail badge as the shared stage treatment. The choice holds if the badge and capacity remain readable together in the densest tile.
- **Prove and correct.** The original display title and “Weekly plan” compete for attention. Removing the repeated heading and moving the program filter into the week toolbar brought the desktop timetable up by about 68 px. A compact sans heading leaves the serif studio mark and program colors to carry identity. Larger capacity values and a shared stage treatment are visible in the first viewport. The phone agenda now shows Juniper's continuing Sunday reservation, with its original start date.
- **Operate and verify.** The detail heading leads with the kiln and program. Cone, date, and load ID remain available. Assignment changes the local capacity, roster, and program fit feedback. The acknowledgment stays visible and receives focus above the footer actions. The update is synchronous and the verified workflow works with reduced motion.
- **Reinspect.** The initial render broke “Cone 04” across lines on a one-day tile and left the phone filter detached. The focused revision kept cone labels intact and gave the filter a full-width row. Operating from Sunday also exposed the need for day-specific focus restoration when the same load appears twice. The revised replay opens from Sunday and verifies return to that exact control after the calendar rerenders.

## Verification and limits

**Evidence Gate PASS for the exercised paths.** Chromium at 1440×900, 1024×800, and touch-emulated 390×844 and 320×760 exercised assignment, repeated Enter, reversal, reload, the early-start guard, Firing → Cooling across the schedule, rail and reopened detail, and member work → load → return. The 320px run used reduced motion. The replay checked focus restoration and recorded no console or page errors.

**Observed quality.** The first viewport gives stage and capacity more emphasis and the affected detail remains legible on the phone. The continuation after allocation and the return to the originating row were both operated. The targeted review found no material defect in these paths after correction.

**Remaining limitations.** The archive still models some work as an aggregate studio rack, and committed member withdrawal is outside this refinement. The example uses seeded browser-local state. Physical devices, assistive-technology output, other browser engines, shared backend behavior, and general generation quality remain unverified. This is one worked example and supports no claim of broad readiness.
