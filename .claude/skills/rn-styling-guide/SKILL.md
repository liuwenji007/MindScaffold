# rn-styling-guide

> React Native 样式开发指南，专注于 Flexbox 布局和跨端样式兼容。适用于 Taro 多端开发中需要 RN 兼容的场景，替代 css-layout 在跨端应用中的使用。

- **Compatibility:** React Native, Taro 3.x / 4.x (pre-Taro 5)
- **Version:** 1.0.0
- **Author:** HandsomeLiu
- **Impact:** high
- **Tags:** react-native, styling, flexbox, cross-platform, taro

# React Native Styling Guide

本 Skill 提供 React Native 样式开发的最佳实践，专注于 Flexbox 布局方案。**在 Taro 一码多端场景中替代 css-layout**，因为 css-layout 推荐的 Grid、Container Queries、vw/dvh 等特性在 RN 中完全不支持。

## Runtime Compatibility

| 特性 | Web/H5 | React Native | 建议 |
|------|---------|--------------|------|
| Flexbox | ✅ | ✅ | **唯一推荐的布局方案** |
| CSS Grid | ✅ | ❌ | 跨端项目禁用 |
| Container Queries | ✅ | ❌ | 跨端项目禁用 |
| vw/dvh 视口单位 | ✅ | ❌ | 跨端项目禁用 |
| clamp() | ✅ | ❌ | 跨端项目禁用 |
| position: sticky/fixed | ✅ | ❌ | 用 absolute 替代 |
| rem/em | ✅ | ❌ | 用数值或 px |

## Core Principles

### 1. Flexbox 是唯一跨端布局方案

React Native 只支持 Flexbox 布局，所有布局需求必须用 Flexbox 实现：

- 一维布局：`flexDirection: 'row'` 或 `'column'`
- 对齐：`justifyContent`, `alignItems`, `alignSelf`
- 弹性尺寸：`flex: 1`, `flexGrow`, `flexShrink`, `flexBasis`

### 2. 1:1 单位转换规则

Taro 会自动处理单位转换，在 RN 样式中：

- 设计稿 rpx → RN 实现用相同数值的 px
- 例如：设计稿 `32rpx` → RN 写 `32px` 或数值 `32`
- 不要手动添加缩放因子

### 3. 避免文本继承依赖

RN 中文本样式不会从父 View 继承：

- 所有可见文本必须包裹在 `Text` 组件中
- 文本样式直接声明在 `Text` 的 style 中
- 不要依赖父组件的 `fontSize`、`color` 等继承

## Coding Rules

### Style Declaration

```tsx
// ✅ 推荐：Flexbox + 数值单位
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,  // 数值，不要用字符串
  },
  text: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

// ❌ 避免：Grid、视口单位
const badStyles = {
  grid: {
    display: 'grid',  // RN 不支持
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  viewport: {
    width: '100vw',  // RN 不支持
    height: '100dvh',
  },
};
```

### Full-Row Layout

对于需要占满整行的元素：

```tsx
// ✅ 推荐：width 自动 + padding 外边距
container: {
  flexDirection: 'row',
  paddingHorizontal: 16,
  // width 默认 flex: 1 或 auto
}

// ❌ 避免：width: 100% + padding 导致溢出
badContainer: {
  width: '100%',
  paddingHorizontal: 16,  // 总宽度 > 100%
}
```

### Border Radius

```tsx
// ✅ 推荐：数值
borderRadius: 8

// ❌ 避免：字符串
borderRadius: '8px'  // RN 不接受
```

### Position 替代方案

```tsx
// sticky/fixed 需求 → 用 absolute + 预留空间替代
header: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 48,
  zIndex: 10,
}

content: {
  paddingTop: 48,  // 为 header 预留空间
}
```

## Platform-Specific Patterns

### 条件样式

```tsx
import { Platform } from '@tarojs/taro';

const styles = StyleSheet.create({
  shadow: Platform.select({
    // Web: CSS shadow
    web: {
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    // RN: 使用组件库的 shadow 实现
    rn: {
      // 不直接声明 boxShadow
    },
  }),
});
```

### 渐变处理

不使用 CSS `linear-gradient`：

```tsx
// 使用项目组件库
import { LinearGradient } from '@/components/linear-gradient';

<LinearGradient
  colors={['#FF6B6B', '#4ECDC4']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
  {/* content */}
</LinearGradient>
```

## Read References

使用本 Skill 时，建议同时参考：

- `definitions/skills/internal/taro41-multi-end-compat/references/rn-ui-hard-rules.md` — RN 布局硬性规则
- Taro 官方文档中 RN 样式适配章节

## Delivery Checklist

- 所有布局使用 Flexbox 实现
- 无 Grid、Container Queries、vw/dvh 使用
- borderRadius 为数值而非字符串
- 文本样式直接声明在 Text 组件
- position: sticky/fixed 已替换为 absolute + 预留空间
