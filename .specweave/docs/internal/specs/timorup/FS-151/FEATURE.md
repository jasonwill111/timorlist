---
id: FS-151
title: "Extract business/[slug].astro data layer"
type: feature
status: completed
priority: P0
created: 2026-06-08T00:00:00.000Z
lastUpdated: 2026-06-08
tldr: "Extract ~180 lines of frontmatter DB query logic from business/[slug].astro into query functions in `src/lib/db/queries/`."
complexity: medium
stakeholder_relevant: true
---

# Extract business/[slug].astro data layer

## TL;DR

**What**: Extract ~180 lines of frontmatter DB query logic from business/[slug].astro into query functions in `src/lib/db/queries/`.
**Status**: completed | **Priority**: P0
**User Stories**: 2

## Overview

Extract ~180 lines of frontmatter DB query logic from business/[slug].astro into query functions in `src/lib/db/queries/`. This is the largest page in the project and the primary target for UI/业务 separation.

**Target**: frontmatter ≤ 30 lines of meaningful code (imports + wiring only). All DB queries → `src/lib/db/queries/business-detail.ts`.

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0151-extract-business-detail-data-layer](../../../../../increments/0151-extract-business-detail-data-layer/spec.md) | ✅ completed | 2026-06-08T00:00:00.000Z |

## User Stories

- [US-001: Create business-detail query module (P0)](./us-001-create-business-detail-query-module-p0.md)
- [US-002: Wire query functions into business/[slug].astro (P0)](./us-002-wire-query-functions-into-business-slug-astro-p0.md)
