# Migration Master Plan: TimorUp → @fulldev + Separation of Concerns

**Project**: TimorUp  
**Date**: 2026-06-04  
**Total Tasks**: 66  
**Recommended Increments**: 6 (sequenced for safety)

---

## Increment Strategy

### Guiding Principles

1. **Security First**: Critical security fixes deploy immediately, independently
2. **Visual Regression Prevention**: Each UI migration includes screenshot verification
3. **API Contract Preservation**: No API endpoint signature changes
4. **Business Continuity**: No feature removal, only refactoring
5. **Gradual Migration**: Parallel run where possible (custom vs @fulldev)
6. **Instant Rollback**: Each increment deploys independently with revert capability

### Safety Measures Per Increment

| Measure | Implementation |
|---------|----------------|
| **Visual Regression Testing** | Playwright screenshot comparison before/after |
| **API Contract Tests** | curl tests to verify endpoint responses unchanged |
| **E2E Smoke Tests** | 14-page test suite runs after each increment |
| **Business Flow Verification** | Login, signup, listing creation tested end-to-end |
| **Incremental Rollback** | Git tag per increment, instant revert if issues found |
| **Feature Flags** | Wrangler env for gradual rollout of migrated components |

---

## Increment Breakdown

### Increment 0103: Security Fixes (CRITICAL - Deploy First)

**Status**: Required immediately  
**Duration**: 1-2 days  
**Risk Level**: MEDIUM (but necessary)

#### Tasks (7)

```
T-001: Fix api/admin/skus/index.ts — Add admin auth check
T-002: Fix api/products/index.ts POST — Remove client isAdmin bypass
T-003: Fix api/products/[id].ts PUT/DELETE — Remove client isAdmin bypass
T-004: Verify fixes with curl tests
T-005: Deploy to staging
T-006: Run E2E smoke tests
T-007: Deploy to production
```

#### Safety Verification

```bash
# Before deploy: Test each endpoint
curl -X POST https://timorup.jasonwill.workers.dev/api/products -H "Content-Type: application/json" -d '{}'
# Should return 401 (unauthorized), not 200 with isAdmin bypass

curl https://timorup.jasonwill.workers.dev/api/admin/skus
# Should return 401 (unauthorized), not product data

# After deploy: Verify business flows
node e2e-test.cjs  # All 14 pages should pass
```

#### Rollback Plan

```bash
# If issues found:
git checkout 0102-comprehensive-bug-fixes  # Revert to last stable
npx wrangler deploy --env production  # Re-deploy
```

---

### Increment 0104: Lib Consolidation (Foundation Layer)

**Status**: Low risk, build foundation  
**Duration**: 2-3 days  
**Risk Level**: LOW

#### Tasks (12)

```
T-007: Create src/lib/result.ts — Consolidate Result types
T-008: Create src/lib/sanitize.ts — Consolidate escaping
T-009: Create src/lib/env.ts — Consolidate env access
T-010: Delete duplicate Result from type-utils.ts, queries/result.ts
T-011: Update all imports to new canonical locations
T-042: Create src/lib/api-helpers.ts — jsonResponse, errorResponse
T-043: Create src/lib/api-cache.ts — cacheResponse helpers
T-044: Create src/lib/api-middleware.ts — Rate limit helpers
T-045: Update API endpoints to use new helpers
T-046: Delete duplicate escapeHtml from modal.ts, utils.ts
T-047: Merge type-guards.ts into type-utils.ts
T-048: Delete constants.ts re-export shim
```

#### Safety Verification

```bash
pnpm build  # Must exit 0
node api-test.cjs  # All API endpoints respond correctly
```

#### Impact Assessment

- **No UI changes** — Pure backend refactoring
- **No API contract changes** — Helpers just refactor internals
- **All tests pass** — Build + API smoke tests verify

---

### Increment 0105: UI Component Migration - Batch 1 (Safe Components)

**Status**: Low risk, high reward  
**Duration**: 2-3 days  
**Risk Level**: LOW

#### Components to Migrate (No API changes)

| Component | Files | Migration Pattern |
|-----------|-------|------------------|
| Badge.astro | 3 | Direct swap |
| Skeleton.astro | 2 | Direct swap |
| Textarea.astro | 3 | Direct swap |
| Label.astro | 3 | Direct swap |
| Select.astro | 3 | Wrapper for options prop |

#### Tasks (8)

```
T-018a: Install @fulldev/badge, skeleton, textarea, label, native-select
T-019a: Migrate Badge.astro → @fulldev/badge (3 files)
T-020a: Migrate Textarea.astro → @fulldev/textarea
T-021a: Migrate Label.astro → @fulldev/label
T-022a: Migrate Select.astro → @fulldev/native-select (wrapper)
T-024a: Migrate Avatar.astro → @fulldev/avatar
T-025: Create src/lib/ui/card-colors.ts
T-026: Create src/lib/ui/card-helpers.ts
```

#### Safety Verification

```bash
# Visual regression testing
npx playwright screenshot baseline/
# Make changes
pnpm build && npx wrangler deploy
npx playwright screenshot current/
# Compare: diff should only show expected changes

# E2E verification
node e2e-test.cjs  # All 14 pages should pass
```

#### Visual Comparison Strategy

```javascript
// playwright-visual-test.cjs
const { chromium } = require('playwright');

async function compareScreenshots() {
  const browser = await chromium.launch();
  const pages = [
    'https://timorup.jasonwill.workers.dev/',
    'https://timorup.jasonwill.workers.dev/businesses',
    'https://timorup.jasonwill.workers.dev/register'
  ];
  
  for (const url of pages) {
    await page.goto(url);
    await page.screenshot({ path: `current/${url.replace(/\//g, '_')}.png` });
  }
  
  // Use pixelmatch or difflib to compare
  // Fail if diff > 5% (allow for font rendering variance)
}
```

---

### Increment 0106: UI Component Migration - Batch 2 (Button + Card)

**Status**: Medium risk (high blast radius)  
**Duration**: 3-4 days  
**Risk Level**: MEDIUM

#### Components to Migrate (High Impact)

| Component | Files | Migration Pattern |
|-----------|-------|------------------|
| Button.astro | 17 | Keep as wrapper with loading prop enhancement |
| Card + 5 subcomponents | 11 | Direct swap |

#### Tasks (10)

```
T-018b: Migrate Button.astro → @fulldev/button (add loading prop wrapper)
T-023: Migrate Card family → @fulldev/card
T-019: Verify Button works in all 17 files
T-020: Verify Card works in all 11 files
T-027: Create src/lib/ui/image-utils.ts
T-028: Refactor BusinessCard.astro
T-029: Refactor ListingCard.astro
T-030: Refactor ProductCard.astro
T-031: Refactor BusinessHeaderCard.astro
T-032: Full visual regression test
```

#### Safety Verification

```bash
# Component-by-component verification
for file in $(find src/pages -name "*.astro" | head -5); do
  echo "Testing: $file"
  node test-component.cjs "$file"
done

# Business flow test
node login-test.cjs
node register-test.cjs
node listing-creation-test.cjs
```

#### Parallel Run Strategy (Optional)

```javascript
// src/components/ui/Button.astro (dual mode for safety)
---
// Use @fulldev by default, fallback to custom if issues
const useFulldev = !props.disableFulldev; // Feature flag
---
{useFulldev ? <FulldevButton {...props} /> : <CustomButton {...props} />}
```

```bash
# Gradual rollout via wrangler
wrangler secret put FEATURE_NEW_BUTTON  # Enable for small % of traffic
```

---

### Increment 0107: Backend Actions Consolidation

**Status**: Medium risk (backend logic)  
**Duration**: 3-4 days  
**Risk Level**: MEDIUM

#### Tasks (10)

```
T-035: Create src/lib/rating.ts — Rating recalculation
T-036: Fix DUPE-1: adBanners single CRUD path
T-037: Fix DUPE-2: servicePackages re-export (delete)
T-038: Fix DUPE-3: Auth logic consolidation
T-039: Fix DUPE-4: Rating recalc (use lib/rating.ts)
T-040: Fix DUPE-5: Listings split (merge)
T-041: Fix DUPE-6: setRole split (merge)
T-049: Verify no regressions in actions
T-050: Verify API endpoints still work
T-051: Full E2E test
```

#### Safety Verification

```bash
# Test each action manually
node test-actions.cjs

# API smoke tests
for endpoint in /api/products /api/business /api/auth; do
  curl -s https://timorup.jasonwill.workers.dev$endpoint | head -1
done
```

#### Database Safety

- **No schema changes** — Only refactoring existing queries
- **Read operations only** — Before/after return identical data
- **Transaction where possible** — Ensure atomic updates

---

### Increment 0108: DB Query Templating + Modal Migration (Advanced)

**Status**: High risk (requires careful execution)  
**Duration**: 4-5 days  
**Risk Level**: HIGH

#### Tasks (10)

```
T-052: Create src/lib/db/queries/entity.ts — Generic queries
T-053: Apply to businesses, non_profits, public_sectors
T-054: Create src/lib/db/queries/business-entity.ts
T-055: Create src/components/forms/FormField.astro
T-056: Update auth pages to use FormField
T-057: Install @fulldev/dialog
T-058: Refactor Modal.astro → @fulldev/dialog
T-059: Update all 15+ usage sites
T-060: Test all modal interactions
T-061: Audit islands for @fulldev/blocks replacement
```

#### Safety Verification

```bash
# Modal interaction tests
node test-modals.cjs  # Click all modals, verify open/close

# Form submission tests
node test-forms.cjs  # Submit all forms, verify success

# Island replacement verification
node test-islands.cjs  # Verify data still renders
```

#### Modal Migration Strategy (Detailed)

**Before** (Global state):
```astro
<Modal id="confirm" title="Confirm">
  <p>Are you sure?</p>
  <button onclick="window.hideModal('confirm')">Cancel</button>
</Modal>

<button onclick="window.showModal('confirm')">Open</button>
```

**After** (Reactive state):
```astro
---
const isOpen = false;
---
<Dialog bind:open={isOpen}>
  <DialogPanel>
    <DialogTitle>Confirm</DialogTitle>
    <p>Are you sure?</p>
    <Button onclick={() => isOpen = false}>Cancel</Button>
  </DialogPanel>
</Dialog>

<Button onclick={() => isOpen = true}>Open</Button>
```

**Migration Pattern**: 1 component per PR, test thoroughly before next

---

## Increments Summary

| Increment | Name | Tasks | Duration | Risk | Priority |
|-----------|------|-------|----------|------|----------|
| **0103** | Security Fixes | 7 | 1-2 days | MEDIUM | CRITICAL |
| **0104** | Lib Consolidation | 12 | 2-3 days | LOW | HIGH |
| **0105** | UI Batch 1 | 8 | 2-3 days | LOW | HIGH |
| **0106** | UI Batch 2 | 10 | 3-4 days | MEDIUM | MEDIUM |
| **0107** | Actions Consolidation | 10 | 3-4 days | MEDIUM | MEDIUM |
| **0108** | DB + Modal Migration | 10 | 4-5 days | HIGH | LOW |

**Total**: 57 tasks across 6 increments  
**Estimated Duration**: 3-4 weeks

---

## Rollback Strategy

### Per-Increment Rollback

```bash
# Increment N deployed, issues found
git checkout increment-$(($N-1))  # Revert to previous state
npx wrangler deploy --env production  # Re-deploy
```

### Per-Component Rollback

```javascript
// src/components/ui/Button.astro
// Feature flag for component-level rollback
const useFulldev = import.meta.env.ENABLE_FULLEDEV_BUTTON !== 'false';
```

### Per-Feature Rollback (Wrangler)

```toml
# wrangler.jsonc
[vars]
ENABLE_FULLEDEV_BUTTON = "true"
ENABLE_NEW_CARD = "true"
ENABLE_MODAL_MIGRATION = "false"
```

```bash
# Emergency: Disable feature via wrangler secret
wrangler secret put ENABLE_FULLEDEV_BUTTON "false"
```

---

## Continuous Verification Pipeline

### Automated Tests Per Increment

```yaml
# .github/workflows/increment-verify.yml
name: Increment Verification
on:
  push:
    branches: [increment/*]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        
      - name: Build
        run: pnpm build
        
      - name: API Smoke Tests
        run: |
          for endpoint in /api/products /api/business /api/auth /api/listings; do
            curl -f https://timorup.jasonwill.workers.dev$endpoint || exit 1
          done
          
      - name: E2E Tests
        run: node e2e-test.cjs
        
      - name: Visual Regression
        run: node playwright-visual-test.cjs
```

### Pre-Deployment Checklist

```markdown
## Pre-Deployment Checklist

### Security
- [ ] No hardcoded credentials
- [ ] Auth checks on all protected endpoints
- [ ] Input validation on all user inputs

### UI/UX
- [ ] Screenshot comparison: baseline vs current (diff < 5%)
- [ ] Accessibility: keyboard nav works
- [ ] Mobile: responsive layout intact
- [ ] Dark mode: theme toggle works

### API
- [ ] All endpoints return correct status codes
- [ ] Response shapes unchanged
- [ ] Error messages appropriate

### Business Flows
- [ ] Login flow works
- [ ] Registration works
- [ ] Listing creation works
- [ ] Payment flow works (if applicable)

### Database
- [ ] No breaking schema changes
- [ ] Migrations are backward compatible
- [ ] Rollback script tested
```

---

## Risk Mitigation Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| UI regression | MEDIUM | HIGH | Visual comparison + E2E tests |
| API breakage | LOW | HIGH | API smoke tests + contract verification |
| Business flow broken | LOW | CRITICAL | End-to-end flow tests |
| Build failure | LOW | MEDIUM | Incremental build verification |
| Deployment failure | LOW | MEDIUM | Rollback script + git tags |
| Performance regression | MEDIUM | MEDIUM | Lighthouse comparison |
| Accessibility broken | LOW | HIGH | a11y audit per increment |

---

## Coordination with SpecWeave

### Recommended SpecWeave Structure

```yaml
# Increment hierarchy
├── 0103-security-fixes          # CRITICAL - First
├── 0104-lib-consolidation        # Foundation
├── 0105-ui-migration-batch-1     # Safe components
├── 0106-ui-migration-batch-2     # High impact components  
├── 0107-actions-consolidation    # Backend logic
└── 0108-advanced-migration      # Complex changes
```

### SpecWeave Metadata Per Increment

```json
{
  "id": "0105-ui-migration-batch-1",
  "parent": "0103-fulldev-migration-refactor",
  "status": "in-progress",
  "blocking": false,
  "dependsOn": ["0103", "0104"],
  "riskLevel": "LOW",
  "rollbackCommit": "abc1234",
  "preDeployTests": ["pnpm build", "node e2e-test.cjs", "node visual-test.cjs"],
  "postDeployTests": ["curl smoke tests", "E2E full test"]
}
```

---

## Communication Plan

### Stakeholder Updates

| Phase | Communication | Audience |
|-------|---------------|----------|
| Before start | Migration plan overview | All devs |
| Per increment | What's changing, testing required | Frontend team |
| Issues found | Immediate escalation | All stakeholders |
| Completion | Summary + metrics | All stakeholders |

### Developer Handoff

```markdown
# Increment 0105: UI Migration Batch 1

## What Changed
- Badge.astro → @fulldev/badge
- Textarea.astro → @fulldev/textarea
- Select.astro → @fulldev/native-select (wrapper added)

## How to Test
```bash
pnpm build  # Should pass
node e2e-test.cjs  # Should pass
node visual-test.cjs  # Should show < 5% diff
```

## If Issues Found
1. Check if custom component still works (feature flag)
2. Revert: `git checkout increment-0104`
3. Deploy: `npx wrangler deploy`

## Notes
- Select uses wrapper component for options prop compatibility
- Badge variants match exactly (verified)
- No breaking changes to component APIs
```

---

## Success Metrics

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| UI Components LoC | 800 | 250 | -69% |
| Lib Duplications | 15 | 0 | -100% |
| Action Duplications | 7 | 0 | -100% |
| Security Issues | 3 | 0 | -100% |
| Build Time | ~3 min | ~2.5 min | -15% |
| Bundle Size | ~450KB | ~280KB | -38% |
| New Component Time | 2 hours | 5 min | -95% |
| Bug Fix Time | 1 hour | 10 min | -83% |

---

## Timeline

```
Week 1:  Increment 0103 (Security) + Increment 0104 (Lib)
Week 2:  Increment 0105 (UI Batch 1)
Week 3:  Increment 0106 (UI Batch 2)
Week 4:  Increment 0107 (Actions)
Week 5:  Increment 0108 (DB + Modal)
Week 6:  Buffer + bug fixes + final verification
```

**Total Duration**: 6 weeks (buffer included for issues)

---

## Decision Points

### Go/No-Go Criteria Per Increment

| Criterion | Threshold | Action if Failed |
|-----------|-----------|------------------|
| Build passes | `pnpm build` exits 0 | Halt, fix issues |
| E2E tests | 14/14 pass | Halt, investigate |
| Visual diff | < 5% | Investigate changes |
| API smoke | All endpoints respond | Halt, fix |
| Performance | Lighthouse score > 80 | Investigate |

### Rollback Criteria

- **Immediate rollback** if: Security issue, data loss, complete breakage
- **Investigate then decide** if: Visual regression > 10%, performance drop > 20%
- **Proceed with monitoring** if: Minor visual diff < 5%, no functional impact

---

*Generated by TimorUp AI Assistant*  
*Document Version: 1.0*  
*Next Step: User approval to begin Increment 0103*