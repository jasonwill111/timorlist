# Tasks — Increment 0108: UI Component Library Hardening

## Phase 1: New Components

- [ ] T-101: Create `src/components/ui/EmptyState.astro` with icon, title, description, action slot
- [ ] T-102: Create `src/components/ui/PageHeader.astro` with title, description, actions slot
- [ ] T-103: Create `src/components/ui/ConfirmDialog.astro` with id, title, message, variant
- [ ] T-104: Verify all three new components compile (`pnpm build`)

## Phase 2: Input Enhancement

- [ ] T-201: Audit `src/components/ui/Input.astro` for password type support
- [ ] T-202: Add `type: 'password'` to Props interface if missing
- [ ] T-203: Test password input renders without warnings

## Phase 3: Tabs API Verification

- [ ] T-301: Audit Tabs.astro, TabsList.astro, TabsTrigger.astro, TabsContent.astro
- [ ] T-302: Add usage example as comment to Tabs.astro
- [ ] T-303: Document Props for each tabs component

## Phase 4: Component API Audit

- [ ] T-401: Audit all 18 components in src/components/ui/ for consistent API
- [ ] T-402: All components use `class?: string` for className override
- [ ] T-403: All components use `data-slot` for shadcn compatibility
- [ ] T-404: Document any inconsistencies for future increment

## Phase 5: Verification

- [ ] T-501: `pnpm build` exits 0
- [ ] T-502: Visual smoke test: render each new component in admin placeholder
- [ ] T-503: No TypeScript errors

## Completion Criteria

- [ ] 3 new components created (EmptyState, PageHeader, ConfirmDialog)
- [ ] Input.astro supports password type
- [ ] Tabs API documented with example
- [ ] All 18 components audited for API consistency
- [ ] `pnpm build` exits 0
