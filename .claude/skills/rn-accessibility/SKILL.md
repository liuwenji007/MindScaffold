# rn-accessibility

> React Native 无障碍开发最佳实践，确保应用对视障、听障、运动障碍用户友好。遵循 WCAG 2.1 标准，覆盖 Accessibility API、屏幕阅读器适配、焦点管理等。

- **Compatibility:** React Native, Taro 3.x / 4.x (pre-Taro 5)
- **Version:** 1.0.0
- **Author:** HandsomeLiu
- **Impact:** medium
- **Tags:** react-native, accessibility, wcag, a11y, screen-reader

# React Native Accessibility Guide

本 Skill 提供 React Native 无障碍开发的最佳实践，遵循 WCAG 2.1 标准，确保应用对各类障碍用户友好。

## WCAG 2.1 核心原则

- **可感知（Perceivable）**：信息必须可被用户感知
- **可操作（Operable）**：界面组件必须可被用户操作
- **可理解（Understandable）**：信息和操作必须可被理解
- **健壮（Robust）**：内容与各种辅助技术兼容

## Accessibility API

### 核心属性

| 属性 | 用途 | 示例 |
|------|------|------|
| `accessibilityLabel` | 屏幕阅读器读取的文本 | `"提交按钮"` |
| `accessibilityHint` | 操作结果的额外说明 | `"点击提交表单"` |
| `accessibilityRole` | 元素角色 | `"button"` |
| `accessibilityState` | 当前状态 | `{ selected: true }` |
| `importantForAccessibility` | 重要性级别 | `"yes"` / `"no-hide-descendants"` |

### 常见 Role 值

- `button` - 按钮
- `link` - 链接
- `header` - 标题
- `image` - 图片
- `text` - 文本
- `search` - 搜索框
- `adjustable` - 可调节控件（如滑块）
- `tab` - 标签页
- `list` - 列表
- `checkbox` - 复选框

## Coding Rules

### 图片无障碍

```tsx
// 有意义的图片：提供 accessibilityLabel
<Image
  source={{ uri: 'https://...' }}
  accessibilityLabel="公司 logo"
  accessibilityRole="image"
/>

// 纯装饰性图片：隐藏屏幕阅读器
<Image
  source={{ uri: 'https://...' }}
  importantForAccessibility="no-hide-descendants"
/>
```

### 按钮/可点击元素

```tsx
// TouchableOpacity/Pressable
<Pressable
  accessibilityLabel="添加到购物车"
  accessibilityHint="点击将商品加入购物车"
  accessibilityRole="button"
  accessibilityState={{ disabled: isDisabled }}
  onPress={handlePress}
>
  <Text>添加</Text>
</Pressable>

// 禁用状态必须声明
<Pressable
  accessibilityState={{ disabled: true }}
  // 禁用时不响应 onPress
>
```

### 表单控件

```tsx
// TextInput
<TextInput
  accessibilityLabel="用户名"
  accessibilityHint="请输入您的用户名"
  placeholder="用户名"
/>

// 复选框/开关
<Switch
  accessibilityLabel="开启通知"
  accessibilityHint="切换通知开关状态"
  accessibilityRole="switch"
  accessibilityState={{ checked: isEnabled }}
  value={isEnabled}
  onValueChange={toggle}
/>
```

### 列表与导航

```tsx
// 列表项
<FlatList
  data={items}
  renderItem={({ item }) => (
    <Pressable
      accessibilityLabel={`${item.title}，价格 ${item.price}`}
      accessibilityRole="button"
    >
      {/* ... */}
    </Pressable>
  )}
/>

// 标签栏
<View accessibilityRole="tablist">
  {tabs.map((tab, i) => (
    <Pressable
      key={tab.id}
      accessibilityRole="tab"
      accessibilityState={{ selected: i === activeIndex }}
      accessibilityLabel={tab.label}
    >
      <Text>{tab.label}</Text>
    </Pressable>
  ))}
</View>
```

### 标题层级

```tsx
// 使用 accessibilityRole 标记标题层级
<Text accessibilityRole="header">一级标题</Text>

// 或配合 View 使用
<View accessibilityRole="header">
  <Text>设置页面</Text>
</View>
```

## 焦点管理

### 设置焦点

```tsx
import { AccessibilityInfo } from 'react-native';

// 检查屏幕阅读器是否启用
AccessibilityInfo.isScreenReaderEnabled().then((enabled) => {
  if (enabled) {
    // 发送无障碍公告
    AccessibilityInfo.announceForAccessibility('操作已完成');
  }
});
```

### 焦点顺序

```tsx
// 使用 ref 管理焦点顺序（部分平台支持）
const firstInputRef = useRef<TextInput>(null);

// 在适当时机设置焦点
useEffect(() => {
  AccessibilityInfo.isScreenReaderEnabled().then((enabled) => {
    if (enabled) {
      // Android: AccessibilityInfo.setAccessibilityFocus
    }
  });
}, []);
```

## 颜色对比度

遵循 WCAG 2.1 对比度要求：

- **普通文本**：至少 4.5:1
- **大文本（18px+ 或 14px bold）**：至少 3:1
- **非文本元素**：至少 3:1

使用工具验证对比度：
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

## Touch Target 尺寸

- 最小触控区域：**44x44 dp**（WCAG 2.1 Success Criterion 2.5.5）
- 确保按钮、链接等可交互元素有足够的触控空间

```tsx
// 使用 padding 扩大触控区域
<Pressable
  style={{ padding: 12 }}  // 内部元素 + padding ≥ 44
  accessibilityRole="button"
>
  <Text style={{ fontSize: 16 }}>按钮</Text>
</Pressable>
```

## 动态内容更新

```tsx
// 当内容变化时通知屏幕阅读器
useEffect(() => {
  if (dataLoaded) {
    AccessibilityInfo.announceForAccessibility(
      '数据加载完成，共 10 条结果'
    );
  }
}, [dataLoaded]);
```

## Read References

开发时建议参考：

- React Native 官方 Accessibility 文档
- Apple Human Interface Guidelines - Accessibility
- Android Accessibility Developer Guide
- WCAG 2.1 Guidelines (https://www.w3.org/WAI/WCAG21/quickref/)

## Delivery Checklist

- 所有交互元素有 accessibilityLabel
- 图片有 accessibilityLabel 或被隐藏
- 按钮有 accessibilityRole="button"
- 禁用状态有 accessibilityState={{ disabled: true }}
- 标题使用 accessibilityRole="header"
- 文本对比度 ≥ 4.5:1
- 触控区域 ≥ 44x44 dp
- 屏幕阅读器测试通过（VoiceOver / TalkBack）
