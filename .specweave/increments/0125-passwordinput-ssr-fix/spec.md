# Increment 0125: PasswordInput SSR Fix

**Status**: ✅ COMPLETED  
**Date**: 2026-06-06  
**Branch**: `feat/comp-A-delete-dead`  
**Commit**: `8ca864ab`

---

## Problem

Login page at `/login` returned HTTP 200 but rendered **0 input elements**. The form HTML started but got truncated mid-form — only the `form-message` div and its `<script>` tag rendered, then nothing else (no `<label>`, no `<input>`, no `</form>` closing tag).

### Symptom
```bash
curl -si https://timorup.jasonwill.workers.dev/login | grep 'input count'
# Response: 0 inputs rendered (should be 3: email, password, remember-me)
```

### Root Cause
`PasswordInput.astro` had **two separate frontmatter blocks**:
```astro
import Button from '@/components/ui/Button.astro';
---
---
// Second frontmatter block
import Input from '@/components/ui/Input.astro';
```

This dual-frontmatter pattern confused Astro's SSR compiler, causing it to embed the frontmatter source code as a string literal inside the template output instead of executing it as code.

### Wrangler Dev Error
```
✘ [ERROR] Uncaught ReferenceError: className is not defined
```
This error occurred during SSR rendering when the compiler tried to evaluate `className` in a context where it wasn't defined (because the frontmatter code was treated as template content, not executable code).

---

## Solution

Rewrote `PasswordInput.astro` with a **single, consolidated frontmatter block**:

```astro
---
import Input from '@/components/ui/Input.astro';
import Button from '@/components/ui/Button.astro';

interface Props {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  class?: string;
}

const {
  id = 'password',
  name = 'password',
  label = 'Password',
  placeholder = '--------',
  required = true,
  class: className
} = Astro.props;
---
```

Key changes:
1. Single `---` frontmatter delimiter (removed duplicate)
2. Import order: Input before Button (more logical dependency order)

---

## Verification

### Before Fix
- Login page: **0 inputs** rendered
- Register page: Inputs missing
- Admin login: 2 inputs (email, password) worked (doesn't use PasswordInput)

### After Fix
- Login page: **3 inputs** (email, password, remember-me) ✅
- Register page: **4 inputs** (name, email, password, confirmPassword) ✅
- Admin login: 2 inputs ✅
- All 7 production tests **PASSED** ✅

### Test Results
```
✓ Login page loads
✓ User can login with valid credentials
✓ Account page redirects to login when not authenticated
✓ Admin login page loads
✓ Admin login with valid credentials
✓ Login page form works (remote)
✓ Login with E2E test user (remote)

7 passed (26.8s)
```

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/forms/PasswordInput.astro` | Merged dual frontmatter into single block |

---

## Lesson Learned

**Astro frontmatter rules**:
- Only ONE `---` delimiter pair per `.astro` file
- All imports, interfaces, and executable code must be in that single block
- Multiple `---` blocks are invalid and cause silent compilation errors

---

## Related

- Issue: Login form not rendering inputs on production
- Components: `PasswordInput.astro`, `Input.astro`, `AuthCard.astro`
- Cloudflare Workers deployment
