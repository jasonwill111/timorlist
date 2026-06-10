---
increment: 0154-starwind-deprecation-ui-separation-acceptance
title: Starwind deprecation + UI/业务分离验收
type: refactor
priority: P1
status: completed
created: 2026-06-08T00:00:00.000Z
structure: user-stories
test_mode: test-after
coverage_target: 80
---

# Feature: Starwind deprecation + UI/业务分离验收

## Overview

1. Mark Starwind duplicate components as deprecated (button, input)
2. Verify UI/业务 separation is complete
3. Verify component reuse is maximized

## User Stories

### US-001: Starwind deprecation (P0)

**Project**: timorup

**As a** developer
**I want** Starwind duplicate components marked deprecated
**So that** new code uses Fulldev exclusively

**Acceptance Criteria**:
- [x] **AC-US1-01**: `components/starwind/button/` marked deprecated with JSDoc comment
- [x] **AC-US1-02**: `components/starwind/input/` marked deprecated with JSDoc comment
- [x] **AC-US1-03**: `components/starwind/select/` **KEPT** (743 lines of custom logic)
- [x] **AC-US1-04**: No pages import duplicate Starwind button/input/components (only Fulldev)

### US-002: UI/业务 separation verification (P0)

**Project**: timorup

**As a** developer
**I want** automated verification that UI/业务 separation is complete
**So that** we have a clear acceptance standard

**Acceptance Criteria**:
- [x] **AC-US2-01**: All public pages frontmatter ≤30 meaningful lines
- [x] **AC-US2-02**: No page imports `drizzle-orm` or uses `db.prepare()`
- [x] **AC-US2-03**: All DB queries in `src/lib/db/queries/`

### US-003: Component reuse statistics (P1)

**Project**: timorup

**As a** developer
**I want** verified component reuse statistics
**So that** we know the separation is complete

**Acceptance Criteria**:
- [x] **AC-US3-01**: Pages use `@/components/ui/` Fulldev components
- [x] **AC-US3-02**: Pages use Starwind-unique components (pagination, toast, dropzone) where applicable
- [x] **AC-US3-03**: Build passes

## Out of Scope

- Starwind select deprecation (kept for its 743 lines of custom logic)
- API route data layer extraction (separate concern)

## Dependencies

- 0150, 0151, 0152, 0153
