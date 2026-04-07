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

