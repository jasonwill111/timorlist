---
id: US-001
feature: FS-155
title: "Flue Agent Infrastructure (P0)"
status: completed
priority: P1
created: 2026-06-08T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-001: Flue Agent Infrastructure (P0)

**Feature**: [FS-155](./FEATURE.md)

**As a** developer
**I want** Flue framework installed and configured
**So that** I can build agents with proper harness pattern

---

## Acceptance Criteria

- [x] **AC-US1-01**: `npm install @flue/runtime @flue/cli --save` in package.json
- [x] **AC-US1-02**: `npx flue init --target node` creates `flue.config.ts`
- [x] **AC-US1-03**: Wrangler config compatible (Flue works alongside Cloudflare Workers)
- [x] **AC-US1-04**: Build passes with Flue dependencies
- [x] **AC-US1-05**: `.flue/` directory structure created at project root

---

## Implementation

**Increment**: [0155-flue-framework-migration](../../../../../increments/0155-flue-framework-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-001**: Install Flue runtime + CLI
- [x] **T-002**: Initialize Flue config
- [x] **T-003**: Verify build with Flue deps
- [x] **T-009**: Run full build + existing test suite
