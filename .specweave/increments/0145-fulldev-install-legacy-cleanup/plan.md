# Implementation Plan: 0145 — 安装 Fulldev + Legacy 清理 + XSS 审计

## Overview

安装 Fulldev UI 双库 + 统一 design token + 清理 Legacy PascalCase + XSS 审计 + business/[slug] wiring。

## Architecture

### 双库目录结构
```
src/components/
├── ui/              ← Fulldev（npx shadcn 装）+ shadcn Astro 移植版
├── starwind/        ← Starwind（已装）
└── custom/          ← 项目 wrapper（如需统一 API）
```

### Design Token 层（global.css）
```
@theme {
  --color-primary: oklch(0.55 0.18 250);    ← 统一主色
  --radius-md: 8px;                          ← 统一圆角
  --duration-normal: 250ms;                 ← 统一动效
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1); ← 统一缓动
}
```

### Fulldev 安装命令
```bash
# 1. 初始化（注入 CSS token + cn() 工具）
npx shadcn@latest add @fulldev/init -y --overwrite

# 2. 核心表单组件
npx shadcn@latest add @fulldev/button @fulldev/input @fulldev/label \
  @fulldev/select @fulldev/textarea @fulldev/dialog @fulldev/sheet \
  @fulldev/form @fulldev/switch @fulldev/checkbox @fulldev/radio \
  @fulldev/slider @fulldev/alert @fulldev/badge @fulldev/avatar \
  @fulldev/table @fulldev/card @fulldev/accordion @fulldev/tabs \
  @fulldev/popover @fulldev/tooltip @fulldev/breadcrumb \
  @fulldev/dropdown-menu @fulldev/separator @fulldev/skeleton \
  @fulldev/spinner @fulldev/empty @fulldev/prose \
  @fulldev/navigation-menu @fulldev/sidebar @fulldev/layout -y

# 3. 所有 Block（82 变体）
npx shadcn@latest add @fulldev/blocks -y
```

### Legacy PascalCase re-export 模式
```astro
---
// src/components/ui/CardContent.astro
// 改为 re-export，桥接 kebab-case 子目录
export { default } from './card/card-content.astro';
---
```

### innerHTML XSS 审计模式
```typescript
// DOMPurify 包裹（已有）
import DOMPurify from 'dompurify';
const sanitize = (html: string) => DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

// safe DOM API（推荐）
element.textContent = untrustedData;  // 无需 sanitize
```

## Implementation Phases

### Phase 1: Fulldev 安装 + CSS Token 统一
1. `npx shadcn@latest add @fulldev/init -y --overwrite`
2. 检查 `global.css` 是否已覆盖 token
3. 补充 Fulldev + Starwind 统一 CSS 变量
4. `npx shadcn@latest add @fulldev/blocks -y`
5. `pnpm exec -- astro build` 验证

### Phase 2: Legacy PascalCase 清理
1. 11 个文件改为 re-export
2. 逐个确认 `astro build` 通过

### Phase 3: innerHTML XSS 审计
1. 6 个文件逐个检查
2. 确认每处 innerHTML 有 DOMPurify 或 safe DOM API
3. 静态 SVG/文本放行

### Phase 4: business/[slug] wiring
1. 更新 frontmatter import
2. 删除 inline DB 查询
3. 确认 frontmatter < 50行

## Testing Strategy
- 构建测试：`pnpm exec -- astro build`（每次 Phase 后执行）
- 无新增 TypeScript 错误
- 页面正常渲染

## Technical Challenges

### Challenge 1: Fulldev init 可能覆盖现有 global.css
**Solution**: 先备份 global.css，init 后对比 diff，只合并新增 token
**Risk**: 低 — init 只追加不覆盖现有 @theme

### Challenge 2: Legacy re-export 可能引入循环 import
**Solution**: 先 grep 确认无交叉 import，再逐个改写
**Risk**: 低 — re-export 是纯桥接，无业务逻辑

### Challenge 3: innerHTML 误报
**Solution**: 静态 SVG/文本（`createElementNS` + `textContent`）标记为 safe，不改
**Risk**: 低 — 只改真正的 XSS 风险点
