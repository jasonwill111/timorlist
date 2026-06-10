# Tasks: Flue Framework Migration - Replace Direct API Calls

## Task Notation

- `**Status**: [x] completed | [ ] pending
- Model hints: haiku (simple), sonnet (default), opus (complex)

---

### T-001: Install Flue runtime + CLI
**AC**: AC-US1-01, AC-US1-02, AC-US1-05 | **Status**: [x] completed | **Model**: haiku
**Test**: Given clean repo → When `npm install @flue/runtime @flue/cli --save` runs → Then `package.json` has both deps, `node_modules/@flue/runtime/` exists
**Files**: `package.json`
**Note**: Use `pnpm add` since project uses pnpm. Pin to known-good version (0.0.x).

---

### T-002: Initialize Flue config
**AC**: AC-US1-02, AC-US1-05 | **Status**: [x] completed | **Model**: haiku
**Test**: Given Flue installed → When `npx flue init --target node` runs → Then `flue.config.ts` and `.flue/` directory exist
**Files**: `flue.config.ts`, `.flue/`
**Dependencies**: T-001

---

### T-003: Verify build with Flue deps
**AC**: AC-US1-03, AC-US1-04 | **Status**: [x] completed | **Model**: haiku
**Test**: Given Flue initialized → When `pnpm exec -- astro build` runs → Then exit 0
**Dependencies**: T-002

---

### T-004: Create content-generator agent module
**AC**: AC-US2-01, AC-US2-02 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given `.flue/agents/content-generator.ts` exists → When module imported → Then `createAgent()` returns agent with model + instructions configured
**Files**: `.flue/agents/content-generator.ts`
**Dependencies**: T-002

---

### T-005: Create 4 skill markdown files
**AC**: AC-US2-04, AC-US5-01, AC-US5-02 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given 4 skill files → When each loaded → Then has frontmatter with `name` and `description` matching content type
**Files**: `.flue/agents/content-generator/skills/listing.md`, `sku.md`, `blog.md`, `landing.md`
**Dependencies**: T-004

---

### T-006: Create flue-bridge adapter
**AC**: AC-US2-03, AC-US2-05, AC-US3-01, AC-US3-02 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given bridge module → When `bridge.generate('listing', data, Schema)` called → Then `init(agent).session().prompt(msg, { result: Schema })` invoked, returns typed data
**Files**: `src/lib/ai/flue-bridge.ts` (new)
**Dependencies**: T-004

---

### T-007: Refactor flue-generate.ts to use bridge
**AC**: AC-US3-01, AC-US3-02, AC-US3-03, AC-US3-04 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given `flue-generate.ts` → When `generateListing(data)` called → Then delegates to `flueBridge.generate()`, returns `Promise<ListingOutput>` (unchanged type)
**Files**: `src/lib/ai/flue-generate.ts` (modify)
**Dependencies**: T-006

---

### T-008: Write tests for bridge
**AC**: AC-US2-05, AC-US3-05 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given bridge tests → When run with `npx vitest run src/lib/ai/flue-bridge.test.ts` → Then all tests pass, validates schema conversion + prompt routing
**Files**: `src/lib/ai/flue-bridge.test.ts` (new)
**Dependencies**: T-006

---

### T-009: Run full build + existing test suite
**AC**: AC-US1-04, AC-US3-05, AC-US4-01 | **Status**: [x] completed | **Model**: haiku
**Test**: Given all changes → When `pnpm exec -- astro build` and `npx vitest run` runs → Then both exit 0
**Dependencies**: T-007, T-008

---

### T-010: E2E test homepage still works
**AC**: AC-US4-04 | **Status**: [x] completed | **Model**: haiku
**Test**: Given all changes → When `pnpm exec -- playwright test e2e/homepage.spec.ts --project=chromium` runs → Then 6/6 tests pass
**Dependencies**: T-009

---

### T-011: Manual AI tool test
**AC**: AC-US4-02, AC-US4-03, AC-US4-04 | **Status**: [x] completed | **Model**: haiku
**Test**: Given dev server running → When admin clicks Generate Listing → Then preview renders + save works
**Dependencies**: T-009

---

### T-012: Document agent module
**AC**: AC-US5-05 | **Status**: [x] completed | **Model**: haiku
**Test**: Given `.flue/agents/content-generator/README.md` → When reviewed → Then explains model config, skills, usage examples
**Files**: `.flue/agents/content-generator/README.md` (new)
**Dependencies**: T-005, T-007
