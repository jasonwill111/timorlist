# Quality Rubric: 0159-ui-ux-consistency-audit

## Functional Correctness

### R-001: CSS Variables Consistency Report [blocking]
- **Source**: AC-0159-US1-01
- **Evaluator**: sw:grill
- **Verify**: `reports/ui-consistency-report.md` exists and lists all pages using non-standard colors with file paths and line numbers
- **Threshold**: Every entry includes file path and line number; violations grouped by variable name with counts
- **Result**: [ ] PENDING

### R-002: Button Component Usage Report [blocking]
- **Source**: AC-0159-US1-02
- **Evaluator**: sw:grill
- **Verify**: Report lists all raw `<button>` HTML tags across 58 pages with file and line; total violation count recorded
- **Threshold**: Count of raw `<button>` instances per file is accurate within 5% variance verified by sampling
- **Result**: [ ] PENDING

### R-003: Form Input Component Usage Report [blocking]
- **Source**: AC-0159-US1-03
- **Evaluator**: sw:grill
- **Verify**: Report lists all raw `<input>`/`<select>`/`<textarea>` tags not wrapped by Fulldev components, per file with line numbers
- **Threshold**: Count per element type is accurate; each entry has file path and line number
- **Result**: [ ] PENDING

### R-004: Spacing Consistency Report [blocking]
- **Source**: AC-0159-US1-04
- **Evaluator**: sw:grill
- **Verify**: Report lists all `style=".*px"` violations across all `.astro` and `.tsx` files with file and line numbers
- **Threshold**: Every violation has file path and line number; violations in `style=` (not `class=`) clearly marked as violations
- **Result**: [ ] PENDING

### R-005: Dark Mode Support Report [blocking]
- **Source**: AC-0159-US1-05
- **Evaluator**: sw:grill
- **Verify**: Report lists pages using custom color classes that lack `dark:` variant, per file with class name
- **Threshold**: Each missing `dark:` instance has file path, class name, and recommended fix
- **Result**: [ ] PENDING

### R-006: ProductsIsland.astro Evaluation Doc [blocking]
- **Source**: AC-0159-US2-01
- **Evaluator**: sw:grill
- **Verify**: `reports/products-island-evaluation.md` exists with: responsibilities, split boundaries, dependency graph, P0/P1/P2 priority
- **Threshold**: All 4 sections present; priority rating is P0/P1/P2; split boundaries are actionable
- **Result**: [ ] PENDING

### R-007: ServicePackagesIsland.astro Evaluation Doc [blocking]
- **Source**: AC-0159-US2-02
- **Evaluator**: sw:grill
- **Verify**: `reports/service-packages-island-evaluation.md` exists with same structure as R-006
- **Threshold**: All 4 sections present; priority rating is P0/P1/P2; split boundaries are actionable
- **Result**: [ ] PENDING

### R-008: Consolidated Islands Evaluation Report [blocking]
- **Source**: AC-0159-US2-03, AC-0159-US2-04
- **Evaluator**: sw:grill
- **Verify**: `reports/island-split-recommendations.md` contains: metrics table for all 12 islands (file, LOC, complexity, responsibilities, deps), per-island recommendations with P0/P1/P2 priority
- **Threshold**: 12 islands all present in table; all 5 columns populated; each island has a recommendation with priority
- **Result**: [ ] PENDING

### R-009: UI Baseline Metrics JSON [blocking]
- **Source**: AC-0159-US3-01, AC-0159-US3-02
- **Evaluator**: sw:grill
- **Verify**: `reports/ui-baseline-metrics.json` exists with fields: totalPages, totalViolations, rawButtonCount, rawInputCount, hardcodedPxCount, missingDarkModeCount, cssVariableViolations
- **Threshold**: All 7 fields present; values are non-null integers; file is valid JSON parseable by subsequent increments
- **Result**: [ ] PENDING

## Infrastructure

### R-010: Deliverables Complete [blocking]
- **Source**: spec.md Deliverables table
- **Evaluator**: sw:grill
- **Verify**: All 4 deliverable files exist in `.specweave/increments/0159-ui-ux-consistency-audit/reports/`: `ui-consistency-report.md`, `island-split-recommendations.md`, `ui-baseline-metrics.json`, and the two island-specific evaluation docs
- **Threshold**: All 4 files exist and are non-empty (> 100 bytes each)
- **Result**: [ ] PENDING

### R-011: Violations Include Line Numbers [blocking]
- **Source**: spec.md Success Criteria item 2
- **Evaluator**: sw:grill
- **Verify**: Every violation entry in `ui-consistency-report.md` includes a file path and line number
- **Threshold**: Zero violation entries missing file path or line number; spot-checked at 10% sample
- **Result**: [ ] PENDING

### R-012: Island Priority Ratings [blocking]
- **Source**: spec.md Success Criteria item 3
- **Evaluator**: sw:grill
- **Verify**: All island recommendations in `island-split-recommendations.md` carry a P0/P1/P2 priority label
- **Threshold**: 100% of island recommendations have a priority label; no unlabeled entries
- **Result**: [ ] PENDING

### R-013: Baseline JSON Is Parseable by Subsequent Increments [advisory]
- **Source**: AC-0159-US3-02
- **Evaluator**: sw:grill
- **Verify**: `ui-baseline-metrics.json` is valid JSON and all numeric fields are non-negative integers
- **Threshold**: `node -e "JSON.parse(require(""fs"").readFileSync(""reports/ui-baseline-metrics.json"",""utf8""))"` exits 0 with no errors
- **Result**: [ ] PENDING
