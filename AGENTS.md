# AGENTS.md

This document provides guidelines for AI coding agents operating in this repository.

## Project Overview

**Project**: onWeekend - WeChat Mini Program for Product Entry & Reviews
**Tech Stack**: 微信原生开发 + 微信云开发
**Language**: TypeScript/JavaScript (WXML, WXSS, JS/TS)
**Design Style**: 苹果深色系 (Apple Dark Mode)

## Core Functionality

1. **登录页 (pages/login)** - 微信授权登录
2. **扫码页 (pages/scan)** - 扫描二维码/条形码
   - 商品已存在：查看/修改评价
   - 商品不存在：录入新商品
3. **商品详情页 (pages/product)** - 商品评价管理
4. **新增商品页 (pages/add-product)** - 新商品录入

## Build & Development Commands

### WeChat Mini Program

```bash
# 微信开发者工具
# - 使用微信开发者工具打开项目目录
# - 点击"编译"运行项目
# - 点击"预览"生成二维码测试

# 项目配置
miniprogramRoot: ./
cloudfunctionRoot: cloudfunctions/
```

### Cloud Functions (微信云开发)

```bash
# 部署云函数
# 在微信开发者工具中右键 cloudfunctions 目录 → "上传并部署：云端安装依赖"

# 本地调试云函数
# 微信开发者工具 → 云开发 → 本地调试
```

### Linting

```bash
# ESLint (if configured)
npx eslint pages/ --ext .js,.ts,.wxml,.wxss
npx eslint --fix pages/  # Auto-fix

# Stylelint (if configured)
npx stylelint "**/*.wxss" --fix
```

### Testing

```bash
# 微信开发者工具内置测试
# - 真机调试
# - 自动化测试

# 单元测试 (Vitest/Jest if configured)
npm test              # Run all tests
npm test -- login     # Run specific test file
npm test -- --watch   # Watch mode
```

### Build Commands

```bash
npm run build         # Production build
npm run dev           # Development build
npm run cloud:deploy  # Deploy cloud functions
```

## Code Style Guidelines

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Pages | PascalCase | `pages/login/login` |
| Components | PascalCase | `components/ProductCard` |
| Cloud Functions | camelCase | `cloudfunctions/getProduct` |
| Variables | camelCase | `productList`, `userInfo` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| WXML IDs | kebab-case | `<view id="product-card">` |
| CSS Classes | BEM or kebab-case | `.product-card__title` |

### File Structure

```
onWeekend/
├── pages/                    # 页面
│   ├── login/               # 登录页
│   │   ├── index.{wxml,wxss,js,ts,json}
│   │   └── index.{wxml,js}  # 最小文件
│   ├── scan/                # 扫码页
│   ├── product/             # 商品详情页
│   └── add-product/         # 新增商品页
├── components/              # 组件
├── utils/                   # 工具函数
├── images/                  # 图片资源
├── cloudfunctions/          # 云函数
├── app.{wxml,wxss,js,json}  # 全局配置
└── project.config.json      # 项目配置
```

### TypeScript Guidelines

```typescript
// ✅ 推荐：明确类型定义
interface Product {
  id: string;
  name: string;
  barcode: string;
  imageUrl: string;
  ratings?: ProductRating[];
}

// ✅ 推荐：使用类型推断但保持清晰
const productList: Product[] = [];

// ❌ 禁止：使用 any
function getProduct(id: any): any { ... }

// ✅ 推荐：严格类型
function getProduct(id: string): Product | null { ... }
```

### WXML Template

```html
<!-- ✅ 推荐：语义化标签 -->
<view class="container">
  <view class="product-card" bindtap="onProductTap" data-id="{{product.id}}">
    <image class="product-image" src="{{product.imageUrl}}" mode="aspectFill"/>
    <text class="product-name">{{product.name}}</text>
  </view>
</view>

<!-- ❌ 避免：复杂嵌套 -->
<view>
  <view>
    <view>
      <text>{{text}}</text>
    </view>
  </view>
</view>
```

### WXSS Styling

```css
/* ✅ 推荐：苹果深色系 */
page {
  --primary-color: #007AFF;
  --background-color: #000000;
  --text-color: #FFFFFF;
  background-color: var(--background-color);
  color: var(--text-color);
}

/* ✅ 推荐：BEM 命名 */
.product-card {}
.product-card__title {}
.product-card--highlighted {}

/* ❌ 避免：硬编码颜色 */
.container {
  color: #333;
}

/* ✅ 推荐：使用 CSS 变量 */
.container {
  color: var(--text-color);
}
```

### Error Handling

```typescript
// ✅ 推荐：统一错误处理
try {
  const result = await wx.cloud.callFunction({
    name: 'getProduct',
    data: { id }
  });
} catch (error) {
  console.error('Failed to get product:', error);
  wx.showToast({
    title: '加载失败',
    icon: 'none'
  });
}

// ✅ 推荐：Promise 错误处理
wx.login().then({
  success: (res) => handleLogin(res),
  fail: (err) => handleError(err)
});
```

### Imports & Modules

```typescript
// ✅ 推荐：路径别名
import { formatDate } from '@/utils/date';
import { ProductService } from '@services/product';

// ✅ 推荐：云开发导入
const db = wx.cloud.database();
const _ = db.command;
```

## Database Schema (微信云开发)

```typescript
// products 集合
interface Product {
  _id: string;
  name: string;
  barcode: string;
  imageUrl: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ratings 集合
interface ProductRating {
  _id: string;
  productId: string;
  userId: string;
  rating: number;      // 1-5
  comment: string;
  createdAt: Date;
}

// users 集合
interface User {
  _id: string;
  openid: string;
  nickName: string;
  avatarUrl: string;
  createdAt: Date;
}
```

## Cloud Functions

```typescript
// 云函数命名规范
// cloudfunctions/
//   ├── getProduct/        # 获取商品
//   ├── createProduct/     # 创建商品
//   ├── getRatings/        # 获取评价
//   └── createRating/      # 创建评价
```

## API Design

```typescript
// ✅ 推荐：统一响应格式
interface ApiResponse<T> {
  code: 0 | -1;
  message: string;
  data: T;
}

// ✅ 推荐：分页查询
interface PageParams {
  page: number;
  pageSize: number;
}
```

## Git Workflow

```bash
# ✅ 推荐：语义化提交
feat: 添加商品扫码功能
fix: 修复登录页授权失败问题
docs: 更新README
style: 格式化代码
refactor: 重构商品卡片组件
```

## Critical Rules

### 1. MCP Automatic Data Collection (MANDATORY)

**ALWAYS use skill `mcp-automatic-data-collection`** for any file changes.

When editing/creating/deleting files:
- MUST call `beforeEditFile` before the operation
- MUST call `afterEditFile` after the operation
- MUST use absolute paths
- MUST maintain consistent sessionId throughout conversation

```typescript
// ✅ 正确流程
beforeEditFile('/absolute/path/to/file.ts')
// ... file operation ...
afterEditFile('/absolute/path/to/file.ts')
recordSession()  // At end of conversation
```

### 2. Never Suppress Type Errors

```typescript
// ❌ 禁止
const data: any = result;
const result = value as any;
```

### 3. Never Delete Tests to Pass

If tests fail, fix the implementation, not the tests.

### 4. Safe Refactoring

When refactoring:
- Use LSP rename for symbol changes
- Use AST-grep for pattern replacements
- Verify diagnostics clean after changes
- Run tests to confirm no regressions

## IDE Configuration

### VS Code Settings (`.vscode/settings.json`)

```json
{
  "files.associations": {
    "*.wxml": "html",
    "*.wxss": "css"
  },
  "editor.formatOnSave": true,
  "typescript.preferences.importModuleSpecifier": "non-relative"
}
```

### WeChat DevTools (`project.config.json`)

```json
{
  "setting": {
    "urlCheck": true,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "preloadBackground": false
  },
  "conditionSearch": {
    "list": []
  }
}
```

## Verification Checklist

Before marking task complete:

- [ ] `lsp_diagnostics` clean on changed files
- [ ] All lint checks pass
- [ ] Build successful (微信开发者工具无错误)
- [ ] Tests pass (if applicable)
- [ ] Type safety maintained (no `any`)
- [ ] Error handling added
- [ ] MCP data collection completed
