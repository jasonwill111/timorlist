# Plan — Increment 0113: DOM API 重构

## 架构决策

### 1. 事件委托模式

**问题**：Admin 页面使用散列 `querySelectorAll` + `addEventListener`，每个按钮单独监听。

**决策**：使用事件委托 + `data-action` 属性。

```javascript
// 单一 document listener
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  
  const { action, id, status } = btn.dataset;
  switch (action) {
    case 'edit-listing': handleEdit(id); break;
    case 'delete-listing': handleDelete(id); break;
    case 'toggle-status': handleToggle(id, status); break;
  }
});
```

**优点**：
- 减少 90% 的 event listener 代码
- 统一处理，无需为每个按钮单独绑定
- 新增按钮只需添加 data-action 属性

### 2. Helper 函数保持策略

**问题**：products.astro 使用 innerHTML + 模板字符串生成动态内容。

**决策**：保持 helper 函数返回字符串（而非 DOM 元素），但添加 data-action 属性统一事件。

```javascript
// 保持字符串 helper（低风险）
function buildPriceFieldRow(idx, field, units) {
  return `<div class="flex gap-2 items-center price-field-row" data-index="${idx}">
    <input type="text" name="priceLabel_${idx}" value="${escapeHtml(field.label)}" />
    <button type="button" data-action="remove-price-field" data-index="${idx}">
      <svg>...</svg>
    </button>
  </div>`;
}
```

**优点**：
- 无需重写数据流
- 保持 form 兼容性（name 属性）
- 未来可演进为 DOM API

### 3. 组件化优先级

**静态 HTML 元素**：直接迁移到 `<Button>`, `<Input>`, `<Textarea>`, `<Select>`

**JS 模板字符串元素**：保持字符串 + 添加 data-action

### 4. 安全考量

- 保留 escapeHtml（防止 XSS）
- 不使用 innerHTML 渲染用户输入
- data-action 属性不传递敏感数据（仅传递 ID）

## 组件设计

### EventDelegate Utility

```typescript
// src/lib/event-delegate.ts
interface ActionHandler {
  (e: MouseEvent, dataset: DOMStringMap): void;
}

class EventDelegate {
  private handlers: Map<string, ActionHandler> = new Map();
  
  register(action: string, handler: ActionHandler) {
    this.handlers.set(action, handler);
  }
  
  handle(e: Event) {
    const target = e.target as HTMLElement;
    const el = target.closest('[data-action]');
    if (!el) return;
    
    const action = el.dataset.action;
    const handler = this.handlers.get(action);
    if (handler) handler(e as MouseEvent, el.dataset);
  }
  
  attach() {
    document.addEventListener('click', this.handle.bind(this));
  }
}

export const delegate = new EventDelegate();
```

### 使用示例

```javascript
// admin/listings/index.astro
import { delegate } from '@/lib/event-delegate';

delegate.register('edit-listing', (e, ds) => {
  window.location.href = `/admin/listings/${ds.id}/edit`;
});

delegate.register('delete-listing', async (e, ds) => {
  if (!confirm('Delete?')) return;
  const res = await fetch(`/api/admin/listing`, {
    method: 'DELETE',
    body: JSON.stringify({ id: ds.id }),
  });
  if (res.ok) loadListings();
});

delegate.attach();
```

## 迁移顺序

1. **Phase 0**: 静态元素（无风险，验证 build）
2. **Phase 1**: 事件委托（核心重构，测试重点）
3. **Phase 2**: products.astro（最复杂，测试重点）
4. **Phase 3**: 营业时间（表单兼容性）
5. **Phase 4**: Header（独立组件）
6. **Phase 5**: 其他页面
7. **Phase 6**: 验证与部署

## 风险缓解

| 阶段 | 风险 | 缓解 |
|------|------|------|
| Phase 0 | 低 | 每个文件单独 commit |
| Phase 1 | 中 | 保留原有函数，仅添加 data-action |
| Phase 2 | 中 | products 是最复杂页面，放在 Phase 2 后期 |
| Phase 3 | 中 | 保留 name 属性，测试表单提交 |
| Phase 4 | 低 | Header 是独立组件 |
| Phase 5 | 低 | 其他页面都是简单重构 |

## 测试策略

### 手动测试清单

1. **Admin Listings**
   - [ ] 创建 listing → 出现在列表
   - [ ] 编辑 listing → 保存成功
   - [ ] 删除 listing → 列表刷新
   - [ ] 发布/Unpublish → 状态更新

2. **Admin Products**
   - [ ] 创建 product → 出现在列表
   - [ ] 添加/删除价格字段 → 正常显示
   - [ ] 上传媒体 → 缩略图显示
   - [ ] 删除媒体 → 缩略图移除

3. **Business Edit**
   - [ ] 更新营业时间 → 保存成功
   - [ ] 更新地址 → 坐标显示
   - [ ] 获取坐标 → 地图更新

4. **Header Mobile**
   - [ ] 点击 hamburger → menu 打开
   - [ ] 点击关闭 → menu 关闭

## 未来演进

### 短期（本次重构后）
- 所有事件处理统一为事件委托
- 消除散列 addEventListener
- 减少 30% 的 JS 代码量

### 中期（3-6 个月）
- 将 helper 函数从字符串改为 DOM API
- 使用 `<Button>` 组件替代模板字符串中的 button
- 引入 Astro Islands 分离复杂交互

### 长期（Astro 6/7 升级）
- 利用 Astro 7 的新特性（更好的 SSR 类型检查）
- 迁移到更结构化的数据驱动模式
- 减少 50% 的内联 script 代码