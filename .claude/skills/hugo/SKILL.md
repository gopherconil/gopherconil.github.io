---
name: hugo
description: |
  Hugo static site generator skill — use this whenever working on Hugo sites, templates, content, configuration, shortcodes, or deployment. Trigger on any Hugo-related task: editing layouts, creating content, modifying config.yml/toml/json, working with partials, shortcodes, taxonomies, front matter, Hugo Pipes, or debugging template rendering. Also trigger when the user mentions "hugo server", "hugo build", static site generation, or references Hugo-specific concepts like page bundles, base templates, lookup order, or Go template syntax.
---

# Hugo Static Site Generator

This skill provides comprehensive guidance for working with Hugo sites. It covers configuration, content management, templates, shortcodes, asset processing, and deployment.

## Project Context

This is a **GopherCon Israel** conference website using Hugo with the `hugo-conference` theme. Key details:

- **Config**: `config.yml` (YAML format)
- **Theme**: `hugo-conference` (in `themes/hugo-conference/`)
- **Publish dir**: `docs/` (for GitHub Pages)
- **Build**: `make build` (runs `hugo`) or `make run` (runs `hugo server -D`)
- **Content**: Most content lives in `config.yml` params, not in `content/` markdown files
- **Custom layouts**: `layouts/` overrides theme templates (index.html, partials)

## Quick Reference

### Directory Structure

```
├── config.yml          # Site configuration (title, params, sections, sponsors, team)
├── archetypes/         # Content templates for `hugo new`
├── content/            # Markdown/HTML content pages
├── data/               # Data files (JSON/YAML/TOML) accessible via .Site.Data
├── layouts/            # Template overrides (takes precedence over theme)
│   ├── index.html      # Homepage layout
│   ├── _default/       # Default templates (single.html, list.html)
│   └── partials/       # Reusable template fragments
├── static/             # Static assets (copied as-is to output)
│   ├── css/
│   ├── img/
│   └── js/
├── themes/             # Theme(s)
│   └── hugo-conference/
├── assets/             # Processable assets (Hugo Pipes: SCSS, JS bundling)
└── docs/               # Build output (publishDir)
```

### Configuration

Hugo supports TOML (`hugo.toml`), YAML (`hugo.yaml`/`config.yml`), or JSON config. Key settings:

```yaml
baseURL: "https://example.org/"
title: "Site Title"
theme: "theme-name"
publishDir: "docs"            # Output directory (default: public)
contentDir: "content"
layoutDir: "layouts"
staticDir: "static"

# Feature flags
buildDrafts: false
buildExpired: false
buildFuture: false
enableEmoji: false
enableGitInfo: false
enableRobotsTXT: false

# URL behavior
relativeURLs: false
uglyurls: false               # true = /post.html instead of /post/

# Pagination
pagination:
  pagerSize: 10

# Taxonomies (defaults: categories, tags)
taxonomies:
  tag: tags
  category: categories

# Custom params (accessible via .Site.Params)
params:
  description: "Site description"
  customKey: "value"
```

For detailed configuration options, read `references/configuration.md`.

### Content Management

#### Front Matter

Three formats — YAML (`---`), TOML (`+++`), or JSON (`{}`):

```yaml
---
title: "My Post"
date: 2026-01-15
draft: false
description: "Post summary"
tags: ["go", "hugo"]
categories: ["tutorial"]
slug: "custom-url-segment"     # Overrides filename in URL
url: "/custom/full/path/"      # Overrides entire URL path
weight: 10                     # Sort order
layout: "custom-layout"        # Use specific layout template
type: "blog"                   # Content type (maps to layout directory)
aliases: ["/old-url/"]         # Create redirects from old URLs
params:
  custom_field: "value"        # Custom fields under params
---
```

#### Page Bundles

- **Leaf bundle** (`index.md`): A single page with co-located resources (images, files). Cannot have child pages.
- **Branch bundle** (`_index.md`): Section/list page. Can have descendants. Adds front matter and content to list pages.

```
content/
├── posts/
│   ├── _index.md              # Branch: /posts/ list page
│   ├── my-post/
│   │   ├── index.md           # Leaf: /posts/my-post/
│   │   └── hero.jpg           # Page resource
│   └── another-post.md        # Regular page: /posts/another-post/
```

#### Taxonomies

Default taxonomies are `categories` and `tags`. Assign in front matter using the plural name:

```yaml
tags: ["Go", "Hugo"]
categories: ["Tutorial"]
```

Custom taxonomies: define in config, then use in front matter. Hugo auto-generates list pages (`/tags/`, `/tags/go/`).

For more on content organization, URLs, and taxonomies, read `references/content-management.md`.

### Templates

Hugo uses Go's `text/template` and `html/template` packages.

#### Essential Syntax

```go-html-template
{{/* Variables */}}
{{ $name := "Hugo" }}
{{ $name = "Updated" }}

{{/* Conditionals */}}
{{ if .Params.show }}...{{ else if .Draft }}...{{ else }}...{{ end }}
{{ with .Params.subtitle }}<h2>{{ . }}</h2>{{ end }}

{{/* Loops */}}
{{ range .Pages }}
  <h2>{{ .Title }}</h2>
{{ else }}
  <p>No pages found.</p>
{{ end }}

{{/* Pipes */}}
{{ "title" | strings.Title }}
{{ .Date | time.Format "January 2, 2006" }}

{{/* Whitespace trimming */}}
{{- .Title -}}

{{/* Partials */}}
{{ partial "header.html" . }}
{{ partialCached "footer.html" . }}

{{/* Access site params */}}
{{ .Site.Title }}
{{ .Site.Params.description }}

{{/* Access page params */}}
{{ .Title }}
{{ .Content }}
{{ .Params.custom_field }}
{{ index .Params "hyphenated-key" }}
```

#### The Dot (`.`) Context

- `.` refers to the current context (usually a Page)
- Inside `range`/`with` blocks, `.` is rebound to the loop item
- Use `$` to access the original page context from inside blocks

#### Base Templates & Blocks

`layouts/_default/baseof.html`:
```go-html-template
<!DOCTYPE html>
<html>
<head>{{ block "head" . }}{{ end }}</head>
<body>
  {{ partial "nav.html" . }}
  {{ block "main" . }}{{ end }}
  {{ partial "footer.html" . }}
</body>
</html>
```

Child templates fill blocks:
```go-html-template
{{ define "main" }}
  <article>{{ .Content }}</article>
{{ end }}
```

#### Template Lookup Order

Hugo resolves templates by specificity: Kind > Layout > Output Format > Language > Type > Section.

- Single pages: `layouts/{type}/{layout}.html` > `layouts/{section}/single.html` > `layouts/_default/single.html`
- List pages: `layouts/{section}/list.html` > `layouts/_default/list.html`
- Homepage: `layouts/index.html` > `layouts/_default/index.html`

For complete template reference, read `references/templates.md`.

### Shortcodes

Built-in shortcodes: `details`, `figure`, `highlight`, `instagram`, `param`, `qr`, `ref`, `relref`, `vimeo`, `x`, `youtube`.

```markdown
{{< figure src="/img/photo.jpg" title="Caption" >}}
{{< youtube dQw4w9WgXcQ >}}
{{< highlight go >}}
fmt.Println("Hello")
{{< /highlight >}}
{{< ref "other-page.md" >}}
```

Custom shortcodes go in `layouts/shortcodes/`. Two calling conventions:
- `{{< name >}}` — render as-is (standard)
- `{{% name %}}` — process inner content as Markdown

### Hugo Pipes (Asset Processing)

Process assets from the `assets/` directory:

```go-html-template
{{ $css := resources.Get "css/main.scss" | css.Sass | minify | fingerprint }}
<link rel="stylesheet" href="{{ $css.RelPermalink }}" integrity="{{ $css.Data.Integrity }}">

{{ $js := resources.Get "js/app.js" | js.Build | minify | fingerprint }}
<script src="{{ $js.RelPermalink }}"></script>
```

Available pipes: `minify`, `fingerprint` (SRI hashes), `css.Sass`/`css.SCSS`, `js.Build` (ESBuild — bundle/transpile/tree-shake), `postcss`, `resources.Concat`, `resources.FromString`.

### Functions Quick Reference

Most commonly used function namespaces:
- `strings` — ToLower, ToUpper, Title, TrimPrefix, Contains, HasPrefix, Replace, Truncate
- `collections` — where, first, last, sort, group, merge, append, index
- `time` — Format, Now, AsTime
- `math` — Add, Sub, Mul, Div, Mod, Round, Ceil, Floor
- `fmt` — Printf, Println
- `transform` — Markdownify, Plainify, HTMLEscape, Highlight
- `urls` — Parse, AbsURL, RelURL
- `path` — Base, Dir, Ext, Join
- `os` — Getenv, Stat, ReadFile
- `resources` — Get, GetMatch, Match, Copy
- `safe` — HTML, CSS, JS, URL (mark strings as safe for rendering)

For the full function reference, read `references/functions.md`.

### Common Patterns

#### Conditional rendering based on params
```go-html-template
{{ with .Site.Params.googleAnalytics }}
  <script>/* GA code for {{ . }} */</script>
{{ end }}
```

#### Range with index
```go-html-template
{{ range $index, $page := .Pages }}
  <div class="{{ if eq (mod $index 2) 0 }}even{{ else }}odd{{ end }}">
    {{ $page.Title }}
  </div>
{{ end }}
```

#### Getting pages from a section
```go-html-template
{{ range where .Site.RegularPages "Section" "posts" }}
  {{ .Title }}
{{ end }}
```

#### Data-driven content (from config params)
```go-html-template
{{ range .Site.Params.sponsors.gold }}
  <img src="{{ .logo }}" alt="{{ .name }}">
{{ end }}
```

### Debugging

```go-html-template
{{/* Print any value for debugging */}}
{{ printf "%#v" . }}
{{ debug.Dump . }}

{{/* Check available variables on current page */}}
{{ printf "%#v" .Params }}
```

### Deployment

**GitHub Pages** (this project's approach):
1. Set `publishDir: "docs"` in config
2. Run `hugo` (or `make build`)
3. Commit and push `docs/` to the repo
4. Configure GitHub Pages to serve from `docs/` on main branch

**Other platforms**: Netlify, Vercel, Cloudflare Pages, AWS Amplify, Firebase — see `references/deployment.md`.

### Common Gotchas

- **Missing closing `{{ end }}`**: Every `if`, `with`, `range`, `block`, `define` needs one
- **Context loss in range/with**: Use `$` to access page context: `{{ $.Site.Title }}`
- **Draft content not showing**: Use `hugo server -D` or set `buildDrafts: true`
- **Template not picked up**: Check the lookup order — type, section, and layout must match
- **Stale cache**: Run `hugo --gc` to clean the module cache
- **Safe HTML**: Use `{{ .Content | safeHTML }}` or `{{ .Content | markdownify }}` when rendering user HTML
- **Date formatting**: Go uses reference time `Mon Jan 2 15:04:05 MST 2006` — not `YYYY-MM-DD`
