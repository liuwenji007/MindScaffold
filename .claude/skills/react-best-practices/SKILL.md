# react-best-practices

> React 生产级最佳实践规则集，涵盖组件设计、性能优化、状态管理与安全防护。Use when building React applications, reviewing React code, or optimizing React performance。

- **License:** MIT
- **Compatibility:** React 18+, TypeScript 5+
- **Version:** 1.0.0
- **Author:** forge-community
- **Impact:** critical
- **Tags:** react, performance, architecture, security

# React 生产级最佳实践

基于 Vercel/Next.js 团队经验和社区最佳实践的综合规则集，按 impact 等级排序，帮助 Agent 在生成 React 代码时做出最优决策。

## When to Use

- Use when generating or reviewing React component code
- Use when optimizing React application performance
- Use when setting up React project architecture
- Use when debugging React rendering issues

## Critical Rules（必须遵守）

### 1. 避免不必要的 useEffect

```tsx
// ❌ 用 useEffect 同步派生状态
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// ✅ 直接计算派生值
const fullName = `${firstName} ${lastName}`;
```

### 2. 使用 key 重置组件而非 useEffect

```tsx
// ❌ useEffect 重置状态
useEffect(() => { setInput(''); }, [userId]);

// ✅ 用 key 让 React 重建组件
<EditProfile key={userId} />
```

### 3. 组件单一职责

每个组件只做一件事。如果组件超过 200 行或有超过 5 个 props，考虑拆分。

### 4. 正确的错误边界

```tsx
// ✅ 每个功能模块包裹独立的 ErrorBoundary
<ErrorBoundary fallback={<ChartError />}>
  <Dashboard />
</ErrorBoundary>
```

## High Impact Rules（强烈推荐）

### 5. 状态下沉，避免全局重渲染

```tsx
// ❌ 状态放在父组件，导致所有子组件重渲染
function Page() {
  const [isOpen, setIsOpen] = useState(false);
  return <><ExpensiveTree /><Modal open={isOpen} /></>;
}

// ✅ 状态下沉到需要它的组件
function Page() {
  return <><ExpensiveTree /><ModalToggle /></>;
}
```

### 6. 合理使用 React.memo

仅在以下场景使用 `React.memo`：
- 组件渲染开销大（复杂 DOM 树、图表、列表）
- 父组件频繁更新但子组件 props 稳定
- 已通过 React DevTools Profiler 确认是性能瓶颈

### 7. 使用 useTransition 优化交互

```tsx
// ✅ 非紧急更新不阻塞用户输入
const [isPending, startTransition] = useTransition();
function handleSearch(query: string) {
  setInput(query); // 紧急：立即更新输入框
  startTransition(() => {
    setSearchResults(filterData(query)); // 非紧急：可延迟
  });
}
```

### 8. 列表渲染使用稳定 key

```tsx
// ❌ 使用 index 作为 key
items.map((item, index) => <Item key={index} />)

// ✅ 使用稳定唯一标识
items.map((item) => <Item key={item.id} />)
```

### 9. 懒加载路由和重型组件

```tsx
// ✅ 路由级懒加载
const Dashboard = lazy(() => import('./pages/Dashboard'));

// ✅ 大型组件条件加载
const HeavyChart = lazy(() => import('./components/HeavyChart'));
```

## Medium Impact Rules（推荐遵循）

### 10. 自定义 Hook 抽取复用逻辑

当两个以上组件共享相同的状态逻辑时，提取为自定义 Hook。命名以 `use` 开头，Hook 内部可组合其他 Hook。

### 11. 使用组合模式替代 props drilling

超过 2 层的 props 传递，考虑：
1. 组件组合（children / render props）
2. Context（低频更新数据）
3. 状态管理库（高频更新、跨模块共享）

### 12. 表单使用受控组件 + 表单库

推荐 `react-hook-form` 或 `@tanstack/react-form` 处理复杂表单。避免手写大量 `useState` + `onChange`。

## Common Pitfalls

- **Problem:** 在 useEffect 中发请求但没处理竞态
  **Solution:** 使用 AbortController 或 TanStack Query 管理请求生命周期

- **Problem:** Context 值变化导致所有消费者重渲染
  **Solution:** 拆分 Context（读写分离），或使用 `useSyncExternalStore`

- **Problem:** useCallback/useMemo 到处用，代码可读性下降
  **Solution:** 先用 React DevTools Profiler 定位瓶颈，再有针对性地优化
