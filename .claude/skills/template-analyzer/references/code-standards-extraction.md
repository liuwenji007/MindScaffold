# 代码规范提取方法

## 代码风格提取

### 缩进方式

**识别方法：**
1. 检查配置文件：
   - `.editorconfig` - 可能包含缩进配置
   - `.prettierrc` - Prettier 配置
   - `tsconfig.json` - TypeScript 配置（`indentSize`）
   - `package.json` - 可能包含缩进相关配置

2. 分析代码示例：
   - 统计代码中的缩进空格数
   - 检查是否使用 Tab 或空格
   - 注意：代码可能被格式化，优先查看配置文件

**常见配置：**
- 2 空格（React、Vue 项目常见）
- 4 空格（Python、Java 项目常见）
- Tab（部分项目使用）

### 引号风格

**识别方法：**
1. 检查 ESLint 配置：
   - `.eslintrc.*` 中的 `quotes` 规则
   - 可能的值：`"single"`、`"double"`、`"backtick"`

2. 检查 Prettier 配置：
   - `.prettierrc` 中的 `singleQuote` 选项

3. 分析代码示例：
   - 统计代码中单引号和双引号的使用
   - 注意：代码可能被格式化，优先查看配置文件

### 行尾分号

**识别方法：**
1. 检查 ESLint 配置：
   - `.eslintrc.*` 中的 `semi` 规则
   - 可能的值：`"always"`、`"never"`

2. 检查 Prettier 配置：
   - `.prettierrc` 中的 `semi` 选项

3. 分析代码示例：
   - 检查代码是否使用分号
   - 注意：代码可能被格式化，优先查看配置文件

### 代码格式化规则

**识别方法：**
1. 检查 Prettier 配置：
   - `.prettierrc` 或 `prettier.config.js`
   - 包含格式化规则（行宽、换行、尾随逗号等）

2. 检查编辑器配置：
   - `.editorconfig` - 编辑器通用配置
   - `.vscode/settings.json` - VS Code 配置

## 命名规范提取

### 变量命名

**识别方法：**
1. 分析代码示例：
   - 查看变量声明和使用的命名方式
   - 识别主要命名风格（camelCase、snake_case、PascalCase）

2. 检查代码检查工具配置：
   - ESLint 的 `camelcase` 规则
   - Pylint 的命名规则

**常见模式：**
- `camelCase` - JavaScript/TypeScript 常见
- `snake_case` - Python 常见
- `PascalCase` - 类名、组件名

### 函数命名

**识别方法：**
1. 分析代码示例：
   - 查看函数定义的命名方式
   - 识别命名模式（动词开头、命名风格）

2. 检查代码检查工具配置：
   - ESLint 的命名规则
   - 项目文档可能说明命名规范

**常见模式：**
- 动词开头：`getUser()`、`createOrder()`
- 布尔值：`isValid()`、`hasPermission()`
- 事件处理：`handleClick()`、`onSubmit()`

### 文件命名

**识别方法：**
1. 分析项目文件：
   - 统计文件命名风格
   - 识别主要命名模式

2. 检查项目文档：
   - README 可能说明文件命名规范

**常见模式：**
- `kebab-case` - `user-profile.tsx`
- `PascalCase` - `UserProfile.tsx`
- `camelCase` - `userProfile.tsx`
- `snake_case` - `user_profile.py`

### 常量命名

**识别方法：**
1. 分析代码示例：
   - 查看常量定义的命名方式
   - 识别命名风格（通常全大写）

2. 检查代码检查工具配置：
   - ESLint 的常量命名规则

**常见模式：**
- `UPPER_SNAKE_CASE` - `MAX_RETRY_COUNT`
- `PascalCase` - `DefaultConfig`（TypeScript 常量对象）

## 组织规范提取

### 导入顺序

**识别方法：**
1. 检查 ESLint 配置：
   - `eslint-plugin-import` 的排序规则
   - `import/order` 规则配置

2. 分析代码示例：
   - 查看导入语句的组织方式
   - 识别排序模式（第三方库、内部模块、相对路径等）

**常见模式：**
```javascript
// 1. 第三方库
import React from 'react';
import { Button } from 'antd';

// 2. 内部模块
import { api } from '@/services';
import { utils } from '@/utils';

// 3. 相对路径
import { Component } from './Component';
```

### 文件组织方式

**识别方法：**
1. 分析目录结构：
   - 查看文件在目录中的组织方式
   - 识别组织模式（按类型、按功能、按模块）

2. 检查项目文档：
   - README 可能说明文件组织规范

**常见模式：**
- 按类型组织：`components/`、`utils/`、`services/`
- 按功能组织：`user/`、`order/`、`product/`
- 按模块组织：`features/user/`、`features/order/`

### 注释风格

**识别方法：**
1. 分析代码示例：
   - 查看注释的编写方式
   - 识别注释风格（单行、多行、JSDoc 等）

2. 检查代码检查工具配置：
   - ESLint 的注释规则
   - JSDoc 配置

**常见模式：**
- 单行注释：`// 注释内容`
- 多行注释：`/* 注释内容 */`
- JSDoc：`/** 注释内容 */`
- Python docstring：`""" 注释内容 """`

### 文档规范

**识别方法：**
1. 检查项目文档：
   - README 文件的结构和格式
   - 文档目录的组织方式

2. 分析代码文档：
   - 查看代码中的文档注释
   - 识别文档生成工具（JSDoc、Sphinx 等）

## 配置文件提取

### ESLint 配置

**提取内容：**
- 规则配置（缩进、引号、分号等）
- 插件配置
- 扩展配置

**配置文件位置：**
- `.eslintrc.js`
- `.eslintrc.json`
- `.eslintrc.yaml`
- `package.json` 中的 `eslintConfig`

### Prettier 配置

**提取内容：**
- 格式化规则（缩进、引号、行宽等）
- 文件包含/排除规则

**配置文件位置：**
- `.prettierrc`
- `.prettierrc.json`
- `.prettierrc.js`
- `package.json` 中的 `prettier`

### TypeScript 配置

**提取内容：**
- 编译选项（`strict`、`target`、`module` 等）
- 路径别名配置
- 类型检查规则

**配置文件位置：**
- `tsconfig.json`
- `tsconfig.*.json`

### EditorConfig

**提取内容：**
- 缩进方式
- 字符编码
- 行尾序列
- 文件类型特定规则

**配置文件位置：**
- `.editorconfig`

## 提取策略

1. **优先读取配置文件**
   - 配置文件包含最准确的规范定义
   - 多个配置文件时，按优先级合并

2. **分析代码示例**
   - 代码示例反映实际使用的规范
   - 用于验证配置文件的有效性

3. **交叉验证**
   - 对比配置文件与代码示例
   - 识别不一致的地方并标注

4. **处理缺失配置**
   - 对于缺失的配置，基于代码示例推断
   - 标注推断的部分

5. **提取默认值**
   - 对于未明确配置的规则，使用框架默认值
   - 标注使用的默认值

## 输出格式

提取的代码规范应整理成结构化格式：

```yaml
code_standards:
  style:
    indent: 2
    indent_type: spaces
    quotes: single
    semicolon: false
    line_width: 100
    trailing_comma: es5
  naming:
    variables: camelCase
    functions: camelCase
    files: kebab-case
    constants: UPPER_SNAKE_CASE
    classes: PascalCase
  organization:
    import_order:
      - external
      - internal
      - relative
    file_structure: feature-based
  comments:
    style: jsdoc
    required: true
```

## 最佳实践

1. **配置文件优先**：优先从配置文件提取，更准确可靠
2. **代码示例验证**：使用代码示例验证配置的有效性
3. **标注不确定项**：对于推断的部分，明确标注
4. **保留原始配置**：保留原始配置文件路径，便于后续参考
5. **处理冲突**：当配置与代码不一致时，以配置为准并标注


