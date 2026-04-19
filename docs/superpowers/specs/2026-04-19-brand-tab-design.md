# 品牌管理独立Tab设计

## 概述

将品牌管理从首页链接入口独立为第三个Tab，与首页、统计并列。

## 变更内容

1. **app.json** tabBar 增加品牌管理 Tab
2. **pages/index/index.wxml** 移除"品牌管理"链接
3. **pages/index/index.js** 移除 `goToBrands` 方法

## 新TabBar结构

| Tab | 页面 | 图标 |
|-----|------|------|
| 首页 | pages/index/index | images/home.png |
| 品牌 | pages/brands/brands | images/brands.png |
| 统计 | pages/stats/stats | images/stats.png |

## 页面移除内容

### 首页 (pages/index/index)
- 移除 `.brand-link` 元素
- 移除 `goToBrands` 方法

### 品牌管理 (pages/brands/brands)
- 页面注册信息不变（已有）
- 从 `navigateTo` 跳转目标变为 Tab 目标