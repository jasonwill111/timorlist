# Increment 0125: Frontmatter Syntax Errors - SSR Failures

**Status**: ✅ COMPLETED  
**Date**: 2026-06-06  
**Branch**: `feat/comp-A-delete-dead`  
**Commit**: `801aca6e`  

---

## Problem

Multiple Astro pages/components were failing during SSR in Cloudflare Workers:

1. **Homepage empty `<main>`**: Only 16KB HTML with truncated output, no `</body>` or `</html>`
2. **Contact page raw source**: Prerendered page showed raw Astro template code instead of HTML
3. **Runtime error**: `Uncaught ReferenceError: className is not defined` during SSR

### Root Cause

**18 `.astro` files had imports placed OUTSIDE the frontmatter `---` fence**.

Invalid pattern:
```astro
import Button from '@/components/ui/Button.astro';
---
---
// rest of frontmatter
---
<template>
```

This dual-frontmatter pattern confused Astro's SSR compiler, causing it to embed source code as string literals instead of executing them as code.

---

## Solution

Moved ALL imports and code inside the single frontmatter block for each affected file.

### Files Fixed (18 total)

| File | Impact |
|------|--------|
| `src/components/ui/CarouselBanner.astro` | **Primary culprit** - homepage empty main |
| `src/components/ui/LocationMap.astro` | Admin page broken |
| `src/components/ui/Modal.astro` | UI component |
| `src/components/ui/ShareDialog.astro` | UI component |
| `src/components/islands/HomepageContent.astro` | Homepage data layer |
| `src/components/islands/ProductsIsland.astro` | Products page |
| `src/pages/admin/blogs.astro` | Admin panel |
| `src/pages/admin/businesses.astro` | Admin panel |
| `src/pages/admin/listings/index.astro` | Admin panel |
| `src/pages/admin/listings/new/index.astro` | Admin panel |
| `src/pages/admin/orders.astro` | Admin panel |
| `src/pages/admin/products.astro` | Admin panel |
| `src/pages/admin/reviews.astro` | Admin panel |
| `src/pages/admin/settings.astro` | Admin panel |
| `src/pages/admin/users.astro` | Admin panel |
| `src/pages/business/[slug]/product/new/index.astro` | Product creation |
| `src/pages/contact.astro` | Contact page (raw source bug) |
| `src/pages/edit-business-page/[id].astro` | Business editing |

---

## Verification

### Before Fix
- Build: **FAILED** (5+ minutes before error)
- Homepage: **Empty `<main>`** - "Explore Timor-Leste" not rendered
- Contact: **Raw source code** visible instead of HTML
- Runtime: `className is not defined` errors

### After Fix
- Build: **SUCCESS** in 1m 17s
- Homepage: **"Explore Timor-Leste" renders** ✅
- Contact: **Proper HTML output** ✅
- Runtime: **NO className errors** ✅

---

## Files Changed

| File | Change |
|------|--------|
| 18 `.astro` files | Moved imports inside frontmatter `---` fence |

---

## Lesson Learned

**Astro frontmatter rules**:
- Only ONE `---` delimiter pair per `.astro` file
- All imports, interfaces, and executable code must be in that single block
- Multiple `---` blocks create malformed template strings in built output
- Imports placed before `---` are treated as template content, not executable code

---

## Related

- Cloudflare Workers SSR deployment
- Cloudflare D1 database
- Astro build system