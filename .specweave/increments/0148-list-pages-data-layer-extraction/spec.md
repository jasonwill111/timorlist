---
increment: 0148-list-pages-data-layer-extraction
title: List pages data layer extraction -- frontmatter queries to lib/db/queries
type: refactor
priority: P1
status: completed
created: 2026-06-07T00:00:00.000Z
structure: user-stories
test_mode: test-after
coverage_target: 80
---

# Feature: List pages data layer extraction -- frontmatter queries to lib/db/queries

## Overview

Large list pages with frontmatter > 50 lines of DB queries -> query functions in lib/db/queries/. Pages get slim frontmatter (< 30 lines) with import + data fetch only.

## User Stories

### US-001: product/[slug].astro data layer extraction (P0)
**Project**: timorup

**As a** developer
**I want** product/[slug].astro frontmatter < 30 lines
**So that** Business logic is in reusable query function

**Acceptance Criteria**:
- [x] **AC-US1-01**: lib/db/queries/getProductBySlug.ts exists with all DB logic
- [x] **AC-US1-02**: pages/product/[slug].astro frontmatter < 30 lines
- [x] **AC-US1-03**: Product page displays correctly

### US-002: public-sectors/index.astro data layer extraction (P1)
**Project**: timorup

**As a** developer
**I want** public-sectors/index.astro frontmatter < 30 lines

**Acceptance Criteria**:
- [x] **AC-US2-01**: lib/db/queries/getPublicSectors.ts exists
- [x] **AC-US2-02**: pages/public-sectors/index.astro frontmatter < 30 lines

### US-003: non-profits/index.astro data layer extraction (P1)
**Project**: timorup

**As a** developer
**I want** non-profits/index.astro frontmatter < 30 lines

**Acceptance Criteria**:
- [x] **AC-US3-01**: lib/db/queries/getNonProfits.ts exists
- [x] **AC-US3-02**: pages/non-profits/index.astro frontmatter < 30 lines

### US-004: businesses/index.astro data layer extraction (P1)
**Project**: timorup

**As a** developer
**I want** businesses/index.astro frontmatter < 30 lines

**Acceptance Criteria**:
- [x] **AC-US4-01**: lib/db/queries/getBusinesses.ts exists
- [x] **AC-US4-02**: pages/businesses/index.astro frontmatter < 30 lines

### US-005: blog/index.astro data layer extraction (P1)
**Project**: timorup

**As a** developer
**I want** blog/index.astro frontmatter < 30 lines

**Acceptance Criteria**:
- [x] **AC-US5-01**: lib/db/queries/getBlogPosts.ts exists
- [x] **AC-US5-02**: pages/blog/index.astro frontmatter < 30 lines

### US-006: Build verification (P0)
**Project**: timorup

**As a** developer
**I want** All extracted pages pass build
**So that** No regression

**Acceptance Criteria**:
- [x] **AC-US6-01**: pnpm exec -- astro build exit code 0
- [x] **AC-US6-02**: All list pages render correctly with query functions

## Out of Scope

- admin pages data layer (0143 handles this)
- detail pages (product/[slug], business/[slug] detail already done in 0142)
- query file deletion (0149 handles this)

## Dependencies

- Depends on 0142 (query extraction pattern established)
