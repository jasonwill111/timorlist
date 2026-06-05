---
increment: 0113-dom-api-refactor
title: "DOM API 重构 — 消除 JS 模板字符串"
type: refactor
priority: P1
status: in_progress
created: 2026-06-05
structure: user-stories
test_mode: manual-e2e
project: TimorUp
production: https://timorup.jasonwill.workers.dev
---

# Refactor: DOM API 重构 — 消除 JS 模板字符串

## Overview

将 Astro 页面中的 inline HTML 模板字符串重构为结构化 DOM 操作 + 事件委托，消除 innerHTML XSS 风险，提高 AI 可维护性，为未来升级 Astro 6/7 打好基础。

## 背景与动机

### 为什么重构？

1. **安全**：innerHTML 存在 XSS 风险，即使有 escapeHtml 也难以保证完全安全
2. **可维护性**：JS 模板字符串对 AI 来说是黑箱，难以理解数据流
3. **组件化**：无法将 Astro 组件（`<Button>`, `<Input>`）放入模板字符串
4. **Astro 升级**：Astro 7 会对 SSR 模式有更严格的类型检查，提前清理有助于升级
5. **AI 开发效率**：结构化 DOM 操作比字符串模板更易理解和修改

### 当前状态

- **15 个静态可迁移元素**：button/input/textarea 在静态 HTML 中，可直接迁移
- **42 个 JS 模板字符串元素**：在 `<script>` backtick 字符串内，无法直接迁移
- **架构限制**：Astro 组件不能放在 JS 模板字符串内

### 架构决策

**选择：事件委托 + Helper 函数模式**

```javascript
// 策略：将 helper 函数返回值从 HTML 字符串改为 DOM 操作
// 或：保持字符串但统一事件委托

// 方案 A：保持字符串 + 事件委托（低风险，收益中等）
function buildPriceFieldRow(idx, field, units) {
  return `<div class="..." data-index="${idx}">
    <input type="text" name="priceLabel_${idx}" value="${escapeHtml(field.label)}" />
    <button type="button" data-action="remove-price-field" ...>X</button>
  </div>`;
}

// 事件委托：单一 listener 处理所有动态按钮
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  switch (btn.dataset.action) {
    case 'remove-price-field': handleRemove(btn); break;
  }
});

// 方案 B：DOM API（高风险，高收益）
function createPriceFieldRow(idx, field, units) {
  const row = document.createElement('div');
  row.className = '...';
  const input = document.createElement('input');
  input.type = 'text';
  row.appendChild(input);
  return row;
}
```

**最终选择：方案 A（保持字符串 + 事件委托）**
- 风险低：不需要重写数据流
- 收益高：统一事件处理，消除散列 addEventListener
- 未来可演进：数据驱动 DOM 操作

## User Stories

### US-1: 静态元素组件化
- [ ] 15 个静态 HTML 元素迁移到 `<Button>`, `<Input>`, `<Textarea>`, `<Select>` 组件
- [ ] `pnpm build` exits 0
- [ ] 核心功能测试通过

### US-2: 事件委托统一
- [ ] admin/listings/index.astro: 3 buttons → data-action + 单一 listener
- [ ] admin/users.astro: 2 buttons → helper + 事件委托
- [ ] businesses/non-profits/public-sectors: 3 selects → 保持 helper + 事件委托

### US-3: products.astro 重构
- [ ] buildPriceFieldRow → 使用 data-action 事件委托
- [ ] buildSpecFieldHtml → 使用 data-action 事件委托
- [ ] buildSkuItemHtml → 使用 data-action 事件委托
- [ ] buildMediaThumbnailHtml → 使用 data-action 事件委托
- [ ] 单一 document click listener 处理所有动态内容

### US-4: 营业时间输入重构
- [ ] business/[slug]/edit: 5 个 time input → 数据驱动渲染 + 事件委托
- [ ] 保留原有 name 属性（form 兼容性）

### US-5: Header mobile menu
- [ ] Header.astro: 3 buttons → data-action + 事件委托

### US-6: 其他页面
- [ ] ai-tools.astro: 1 button → data-action
- [ ] service-packages.astro: 1 button → data-action

### US-7: 验证
- [ ] pnpm build exits 0
- [ ] Admin listings: create/edit/delete/publish 测试通过
- [ ] Admin products: create/edit with price fields 测试通过
- [ ] Business edit: hours, address, coordinates 测试通过
- [ ] Header: mobile menu open/close 测试通过
- [ ] 生产环境部署验证

## 验收标准

### 构建验证
- `pnpm build` exits 0
- TypeScript 类型检查无错误
- Astro SSR 预渲染无错误

### 功能验证
- Admin listings: 创建/编辑/删除/发布 ✅
- Admin products: 创建/编辑含价格字段 ✅
- Business edit: 营业时间/地址/坐标更新 ✅
- Header: mobile menu 正常 ✅

### 代码质量
- 零 inline `addEventListener` in loop（全部改为事件委托）
- 零 inline `onclick=` 属性（全部改为 data-action）
- Helper 函数有 JSDoc 注释
- 事件委托有清晰的 switch-case 结构

## 技术栈

- Astro 5.x（未来升级到 Astro 6/7）
- TypeScript（strict mode）
- 原生 DOM API（无 jQuery/Zepto）
- CSS（Tailwind 4 via class）

## 风险等级

**MEDIUM**
- 重构范围大（13 个文件）
- 涉及表单提交（数据丢失风险）
- 涉及动态列表（排序/筛选失效风险）

## 缓解措施

1. 每个文件单独 commit，便于回滚
2. 每步完成后 build 验证
3. 手动功能测试（而非单元测试）
4. 保留原有的 name 属性（表单兼容性）
5. 保持原有的数据流（仅改变渲染方式）