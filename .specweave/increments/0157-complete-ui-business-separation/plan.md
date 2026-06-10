---
increment: 0157-complete-ui-business-separation
title: "Complete UI/Business Separation"
---

## Design

### 架构原则

| 层级 | 职责 | 示例 |
|------|------|------|
| `src/pages/` | 数据获取、redirect 逻辑 | frontmatter 只调用 query 函数 |
| `src/components/ui/` | Fulldev 组件库 | Button, Input, Checkbox, Select, Dialog |
| `src/components/islands/` | 交互逻辑（client JS） | 表单处理、DOM 操作 |
| `src/lib/db/queries/` | 数据访问层 | 所有 SQL，Drizzle ORM |

### US-001: OperatingHoursIsland

```
src/components/islands/business/OperatingHoursIsland.astro
Props: { days: Array<{day: string, open: string, close: string, isClosed: boolean}> }
渲染: Astro 模板 map + <Checkbox> + <Input type="time">
```

**为什么不直接用 Fulldev**：需要根据 `isClosed` 动态 disable time inputs，交互逻辑需 client script

### US-002: AdminListRow

```
src/components/ui/admin/AdminListRow.astro
Props: { id: string, name: string, status: string, onToggle: string, onDelete: string }
渲染: <tr> 内含 <Button variant="ghost"> × 2
```

**Pattern**: 列表页 → map → `<AdminListRow>`，替代 template literal 拼接

### US-003: HiddenField

```
src/components/ui/HiddenField.astro
Props: { name: string, value: string | number }
渲染: <input type="hidden">
```

## Rationale

- OperatingHours island 化而非全页面迁移：business/edit 其他部分已工作正常，局部替换风险最低
- Admin islands template literal 替换：用 Astro map 而非新建组件，减少文件数
- HiddenField 统一封装：可添加自动 ID 生成，未来可扩展
