# Tasks: Marketing Pages to Fulldev Blocks

## Phase 1: Install Fulldev Blocks

### T-001: Install Fulldev Blocks via CLI
**Status**: [ ] Not Started
**Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US1-05
**US**: US-001

**Description**: 安装 fulldev CLI 并安装所有需要的 Block 组件到 `src/components/blocks/`。

**Steps**:
1. 确认 `components.json` registry指向 `https://ui.full.dev/r/{name}.json`
2. 安装以下 blocks: `hero-1`, `features-1`, `pricing-2`, `cta-1`（首页）
3. 安装 `hero-1`, `content-1`, `cta-1`（about 页）
4. 安装 `pricing-2`（pricing 页）
5. 安装 `faqs-1`（faq 页）
6. 安装 `contact-1`（contact 页）
7. 验证 `src/components/blocks/` 目录存在且包含所有 blocks

**Test Plan**:
- Given fulldev CLI 配置正确
- When 运行 `npx shadcn@latest add @fulldev/xxx` 命令
- Then 所有 blocks 安装到 `src/components/blocks/{block-name}/`

---

### T-002: Replace Homepage (index.astro)
**Status**: [ ] Not Started
**Satisfies ACs**: AC-US1-01, AC-US1-02, AC-US1-03, AC-US1-04, AC-US1-05, AC-US1-06
**US**: US-001

**Test Plan**:
- Given `pages/index.astro` 包含手写 Hero/Features/Pricing/CTA section
- When 重构为使用 `@/components/blocks/hero-1`, `@/components/blocks/features-1`, `@/components/blocks/pricing-2`, `@/components/blocks/cta-1`
- Then 所有 section 数据从 frontmatter props 传入，页面行数减少 >30%，构建通过

---

### T-003: Replace About Page (about.astro)
**Status**: [ ] Not Started
**Satisfies ACs**: AC-US2-01, AC-US2-02, AC-US2-03
**US**: US-002

**Test Plan**:
- Given `pages/about.astro` 包含手写 Hero/Content/CTA section
- When 重构为使用 `@/components/blocks/hero-1`, `@/components/blocks/content-1`, `@/components/blocks/cta-1`
- Then 页面行数减少 >30%，构建通过

---

### T-004: Replace Pricing Page (pricing.astro)
**Status**: [ ] Not Started
**Satisfies ACs**: AC-US3-01, AC-US3-02
**US**: US-003

**Test Plan**:
- Given `pages/pricing.astro` 包含手写 pricing section
- When 重构为使用 `@/components/blocks/pricing-2`
- Then 定价数据从 frontmatter props 传入，页面行数减少 >30%

---

### T-005: Replace FAQ Page (faq.astro)
**Status**: [ ] Not Started
**Satisfies ACs**: AC-US4-01, AC-US4-02
**US**: US-004

**Test Plan**:
- Given `pages/faq.astro` 包含手写 FAQ section
- When 重构为使用 `@/components/blocks/faqs-1`
- Then FAQ 数据从 frontmatter props 传入，页面行数减少 >30%

---

### T-006: Replace Contact Page (contact.astro)
**Status**: [ ] Not Started
**Satisfies ACs**: AC-US5-01
**US**: US-005

**Test Plan**:
- Given `pages/contact.astro` 包含手写 contact form
- When 重构为使用 `@/components/blocks/contact-1`
- Then 页面行数减少 >30%

---

## Phase 2: Build Verification

### T-007: Build Verification
**Status**: [ ] Not Started
**Satisfies ACs**: AC-US6-01, AC-US6-02
**US**: US-006

**Test Plan**:
- Given 所有 5 个页面已重构
- When 运行 `pnpm exec -- astro build`
- Then 退出码 0，无错误
- When 运行 `pnpm exec -- playwright test e2e/homepage.spec.ts`
- Then E2E 测试通过