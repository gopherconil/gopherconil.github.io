# Hugo Templates Reference

## Table of Contents
1. [Template Types](#template-types)
2. [Lookup Order](#lookup-order)
3. [Go Template Syntax](#go-template-syntax)
4. [Page Variables](#page-variables)
5. [Site Variables](#site-variables)
6. [Partials](#partials)
7. [Base Templates & Blocks](#base-templates--blocks)
8. [List Templates](#list-templates)
9. [Single Page Templates](#single-page-templates)
10. [Homepage Template](#homepage-template)
11. [Taxonomy Templates](#taxonomy-templates)
12. [Data Templates](#data-templates)
13. [Custom Output Formats](#custom-output-formats)
14. [Template Debugging](#template-debugging)

## Template Types

| Type | Purpose | Default Location |
|------|---------|-----------------|
| Base | HTML shell with blocks | `_default/baseof.html` |
| Single | Individual content pages | `_default/single.html` |
| List | Section/taxonomy pages | `_default/list.html` |
| Homepage | Site root | `index.html` |
| Partial | Reusable fragments | `partials/*.html` |
| Shortcode | Content-embedded templates | `shortcodes/*.html` |
| 404 | Error page | `404.html` |
| robots.txt | SEO | `robots.txt` |
| sitemap | XML sitemap | `_default/sitemap.xml` |

## Lookup Order

Hugo searches for templates in order of specificity. For a page at `content/posts/my-post.md` with `type: blog` and `layout: special`:

**Single page lookup** (first match wins):
1. `layouts/blog/special.html`
2. `layouts/blog/single.html`
3. `layouts/posts/special.html`
4. `layouts/posts/single.html`
5. `layouts/_default/special.html`
6. `layouts/_default/single.html`

**List page lookup** for section `posts`:
1. `layouts/posts/posts.html`
2. `layouts/posts/section.html`
3. `layouts/posts/list.html`
4. `layouts/_default/posts.html`
5. `layouts/_default/section.html`
6. `layouts/_default/list.html`

**Homepage lookup**:
1. `layouts/index.html`
2. `layouts/home.html`
3. `layouts/_default/index.html`
4. `layouts/_default/home.html`
5. `layouts/_default/list.html`

Theme templates are checked after project layouts (project always wins).

## Go Template Syntax

### Actions and Delimiters

```go-html-template
{{ action }}           {{/* standard */}}
{{- action -}}         {{/* trim surrounding whitespace */}}
{{- action }}          {{/* trim leading whitespace */}}
{{ action -}}          {{/* trim trailing whitespace */}}
```

### Variables

```go-html-template
{{ $name := "value" }}          {{/* initialize */}}
{{ $name = "new value" }}       {{/* reassign */}}
{{ $name }}                     {{/* output */}}
```

### Conditionals

```go-html-template
{{ if CONDITION }}
  ...
{{ else if CONDITION }}
  ...
{{ else }}
  ...
{{ end }}

{{/* Falsy values: false, 0, nil, empty string, empty slice/map */}}

{{/* with: rebinds context and acts as nil/empty check */}}
{{ with .Params.subtitle }}
  <h2>{{ . }}</h2>
{{ else }}
  <h2>Default subtitle</h2>
{{ end }}

{{/* Logical operators */}}
{{ if and (isset .Params "title") (ne .Params.title "") }}
{{ if or .Params.featured .Params.pinned }}
{{ if not .Draft }}
```

### Comparison Functions

```go-html-template
{{ eq $a $b }}     {{/* == */}}
{{ ne $a $b }}     {{/* != */}}
{{ lt $a $b }}     {{/* <  */}}
{{ le $a $b }}     {{/* <= */}}
{{ gt $a $b }}     {{/* >  */}}
{{ ge $a $b }}     {{/* >= */}}
```

### Range (Loops)

```go-html-template
{{/* Basic range */}}
{{ range .Pages }}
  <h2>{{ .Title }}</h2>
{{ end }}

{{/* With else for empty */}}
{{ range .Pages }}
  <h2>{{ .Title }}</h2>
{{ else }}
  <p>No pages.</p>
{{ end }}

{{/* With index */}}
{{ range $index, $page := .Pages }}
  {{ $index }}: {{ $page.Title }}
{{ end }}

{{/* Range over map */}}
{{ range $key, $value := .Params }}
  {{ $key }}: {{ $value }}
{{ end }}

{{/* Range N times */}}
{{ range 5 }}
  <li>Item {{ . }}</li>  {{/* . is 0,1,2,3,4 */}}
{{ end }}

{{/* Range with seq-like behavior */}}
{{ range seq 3 }}
  <li>Item {{ . }}</li>  {{/* . is 1,2,3 */}}
{{ end }}
```

### Pipes

```go-html-template
{{ .Title | strings.ToUpper }}
{{ "hello **world**" | markdownify }}
{{ .Date | time.Format "2006-01-02" }}
{{ .Summary | truncate 100 }}

{{/* Chain pipes */}}
{{ .Title | strings.ToLower | urlize }}
```

### Context (The Dot)

```go-html-template
{{/* Top level: . = Page */}}
{{ .Title }}

{{/* Inside range: . = current item */}}
{{ range .Pages }}
  {{ .Title }}           {{/* current page in range */}}
  {{ $.Site.Title }}     {{/* $ = original page context */}}
{{ end }}

{{/* Inside with: . = value */}}
{{ with .Params.author }}
  Author: {{ . }}
  Page: {{ $.Title }}
{{ end }}
```

## Page Variables

### Common Page Variables

```go-html-template
{{ .Title }}              {{/* Page title */}}
{{ .Content }}            {{/* Rendered content */}}
{{ .Summary }}            {{/* Auto or manual summary */}}
{{ .Date }}               {{/* Page date */}}
{{ .Lastmod }}            {{/* Last modification date */}}
{{ .PublishDate }}         {{/* Publication date */}}
{{ .ExpiryDate }}         {{/* Expiry date */}}
{{ .Draft }}              {{/* Is draft */}}
{{ .Type }}               {{/* Content type */}}
{{ .Section }}            {{/* Top-level section */}}
{{ .Kind }}               {{/* Page kind: page, section, home, taxonomy, term */}}
{{ .Layout }}             {{/* Layout override */}}
{{ .Description }}        {{/* Description */}}
{{ .Weight }}             {{/* Sort weight */}}
{{ .WordCount }}          {{/* Word count */}}
{{ .ReadingTime }}        {{/* Estimated reading time (minutes) */}}
{{ .FuzzyWordCount }}     {{/* Approximate word count */}}
{{ .Plain }}              {{/* Content as plain text */}}
{{ .PlainWords }}         {{/* Slice of words */}}
{{ .RawContent }}         {{/* Raw markdown before rendering */}}
{{ .Truncated }}          {{/* Is summary truncated */}}
{{ .LinkTitle }}          {{/* Link title (or Title) */}}
```

### Navigation

```go-html-template
{{ .RelPermalink }}       {{/* Relative URL */}}
{{ .Permalink }}          {{/* Absolute URL */}}
{{ .Slug }}               {{/* URL slug */}}
{{ .File.Path }}          {{/* Source file path */}}
{{ .BundleType }}         {{/* "leaf", "branch", or "" */}}
```

### Relationships

```go-html-template
{{ .Parent }}             {{/* Parent section */}}
{{ .FirstSection }}       {{/* First section ancestor */}}
{{ .CurrentSection }}     {{/* Current section */}}
{{ .Pages }}              {{/* Child pages */}}
{{ .RegularPages }}       {{/* Child regular pages (not sections) */}}
{{ .Sections }}           {{/* Child sections */}}
{{ .Ancestors }}          {{/* Ancestor pages (root to parent) */}}

{{ .Next }}               {{/* Next page (by date) */}}
{{ .Prev }}               {{/* Previous page (by date) */}}
{{ .NextInSection }}      {{/* Next in same section */}}
{{ .PrevInSection }}      {{/* Previous in same section */}}

{{ .IsHome }}
{{ .IsPage }}
{{ .IsSection }}
{{ .IsNode }}
```

### Custom Params

```go-html-template
{{ .Params.customfield }}
{{ .Params.nested.field }}
{{ index .Params "hyphenated-field" }}

{{/* With default */}}
{{ .Param "author" }}     {{/* Falls back to .Site.Params.author */}}
```

## Site Variables

```go-html-template
{{ .Site.Title }}
{{ .Site.BaseURL }}
{{ .Site.LanguageCode }}
{{ .Site.Copyright }}
{{ .Site.Params.key }}           {{/* Custom params from config */}}

{{ .Site.Pages }}                {{/* All pages */}}
{{ .Site.RegularPages }}         {{/* All regular (non-list) pages */}}
{{ .Site.AllPages }}             {{/* All pages including translations */}}
{{ .Site.Sections }}             {{/* Top-level sections */}}
{{ .Site.Menus }}                {{/* All menus */}}
{{ .Site.Menus.main }}           {{/* Specific menu */}}
{{ .Site.Taxonomies }}           {{/* All taxonomies */}}
{{ .Site.Taxonomies.tags }}      {{/* Specific taxonomy */}}
{{ .Site.Data }}                 {{/* Data files */}}
{{ .Site.Data.filename }}        {{/* Specific data file */}}

{{ .Site.Home }}                 {{/* Homepage page object */}}
{{ .Site.IsServer }}             {{/* Running as server */}}
{{ .Site.BuildDrafts }}          {{/* Building drafts */}}

{{ hugo.Version }}               {{/* Hugo version */}}
{{ hugo.Environment }}           {{/* Current environment */}}
{{ hugo.IsProduction }}          {{/* Is production build */}}
```

## Partials

### Basic Usage

```go-html-template
{{/* Call a partial — always pass context */}}
{{ partial "header.html" . }}

{{/* Partial with cached output */}}
{{ partialCached "footer.html" . }}

{{/* Cached with variant key (different cache per variant) */}}
{{ partialCached "sidebar.html" . .Section }}
```

### Returning Values

Partials can return values using `return`:

`partials/get-css-class.html`:
```go-html-template
{{ $class := "default" }}
{{ if .Params.featured }}
  {{ $class = "featured" }}
{{ end }}
{{ return $class }}
```

Usage:
```go-html-template
<div class="{{ partial "get-css-class.html" . }}">
```

### Inline Partials

```go-html-template
{{ define "partials/inline-example.html" }}
  <span>{{ .Title }}</span>
{{ end }}

{{ partial "inline-example.html" . }}
```

### Passing Custom Data

```go-html-template
{{ partial "component.html" (dict "page" . "class" "hero" "showDate" true) }}
```

In the partial:
```go-html-template
<div class="{{ .class }}">
  <h1>{{ .page.Title }}</h1>
  {{ if .showDate }}
    <time>{{ .page.Date.Format "Jan 2, 2006" }}</time>
  {{ end }}
</div>
```

## Base Templates & Blocks

`layouts/_default/baseof.html`:
```go-html-template
<!DOCTYPE html>
<html lang="{{ .Site.LanguageCode }}">
<head>
  <meta charset="utf-8">
  <title>{{ block "title" . }}{{ .Site.Title }}{{ end }}</title>
  {{ block "head" . }}{{ end }}
</head>
<body>
  {{ partial "nav.html" . }}
  <main>
    {{ block "main" . }}{{ end }}
  </main>
  {{ block "footer" . }}
    {{ partial "footer.html" . }}
  {{ end }}
</body>
</html>
```

Child template (`layouts/_default/single.html`):
```go-html-template
{{ define "title" }}{{ .Title }} | {{ .Site.Title }}{{ end }}

{{ define "main" }}
  <article>
    <h1>{{ .Title }}</h1>
    <time>{{ .Date.Format "January 2, 2006" }}</time>
    {{ .Content }}
  </article>
{{ end }}
```

## List Templates

```go-html-template
{{ define "main" }}
  <h1>{{ .Title }}</h1>
  {{ .Content }}

  {{/* Paginate */}}
  {{ $pages := .Pages }}
  {{ $paginator := .Paginate $pages }}
  {{ range $paginator.Pages }}
    <article>
      <h2><a href="{{ .RelPermalink }}">{{ .Title }}</a></h2>
      {{ .Summary }}
    </article>
  {{ end }}

  {{/* Pagination nav */}}
  {{ template "_internal/pagination.html" . }}

  {{/* Or manual pagination */}}
  {{ with .Paginator }}
    {{ if .HasPrev }}<a href="{{ .Prev.URL }}">Previous</a>{{ end }}
    {{ if .HasNext }}<a href="{{ .Next.URL }}">Next</a>{{ end }}
  {{ end }}
{{ end }}
```

### Filtering and Sorting

```go-html-template
{{/* Where filter */}}
{{ range where .Pages "Params.featured" true }}
{{ range where .Pages "Section" "posts" }}
{{ range where .Pages "Date" ">" (now.AddDate 0 -1 0) }}

{{/* Sort */}}
{{ range .Pages.ByTitle }}
{{ range .Pages.ByDate }}
{{ range .Pages.ByDate.Reverse }}
{{ range .Pages.ByWeight }}
{{ range .Pages.ByParam "rating" }}

{{/* First/After */}}
{{ range first 5 .Pages }}
{{ range after 2 .Pages }}

{{/* Group by */}}
{{ range .Pages.GroupByDate "2006" }}
  <h2>{{ .Key }}</h2>
  {{ range .Pages }}
    {{ .Title }}
  {{ end }}
{{ end }}

{{ range .Pages.GroupBy "Section" }}
{{ range .Pages.GroupByParam "author" }}
```

## Single Page Templates

```go-html-template
{{ define "main" }}
  <article>
    <header>
      <h1>{{ .Title }}</h1>
      {{ with .Params.subtitle }}<p class="subtitle">{{ . }}</p>{{ end }}
      <time datetime="{{ .Date.Format "2006-01-02" }}">
        {{ .Date.Format "January 2, 2006" }}
      </time>
      {{ with .Params.author }}<span>by {{ . }}</span>{{ end }}
      {{ range .GetTerms "tags" }}
        <a href="{{ .RelPermalink }}">{{ .LinkTitle }}</a>
      {{ end }}
    </header>

    {{ .Content }}

    <nav>
      {{ with .PrevInSection }}<a href="{{ .RelPermalink }}">← {{ .Title }}</a>{{ end }}
      {{ with .NextInSection }}<a href="{{ .RelPermalink }}">{{ .Title }} →</a>{{ end }}
    </nav>
  </article>
{{ end }}
```

## Homepage Template

```go-html-template
{{ define "main" }}
  {{ .Content }}

  <h2>Recent Posts</h2>
  {{ range first 5 (where .Site.RegularPages "Section" "posts") }}
    <article>
      <h3><a href="{{ .RelPermalink }}">{{ .Title }}</a></h3>
      <time>{{ .Date.Format "Jan 2, 2006" }}</time>
      {{ .Summary }}
    </article>
  {{ end }}
{{ end }}
```

## Taxonomy Templates

### Taxonomy List (e.g., /tags/)

```go-html-template
{{ define "main" }}
  <h1>{{ .Title }}</h1>
  {{ range .Pages.ByCount }}
    <a href="{{ .Page.RelPermalink }}">
      {{ .Page.Title }} ({{ .Count }})
    </a>
  {{ end }}
{{ end }}
```

### Term Page (e.g., /tags/go/)

```go-html-template
{{ define "main" }}
  <h1>Pages tagged "{{ .Title }}"</h1>
  {{ range .Pages }}
    <h2><a href="{{ .RelPermalink }}">{{ .Title }}</a></h2>
  {{ end }}
{{ end }}
```

## Data Templates

Load data from `data/` directory files:

`data/team.yml`:
```yaml
- name: "Alice"
  role: "Lead"
- name: "Bob"
  role: "Developer"
```

Template:
```go-html-template
{{ range .Site.Data.team }}
  <div>{{ .name }} — {{ .role }}</div>
{{ end }}
```

Also: `getJSON` and `getCSV` for remote data (cached).

## Custom Output Formats

Define in config:
```yaml
outputFormats:
  SearchIndex:
    baseName: "search"
    mediaType: "application/json"
    notAlternative: true
outputs:
  home: ["HTML", "RSS", "SearchIndex"]
```

Template: `layouts/index.searchindex.json`:
```go-html-template
[
{{ range $index, $page := .Site.RegularPages }}
  {{ if $index }},{{ end }}
  { "title": {{ .Title | jsonify }}, "url": {{ .RelPermalink | jsonify }}, "content": {{ .Plain | jsonify }} }
{{ end }}
]
```

## Template Debugging

```go-html-template
{{/* Print value */}}
{{ printf "%#v" .Params }}

{{/* Debug dump (Hugo 0.120+) */}}
{{ debug.Dump . }}

{{/* Print type */}}
{{ printf "%T" .Date }}

{{/* Timer */}}
{{ debug.Timer "my-label" }}
...
{{ debug.Timer "my-label" }}
```

CLI: `hugo --templateMetrics --templateMetricsHints` for template performance data.
