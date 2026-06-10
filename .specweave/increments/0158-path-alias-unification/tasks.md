# Increment 0158:路径别名统一 + 组件分工规范建立 — Tasks

---

### T-01: Fix path aliases in pages/admin/ai-tools.astro
**Satisfies ACs**: AC-0158-US1-01, AC-0158-US1-04
**Status**: [x] completed
**Test**: Given `pages/admin/ai-tools.astro` contains 5 instances of `@components/` → When running `grep -rn "@components/" pages/admin/ai-tools.astro` → Then result is empty and `grep -rn "@/components/" pages/admin/ai-tools.astro` returns 5 lines

---

### T-02: Fix path aliases in pages/admin/login.astro
**Satisfies ACs**: AC-0158-US1-01, AC-0158-US1-04
**Status**: [x] completed
**Test**: Given `pages/admin/login.astro` contains 1 instance of `@components/` → When running `grep -rn "@components/" pages/admin/login.astro` → Then result is empty and the import line uses `@/components/`

---

### T-03: Fix path aliases in pages/admin/media.astro
**Satisfies ACs**: AC-0158-US1-01, AC-0158-US1-04
**Status**: [x] completed
**Test**: Given `pages/admin/media.astro` contains 1 instance of `@components/` → When running `grep -rn "@components/" pages/admin/media.astro` → Then result is empty and `grep -rn "@/components/" pages/admin/media.astro` shows the corrected import

---

### T-04: Fix path aliases in pages/admin/settings.astro
**Satisfies ACs**: AC-0158-US1-01, AC-0158-US1-04
**Status**: [x] completed
**Test**: Given `pages/admin/settings.astro` contains 1 instance of `@components/` → When running `grep -rn "@components/" pages/admin/settings.astro` → Then result is empty and the import line uses `@/components/`

---

### T-05: Fix path aliases in pages/business/[slug]/product/[id]/edit/index.astro
**Satisfies ACs**: AC-0158-US1-01, AC-0158-US1-04
**Status**: [x] completed
**Test**: Given `pages/business/[slug]/product/[id]/edit/index.astro` contains 5 instances of `@components/` → When running `grep -rn "@components/" pages/business/` → Then result is empty for that file and `grep -rn "@/components/"` confirms 5 corrected imports

---

### T-06: Fix path aliases in pages/business/[slug]/product/[id]/index.astro
**Satisfies ACs**: AC-0158-US1-01, AC-0158-US1-04
**Status**: [x] completed
**Test**: Given `pages/business/[slug]/product/[id]/index.astro` contains 1 instance of `@components/` → When running `grep -rn "@components/" pages/business/[slug]/product/[id]/index.astro` → Then result is empty and the import uses `@/components/`

---

### T-07: Fix path aliases in pages/business/[slug]/product/new/index.astro
**Satisfies ACs**: AC-0158-US1-01, AC-0158-US1-04
**Status**: [x] completed
**Test**: Given `pages/business/[slug]/product/new/index.astro` contains 5 instances of `@components/` → When running `grep -rn "@components/" pages/business/[slug]/product/new/index.astro` → Then result is empty and 5 `@/components/` imports are present

---

### T-08: Fix path aliases in pages/contact.astro
**Satisfies ACs**: AC-0158-US1-01, AC-0158-US1-04
**Status**: [x] completed
**Test**: Given `pages/contact.astro` contains 4 instances of `@components/` → When running `grep -rn "@components/" pages/contact.astro` → Then result is empty and 4 `@/components/` imports are confirmed

---

### T-09: Fix path aliases in pages/faq.astro
**Satisfies ACs**: AC-0158-US1-01, AC-0158-US1-04
**Status**: [x] completed
**Test**: Given `pages/faq.astro` contains 1 instance of `@components/` → When running `grep -rn "@components/" pages/faq.astro` → Then result is empty and the import uses `@/components/`

---

### T-10: Fix path aliases in components/islands/admin/LoginIsland.astro
**Satisfies ACs**: AC-0158-US1-01, AC-0158-US1-04
**Status**: [x] completed
**Test**: Given `components/islands/admin/LoginIsland.astro` contains 3 instances of `@components/` → When running `grep -rn "@components/" components/islands/admin/LoginIsland.astro` → Then result is empty and 3 `@/components/` imports are confirmed

---

### T-11: Fix path aliases in components/islands/admin/SettingsIsland.astro
**Satisfies ACs**: AC-0158-US1-01, AC-0158-US1-04
**Status**: [x] completed
**Test**: Given `components/islands/admin/SettingsIsland.astro` contains 3 instances of `@components/` → When running `grep -rn "@components/" components/islands/admin/SettingsIsland.astro` → Then result is empty and 3 `@/components/` imports are confirmed

---

### T-12: Create component-standards.md design system document
**Satisfies ACs**: AC-0158-US2-01, AC-0158-US2-02, AC-0158-US2-03, AC-0158-US2-04, AC-0158-US2-05
**Status**: [x] completed
**Test**: Given `docs/internal/design-system/component-standards.md` does not exist → When the document is created with all required sections → Then `test -s docs/internal/design-system/component-standards.md && wc -l docs/internal/design-system/component-standards.md | awk '{print $1}'` returns a value >= 30, and the document contains Fulldev priority components (button, input, textarea, select, label, Card, Badge), Starwind exclusive components (pagination, Dropzone, progress, color-picker, context-menu, dropdown, scroll-area), and a deprecated Starwind section marking button and input as deprecated with a migration table

---

### T-13: Fix admin/media.astro inline pagination to Starwind Pagination component
**Satisfies ACs**: AC-0158-US1-03, AC-0158-US1-04
**Status**: [x] completed
**Test**: Given `pages/admin/media.astro` has inline `<a>` pagination nodes → When the file is updated to use Starwind `Pagination` component → Then the source contains `<Pagination` import and usage, no inline pagination `<a>` chain exists, and `grep -rn "@components/" pages/admin/media.astro` returns empty

---

### T-14: Verify all @components/ aliases fixed
**Satisfies ACs**: AC-0158-US1-01, AC-0158-US1-02
**Status**: [x] completed
**Test**: Given all 11 files have been fixed → When running `grep -rn "@components/" src/pages/ src/components/islands/` and `pnpm exec -- tsc --noEmit 2>&1 | grep -E "Cannot find module|@components"` → Then both grep results are empty, confirming zero `@components/` remaining and no new TypeScript path resolution errors introduced