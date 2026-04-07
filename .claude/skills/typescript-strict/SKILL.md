# TypeScript 严格模式实践

> TypeScript 严格类型编程、高级类型技巧与工程规范

TypeScript 严格模式最佳实践：
- 始终启用 strict: true
- 禁用 any，使用 unknown + 类型守卫（type guard）收窄
- 优先 interface 定义对象形状，type 用于联合/交叉/映射类型
- 善用 discriminated union 替代大量可选字段
- 使用 satisfies 运算符做类型检查而不丢失字面量推导
- 使用 as const 声明常量对象和数组

高级类型技巧：
- Template Literal Types：处理字符串路由、事件名模式
- Conditional Types + infer：提取嵌套类型
- Mapped Types：批量转换接口字段
- Branded Types：防止语义不同但结构相同的 ID 混淆
- NoInfer<T>：阻止 TypeScript 从特定位置推断泛型

工程规范：
- 导出类型用 export type 避免运行时引入
- 避免 enum，用 as const + typeof 联合替代
- 函数重载签名从严到宽排列
- 善用 Record<K, V> 替代 { [key: string]: V }
- 泛型命名用有意义的名字：TItem 而非 T

## 示例

**输入:** 如何安全地处理 API 响应

**输出:**
推荐 discriminated union + 类型守卫：
```typescript
type ApiResult<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function isSuccess<T>(r: ApiResult<T>): r is Extract<ApiResult<T>, { status: 'success' }> {
  return r.status === 'success';
}
```


