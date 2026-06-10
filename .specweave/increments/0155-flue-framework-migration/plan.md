# Implementation Plan: Flue Framework Migration - Replace Direct API Calls

## Overview

Replace direct `fetch()` calls in `src/lib/ai/flue-generate.ts` with the **Flue Agent Harness Framework**. The current implementation manually constructs OpenAI-compatible chat completion requests to MiniMax API. Flue provides a proper agent abstraction with model + tools + skills + sessions, enabling future expansion (subagents, MCP, observability) and improving maintainability.

## Architecture

### Components

- **`.flue/agents/content-generator.ts`**: Main Flue agent module — defines model, instructions, skills
- **`.flue/agents/content-generator/skills/`**: 4 markdown skill files (listing/sku/blog/landing) with frontmatter
- **`src/lib/ai/flue-bridge.ts`**: NEW adapter — wraps Flue agent, exposes existing `generateListing/Sku/Blog/Landing` API
- **`src/lib/ai/flue-generate.ts`**: MODIFY — delegates to `flue-bridge.ts` (backwards-compatible)
- **`flue.config.ts`**: Auto-generated Flue config
- **`src/actions/admin/aiGenerate.ts`**: UNCHANGED — already calls `generateListing` etc.

### Data Flow

```
AIToolsIsland.astro
  → actions.admin.aiGenerate({ type, data })
    → src/actions/admin/aiGenerate.ts (handler)
      → generateListing(data) / generateSku(data) / etc. (existing API)
        → src/lib/ai/flue-bridge.ts (NEW)
          → init(generator).session().prompt(msg, { result: Schema })
            → .flue/agents/content-generator.ts (Flue agent)
              → MiniMax API (via @flue/runtime's model adapter)
              → Returns valibot-validated typed data
        ← back through the chain
      ← typed JSON to action
    ← returns { success, object: data }
  ← render preview in island
```

### API Contracts

The existing 4-function API stays unchanged:

```ts
// Before (raw fetch)
export async function generateListing(data: Record<string, unknown>): Promise<ListingOutput>;

// After (Flue-backed)
export async function generateListing(data: Record<string, unknown>): Promise<ListingOutput> {
  return flueBridge.generate('listing', data, ListingDataSchema);
}
```

The Astro action `aiGenerate` calls these 4 functions — no changes needed.

## Technology Stack

- **Agent Framework**: `@flue/runtime` (Flue)
- **Schema Validation**: `valibot` (already in use)
- **Language**: TypeScript + Astro Server Actions
- **Target**: Node.js initially, Cloudflare-compatible (Flue supports both)

**Architecture Decisions**:

- **Decision 1**: Keep the existing `generateListing/Sku/Blog/Landing` function signature
  - **Why**: Zero changes needed in callers (`actions/admin/aiGenerate.ts`, tests, AIToolsIsland)
  - **Alternative considered**: Replace with direct Flue calls — REJECTED (too invasive)
- **Decision 2**: Single content-generator agent for all 4 types vs 4 separate agents
  - **Why**: One model + one instruction set + 4 skills is simpler; skills are activated on-demand
  - **Alternative considered**: 4 agents — REJECTED (overhead, harder to evolve)
- **Decision 3**: Use Node.js target for Flue
  - **Why**: Project is on Cloudflare Workers, but Flue's Node target is mature + easier to test
  - **Alternative considered**: Cloudflare target — DEFERRED (out of scope for v1)

## Implementation Phases

### Phase 1: Foundation (US-001)
- Install `@flue/runtime` + `@flue/cli`
- Run `npx flue init --target node`
- Verify `flue.config.ts` + `.flue/` directory
- Confirm `pnpm build` passes with new deps

### Phase 2: Agent Module (US-002)
- Create `.flue/agents/content-generator.ts`
- Define model (configurable via env)
- Define agent instructions
- Add 4 skill markdown files

### Phase 3: Bridge + Migration (US-003)
- Create `src/lib/ai/flue-bridge.ts` — adapter
- Refactor `flue-generate.ts` to call bridge
- Verify output types unchanged
- Build + tests pass

### Phase 4: Verify Integration (US-004)
- E2E test admin/ai-tools page
- Verify 4 content types still work end-to-end
- Confirm existing call sites unaffected

### Phase 5: Polish (US-005)
- Document agent module in README
- Add observability hooks (optional)
- Skills cleanup and metadata

## Testing Strategy

- **TDD**: Write bridge tests FIRST (RED), then implement (GREEN), then refactor
- **Schema validation tests**: Reuse existing valibot schema tests
- **E2E**: Playwright homepage.spec.ts still passes (6/6)
- **Manual**: Admin AI tools page generates each of 4 content types

## Technical Challenges

### Challenge 1: Flue async runtime in Astro Action context
**Solution**: Astro actions are async handlers; `init(agent).session()` returns immediately after setup. Use `Promise.race` with 120s timeout (already in `aiGenerate.ts`).
**Risk**: Timeout could fire if Flue's session init is slow. Mitigation: log init time, increase timeout to 180s if needed.

### Challenge 2: Valibot schemas vs Flue's `result` parameter
**Solution**: Flue accepts valibot schemas as `result` option. Reuse existing schemas — no conversion needed.
**Risk**: Schema validation might not be 1:1 equivalent. Mitigation: log validation errors, fallback to old path temporarily.

### Challenge 3: Build size increase from @flue/runtime
**Solution**: Use only the modules needed (no `subagents`, `MCP` if not used). Tree-shake via `createAgent` factory.
**Risk**: Bundle could grow by 50-200KB. Mitigation: accept initial increase, optimize in later increment.

### Challenge 4: Cloudflare Workers compatibility
**Solution**: Use Node.js target for Flue. Server Actions run in Cloudflare, but Flue agent code can run via Node adapter in development. In production, evaluate Cloudflare target.
**Risk**: Different runtimes = different behavior. Mitigation: standard Node test setup.

## Files Structure

```
.flue/
├── agents/
│   └── content-generator/
│       ├── content-generator.ts  (main module)
│       ├── skills/
│       │   ├── listing.md
│       │   ├── sku.md
│       │   ├── blog.md
│       │   └── landing.md
│       └── README.md
└── config/  (auto-generated by `flue init`)

src/lib/ai/
├── flue-bridge.ts  (NEW - Flue adapter)
├── flue-generate.ts  (MODIFY - delegates to bridge)
├── valibot-schemas.ts  (UNCHANGED)
├── validation.ts  (UNCHANGED - system instructions)
└── ai-generate.test.ts  (existing tests, should still pass)
```

## Estimated Effort

| Phase | Complexity | Time |
|-------|------------|------|
| Foundation | Low | 1-2 hours |
| Agent Module | Medium | 2-3 hours |
| Bridge Migration | Medium | 2-3 hours |
| Verification | Low | 1 hour |
| Polish | Low | 1-2 hours |
| **Total** | | **~8-10 hours** |

## Risks Summary

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Build break from new dep | Medium | Test in branch, keep flue-generate.ts as backup |
| Flue API changes (still 0.0.x) | High | Pin version, document migration path |
| Runtime performance regression | Medium | Add timeout, profile |
| Schema validation differences | Low | Test with edge cases, fall back to old path |
