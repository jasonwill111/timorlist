# Tasks — Increment 0115: Design Token Foundation

## Phase 0: Preparation

- [x] T-000: Create increment directory and spec.md
- [x] T-000: Read current `src/styles/globals.css`
- [x] T-000: Capture baseline screenshots of 5 representative pages

## Phase 1: Token Restructure

### T-001: Design Token Restructure
- [ ] Read current globals.css
- [ ] Add semantic token system to @theme block
- [ ] Add @layer base aliases for Fulldev + Starwind
- [ ] Preserve existing color palette (yellow)
- [ ] Preserve existing typography (Plus Jakarta Sans + Sora)
- [ ] Document tokens in code comments

### T-002: Verify build after token restructure
- [ ] Run `pnpm build` exits 0
- [ ] Check no visual changes
- [ ] Commit

## Phase 2: Install Fulldev

### T-003: Create components.json
- [ ] Set up shadcn CLI config pointing to @fulldev registry
- [ ] Use base-vega style, lucide icons

### T-004: Run Fulldev init
- [ ] Run `npx shadcn@latest add @fulldev/init -y --overwrite`
- [ ] Verify Fulldev base tokens
- [ ] Run `pnpm build` exits 0

### T-005: Visual verification
- [ ] Compare baseline vs current screenshots
- [ ] No visual changes

## Phase 3: Install Starwind

### T-006: Run Starwind init
- [ ] Run `npx starwind@latest init`
- [ ] Verify Starwind base tokens
- [ ] Run `pnpm build` exits 0

### T-007: Visual verification
- [ ] Compare baseline vs current screenshots
- [ ] No visual changes

## Phase 4: Final Verification

### T-008: Full test
- [ ] 20 production pages all 200
- [ ] Build passes
- [ ] No console errors
- [ ] All commits clean

## Completion Criteria

- [ ] All tasks done
- [ ] `pnpm build` passes
- [ ] 20 pages return 200
- [ ] Visual diff: 0 changes
- [ ] Ready for Increment 0116
