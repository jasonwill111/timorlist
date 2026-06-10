# Tasks: 0159-ui-ux-consistency-audit

---

### T-01: Audit CSS variables usage across all 58 pages
**Satisfies ACs**: AC-0159-US1-01
**Status**: [x] completed
**Test**: Given the 58 pages under `src/pages/` and `src/components/` → When scanning for CSS variable references (`var(--`, custom color tokens, inline `style=` attributes) → Then `ui-consistency-report.md` is generated listing each violating file path and line number, with a count of total violations grouped by variable name

---

### T-02: Audit Button component usage — identify raw `<button>` HTML
**Satisfies ACs**: AC-0159-US1-02
**Status**: [x] completed
**Test**: Given all `.astro` and `.tsx` files in `src/pages/` and `src/components/` → When grepping for `<button` HTML tags not wrapped by `<Button` (Fulldev) → Then the count of raw `<button>` instances is recorded per file, added to `ui-consistency-report.md`, and flagged as violations of AC-0159-US1-02

---

### T-03: Audit form input components — identify raw `<input>`/`<select>`/`<textarea>` HTML
**Satisfies ACs**: AC-0159-US1-03
**Status**: [x] completed
**Test**: Given all `.astro` and `.tsx` files → When grepping for `<input`, `<select`, `<textarea` tags not inside `<Input`, `<Select`, `<Textarea` Fulldev wrappers → Then each raw HTML form element is listed by file and line in `ui-consistency-report.md` with a total count per element type

---

### T-04: Audit spacing consistency — identify hardcoded px values not using Tailwind scale
**Satisfies ACs**: AC-0159-US1-04
**Status**: [x] completed
**Test**: Given all `.astro` and `.tsx` files → When searching for `style="[^"]*px[^"]*"` patterns → Then each match is listed by file and line number in `ui-consistency-report.md`, noting whether it is in a Tailwind `class=` attribute (acceptable) or `style=` attribute (violation)

---

### T-05: Audit dark mode support — identify pages missing `dark:` variants on custom colors
**Satisfies ACs**: AC-0159-US1-05
**Status**: [x] completed
**Test**: Given all `.astro` and `.tsx` files using custom color classes (e.g., `bg-primary`, `text-muted`, `border-border`) → When scanning for these class usages that lack a corresponding `dark:` prefixed sibling → Then a list of files and class names missing `dark:` variants is added to `ui-consistency-report.md`

---

### T-06: Evaluate ProductsIsland.astro — produce refactor recommendation doc
**Satisfies ACs**: AC-0159-US2-01
**Status**: [x] completed
**Test**: Given `src/components/admin/islands/ProductsIsland.astro` (829 lines) → When analyzing its LOC, estimated cyclomatic complexity, responsibility count, and dependency components → Then a `products-island-evaluation.md` is written to `reports/` documenting: current responsibilities, recommended split boundaries, dependency graph, and priority rating (P0/P1/P2)

---

### T-07: Evaluate ServicePackagesIsland.astro — produce refactor recommendation doc
**Satisfies ACs**: AC-0159-US2-02
**Status**: [x] completed
**Test**: Given `src/components/admin/islands/ServicePackagesIsland.astro` (549 lines) → When analyzing its LOC, estimated cyclomatic complexity, responsibility count, and dependency components → Then a `service-packages-island-evaluation.md` is written to `reports/` with the same structure as T-06

---

### T-08: Evaluate remaining 6 admin islands >300 lines — produce consolidated evaluation report
**Satisfies ACs**: AC-0159-US2-03, AC-0159-US2-04
**Status**: [x] completed
**Test**: Given the 6 remaining islands in `src/components/admin/islands/` with line count >300 → When analyzing each island's LOC, estimated cyclomatic complexity, responsibility count, and dependency count → Then `island-split-recommendations.md` is written to `reports/` containing: a 4-column metrics table (file, LOC, complexity, responsibilities, deps) for all 12 islands, and per-island recommendations with P0/P1/P2 priority

---

### T-09: Write UI-UX-consistency-report.md with findings and recommended fixes
**Satisfies ACs**: AC-0159-US1-01, AC-0159-US1-02, AC-0159-US1-03, AC-0159-US1-04, AC-0159-US1-05, AC-0159-US3-01, AC-0159-US3-02
**Status**: [x] completed
**Test**: Given findings from T-01 through T-05 → When consolidating all violations and metrics into `ui-consistency-report.md` and `ui-baseline-metrics.json` → Then `ui-baseline-metrics.json` contains fields: `totalPages`, `totalViolations`, `rawButtonCount`, `rawInputCount`, `hardcodedPxCount`, `missingDarkModeCount`, `cssVariableViolations`; and `ui-consistency-report.md` lists all violations with file path, line number, and recommended fix