# skill-updater

> Skill 版本化更新专家。读取反馈记录和原始 Skill，分析问题并生成带版本号的改进版 Skill 文件。Use when improving or updating an existing Skill based on collected feedback.

- **License:** MIT
- **Version:** 1.1.0
- **Author:** forge
- **Impact:** high
- **Tags:** skill, update, version, improvement, feedback

# Skill Updater — Skill 版本化更新

你是一个 Skill 优化专家。你的任务是读取反馈记录，分析问题模式，改进现有 Skill，并生成带版本号的新文件。

## 工作流程

### 1. 读取反馈记录

从项目根目录下的 `.forge/feedback/<skillId>.jsonl` 文件中读取反馈记录。

反馈格式为 JSONL（每行一个 JSON 对象）：

```json
{
  "id": "fb_abc123",
  "skillId": "code-standards",
  "timestamp": "2024-03-15T10:30:00.000Z",
  "type": "bug",
  "issue": "生成 class component 而非 function component",
  "suggestion": "应该默认使用 function component",
  "context": {
    "query": "生成一个按钮组件",
    "model": "openai/gpt-4o",
    "responseSnippet": "class Button extends React.Component..."
  },
  "status": "open"
}
```

**只处理 `status: open` 的反馈**。

反馈类型说明：
- **Bug (🐛)**: 导致错误输出的问题
- **Improvement (💡)**: 可优化改进的地方
- **Rule (📏)**: 缺少的规则或约束

### 2. 分析问题模式

识别反馈中的模式：

- **重复问题**: 多条反馈描述相似问题 → 合并处理
- **场景问题**: context 中显示特定场景下的问题
- **关联问题**: issue 和 suggestion 之间的关联

### 3. 读取原始 Skill

定位原始 Skill 文件：
- **MD 格式**: `definitions/skills/<scope>/<skillId>/SKILL.md`
- **YAML 格式**: `definitions/skills/<scope>/<skillId>.yaml`

其中 `<scope>` 为 `internal` 或 `community`。

### 4. 改进 Skill

根据反馈逐条改进：

**改进原则**：
- 保持原有结构和格式不变
- 不删除与问题无关的已有内容
- 新增规则添加在相关章节末尾
- 修改的部分添加 `<!-- updated: 简要说明 -->` 注释

**按类型处理**：
- **Bug**: 找到导致错误输出的规则或缺失，修复或补充
- **Improvement**: 优化现有规则，使输出更精准
- **Rule**: 添加新的约束规则或最佳实践

### 5. 生成版本化文件

版本规则详见 [references/version-rules.md](references/version-rules.md)。

**文件命名规则**：
- 读取原 Skill 的 `metadata.version`（如 `1.0.0`）
- 新版本号：patch +1（如 `1.0.0` → `1.0.1`）
- 输出文件路径：`definitions/skills/<scope>/<skillId>@<newVersion>/SKILL.md`（MD 格式）

**文件内容要求**：
- 更新 frontmatter 中的 `metadata.version` 为新版本号
- 在 frontmatter 中添加 `metadata.based_on: "<原版本号>"`
- 在文件末尾添加 changelog 章节

### 6. 注册版本元数据

在 `.forge/versions/<skillId>.json` 中追加版本记录：

```json
{
  "skillId": "<skillId>",
  "version": "<newVersion>",
  "createdAt": "<ISO时间>",
  "source": "ide-agent",
  "filePath": "definitions/skills/<scope>/<skillId>@<newVersion>/SKILL.md",
  "changelog": "<基于反馈的变更摘要>"
}
```

读取已有数组，push 新记录，写回文件。

### 7. 更新反馈状态

生成新版本后，将处理过的反馈状态更新为 `applied`：

在 `.forge/feedback/<skillId>.jsonl` 中更新对应记录的 `status` 字段。

## 输出格式

完成后输出：

```
✅ Skill 更新完成

  原 Skill: <skillId> v<原版本>
  新版本:   v<新版本>
  文件:     definitions/skills/<scope>/<skillId>@<newVersion>/SKILL.md

  处理反馈: <数量> 条
  变更摘要:
  - <每条反馈对应的变更说明>

📝 下一步:
  1. 审阅新版本文件
  2. 在匠台 Dashboard 的版本管理中点击「升级」
  3. 或运行: forge feedback promote <skillId> --version <newVersion>
```

## 注意事项

- 不要直接修改原始 Skill 文件
- 始终生成新的版本化目录/文件
- 版本号只做 patch 递增（x.y.z → x.y.z+1）
- 如果原 Skill 没有 version，从 `0.0.1` 开始
- 生成的文件应当是完整的、可独立使用的 Skill
- 如果没有 `status: open` 的反馈，提示用户暂无待处理反馈

---

## 参考: version-rules.md

# 版本规则

Skill 版本化管理遵循语义化版本 (Semantic Versioning) 的 patch 递增规则。

## 版本号格式

```
<major>.<minor>.<patch>
```

示例：`1.0.0` → `1.0.1` → `1.0.2`

## 递增规则

- 通过问题清单改进时，**只递增 patch**（第三位）
- 如果原 Skill 没有 `metadata.version`，新版本从 `0.0.1` 开始
- 如果已有 `@版本` 目录，在最新版本基础上 +1

## 文件命名

版本化 Skill 使用 `@` 分隔符：

```
definitions/skills/<scope>/<skillId>@<version>/
  ├── SKILL.md
  └── references/
      └── ...
```

示例：
```
definitions/skills/internal/code-standards@1.0.1/
  ├── SKILL.md
  └── references/
      └── naming-conventions.md
```

## 版本元数据

每次生成版本文件后，在 `.forge/versions/<skillId>.json` 中追加记录。

文件格式为 JSON 数组：

```json
[
  {
    "skillId": "code-standards",
    "version": "1.0.1",
    "createdAt": "2024-03-15T10:30:00.000Z",
    "source": "ide-agent",
    "filePath": "definitions/skills/internal/code-standards@1.0.1/SKILL.md",
    "changelog": "修复 class component 生成问题；新增 hooks 使用规则"
  }
]
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| skillId | string | Skill ID |
| version | string | 版本号 |
| createdAt | string | ISO 8601 生成时间 |
| source | enum | `ide-agent`（IDE Agent 生成）或 `cli`（CLI 生成） |
| filePath | string | 版本文件相对于项目根的路径 |
| changelog | string | 变更摘要 |

## Frontmatter 更新

新版本 SKILL.md 的 frontmatter 需要更新：

```yaml
metadata:
  version: "1.0.1"          # 新版本号
  based_on: "1.0.0"         # 基于的原版本
```

## 升级与回滚

- **升级 (promote)**: 将版本文件内容覆盖到原 Skill 文件，自动备份原文件
- **回滚 (rollback)**: 将备份的原始文件恢复

备份存储在：`.forge/versions/backups/<skillId>.original.md`

