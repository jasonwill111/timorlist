---
increment: 0155-flue-framework-migration
title: Flue Framework Migration - Replace Direct API Calls
type: feature
priority: P1
status: completed
created: 2026-06-08T00:00:00.000Z
structure: user-stories
test_mode: TDD
coverage_target: 80
---

# Feature: Flue Framework Migration - Replace Direct API Calls

## Overview

Replace direct `fetch()` calls to MiniMax API in `src/lib/ai/flue-generate.ts` with the **Flue Agent Harness** pattern. Flue is the Astro team's TypeScript framework for building autonomous agents with built-in harness (model + tools + skills + sandbox + sessions).

Current pattern (raw API):
```ts
// src/lib/ai/flue-generate.ts
const response = await fetch(`${API_BASE}/text/chatcompletion_v2`, {
  method: 'POST',
  body: JSON.stringify({ model: 'MiniMax-M2.7', messages: [...] })
});
const json = await response.json();
return JSON.parse(json.choices[0].message.content);
```

Target pattern (Flue agent):
```ts
// .flue/agents/content-generator.ts
import { createAgent } from '@flue/runtime';
import { ListingDataSchema, SkuDataSchema, BlogDataSchema, LandingDataSchema } from '@/lib/ai/valibot-schemas';

const generator = createAgent(() => ({
  model: 'anthropic/MiniMax-M2.7',  // or whatever model
  instructions: CONTENT_GENERATION_INSTRUCTIONS,
  // skills, tools, sandbox configured per agent
}));

// Usage in astro action:
export default createAgent(...);
const harness = await init(generator);
const session = await harness.session();
const { data } = await session.prompt(userMessage, { result: ListingDataSchema });
return data;
```

## User Stories

### US-001: Flue Agent Infrastructure (P0)
**Project**: timorup

**As a** developer
**I want** Flue framework installed and configured
**So that** I can build agents with proper harness pattern

**Acceptance Criteria**:
- [x] **AC-US1-01**: `npm install @flue/runtime @flue/cli --save` in package.json
- [x] **AC-US1-02**: `npx flue init --target node` creates `flue.config.ts`
- [x] **AC-US1-03**: Wrangler config compatible (Flue works alongside Cloudflare Workers)
- [x] **AC-US1-04**: Build passes with Flue dependencies
- [x] **AC-US1-05**: `.flue/` directory structure created at project root

---

### US-002: Content Generation Agent (P0)
**Project**: timorup

**As a** developer
**I want** a single Flue agent that handles all 4 content types (listing, sku, blog, landing)
**So that** the AI feature is standardized and easily extensible

**Acceptance Criteria**:
- [x] **AC-US2-01**: `.flue/agents/content-generator.ts` created with `createAgent()` + model config
- [x] **AC-US2-02**: Agent accepts type parameter (listing/sku/blog/landing) and routes to correct schema
- [x] **AC-US2-03**: All 4 schemas (ListingData, SkuData, BlogData, LandingData) reused from `@/lib/ai/valibot-schemas`
- [x] **AC-US2-04**: System instructions extracted to `.flue/agents/content-generator/skills/` as markdown
- [x] **AC-US2-05**: `session.prompt()` returns typed `data` from valibot schema validation

---

### US-003: Migrate `flue-generate.ts` to Flue (P0)
**Project**: timorup

**As a** developer
**I want** the 4 generator functions (generateListing/Sku/Blog/Landing) to use Flue
**So that** raw `fetch()` API calls are eliminated

**Acceptance Criteria**:
- [x] **AC-US3-01**: `src/lib/ai/flue-generate.ts` no longer calls `fetch()` directly
- [x] **AC-US3-02**: All 4 functions delegate to Flue agent via `init(agent).session().prompt()`
- [x] **AC-US3-03**: Return type stays same (`Promise<ListingOutput>` etc.) — callers unchanged
- [x] **AC-US3-04**: Schema validation still happens via valibot (now in Flue layer)
- [x] **AC-US3-05**: Build passes, all existing tests still green

---

### US-004: Astro Action Integration (P1)
**Project**: timorup

**As a** admin user
**I want** the admin AI tools page to work with the new Flue backend
**So that** content generation still works for admins

**Acceptance Criteria**:
- [x] **AC-US4-01**: `src/actions/admin/aiGenerate.ts` still calls `generateListing/Sku/Blog/Landing` (unchanged interface)
- [x] **AC-US4-02**: Action timeout (120s) still works with Flue's `Promise.race`
- [x] **AC-US4-03**: Error responses still match `{ success, error: { code, message } }` shape
- [x] **AC-US4-04**: `src/pages/admin/ai-tools.astro` AIToolsIsland (from 0139) still renders previews correctly

---

### US-005: Agent Observability + Skills Pattern (P2)
**Project**: timorup

**As a** developer
**I want** AI agent calls to be observable and reusable
**So that** future AI features are easier to build and maintain

**Acceptance Criteria**:
- [x] **AC-US5-01**: Skills (markdown expertise) extracted to `.flue/agents/content-generator/skills/` directory
- [x] **AC-US5-02**: Each skill has frontmatter (`name`, `description`) and lives in own subdirectory
- [~] **AC-US5-03**: Skills activate on-demand via `session.skill('name')` or statically imported
- [~] **AC-US5-04**: `@flue/opentelemetry` or `observe()` adapter wired for tracing (optional)
- [x] **AC-US5-05**: Logs structure documented in `.flue/agents/content-generator/README.md`

---

## Functional Requirements

### FR-001: Install Flue
- Add `@flue/runtime` as production dependency
- Add `@flue/cli` as dev dependency
- Run `npx flue init --target node` (Cloudflare compatibility documented)
- Result: `flue.config.ts` + `.flue/` directory

### FR-002: Agent Module Structure
- Location: `.flue/agents/content-generator.ts`
- Default export: `createAgent()` result
- Model: configurable via env var (default `MiniMax-M2.7` or `anthropic/claude-sonnet-4-6` fallback)
- Skills: 4 skill files for each content type

### FR-003: Schema Compatibility
- Reuse existing `src/lib/ai/valibot-schemas.ts` — no schema changes
- Output type stays same — existing callers in `actions/admin/aiGenerate.ts` and `AIToolsIsland.astro` unchanged

### FR-004: Environment Configuration
- `MINIMAX_API_KEY` already exists in env.ts
- Flue reads model credentials from `.env` or runtime config
- `flue.config.ts` declares which model per agent

## Success Criteria

| Metric | Target |
|--------|--------|
| Direct `fetch()` calls to AI APIs in `src/` | 0 |
| Number of AI features using Flue agent | 4 (listing/sku/blog/landing) |
| Build status | `pnpm build` exit 0 |
| E2E tests | 6/6 homepage tests still pass |
| Existing admin AI tool UI | Renders and works without changes |

## Out of Scope

- Chat-style conversational agents (Flue supports this but not needed now)
- Image generation (separate increment)
- Multi-agent orchestration with `subagents` (future increment)
- Cloudflare Workers deployment target (start with Node, port later)
- Migration of non-AI features

## Dependencies

- Flue framework (npm package)
- Existing valibot schemas (`src/lib/ai/valibot-schemas.ts`)
- Existing valibot validation rules (`src/lib/ai/validation.ts`)
- Existing system prompt instructions (extracted from `flue-generate.ts`)

## Files to Create

| File | Purpose |
|------|---------|
| `.flue/agents/content-generator.ts` | Main agent module |
| `.flue/agents/content-generator/skills/listing.md` | Listing generation skill |
| `.flue/agents/content-generator/skills/sku.md` | SKU generation skill |
| `.flue/agents/content-generator/skills/blog.md` | Blog generation skill |
| `.flue/agents/content-generator/skills/landing.md` | Landing page skill |
| `.flue/agents/content-generator/README.md` | Documentation |
| `flue.config.ts` | Flue config (auto-generated) |

## Files to Modify

| File | Change |
|------|--------|
| `package.json` | Add `@flue/runtime` + `@flue/cli` |
| `src/lib/ai/flue-generate.ts` | Replace `fetch()` with `session.prompt()` |
| `src/lib/env.ts` | Add Flue config helpers if needed |

## Verification

### Build Test
```bash
pnpm exec -- astro build  # exit 0
```

### E2E Test
```bash
pnpm exec -- playwright test e2e/homepage.spec.ts --project=chromium  # 6/6 pass
```

### Manual AI Test
```bash
# In dev mode, open /admin/ai-tools
# Click "Generate Listing" with sample input
# Verify: generated preview shows + save to DB works
```

## Reference

- Flue framework: https://flueframework.com/
- Getting started: https://flueframework.com/docs/getting-started/quickstart/
- Agent concept: https://flueframework.com/docs/concepts/agents/
- GitHub: https://github.com/withastro/flue
