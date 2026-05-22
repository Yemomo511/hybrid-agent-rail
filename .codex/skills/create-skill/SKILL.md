---
name: create-skill
description: 创建有效 Skill 的指南。当用户想创建新 Skill，或更新现有 Skill，以通过专门知识、工作流或工具集成扩展 Agent 能力时，应使用此 Skill。
metadata:
  short-description: 创建或更新 Skill
---

# Create Skill

这个 Skill 用于指导如何创建有效的 Skill。

## 关于 Skill

Skill 是模块化、自包含的文件夹，用于通过专门知识、工作流和工具扩展 Agent 的能力。可以把它们理解为特定领域或任务的“入门指南”：它们把一个普通 Agent 从通用 Agent 转换为专门的跨端 Agent，让 Agent 具备模型本身无法完全掌握的流程性知识。

### Skill 提供什么

1. 跨端专门工作流 - 面向跨端特定领域的多步骤流程
2. 跨端工具集成 - 针对特定的跨端工具进行说明，如 Expo, CI/CD 等
3. 跨端领域知识 - 跨端特定知识如通信桥， 原生模块， 业务逻辑等
4. 捆绑资源 - 面向复杂或重复任务的脚本、参考资料和资产

## 核心原则

### 简洁是关键

上下文窗口是一种公共资源。Skill 会和 Agent 所需的其他所有内容共享上下文窗口：系统提示、对话历史、其他 Skill 的元数据，以及用户当前的实际请求。

**默认假设：Agent 已经非常聪明。** 只添加 Agent 尚不具备的上下文。审视创建的 Skill 的每一段信息：“Agent 真的需要这段解释吗？”以及“这段内容值得占用这些 token 吗？”

**务必优先使用简洁示例，而不是冗长解释。**

### 设置合适的自由度

根据任务的脆弱程度和变化空间，匹配说明的具体程度：

**高自由度（文本说明）**：当多种方案都有效、决策依赖上下文，或需要启发式判断时使用。

**中自由度（伪代码或带参数脚本）**：当存在推荐模式、允许部分变化，或配置会影响行为时使用。

**低自由度（具体脚本、少量参数）**：当操作脆弱且容易出错、一致性非常关键，或必须遵循特定顺序时使用。

可以把 Agent 想象成正在野外探险：狭窄桥梁和悬崖需要明确护栏（低自由度），开阔平原则允许多种路线（高自由度）。

### Skill 的组成

每个 Skill 都由必需的 SKILL.md 文件和可选的捆绑资源组成：

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter metadata (required)
│   │   ├── name: (required)
│   │   └── description: (required)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/          - 可执行脚本
    ├── references/       - 按需加载的文档和参考资料
    └── assets/           - 最终产物使用的模板、图片、样板等资产
```

#### SKILL.md（必需）

每个 SKILL.md 都包含：

- **Frontmatter**（YAML）：包含 `name`, `description` 字段。Agent 只会读取这些字段来判断何时使用该 Skill，因此必须清晰、完整地描述这个 Skill 是什么，以及应该在什么情况下使用。
- **正文**（Markdown）：使用该 Skill 的说明和指导。只有在 Skill 触发之后才会加载（如果触发的话）。

#### 元数据（推荐）
元数据作为 Skill 描述的补足，**不要对 Skill Description 本身做不必要的补充**，更多的应该描述其更多的使用场景，以确保智能体能准确的调用该 Skill。
- 默认不要写 `metadata`。只有存在明确版本适用边界或强环境前提时才写，通用知识、选型指南、流程方法论不要写。
- `metadata.version`：只用于说明当前 Skill 的知识只针对某个跨端框架的特定版本或版本区间。例如 RN 原生模块从 RN 0.74 之后官方更推荐 TurboModule，因此介绍 TurboModule 的 Skill 可以写 `React Native >= 0.74`。
- `metadata.env`：只用于说明当前 Skill 要求项目已经具备某个强配置或环境前提。例如“已启用 React Native New Architecture”“已配置 Expo CNG”。如果 Skill 不要求项目开启某个配置，不要写此项。

#### Upstream Skill（用户明确说明依赖其他 Skill 时才书写）
`Upstream Skill` 只表示当前 Skill 依赖并补充另一个 Skill。它不是普通文档、API 页面、模块路径或参考资料来源。

- 只有用户明确说明该 Skill 依赖其他 Skill 时，创建的 Skill 才应说明此项。
- 该项应填写上游 Skill 名称或 Skill bundle URL。
- 普通文档、API 页面、模块说明、框架资料应放入 `references/` 或正文参考说明，**不得**写入 `Upstream Skill`。
- 请假设上游 Skill 很强大，能够控制基础流程；补充知识时反问自己缺失这些内容时上游 Skill 是否仍能正常运行。

#### Curated Skill 禁止修改
`create-skill` 不能创建、修改或校验 curated Skill。curated Skill 的模板非常严格，通常包含 `> Curated from ...`，例如 `skills/flutter/*/SKILL.md`。

- 遇到 curated Skill 时，改用 `create-curated-skill`。
- 不要把 curated Skill 改写成普通 repo-local Skill 模板。
- 不要删除或改写 curated Skill 的 `> Curated from ...`、`## Source`、严格 `## How to use` 结构。

#### Skill 分类目录
普通 repo-local Skill 不直接放在 `skills/` 根目录，必须先判断它属于哪个分类目录：

- React Native 专属：放在 `skills/react-native/<skill-name>/`。
- 语言专属：放在对应语言目录，例如 `skills/dart/<skill-name>/`、`skills/kotlin/<skill-name>/`。
- 跨端通用知识：放在 `skills/share/<skill-name>/`。
- 新的单独框架：在 `skills/<framework>/` 下新建分类目录，再放入该 Skill。
- Flutter 官方 curated Skill 仍由 `create-curated-skill` 维护；不要用 `create-skill` 写入 `skills/flutter/*`。

当 `init_skill.py --path skills` 时必须传入 `--category`，避免把普通 Skill 误放到根目录。

#### 捆绑资源（可选）

##### Scripts（`scripts/`）

可执行代码（Python/Bash 等），用于需要确定性可靠性或会被重复编写的任务。

- **何时包含**：当同一段代码会被反复重写，或需要确定性可靠性时
- **示例**：用于 PDF 旋转任务的 `scripts/rotate_pdf.py`
- **收益**：节省 token、结果确定，并且可以在不加载到上下文窗口的情况下执行
- **注意**：Agent 可能仍需读取脚本，以便进行修补或适配特定环境

##### References（`references/`）

文档和参考资料，用于在需要时加载到上下文中，辅助 Agent 的流程和思考。

- **何时包含**：当 Agent 进行跨端工作时应该参考某些文档
- **示例**：书写 RN 通信桥模板的 的 `references/rn_turbo.md`、框架更新日志的 `references/rn_update.md`、产品/公司核心理念的 `references/flutter_idea.md`、RN Api 使用规范的 `references/api_docs.md`
- **使用场景**：数据库 schema、API 文档、领域知识、框架政策、详细工作流指南
- **收益**：让 SKILL.md 保持精简，只在 Agent 判断需要时加载
- **最佳实践**：如果文件较大（超过 10k 词），在 SKILL.md 中包含 grep 搜索模式
- **避免重复**：信息应只存在于 SKILL.md 或 references 文件中，不要两边都放。除非某些内容确实是 Skill 的核心，否则优先放入 references 文件；这样既能保持 SKILL.md 精简，又能避免占用上下文窗口，同时保持信息可发现。SKILL.md 只保留必要的流程说明和工作流指导；详细参考资料、schema 和示例应移入 references 文件。

##### Assets（`assets/`）

不打算加载到上下文中，而是用于 Agent 最终产物的文件。

- **何时包含**：当 Skill 需要使用某些文件生成最终输出时
- **示例**：品牌资产 `assets/logo.png`、PowerPoint 模板 `assets/slides.pptx`、HTML/React 样板 `assets/frontend-template/`、字体 `assets/font.ttf`
- **使用场景**：模板、图片、图标、样板代码、字体、会被复制或修改的示例文档
- **收益**：把输出资源与文档分离，让 Agent 可以使用文件而不必把它们加载到上下文中

#### Skill 中不应包含什么

Skill 只应包含直接支持其功能的必要文件。不要创建多余文档或辅助文件，包括：

- README.md
- INSTALLATION_GUIDE.md
- QUICK_REFERENCE.md
- CHANGELOG.md
- etc.

Skill 应只包含 AI Agent 完成当前工作所需的信息。它不应包含 Skill 创建过程、安装和测试流程、用户向文档等额外上下文。创建额外文档文件只会增加混乱和噪音。

### 渐进式披露设计原则

Skill 使用三级加载系统来高效管理上下文：

1. **元数据（name + description + metadata）** - 始终在上下文中（约 100 词）
2. **SKILL.md 正文** - Skill 触发时加载（少于 5k 词）
3. **捆绑资源** - Agent 需要时加载或执行（容量不受上下文窗口限制，因为脚本可以不读入上下文而直接执行）

#### 渐进式披露模式

让 SKILL.md 正文只保留必要内容，并控制在 500 行以内，以减少上下文膨胀。接近这个限制时，将内容拆分到独立文件中。拆分内容时，必须在 SKILL.md 中引用这些文件，并清晰说明何时读取它们，确保 Skill 的阅读者知道这些文件存在，以及何时使用。

**关键原则：** 当一个 Skill 支持多个变体、框架或选项时，SKILL.md 只保留核心工作流和选择指导。把变体相关细节（模式、示例、配置）移动到独立 reference 文件。

**模式 1：带 reference 的高层指南**

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

Agent 只在需要时加载 FORMS.md、REFERENCE.md 或 EXAMPLES.md。

**模式 2：按领域组织**

对于包含多个领域的 Skill，按领域组织内容，避免加载无关上下文：

```
bigquery-skill/
├── SKILL.md (overview and navigation)
└── references/
    ├── finance.md (revenue, billing metrics)
    ├── sales.md (opportunities, pipeline)
    ├── product.md (API usage, features)
    └── marketing.md (campaigns, attribution)
```

当用户询问销售指标时，Agent 只读取 sales.md。

类似地，对于支持多个框架或变体的 Skill，按变体组织：

```
cloud-deploy/
├── SKILL.md (workflow + provider selection)
└── references/
    ├── aws.md (AWS deployment patterns)
    ├── gcp.md (GCP deployment patterns)
    └── azure.md (Azure deployment patterns)
```

当用户选择 AWS 时，Agent 只读取 aws.md。

**模式 3：条件性细节**

展示基础内容，并链接到高级内容：

```markdown
# DOCX Processing

## Creating documents

Use docx-js for new documents. See [DOCX-JS.md](DOCX-JS.md).

## Editing documents

For simple edits, modify the XML directly.

**For tracked changes**: See [REDLINING.md](REDLINING.md)
**For OOXML details**: See [OOXML.md](OOXML.md)
```

Agent 只在用户需要这些功能时读取 REDLINING.md 或 OOXML.md。

**重要准则：**

- **避免深层嵌套 references** - references 文件距离 SKILL.md 保持一层即可。所有 references 文件都应从 SKILL.md 直接链接。
- **组织较长 reference 文件** - 对超过 100 行的文件，在顶部包含目录，使 Agent 在预览时可以看到完整范围。

## Skill 创建流程

Skill 创建包含以下步骤：

1. 通过具体示例理解 Skill
2. 规划可复用的 Skill 内容（scripts、references、assets）
3. 初始化 Skill（运行 init_skill.py）
4. 编辑 Skill（实现资源并编写 SKILL.md）
5. 验证 Skill（运行 quick_validate.py）
6. 基于真实使用继续迭代

除非有明确理由说明某一步不适用，否则按顺序执行这些步骤。

### Skill 命名

- 只使用小写字母、数字和连字符；将用户提供的标题规范化为 hyphen-case（例如 "Plan Mode" -> `plan-mode`）。
- 生成名称时，名称长度应小于 64 个字符（字母、数字、连字符）。
- 优先使用简短、动词开头的短语来描述动作。
- 当按工具命名空间能提升清晰度或触发准确性时使用命名空间（例如 `gh-address-comments`、`linear-address-issue`）。
- Skill 文件夹名称必须与 Skill 名称完全一致。

### Step 1：通过具体示例理解 Skill

只有当 Skill 的使用模式已经非常清楚时，才跳过此步骤。即使是在更新现有 Skill，这一步仍然有价值。

为了创建有效的 Skill，需要通过具体示例清晰理解这个 Skill 会如何被使用。这种理解可以来自用户直接提供的示例，也可以来自生成后再经用户反馈验证的示例。

例如，构建 image-editor Skill 时，相关问题包括：

- “image-editor Skill 应该支持哪些能力？编辑、旋转，还有别的吗？”
- “能给一些这个 Skill 会如何使用的示例吗？”
- “我可以想象用户会问类似 ‘Remove the red-eye from this image’ 或 ‘Rotate this image’ 的问题。你还会期待哪些用法？”
- “用户说什么时应该触发这个 Skill？”

为了避免给用户造成压力，不要在一条消息中问太多问题。从最重要的问题开始，必要时再追问，以提高效果。

当已经清楚 Skill 应支持什么功能时，结束此步骤。

### Step 2：规划可复用的 Skill 内容

为了把具体示例转化为有效 Skill，需要对每个示例进行分析：

1. 思考如果从零开始完成这个示例应如何执行
2. 识别在重复执行这些工作流时，哪些 scripts、references 和 assets 会有帮助

示例：构建 `pdf-editor` Skill 来处理类似 “Help me rotate this PDF” 的请求时，分析结果是：

1. 旋转 PDF 每次都需要重写相同代码
2. 将 `scripts/rotate_pdf.py` 脚本存入 Skill 会很有帮助

示例：设计 `frontend-webapp-builder` Skill 来处理类似 “Build me a todo app” 或 “Build me a dashboard to track my steps” 的请求时，分析结果是：

1. 编写前端 webapp 每次都需要相同的 HTML/React 样板
2. 将包含 HTML/React 项目样板文件的 `assets/hello-world/` 模板存入 Skill 会很有帮助

示例：构建 `big-query` Skill 来处理类似 “How many users have logged in today?” 的请求时，分析结果是：

1. 查询 BigQuery 每次都需要重新发现表 schema 和关系
2. 将记录表 schema 的 `references/schema.md` 文件存入 Skill 会很有帮助

为了确定 Skill 内容，需要分析每个具体示例，并形成要包含的可复用资源清单：scripts、references 和 assets。

### Step 3：初始化 Skill

到这一步，就该真正创建 Skill 了。

只有当正在开发的 Skill 已经存在时，才跳过此步骤。此时继续下一步。

从零创建新 Skill 时，始终运行 `init_skill.py` 脚本。该脚本会生成一个标准 Skill 文件夹，包含必需的 `SKILL.md`，并按需创建 `scripts/`、`references/`、`assets/` 资源目录。

在创建前先判断分类目录。框架或语言专属 Skill 放入对应目录；跨端通用 Skill 放入 `skills/share/`；新框架先创建新的 `skills/<framework>/` 分类。

不要使用 `init_skill.py` 在 curated Skill 目录中创建 Skill，例如 `skills/flutter/*`。这些目录由 `create-curated-skill` 维护。

用法：

```bash
scripts/init_skill.py <skill-name> --path <output-directory> [--category <category>] [--resources scripts,references,assets] [--examples]
```

示例：

```bash
scripts/init_skill.py rn-create-app --path skills --category react-native
scripts/init_skill.py hybrid-checklist --path skills --category share --resources references
scripts/init_skill.py kotlin-api-style --path skills/kotlin --resources references
```

该脚本会：

- 在分类目录下创建 Skill 目录；当 `--path skills` 时必须使用 `--category`
- 生成带有正确 frontmatter 和模板占位符的 `SKILL.md`
- 根据 `--resources` 可选创建资源目录
- 当设置 `--examples` 时，在所选资源目录中添加示例文件
- 不生成 `agents/openai.yaml`

初始化后，根据需要自定义 SKILL.md 并添加资源。如果使用了 `--examples`，替换或删除占位文件。

### Step 4：编辑 Skill

编辑（新生成或已存在的）Skill 时，记住这个 Skill 是给另一个 Agent 实例使用的。包含对 Agent 有益、且不显而易见的信息。思考哪些流程性知识、领域细节或可复用资产能帮助另一个 Agent 实例更有效地执行这些任务。

#### 从可复用 Skill 内容开始

开始实现时，从前面识别出的可复用资源入手：`scripts/`、`references/` 和 `assets/` 文件。注意，这一步可能需要用户输入。例如，实现 `brand-guidelines` Skill 时，用户可能需要提供品牌资产或模板以存入 `assets/`，或提供文档以存入 `references/`。

新增脚本必须通过实际运行来测试，以确保没有 bug，且输出符合预期。如果有很多相似脚本，只需测试具有代表性的样本，以在完成时间和信心之间取得平衡。

如果使用了 `--examples`，删除 Skill 不需要的任何占位文件。只创建实际需要的资源目录。

#### 更新 SKILL.md

**写作指南：** 始终使用祈使式/不定式表达。

##### Frontmatter

编写至少包含 `name` 和 `description` 的 YAML frontmatter：

- `name`：Skill 名称
- `description`：这是 Skill 的主要触发机制，帮助 Agent 理解何时使用该 Skill。
  - 同时包含 Skill 做什么，以及在什么具体触发条件/上下文中使用它。
  - 把所有“何时使用”的信息都写在这里，而不是正文中。正文只有触发后才会加载，所以正文中的 “When to Use This Skill” 章节对 Agent 触发并无帮助。
  - `docx` Skill 的示例 description："Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. Use when Agent needs to work with professional documents (.docx files) for: (1) Creating new documents, (2) Modifying or editing content, (3) Working with tracked changes, (4) Adding comments, or any other document tasks"
- `metadata`（可选）：默认不写；仅在 Skill 知识具有明确跨端框架版本适用边界或项目强环境配置要求时使用，并且只允许受支持的子字段：
  - `metadata.version`：只写跨端框架版本或版本区间约束。
  - `metadata.env`：只写项目必须满足的强配置或环境前提。

除 `name`、`description` 以及受支持的 `metadata.version` / `metadata.env` 外，不要在 YAML frontmatter 中包含其他任意字段。

##### Body

编写使用该 Skill 及其捆绑资源的说明。

### Step 5：验证 Skill

Skill 开发完成后，验证 Skill 文件夹，以便尽早发现基础问题：

```bash
scripts/quick_validate.py <path/to/skill-folder>
```

默认模式用于检查生成结构，允许模板占位符存在。Skill 完成后必须运行 strict 模式：

```bash
scripts/quick_validate.py --strict <path/to/skill-folder>
```

验证脚本会检查：

- 输入必须是 Skill 文件夹，且包含 `SKILL.md`
- frontmatter 必须包含 `name` 和 `description`，可选 `metadata.version/env`
- Skill 文件夹名必须等于 frontmatter `name`
- 普通 repo-local Skill 必须位于 `skills/<category>/<skill-name>`，不能位于 `skills/<skill-name>`
- 可选资源目录只能是 `scripts/`、`references/`、`assets/`
- `Upstream Skill` 只能表示 Skill-to-Skill 依赖和补充关系，不能指向普通文档、API、模块或页面
- curated Skill 会被拒绝；检测到 `> Curated from ...` 或 `skills/flutter/*` 时，应改用 `create-curated-skill`
- strict 模式会拒绝模板占位符和未完成内容

如果验证失败，修复报告的问题并再次运行命令。

### Step 6：迭代

测试 Skill 后，用户可能会请求改进。这通常发生在刚刚使用该 Skill 之后，此时还保留着 Skill 表现如何的新鲜上下文。

**迭代工作流：**

1. 在真实任务中使用该 Skill
2. 注意遇到的困难或低效之处
3. 识别应如何更新 SKILL.md 或捆绑资源
4. 实现修改并再次测试
