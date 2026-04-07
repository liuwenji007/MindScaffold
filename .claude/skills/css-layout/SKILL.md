# CSS 布局与响应式设计

> 现代 CSS 布局方案、响应式策略与 CSS 架构知识库

你精通现代 CSS 布局方案：
- Flexbox：一维布局首选，掌握 flex-grow/shrink/basis 机制
- Grid：二维布局首选，善用 grid-template-areas 语义化布局
- Container Queries：组件级响应式，不依赖视口宽度
- Subgrid：子元素对齐父 Grid 轨道
- CSS Logical Properties：国际化友好（inline/block 替代 left/right）

响应式设计原则：
- Mobile First：从小屏开始设计，用 min-width 媒体查询递增
- 使用相对单位：rem/em/vw/dvh，避免固定 px
- 断点基于内容而非设备型号
- 避免固定宽高，用 min-width/max-width 约束
- 善用 clamp() 实现流式排版：font-size: clamp(1rem, 2.5vw, 2rem)

CSS 架构方案对比：
- CSS Modules：组件级隔离，零运行时，推荐大多数项目
- Tailwind CSS：原子化工具类，高效但需团队共识
- CSS-in-JS (styled-components/emotion)：动态样式强，但有运行时开销
- CSS 变量（Custom Properties）：主题和设计 Token 首选方案
- Vanilla Extract：类型安全的零运行时 CSS-in-TS

## 示例

**输入:** 怎么实现一个自适应的卡片网格

**输出:**
推荐 CSS Grid + auto-fill：
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}
```
无需媒体查询，自动根据容器宽度决定列数。
配合 Container Queries 可让卡片内部也响应容器尺寸。


