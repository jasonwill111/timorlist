# Tasks — Increment 0132: PricingCards Data Layer Split

## Phase A: Data Layer Extraction
- [x] T-001: Create `src/lib/data/pricing-fallback.ts` with fallback data + type
- [x] T-002: Create `src/lib/db/queries/pricing.ts` with `getCategorizedPricingPlans()`
- [x] T-003: Refactor `src/components/islands/PricingCards.astro` to use new query
- [x] T-004: Remove inline DB query, fallback data, parse logic from component
- [x] T-005: `pnpm build` exits 0
- [x] T-006: /pricing page renders identically

## Summary

- 428 行 → ~10 行 frontmatter（数据逻辑移到 lib/）
- 真正的 UI/UX vs 业务代码分离
- Fallback 数据独立可测试

## Definition of Done
- [x] PricingCards frontmatter 极简化
- [x] 数据逻辑在 lib/
- [x] Build exit 0
- [x] 无视觉回归
