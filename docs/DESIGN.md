<!-- specweave:living-doc {"name": "DESIGN.md", "version": "1.7.0", "updated": "2026-06-03", "type": "design-system", "domain": "frontend", "maintainedBy": "team", "lastChange": "architecture-optimization"} -->
# Design Context

## Users

- **Primary**: Timor-Leste local community (Timorese, expats, NGOs, businesses, government)
- **Use cases**: Find businesses, discover government/NGO services, browse classified ads
- **Context**: Mobile-first, limited connectivity, mix of urban/rural users

## Brand Personality

- **3 Words**: Vibrant, Cultural, Local
- **Emotional**: Pride in local businesses, trust in community
- **Reference**: Gumtree-style listings + professional business directory hybrid

## Design Principles

1. **Local pride** → Celebrate Timor-Leste, not generic Western patterns
2. **Trust & clarity** → Clear hierarchy, honest listings, no dark patterns
3. **Warmth** → Yellow/cream evokes approachability
4. **Mobile-first** → 44px touch targets, works on slow connections
5. **Fast & functional** → Quick loads, efficient search

## Color System

| Token | Light | Dark |
|-------|-------|------|
| Background | #FDFBF7 | #09090b |
| Primary | #FFD150 | #FFD150 |
| Card | #ffffff | #18181b |
| Muted | #f5f5f4 | #27272a |
| Brand-500 | #FFD150 | #FFD150 |

## Entity Card Display

| Entity | Badge | Info |
|--------|-------|------|
| Business | Industry (yellow bg) | Title (bold), Address (pin), 5-star rating, Likes (heart), Views (eye) |
| Non-Profit | Category (rose bg) | Title (bold), Address (pin), Likes (heart), Views (eye) |
| Public Sector | Category (blue bg) | Title (bold), Address (pin), Likes (heart), Views (eye) |
| Listing | Type + Price (color-coded) | Title (bold), Location (pin), Price (yellow bg), Likes (heart), Views (eye) |

### Card Design Specs

- **Aspect ratio**: 4:3 for images
- **Pagination**: 12 items/page
- **Hover**: yellow border (`border-primary/40`) + shadow lift
- **Border radius**: `rounded-2xl`
- **Image bg**: `from-primary/10 to-primary/5` (brand yellow tint)
- **Title**: `font-bold` + `line-clamp-2`
- **Address**: `text-sm` with `w-4 h-4` pin icon
- **Rating**: Full 5-star display (filled amber / empty gray)
- **Stats icons**: `w-3.5 h-3.5`, `gap-4` spacing

### Listing Type Colors

| Type | Color |
|------|-------|
| Job | blue |
| Product | emerald |
| Service | purple |
| Property | amber |
| Vehicle | red |
| Wanted | teal |

## Admin Sidebar

- **Width**: `w-48` (compact)
- **Nav items**: `px-2 py-2 gap-2 min-h-9`
- **Links**: Dashboard, Listings, Businesses, Non-Profits, Gov & NGOs, Users, SKUs, Categories, Heroes, Blogs, Media, Plans, Settings

---

## Bug Fix Log

### 2026-06-02 — Increment 0101: Security Audit & Best Practice Fixes

**No frontend rendering changes** — all fixes are backend/infrastructure.\n+Security fixes do not affect design tokens, component APIs, or visual appearance.\n+See `docs/ARCHITECTURE.md` → Bug Fix Log for full technical details.\n+
### 2026-06-02 — Increment 0100: E2E Testing and Bug Fixes