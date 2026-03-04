# 我的个人博客 / 作品集

本项目基于 **Next.js App Router + TypeScript + Tailwind + MDX + shadcn/ui**，支持 **中英文双语** 与 **深色/浅色主题**，内容由本地 `content/` 统一管理。

---

## 1. 如何启动项目

1. 安装依赖

```bash
npm install
```

2. 启动开发服务器

```bash
npm run dev
```

3. 打开浏览器

- `http://localhost:3000/zh`
- `http://localhost:3000/en`

4. 生产构建（部署前验证）

```bash
npm run build
```

---

## 2. 如何添加 / 修改文章（Articles）

文章内容使用 **MDX**，路径如下：

- 中文：`content/articles/zh/*.mdx`
- 英文：`content/articles/en/*.mdx`

### 2.1 新建文章步骤

1. 在对应语言目录下新建文件，例如：

- 中文：`content/articles/zh/llm-infra.mdx`
- 英文：`content/articles/en/llm-infra.mdx`

2. 文件头部必须包含 **Frontmatter**（YAML）：

```mdx
---
title: "文章标题"
date: "2025-08-03"
summary: "一句话摘要"
tags: ["LLM", "System"]
cover: "/covers/article-1.jpg" # 可选
---
```

3. 写正文内容（Markdown / MDX）：

```mdx
## 小标题

这里是正文段落，支持 Markdown。

- 列表
- 代码块

[超链接](https://example.com)

![图片](/covers/article-1.jpg)

<Callout title="重点">
  这里是强调内容
</Callout>
```

### 2.2 命名规则（slug）

文件名即路由 slug：

- `content/articles/zh/llm-infra.mdx` -> `/zh/articles/llm-infra`
- `content/articles/en/llm-infra.mdx` -> `/en/articles/llm-infra`

建议 **中英文使用相同文件名**，这样语言切换会保持在同一篇文章。

---

## 3. 其他内容类型的规则

### 3.1 Research（科研项目）

路径：

- `content/research/zh/*.mdx`
- `content/research/en/*.mdx`

Frontmatter 必填字段：

```mdx
---
title: "科研标题"
date: "2025-06" # 或 2025-06-01
summary: "一句话摘要"
tags: ["Graph", "Retrieval"]
status: "Ongoing" # Ongoing / Completed / Paper
role: "First author"
links:
  paper: "https://..."
  code: "https://..."
  demo: "https://..."
  poster: "https://..."
cover: "/covers/research-1.jpg" # 可选
---
```

### 3.2 Projects（工程项目）

路径：

- `content/projects/zh/*.mdx`
- `content/projects/en/*.mdx`

Frontmatter 必填字段：

```mdx
---
title: "项目名称"
date: "2024-09-12"
summary: "一句话概述"
tags: ["Web", "Design"]
stack: ["Next.js", "TypeScript"]
repo: "https://github.com/..." # 可选
demo: "https://..." # 可选
cover: "/covers/project-1.jpg" # 可选
---
```

### 3.3 About（个人经历）

使用 JSON 文件：

- `content/people/zh.json`
- `content/people/en.json`

结构示例：

```json
{
  "name": "Your Name",
  "headline": "一句话定位",
  "bio": "简介",
  "photos": ["/avatar/portrait.jpg"],
  "timeline": [
    { "date": "2025", "title": "...", "description": "...", "links": [] }
  ],
  "skills": [
    { "category": "Research", "items": ["LLM", "Retrieval"] }
  ],
  "contacts": [
    { "label": "Email", "value": "hello@example.com", "url": "mailto:..." }
  ]
}
```

---

## 4. 支持哪些内容模态

MDX 支持的内容包括：

- 文本、标题、列表、引用、表格、代码块
- 图片：`![alt](/path/to/image.jpg)` 或 `<img src="/path/to/image.jpg" />`
- 超链接：`[title](https://example.com)`
- 视频：`<video controls src="/videos/demo.mp4" />`
- 组件：`<Callout>` 等自定义组件（见 `components/mdx/`）

图片/视频建议放在 `public/` 下，例如：

- `public/covers/`
- `public/avatar/`
- `public/projects/`

---

## 5. 项目结构介绍

```
my-blog/
├─ app/
│  ├─ [locale]/                # 多语言路由入口 (zh / en)
│  │  ├─ layout.tsx             # 该语言下的全局布局
│  │  ├─ page.tsx               # Home 首页
│  │  ├─ research/              # 科研列表 + 详情
│  │  ├─ projects/              # 工程项目列表 + 详情
│  │  ├─ articles/              # 文章列表 + 详情
│  │  ├─ about/                 # About 页面
│  │  ├─ contact/               # Contact 页面
│  │  └─ not-found.tsx          # 404
│  ├─ sitemap.ts                # sitemap 自动生成
│  ├─ robots.ts                 # robots.txt
│  └─ globals.css               # 全局样式与主题变量
│
├─ content/                     # 内容唯一来源
│  ├─ articles/{zh,en}/*.mdx
│  ├─ research/{zh,en}/*.mdx
│  ├─ projects/{zh,en}/*.mdx
│  └─ people/{zh,en}.json
│
├─ components/
│  ├─ layout/                   # Header / Footer / 语言与主题切换
│  ├─ cards/                    # 列表卡片组件
│  ├─ mdx/                      # MDX 渲染组件
│  ├─ sections/                 # 首页与 About 模块
│  └─ ui/                       # shadcn/ui 生成组件
│
├─ lib/
│  ├─ i18n/                     # i18n 配置与字典
│  ├─ content/                  # 读取 MDX / JSON 的逻辑
│  ├─ seo/                      # metadata / JSON-LD
│  └─ utils/                    # 工具函数
│
├─ public/                      # 静态资源
├─ middleware.ts                # 语言重定向 / 路由
└─ package.json                 # 项目脚本与依赖
```

---

## 6. 必须遵守的内容规则总结

- 所有内容必须放在 `content/` 下
- MDX 文件必须包含完整 frontmatter
- 中英文内容应使用相同 slug（建议）
- 图片/视频必须位于 `public/` 并用绝对路径引用（如 `/covers/xx.jpg`）
- 日期格式统一使用 `YYYY-MM-DD` 或 `YYYY-MM`
