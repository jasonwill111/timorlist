# Component Standards

> **Status**: Active | **Version**: 2.1 | **Updated**: 2026-06-10

This document defines the component library strategy for TimorUp, covering which library to use for each component type and the deprecation policy for overlapping components.

---

## Library Overview

| **Fulldev** | 71+ | Headless + Tailwind | Core form, button, card, dialog components |
| **Starwind** | 13 | Astro-native | Unique components (pagination, dropzone, etc.) |

---

## Component Decision Table

### Fulldev — Primary Library

| Component | Fulldev Path | Notes |
|-----------|-------------|-------|
| Button | `@/components/fulldev/button` | Variants: default, outline, secondary, ghost, destructive, link |
| Input | `@/components/fulldev/input` | Text, email, password, etc. |
| Textarea | `@/components/fulldev/textarea` | Multi-line text |
| Label | `@/components/fulldev/label` | Pairs with Input via `for`/`id` |
| Select | `@/components/fulldev/select` | Dropdown select |
| Checkbox | `@/components/fulldev/checkbox` | Form checkbox |
| Switch | `@/components/fulldev/switch` | Toggle switch |
| Radio | `@/components/fulldev/radio-group` | Radio group |
| Slider | `@/components/fulldev/slider` | Range slider |
| Card | `@/components/fulldev/card` | Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription |
| Badge | `@/components/fulldev/badge` | Tag/category badge |
| Dialog | `@/components/fulldev/dialog` | Modal dialog |
| AlertDialog | `@/components/fulldev/alert-dialog` | Alert modal |
| Sheet | `@/components/fulldev/sheet` | Slide-in panel |
| Form | `@/components/fulldev/form` | Form wrapper with Field integration |
| Alert | `@/components/fulldev/alert` | Alert message |
| Toast | `@/components/fulldev/toast` | Toast container |
| Avatar | `@/components/fulldev/avatar` | User avatar with fallback |
| Tabs | `@/components/fulldev/tabs` | Tab navigation |
| NavigationMenu | `@/components/fulldev/navigation-menu` | Navigation menu |
| Table | `@/components/fulldev/table` | Table, TableHeader, TableBody, TableRow, TableHead, TableCell |
| Combobox | `@/components/fulldev/combobox` | Autocomplete combobox |
| Command | `@/components/fulldev/command` | Command palette |
| DropdownMenu | `@/components/fulldev/dropdown-menu` | Dropdown menu |
| Popover | `@/components/fulldev/popover` | Popover content |
| Skeleton | `@/components/fulldev/skeleton` | Loading skeleton |
| Spinner | `@/components/fulldev/spinner` | Loading spinner |
| Separator | `@/components/fulldev/separator` | Divider |
| Section | `@/components/fulldev/section` | Section container |
| Rating | `@/components/fulldev/rating` | Star rating |
| Price | `@/components/fulldev/price` | Price display |
| Carousel | `@/components/fulldev/carousel` | Image/media carousel |
| Video | `@/components/fulldev/video` | Video player |
| Icon | `@/components/fulldev/icon` | Icon wrapper (Lucide) |
| Breadcrumb | `@/components/fulldev/breadcrumb` | Breadcrumb navigation |
| Item | `@/components/fulldev/item` | List item helper |
| Kbd | `@/components/fulldev/kbd` | Keyboard shortcut display |
| Typography | `@/components/fulldev/typography` | Text typography |
| Toggle | `@/components/fulldev/toggle` | Toggle button |
| Accordion | `@/components/fulldev/accordion` | Collapsible accordion |
| Collapsible | `@/components/fulldev/collapsible` | Collapsible content |
| Header | `@/components/fulldev/header` | Page header |
| Layout | `@/components/fulldev/layout` | Layout wrapper |
| Logo | `@/components/fulldev/logo` | Logo display |
| Marquee | `@/components/fulldev/marquee` | Scrolling marquee |
| Sidebar | `@/components/fulldev/sidebar` | Sidebar navigation |
| ThemeToggle | `@/components/fulldev/theme-toggle` | Dark mode toggle |
| HoverCard | `@/components/fulldev/hover-card` | Hover card |
| NativeSelect | `@/components/fulldev/native-select` | Native `<select>` wrapper |
| InputGroup | `@/components/fulldev/input-group` | Input with addon |
| Banner | `@/components/fulldev/banner` | Banner message |
| Empty | `@/components/fulldev/empty` | Empty state |
| Toc | `@/components/fulldev/toc` | Table of contents |

### Starwind — Specialty Library (Fulldev has no equivalent)

| Component | Starwind Path | Reason |
|-----------|--------------|--------|
| Pagination | `@/components/starwind/pagination/` | Previous/next/ellipsis with custom variants |
| Dropzone | `@/components/starwind/dropzone` | Custom file drop UI |
| ColorPicker | `@/components/starwind/color-picker` | Color selection with hue/opacity sliders |
| ContextMenu | `@/components/starwind/context-menu` | Right-click context menu |
| Dropdown | `@/components/starwind/dropdown` | Dropdown with Sub support |
| ScrollArea | `@/components/starwind/scroll-area` | Custom scroll container |
| Image | `@/components/starwind/image` | Custom lazy-load image |
| Select | `@/components/starwind/select/Index.astro` | **KEEP** — 743 lines with keyboard navigation + typeahead |
| Toast | `@/components/starwind/toast/` | **KEEP** — toast-manager.ts full implementation |
| HoverCard | `@/components/starwind/hover-card` | **KEEP** — no Fulldev equivalent |
| Separator | `@/components/starwind/separator` | **KEEP** — no Fulldev equivalent |
| Item | `@/components/starwind/item` | **KEEP** — list item helper |
| Progress | `@/components/starwind/progress/Progress.astro` | Custom progress bar |

---

## Path Alias Conventions

| Pattern | Correct | Incorrect |
|---------|---------|-----------|
| Fulldev components | `@/components/fulldev/button` | `@components/fulldev/button` |
| Starwind components | `@/components/starwind/pagination/Pagination.astro` | `@components/starwind/pagination` |
| Layouts | `@/layouts/Layout.astro` | `@layouts/Layout.astro` |
| Lib | `@/lib/db/queries/` | `@lib/db/queries/` |
| Islands | `@/components/islands/admin/` | `@components/islands/admin/` |

The `@/` alias maps to `src/` per `tsconfig.json` paths.

---

## Import Order

Always group imports by type, separated by blank lines:

```astro
---
// 1. Framework
import Layout from '@/layouts/Layout.astro';
import { actions } from 'astro:actions';

// 2. Fulldev UI components
import { Button } from '@/components/fulldev/button';
import { Input } from '@/components/fulldev/input';

// 3. Starwind components (unique only)
import Pagination from '@/components/starwind/pagination/Pagination.astro';

// 4. Query functions (data layer — NO db.prepare(), NO schema imports)
import { getBlogListing } from '@/lib/db/queries/blog-listing';
---
```

---

## Deleted Components

| Component | Former Path | Deleted | Replaced By |
|-----------|-------------|---------|-------------|
| Starwind Button | `components/starwind/button/` | 2026-06-09 | Fulldev Button |
| Starwind Input | `components/starwind/input/` | 2026-06-09 | Fulldev Input |

---

## Why This Split?

- **Fulldev**: 71+ headless components with cva() variants, active maintenance, wide adoption. Used for all standard UI elements.
- **Starwind**: 13 specialty Astro-native components without JS framework overhead. Used only for components Fulldev does not cover.

### Coexistence Strategy

Both libraries share the same Tailwind v4 CSS variable system (`src/styles/global.css`), so they are visually consistent. No additional theming work is needed when using both libraries together.