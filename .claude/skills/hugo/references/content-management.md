# Hugo Content Management Reference

## Table of Contents
1. [Content Organization](#content-organization)
2. [Front Matter](#front-matter)
3. [Page Bundles](#page-bundles)
4. [URL Management](#url-management)
5. [Taxonomies](#taxonomies)
6. [Archetypes](#archetypes)
7. [Page Resources](#page-resources)
8. [Multilingual](#multilingual)

## Content Organization

The `content/` directory structure maps directly to URL paths:

```
content/
├── _index.md                    → /  (homepage content)
├── about.md                     → /about/
├── posts/
│   ├── _index.md                → /posts/  (section list page)
│   ├── first-post.md            → /posts/first-post/
│   └── second-post/
│       ├── index.md             → /posts/second-post/  (leaf bundle)
│       └── image.jpg            → page resource
├── docs/
│   ├── _index.md                → /docs/
│   └── getting-started/
│       ├── _index.md            → /docs/getting-started/
│       └── install.md           → /docs/getting-started/install/
```

**Sections** are top-level content directories. A directory becomes a section if it contains `_index.md` or is a top-level dir. The section determines the content type (and therefore which templates apply).

## Front Matter

### Predefined Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title |
| `date` | datetime | Creation date |
| `lastmod` | datetime | Last modification date |
| `publishDate` | datetime | Future publish date |
| `expiryDate` | datetime | Expiration date |
| `draft` | bool | Exclude from build (unless `-D` flag) |
| `description` | string | Page description (meta) |
| `summary` | string | Summary text (overrides auto) |
| `slug` | string | URL tail segment |
| `url` | string | Full URL path (overrides everything) |
| `weight` | int | Sort order (lower = first) |
| `layout` | string | Specific layout template name |
| `type` | string | Content type (default: section name) |
| `aliases` | []string | Redirect URLs pointing to this page |
| `keywords` | []string | Meta keywords |
| `linkTitle` | string | Short title for navigation |
| `markup` | string | Markup language override |
| `outputs` | []string | Output formats for this page |
| `cascade` | map | Values inherited by descendant pages |

### Custom Parameters

Custom fields go under `params:`:
```yaml
---
title: "My Post"
params:
  author: "Jane"
  featured: true
  difficulty: 3
---
```

Access in templates: `{{ .Params.author }}`, `{{ .Params.featured }}`.

### Cascade

Propagate front matter to descendant pages:
```yaml
---
cascade:
  - params:
      banner: "/images/default-banner.jpg"
    _target:
      kind: page
      path: "/posts/**"
  - params:
      sidebar: true
    _target:
      kind: section
---
```

Target filters: `kind`, `path` (glob), `lang`, `environment`.

## Page Bundles

### Leaf Bundles (Single Pages)

A directory with `index.md` (no underscore). Contains a page and its resources.

```
posts/my-article/
├── index.md           # The page content
├── hero.jpg           # Page resource
├── data.csv           # Page resource
└── gallery/
    ├── photo1.jpg     # Also a page resource
    └── photo2.jpg
```

- Page kind: `page`
- Cannot have descendant pages (nested `*.md` files are resources, not pages)
- Resources are accessible via `.Resources`

### Branch Bundles (List Pages)

A directory with `_index.md` (with underscore). Represents a section/list.

```
posts/
├── _index.md          # Section list page content
├── banner.jpg         # Section resource
├── first.md           # Child page (NOT a resource)
└── nested/
    └── _index.md      # Sub-section
```

- Page kinds: `home`, `section`, `taxonomy`, `term`
- `*.md` files (other than `_index.md`) are child pages, not resources
- Non-content files are resources

## URL Management

### Slug and URL

```yaml
# Override the last URL segment
slug: "my-custom-slug"
# File: content/posts/original-name.md → /posts/my-custom-slug/

# Override the entire URL path
url: "/custom/path/here/"
# File: content/posts/whatever.md → /custom/path/here/
```

`url` takes precedence over `slug` and permalink patterns.

### Permalinks

Configure URL patterns per section in config:

```yaml
permalinks:
  posts: "/:year/:month/:title/"
  docs: "/:sections/:slug/"
```

Available tokens:
- Date: `:year`, `:month`, `:monthname`, `:day`, `:weekday`, `:weekdayname`, `:yearday`
- Content: `:title`, `:slug`, `:contentbasename`, `:slugorcontentbasename`, `:filename`
- Structure: `:section`, `:sectionslug`, `:sections` (full path), `:sections[1:]` (slice syntax)

### Aliases (Redirects)

```yaml
aliases:
  - /old-url/
  - /another-old-url/
  - /posts/original-title/
```

Generates HTML files with meta-refresh redirects. For server-side redirects, set `disableAliases: true` and configure your server.

## Taxonomies

### Defining

Default taxonomies (categories, tags) are implicit. Add custom ones:

```yaml
# config.yml
taxonomies:
  tag: tags
  category: categories
  author: authors
  series: series
```

Format: `singular: plural`.

### Assigning

Use the **plural** name in front matter:

```yaml
---
title: "My Post"
tags: ["Go", "Hugo"]
categories: ["Tutorial"]
authors: ["Jane Doe"]
series: ["Getting Started"]
---
```

### Weighting

Control sort order within a taxonomy term page:

```yaml
tags: ["Go"]
tags_weight: 100
```

### Term Metadata

Create `content/authors/jane-doe/_index.md` to add metadata to a taxonomy term:

```yaml
---
title: "Jane Doe"
params:
  bio: "Software engineer"
  avatar: "jane.jpg"
---
```

### Template Access

```go-html-template
{{/* List all terms in a taxonomy */}}
{{ range .Site.Taxonomies.tags }}
  {{ .Page.Title }} ({{ .Count }})
{{ end }}

{{/* Get taxonomy terms for current page */}}
{{ range .GetTerms "tags" }}
  <a href="{{ .RelPermalink }}">{{ .LinkTitle }}</a>
{{ end }}
```

## Archetypes

Templates for `hugo new content`:

`archetypes/posts.md`:
```yaml
---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: true
tags: []
categories: []
---
```

`archetypes/posts/` directory creates a leaf bundle archetype:
```
archetypes/posts/
├── index.md
└── thumbnail.jpg
```

## Page Resources

Access resources co-located with a page:

```go-html-template
{{/* Get a specific resource */}}
{{ $img := .Resources.GetMatch "hero.*" }}
{{ with $img }}
  <img src="{{ .RelPermalink }}" alt="">
{{ end }}

{{/* Get all images */}}
{{ range .Resources.ByType "image" }}
  <img src="{{ .RelPermalink }}">
{{ end }}

{{/* Match by glob pattern */}}
{{ range .Resources.Match "gallery/*" }}
  <img src="{{ .RelPermalink }}">
{{ end }}
```

### Image Processing

```go-html-template
{{ $img := .Resources.GetMatch "photo.jpg" }}

{{/* Resize */}}
{{ $resized := $img.Resize "800x" }}
{{ $resized := $img.Resize "x600" }}
{{ $resized := $img.Resize "800x600" }}

{{/* Fit (maintain aspect ratio within bounds) */}}
{{ $fit := $img.Fit "800x600" }}

{{/* Fill (crop to exact dimensions) */}}
{{ $fill := $img.Fill "400x400 Center" }}

{{/* Convert format */}}
{{ $webp := $img.Resize "800x webp" }}

{{/* Quality */}}
{{ $compressed := $img.Resize "800x q50" }}

{{/* Filter */}}
{{ $gray := $img | images.Filter images.Grayscale }}
```

### Resource Metadata

Set in front matter:
```yaml
resources:
  - src: "hero.jpg"
    title: "Hero Image"
    params:
      credits: "Photo by Jane"
  - src: "**.pdf"
    title: "Download :counter"
```

## Multilingual

```yaml
defaultContentLanguage: "en"
defaultContentLanguageInSubdir: false

languages:
  en:
    languageName: "English"
    weight: 1
    params:
      subtitle: "English subtitle"
  he:
    languageName: "עברית"
    languageDirection: "rtl"
    weight: 2
    params:
      subtitle: "כותרת משנה"
```

Content translation by filename: `about.md` (default) and `about.he.md` (Hebrew).

Template access:
```go-html-template
{{ .IsTranslated }}
{{ range .Translations }}
  <a href="{{ .RelPermalink }}">{{ .Language.LanguageName }}</a>
{{ end }}

{{ i18n "readMore" }}  {{/* from i18n/ directory */}}
```
