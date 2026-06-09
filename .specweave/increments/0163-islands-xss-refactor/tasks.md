# Tasks: 0163 — Islands XSS 安全重构

---

## US-001: 修复 ListingsIsland XSS 漏洞

### T-001: ListingsIsland 添加 escapeHtml helper
**Satisfies ACs**: AC-0163-US1-02
**Status**: [x] completed
**Test**: Given `escapeHtml()` function → When called with `'<script>'` → Then returns `'&lt;script&gt;'`
**Files**: `src/components/islands/admin/ListingsIsland.astro`
**Commit**: a8f3a456

### T-002: ListingsIsland tbody 清空改用 textContent
**Satisfies ACs**: AC-0163-US1-03
**Status**: [x] completed
**Test**: Given `tbody.innerHTML = ''` → When reviewed → Then replaced with `tbody.textContent = ''`
**Files**: `src/components/islands/admin/ListingsIsland.astro`
**Commit**: a8f3a456

### T-003: ListingsIsland innerHTML 循环 → DOM API
**Satisfies ACs**: AC-0163-US1-01, AC-0163-US1-04
**Status**: [x] completed
**Test**: Given `filtered.map(listing => \`<tr>${listing.title}</tr>\`)` → When rendered → Then DOM construction with textContent used
**Files**: `src/components/islands/admin/ListingsIsland.astro`
**Change**: Template string innerHTML → `createElement` + `textContent` + `setAttribute` for all user data fields
**Commit**: a8f3a456

---

## US-002: 修复 ReviewsIsland XSS 漏洞

### T-004: ReviewsIsland 空状态 innerHTML → textContent
**Satisfies ACs**: AC-0163-US2-02
**Status**: [x] completed
**Test**: Given `container.innerHTML = '<p>No reviews found</p>'` → When reviewed → Then replaced with DOM API
**Files**: `src/components/islands/admin/ReviewsIsland.astro`
**Commit**: a8f3a456

### T-005: ReviewsIsland review 渲染 innerHTML → DOM API
**Satisfies ACs**: AC-0163-US2-01
**Status**: [x] completed
**Test**: Given `reviewDiv.innerHTML = \`...${review.comment}...${review.userName}...\`` → When rendered → Then DOM construction with textContent used
**Files**: `src/components/islands/admin/ReviewsIsland.astro`
**Change**: Template string innerHTML → `createElement` + `textContent` for user data fields
**Commit**: a8f3a456

---

## Verification

### T-006: 全 islands innerHTML 安全审计
**Satisfies ACs**: (全审计报告，见 spec.md)
**Status**: [x] completed
**Test**: Given all `.astro` files in `src/components/islands/` → When `rg '\.innerHTML\s*='` run → Then all matches reviewed and confirmed safe or fixed
**Tool**: `rg '\.innerHTML\s*=' src/components/islands/`
**Result**:
- AIToolsIsland → DOMPurify ✅
- DashboardIsland → sanitize() ✅
- ProductsFormIsland → escapeHtml() + static builders ✅
- ProductsTableIsland → escapeHtml() ✅
- AdBannersIsland → static text ✅
- ListingsIsland → DOM API ✅ FIXED
- ReviewsIsland → DOM API ✅ FIXED

### T-007: TypeScript 检查
**Satisfies ACs**: (build integrity)
**Status**: [x] completed
**Test**: Given `npx tsc --noEmit` → When ListingsIsland and ReviewsIsland checked → Then no new TS errors
**Command**: `npx tsc --noEmit | grep -E "ListingsIsland|ReviewsIsland"`
**Result**: No output (no errors) ✅
