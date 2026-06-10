---
id: FS-148
title: "List pages data layer extraction -- frontmatter queries to lib/db/queries"
type: feature
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
lastUpdated: 2026-06-08
tldr: "Large list pages with frontmatter > 50 lines of DB queries -> query functions in lib/db/queries/."
complexity: high
stakeholder_relevant: true
---

# List pages data layer extraction -- frontmatter queries to lib/db/queries

## TL;DR

**What**: Large list pages with frontmatter > 50 lines of DB queries -> query functions in lib/db/queries/.
**Status**: completed | **Priority**: P1
**User Stories**: 6

## Overview

Large list pages with frontmatter > 50 lines of DB queries -> query functions in lib/db/queries/. Pages get slim frontmatter (< 30 lines) with import + data fetch only.

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0148-list-pages-data-layer-extraction](../../../../../increments/0148-list-pages-data-layer-extraction/spec.md) | ✅ completed | 2026-06-07T00:00:00.000Z |

## User Stories

- [US-001: product/[slug].astro data layer extraction (P0)](./us-001-product-slug-astro-data-layer-extraction-p0.md)
- [US-002: public-sectors/index.astro data layer extraction (P1)](./us-002-public-sectors-index-astro-data-layer-extraction-p1.md)
- [US-003: non-profits/index.astro data layer extraction (P1)](./us-003-non-profits-index-astro-data-layer-extraction-p1.md)
- [US-004: businesses/index.astro data layer extraction (P1)](./us-004-businesses-index-astro-data-layer-extraction-p1.md)
- [US-005: blog/index.astro data layer extraction (P1)](./us-005-blog-index-astro-data-layer-extraction-p1.md)
- [US-006: Build verification (P0)](./us-006-build-verification-p0.md)
