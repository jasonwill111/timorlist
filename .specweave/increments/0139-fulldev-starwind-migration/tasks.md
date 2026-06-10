# Tasks: Fulldev + Starwind Migration

## Task Notation
- `**Status**: [x] completed | [ ] pending
- Model hints: haiku (simple/trivial), sonnet (default), opus (complex)

---

### T-001: Initialize Starwind CLI
**AC**: AC-US1-01 | **Status**: [x] completed | **Model**: haiku
**Test**: Given Astro project → When `npx starwind@latest init` runs → Then `starwind.config.json` exists with `baseDir: "src/components/starwind"`
**Files**: `starwind.config.json`

---

### T-002: Install Starwind Components
**AC**: AC-US1-02, AC-US1-03 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given starwind init done → When `npx starwind@latest add toast dropzone pagination progress color-picker scroll-area hover-card context-menu image item` runs → Then all 10 components exist in `src/components/starwind/`
**Files**: `src/components/starwind/`
**Note**: 确认 starwind CLI 可用，先 `npx starwind@latest --version` 验证。

---

### T-003: Replace index.astro with Fulldev Blocks
**AC**: AC-US2-01 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given homepage → When page renders → Then Hero + Features + Pricing + CTA blocks visible with correct data
**Files**: `pages/index.astro`, `src/components/blocks/`
**Dependencies**: T-001

---

### T-004: Replace pricing.astro with Block
**AC**: AC-US2-02 | **Status**: [x] completed | **Model**: haiku
**Test**: Given pricing page → When page renders → Then `@fulldev/pricing-N` block visible, no inline grid/CSS
**Files**: `pages/pricing.astro`
**Dependencies**: T-001

---

### T-005: Replace faq.astro with Block
**AC**: AC-US2-03 | **Status**: [x] completed | **Model**: haiku
**Test**: Given FAQ page → When page renders → Then `@fulldev/faqs-N` block visible
**Files**: `pages/faq.astro`
**Dependencies**: T-001

---

### T-006: Replace contact.astro with Block
**AC**: AC-US2-04 | **Status**: [x] completed | **Model**: haiku
**Test**: Given contact page → When page renders → Then `@fulldev/contact-N` block visible with form
**Files**: `pages/contact.astro`
**Dependencies**: T-001

---

### T-007: Replace about.astro with Blocks
**AC**: AC-US2-05 | **Status**: [x] completed | **Model**: haiku
**Test**: Given about page → When page renders → Then Hero + Content + CTA blocks visible
**Files**: `pages/about.astro`
**Dependencies**: T-001

---

### T-008: Extract business/[slug] queries
**AC**: AC-US3-01, AC-US3-06 | **Status**: [x] completed | **Model**: opus
**Test**: Given `business/[slug]` → When page loads with valid slug → Then business data loads from `getBusinessBySlug()`, no inline DB query in page
**Files**: `src/lib/db/queries/getBusinessBySlug.ts`, `pages/business/[slug].astro`
**Dependencies**: T-001
**Note**: 183 行 frontmatter 提取为 query 函数，页面只保留 fetch + redirect。

---

### T-009: Extract listings/[slug] queries
**AC**: AC-US3-02, AC-US3-06 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given `listings/[slug]` → When page loads → Then data from `getListingBySlug()`, frontmatter < 30 lines
**Files**: `src/lib/db/queries/getListingBySlug.ts`, `pages/listings/[slug].astro`
**Dependencies**: T-001

---

### T-010: Extract non-profit/[slug] queries
**AC**: AC-US3-03, AC-US3-07 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given `non-profit/[slug]` → When page loads → Then data from `getEntityBySlug()` (type=nonprofit), frontmatter < 30 lines
**Files**: `src/lib/db/queries/getEntityBySlug.ts`, `pages/non-profit/[slug].astro`
**Dependencies**: T-001

---

### T-011: Extract public-sector/[slug] queries
**AC**: AC-US3-04, AC-US3-07 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given `public-sector/[slug]` → When page loads → Then data from `getEntityBySlug()` (type=public_sector), frontmatter < 30 lines
**Files**: `src/lib/db/queries/getEntityBySlug.ts`, `pages/public-sector/[slug].astro`
**Dependencies**: T-001

---

### T-012: Extract blog/[slug] queries
**AC**: AC-US3-05, AC-US3-06 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given `blog/[slug]` → When page loads → Then data from `getBlogPostBySlug()`, frontmatter < 30 lines
**Files**: `src/lib/db/queries/getBlogPostBySlug.ts`, `pages/blog/[slug].astro`
**Dependencies**: T-001

---

### T-013: Create LoginIsland
**AC**: AC-US4-01, AC-US4-05 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given admin login page → When page loads → Then `LoginIsland` renders form, no innerHTML in island script
**Files**: `components/islands/admin/LoginIsland.astro`, `pages/admin/login.astro`
**Dependencies**: T-001

---

### T-014: Create MediaIsland
**AC**: AC-US4-02, AC-US4-05 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given admin media page → When page loads → Then `MediaIsland` renders gallery, uses textContent for text updates
**Files**: `components/islands/admin/MediaIsland.astro`, `pages/admin/media.astro`
**Dependencies**: T-001

---

### T-015: Create AIToolsIsland
**AC**: AC-US4-03, AC-US4-05 | **Status**: [x] completed | **Model**: opus
**Test**: Given admin AI tools page → When page loads → Then `AIToolsIsland` renders tools panel, 927-line page replaced
**Files**: `components/islands/admin/AIToolsIsland.astro`, `pages/admin/ai-tools.astro`
**Dependencies**: T-001

---

### T-016: Create SettingsIsland
**AC**: AC-US4-04, AC-US4-05 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given admin settings page → When page loads → Then `SettingsIsland` renders settings form
**Files**: `components/islands/admin/SettingsIsland.astro`, `pages/admin/settings.astro`
**Dependencies**: T-001

---

### T-017: Delete components.json
**AC**: AC-US5-01 | **Status**: [x] completed | **Model**: haiku
**Test**: Given project root → When `ls components.json` runs → Then file not found
**Files**: `components.json`

---

### T-018: Delete PascalCase re-export files
**AC**: AC-US5-02, AC-US5-03 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given all pages/layouts → When grep for PascalCase imports runs → Then zero matches, build passes
**Files**: `src/components/ui/Accordion.astro`, `Button.astro`, `Card.astro`, `CardContent.astro`, `CardDescription.astro`, `CardHeader.astro`, `CardTitle.astro`, `Input.astro`, `Select.astro`, `Textarea.astro`, `Label.astro`, `Tabs.astro`, `TabsList.astro`, `TabsTrigger.astro`
**Dependencies**: T-013 through T-016

---

### T-019: Integrate Toast into auth flows
**AC**: AC-US6-01 | **Status**: [x] completed | **Model**: haiku
**Test**: Given login/register form → When submission succeeds/fails → Then Starwind toast notification appears
**Files**: `components/islands/admin/LoginIsland.astro`, `pages/login.astro`, `pages/register.astro`
**Dependencies**: T-002

---

### T-020: Integrate Pagination into list pages
**AC**: AC-US6-02 | **Status**: [x] completed | **Model**: haiku
**Test**: Given blog/index.astro or listings/index.astro → When results paginated → Then Starwind pagination component visible
**Files**: `pages/blog/index.astro`, `pages/listings/index.astro`
**Dependencies**: T-002

---

### T-021: Integrate Progress into product page
**AC**: AC-US6-03 | **Status**: [x] completed | **Model**: haiku
**Test**: Given business/[slug]/products.astro → When products load → Then Starwind Progress bar visible during load
**Files**: `pages/business/[slug]/products.astro`
**Dependencies**: T-002

---

### T-022: Integrate Dropzone into admin media
**AC**: AC-US6-04 | **Status**: [x] completed | **Model**: haiku
**Test**: Given admin/media page → When upload triggered → Then Starwind Dropzone UI visible
**Files**: `components/islands/admin/MediaIsland.astro`
**Dependencies**: T-002, T-014

---

### T-023: Full build verification
**AC**: AC-US7-01, AC-US7-02, AC-US7-03 | **Status**: [x] completed | **Model**: haiku
**Test**: Given all changes applied → When `pnpm exec -- astro build` runs → Then exit 0, zero errors
**Dependencies**: T-001 through T-022

---

### T-024: E2E smoke test
**AC**: AC-US7-02 | **Status**: [x] completed | **Model**: haiku
**Test**: Given build passes → When `pnpm exec -- playwright test` runs → Then core E2E scenarios pass
**Dependencies**: T-023