---
id: US-002
feature: FS-155
title: "Content Generation Agent (P0)"
status: completed
priority: P1
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-002: Content Generation Agent (P0)

**Feature**: [FS-155](./FEATURE.md)

**As a** developer
**I want** a single Flue agent that handles all 4 content types (listing, sku, blog, landing)
**So that** the AI feature is standardized and easily extensible

---

## Acceptance Criteria

- [x] **AC-US2-01**: `.flue/agents/content-generator.ts` created with `createAgent()` + model config
- [x] **AC-US2-02**: Agent accepts type parameter (listing/sku/blog/landing) and routes to correct schema
- [x] **AC-US2-03**: All 4 schemas (ListingData, SkuData, BlogData, LandingData) reused from `@/lib/ai/valibot-schemas`
- [x] **AC-US2-04**: System instructions extracted to `.flue/agents/content-generator/skills/` as markdown
- [x] **AC-US2-05**: `session.prompt()` returns typed `data` from valibot schema validation

---

## Implementation

**Increment**: [0155-flue-framework-migration](../../../../../increments/0155-flue-framework-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-004**: Create content-generator agent module
- [x] **T-005**: Create 4 skill markdown files
- [x] **T-006**: Create flue-bridge adapter
- [x] **T-008**: Write tests for bridge
