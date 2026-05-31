---
id: US-002
feature: FS-097
title: "Fix Auth Cookie Security"
status: completed
priority: P1
created: 2026-05-31
tldr: "**As a** security engineer."
project: TimorUp
---

# US-002: Fix Auth Cookie Security

**Feature**: [FS-097](./FEATURE.md)

**As a** security engineer
**I want** session cookies to be secure in production
**So that** session hijacking is prevented on HTTP connections

---

## Acceptance Criteria

- [x] **AC-US2-01**: `secure` cookie flag is `true` when `import.meta.env.PROD` is true
- [x] **AC-US2-02**: `sameSite` is set to `'strict'` to prevent CSRF
- [x] **AC-US2-03**: Production build succeeds

---

## Implementation

**Increment**: [0097-code-review-fixes](../../../../../increments/0097-code-review-fixes/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
