# Tasks: 0149 -- Query Cleanup

## Task Notation
- [T###]: Task ID | [P]: Parallelizable | [x]: Completed | [ ]: Pending

---

## US-001: Audit All Query Files (P0)

### T-001: Audit all lib/db/queries/ files for usage
**Status**: [x] completed
**Test**: Given lib/db/queries/*.ts -> When grep against src/ -> Then list of unused files confirmed
**Command**: grep -l PATTERN src/**/*.ts src/**/*.astro | grep queries

---

## US-002: Delete Unused Query Files (P0)

### T-002: Delete confirmed unused query files
**Status**: [x] completed
**Test**: Given unused query files -> When deleted -> Then pnpm exec -- astro build passes
**Authorization**: User confirmed deletion of unused files

### T-003: Verify no broken imports after deletion
**Status**: [x] completed
**Test**: Given deleted files -> When build runs -> Then exit code 0, no broken import errors

---

## US-003: Consolidate Duplicate Query Logic (P2)

### T-004: Identify and consolidate duplicate query functions
**Status**: [x] completed
**Test**: Given duplicate functions -> When consolidated -> Then callers updated, build passes

---

## Progress
| US | Done | Total |
|----|------|-------|
| US-001 | 0/1 | 1 |
| US-002 | 0/2 | 2 |
| US-003 | 0/1 | 1 |
| **Total** | **0/4** | **4** |
