---
id: FS-149
title: "Query cleanup -- delete unused query files"
type: feature
status: completed
priority: P2
created: 2026-06-07T00:00:00.000Z
lastUpdated: 2026-06-08
tldr: "28 query files in lib/db/queries/ are unused by any page or action."
complexity: medium
stakeholder_relevant: true
---

# Query cleanup -- delete unused query files

## TL;DR

**What**: 28 query files in lib/db/queries/ are unused by any page or action.
**Status**: completed | **Priority**: P2
**User Stories**: 3

## Overview

28 query files in lib/db/queries/ are unused by any page or action. Delete them to reduce dead code and confusion.

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0149-remaining-data-layer-query-cleanup](../../../../../increments/0149-remaining-data-layer-query-cleanup/spec.md) | ✅ completed | 2026-06-07T00:00:00.000Z |

## User Stories

- [US-001: Audit all query files for usage (P0)](./us-001-audit-all-query-files-for-usage-p0.md)
- [US-002: Delete unused query files (P0)](./us-002-delete-unused-query-files-p0.md)
- [US-003: Consolidate duplicate query logic (P2)](./us-003-consolidate-duplicate-query-logic-p2.md)
