# Hugo Configuration Reference

## Table of Contents
1. [Config File Formats](#config-file-formats)
2. [Top-Level Settings](#top-level-settings)
3. [Build Settings](#build-settings)
4. [URL Settings](#url-settings)
5. [Markup Settings](#markup-settings)
6. [Imaging](#imaging)
7. [Caches](#caches)
8. [Security](#security)
9. [Minify](#minify)
10. [Menus](#menus)

## Config File Formats

Hugo accepts `hugo.toml`, `hugo.yaml`, `hugo.json`, or the legacy `config.toml`/`config.yml`/`config.json`. You can also split config into a `config/` directory:

```
config/
├── _default/
│   ├── hugo.toml
│   ├── menus.toml
│   └── params.toml
└── production/
    └── hugo.toml
```

Environment-specific config overrides the default.

## Top-Level Settings

| Key | Default | Description |
|-----|---------|-------------|
| `baseURL` | `""` | Absolute URL of published site |
| `title` | `""` | Site title |
| `theme` | `""` | Theme name(s) |
| `languageCode` | `""` | RFC 5646 language tag |
| `copyright` | `""` | Copyright notice |
| `paginate` | `10` | Default pagination size |
| `summaryLength` | `70` | Word count for auto summaries |
| `publishDir` | `"public"` | Output directory |
| `contentDir` | `"content"` | Content source directory |
| `layoutDir` | `"layouts"` | Layout source directory |
| `staticDir` | `"static"` | Static files directory |
| `assetDir` | `"assets"` | Asset pipeline source |
| `dataDir` | `"data"` | Data files directory |
| `themesDir` | `"themes"` | Themes directory |
| `archetypeDir` | `"archetypes"` | Archetype templates |
| `environment` | `"production"` / `"development"` | Build environment |
| `enableEmoji` | `false` | Enable emoji shortcodes |
| `enableGitInfo` | `false` | Use git for lastmod dates |
| `enableRobotsTXT` | `false` | Generate robots.txt |
| `disableKinds` | `[]` | Disable page kinds: `404`, `home`, `page`, `rss`, `section`, `sitemap`, `taxonomy`, `term` |

## Build Settings

```yaml
build:
  writeStats: false        # Write hugo_stats.json (useful for PurgeCSS)
  noJSConfigInAssets: false
  useResourceCacheWhen: "fallback"  # "fallback", "always", "never"
```

## URL Settings

```yaml
relativeURLs: false    # Make all URLs relative
canonifyURLs: false    # Prefix all URLs with baseURL
uglyurls: false        # Use /page.html instead of /page/

permalinks:
  posts: "/:year/:month/:title/"
  # Available tokens: :year, :month, :monthname, :day, :weekday,
  # :weekdayname, :yearday, :section, :sections, :title, :slug,
  # :contentbasename, :slugorcontentbasename, :filename
```

## Markup Settings

```yaml
markup:
  goldmark:              # Default Markdown renderer
    renderer:
      unsafe: false      # Allow raw HTML in markdown
    extensions:
      typographer:
        disable: false
      table: true
      strikethrough: true
      linkify: true
      taskList: true
    parser:
      autoHeadingID: true
      autoHeadingIDType: "github"
  highlight:             # Code highlighting (Chroma)
    style: "monokai"
    lineNos: false
    lineNumbersInTable: true
    noClasses: true      # Use inline styles (false = use CSS classes)
    codeFences: true
    guessSyntax: false
    tabWidth: 4
  tableOfContents:
    startLevel: 2
    endLevel: 3
    ordered: false
```

## Imaging

```yaml
imaging:
  quality: 75
  resampleFilter: "Lanczos"
  anchor: "Smart"        # Crop anchor: Smart, Center, TopLeft, etc.
  bgColor: "#ffffff"
  hint: "photo"          # WebP encoding hint: photo, picture, drawing, icon, text
  exif:
    includeFields: ""
    excludeFields: ""
    disableDate: false
    disableLatLong: true
```

## Caches

```yaml
caches:
  assets:
    dir: ":resourceDir/_gen"
    maxAge: -1           # -1 = never expire; 0 = no cache
  getcsv:
    dir: ":cacheDir/:project"
    maxAge: -1
  getjson:
    dir: ":cacheDir/:project"
    maxAge: -1
  getresource:
    dir: ":cacheDir/:project"
    maxAge: -1
  images:
    dir: ":resourceDir/_gen"
    maxAge: -1
  modules:
    dir: ":cacheDir/modules"
    maxAge: -1
```

## Security

```yaml
security:
  enableInlineShortcodes: false
  exec:
    allow: ["^(dart-)?sass(-embedded)?$", "^go$", "^git$", "^npx$", "^postcss$", "^tailwindcss$"]
    osEnv: ["(?i)^(PATH|PATHEXT|APPDATA|TMP|TEMP|TERM|DISPLAY|HOME|LANG|USER)$"]
  funcs:
    getenv: ["^HUGO_", "^CI$"]
  http:
    methods: ["(?i)GET|POST"]
    urls: [".*"]
    mediaTypes: []
```

## Minify

```yaml
minify:
  disableCSS: false
  disableHTML: false
  disableJS: false
  disableJSON: false
  disableSVG: false
  disableXML: false
  minifyOutput: false    # Minify the final output
  tdewolff:
    html:
      keepComments: false
      keepConditionalComments: true
      keepDefaultAttrVals: true
      keepDocumentTags: true
      keepEndTags: true
      keepQuotes: false
      keepWhitespace: false
    css:
      precision: 0
    js:
      precision: 0
      keepVarNames: false
      version: 2022
    json:
      precision: 0
      keepNumbers: false
    svg:
      precision: 0
    xml:
      keepWhitespace: false
```

## Menus

Define navigation menus in config:

```yaml
menus:
  main:
    - name: "Home"
      pageRef: "/"
      weight: 10
    - name: "About"
      pageRef: "/about"
      weight: 20
    - name: "Posts"
      pageRef: "/posts"
      weight: 30
    - name: "External"
      url: "https://example.org"
      weight: 40
      params:
        icon: "external-link"
  footer:
    - name: "Privacy"
      pageRef: "/privacy"
```

Or in content front matter:
```yaml
menus:
  main:
    weight: 10
    parent: "Products"  # Creates submenu
```

Access in templates:
```go-html-template
{{ range .Site.Menus.main }}
  <a href="{{ .URL }}">{{ .Name }}</a>
  {{ if .HasChildren }}
    {{ range .Children }}
      <a href="{{ .URL }}">{{ .Name }}</a>
    {{ end }}
  {{ end }}
{{ end }}
```

## Output Formats & Media Types

```yaml
# Custom output format
outputFormats:
  SearchIndex:
    baseName: "search"
    mediaType: "application/json"

# Which formats each page kind produces
outputs:
  home: ["HTML", "RSS", "SearchIndex"]
  section: ["HTML", "RSS"]
  page: ["HTML"]

# Custom media type
mediaTypes:
  "text/x-custom":
    suffixes: ["custom"]
```

## Sitemap

```yaml
sitemap:
  changeFreq: ""
  disable: false
  filename: "sitemap.xml"
  priority: -1
```

## Taxonomies

```yaml
# Default (implicit)
taxonomies:
  category: categories
  tag: tags

# Custom
taxonomies:
  author: authors
  series: series
  tag: tags
  category: categories

# Disable all taxonomies
disableKinds: ["taxonomy", "term"]
```

## Server (Development)

```yaml
server:
  headers:
    - for: "/**"
      values:
        X-Frame-Options: "DENY"
  redirects:
    - from: "/old/**"
      to: "/new/:splat"
      status: 301
```
