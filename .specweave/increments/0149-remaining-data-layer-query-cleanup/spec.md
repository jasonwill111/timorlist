---
increment: 0149-remaining-data-layer-query-cleanup
title: Query cleanup -- delete unused query files
type: refactor
priority: P2
status: completed
created: 2026-06-07T00:00:00.000Z
structure: user-stories
test_mode: test-after
coverage_target: 80
---

# Feature: Query cleanup -- delete unused query files

## Overview

28 query files in lib/db/queries/ are unused by any page or action. Delete them to reduce dead code and confusion.

## User Stories

### US-001: Audit all query files for usage (P0)
**Project**: timorup

**As a** developer
**I want** Every query file in lib/db/queries/ is verified for usage
**So that** Dead code is identified

**Acceptance Criteria**:
- [x] **AC-US1-01**: grep all query files from lib/db/queries/ against src/ to find truly unused files
- [x] **AC-US1-02**: List confirmed unused query files with file paths

### US-002: Delete unused query files (P0)
**Project**: timorup

**As a** developer
**I want** Unused query files deleted from lib/db/queries/
**So that** Project is clean, no dead code

**Acceptance Criteria**:
- [x] **AC-US2-01**: All confirmed unused query files deleted
- [x] **AC-US2-02**: No remaining references to deleted files in codebase
- [x] **AC-US2-03**: pnpm exec -- astro build exit code 0 (verifies no broken imports)

### US-003: Consolidate duplicate query logic (P2)
**Project**: timorup

**As a** developer
**I want** Duplicate query functions consolidated
**So that** DRY principle maintained

**Acceptance Criteria**:
- [x] **AC-US3-01**: Identify query functions that duplicate each other
- [x] **AC-US3-02**: Consolidate into single canonical function
- [x] **AC-US3-03**: All callers updated to use consolidated function

## Out of Scope

- Modifying active query files
- Creating new query files
- Query function testing (unit tests)

## Dependencies

- Depends on 0142, 0148 (query extraction complete)
