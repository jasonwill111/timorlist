---
id: US-002
feature: FS-153
title: "Wire pages to query functions (P1)"
status: completed
priority: P1
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-002: Wire pages to query functions (P1)

**Feature**: [FS-153](./FEATURE.md)

**As a** developer
**I want** all 6 pages wired to query functions
**So that** all frontmatter DB queries are eliminated

---

## Acceptance Criteria

- [x] **AC-US2-01**: All 6 pages use query functions instead of raw SQL
- [x] **AC-US2-02**: Build passes (`pnpm exec -- astro build` exit 0)
- [x] **AC-US2-03**: No `db.prepare(` calls remain in page files

---

## Implementation

**Increment**: [0153-extract-remaining-pages-data-layer](../../../../../increments/0153-extract-remaining-pages-data-layer/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-004**: Wire businesses/index.astro, blog/index.astro, public-sectors/index.astro, non-profits/index.astro
- [x] **T-005**: Wire admin/media.astro and listings/index.astro
