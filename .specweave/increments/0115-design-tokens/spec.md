---
increment: 0115-design-tokens
title: "设计 Token 基础层（Layer 2）"
type: foundation
priority: P1
status: in_progress
created: 2026-06-05
depends_on: 0114-typography-refactor
epic: 0103
domains: ["frontend", "design-system"]
risk: low
estimated_hours: 2
test_mode: build + visual
---

# Increment 0115: Design Token Foundation Layer

## Goal

Establish the single source of truth for all design tokens (CSS variables) that will be shared between Fulldev UI and Starwind UI libraries. This is Layer 2 of the 3-layer defense strategy.

## Background

The project will integrate Fulldev UI (55 components) and Starwind UI (51 components). Both libraries use Tailwind v4 + CSS variables, but with different default token names. Without a unified token layer, the result will be "3 different designers worked on this" (per document AD section).

## 3-Layer Defense Strategy

1. **Layer 1: 物理隔离** — `src/components/ui/` (Fulldev) + `src/components/starwind/` (Starwind) + `src/components/custom/` (Wrapper)
2. **Layer 2: Token 统一** — Single @theme block in `src/styles/globals.css`
3. **Layer 3: Wrapper API** — Custom components in `src/components/custom/` (Increment 0120)

## Tasks

### T-001: Design Token Restructure
- [ ] Read current `src/styles/globals.css`
- [ ] Restructure @theme block with semantic tokens:
  - Colors: --color-primary-50 to --color-primary-900
  - Spacing: --space-1 to --space-8 (4px grid)
  - Radius: --radius-sm/md/lg/full
  - Shadow: --shadow-sm/md/lg
  - Duration: --duration-fast/normal/slow
  - Easing: --ease-out/in-out
- [ ] Preserve existing Plus Jakarta Sans + Sora fonts
- [ ] Preserve existing color palette (yellow theme)
- [ ] Add @layer base aliases for Fulldev and Starwind

### T-002: Install Fulldev UI base
- [ ] Create `components.json` (shadcn CLI config)
- [ ] Run `npx shadcn@latest add @fulldev/init -y --overwrite`
- [ ] Verify Fulldev base tokens don't conflict
- [ ] Run `pnpm build` exits 0

### T-003: Install Starwind UI base
- [ ] Run `npx starwind@latest init`
- [ ] Verify Starwind base tokens don't conflict
- [ ] Run `pnpm build` exits 0

### T-004: Verification
- [ ] Visual comparison: before vs after (screenshots)
- [ ] No visual regression on 20 production pages
- [ ] All existing functionality preserved

## Acceptance Criteria

- `pnpm build` exits 0
- All 20 production pages return 200
- Visual diff: 0 changes
- Both library init scripts executed successfully
- Token system documented in CSS comments

## Risk

**LOW** — Only adds tokens, doesn't replace any existing styles. Both libraries are designed to coexist with existing styles.

## Files Affected

- `src/styles/globals.css` (primary)
- `package.json` (new dependencies)
- `components.json` (new)
- `astro.config.mjs` (possibly minor)

## Out of Scope

- Replacing any existing hand-built components (Increment 0116)
- Block template adoption (Increment 0118)
- DOM API refactor (Increment 0119)
- Wrapper layer (Increment 0120)
