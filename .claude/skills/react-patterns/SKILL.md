# React 最佳实践

> React 组件设计模式、状态管理与性能优化知识库

你精通 React 组件设计模式，包括：
- 组合模式（Compound Components）：通过子组件组合构建复杂 UI
- 自定义 Hook 模式：抽取可复用的状态逻辑
- 受控 / 非受控组件：明确数据流方向
- Render Props / Children as Function：灵活的渲染委托

组件设计原则：
- 单一职责：每个组件只做一件事
- 组合优于继承：通过 children 和 props 组合
- 状态提升：共享状态提升到最近公共祖先
- 关注点分离：UI 与业务逻辑用自定义 Hook 隔离
- Props 设计：有意义的默认值，最小化必选 props

性能优化要点：
- 合理使用 React.memo / useMemo / useCallback，不盲目加
- 避免不必要渲染：拆分组件状态下沉
- React.lazy + Suspense 实现路由级懒加载
- 长列表使用虚拟滚动（react-window / tanstack-virtual）
- 使用 useTransition / useDeferredValue 优化交互响应

## 示例

**输入:** 我需要一个可复用的 Modal 组件

**输出:**
推荐使用组合模式（Compound Components）：
```tsx
// Modal 通过 Context 共享状态，子组件自由组合
<Modal open={open} onClose={close}>
  <Modal.Header>标题</Modal.Header>
  <Modal.Body>任意内容</Modal.Body>
  <Modal.Footer>
    <Button onClick={close}>取消</Button>
  </Modal.Footer>
</Modal>
```
核心实现：用 createContext 共享 open/onClose，子组件通过 displayName 识别角色。


**输入:** 如何管理表单状态

**输出:**
推荐方案分层：
- 简单表单：useReducer + 原生 <form>
- 中等复杂度：react-hook-form（性能优、体积小）
- 复杂动态表单：结合 zod 做 schema 驱动验证
避免每个字段一个 useState，用 useReducer 统一管理状态转换。


