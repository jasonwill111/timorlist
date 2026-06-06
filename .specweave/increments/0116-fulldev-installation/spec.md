---
increment: 0116-fulldev-installation
title: "Fulldev UI 完整安装 + 基础组件替换"
type: refactor
priority: P1
status: in_progress
created: 2026-06-05
depends_on: 0115-design-tokens
epic: 0103
domains: ["frontend", "ui-library"]
risk: medium
estimated_hours: 6
test_mode: build + playwright
---

# Increment 0116: Fulldev UI Full Installation

## Goal

Install all 55 Fulldev UI components and replace 8 hand-built components (Button, Input, Select, Textarea, Card, Badge, Avatar, Label) with Fulldev equivalents.

## Tasks

### T-101: Install all 55 Fulldev components
- [ ] Run `npx shadcn@latest add @fulldev/components -y --overwrite`
- [ ] Verify all 55 component files created in `src/components/ui/`
- [ ] Run `pnpm build` exits 0

### T-102: Replace Button.astro
- [ ] Read `src/components/ui/Button.astro` (hand-built) and Fulldev's `button.astro`
- [ ] Compare props: variant, size, type, class
- [ ] Find all 67 files using `<Button`
- [ ] Update import path: from `Button` to `button` (lowercase)
- [ ] Update import: `import Button from '@components/ui/Button.astro'` → `import { Button } from '@components/ui/button'`
- [ ] Run `pnpm build` exits 0
- [ ] Visual spot check 5 pages

### T-103: Replace Input.astro
- [ ] Compare hand-built vs Fulldev Input
- [ ] Update 47 files
- [ ] Run `pnpm build` exits 0

### T-104: Replace Select.astro
- [ ] Update 30 files
- [ ] Build verification

### T-105: Replace Textarea.astro
- [ ] Update 19 files
- [ ] Build verification

### T-106: Replace Card.astro
- [ ] Update Card + 5 subcomponents
- [ ] Build verification

### T-107: Replace Badge.astro
- [ ] Update 2 pages
- [ ] Build verification

### T-108: Replace Avatar.astro + Label.astro
- [ ] Update files
- [ ] Build verification

### T-109: Final verification
- [ ] All 20 production pages return 200
- [ ] Playwright visual check on 5 pages
- [ ] Component reuse rate: 30% → 60%

## Acceptance Criteria

- 32 → ~87 UI components
- 8 hand-built components replaced
- `pnpm build` passes
- All 20 pages 200
- No visual regression

## Risk

**MEDIUM** — Replacing components could break existing styles if props don't match exactly.

## Files Affected

- `src/components/ui/*` (Fulldev files added)
- `src/components/ui/Button.astro` → delete (replaced by Fulldev)
- `src/components/ui/Input.astro` → delete
- `src/components/ui/Select.astro` → delete
- `src/components/ui/Textarea.astro` → delete
- `src/components/ui/Card.astro` → delete (+5 sub)
- `src/components/ui/Badge.astro` → delete
- `src/components/ui/Avatar.astro` → delete
- `src/components/ui/Label.astro` → delete
- 50+ consumer files (import path updates)
