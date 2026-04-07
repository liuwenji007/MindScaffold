# web-accessibility

> Web 无障碍（WCAG 2.2）合规审查规则集，涵盖语义化 HTML、键盘导航、ARIA 属性与颜色对比度。Use when building UI components, reviewing accessibility compliance, or fixing a11y audit issues。

- **License:** MIT
- **Compatibility:** HTML5, React 18+, Vue 3+
- **Version:** 1.0.0
- **Author:** forge-community
- **Impact:** high
- **Tags:** accessibility, a11y, wcag, aria, semantic-html

# Web 无障碍合规指南（WCAG 2.2）

帮助 Agent 生成符合 WCAG 2.2 AA 级别的无障碍代码，确保所有用户都能正常使用 Web 应用。

## When to Use

- Use when generating HTML/JSX component code
- Use when reviewing code for accessibility compliance
- Use when fixing accessibility audit issues (axe, Lighthouse)
- Use when building form, modal, or navigation components

## Core Rules

### 1. 语义化 HTML 优先

```tsx
// ❌ 滥用 div
<div onClick={handleClick}>提交</div>
<div class="header">...</div>

// ✅ 使用语义化标签
<button onClick={handleClick}>提交</button>
<header>...</header>
```

**语义化标签对照表：**
| 替代 div/span | 使用 |
|--------------|------|
| 可点击区域 | `<button>` 或 `<a>` |
| 页头 | `<header>` |
| 导航 | `<nav>` |
| 主内容 | `<main>` |
| 侧边栏 | `<aside>` |
| 页脚 | `<footer>` |
| 独立内容块 | `<article>` |
| 内容分区 | `<section>` |

### 2. 键盘导航

所有交互元素必须支持键盘操作：

```tsx
// ✅ 自定义交互组件的键盘支持
function DropdownMenu() {
  return (
    <div
      role="menu"
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown') focusNext();
        if (e.key === 'ArrowUp') focusPrev();
        if (e.key === 'Escape') close();
      }}
    >
      <button role="menuitem" tabIndex={0}>选项 1</button>
      <button role="menuitem" tabIndex={-1}>选项 2</button>
    </div>
  );
}
```

- Tab 键可到达所有交互元素
- Enter/Space 激活按钮和链接
- Escape 关闭弹出层
- 箭头键在列表/菜单中导航
- 焦点顺序符合视觉阅读顺序

### 3. ARIA 属性正确使用

```tsx
// ✅ 图标按钮必须有 aria-label
<button aria-label="关闭对话框" onClick={onClose}>
  <CloseIcon />
</button>

// ✅ 表单控件关联 label
<label htmlFor="email">邮箱</label>
<input id="email" type="email" aria-required="true" />

// ✅ 动态区域使用 aria-live
<div aria-live="polite" role="status">
  {message && <p>{message}</p>}
</div>

// ✅ 展开/收起状态
<button aria-expanded={isOpen} aria-controls="panel-1">
  详情
</button>
<div id="panel-1" role="region" hidden={!isOpen}>...</div>
```

**ARIA 原则：**
1. 能用原生 HTML 就不用 ARIA
2. 不改变原生语义（`<button role="heading">` 是错误的）
3. 所有 ARIA 交互元素必须键盘可用

### 4. 图片和媒体

```tsx
// ✅ 有意义的图片提供 alt 文本
<img src="chart.png" alt="2024年Q3销售额环比增长23%" />

// ✅ 装饰性图片使用空 alt
<img src="divider.svg" alt="" role="presentation" />

// ✅ 视频提供字幕
<video controls>
  <source src="demo.mp4" type="video/mp4" />
  <track kind="captions" src="captions.vtt" srclang="zh" label="中文字幕" />
</video>
```

### 5. 颜色与对比度

- 文本与背景对比度 ≥ 4.5:1（正常文本）或 ≥ 3:1（大文本 18px+）
- 不仅靠颜色传达信息（如错误状态同时用颜色 + 图标 + 文本）
- 焦点指示器对比度 ≥ 3:1

```css
/* ✅ 高对比度焦点样式 */
:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}
```

### 6. 模态框无障碍

```tsx
// ✅ 模态框的无障碍实现要点
<dialog
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  onKeyDown={(e) => e.key === 'Escape' && onClose()}
>
  <h2 id="dialog-title">确认删除</h2>
  <p>此操作不可撤销。</p>
  <button onClick={onClose}>取消</button>
  <button onClick={onConfirm} autoFocus>确认</button>
</dialog>
```

- 打开时焦点移入模态框
- 关闭时焦点返回触发元素
- Tab 键焦点锁定在模态框内（focus trap）

## Best Practices

- ✅ 每个页面有且仅有一个 `<h1>`，标题层级不跳级
- ✅ 使用 `prefers-reduced-motion` 尊重用户的动效偏好
- ✅ 表单错误信息与对应字段关联（`aria-describedby`）
- ✅ 加载状态使用 `aria-busy="true"`
- ❌ 不使用 `tabIndex > 0`
- ❌ 不隐藏焦点样式（`outline: none` 需提供替代方案）
- ❌ 不自动播放音频/视频

## Common Pitfalls

- **Problem:** 使用 CSS `display: none` 隐藏的内容在屏幕阅读器中也消失
  **Solution:** 使用 `sr-only` 类（视觉隐藏但屏幕阅读器可读）

- **Problem:** SPA 页面切换后屏幕阅读器无感知
  **Solution:** 使用 `aria-live="polite"` 区域通告页面变化，或管理焦点到新内容
