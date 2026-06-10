---
id: US-002
feature: FS-139
title: "Marketing Pages → Fulldev Blocks (P1)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-002: Marketing Pages → Fulldev Blocks (P1)

**Feature**: [FS-139](./FEATURE.md)

**As a** developer
**I want** marketing pages replaced with Fulldev Block components
**So that** UI code is reduced and component reusability is maximized

---

## Acceptance Criteria

- [x] **AC-US2-01**: `pages/index.astro` → 使用 `@fulldev/hero-N` + `@fulldev/features-N` + `@fulldev/pricing-N` + `@fulldev/cta-N` blocks
- [x] **AC-US2-02**: `pages/pricing.astro` → 使用 `@fulldev/pricing-N` block，数据从 frontmatter props传入
- [x] **AC-US2-03**: `pages/faq.astro` → 使用 `@fulldev/faqs-N` block
- [x] **AC-US2-04**: `pages/contact.astro` → 使用 `@fulldev/contact-N` block
- [x] **AC-US2-05**: `pages/about.astro` → 使用 `@fulldev/hero-N` + `@fulldev/content-N` + `@fulldev/cta-N` blocks
- [x] **AC-US2-06**: 所有 Block 数据从 frontmatter 变量传入，不修改 Block 源码

---

## Implementation

**Increment**: [0139-fulldev-starwind-migration](../../../../../increments/0139-fulldev-starwind-migration/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

- [x] **T-003**: Replace index.astro with Fulldev Blocks
- [x] **T-004**: Replace pricing.astro with Block
- [x] **T-005**: Replace faq.astro with Block
- [x] **T-006**: Replace contact.astro with Block
- [x] **T-007**: Replace about.astro with Blocks
