# TabBar 图标资源说明

> **状态：图稿待调整** — 当前为临时 PNG，定稿后按端替换，不要长期依赖单一大图。

## 当前（临时）

- 根目录平铺：`home.png` / `history.png` / `tree.png` / `my.png`
- 由 `src/components/TabBar/tabIcons.ts` 统一引用
- 展示尺寸约 44×44px（设计稿 750 宽），源图建议导出 **96×96 或 128×128**

## 定稿后：分端资源（推荐目录）

```
src/assets/icons/
├── README.md           # 本说明
├── png/                # 小程序 / RN / 鸿蒙等（兼容性优先）
│   ├── home.png
│   ├── history.png
│   ├── tree.png
│   └── my.png
├── webp/               # 可选：仅 H5（或确认支持后再扩端）
│   └── ...
└── active/             # 可选：选中态独立图（无则继续用 CSS 透明度区分）
    └── png/
        └── ...
```

## 格式选择（备忘）

| 端 | 建议 | 备注 |
|----|------|------|
| H5 | PNG 或 WebP | WebP 体积更小 |
| 微信小程序 | PNG 为主 | `image` 支持 WebP 需基础库 ≥ 2.9.0；原生 tabBar `iconPath` 更常用 PNG |
| React Native | PNG 为主 | iOS WebP 需验证 RN 版本与解码 |
| 鸿蒙（Taro） | PNG 为主 | 真机验证后再考虑 WebP |

**不要默认全平台 WebP**；若分端不一致，在 `tabIcons.ts` 里按 `process.env.TARO_ENV` 分支。

## 接入步骤（图调整完成后）

1. 将定稿图标放入上表对应目录（替换同名文件）。
2. 修改 `src/components/TabBar/tabIcons.ts` 中的 import / `resolveTabIcon` 分支。
3. 在 H5、微信开发者工具、RN/鸿蒙（若启用）各测一遍 Tab 选中与未选中态。
4. 删除或归档根目录旧的大尺寸临时 PNG，避免打进包体。

## 相关代码

- `src/components/TabBar/index.tsx` — TabBar UI
- `src/components/TabBar/tabIcons.ts` — 图标路径与分端解析（**改图主要改这里**）
