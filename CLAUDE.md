

<!-- forge:activity:frontend-dev -->
# 💻 前端开发流程

> 覆盖 Web / 跨端 / 客户端壳工程的统一前端开发流程，通过技术栈标签控制节点激活与 Skill 挂载

**说明:** 详细 Skills 已安装到 `.claude/skills/`，本文件仅保留活动入口和索引。

## 流程节点

- 📋 **需求评审**
  - 梳理产品需求、明确验收标准、识别技术风险点
  - Skills: requirement-analysis
- 🏗️ **技术方案**
  - 制定技术方案、设计模块拆分、确定技术栈和架构方向
  - Skills: typescript-strict
- 🏗️ **项目搭建**
  - 初始化项目脚手架、配置工程化工具链、规范目录结构与基础依赖
  - Skills: typescript-strict, project-analysis, code-standards, template-analyzer
- 🎨 **UX 还原**
  - 高保真还原设计稿，关注像素精度、交互动效与视觉一致性
  - Skills: css-layout, web-accessibility, frontend-design
- 🧩 **组件开发** _(可并行: dev)_
  - 按照设计稿开发 UI 组件，遵循组件设计规范与复用原则
  - Skills: typescript-strict, react-patterns
- 🔌 **接口联调** _(可并行: dev)_
  - 对接后端接口，处理数据流转、错误边界和异常状态
  - Skills: typescript-strict, react-patterns
- 🔀 **跨端兼容适配**
  - 处理多端 API 差异、条件编译隔离、平台特有组件兼容，确保各端行为一致
  - Skills: taro41-multi-end-compat, typescript-strict
- 🔗 **多端联调**
  - 与客户端团队对齐壳工程版本、Bridge/JSI 接口，在真机上验证 JS 层与原生层协作
  - Skills: typescript-strict
- ⚡ **性能优化**
  - 分析页面加载性能、渲染性能，针对性地进行优化
  - Skills: react-best-practices
- 🔍 **Code Review**
  - 代码质量评审，关注可读性、性能、安全性和规范合规
  - Skills: typescript-strict, react-best-practices
- ✅ **测试验收**
  - 功能测试、兼容性测试、性能基线验收
- 🚀 **部署上线**
  - 构建产物、发布流程、灰度策略、线上监控确认

## 已安装 Skills

- `requirement-analysis` — requirement-analysis（`.claude/skills/requirement-analysis/SKILL.md`）
- `typescript-strict` — TypeScript 严格模式实践（`.claude/skills/typescript-strict/SKILL.md`）
- `react-patterns` — React 最佳实践（`.claude/skills/react-patterns/SKILL.md`）
- `taro41-multi-end-compat` — taro41-multi-end-compat（`.claude/skills/taro41-multi-end-compat/SKILL.md`）
- `project-analysis` — project-analysis（`.claude/skills/project-analysis/SKILL.md`）
- `code-standards` — code-standards（`.claude/skills/code-standards/SKILL.md`）
- `template-analyzer` — template-analyzer（`.claude/skills/template-analyzer/SKILL.md`）
- `css-layout` — CSS 布局与响应式设计（`.claude/skills/css-layout/SKILL.md`）
- `web-accessibility` — web-accessibility（`.claude/skills/web-accessibility/SKILL.md`）
- `frontend-design` — frontend-design（`.claude/skills/frontend-design/SKILL.md`）
- `react-best-practices` — react-best-practices（`.claude/skills/react-best-practices/SKILL.md`）
- `rn-styling-guide` — rn-styling-guide（`.claude/skills/rn-styling-guide/SKILL.md`）
- `rn-accessibility` — rn-accessibility（`.claude/skills/rn-accessibility/SKILL.md`）
<!-- /forge:activity:frontend-dev -->



<!-- forge:skill:skill-updater -->
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

<!-- /forge:skill:skill-updater -->


<!-- forge:skill:skill-creator -->
# skill-creator

> Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations.

- **License:** Complete terms in LICENSE.txt

# Skill Creator

This skill provides guidance for creating effective skills.

## About Skills

Skills are modular, self-contained packages that extend Claude's capabilities by providing
specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific
domains or tasks—they transform Claude from a general-purpose agent into a specialized agent
equipped with procedural knowledge that no model can fully possess.

### What Skills Provide

1. Specialized workflows - Multi-step procedures for specific domains
2. Tool integrations - Instructions for working with specific file formats or APIs
3. Domain expertise - Company-specific knowledge, schemas, business logic
4. Bundled resources - Scripts, references, and assets for complex and repetitive tasks

## Core Principles

### Concise is Key

The context window is a public good. Skills share the context window with everything else Claude needs: system prompt, conversation history, other Skills' metadata, and the actual user request.

**Default assumption: Claude is already very smart.** Only add context Claude doesn't already have. Challenge each piece of information: "Does Claude really need this explanation?" and "Does this paragraph justify its token cost?"

Prefer concise examples over verbose explanations.

### Set Appropriate Degrees of Freedom

Match the level of specificity to the task's fragility and variability:

**High freedom (text-based instructions)**: Use when multiple approaches are valid, decisions depend on context, or heuristics guide the approach.

**Medium freedom (pseudocode or scripts with parameters)**: Use when a preferred pattern exists, some variation is acceptable, or configuration affects behavior.

**Low freedom (specific scripts, few parameters)**: Use when operations are fragile and error-prone, consistency is critical, or a specific sequence must be followed.

Think of Claude as exploring a path: a narrow bridge with cliffs needs specific guardrails (low freedom), while an open field allows many routes (high freedom).

### Anatomy of a Skill

Every skill consists of a required SKILL.md file and optional bundled resources:

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter metadata (required)
│   │   ├── name: (required)
│   │   └── description: (required)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/          - Executable code (Python/Bash/etc.)
    ├── references/       - Documentation intended to be loaded into context as needed
    └── assets/           - Files used in output (templates, icons, fonts, etc.)
```

#### SKILL.md (required)

Every SKILL.md consists of:

- **Frontmatter** (YAML): Contains `name` and `description` fields. These are the only fields that Claude reads to determine when the skill gets used, thus it is very important to be clear and comprehensive in describing what the skill is, and when it should be used.
- **Body** (Markdown): Instructions and guidance for using the skill. Only loaded AFTER the skill triggers (if at all).

#### Bundled Resources (optional)

##### Scripts (`scripts/`)

Executable code (Python/Bash/etc.) for tasks that require deterministic reliability or are repeatedly rewritten.

- **When to include**: When the same code is being rewritten repeatedly or deterministic reliability is needed
- **Example**: `scripts/rotate_pdf.py` for PDF rotation tasks
- **Benefits**: Token efficient, deterministic, may be executed without loading into context
- **Note**: Scripts may still need to be read by Claude for patching or environment-specific adjustments

##### References (`references/`)

Documentation and reference material intended to be loaded as needed into context to inform Claude's process and thinking.

- **When to include**: For documentation that Claude should reference while working
- **Examples**: `references/finance.md` for financial schemas, `references/mnda.md` for company NDA template, `references/policies.md` for company policies, `references/api_docs.md` for API specifications
- **Use cases**: Database schemas, API documentation, domain knowledge, company policies, detailed workflow guides
- **Benefits**: Keeps SKILL.md lean, loaded only when Claude determines it's needed
- **Best practice**: If files are large (>10k words), include grep search patterns in SKILL.md
- **Avoid duplication**: Information should live in either SKILL.md or references files, not both. Prefer references files for detailed information unless it's truly core to the skill—this keeps SKILL.md lean while making information discoverable without hogging the context window. Keep only essential procedural instructions and workflow guidance in SKILL.md; move detailed reference material, schemas, and examples to references files.

##### Assets (`assets/`)

Files not intended to be loaded into context, but rather used within the output Claude produces.

- **When to include**: When the skill needs files that will be used in the final output
- **Examples**: `assets/logo.png` for brand assets, `assets/slides.pptx` for PowerPoint templates, `assets/frontend-template/` for HTML/React boilerplate, `assets/font.ttf` for typography
- **Use cases**: Templates, images, icons, boilerplate code, fonts, sample documents that get copied or modified
- **Benefits**: Separates output resources from documentation, enables Claude to use files without loading them into context

#### What to Not Include in a Skill

A skill should only contain essential files that directly support its functionality. Do NOT create extraneous documentation or auxiliary files, including:

- README.md
- INSTALLATION_GUIDE.md
- QUICK_REFERENCE.md
- CHANGELOG.md
- etc.

The skill should only contain the information needed for an AI agent to do the job at hand. It should not contain auxilary context about the process that went into creating it, setup and testing procedures, user-facing documentation, etc. Creating additional documentation files just adds clutter and confusion.

### Progressive Disclosure Design Principle

Skills use a three-level loading system to manage context efficiently:

1. **Metadata (name + description)** - Always in context (~100 words)
2. **SKILL.md body** - When skill triggers (<5k words)
3. **Bundled resources** - As needed by Claude (Unlimited because scripts can be executed without reading into context window)

#### Progressive Disclosure Patterns

Keep SKILL.md body to the essentials and under 500 lines to minimize context bloat. Split content into separate files when approaching this limit. When splitting out content into other files, it is very important to reference them from SKILL.md and describe clearly when to read them, to ensure the reader of the skill knows they exist and when to use them.

**Key principle:** When a skill supports multiple variations, frameworks, or options, keep only the core workflow and selection guidance in SKILL.md. Move variant-specific details (patterns, examples, configuration) into separate reference files.

**Pattern 1: High-level guide with references**

```markdown
# PDF Processing

## Quick start

Extract text with pdfplumber:
[code example]

## Advanced features

- **Form filling**: See [FORMS.md](FORMS.md) for complete guide
- **API reference**: See [REFERENCE.md](REFERENCE.md) for all methods
- **Examples**: See [EXAMPLES.md](EXAMPLES.md) for common patterns
```

Claude loads FORMS.md, REFERENCE.md, or EXAMPLES.md only when needed.

**Pattern 2: Domain-specific organization**

For Skills with multiple domains, organize content by domain to avoid loading irrelevant context:

```
bigquery-skill/
├── SKILL.md (overview and navigation)
└── reference/
    ├── finance.md (revenue, billing metrics)
    ├── sales.md (opportunities, pipeline)
    ├── product.md (API usage, features)
    └── marketing.md (campaigns, attribution)
```

When a user asks about sales metrics, Claude only reads sales.md.

Similarly, for skills supporting multiple frameworks or variants, organize by variant:

```
cloud-deploy/
├── SKILL.md (workflow + provider selection)
└── references/
    ├── aws.md (AWS deployment patterns)
    ├── gcp.md (GCP deployment patterns)
    └── azure.md (Azure deployment patterns)
```

When the user chooses AWS, Claude only reads aws.md.

**Pattern 3: Conditional details**

Show basic content, link to advanced content:

```markdown
# DOCX Processing

## Creating documents

Use docx-js for new documents. See [DOCX-JS.md](DOCX-JS.md).

## Editing documents

For simple edits, modify the XML directly.

**For tracked changes**: See [REDLINING.md](REDLINING.md)
**For OOXML details**: See [OOXML.md](OOXML.md)
```

Claude reads REDLINING.md or OOXML.md only when the user needs those features.

**Important guidelines:**

- **Avoid deeply nested references** - Keep references one level deep from SKILL.md. All reference files should link directly from SKILL.md.
- **Structure longer reference files** - For files longer than 100 lines, include a table of contents at the top so Claude can see the full scope when previewing.

## Skill Creation Process

Skill creation involves these steps:

1. Understand the skill with concrete examples
2. Plan reusable skill contents (scripts, references, assets)
3. Initialize the skill (run init_skill.py)
4. Edit the skill (implement resources and write SKILL.md)
5. Package the skill (run package_skill.py)
6. Iterate based on real usage

Follow these steps in order, skipping only if there is a clear reason why they are not applicable.

### Step 1: Understanding the Skill with Concrete Examples

Skip this step only when the skill's usage patterns are already clearly understood. It remains valuable even when working with an existing skill.

To create an effective skill, clearly understand concrete examples of how the skill will be used. This understanding can come from either direct user examples or generated examples that are validated with user feedback.

For example, when building an image-editor skill, relevant questions include:

- "What functionality should the image-editor skill support? Editing, rotating, anything else?"
- "Can you give some examples of how this skill would be used?"
- "I can imagine users asking for things like 'Remove the red-eye from this image' or 'Rotate this image'. Are there other ways you imagine this skill being used?"
- "What would a user say that should trigger this skill?"

To avoid overwhelming users, avoid asking too many questions in a single message. Start with the most important questions and follow up as needed for better effectiveness.

Conclude this step when there is a clear sense of the functionality the skill should support.

### Step 2: Planning the Reusable Skill Contents

To turn concrete examples into an effective skill, analyze each example by:

1. Considering how to execute on the example from scratch
2. Identifying what scripts, references, and assets would be helpful when executing these workflows repeatedly

Example: When building a `pdf-editor` skill to handle queries like "Help me rotate this PDF," the analysis shows:

1. Rotating a PDF requires re-writing the same code each time
2. A `scripts/rotate_pdf.py` script would be helpful to store in the skill

Example: When designing a `frontend-webapp-builder` skill for queries like "Build me a todo app" or "Build me a dashboard to track my steps," the analysis shows:

1. Writing a frontend webapp requires the same boilerplate HTML/React each time
2. An `assets/hello-world/` template containing the boilerplate HTML/React project files would be helpful to store in the skill

Example: When building a `big-query` skill to handle queries like "How many users have logged in today?" the analysis shows:

1. Querying BigQuery requires re-discovering the table schemas and relationships each time
2. A `references/schema.md` file documenting the table schemas would be helpful to store in the skill

To establish the skill's contents, analyze each concrete example to create a list of the reusable resources to include: scripts, references, and assets.

### Step 3: Initializing the Skill

At this point, it is time to actually create the skill.

Skip this step only if the skill being developed already exists, and iteration or packaging is needed. In this case, continue to the next step.

When creating a new skill from scratch, always run the `init_skill.py` script. The script conveniently generates a new template skill directory that automatically includes everything a skill requires, making the skill creation process much more efficient and reliable.

Usage:

```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

The script:

- Creates the skill directory at the specified path
- Generates a SKILL.md template with proper frontmatter and TODO placeholders
- Creates example resource directories: `scripts/`, `references/`, and `assets/`
- Adds example files in each directory that can be customized or deleted

After initialization, customize or remove the generated SKILL.md and example files as needed.

### Step 4: Edit the Skill

When editing the (newly-generated or existing) skill, remember that the skill is being created for another instance of Claude to use. Include information that would be beneficial and non-obvious to Claude. Consider what procedural knowledge, domain-specific details, or reusable assets would help another Claude instance execute these tasks more effectively.

#### Learn Proven Design Patterns

Consult these helpful guides based on your skill's needs:

- **Multi-step processes**: See references/workflows.md for sequential workflows and conditional logic
- **Specific output formats or quality standards**: See references/output-patterns.md for template and example patterns

These files contain established best practices for effective skill design.

#### Start with Reusable Skill Contents

To begin implementation, start with the reusable resources identified above: `scripts/`, `references/`, and `assets/` files. Note that this step may require user input. For example, when implementing a `brand-guidelines` skill, the user may need to provide brand assets or templates to store in `assets/`, or documentation to store in `references/`.

Added scripts must be tested by actually running them to ensure there are no bugs and that the output matches what is expected. If there are many similar scripts, only a representative sample needs to be tested to ensure confidence that they all work while balancing time to completion.

Any example files and directories not needed for the skill should be deleted. The initialization script creates example files in `scripts/`, `references/`, and `assets/` to demonstrate structure, but most skills won't need all of them.

#### Update SKILL.md

**Writing Guidelines:** Always use imperative/infinitive form.

##### Frontmatter

Write the YAML frontmatter with `name` and `description`:

- `name`: The skill name
- `description`: This is the primary triggering mechanism for your skill, and helps Claude understand when to use the skill.
  - Include both what the Skill does and specific triggers/contexts for when to use it.
  - Include all "when to use" information here - Not in the body. The body is only loaded after triggering, so "When to Use This Skill" sections in the body are not helpful to Claude.
  - Example description for a `docx` skill: "Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. Use when Claude needs to work with professional documents (.docx files) for: (1) Creating new documents, (2) Modifying or editing content, (3) Working with tracked changes, (4) Adding comments, or any other document tasks"

Do not include any other fields in YAML frontmatter.

##### Body

Write instructions for using the skill and its bundled resources.

### Step 5: Packaging a Skill

Once development of the skill is complete, it must be packaged into a distributable .skill file that gets shared with the user. The packaging process automatically validates the skill first to ensure it meets all requirements:

```bash
scripts/package_skill.py <path/to/skill-folder>
```

Optional output directory specification:

```bash
scripts/package_skill.py <path/to/skill-folder> ./dist
```

The packaging script will:

1. **Validate** the skill automatically, checking:

   - YAML frontmatter format and required fields
   - Skill naming conventions and directory structure
   - Description completeness and quality
   - File organization and resource references

2. **Package** the skill if validation passes, creating a .skill file named after the skill (e.g., `my-skill.skill`) that includes all files and maintains the proper directory structure for distribution. The .skill file is a zip file with a .skill extension.

If validation fails, the script will report the errors and exit without creating a package. Fix any validation errors and run the packaging command again.

### Step 6: Iterate

After testing the skill, users may request improvements. Often this happens right after using the skill, with fresh context of how the skill performed.

**Iteration workflow:**

1. Use the skill on real tasks
2. Notice struggles or inefficiencies
3. Identify how SKILL.md or bundled resources should be updated
4. Implement changes and test again

---

## 参考: workflows.md

# Workflow Patterns

## Sequential Workflows

For complex tasks, break operations into clear, sequential steps. It is often helpful to give Claude an overview of the process towards the beginning of SKILL.md:

```markdown
Filling a PDF form involves these steps:

1. Analyze the form (run analyze_form.py)
2. Create field mapping (edit fields.json)
3. Validate mapping (run validate_fields.py)
4. Fill the form (run fill_form.py)
5. Verify output (run verify_output.py)
```

## Conditional Workflows

For tasks with branching logic, guide Claude through decision points:

```markdown
1. Determine the modification type:
   **Creating new content?** → Follow "Creation workflow" below
   **Editing existing content?** → Follow "Editing workflow" below

2. Creation workflow: [steps]
3. Editing workflow: [steps]
```

## 参考: output-patterns.md

# Output Patterns

Use these patterns when skills need to produce consistent, high-quality output.

## Template Pattern

Provide templates for output format. Match the level of strictness to your needs.

**For strict requirements (like API responses or data formats):**

```markdown
## Report structure

ALWAYS use this exact template structure:

# [Analysis Title]

## Executive summary
[One-paragraph overview of key findings]

## Key findings
- Finding 1 with supporting data
- Finding 2 with supporting data
- Finding 3 with supporting data

## Recommendations
1. Specific actionable recommendation
2. Specific actionable recommendation
```

**For flexible guidance (when adaptation is useful):**

```markdown
## Report structure

Here is a sensible default format, but use your best judgment:

# [Analysis Title]

## Executive summary
[Overview]

## Key findings
[Adapt sections based on what you discover]

## Recommendations
[Tailor to the specific context]

Adjust sections as needed for the specific analysis type.
```

## Examples Pattern

For skills where output quality depends on seeing examples, provide input/output pairs:

```markdown
## Commit message format

Generate commit messages following these examples:

**Example 1:**
Input: Added user authentication with JWT tokens
Output:
```
feat(auth): implement JWT-based authentication

Add login endpoint and token validation middleware
```

**Example 2:**
Input: Fixed bug where dates displayed incorrectly in reports
Output:
```
fix(reports): correct date formatting in timezone conversion

Use UTC timestamps consistently across report generation
```

Follow this style: type(scope): brief description, then detailed explanation.
```

Examples help Claude understand the desired style and level of detail more clearly than descriptions alone.

<!-- /forge:skill:skill-creator -->
