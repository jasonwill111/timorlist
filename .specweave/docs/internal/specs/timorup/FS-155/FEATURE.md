---
id: FS-155
title: "Flue Framework Migration - Replace Direct API Calls"
type: feature
status: completed
priority: P1
created: 2026-06-08T00:00:00.000Z
lastUpdated: 2026-06-08
tldr: "Replace direct `fetch()` calls to MiniMax API in `src/lib/ai/flue-generate.ts` with the **Flue Agent Harness** pattern."
complexity: high
stakeholder_relevant: true
---

# Flue Framework Migration - Replace Direct API Calls

## TL;DR

**What**: Replace direct `fetch()` calls to MiniMax API in `src/lib/ai/flue-generate.ts` with the **Flue Agent Harness** pattern.
**Status**: completed | **Priority**: P1
**User Stories**: 5

## Overview

Replace direct `fetch()` calls to MiniMax API in `src/lib/ai/flue-generate.ts` with the **Flue Agent Harness** pattern. Flue is the Astro team's TypeScript framework for building autonomous agents with built-in harness (model + tools + skills + sandbox + sessions).

## Implementation History

| Increment | Status | Completion Date |
|-----------|--------|----------------|
| [0155-flue-framework-migration](../../../../../increments/0155-flue-framework-migration/spec.md) | ✅ completed | 2026-06-08T00:00:00.000Z |

## User Stories

- [US-001: Flue Agent Infrastructure (P0)](./us-001-flue-agent-infrastructure-p0.md)
- [US-002: Content Generation Agent (P0)](./us-002-content-generation-agent-p0.md)
- [US-003: Migrate `flue-generate.ts` to Flue (P0)](./us-003-migrate-flue-generate-ts-to-flue-p0.md)
- [US-004: Astro Action Integration (P1)](./us-004-astro-action-integration-p1.md)
- [US-005: Agent Observability + Skills Pattern (P2)](./us-005-agent-observability-skills-pattern-p2.md)
