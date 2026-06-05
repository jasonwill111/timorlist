---
increment: 0108-ui-component-hardening
title: "UI Component Library Hardening"
type: refactor
priority: P1
status: pending
created: 2026-06-04
structure: user-stories
test_mode: manual-e2e
project: TimorUp
production: https://timorup.jasonwill.workers.dev
---

# Refactor: UI Component Library Hardening

## User Stories

### US-1: EmptyState Component
- [ ] src/components/ui/EmptyState.astro created
- [ ] Props: icon?, title, description?, action? (slot)
- [ ] pnpm build exits 0

### US-2: PageHeader Component
- [ ] src/components/ui/PageHeader.astro created
- [ ] Props: title, description?, actions? (slot)
- [ ] pnpm build exits 0

### US-3: ConfirmDialog Component
- [ ] src/components/ui/ConfirmDialog.astro created
- [ ] Props: id, title, message, confirmText?, cancelText?, variant?
- [ ] pnpm build exits 0

### US-4: Input Password Support
- [ ] Input.astro accepts type: 'password'
- [ ] No browser console warnings
- [ ] pnpm build exits 0

### US-5: Tabs API Documentation
- [ ] Tabs.astro + family documented with example
- [ ] pnpm build exits 0

## Risk
Low: only adds new components, no breaking changes.
