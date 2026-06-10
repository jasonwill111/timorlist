---
id: FS-152
title: "Extract account + dashboard + search data layer"
type: feature
status: completed
priority: P0
created: 2026-06-08T00:00:00.000Z
lastUpdated: 2026-06-08
tldr: "Extract DB query logic from 3 pages: account.astro, dashboard.astro, search.astro into query functions."
complexity: high
stakeholder_relevant: true
---

# Extract account + dashboard + search data layer

## TL;DR

**What**: Extract DB query logic from 3 pages: account.astro, dashboard.astro, search.astro into query functions.
**Status**: completed | **Priority**: P0
**User Stories**: 4

## Overview

Extract DB query logic from 3 pages: account.astro, dashboard.astro, search.astro into query functions. These pages use getRawDb() with raw SQL queries.

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0152-extract-account-dashboard-search-data-layer](../../../../../increments/0152-extract-account-dashboard-search-data-layer/spec.md) | ✅ completed | 2026-06-08T00:00:00.000Z |

## User Stories

- [US-001: Create shared auth query module (P0)](./us-001-create-shared-auth-query-module-p0.md)
- [US-002: Extract account.astro data layer (P0)](./us-002-extract-account-astro-data-layer-p0.md)
- [US-003: Extract search.astro data layer (P0)](./us-003-extract-search-astro-data-layer-p0.md)
- [US-004: Extract dashboard.astro data layer (P0)](./us-004-extract-dashboard-astro-data-layer-p0.md)
