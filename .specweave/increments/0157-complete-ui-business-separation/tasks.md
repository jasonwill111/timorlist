# Tasks: 0157-complete-ui-business-separation

## T-001: 创建 HiddenField 组件
**AC**: AC-US4-01 | **Status**: [x] completed | **Model**: haiku
**Test**: Given `<HiddenField name="token" value="abc" />` → When page renders → Then `<input type="hidden" name="token" value="abc" />` in DOM
**Files**: `src/components/ui/HiddenField.astro`

## T-002: 创建 OperatingHoursIsland
**AC**: AC-US1-01, AC-US1-02 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given `days=[{day:"Monday",open:"09:00",close:"17:00",isClosed:false}]` → When rendered → Then Astro map renders 7 rows with Checkbox + time inputs
**Files**: `src/components/islands/business/OperatingHoursIsland.astro`
**Dependencies**: T-001

## T-003: 替换 business/edit operating hours section
**AC**: AC-US1-03, AC-US1-04 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given Astro dev server running → When GET /business/timor/edit → Then operating hours render via OperatingHoursIsland, `grep innerHTML` in that section = 0
**Files**: `src/pages/business/[slug]/edit/index.astro`
**Dependencies**: T-002

## T-004: 创建 AdminListRow 组件
**AC**: AC-US2-01 | **Status**: [x] completed | **Model**: haiku
**Test**: Given `<AdminListRow id="1" name="Test" status="active" />` → When rendered → Then `<tr>` with name text + 2 `<Button>` elements
**Files**: `src/components/ui/admin/AdminListRow.astro`

## T-005: 替换 ListingsIsland 动态行
**AC**: AC-US2-02, AC-US2-03 | **Status**: [x] completed | **Model**: sonnet
**Test**: Given ListingsIsland → When admin/listings renders → Then template literal replaced with `listings.map(l => <AdminListRow ...>)`
**Files**: `src/components/islands/admin/ListingsIsland.astro`
**Dependencies**: T-004

## T-006: 替换 ProductsIsland/BlogsIsland 动态行
**AC**: AC-US2-02, AC-US2-03 | **Status**: [x] completed | **Model**: sonnet
**Test**: Same pattern as T-005
**Files**: `src/components/islands/admin/ProductsIsland.astro`, `BlogsIsland.astro`
**Dependencies**: T-004

## T-007: 替换 login.astro checkbox
**AC**: AC-US3-01, AC-US3-02 | **Status**: [x] completed | **Model**: haiku
**Test**: Given login page → When render → Then `<Checkbox>` used instead of raw `<input type="checkbox">`
**Files**: `src/pages/login.astro`

## T-008: 替换 business pages hidden inputs
**AC**: AC-US4-02, AC-US4-03 | **Status**: [x] completed | **Model**: haiku
**Test**: Given business/edit and product pages → When render → Then `<HiddenField>` used for all type="hidden" inputs
**Files**: `src/pages/business/[slug]/edit/index.astro`, `product/new/index.astro`, `product/[id]/edit/index.astro`

## T-009: Build 验证
**AC**: AC-US1-04, AC-US2-04, AC-US3-02, AC-US4-03, AC-US5-01, AC-US5-02, AC-US5-03, AC-US5-04 | **Status**: [x] completed | **Model**: haiku
**Test**: Given all changes → When `pnpm exec -- astro build` → Then exit 0 AND all grep checks pass (0 schema imports, 0 db.prepare, 0 innerHTML in pages)
**Dependencies**: T-003, T-005, T-006, T-007, T-008
