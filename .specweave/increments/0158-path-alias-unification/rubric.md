# Increment 0158: Quality Contract Rubric

## Infrastructure Criteria

### R-INF-01: Test coverage [blocking]
- **Evaluator**: sw:grill
- **Verify**: Unit/integration tests exist for all changed import paths; run `npx vitest run` and confirm all pass
- **Threshold**: All test files pass; no regressions in existing tests
- **Result**: [ ] PENDING

### R-INF-02: TypeScript compilation [blocking]
- **Evaluator**: sw:grill
- **Verify**: `pnpm exec -- tsc --noEmit` runs without new path-resolution errors
- **Threshold**: No new `Cannot find module '@components/'` or alias resolution errors introduced by this increment
- **Result**: [ ] PENDING

### R-INF-03: Grep verification [blocking]
- **Evaluator**: sw:grill
- **Verify**: `grep -rn "@components/" src/pages/ src/components/islands/` returns zero results
- **Threshold**: Exact match `@components/` (not `@/components/`) in target directories is 0
- **Result**: [ ] PENDING

### R-INF-04: Minimal diff [blocking]
- **Evaluator**: sw:grill
- **Verify**: `git diff --stat` shows changes only in: 11 alias-fix files, admin/media.astro (pagination), and new component-standards.md
- **Threshold**: No unexpected files modified; diff lines are proportional to alias replacements
- **Result**: [ ] PENDING

### R-INF-05: Independent evaluation [blocking]
- **Evaluator**: sw:grill
- **Verify**: A human reviewer or second AI evaluates the changes and approves the alias replacements as mechanically correct
- **Threshold**: No regressions, no over-editing beyond alias replacement
- **Result**: [ ] PENDING

---

## Functional Correctness Criteria (US-001)

### R-01: No @components/ aliases remain [blocking]
- **Source**: AC-0158-US1-01
- **Evaluator**: sw:grill
- **Verify**: `grep -rn "@components/" src/pages/ src/components/islands/` returns empty; `grep -rn "@/components/" src/pages/ src/components/islands/ | wc -l` returns >= 30
- **Threshold**: All 30 instances replaced across11 files
- **Result**: [ ] PENDING

### R-02: TypeScript path resolution [blocking]
- **Source**: AC-0158-US1-02
- **Evaluator**: sw:grill
- **Verify**: `pnpm exec -- tsc --noEmit 2>&1 | grep -E "Cannot find module|@components"` returns empty
- **Threshold**: Zero new path-resolution errors from alias fixes
- **Result**: [ ] PENDING

### R-03: media.astro pagination componentized [blocking]
- **Source**: AC-0158-US1-03
- **Evaluator**: sw:grill
- **Verify**: `pages/admin/media.astro` source contains `<Pagination` import and usage; no inline `<a>` pagination chain remains
- **Threshold**: Inline pagination `<a>` nodes replaced with Starwind Pagination component
- **Result**: [ ] PENDING

### R-04: Minimal diff enforced [blocking]
- **Source**: AC-0158-US1-04
- **Evaluator**: sw:grill
- **Verify**: `git diff` changes only the alias strings themselves; no reformatting, no import order changes beyond necessary edits
- **Threshold**: Changes are mechanically minimal; no cosmetic or structural changes beyond alias correction
- **Result**: [ ] PENDING

---

## Functional Correctness Criteria (US-002)

### R-05: component-standards.md exists and is non-empty [blocking]
- **Source**: AC-0158-US2-01
- **Evaluator**: sw:grill
- **Verify**: `test -s docs/internal/design-system/component-standards.md && wc -l docs/internal/design-system/component-standards.md` returns >= 30 lines
- **Threshold**: File exists, >= 30 lines of valid content
- **Result**: [ ] PENDING

### R-06: Fulldev priority components listed [blocking]
- **Source**: AC-0158-US2-02
- **Evaluator**: sw:grill
- **Verify**: Document contains all of: button, input, textarea, select, label, Card, Badge — each appearing at least once in the Fulldev section
- **Threshold**: All 7 components present in Fulldev priority section
- **Result**: [ ] PENDING

### R-07: Starwind exclusive components listed [blocking]
- **Source**: AC-0158-US2-03
- **Evaluator**: sw:grill
- **Verify**: Document contains all of: pagination, Dropzone, progress, color-picker, context-menu, dropdown, scroll-area — each appearing at least once in the Starwind exclusive section
- **Threshold**: All 7 components present in Starwind exclusive section
- **Result**: [ ] PENDING

### R-08: Starwind deprecated components documented [blocking]
- **Source**: AC-0158-US2-04
- **Evaluator**: sw:grill
- **Verify**: Document marks Starwind `button` and `input` as deprecated; includes a migration table mapping deprecated components to Fulldev alternatives
- **Threshold**: deprecated keyword present; button and input appear in deprecated list; migration table exists
- **Result**: [ ] PENDING

### R-09: Decision flow present [blocking]
- **Source**: AC-0158-US2-05
- **Evaluator**: sw:grill
- **Verify**: Document contains a named decision flow, algorithm, or step-by-step process for choosing between Fulldev and Starwind for new code
- **Threshold**: A reader can follow the documented steps to make a component choice without additional context
- **Result**: [ ] PENDING