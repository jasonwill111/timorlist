# Plan — Increment 0126: UI Component Replacement & Dead Code Cleanup

## Strategy: Audit-First, Atomic Commits, Parallel-Safe

Each component migration is **independent** and can be its own commit. The plan below sequences work by risk: low-risk first (dead code, audit), then medium-risk (Footer, FormMessage, OptimizedImage), then high-risk (Header, PasswordInput).

---

## Execution Sequence

### Wave 1: Zero-Risk Foundation (1 increment, ~5 min)

| Step | Action | Output |
|------|--------|--------|
| W1.1 | Delete 8 dead files | 8 files removed |
| W1.2 | Build verification | `pnpm build` exit 0 |
| W1.3 | Grep audit | 0 references |

**Why first**: Pure deletion, no semantic change, no risk of regression.

---

### Wave 2: Audit (1 increment, ~10 min)

| Step | Action | Output |
|------|--------|--------|
| W2.1 | Read Header/Footer/OptimizedImage/AuthCard/FormMessage/PasswordInput | Source code in context |
| W2.2 | Map each raw HTML/Tailwind cluster to a ui/ primitive | `.specweave/increments/0126-*/reports/audit.md` |
| W2.3 | Identify missing ui/ primitives | List, defer to 0127 if needed |

**Why separate**: Migration is unpredictable without knowing exactly what raw elements exist. Audit = no code change = zero risk.

---

### Wave 3: Low-Risk Migrations (3-4 increments, ~30 min)

**Increment 0127**: Migrate Footer.astro + FormMessage.astro
- Both are small (77 + 49 LoC)
- Both have clear ui/ equivalents (Separator, Alert)
- Independent of Header and AuthCard

**Increment 0128**: Migrate AuthCard.astro
- 45 LoC
- Composes Card primitives
- Independent of other form components

**Increment 0129**: Migrate OptimizedImage.astro (decision: keep at root or move to ui/image)
- 90 LoC
- Used by 1 page (product detail)

---

### Wave 4: High-Risk Migrations (2 increments, ~60 min)

**Increment 0130**: Migrate Header.astro
- 292 LoC — largest single component
- Used by every page
- MUST preserve navigation behavior, mobile menu, user dropdown
- Visual smoke test: homepage, businesses, login (3 pages)

**Increment 0131**: Migrate PasswordInput.astro
- 68 LoC but SSR-sensitive (see 0125)
- Used by login, register
- MUST read 0125 spec first to preserve SSR fix
- Visual smoke test: password toggle on /login, /register

---

### Wave 5: Final Verification (1 increment, ~10 min)

| Step | Action | Output |
|------|--------|--------|
| W5.1 | Full build | exit 0 |
| W5.2 | Grep audit (inline style, dead refs) | 0 matches |
| W5.3 | 9-page screenshot comparison | All pages render |

---

## Multi-Increment Coordination

| Increment | Scope | Risk | Estimated LoC Changed |
|-----------|-------|------|----------------------|
| 0126 | Dead code delete + audit | 0 | -577 LoC |
| 0127 | Footer + FormMessage | Low | ~50 LoC rewritten |
| 0128 | AuthCard | Medium | ~30 LoC rewritten |
| 0129 | OptimizedImage | Medium | ~40 LoC rewritten |
| 0130 | Header | **High** | ~200 LoC rewritten |
| 0131 | PasswordInput | **High** | ~40 LoC rewritten |

**Why split this way**:
- 0126 must complete first (audit reveals migration scope)
- 0127-0129 are parallelizable (independent components)
- 0130 must run alone (highest risk, needs full attention)
- 0131 must run alone (SSR-specific risk)

---

## Safety Mechanisms

1. **Git checkpoint before 0130 and 0131**:
   ```bash
   git checkout -b checkpoint-before-header
   ```
2. **Build after every commit** — never accumulate unverified changes
3. **Playwright screenshots** for visual regression detection
4. **Single component per commit** — atomic rollback
5. **Audit gates Wave 4** — don't migrate Header without reading it first

---

## Definition of Done (per increment)

Each increment ends with:
- [ ] All `tasks.md` checkboxes `[x]`
- [ ] `pnpm build` exit 0
- [ ] Git commit with descriptive message
- [ ] No push (user authorizes)
