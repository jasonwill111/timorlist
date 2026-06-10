---
id: US-002
feature: FS-144
title: "Starwind Toast 在 Auth 流程使用 (P1)"
status: completed
priority: P1
created: 2026-06-07T00:00:00.000Z
tldr: "**As a** developer."
project: timorup
---

# US-002: Starwind Toast 在 Auth 流程使用 (P1)

**Feature**: [FS-144](./FEATURE.md)

**As a** developer
**I want** 登录/注册成功或失败时显示 Starwind Toast 提示
**So that** 用户获得即时操作反馈

---

## Acceptance Criteria

- [x] **AC-US2-01**: `src/components/starwind/toast/` 存在且 `<Toaster>` 在 Layout 中挂载
- [x] **AC-US2-02**: `pages/login.astro` 登录成功后 `toast.success('Login successful')`
- [x] **AC-US2-03**: `pages/login.astro` 登录失败后 `toast.error(message)` 显示错误
- [x] **AC-US2-04**: `pages/register.astro` 注册成功后 `toast.success('Account created')`

---

## Implementation

**Increment**: [0144-starwind-integration-cleanup](../../../../../increments/0144-starwind-integration-cleanup/spec.md)

**Tasks**: See increment tasks.md for implementation details.


## Tasks

_No tasks defined for this user story_
