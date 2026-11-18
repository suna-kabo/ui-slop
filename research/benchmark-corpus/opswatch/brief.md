# Opswatch

Build an operational incident triage surface for a small infrastructure team.

## Primary job

An operator filters failing jobs, opens one incident, reads the failure chain, retries a safe step, sees acknowledgement and outcome, then returns to the same filtered queue.

## Protected product contract

- R1: Incident severity, dependency chain, and current execution state are understandable without depending on decorative status color alone.
- R2: A retry action distinguishes pending acknowledgement, accepted retry, running work, success, and failure.
- R3: Returning from incident detail preserves filters, selection context, and queue position.
- R4: Destructive or unsafe actions are not implied when a safe retry is unavailable.
- R5: Long error messages, missing owner data, and mixed incident types remain readable.
- R6: Keyboard users can filter, inspect, retry when allowed, inspect result, and return.
- R7: Narrow layouts keep the active failure and recovery action primary.

Optimize for repeated operational use, not first-impression spectacle.
