---
id: FS-153
title: "Extract remaining pages data layer"
type: feature
status: completed
priority: P1
created: 2026-06-08T00:00:00.000Z
lastUpdated: 2026-06-08
tldr: "Extract DB query logic from 6 remaining list pages into query functions."
complexity: medium
stakeholder_relevant: true
---

# Extract remaining pages data layer

## TL;DR

**What**: Extract DB query logic from 6 remaining list pages into query functions.
**Status**: completed | **Priority**: P1
**User Stories**: 2

## Overview

Extract DB query logic from 6 remaining list pages into query functions. All use getRawDb() with raw SQL.

**Pages:**
- public-sectors/index (207 lines)
- non-profits/index (206 lines)
- businesses/index (204 lines)
- blog/index (297 lines)
- admin/media (330 lines)
- listings/index (208 lines)

**Already created but not wired (from earlier increments):**
- getProductBySlug.ts
- getBlogPosts.ts (if exists)
- getNonProfits.ts
- getPublicSectors.ts
- getBusinesses.ts

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0153-extract-remaining-pages-data-layer](../../../../../increments/0153-extract-remaining-pages-data-layer/spec.md) | ✅ completed | 2026-06-08T00:00:00.000Z |

## User Stories

- [US-001: Extract list page query functions (P0)](./us-001-extract-list-page-query-functions-p0.md)
- [US-002: Wire pages to query functions (P1)](./us-002-wire-pages-to-query-functions-p1.md)
