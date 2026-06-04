# TimorUp Migration Project - Master Plan Summary

**Project**: TimorUp Full-Stack Migration  
**Date**: 2026-06-04  
**Total Increments**: 6  
**Estimated Duration**: 6 weeks

---

## Migration Strategy

### Why 6 Increments?

| Reason | Explanation |
|--------|-------------|
| **Risk Mitigation** | Each increment is independently deployable with rollback |
| **Visual Safety** | UI migrations include screenshot comparison verification |
| **Business Continuity** | No feature removal, only refactoring |
| **Incremental Value** | Each increment delivers measurable value |
| **Feedback Loop** | Early increments catch issues before high-risk changes |

### Safety Measures

1. **Security First**: Increment 0103 deploys critical security fixes immediately
2. **Backend Foundation**: Increment 0104 refactors lib without any UI changes
3. **Gradual UI Migration**: Batch 1 (safe) → Batch 2 (high impact)
4. **Verification Per Increment**: Build + API tests + E2E tests + visual comparison

---

## Increment Overview

| # | Increment | Tasks | Duration | Risk | Key Deliverables |
|---|----------|-------|----------|------|------------------|
| **0103** | Security Fixes | 7 | 1-2 days | MEDIUM | 3 security holes fixed |
| **0104** | Lib Consolidation | 12 | 2-3 days | LOW | Foundation layer cleaned |
| **0105** | UI Batch 1 | 8 | 2-3 days | LOW | Badge, Skeleton, Textarea, Label, Select, Avatar |
| **0106** | UI Batch 2 | 10 | 3-4 days | MEDIUM | Button, Card + domain logic extraction |
| **0107** | Actions Consolidation | 10 | 3-4 days | MEDIUM | Backend duplications eliminated |
| **0108** | DB + Modal Migration | 10 | 4-5 days | HIGH | Generic queries + Modal refactor |

---

## What Each Increment Achieves

### 0103: Security Fixes (CRITICAL)
```
✅ Fix: api/admin/skus - No auth check
✅ Fix: api/products - Client isAdmin bypass  
✅ Fix: api/products/[id] - Client isAdmin bypass
🔒 Security: 0 vulnerabilities (was 3)
```

### 0104: Lib Consolidation (Foundation)
```
✅ Result type: Single canonical implementation
✅ Sanitization: Single canonical escaping
✅ Env access: Single canonical module
✅ API helpers: Shared across all endpoints
📁 Files deleted: 5
📉 LoC reduced: ~400
```

### 0105: UI Batch 1 (Safe Components)
```
✅ Badge.astro → @fulldev/badge
✅ Skeleton.astro → @fulldev/skeleton  
✅ Textarea.astro → @fulldev/textarea
✅ Label.astro → @fulldev/label
✅ Select.astro → @fulldev/native-select (wrapper)
✅ Avatar.astro → @fulldev/avatar
📁 Files deleted: 5
📉 LoC reduced: ~300
```

### 0106: UI Batch 2 + Domain Extraction (HIGH IMPACT)
```
✅ Button.astro → @fulldev/button (with loading wrapper)
✅ Card family → @fulldev/card
✅ BusinessCard.astro → Extracted domain logic
✅ ListingCard.astro → Extracted domain logic
✅ ProductCard.astro → Extracted domain logic
📁 Files deleted: 7
📉 LoC reduced: ~450
🔧 Domain logic: ~200 lines to lib/ui/
```

### 0107: Actions Consolidation (Backend Logic)
```
✅ lib/rating.ts - Rating recalc extracted
✅ adBanners - Single CRUD path
✅ servicePackages - Re-export removed
✅ Auth logic - Consolidated
✅ Listings - Merged split files
✅ setRole - Merged split files
📁 Files deleted: 5
📉 LoC reduced: ~350
```

### 0108: DB + Modal Migration (Advanced)
```
✅ entity.ts - Generic query module
✅ FormField.astro - Label+Input+Error composition
✅ Modal.astro → @fulldev/dialog (reactive state)
✅ Islands audit - @fulldev/blocks replacement
📁 Files deleted: 6
📉 LoC reduced: ~250
```

---

## Expected Outcomes

### Code Quality

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| UI Components LoC | ~800 | ~250 | **-69%** |
| Lib Duplications | 15+ | 0 | **-100%** |
| Action Duplications | 7 groups | 0 | **-100%** |
| Security Issues | 3 | 0 | **-100%** |
| Total LoC Reduction | - | - | **~1,500** |

### Development Efficiency

| Task | Before | After | Improvement |
|------|--------|-------|-------------|
| Add new UI variant | 2 hours | 5 min | **95%** |
| Fix accessibility bug | 1 hour | 0 min | **100%** |
| Add dark mode support | 30 min | 0 min | **100%** |
| Fix domain logic bug | 45 min | 10 min | **78%** |
| Understand component | 200 LoC | 80 LoC | **60%** |

### Maintainability

| Aspect | Before | After |
|--------|--------|-------|
| Color configuration | 4 files | 1 file (card-colors.ts) |
| URL building | 3 components | 1 file (card-helpers.ts) |
| Image resolution | 3 implementations | 1 file (image-utils.ts) |
| Result types | 3 definitions | 1 file (result.ts) |
| Escape functions | 3 implementations | 1 file (sanitize.ts) |

---

## Verification Checklist (Per Increment)

### Pre-Deployment

```bash
# 1. Build passes
pnpm build

# 2. TypeScript check
pnpm tsc --noEmit

# 3. API smoke tests
for endpoint in /api/products /api/business /api/auth /api/listings; do
  curl -sf https://timorup.jasonwill.workers.dev$endpoint || exit 1
done

# 4. E2E tests
node e2e-test.cjs

# 5. Visual regression (UI increments only)
node screenshot.cjs --dir current
node compare-screenshots.cjs --baseline baseline --current current
```

### Post-Deployment

```bash
# 1. Production smoke tests
curl -sf https://timorup.jasonwill.workers.dev/ | head -1
curl -sf https://timorup.jasonwill.workers.dev/businesses | head -1

# 2. Login flow test
node login-test.cjs

# 3. Business flow test
node business-flow-test.cjs
```

---

## Rollback Strategy

### Immediate Rollback (if critical issue)

```bash
# Identify last good commit
git log --oneline -10

# Rollback to previous increment
git checkout increment-0102  # or whatever was last good
npx wrangler deploy --env production
```

### Feature Flag Rollback (if subtle issue)

```bash
# In wrangler.jsonc
[vars]
ENABLE_NEW_BUTTON = "false"  # Revert specific component

# Deploy
npx wrangler deploy
```

### Per-Component Rollback

```astro
<!-- Use feature flag for component-level control -->
{import.meta.env.ENABLE_NEW_BUTTON === 'true' 
  ? <NewButton />
  : <OldButton />
}
```

---

## Timeline

```
Week 1:
├── Monday-Tuesday:  0103 Security Fixes
└── Wednesday-Friday: 0104 Lib Consolidation

Week 2:
├── Monday-Thursday: 0105 UI Batch 1
└── Friday: Buffer day

Week 3:
├── Monday-Thursday: 0106 UI Batch 2
└── Friday: Buffer day

Week 4:
├── Monday-Thursday: 0107 Actions Consolidation
└── Friday: Buffer day

Week 5:
├── Monday-Friday: 0108 DB + Modal Migration

Week 6:
├── Buffer for issues
├── Final verification
└── Documentation update
```

---

## Go/No-Go Criteria

### Per Increment Decision Points

| Criterion | Threshold | Action if Failed |
|-----------|-----------|------------------|
| Build | `pnpm build` exits 0 | HALT, fix |
| API tests | All endpoints respond | HALT, fix |
| E2E tests | 14/14 pass | HALT, fix |
| Visual diff | < 5% | INVESTIGATE |
| Performance | Lighthouse > 80 | INVESTIGATE |

### Rollback Triggers

- **Immediate**: Security issue, data loss, complete breakage
- **Investigate**: Visual diff > 10%, performance drop > 20%
- **Monitor**: Minor diff < 5%, no functional impact

---

## Next Steps

1. **Approve plan** - User approves migration strategy
2. **Start 0103** - Begin with security fixes (critical)
3. **Sequential execution** - Each increment builds on previous
4. **Verification** - Each increment includes full test suite
5. **Documentation** - Update docs after each increment

---

## Related Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Full Analysis | `docs/FULL-STACK-MIGRATION-ANALYSIS.md` | Detailed technical analysis |
| Master Plan | `docs/MIGRATION-MASTER-PLAN.md` | Comprehensive migration plan |
| Increment Specs | `.specweave/increments/01XX-*/` | Per-increment specifications |

---

*Generated by TimorUp AI Assistant*  
*Version: 1.0*  
*Date: 2026-06-04*